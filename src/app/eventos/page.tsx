"use client";

import { Event } from '@/components/Event/Event';
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';

const Page = () => {

  const [stateEvent, setStateEvent] = useState("");

  useEffect(() => {
    const fechaActual = new Date();
    const fechaEspecifica = new Date("2025-04-15");

    // Convertir ambas fechas a milisegundos para hacer la comparación correctamente
    const actualTime  = fechaActual.setHours(0, 0, 0, 0);
    const specificTime = fechaEspecifica.setHours(0, 0, 0, 0);

    // Comparar fechas
    if (actualTime < specificTime) {
      setStateEvent("Próximamente...");
    } else if (actualTime === specificTime) {
      setStateEvent("¡Es hoy!");
    } else {
      setStateEvent("Pasado");
      console.log(fechaActual);
    }
  }, []);

  return (
    <div>
      <div className={styles.eventos_container}>
        <Event src_img='desfile-hipico.png' state={stateEvent} title='Desfile Hípico' description='Desfile hípico representativo de la cultura de zacapa.'
        fecha='15/04/2025' hora_inicio='15:00' hora_final='17:00'/>
      </div>
    </div>
  )
}

export default Page