import React from 'react'
import styles from './Attraction.module.css';

interface AttractionProps {
    src_img: string;
    title?: string;
    description?: string;
}

export const Attraction = ({src_img, title, description}: AttractionProps) => {
  return (
    <div className={styles.attraction_container}>
        <div className={styles.attraction_card}>
            <div className={styles.attraction_text_container}>
                <h1 className={styles.attraction_h1}>{title}</h1>
                <p className={styles.attraction_p}>{description}</p>
                <button className={styles.attraction_button} type='button'>Comprar Ticket</button>
            </div>
            <div className={styles.attraction_img_container}>
                <img src={src_img} className={styles.attraction_img} alt="Attraction" />
            </div>
        </div>
    </div>
  )
}
