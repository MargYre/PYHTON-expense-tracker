from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# On autorise le React (qui tournera ailleurs) à nous parler
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Expense(BaseModel):
    label: str
    amount: float

fake_db = []

@app.get("/")
def read_root():
    return {"message": "L'API tourne dans Docker ! 🐳"}

@app.get("/expenses")
def get_expenses():
    return fake_db

@app.post("/expenses")
def add_expense(expense: Expense):
    fake_db.append(expense)
    return expense