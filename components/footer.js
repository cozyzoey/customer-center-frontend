import Link from "next/link";
import styles from "@/styles/footer.module.scss";

export default function Footer({ logo }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>{logo}</div>
      <div className={styles.policies}>
        <span>
          &copy;&nbsp;{new Date().getFullYear()}
          &nbsp;{logo}
        </span>
        <Link href="/policy/terms">
          <a>이용약관</a>
        </Link>
        <Link href="/policy/privacy">
          <a>개인정보 처리방침</a>
        </Link>
      </div>
    </footer>
  );
}
