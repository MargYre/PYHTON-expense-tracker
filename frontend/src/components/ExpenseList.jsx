import { FaTrash, FaPen } from "react-icons/fa"; // N'oublie pas d'importer FaPen

// On ajoute 'onEdit' dans les props reçues
function ExpenseList({ expenses, onDelete, onEdit }) {
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
              style={{ color: '#667eea', marginRight: '5px' }}
              onClick={() => onEdit(expense)}
              title="Modifier"
            >
              <FaPen size={14} />
            </button>

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