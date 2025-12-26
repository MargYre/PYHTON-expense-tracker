// Ce composant reçoit juste le "total" comme info (props)
function TotalDisplay({ total }) {
  return (
    <div className="total-display">
      Total des dépenses : <span>{total} €</span>
    </div>
  )
}

export default TotalDisplay