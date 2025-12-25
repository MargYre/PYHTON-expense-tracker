# Fichier: backend/models.py
from typing import Optional
from sqlmodel import Field, SQLModel

class Expense(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    amount: float
    label: str
    category: str