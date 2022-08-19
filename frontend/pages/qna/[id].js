import qs from 'qs'
import moment from 'moment'
import parse from 'html-react-parser'
import { toast } from 'react-toastify'
import Layout from '@/components/Layout'
import Button from '@/components/Button'
import { API_URL } from '@/static/config'
import styles from '@/styles/shared/ContentsDetail.module.scss'

export default function QnADetail({ item, id }) {
  return (
    <Layout title="QnA">
      <h1 className={styles.title}>{item.title}</h1>
      <div className={styles.info}>
        <span>{item.user.data.attributes.username}</span>
        <time>{moment(item.createdAt).format('YYYY. MM. DD')}</time>
      </div>
      <div className={styles.contents}>{parse(item.contents)}</div>
      <Button onClick={() => alert('hi')}>수정하기</Button>
    </Layout>
  )
}

export async function getStaticPaths() {
  const res = await fetch(`${API_URL}/api/questions`)
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
    populate: '*',
  })
  const res = await fetch(`${API_URL}/api/questions?${query}`)
  const { data } = await res.json()
  return {
    props: { item: data[0].attributes, id: data[0].id },
    revalidate: 10,
  }
}
