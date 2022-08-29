import moment from "moment";
import Link from "next/link";
import Image from "next/image";
import useFetchPage from "@/hooks/useFetchPage";
import Layout from "@/components/layout";
import Pagination from "@/components/pagination";
import NoDataHeading from "@/components/no-data-heading";

import styles from "@/styles/notice.module.scss";

export default function Home() {
  const { data, page } = useFetchPage({ endpoint: "/api/notices" });

  return (
    <Layout title="공지사항">
      <div className={styles.notice}>
        <div className={styles.hero}>
          <Image
            alt="공지사항 hero"
            src="https://nia-homepage-media.s3.ap-northeast-2.amazonaws.com/assets/notice_hero.png"
            layout="responsive"
            width={1812}
            height={747}
          />
          <div className={styles.overlay}>
            <Image
              alt="공지사항 hero overlay"
              src="https://nia-homepage-media.s3.ap-northeast-2.amazonaws.com/assets/notice_hero_overlay.png"
              layout="responsive"
              width={1800}
              height={368}
            />
          </div>
          <div className={styles.logo}>
            <Image
              alt="공지사항 hero overlay"
              src="https://nia-homepage-media.s3.ap-northeast-2.amazonaws.com/assets/logo_text.png"
              layout="responsive"
              width={854}
              height={344}
            />
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.list}>
            <h2>공지사항</h2>
            {data?.data.length === 0 && (
              <NoDataHeading>아직 등록된 공지사항이 없습니다.</NoDataHeading>
            )}
            {data?.data.length > 0 && (
              <>
                <ul>
                  {data?.data.map((el) => (
                    <Link href={`/notice/${el.id}`} key={el.id}>
                      <a>
                        <li>
                          <h4>{el.attributes.title}</h4>
                          <div>
                            {el.attributes.contents
                              .replace(/<[^>]+>/g, "")
                              .substring(0, 24)}
                          </div>
                          <time>
                            {moment(el.attributes.createdAt).format(
                              "YYYY. MM. DD"
                            )}
                          </time>
                        </li>
                      </a>
                    </Link>
                  ))}
                </ul>
                <Pagination page={page} total={data.meta.pagination.total} />
              </>
            )}
          </div>
          <div className={styles.video}>
            <h2>포커스팡 튜토리얼</h2>
            <video controls>
              <source
                src="https://nia-homepage-media.s3.ap-northeast-2.amazonaws.com/assets/tutorial_focuspang.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>
      </div>
    </Layout>
  );
}
