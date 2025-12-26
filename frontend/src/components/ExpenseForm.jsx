import { useState } from 'react'

function ExpenseForm({ onAddExpense }) {
  // Le formulaire gère ses propres états !
  const [label, setLabel] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // On prépare l'objet
    const newExpense = { label, amount: parseFloat(amount), category }
    
    // On l'envoie au parent (App.jsx) via la fonction onAddExpense
    onAddExpense(newExpense)

    // On vide les champs
    setLabel("")
    setAmount("")
    setCategory("")
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
      <button type="submit" className="submit-btn">Ajouter</button>
    </form>
  )
}

export default ExpenseForm