import moment from "moment";
import Link from "next/link";
import useFetchPage from "@/hooks/useFetchPage";
import Layout from "@/components/layout";
import Pagination from "@/components/pagination";
import NoDataHeading from "@/components/no-data-heading";
import tableStyles from "@/styles/shared/table.module.scss";

export default function Home() {
  const { data, page } = useFetchPage({ endpoint: "/api/notices" });

  return (
    <Layout title="공지사항">
      {data?.data.length === 0 && (
        <NoDataHeading>아직 등록된 공지사항이 없습니다.</NoDataHeading>
      )}
      {data?.data.length > 0 && (
        <>
          <div className={tableStyles.table}>
            <dl className={tableStyles.tableHeader}>
              <dd>번호</dd>
              <dd>제목</dd>
              <dd>작성일</dd>
            </dl>
            <ul>
              {data?.data.map((el) => (
                <li key={el.id} className={tableStyles.tableRow}>
                  <Link href={`/notice/${el.id}`}>
                    <a>
                      <dl key={el.id}>
                        <dd>{el.id}</dd>
                        <dd>{el.attributes.title}</dd>
                        <dd>
                          {moment(el.attributes.createdAt).format(
                            "YYYY. MM. DD"
                          )}
                        </dd>
                      </dl>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Pagination page={page} total={data.meta.pagination.total} />
        </>
      )}
    </Layout>
  );
}
