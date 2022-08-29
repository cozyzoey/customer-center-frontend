import classNames from "classnames";
import styles from "@/styles/button.module.scss";

export default function Button({
  children,
  variant = "yellow",
  align = "center",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  ...props
}) {
  const buttonClass = classNames(
    styles.button,
    styles[variant],
    styles[align],
    styles[size],
    { [styles.loading]: loading },
    { [styles.disabled]: disabled },
    { [styles.fullWidth]: fullWidth }
  );
  return (
    <button className={buttonClass} disabled={disabled} {...props}>
      {loading && <div className={styles.loadingSpinner} />}
      <div className={styles.content}>{children}</div>
    </button>
  );
}
