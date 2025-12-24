import os  # <-- Import standard pour lire le système
from typing import Optional, List
from fastapi import FastAPI
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

# Route pour AJOUTER une dépense
@app.post("/expenses/")
def create_expense(expense: Expense):
    with Session(engine) as session:
        session.add(expense)
        session.commit()
        session.refresh(expense)
        return expense

# Route pour LIRE toutes les dépenses (Bonus pour vérifier)
@app.get("/expenses/", response_model=List[Expense])
def read_expenses():
    with Session(engine) as session:
        expenses = session.exec(select(Expense)).all()
        return expenses