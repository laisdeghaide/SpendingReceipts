import { MdShoppingBag, MdShoppingCart, MdArrowUpward } from "react-icons/md"
import Card from "../ui/dashboard/card/card"
import Transactions from "../ui/dashboard/transactions/transactions"
import Chart from "../ui/dashboard/chart/chart"
import styles from "../ui/dashboard/dashboard.module.css"
import { fetchReceipts } from "../lib/data"

const Dashboard = async () => {
  const receipts = await fetchReceipts()
  console.log(receipts)
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.cards}>
        <Card cardInfo={{icon: <MdShoppingBag size={24}/>, title: 'Items bought', detail: 80}}/>
        <Card cardInfo={{icon: <MdShoppingCart size={24}/>, title: 'Unique items', detail: 60}}/>
        <Card cardInfo={{icon: <MdArrowUpward size={24}/>, title: 'Popular items', detail: ['meat', 'water', 'cook']}}/>
      </div>
      <Transactions />
      <Chart />
    </div>
  )
}

export default Dashboard