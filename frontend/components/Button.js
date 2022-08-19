import classNames from 'classnames'
import styles from '@/styles/Button.module.scss'

export default function Button({children, variant='dark', ...props}) {
  const buttonClass = classNames(styles.button, styles[variant])
  return (
    <button className={buttonClass} {...props}>{children}</button>
  )
}
