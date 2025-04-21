import React from 'react'
import styles from './Attraction.module.css';
import { useRouter } from "next/navigation";

interface AttractionProps {
    src_img: string;
    title?: string;
    description?: string;
}

export const Attraction = ({src_img, title, description}: AttractionProps) => {
    const router = useRouter();

    const handleClick = () => {
        router.push("/comprar");
    };
    
  return (
    <div className={styles.attraction_container}>
        <div className={styles.attraction_card}>
            <div className={styles.attraction_text_container}>
                <h1 className={styles.attraction_h1}>{title}</h1>
                <p className={styles.attraction_p}>{description}</p>
                <button className={styles.attraction_button} onClick={handleClick} type='button'>Comprar Ticket</button>
            </div>
            <div className={styles.attraction_img_container}>
                <img src={src_img} className={styles.attraction_img} alt="Attraction" />
            </div>
        </div>
    </div>
  )
}
