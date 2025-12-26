import { useState, useEffect } from 'react'

function ExpenseForm({ onSaveExpense, editingExpense }) {
  const [label, setLabel] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")

  useEffect(() => {
    if (editingExpense) {
      setLabel(editingExpense.label)
      setAmount(editingExpense.amount)
      setCategory(editingExpense.category)
    } else {
      setLabel("")
      setAmount("")
      setCategory("")
    }
  }, [editingExpense])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const expenseData = { 
      id: editingExpense ? editingExpense.id : null,
      label, 
      amount: parseFloat(amount), 
      category 
    }

    onSaveExpense(expenseData)

    if (!editingExpense) {
        setLabel("")
        setAmount("")
        setCategory("")
    } 
  }

  return (
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
      
      <button 
        type="submit" 
        className="submit-btn"
        style={{ backgroundColor: editingExpense ? '#f6ad55' : '#646cff' }}
      >
        {editingExpense ? "Modifier" : "Ajouter"}
      </button>
    </form>
  )
}

export default ExpenseForm