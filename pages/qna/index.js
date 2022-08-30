import { useContext } from "react";
import moment from "moment";
import { useRouter } from "next/router";

import Link from "next/link";
import useFetchPage from "@/hooks/useFetchPage";
import NoDataHeading from "@/components/no-data-heading";
import Button from "@/components/button";
import Layout from "@/components/layout";
import Pagination from "@/components/pagination";
import AuthContext from "@/context/AuthContext";

import tableStyles from "@/styles/shared/table.module.scss";

export default function QnA() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { data, page } = useFetchPage({
    endpoint: "/api/questions",
    populate: true,
  });

  return (
    <Layout title="QnA">
      <div>
        {data.data.length === 0 && (
          <NoDataHeading>아직 등록된 질문이 없습니다.</NoDataHeading>
        )}
        {user && (
          <Button onClick={() => router.push("/qna/add")} align="right">
            작성하기
          </Button>
        )}
        {data.data.length > 0 && (
          <div className={tableStyles.table} data-nocol={4}>
            <dl className={tableStyles.tableHeader}>
              <dd>번호</dd>
              <dd>제목</dd>
              <dd>작성자</dd>
              <dd>작성일</dd>
            </dl>
            <ul>
              {data.data.map((el) => (
                <li key={el.id} className={tableStyles.tableRow}>
                  <Link href={`/qna/${el.id}`}>
                    <a>
                      <dl>
                        <dd>{el.id}</dd>
                        <dd>
                          {el.attributes.title}
                          {el.attributes.answers.data.length > 0 && (
                            <span className={tableStyles.chat}>
                              {el.attributes.answers.data.length}
                            </span>
                          )}
                        </dd>
                        <dd>{el.attributes.username}</dd>
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
        )}
        <Pagination
          page={page}
          total={data.meta.pagination.total}
          pageName="qna"
        />
      </div>
    </Layout>
  );
}
