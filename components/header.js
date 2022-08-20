import { useContext, useEffect, useState } from "react";
import navLinks from "@/constants/navLinks";
import { motion, LayoutGroup } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { GrLogout, GrPrevious, GrUser } from "react-icons/gr";

import AuthContext from "@/context/AuthContext";
import styles from "@/styles/header.module.scss";
import Button from "./button";

export default function Header({ logo }) {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    setPageTitle(document.title);
  }, []);

  const isActiveNav = (navPath) => {
    if (navPath === "/") {
      return router.pathname === "/" || router.pathname.includes("notice");
    } else {
      return router.pathname === navPath || router.pathname.includes(navPath);
    }
  };

  const handleLogout = () => {
    const result = confirm("로그아웃 하시겠습니까?");
    if (!result) return;
    logout();
  };

  return (
    <header className={styles.header}>
      <div className={styles.pageTitle}>{pageTitle}</div>
      <LayoutGroup id="nav">
        <ul className={styles.navLinks}>
          {navLinks.map((nav, idx) => (
            <li key={idx}>
              <Link href={nav.path}>
                <a>{nav.name}</a>
              </Link>
              {isActiveNav(nav.path) ? (
                <motion.div
                  layoutId="underline"
                  className={styles.navUnderline}
                  initial={false}
                  animate
                ></motion.div>
              ) : null}
            </li>
          ))}
        </ul>
      </LayoutGroup>
      <div className={styles.logo}>
        <Link href="/">
          <a>{logo} 고객센터</a>
        </Link>
      </div>
      <div className={styles.myspace}>
        <div className={styles.auth}>
          {user ? (
            <>
              <span className={styles.username}>{user.username}</span>
              <GrLogout title="로그아웃" onClick={handleLogout} size="3ch" />
            </>
          ) : (
            <Link href="/auth/login">
              <a className={styles.login}>
                <span>로그인/회원가입</span>
                <GrUser size="3ch" />
              </a>
            </Link>
          )}
          <Button onClick={() => router.push("/consent")}>동의서 제출</Button>
        </div>
      </div>
    </header>
  );
}
