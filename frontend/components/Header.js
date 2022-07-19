import navLinks from '@/static/navLinks';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Button from './Button';

import styles from '@/styles/Header.module.scss';


export default function Header() {
  const router = useRouter();

  return (
    <header className={styles.header}>
      <ul className={styles.navLinks}>
        {navLinks.map((nav, idx) => 
          <li key={idx} className={router.pathname === nav.path ? styles.activeNavLink : styles.inactiveNavLink}>
            <Link href={nav.path} >
              <a >{nav.name}</a>
            </Link>
          </li>
        )}
      </ul>
      <div className={styles.logo}><Link href="/"><a>고객센터</a></Link></div>
      <div className={styles.myspace}>
        <Button onClick={() => alert("clicked")}>닉네임 만들기</Button>
      </div>
    </header>
  )
}
