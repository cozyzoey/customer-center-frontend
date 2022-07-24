import qs from 'qs'
import moment from 'moment'
import parse from 'html-react-parser'
import Layout from '@/components/Layout'
import { API_URL } from '@/static/config'
import styles from '@/styles/shared/ContentsDetail.module.scss'

export default function Notice({ notice }) {
  return (
    <Layout title="공지사항">
      <h1 className={styles.title}>{notice.title}</h1>
      <div className={styles.info}>
        <time>{moment(notice.createdAt).format('YYYY. MM. DD')}</time>
      </div>
      <div className={styles.contents}>{parse(notice.contents)}</div>
    </Layout>
  )
}

export async function getStaticPaths() {
  const res = await fetch(`${API_URL}/api/notices`)
  const { data } = await res.json()

  const paths = data.map((el) => ({ params: { id: String(el.id) } }))

  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps({ params: { id } }) {
  const query = qs.stringify({
    filters: {
      id: {
        $eq: id,
      },
    },
  })
  const res = await fetch(`${API_URL}/api/notices?${query}`)
  const { data } = await res.json()
  return {
    props: { notice: data[0].attributes },
    revalidate: 10,
  }
}
