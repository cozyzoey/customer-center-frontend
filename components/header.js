import { useContext, useState } from "react";
import navLinks from "@/constants/navLinks";
import Image from "next/image";
import { motion, LayoutGroup } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import Button from "@/components/button";

import AuthContext from "@/context/AuthContext";
import styles from "@/styles/header.module.scss";

export default function Header() {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

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
    setIsDrawerOpen(false);
  };

  const renderDesktopVersion = () => (
    <div className={styles.desktop}>
      {/* 로고 */}
      <div className={styles.logo}>
        <Link href="/">
          <a>
            <Image
              src="/icons/logo.png"
              layout="responsive"
              width={336}
              height={192}
            />
          </a>
        </Link>
      </div>

      {/* 내비게이션 메뉴 */}
      <LayoutGroup id="nav-desktop">
        <nav className={styles.nav}>
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
        </nav>
      </LayoutGroup>

      {/* auth 관련 */}
      <div className={styles.myspace}>
        <div className={styles.auth}>
          {user ? (
            <>
              <div className={styles.authItem}>
                <Image src="/icons/user.svg" width={39} height={39} />
                <span className={styles.username}>{user.username}</span>
              </div>
              <div className={styles.authItem} onClick={handleLogout}>
                <Image src="/icons/lock_open.svg" width={32} height={34} />
                <span>Logout</span>
              </div>
            </>
          ) : (
            <Link href="/auth/login">
              <a className={styles.login}>
                <div className={styles.authItem}>
                  <Image src="/icons/lock_close.svg" width={32} height={34} />
                  <span>Login</span>
                </div>
              </a>
            </Link>
          )}
        </div>
        <div className={styles.consent}>
          <Button onClick={() => router.push("/consent")} size="sm">
            데이터 수집 신청
          </Button>
        </div>
      </div>
    </div>
  );

  const renderMobileVersion = () => (
    <div className={styles.mobile}>
      {/* 로고 */}
      <div className={styles.logo}>
        <Link href="/">
          <a>
            <Image
              src="/icons/logo.png"
              layout="responsive"
              width={336}
              height={192}
            />
          </a>
        </Link>
      </div>

      {/* 햄버거 메뉴 */}
      <div
        className={styles.hamburger}
        data-open={isDrawerOpen}
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Drawer 내비게이션 메뉴 */}
      <div className={styles.drawer}>
        <nav className={styles.nav}>
          <ul className={styles.navLinks}>
            {navLinks.map((nav, idx) => (
              <li key={idx} onClick={() => setIsDrawerOpen(false)}>
                <Link href={nav.path}>
                  <a>{nav.name}</a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* auth 관련 */}
        <div className={styles.myspace}>
          <div
            className={styles.consent}
            onClick={() => {
              router.push("/consent");
              setIsDrawerOpen(false);
            }}
          >
            동의서 제출
          </div>
          <div className={styles.auth}>
            {user ? (
              <>
                <div className={styles.authItem} onClick={handleLogout}>
                  <Image src="/icons/lock_open.svg" width={32} height={34} />
                  <span>Logout</span>
                </div>
              </>
            ) : (
              <Link href="/auth/login">
                <a className={styles.login}>
                  <div
                    className={styles.authItem}
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    <Image src="/icons/lock_close.svg" width={32} height={34} />
                    <span>Login</span>
                  </div>
                </a>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className={styles.myspace}>
        {user && (
          <div className={styles.authItem}>
            <Image src="/icons/user.svg" width={39} height={39} />
            <span className={styles.username}>{user.username}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <header className={styles.header}>
      {renderDesktopVersion()}
      {renderMobileVersion()}
    </header>
  );
}
