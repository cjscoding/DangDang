import styles from "../scss/404.module.scss";

export default function PageNotFound() {
  return (
    <div className={styles.container}>
      <img src="/images/dangdang_1.png" />
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <h4>해당 페이지는 존재하지 않아요 ㅜ.ㅜ</h4>
    </div>
  );
}
