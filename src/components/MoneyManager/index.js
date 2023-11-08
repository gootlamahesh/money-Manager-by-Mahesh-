import {Component} from 'react'
import {v4 as uuidv4} from 'uuid'

import TransactionItem from '../TransactionItem'
import MoneyDetails from '../MoneyDetails'

import './index.css'

const transactionTypeOptions = [
  {
    optionId: 'INCOME',
    displayText: 'Income',
  },
  {
    optionId: 'EXPENSES',
    displayText: 'Expenses',
  },
]

const getTransactionListFromBrowser = () => {
  const webStoredTransactionList = localStorage.getItem('storedTransaction')
  if (webStoredTransactionList.length !== 0) {
    const initialList = JSON.parse(webStoredTransactionList)
    return initialList
  }
  return []
}

class MoneyManager extends Component {
  state = {
    transactionsList: getTransactionListFromBrowser(),
    titleInput: '',
    amountInput: '',
    optionId: transactionTypeOptions[0].optionId,
    titleErrorMsg: false,
    AmountErrorMsg: false,
  }

  deleteTransaction = id => {
    const {transactionsList} = this.state
    const updatedTransactionList = transactionsList.filter(
      eachTransaction => id !== eachTransaction.id,
    )

    this.setState({
      transactionsList: updatedTransactionList,
    })
  }

  onAddTransaction = event => {
    event.preventDefault()
    const {titleInput, amountInput, optionId} = this.state
    if (titleInput !== '' && amountInput !== '') {
      const typeOption = transactionTypeOptions.find(
        eachTransaction => eachTransaction.optionId === optionId,
      )
      const {displayText} = typeOption
      const newTransaction = {
        id: uuidv4(),
        title: titleInput,
        amount: parseInt(amountInput),
        type: displayText,
      }

      this.setState(prevState => ({
        transactionsList: [...prevState.transactionsList, newTransaction],
        titleInput: '',
        amountInput: '',
        optionId: transactionTypeOptions[0].optionId,
      }))
    } else if (titleInput === '' && amountInput === '') {
      this.setState({titleErrorMsg: true, AmountErrorMsg: true})
      alert('Enter Ttle & Amount')
    } else if (amountInput === '') {
      this.setState({AmountErrorMsg: true})
      alert('Enter Amount')
    } else {
      this.setState({titleErrorMsg: true})
      alert('Enter Title')
    }
  }

  onChangeAmountInput = event => {
    this.setState({amountInput: event.target.value, AmountErrorMsg: false})
  }

  onBlurAmountInput = event => {
    if (event.target.value === '') {
      this.setState({AmountErrorMsg: true})
    }
  }

  onChangeOptionId = event => {
    this.setState({optionId: event.target.value})
  }

  onChangeTitleInput = event => {
    this.setState({titleInput: event.target.value, titleErrorMsg: false})
  }

  onBlurTitleInput = event => {
    if (event.target.value === '') {
      this.setState({titleErrorMsg: true})
    }
  }

  getExpenses = () => {
    const {transactionsList} = this.state
    let expensesAmount = 0

    transactionsList.forEach(eachTransaction => {
      if (eachTransaction.type === transactionTypeOptions[1].displayText) {
        expensesAmount += eachTransaction.amount
      }
    })
    return expensesAmount
  }

  getIncome = () => {
    const {transactionsList} = this.state
    let incomeAmount = 0
    transactionsList.forEach(eachTransaction => {
      if (eachTransaction.type === transactionTypeOptions[0].displayText) {
        incomeAmount += eachTransaction.amount
      }
    })
    return incomeAmount
  }

  getBalance = () => {
    const {transactionsList} = this.state
    let balanceAmount = 0
    let incomeAmount = 0
    let expensesAmount = 0

    transactionsList.forEach(eachTransaction => {
      if (eachTransaction.type === transactionTypeOptions[0].displayText) {
        incomeAmount += eachTransaction.amount
      } else {
        expensesAmount += eachTransaction.amount
      }
    })
    balanceAmount = incomeAmount - expensesAmount

    return balanceAmount
  }

  render() {
    const {
      titleInput,
      amountInput,
      optionId,
      transactionsList,
      titleErrorMsg,
      AmountErrorMsg,
    } = this.state
    const balanceAmount = this.getBalance()
    const incomeAmount = this.getIncome()
    const expensesAmount = this.getExpenses()

    const strTransactionList = JSON.stringify(transactionsList)
    localStorage.setItem('storedTransaction', strTransactionList)

    return (
      <div className="app-container">
        <div className="responsive-container">
          <div className="header-container">
            <h1 className="heading">Hi, Mahesh</h1>
            <p className="header-content">
              Welcome back to your
              <span className="money-manager-text"> Money Manager</span>
            </p>
          </div>
          <MoneyDetails
            balanceAmount={balanceAmount}
            incomeAmount={incomeAmount}
            expensesAmount={expensesAmount}
          />
          <div className="transaction-details">
            <form className="transaction-form" onSubmit={this.onAddTransaction}>
              <h1 className="transaction-header">Add Transaction</h1>
              <>
                <label className="input-label" htmlFor="title">
                  TITLE
                </label>
                <input
                  type="text"
                  id="title"
                  value={titleInput}
                  onChange={this.onChangeTitleInput}
                  onBlur={this.onBlurTitleInput}
                  className="input"
                  placeholder="TITLE"
                />
                {titleErrorMsg && <p className="Error">Required*</p>}
              </>
              <>
                <label className="input-label" htmlFor="amount">
                  AMOUNT
                </label>
                <input
                  type="number"
                  id="amount"
                  className="input"
                  value={amountInput}
                  onChange={this.onChangeAmountInput}
                  onBlur={this.onBlurAmountInput}
                  placeholder="AMOUNT"
                />
                {AmountErrorMsg && <p className="Error">Required*</p>}
              </>
              <>
                <label className="input-label" htmlFor="select">
                  TYPE
                </label>
                <select
                  id="select"
                  className="input"
                  value={optionId}
                  onChange={this.onChangeOptionId}
                >
                  {transactionTypeOptions.map(eachOption => (
                    <option
                      key={eachOption.optionId}
                      value={eachOption.optionId}
                    >
                      {eachOption.displayText}
                    </option>
                  ))}
                </select>
              </>
              <button type="submit" className="button">
                Add
              </button>
            </form>
            <div className="history-transactions">
              <h1 className="transaction-header">History</h1>
              <div className="transaction-table-container">
                {transactionsList.length !== 0 && (
                  <table>
                    <caption>Transactions</caption>
                    <tr>
                      <th>Title</th>
                      <th>Amount</th>
                      <th>Type</th>
                      <th>Action</th>
                    </tr>
                    {transactionsList.map(eachTransaction => (
                      <TransactionItem
                        key={eachTransaction.id}
                        transactionDetails={eachTransaction}
                        deleteTransaction={this.deleteTransaction}
                      />
                    ))}
                  </table>
                )}
                {transactionsList.length === 0 && (
                  <h1>No Transaction Performed Yet</h1>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MoneyManager
