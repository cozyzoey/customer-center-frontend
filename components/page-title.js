import React from "react";
import styles from "@/styles/components/page-title.module.scss";

export default function PageTitle({ title = "", children }) {
  return (
    <div className={styles.container}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
