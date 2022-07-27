import { useContext } from "react";
import navLinks from "@/static/navLinks";
import Link from "next/link";
import { useRouter } from "next/router";
import { GrLogout } from "react-icons/gr";

import AuthContext from "@/context/AuthContext";
import Button from "./button";
import styles from "@/styles/header.module.scss";

export default function Header() {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);

  return (
    <header className={styles.header}>
      <ul className={styles.navLinks}>
        {navLinks.map((nav, idx) => (
          <li
            key={idx}
            className={
              router.pathname === nav.path
                ? styles.activeNavLink
                : styles.inactiveNavLink
            }
          >
            <Link href={nav.path}>
              <a>{nav.name}</a>
            </Link>
          </li>
        ))}
      </ul>
      <div className={styles.logo}>
        <Link href="/">
          <a>고객센터</a>
        </Link>
      </div>
      <div className={styles.myspace}>
        <div className={styles.auth}>
          {user ? (
            <>
              {user.username}
              <GrLogout title="로그아웃" onClick={logout} size="2ch" />
            </>
          ) : (
            <Button onClick={() => router.push("/auth/login")} variant="text">
              로그인/회원가입
            </Button>
          )}
        </div>
        <Button onClick={() => alert("hi")} variant="dark">
          동의서 제출하기
        </Button>
      </div>
    </header>
  );
}
