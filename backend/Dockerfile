# 1. On part d'une image officielle de Python (version légère 'slim')
FROM python:3.9-slim

# 2. On définit le dossier de travail à l'intérieur du conteneur
WORKDIR /app

# 3. On copie le fichier des dépendances dans le conteneur
COPY requirements.txt .

# 4. On installe les librairies (FastAPI, Uvicorn) DANS le conteneur
RUN pip install --no-cache-dir -r requirements.txt

# 5. On copie tout notre code (main.py) dans le conteneur
COPY . .

# 6. La commande de démarrage
# Note le "0.0.0.0" : c'est OBLIGATOIRE pour que Docker soit accessible depuis l'extérieur
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]