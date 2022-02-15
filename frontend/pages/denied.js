import styles from "../scss/404.module.scss";

export default function PageNotFound() {
  return (
    <div className={styles.container}>
      <img src="/images/dangdang_3.png" />
      <h1>Devices denied</h1>
      <h2>장치 권한 거부를 해제해 주세요</h2>
    </div>
  );
}
