import qs from 'qs'
import moment from 'moment'
import Link from 'next/link'
import Layout from '@/components/Layout'
import Pagination from '@/components/Pagination'
import { API_URL, PER_PAGE } from '@/static/config'

import styles from '@/styles/QnA.module.scss'

export default function QnA({items, page, total}) {
  return (
    <Layout title='QnA'>
      <div className={styles.table}>
        <dl className={styles.tableHeader}>
        <dd>번호</dd>
        <dd>제목</dd>
        <dd>작성자</dd>
        <dd>작성일</dd>
        </dl>

        <ul>
          {items.map((el) => <li>
            <Link href={`/qna/${el.id}`} key={el.id}>
              <a>
                <dl key={el.id} className={styles.tableRow}>
                  <dd>{el.id}</dd>
                  <dd>{el.attributes.title}{el.attributes.answers.data.length > 0 && el.attributes.answers.data.length}</dd>
                  <dd>{el.attributes.name}</dd>
                  <dd>{moment(el.attributes.createdAt).format('YYYY. MM. DD')}</dd>
                </dl>
              </a>
            </Link>
          </li>)}
        </ul>
      </div>
      <Pagination page={page} total={total} />
    </Layout>
  )
}

export async function getServerSideProps({query: {page = 1}}) {
  // 시작페이지 계산
  const start = +page === 1 ? 0 : (+page -1) * PER_PAGE;

  const query = qs.stringify(
    {sort: 'createdAt:desc',
      pagination: {
        start: start,
        limit: PER_PAGE
      },
      populate: "*"
    }
  )
  const res = await fetch(`${API_URL}/api/questions?${query}`)
  const {data, meta} = await res.json();

  return {
    props: {
      items: data, page: +page, total: meta.pagination.total
    }
  }
}