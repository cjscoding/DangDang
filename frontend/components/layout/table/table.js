import styles from "../../../scss/layout/table.module.scss";

export default function table({ headers, children }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {headers.map((item, index) => {
            return <th key={index}>{item}</th>;
          })}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
