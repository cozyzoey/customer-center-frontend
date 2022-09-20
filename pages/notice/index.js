import moment from "moment";
import { useRouter } from "next/router";

import Link from "next/link";
import useFetchPage from "@/hooks/useFetchPage";
import PageTitle from "@/components/page-title";
import NoDataHeading from "@/components/no-data-heading";
import Layout from "@/components/layout";
import Pagination from "@/components/pagination";

import styles from "@/styles/posts.module.scss";

export default function QnA() {
  const router = useRouter();
  const { data, page } = useFetchPage({
    endpoint: "/api/notices",
  });

  return (
    <Layout title="공지사항">
      <div>
        <PageTitle title="공지사항" />
        <ul className={styles.list}>
          {data?.data.length === 0 && (
            <NoDataHeading>아직 등록된 공지사항이 없습니다.</NoDataHeading>
          )}
          {data?.data.length > 0 &&
            data.data.map((el) => (
              <li key={el.id}>
                <Link href={`/notice/${el.id}`}>
                  <a>
                    <h4>{el.attributes.title}</h4>
                    <time>
                      {moment(el.attributes.createdAt).format("YYYY. MM. DD")}
                    </time>
                  </a>
                </Link>
              </li>
            ))}
        </ul>
        <Pagination
          page={page}
          total={data.meta.pagination.total}
          pageName="공지사항"
        />
      </div>
    </Layout>
  );
}
