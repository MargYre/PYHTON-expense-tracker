import os  # <-- Import standard pour lire le système
from typing import Optional, List
from fastapi import FastAPI, HTTPException
from sqlmodel import Field, SQLModel, create_engine, Session, select
from contextlib import asynccontextmanager

# On récupère les variables injectées par Docker
# Si la variable n'existe pas, on met une valeur par défaut (utile pour le dev local sans docker)
POSTGRES_USER = os.getenv("POSTGRES_USER", "user")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "password")
POSTGRES_DB = os.getenv("POSTGRES_DB", "expense_tracker_db")
POSTGRES_SERVER = "db"
POSTGRES_PORT = "5432"


# --- 1. CONFIGURATION ---
# On se connecte au service "db" défini dans docker-compose
# On construit l'URL dynamiquement
DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}"
engine = create_engine(DATABASE_URL, echo=True)

# --- 2. LE MODÈLE (La table) ---
class Expense(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    amount: float
    label: str
    category: str

# --- 3. CRÉATION DE LA DB ---
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Au démarrage de l'app, on crée les tables si elles n'existent pas
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

# --- 4. LES ROUTES (Les URLs) ---

@app.get("/")
def read_root():
    return {"message": "API connectée et prête !"}
# Route pour LIRE toutes les dépenses (Bonus pour vérifier)
@app.get("/expenses/", response_model=List[Expense])
def read_expenses():
    with Session(engine) as session:
        expenses = session.exec(select(Expense)).all()
        return expenses
# Route pour AJOUTER une dépense
@app.post("/expenses/")
def create_expense(expense: Expense):
    with Session(engine) as session:
        session.add(expense)
        session.commit()
        session.refresh(expense)
        return expense
# Route pour MODIFIER une dépense existante
@app.put("/expenses/{expense_id}")
def update_expense(expense_id: int, new_data: Expense):
    with Session(engine) as session:
        # 1. On cherche la dépense originale
        db_expense = session.get(Expense, expense_id)
        
        # 2. Si elle n'existe pas -> Erreur
        if not db_expense:
            raise HTTPException(status_code=404, detail="Dépense introuvable")
            
        # 3. On met à jour les informations
        db_expense.amount = new_data.amount
        db_expense.label = new_data.label
        db_expense.category = new_data.category
        
        # 4. On sauvegarde
        session.add(db_expense)
        session.commit()
        session.refresh(db_expense)
        
        return db_expense   
# Route pour SUPPRIMER une dépense
@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int):
    with Session(engine) as session:
        # 1. On cherche la dépense dans la base
        expense = session.get(Expense, expense_id)
        
        # 2. Si elle n'existe pas, on arrête tout et on envoie une erreur 404
        if not expense:
            raise HTTPException(status_code=404, detail="Dépense introuvable")
            
        # 3. Si elle existe, on la supprime
        session.delete(expense)
        session.commit()
        
        return {"ok": True}
# Route pour avoir le TOTAL (Business Logic)
@app.get("/expenses/total/sum")
def get_total_expenses():
    with Session(engine) as session:
        # On récupère toutes les dépenses
        expenses = session.exec(select(Expense)).all()
        
        # On fait la somme des montants (la logique métier)
        total = sum([e.amount for e in expenses])
        
        return {"total_amount": total, "count": len(expenses)}