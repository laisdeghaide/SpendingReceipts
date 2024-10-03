import styles from "./transactions.module.css"

const data = [
  {
    itemIdentifier: '1217294',
    itemName: 'ETHIOPIAN',
    amount: 17.89,
    date: '08/29/2024'
  },
  {
    itemIdentifier: '1025795',
    itemName: 'KS 5DZ EGGS',
    amount: 13.99,
    date: '08/29/2024'
  },
  {
    itemIdentifier: '1437087',
    itemName: 'BRNBRRY 2/',
    amount: 245.99,
    date: '08/29/2024'
  },
  {
    itemIdentifier: '1729619',
    itemName: 'BULA BEANNIE',
    amount: 16.99,
    date: '09/22/2024'
  },
  {
    itemIdentifier: 'TAX',
    itemName: 'TAX',
    amount: 13.26,
    date: '09/22/2024'
  }
]

const Transactions = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Purchases</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Item Identifier</th>
            <th>Item Name</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.itemIdentifier}</td>
              <td>{transaction.itemName}</td>
              <td>{transaction.amount.toFixed(2)}</td>
              <td>{transaction.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Transactions
