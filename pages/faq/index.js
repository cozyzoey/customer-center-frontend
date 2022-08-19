import { useEffect, useState } from "react";
import qs from "qs";
import parse from "html-react-parser";
import { motion, AnimatePresence } from "framer-motion";
import { GrUp } from "react-icons/gr";

import NoDataHeading from "@/components/no-data-heading";
import Pagination from "@/components/pagination";

import { API_URL, PER_PAGE } from "@/static/config";
import Layout from "@/components/layout";
import styles from "@/styles/faq.module.scss";

export default function FAQ({ items, page, total }) {
  const [activeItemId, setActiveItemId] = useState(null);

  // * 페이지가 바뀌면 열린 아이템 닫기
  useEffect(() => {
    setActiveItemId(null);
  }, [page]);

  const handleClickItem = (id) => {
    if (activeItemId !== id) {
      setActiveItemId(id);
    } else {
      setActiveItemId(null);
    }
  };

  const motionVariants = {
    visible: {
      height: "auto",
      transition: { type: "linear" },
    },
    hidden: {
      height: 0,
      transition: { type: "linear" },
    },
  };

  return (
    <Layout title="FAQ">
      <ul className={styles.faq}>
        {items.length === 0 && (
          <NoDataHeading>아직 등록된 FAQ가 없습니다.</NoDataHeading>
        )}
        {items.length > 0 &&
          items.map((item) => (
            <li key={item.id}>
              <dl
                className={styles.title}
                onClick={() => handleClickItem(item.id)}
              >
                <dt>Q</dt>
                <dd>
                  {item.attributes.title}{" "}
                  <GrUp
                    className={styles.arrowIcon}
                    data-active={activeItemId === item.id}
                  />{" "}
                </dd>
              </dl>
              {
                <AnimatePresence>
                  {activeItemId === item.id && (
                    <motion.div
                      variants={motionVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className={styles.contents}
                    >
                      <div>
                        <dt>A</dt>
                        <dd>{parse(item.attributes.contents)}</dd>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              }
            </li>
          ))}
      </ul>
      <Pagination page={page} total={total} pageName="faq" />
    </Layout>
  );
}

export async function getServerSideProps({ query: { page = 1 } }) {
  // 시작페이지 계산
  const start = +page === 1 ? 0 : (+page - 1) * PER_PAGE;

  const query = qs.stringify({
    sort: ["id:desc"],
    pagination: {
      start: start,
      limit: PER_PAGE,
    },
  });
  const res = await fetch(`${API_URL}/api/faqs?${query}`);
  const { data, meta } = await res.json();

  return {
    props: {
      items: data,
      page: +page,
      total: meta.pagination.total,
    },
  };
}
