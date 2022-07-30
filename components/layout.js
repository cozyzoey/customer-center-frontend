import useSWR from "swr";
import Head from "next/head";
import Header from "./header";
import Footer from "./footer";
import { API_URL } from "@/static/config";
import { fetcher } from "@/helpers/index";
import styles from "@/styles/Layout.module.scss";

export default function Layout({ title, keywords, description, children }) {
  const { data } = useSWR(`${API_URL}/api/business`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return (
    <div className={styles.layout}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Head>

      <Header logo={data?.data?.attributes?.logo || ""} />

      <main>{children}</main>

      <Footer logo={data?.data?.attributes?.logo || ""} />
    </div>
  );
}