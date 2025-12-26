import { useState, useEffect } from 'react'
import { FaWallet } from "react-icons/fa";
import './App.scss'

import TotalDisplay from './components/TotalDisplay'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'

function App() {
  const [expenses, setExpenses] = useState([])
  const [total, setTotal] = useState(0)
  
  // 1. NOUVEAU : On stocke la ligne qu'on veut modifier
  const [editingExpense, setEditingExpense] = useState(null)

  const fetchTotal = () => {
    fetch('http://localhost:8000/expenses/total/sum')
      .then(response => response.json())
      .then(data => setTotal(data.total_amount))
      .catch(error => console.error('Erreur total:', error))
  }

  const fetchExpenses = () => {
    fetch('http://localhost:8000/expenses/')
      .then(response => response.json())
      .then(data => setExpenses(data))
      .catch(error => console.error('Erreur:', error))
  }

  useEffect(() => {
    fetchExpenses()
    fetchTotal() 
  }, [])

  // 2. NOUVEAU : Une seule fonction intelligente pour SAUVEGARDER (Ajout OU Modif)
  const handleSaveExpense = (expenseData) => {
    if (expenseData.id) {
      // --- C'EST UNE MODIFICATION (PUT) ---
      fetch(`http://localhost:8000/expenses/${expenseData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData)
      })
      .then(() => {
        // Mise à jour locale rapide
        setExpenses(expenses.map(ex => ex.id === expenseData.id ? expenseData : ex))
        setEditingExpense(null) // On sort du mode édition
        fetchTotal()
      })
      .catch(err => console.error("Erreur update:", err))
    } else {
      // --- C'EST UN AJOUT (POST) ---
      fetch('http://localhost:8000/expenses/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData)
      })
      .then(response => response.json())
      .then(data => {
        setExpenses([...expenses, data])
        fetchTotal()
      })
      .catch(err => console.error("Erreur ajout:", err))
    }
  }

  const handleDelete = (id) => {
    fetch(`http://localhost:8000/expenses/${id}`, {
      method: 'DELETE'
    })
    .then(() => {
      setExpenses(expenses.filter(expense => expense.id !== id))
      fetchTotal()
      // Si on supprimait celle qu'on modifiait, on annule l'édition
      if (editingExpense && editingExpense.id === id) {
        setEditingExpense(null)
      }
    })
  }

  // 3. Quand on clique sur le crayon (vient de ExpenseList)
  const handleEditClick = (expense) => {
    console.log("Mode édition activé pour :", expense)
    setEditingExpense(expense) 
  }

  return (
    <div className="app-container">
      <h1 className="title">
        Mon Expense Tracker <FaWallet style={{ marginLeft: '10px', color: '#667eea' }} />
      </h1>
      
      <TotalDisplay total={total} />

      <ExpenseForm 
        onSaveExpense={handleSaveExpense} 
        editingExpense={editingExpense} 
      />

      <ExpenseList 
        expenses={expenses} 
        onDelete={handleDelete} 
        onEdit={handleEditClick}
      />
    </div>
  )
}

export default App