import qs from "qs";
import { useRouter } from "next/router";
import useSWR from "swr";
import moment from "moment";
import parse from "html-react-parser";
import Layout from "@/components/layout";
import { API_URL } from "@/static/config";
import { fetcher } from "@/helpers/index";
import styles from "@/styles/shared/contents-detail.module.scss";

export default function NoticeDetail() {
  const router = useRouter();
  const query = qs.stringify({
    filters: {
      id: {
        $eq: router.query?.id,
      },
    },
  });
  const { data } = useSWR(`${API_URL}/api/notices?${query}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return (
    <Layout title="공지사항">
      {data && (
        <>
          <h1 className={styles.title}>{data.data[0].attributes.title}</h1>
          <div className={styles.info}>
            <time>
              {moment(data.data[0].attributes.createdAt).format("YYYY. MM. DD")}
            </time>
          </div>
          <div className={styles.divider}>
            <hr />
          </div>
          <div className={styles.contents}>
            {parse(data.data[0].attributes.contents)}
          </div>
        </>
      )}
    </Layout>
  );
}
