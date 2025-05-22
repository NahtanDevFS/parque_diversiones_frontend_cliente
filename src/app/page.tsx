"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { Attraction } from "@/components/Attraction/Attraction";
import { Button } from "@/components/Button/Button";
import styles from "./page.module.css";

interface Atraccion {
  id_atraccion: number;
  nombre: string;
  descripcion_atraccion: string;
  juego_foto: string;
  estado_atraccion: "Funcional" | "Mantenimiento" | string;
  tiempo_reparacion: string | null;
}

export default function Home() {
  const [atracciones, setAtracciones] = useState<Atraccion[]>([]);
  const [countdowns, setCountdowns] = useState<Record<number, string>>({});
  const router = useRouter();

  // Carga de atracciones Funcional + Mantenimiento
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("atraccion")
        .select(
          "id_atraccion, nombre, descripcion_atraccion, juego_foto, estado_atraccion, tiempo_reparacion"
        )
        .in("estado_atraccion", ["Funcional", "Mantenimiento"]);
      if (error) {
        console.error("Error cargando atracciones:", error.message);
      } else {
        setAtracciones(data as Atraccion[]);
      }
    }
    load();
  }, []);

  // Contador para mantenimiento
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const nextCounts: Record<number, string> = {};

      atracciones.forEach((a) => {
        if (a.estado_atraccion === "Mantenimiento" && a.tiempo_reparacion) {
          const target = new Date(a.tiempo_reparacion).getTime();
          const diff = target - now;
          if (diff <= 0) {
            nextCounts[a.id_atraccion] = "Disponible pronto";
          } else {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
              (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            nextCounts[a.id_atraccion] = `${days}d ${hours} h`;
          }
        }
      });

      setCountdowns(nextCounts);
    }, 1000);

    return () => clearInterval(interval);
  }, [atracciones]);

  const disponibles = atracciones.filter((a) => a.estado_atraccion === "Funcional");
  const enMantenimiento = atracciones.filter(
    (a) => a.estado_atraccion === "Mantenimiento"
  );

  const handleComprar = () => {
    router.push("/comprar");
  };

  return (
    <div>
      <main className={styles.main}>
        {/* Section 1 */}
        <div className={styles.section1_container}>
          <img
            src="/entrance-parque.png"
            className={styles.welcome_img}
            alt="Entrada"
          />
          <div className={styles.card_container}>
            <h1 className={styles.section1_h1}>Bienvenido a Oriente Mágico</h1>
            <h3 className={styles.section1_h3}>
              ¡Ven a disfrutar de una experiencia mágica!
            </h3>
            <p className={styles.section1_p}>
              Descubre la hermosa cultura oriental de Guatemala en Oriente
              Mágico, donde cada momento es una nueva aventura con diversión
              garantizada.
            </p>
            <Button text="Comprar Ticket" onClick={handleComprar} type="button" />
          </div>
        </div>

        {/* Section 2 */}
        <div className={styles.section2_container}>
          <h1 className={styles.section2_h1}>Planifica Tu Visita</h1>
          <p className={styles.section2_p}>
            Conoce nuestros horarios y prepárate para una jornada llena de
            diversión en Oriente Mágico.
          </p>
          <dl className={styles.section2_dl}>
            <div className={styles.section2_information}>
              <dt>
                <h1>Martes a Domingo</h1>
              </dt>
              <dd>
                <p>Días de operación</p>
              </dd>
            </div>
            <div className={styles.section2_information}>
              <dt>
                <h1>9:00 AM</h1>
              </dt>
              <dd>
                <p>Hora de apertura</p>
              </dd>
            </div>
            <div className={styles.section2_information}>
              <dt>
                <h1>6:00 PM</h1>
              </dt>
              <dd>
                <p>Hora de cierre</p>
              </dd>
            </div>
            <div className={styles.section2_information}>
              <dt>
                {/* Conteo de Funcional + Mantenimiento */}
                <h1>{disponibles.length + enMantenimiento.length}</h1>
              </dt>
              <dd>
                <p>Atracciones en el Parque</p>
              </dd>
            </div>
          </dl>
        </div>

              {/* Section 3 */}
      <section className={styles.section3_container}>
        <h1 className={styles.section3_h1}>Atracciones</h1>
        <div className={styles.attractionGrid}>
          {/* 1) Disponibles */}
          {disponibles.map((a) => (
            <Attraction
              key={a.id_atraccion}
              src_img={a.juego_foto}
              title={a.nombre}
              description={a.descripcion_atraccion}
              showButton={true}  
            />
          ))}

          {/* 2) En Mantenimiento (reutilizamos la misma card) */}
          {enMantenimiento.map((a) => (
              <Attraction
                key={a.id_atraccion}
                src_img={a.juego_foto}
                title={`${a.nombre} (Fuera de Servicio)`}
                // @ts-expect-error — validamos que la siguiente línea pueda fallar
                description={
                  <>
                    Estara Disponible en:   
                    <span style={{ color: "red" }}>
                      {"  " + (countdowns[a.id_atraccion] ?? "Calculando...")}
                    </span>
                  </>
                }
                showButton={false}
              />
            ))}
        </div>
      </section>
      </main>

      {/* Footer */}
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
