import styles from "@/styles/loader.module.scss";

export default function loader() {
  return (
    <div className={styles.loader}>
      <div className={styles.spinner}></div>
      <h3>Loading</h3>
    </div>
  );
}
