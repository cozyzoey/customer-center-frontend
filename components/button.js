import classNames from "classnames";
import styles from "@/styles/Button.module.scss";

export default function Button({
  children,
  variant = "dark",
  align = "center",
  loading = false,
  disabled = false,
  fullWidth = false,
  ...props
}) {
  const buttonClass = classNames(
    styles.button,
    styles[variant],
    styles[align],
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
