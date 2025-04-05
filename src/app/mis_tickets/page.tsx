import React from 'react'
import styles from './page.module.css';
import Head from 'next/head';
const page = () => {

  return (
    <div className={styles.container}>
      <Head>
        <title className={styles.head}>Mis Tickets</title>
      </Head>
      
    </div>

  )
}

export default page