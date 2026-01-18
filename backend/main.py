from typing import List
from fastapi import FastAPI, HTTPException
from sqlmodel import Session, select
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
import os

# --- NOS IMPORTS PERSO ---
from database import engine, create_db_and_tables
from models import Expense

# Liste des origines autorisées
origins = [
    "http://localhost:5173",  # Frontend local
]

# Ajouter l'URL du frontend en production
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

# --- LE CYCLE DE VIE ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # ✅ CORRECTION ICI
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- LES ROUTES ---

@app.get("/")
def read_root():
    return {"message": "API connectée et prête !"}

@app.get("/expenses/", response_model=List[Expense])
def read_expenses():
    with Session(engine) as session:
        expenses = session.exec(select(Expense)).all()
        return expenses

@app.post("/expenses/")
def create_expense(expense: Expense):
    with Session(engine) as session:
        session.add(expense)
        session.commit()
        session.refresh(expense)
        return expense

@app.put("/expenses/{expense_id}")
def update_expense(expense_id: int, new_data: Expense):
    with Session(engine) as session:
        db_expense = session.get(Expense, expense_id)
        if not db_expense:
            raise HTTPException(status_code=404, detail="Dépense introuvable")
        
        db_expense.amount = new_data.amount
        db_expense.label = new_data.label
        db_expense.category = new_data.category
        
        session.add(db_expense)
        session.commit()
        session.refresh(db_expense)
        return db_expense

@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int):
    with Session(engine) as session:
        expense = session.get(Expense, expense_id)
        if not expense:
            raise HTTPException(status_code=404, detail="Dépense introuvable")
        session.delete(expense)
        session.commit()
        return {"ok": True}

@app.get("/expenses/total/sum")
def get_total_expenses():
    with Session(engine) as session:
        expenses = session.exec(select(Expense)).all()
        total = sum([e.amount for e in expenses])
        return {"total_amount": total, "count": len(expenses)}