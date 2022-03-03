import styles from "../scss/mainComponent.module.scss";
export default function MainComponent({ title, content, menu }) {
  return (
    <section className={styles[menu]}>
      <h2>{title}</h2>
      <p>{content}</p>
    </section>
  );
}
