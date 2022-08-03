import useSWRImmutable from "swr";
import Head from "next/head";
import { motion } from "framer-motion";
import Header from "./header";
import Footer from "./footer";
import { API_URL } from "@/static/config";
import styles from "@/styles/layout.module.scss";

export default function Layout({ title, keywords, description, children }) {
  const { data } = useSWRImmutable(`${API_URL}/api/business`);

  return (
    <div className={styles.layout}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        {/* 화면 확대 차단 */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          key="viewport"
        />
      </Head>

      <Header logo={data?.data?.attributes?.logo || ""} />
      <motion.main
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ ease: "linear", duration: 0.3 }}
      >
        {children}
      </motion.main>
      <Footer logo={data?.data?.attributes?.logo || ""} />
    </div>
  );
}
