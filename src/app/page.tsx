"use client";

import { Attraction } from "@/components/Attraction/Attraction";
import styles from "./page.module.css";
import { Button } from "@/components/Button/Button";

export default function Home() {

  const handleClick = () => {
    alert('Botón presionado');
  };

  return (
    <div >
      <main className={styles.main}>
        {/* Section 1 */}
        <div className={styles.section1_container}>
          <img src="/entrance-parque.png" className={styles.welcome_img} alt="Entrance" />
          <div className={styles.card_container}>
            <h1 className={styles.section1_h1}>Bienvenido a Oriente Mágico</h1>
            <h3 className={styles.section1_h3}>!Ven a disfrutar de una experiencia mágica!</h3>
            <p className={styles.section1_p}>Descubre la hermosa cultura oriental de Guatemala en Oriente Mágico, donde cada momento es una nueva aventura con diversión garantizada. Ven y vive experiencias únicas con tus seres queridos.</p>
            <Button text="Comprar Ticket" onClick={handleClick} type="button" />
          </div>
        </div>

        {/* Section 2 */}
        <div className={styles.section2_container}>
          <h1 className={styles.section2_h1}>Planifica Tu Visita</h1>
          <p className={styles.section2_p}>Conoce nuestros horarios y prepárate para una jornada llena de diversión en Oriente Mágico.</p>
          <dl className={styles.section2_dl}>
            <div className={styles.section2_information}><dt><h1>Martes a Domingo</h1></dt><dd><p>Dias de operación</p></dd></div>
            <div className={styles.section2_information}><dt><h1>9:00 AM</h1></dt><dd><p>Hora de apertura</p></dd></div>
            <div className={styles.section2_information}><dt><h1>6:00 PM</h1></dt><dd><p>Hora de Cierre</p></dd></div>
            <div className={styles.section2_information}><dt><h1>5</h1></dt><dd><p>Atracciones disponibles</p></dd></div>
          </dl>
        </div>

        {/* Section 3 */}
        <div className={styles.section3_container}>
          <h1 className={styles.section3_h1}>Atracciones</h1>
          <Attraction src_img="el-cactus-rotador.png" title="El Cactus Rotador" description="Un carrousel que va con la temática cálida y animada del parque de diversions. Disponible para personas de todas las edades. !Compra ya tu ticket!"/>
          <Attraction src_img="el-toro-de-tierra-caliente.png" title="El Toro de Tierra Caliente" description="Un toro mecánico adornado con los colores de la vestimenta típica guatemalteca, para sentirte todo un vaquero zacapaneco. No apto para niños, !Compra ya tu ticket!"/>
          <Attraction src_img="el-trenecito-de-chiquimula.png" title="El Trenecito de Chiquimula" description="Ven y dale una vuelta al parque en el Trenecito de Chiquimula y siente el ambiente de oriente. Disponible para personas de todas las edades, !Compra ya tu ticket!"/>
          <Attraction src_img="los-tuc-tucs-chocones.jpeg" title="Los Tuc-tucs chocones" description="Siéntete parte de la cultura oriental de Guatemala subiéndote a nuestros tuc-tucs chocones, donde podrás disfrutar de gratas experiencias. Los niños con supervisón de un adulto, !Compra ya tu ticket!"/>
          <Attraction src_img="montania-ipala.jpeg" title="La Montaña Ipala" description="¿Eres amante de lo extremo? Entonces tenemos lo ideal para ti, una montaña rusa que va alrededor de una réplica a escala del volcán de Ipala, para que sientas la verdadera adrenalina. No apto para niños, !Compra ya tu ticket!"/>
        </div>
      </main>
      <footer className={styles.footer_container}>
        <h1 className={styles.footer_title}>CONTÁCTANOS</h1>
        <div className={styles.footer}>
          <div className={styles.footer_column}>
            <div className={styles.footer_row}>
              <strong>Horario de Atención:</strong>
              <span>Lunes a Viernes: 8:00 AM - 7:00 PM</span>
            </div>
            <div className={styles.footer_row}>
              <strong>Dirección:</strong>
              <span>4 Calle, Zona 5, Zacapa, Zacapa</span>
            </div>
          </div>
          <div className={styles.footer_column}>
            <div className={styles.footer_row}>
              <strong>Teléfono:</strong>
              <span>+502 4745 8610</span>
            </div>
            <div className={styles.footer_row}>
              <strong>Correo Electrónico:</strong>
              <span>orientemagico@gmail.com</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
