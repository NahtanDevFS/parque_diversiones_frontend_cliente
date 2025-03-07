import { Event } from '@/components/Event/Event'
import React from 'react'
import styles from './page.module.css';

const page = () => {
  return (
    <div>
      <div className={styles.eventos_container}>
        <Event src_img='desfile-hipico.png' title='Desfile Hípico' description='Desfile hípico representativo de la cultura de zacapa.'
        fecha='15/04/2025' hora_inicio='15:00' hora_final='17:00'/>
      </div>
    </div>
  )
}

export default page