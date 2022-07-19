import qs from 'qs'
import moment from 'moment'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { API_URL, PER_PAGE } from '@/static/config'

import styles from '@/styles/Home.module.scss'

export default function Home({notices, page, total}) {
  return (
    <Layout>
      <div className={styles.table}>
        <dl className={styles.tableHeader}>
        <dd>번호</dd>
        <dd>제목</dd>
        <dd>작성일</dd>
        </dl>

        <ul>
          {notices.map((el) => <li>
            <Link href={`/${el.id}`}>
              <a>
                <dl key={el.id} className={styles.tableRow}>
                  <dd>{el.id}</dd>
                  <dd>{el.attributes.title}</dd>
                  <dd>{moment(el.attributes.createdAt).format('YYYY. MM. DD')}</dd>
                </dl>
              </a>
            </Link>
          </li>)}
        </ul>
      </div>
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
  const res = await fetch(`${API_URL}/api/notices?${query}`)
  const {data, meta} = await res.json();

  return {
    props: {
      notices: data, page: +page, total: meta.pagination.total
    }
  }
}