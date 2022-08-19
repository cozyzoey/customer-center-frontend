import qs from "qs";
import { useRouter } from "next/router";
import moment from "moment";
import parse from "html-react-parser";
import Layout from "@/components/layout";
import Loader from "@/components/loader";
import { API_URL } from "@/static/config";
import styles from "@/styles/shared/contents-detail.module.scss";

export default function NoticeDetail({ notice }) {
  const router = useRouter();

  return (
    <Layout title="공지사항">
      {router.isFallback ? (
        <Loader />
      ) : (
        <>
          <h1 className={styles.title}>{notice.title}</h1>
          <div className={styles.info}>
            <time>{moment(notice.createdAt).format("YYYY. MM. DD")}</time>
          </div>
          <div className={styles.divider}>
            <hr />
          </div>
          <div className={styles.contents}>{parse(notice.contents)}</div>
        </>
      )}
    </Layout>
  );
}

export async function getStaticPaths() {
  const res = await fetch(`${API_URL}/api/notices`);
  const { data } = await res.json();

  const paths = data.map((el) => ({ params: { id: String(el.id) } }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params: { id } }) {
  const query = qs.stringify({
    filters: {
      id: {
        $eq: id,
      },
    },
  });
  const res = await fetch(`${API_URL}/api/notices?${query}`);
  const { data } = await res.json();
  return {
    props: { notice: data[0].attributes },
    revalidate: 60,
  };
}
