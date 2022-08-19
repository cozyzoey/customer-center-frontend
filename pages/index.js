import qs from 'qs'
import moment from 'moment'
import Link from 'next/link'
import Layout from '@/components/Layout'
import Pagination from '@/components/Pagination'
import { API_URL, PER_PAGE } from '@/static/config'

import styles from '@/styles/Home.module.scss'
import tableStyles from '@/styles/shared/Table.module.scss'

export default function Home({ notices, page, total }) {
  return (
    <Layout title="공지사항">
      <div className={tableStyles.table}>
        <dl className={tableStyles.tableHeader}>
          <dd>번호</dd>
          <dd>제목</dd>
          <dd>작성일</dd>
        </dl>

        <ul>
          {notices.map((el) => (
            <li key={el.id} className={tableStyles.tableRow}>
              <Link href={`/${el.id}`}>
                <a>
                  <dl key={el.id}>
                    <dd>{el.id}</dd>
                    <dd>{el.attributes.title}</dd>
                    <dd>
                      {moment(el.attributes.createdAt).format('YYYY. MM. DD')}
                    </dd>
                  </dl>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Pagination page={page} total={total} />
    </Layout>
  )
}

export async function getServerSideProps({ query: { page = 1 } }) {
  // 시작페이지 계산
  const start = +page === 1 ? 0 : (+page - 1) * PER_PAGE

  const query = qs.stringify({
    sort: 'createdAt:desc',
    pagination: {
      start: start,
      limit: PER_PAGE,
    },
  })
  const res = await fetch(`${API_URL}/api/notices?${query}`)
  const { data, meta } = await res.json()

  return {
    props: {
      notices: data,
      page: +page,
      total: meta.pagination.total,
    },
  }
}
