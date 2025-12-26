import { FaTrash } from "react-icons/fa";

// Il reçoit la liste des dépenses (expenses) et la fonction pour supprimer (onDelete)
function ExpenseList({ expenses, onDelete }) {
  return (
    <ul className="expense-list">
      {expenses.map(expense => (
        <li key={expense.id} className="expense-item">
          <span>
            <strong>{expense.label}</strong>
            <span className="expense-category">{expense.category}</span>
          </span>
          
          <div className="expense-actions">
            <span className="expense-amount">{expense.amount} €</span>
            <button 
              className="delete-btn" 
              onClick={() => onDelete(expense.id)}
              title="Supprimer"
            >
              <FaTrash />
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default ExpenseList