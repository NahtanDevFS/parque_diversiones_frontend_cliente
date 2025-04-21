"use client";

import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from "next/navigation";
import styles from './page.module.css';
import { signup } from '../actions';
import Swal from "sweetalert2";

export default function Registro() {

    //const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para manejar mensajes de error

  const router = useRouter();
  
    useEffect(() => {
      const session = localStorage.getItem("supabaseSession");
      if (session) {
        router.push("/");
      }
    }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    // Validación básica
    if (data.password !== data.confirmPassword) {
      await Swal.fire({
        title: "Error",
        text: "Las contraseñas no coinciden",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    // Enviar datos al servidor
    const {success, message} = await signup(formData); // Ahora devuelve true o false
    if (success) {
      await Swal.fire({
        title: "Registro exitoso",
        text: "Ahora inicia sesión",
        icon: "success",
        confirmButtonText: "Continuar",
      });
      window.location.href = '/login';
    } else {
        await Swal.fire({
          title: "Error",
          text: message ?? "Error desconocido",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title className={styles.head}>Registro de Usuario</title>
      </Head>

      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Registro de Usuario</h1>

        {/* Campo Nombre */}
        <label htmlFor="name">Nombre:</label>
        <input type="text" id="name" name="nombre" required />

        {/* Campo Fecha de Nacimiento */}
        <label htmlFor="birthdate">Fecha de Nacimiento:</label>
        <input type="date" id="birthdate" name="fecha_nacimiento" required />

        {/* Campo Correo Electrónico */}
        <label htmlFor="email">Correo Electrónico:</label>
        <input type="email" id="email" name="email" required />

        {/* Campo Contraseña */}
        <label htmlFor="password">Contraseña:</label>
        <input type="password" id="password" name="password" required />

        {/* Campo Confirmación de Contraseña */}
        <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
        <input type="password" id="confirmPassword" name="confirmPassword" required />

        {/* Campo Teléfono */}
        <label htmlFor="phone">Teléfono:</label>
        <input type="tel" id="phone" name="telefono" pattern="[0-9]{8}" placeholder="Ej: 1234 4567" required />

        {/* Botón de Registro */}
        <div className={styles.buttonContainer}>
          <button type="submit">Registrarse</button>
        </div>

        {/* Enlace para iniciar sesión */}
        <p>
          ¿Ya tienes una cuenta?{' '}
          <a href="/login" className={styles.loginLink}>
            Inicia sesión aquí
          </a>
        </p>
      </form>
    </div>
  );
}
