import moment from "moment";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import useFetchPage from "@/hooks/useFetchPage";
import Button from "@/components/button";
import Layout from "@/components/layout";
import Pagination from "@/components/pagination";
import NoDataHeading from "@/components/no-data-heading";
import Logo from "@/components/responsive-logo-img";

import styles from "@/styles/notice.module.scss";

export default function Home() {
  const router = useRouter();
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
            priority={true}
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
            <Logo />
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.card}>
            <h2>공지사항</h2>
            <div className={styles.cardBody}>
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
          </div>
          <div className={styles.card}>
            <h2>
              서울특별시교육청 – 서울대학교 AI 연구원 공동연구 교육데이터 활용
              사례연구 참여 희망자(학생) 모집
            </h2>
            <div className={styles.cardBody}>
              <Button
                onClick={() => router.push("/consent")}
                variant="blue"
                size="lg"
              >
                학습 데이터 제공 참여 신청
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
