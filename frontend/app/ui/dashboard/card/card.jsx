import styles from "./card.module.css"
const Card = ({ cardInfo }) => {
  return (
    <div className={styles.container}>
      {cardInfo.icon}
      <div className={styles.texts}>
        <span className={styles.title}>{cardInfo.title}</span>
        <span className={styles.detail}>{cardInfo.detail}</span>
      </div>
    </div>
  )
}

export default Card