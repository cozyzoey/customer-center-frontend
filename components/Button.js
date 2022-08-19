import classNames from 'classnames'
import styles from '@/styles/Button.module.scss'

export default function Button({
  children,
  variant = 'dark',
  float = 'none',
  loading = false,
  disabled = false,
  fullWidth = false,
  ...props
}) {
  const buttonClass = classNames(
    styles.button,
    styles[variant],
    styles[float],
    { [styles.loading]: loading },
    { [styles.disabled]: disabled },
    { [styles.fullWidth]: fullWidth }
  )
  return (
    <button className={buttonClass} disabled={disabled} {...props}>
      {children}
    </button>
  )
}
