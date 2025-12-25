import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [expenses, setExpenses] = useState([])
  const [label, setLabel] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")

  useEffect(() => {
    fetch('http://localhost:8000/expenses/')
      .then(response => response.json())
      .then(data => setExpenses(data))
      .catch(error => console.error('Erreur:', error))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newExpense = { label, amount: parseFloat(amount), category }

    fetch('http://localhost:8000/expenses/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExpense)
    })
    .then(response => response.json())
    .then(data => {
      setExpenses([...expenses, data])
      setLabel("")
      setAmount("")
      setCategory("")
    })
  }

  return (
    <div className="app-container">
      <h1 className="title">Mon Expense Tracker 💸</h1>

      <form onSubmit={handleSubmit} className="expense-form">
        <input 
          className="input-field"
          placeholder="Quoi ?" 
          value={label}
          onChange={e => setLabel(e.target.value)}
          required
        />
        <input 
          className="input-field"
          type="number" 
          placeholder="Montant (€)" 
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />
        <input 
          className="input-field"
          placeholder="Catégorie" 
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
        />
        <button type="submit" className="submit-btn">Ajouter</button>
      </form>

      <ul className="expense-list">
        {expenses.map(expense => (
          <li key={expense.id} className="expense-item">
            <span>
              <strong>{expense.label}</strong>
              <span className="expense-category">{expense.category}</span>
            </span>
            <span>{expense.amount} €</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App