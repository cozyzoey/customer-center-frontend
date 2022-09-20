import { useContext } from "react";
import moment from "moment";
import { useRouter } from "next/router";
import { GrAdd } from "react-icons/gr";

import Link from "next/link";
import useFetchPage from "@/hooks/useFetchPage";
import PageTitle from "@/components/page-title";
import NoDataHeading from "@/components/no-data-heading";
import Button from "@/components/button";
import Layout from "@/components/layout";
import Pagination from "@/components/pagination";
import AuthContext from "@/context/AuthContext";

import styles from "@/styles/posts.module.scss";

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
        <PageTitle title="Q&A" />
        {user && (
          <div className={styles.addBtn}>
            <Button
              onClick={() => router.push("/qna/add")}
              align="center"
              variant="outlined"
            >
              <GrAdd size="2ch" />
              작성하기
            </Button>
          </div>
        )}
        <ul className={styles.list}>
          {data?.data.length === 0 && (
            <NoDataHeading>아직 등록된 질문이 없습니다.</NoDataHeading>
          )}
          {data?.data.length > 0 &&
            data.data.map((el) => (
              <li key={el.id}>
                <Link href={`/qna/${el.id}`}>
                  <a>
                    <h4>
                      {el.attributes.title}
                      {el.attributes.answers.data.length > 0 && (
                        <span className={styles.chat}>
                          {el.attributes.answers.data.length}
                        </span>
                      )}
                    </h4>
                    <div className={styles.info}>
                      <span className={styles.username}>
                        {el.attributes.username}
                      </span>
                      <time>
                        {moment(el.attributes.createdAt).format("YYYY. MM. DD")}
                      </time>
                    </div>
                  </a>
                </Link>
              </li>
            ))}
        </ul>
        <Pagination
          page={page}
          total={data.meta.pagination.total}
          pageName="qna"
        />
      </div>
    </Layout>
  );
}
