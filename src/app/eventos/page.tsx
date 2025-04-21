"use client";

import { Event } from '@/components/Event/Event';
import { supabase } from './actions';
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';

interface Evento {
  id_evento: number;
  fecha_evento: string;
  hora_apertura: string;
  hora_cierre: string;
  nombre_evento: string;
  descripcion_evento: string;
  imagen_evento: string;
}

const Page = () => {


  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    const fetchEventos = async () => {
      const { data, error } = await supabase.from('evento').select('*');
      if (error) console.error(error);
      else setEventos(data || []);
    };
    fetchEventos();
  }, []);

  const calculateStateEvent = (eventDate: string) => {

    // Crear fecha actual en la zona horaria local
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0); // Establecer hora a medianoche local

    // Convertir la fecha del evento a la zona horaria local
    const [year, month, day] = eventDate.split('-').map(Number);
    const fechaEspecifica = new Date(year, month - 1, day); // Los meses en JS son 0-based
    fechaEspecifica.setHours(0, 0, 0, 0); // Asegurar medianoche local

    console.log("Fecha actual:", fechaActual);
    console.log("Fecha evento:", fechaEspecifica);

    if (fechaActual < fechaEspecifica) {
      return "Próximamente";
    } else if (fechaActual.getTime() === fechaEspecifica.getTime()) {
      return "¡Es hoy!";
    } else {
      return "Ya pasó";
    }
  }


  return (
    <div>
      <div className={styles.eventos_container}>
        {eventos?.map((evento) => (
          <Event key={evento.id_evento} src_img={evento.imagen_evento} state={calculateStateEvent(evento.fecha_evento)} title={evento.nombre_evento} description={evento.descripcion_evento}
          fecha={evento.fecha_evento} hora_inicio={evento.hora_apertura} hora_final={evento.hora_cierre}/>
        ))}
      </div>
    </div>
  )
}

export default Page