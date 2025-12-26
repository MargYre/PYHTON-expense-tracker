import { useState, useEffect } from 'react'
import { FaWallet } from "react-icons/fa";
import './App.scss'
import TotalDisplay from './components/TotalDisplay'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'

function App() {
  const [expenses, setExpenses] = useState([])
  const [total, setTotal] = useState(0)

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

  const handleAddExpense = (newExpense) => {
    fetch('http://localhost:8000/expenses/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExpense)
    })
    .then(response => response.json())
    .then(data => {
      setExpenses([...expenses, data])
      fetchTotal()
    })
  }

  const handleDelete = (id) => {
    fetch(`http://localhost:8000/expenses/${id}`, {
      method: 'DELETE'
    })
    .then(() => {
      setExpenses(expenses.filter(expense => expense.id !== id))
      fetchTotal()
    })
  }

  return (
    <div className="app-container">
      <h1 className="title">
        Mon Expense Tracker <FaWallet style={{ marginLeft: '10px', color: '#667eea' }} />
      </h1>
      
      <TotalDisplay total={total} />

      <ExpenseForm onAddExpense={handleAddExpense} />

      <ExpenseList expenses={expenses} onDelete={handleDelete} />
    </div>
  )
}

export default App