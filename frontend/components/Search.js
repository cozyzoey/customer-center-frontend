import { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/Search.module.scss'

export default function Search() {
  const router = useRouter()
  const [term, setTerm] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    router.push(`/qna?term=${term}`)
    setTerm('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="검색해보세요"
      />
    </form>
  )
}
