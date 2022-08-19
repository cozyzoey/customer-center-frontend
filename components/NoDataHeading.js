import styles from "@/styles/NoDataHeading.module.scss";

export default function NoDataHeading({ children }) {
  return <h1 className={styles.noDataHeading}>{children}</h1>;
}
