import os
from sqlmodel import create_engine, SQLModel

# 1. On vérifie d'abord si Render nous donne directement l'URL complète
DATABASE_URL = os.getenv("DATABASE_URL")

# 2. Si on n'a pas DATABASE_URL (= on est en local avec Docker)
if not DATABASE_URL:
    POSTGRES_USER = os.getenv("POSTGRES_USER", "user")
    POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "password")
    POSTGRES_DB = os.getenv("POSTGRES_DB", "expense_tracker_db")
    POSTGRES_SERVER = os.getenv("POSTGRES_SERVER", "db")
    POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")
    
    DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}"

# 3. On crée le moteur
engine = create_engine(DATABASE_URL, echo=True)

# 4. La fonction pour créer les tables
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)