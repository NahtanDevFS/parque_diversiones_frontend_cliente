"use client";

import React from 'react'
import Head from 'next/head';
import styles from './page.module.css';
import { login } from '../actions';

export default function loginPage() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const {success, message} = await login(formData); // Ahora devuelve true o false
      if (success) {
        alert('Inicio de sesión exitoso');
        // Redirigir a otra página si es necesario
        window.location.href = '/';
      } else {
          alert(message ?? 'error desconcido'); // Establecer el mensaje de error en el estado
      }
    
  };

  return (
    <div className={styles.container}>
      <Head>
        <title className={styles.head}>Inicio de sesión</title>
      </Head>

      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Inicio de sesión</h1>

        {/* Campo Correo Electrónico */}
        <label htmlFor="email">Correo Electrónico:</label>
        <input type="email" id="email" name="email" required />

        {/* Campo Contraseña */}
        <label htmlFor="password">Contraseña:</label>
        <input type="password" id="password" name="password" required />

        {/* Botón de Registro */}
        <div className={styles.buttonContainer}>
            <button type="submit">Iniciar sesión</button>
        </div>

        {/* Enlace para iniciar sesión */}
        <p>
          ¿Olvidaste tu contraseña?{' '}
          <a href="/login" className={styles.loginLink}>
            Haz clic aquí
          </a>
        </p>
      </form>
    </div>
  );
}
