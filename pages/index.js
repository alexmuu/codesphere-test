import Head from 'next/head'
import styles from '../styles/Home.module.css'
import WorkspaceList from "../components/WorkspaceList"

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Codesphere Test von Alex</title>
        <meta name="description" content="Created by yours truly <3" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <WorkspaceList />
      </main>
    </div>
  )
}