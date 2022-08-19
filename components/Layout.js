import Head from "next/head";
import Header from "./header";
import Footer from "./footer";
import { API_URL } from "@/static/config";

import styles from "@/styles/Layout.module.scss";

export default function Layout({
  title,
  keywords,
  description,
  children,
  data,
}) {
  console.log(data);
  return (
    <div className={styles.layout}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Head>

      <Header />

      <main>{children}</main>

      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch(`${API_URL}/api/business`);
  const { data, meta } = await res.json();

  return {
    props: {
      data,
    },
  };
}
