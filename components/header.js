import { useContext, useEffect, useState } from "react";
import navLinks from "@/static/navLinks";
import { motion, LayoutGroup } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { GrLogout, GrPrevious } from "react-icons/gr";

import AuthContext from "@/context/AuthContext";
import styles from "@/styles/header.module.scss";

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

  return (
    <header className={styles.header}>
      <div className={styles.prevBtn}>
        <GrPrevious size="3ch" onClick={() => router.back()} />
      </div>
      <div className={styles.pageTitle}>{pageTitle}</div>
      <LayoutGroup id="nav">
        <motion.ul className={styles.navLinks}>
          {navLinks.map((nav, idx) => (
            <motion.li key={idx}>
              <Link href={nav.path}>
                <a>{nav.name}</a>
              </Link>
              {isActiveNav(nav.path) ? (
                <motion.div
                  layoutId="underline"
                  className={styles.navUnderline}
                  animate
                ></motion.div>
              ) : null}
            </motion.li>
          ))}
        </motion.ul>
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
              {user.username}
              <GrLogout title="로그아웃" onClick={logout} size="3ch" />
            </>
          ) : (
            <Link href="/auth/login">
              <a>로그인/회원가입</a>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
