import styles from "../scss/mainComponent.module.scss";
export default function MainComponent({ content }) {
  return <section className={styles.container}>{content}</section>;
}
