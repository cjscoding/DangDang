import styles from "../../scss/layout/button.module.scss";
export default function Button({ text }) {
  return <button className={styles.button}>{text}</button>;
}
