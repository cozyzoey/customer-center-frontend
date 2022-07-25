import { useContext, useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '@/components/Layout'
import AuthContext from '@/context/AuthContext'
import { toast } from 'react-toastify'
import Button from '@/components/Button'
import styles from '@/styles/shared/Auth.module.scss'

export default function register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  const { register, error } = useContext(AuthContext)

  useEffect(() => {
    error && toast.error(error)
  }, [error])

  const handleSubmit = (e) => {
    e.preventDefault()
    register({ email, password, usernmae })
  }

  return (
    <Layout title="로그인/회원가입">
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h1>회원가입하기</h1>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="이름을 입력하세요"
          />
          <Button type="submit" fullWidth={true} variant="outlined">
            가입하기
          </Button>
          {/* <Link href="/auth/register">
            <a>아직 회원이 아니신가요?</a>
          </Link> */}
          {/* <Link href="">
            <a>비밀번호를 잊어버리셨나요?</a>
          </Link> */}
        </form>
      </div>
    </Layout>
  )
}
