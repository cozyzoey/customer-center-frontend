import useSWR from "swr";
import Head from "next/head";
import Header from "./header";
import Footer from "./footer";
import { API_URL } from "@/static/config";
import { fetcher } from "@/helpers/index";
import styles from "@/styles/layout.module.scss";

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
        {/* 화면 확대 차단 */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          key="viewport"
        />
      </Head>

      <Header logo={data?.data?.attributes?.logo || ""} />

      <main>{children}</main>

      <Footer logo={data?.data?.attributes?.logo || ""} />
    </div>
  );
}
