// Write your code here
import './index.css'

const TransactionItem = props => {
  const {transactionDetails, deleteTransaction} = props
  const {id, title, amount, type} = transactionDetails

  const onDeleteTransaction = () => {
    deleteTransaction(id)
  }

  return (
    <tr>
      <td>{title}</td>
      <td>Rs {amount}</td>
      <td>{type}</td>
      <td>
        <div className="delete-container">
          <button
            className="delete-button"
            type="button"
            onClick={onDeleteTransaction}
            data-testid="delete"
          >
            <img
              src="https://assets.ccbp.in/frontend/react-js/money-manager/delete.png"
              className="delete-img"
              alt="delete"
            />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default TransactionItem
