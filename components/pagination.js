import { useRouter } from "next/router";
import classNames from "classnames";
import { GrPrevious, GrNext } from "react-icons/gr";
import { PER_PAGE } from "@/constants/config";
import styles from "@/styles/pagination.module.scss";

export default function Pagination({ page, total, pageName = "", perPage }) {
  const ADJUSTED_PER_PAGE = perPage || PER_PAGE;
  const router = useRouter();
  const lastPage = Math.ceil(total / ADJUSTED_PER_PAGE);

  const handleLinkClick = (clickedPage) => {
    if (Number.isInteger(clickedPage)) {
      router.push(`/${!!pageName ? pageName + "/" : ""}?page=${clickedPage}`);
    }
  };

  const pagesToShow =
    lastPage > 3
      ? parseInt(page) === 1
        ? [1, 2, 3]
        : [page - 1, +page, page + 1]
      : Array.from({ length: lastPage }, (_, i) => i + 1);

  const handlePrevClick = () => {
    if (parseInt(page) === 1) return;

    router.push(
      `/${!!pageName ? pageName + "/" : ""}?page=${parseInt(page) - 1}`
    );
  };

  const handleNextClick = () => {
    if (lastPage === parseInt(page)) return;

    router.push(
      `/${!!pageName ? pageName + "/" : ""}?page=${parseInt(page) + 1}`
    );
  };

  return (
    <ul className={styles.pagination}>
      <div
        className={classNames(styles.btn, {
          [styles.inactiveBtn]: parseInt(page) === 1,
        })}
        onClick={handlePrevClick}
      >
        <GrPrevious size="26px" />
      </div>
      {pagesToShow.map((el) => (
        <li
          onClick={() => handleLinkClick(el)}
          key={el}
          className={classNames(styles.paginationLink, {
            [styles.activeLink]: parseInt(page) === el,
          })}
        >
          {el}
        </li>
      ))}
      <div
        className={classNames(styles.btn, {
          [styles.inactiveBtn]: parseInt(page) === lastPage,
        })}
        onClick={handleNextClick}
      >
        <GrNext size="26px" />
      </div>
    </ul>
  );
}
