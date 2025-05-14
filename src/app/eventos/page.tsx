"use client";

import { Event } from "@/components/Event/Event";
import { supabase } from "./actions";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";

interface Evento {
  id_evento: number;
  fecha_evento: string;
  hora_apertura: string;
  hora_cierre: string;
  nombre_evento: string;
  descripcion_evento: string;
  imagen_evento: string;
  lugar: string;    // ← agregamos
  costo: number;    // ← agregamos
}

const Page = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    const fetchEventos = async () => {
      // Como ya usas .select('*'), traerá 'lugar' y 'costo' si existen en la tabla
      const { data, error } = await supabase.from("evento").select("*");
      if (error) console.error(error);
      else setEventos(data || []);
    };
    fetchEventos();
  }, []);

  const calculateStateEvent = (eventDate: string) => {
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    const [year, month, day] = eventDate.split("-").map(Number);
    const fechaEspecifica = new Date(year, month - 1, day);
    fechaEspecifica.setHours(0, 0, 0, 0);

    if (fechaActual < fechaEspecifica) return "Próximamente";
    if (fechaActual.getTime() === fechaEspecifica.getTime()) return "¡Es hoy!";
    return "Ya pasó";
  };

  return (
    <div>
      <div className={styles.eventos_container}>
        {eventos.map((evento) => (
          <Event
            key={evento.id_evento}
            src_img={evento.imagen_evento}
            state={calculateStateEvent(evento.fecha_evento)}
            title={evento.nombre_evento}
            description={evento.descripcion_evento}
            fecha={evento.fecha_evento}
            hora_inicio={evento.hora_apertura}
            hora_final={evento.hora_cierre}
            lugar={evento.lugar}         // ← pasamos lugar
            costo={evento.costo.toString()}         // ← convertimos a string
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
