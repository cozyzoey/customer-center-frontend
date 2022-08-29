import { useEffect, useState } from "react";
import parse from "html-react-parser";
import { motion, AnimatePresence } from "framer-motion";
import { GrUp } from "react-icons/gr";
import useFetchPage from "@/hooks/useFetchPage";

import Layout from "@/components/layout";
import NoDataHeading from "@/components/no-data-heading";
import Pagination from "@/components/pagination";

import styles from "@/styles/faq.module.scss";

export default function FAQ() {
  const [activeItemId, setActiveItemId] = useState(null);
  const { data, page } = useFetchPage({ endpoint: "/api/faqs" });

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
      <div>
        <ul className={styles.faq}>
          {data.data.length === 0 && (
            <NoDataHeading>아직 등록된 FAQ가 없습니다.</NoDataHeading>
          )}
          {data.data.length > 0 &&
            data.data.map((item) => (
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
        <Pagination
          page={page}
          total={data.meta.pagination.total}
          pageName="faq"
        />
      </div>
    </Layout>
  );
}
