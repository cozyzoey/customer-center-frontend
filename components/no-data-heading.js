import styles from "@/styles/no-data-heading.module.scss";

export default function NoDataHeading({ children }) {
  return <h1 className={styles.noDataHeading}>{children}</h1>;
}
