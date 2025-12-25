# 💸 Expense Tracker (Fullstack)

![Aperçu de l'application](expenses_tracker_screen.png)

Une application complète pour gérer ses dépenses personnelles, construite avec **Python (FastAPI)** et **React**.
Le projet utilise **Docker** pour orchestrer la base de données et le backend.

## 🚀 Fonctionnalités

* **Ajouter** une dépense (Label, Montant, Catégorie).
* **Visualiser** la liste des dépenses.
* **Calcul Automatique** du total des dépenses.
* **Supprimer** une dépense.
* Persistance des données (PostgreSQL).

## 🛠️ Stack Technique

* **Backend** : Python, FastAPI, SQLModel (ORM).
* **Database** : PostgreSQL.
* **Frontend** : React, Vite, CSS moderne.
* **Infrastructure** : Docker & Docker Compose.

## 📦 Comment lancer le projet ?

1.  **Cloner le projet**
    ```bash
    git clone [https://github.com/MargYre/PYHTON-expense-tracker.git](https://github.com/MargYre/PYHTON-expense-tracker.git)
    cd PYHTON-expense-tracker
    ```

2.  **Lancer le Backend & la Base de données (Docker)**
    ```bash
    cd backend
    docker-compose up -d
    ```
    *L'API sera accessible sur : http://localhost:8000/docs*

3.  **Lancer le Frontend (React)**
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```
    *L'application sera accessible sur : http://localhost:5173*