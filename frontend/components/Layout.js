import Head from "next/head"
import Header from "./Header"
import Footer from "./Footer"

import styles from '@/styles/Layout.module.scss'

export default function Layout({title, keywords, description, children}) {
  return (
    <div className={styles.layout}>
        <Head>
          <title>{title}</title>
          <meta name='description' content={description} />
          <meta name='keywords' content={keywords} />
        </Head>    

        <Header />

        <main>{children}</main>
        
        <Footer />
    </div>
  )
}
