import styles from "../../scss/layout/button.module.scss";
export default function Button({ text, onClick }) {
  return (
    <button className={styles.button} onClick={onClick}>
      {text}
    </button>
  );
}
