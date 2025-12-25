import os
from sqlmodel import create_engine, SQLModel

# 1. On récupère les secrets (Environment Variables)
POSTGRES_USER = os.getenv("POSTGRES_USER", "user")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "password")
POSTGRES_DB = os.getenv("POSTGRES_DB", "expense_tracker_db")
POSTGRES_SERVER = "db"
POSTGRES_PORT = "5432"

# 2. On fabrique l'adresse de connexion
DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}"

# 3. On crée le moteur (le démarreur)
engine = create_engine(DATABASE_URL, echo=True)

# 4. La fonction pour créer les tables
# On la met ici car elle a besoin de "engine" qui est juste au-dessus
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)