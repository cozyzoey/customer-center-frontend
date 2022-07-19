import {useState} from 'react';
import qs from 'qs'
import parse from 'html-react-parser';
import {motion, AnimatePresence} from 'framer-motion'
import { API_URL, PER_PAGE } from "@/static/config";
import Layout from "@/components/Layout";
import styles from '@/styles/FAQ.module.scss'

export default function FAQ({items}) {
  const [activeItemId, setActiveItemId] = useState(null)

  const handleClickItem = (id) => {
    if(activeItemId !== id) {
      setActiveItemId(id)
    } else {
      setActiveItemId(null)
    }
  }

  const motionVariants = {
    visible: {
      height: 'auto',
      transition: {type: 'linear'}
    }, 
    hidden: {
      height: 0,
      transition: {type: 'linear'}
    }
  }

  return (
    <Layout title='FAQ'>
      <ul>
        {items.map(item => 
          <li onClick={() => handleClickItem(item.id)} key={item.id}>
            <dl><dt>Q</dt><dd>{item.attributes.title}</dd></dl>
          {<AnimatePresence>{activeItemId === item.id && <motion.div className={styles.contents} variants={motionVariants} initial='hidden' animate='visible' exit='hidden'>{parse(item.attributes.contents)}</motion.div>}</AnimatePresence> }
          </li>)
        }
      </ul>

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
      }
    }
  )
  const res = await fetch(`${API_URL}/api/faqs?${query}`)
  const {data, meta} = await res.json();

  return {
    props: {
      items: data, page: +page, total: meta.pagination.total
    }
  }
}