import { useRouter } from "next/router";
import classNames from "classnames";
import { PER_PAGE } from "@/static/config"
import styles from '@/styles/Pagination.module.scss';

export default function Pagination({page, total, pageName = ''}) {
  const router = useRouter()
  const lastPage = Math.ceil(total/PER_PAGE);
  const NO_LINKS_TO_SHOW = 5;

  const handleLinkClick = (clickedPage) => {
    if(Number.isInteger(clickedPage)) {
      router.push(`/${!!pageName ? pageName + '/' : ""}?page=${clickedPage}`)
    }
  }

  const pagesToShow = [
      1, page >= NO_LINKS_TO_SHOW ? '···' : 2, page >= NO_LINKS_TO_SHOW ? page === lastPage ? page - 2: page - 1 : 3, page >= NO_LINKS_TO_SHOW ? page === lastPage ? page -1: page : 4, page >= NO_LINKS_TO_SHOW ? page === lastPage ? page : page + 1 : 5
    ]

  if(lastPage === 1) return null;
  return (
    <ul className={styles.pagination}>
      {new Array(Math.min(lastPage, NO_LINKS_TO_SHOW)).fill(0).map((el, idx) => <li onClick={() => handleLinkClick(pagesToShow[idx])} key={idx} className={classNames(
        styles.paginationLink,
        {[styles.activeLink]: page === pagesToShow[idx]})}
      >{pagesToShow[idx]}</li>)}
    </ul>
  )
}
