import qs from 'qs'
import { useContext } from 'react'
import moment from 'moment'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Button from '@/components/Button'
import Layout from '@/components/Layout'
import Pagination from '@/components/Pagination'
import AuthContext from '@/context/AuthContext'

import { API_URL, PER_PAGE } from '@/static/config'

import tableStyles from '@/styles/shared/Table.module.scss'

export default function QnA({ items, page, total }) {
  const router = useRouter()
  const { user } = useContext(AuthContext)

  return (
    <Layout title="QnA">
      {user && (
        <Button onClick={() => router.push('/qna/add')} float="right">
          작성하기
        </Button>
      )}

      <div className={tableStyles.table} data-nocol={4}>
        <dl className={tableStyles.tableHeader}>
          <dd>번호</dd>
          <dd>제목</dd>
          <dd>작성자</dd>
          <dd>작성일</dd>
        </dl>

        <ul>
          {items.map((el) => (
            <li key={el.id} className={tableStyles.tableRow}>
              <Link href={`/qna/${el.id}`}>
                <a>
                  <dl>
                    <dd>{el.id}</dd>
                    <dd>
                      {el.attributes.title}
                      {el.attributes.answers.data.length > 0 &&
                        el.attributes.answers.data.length}
                    </dd>
                    <dd>{el.attributes.user.data.attributes.username}</dd>
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
      <Pagination page={page} total={total} pageName="qna" />
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
    populate: '*',
  })
  const res = await fetch(`${API_URL}/api/questions?${query}`)
  const { data, meta } = await res.json()

  return {
    props: {
      items: data,
      page: +page,
      total: meta.pagination.total,
    },
  }
}
