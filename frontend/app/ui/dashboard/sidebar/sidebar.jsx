import styles from "./sidebar.module.css";
import { MdDashboard, MdAttachMoney } from "react-icons/md";
import MenuLink from "./menuLink";

const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <MdDashboard />,
  },
  {
    title: "Transactions",
    path: "/dashboard/transactions",
    icon: <MdAttachMoney />,
  },
]

const Sidebar = () => {
  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        <span className={styles.category}>Pages</span>
          <ul>
            {menuItems.map((item) => (
              <MenuLink item={item} key={item.title} />
            ))}
          </ul>
      </ul>
    </div>
  );
}

export default Sidebar