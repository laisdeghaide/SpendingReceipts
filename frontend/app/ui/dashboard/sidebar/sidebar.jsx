import styles from "./sidebar.module.css";
import { MdDashboard, MdAttachMoney } from "react-icons/md";
import MenuLink from "./menuLink";

const menuItems = [
  {
    title: "Pages",
    list: [
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
    ],
  },
]

const Sidebar = () => {
  return (
    <div className={styles.container}>
      <ul>
        {menuItems.map((category) => (
          <li key={category.title}>
            <span className={styles.category}>{category.title}</span>
            <ul>
              {category.list.map((item) => (
                <MenuLink item={item} key={item.title} />
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar