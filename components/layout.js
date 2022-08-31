import Head from "next/head";
import { motion } from "framer-motion";
import Header from "./header";
import Footer from "./footer";
import styles from "@/styles/layout.module.scss";

export default function Layout({
  title = "청소년 감성 공감 AI 튜터",
  keywords = "",
  description = "",
  children,
}) {
  return (
    <div className={styles.layout}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Head>

      <div className={styles.header}>
        <Header />
      </div>
      <motion.main
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ ease: "linear", duration: 0.3 }}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}
