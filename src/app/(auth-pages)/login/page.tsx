"use client";

import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { login } from "../actions";

export default function LoginPage() {
  //const [isLoggedIn, setIsLoggedIn] = useState(false);
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

    const { success, session, message } = await login(formData);

    if (success) {
      // Guardar sesión en localStorage
      localStorage.setItem("supabaseSession", JSON.stringify(session));
      alert("Inicio de sesión exitoso");
      router.push("/");
    } else {
      alert(message ?? "Error desconocido");
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

        {/* Enlace para recuperar contraseña */}
        <p>
          ¿Olvidaste tu contraseña?{" "}
          <a href="/forgot-password" className={styles.loginLink}>
            Haz clic aquí
          </a>
        </p>
      </form>
    </div>
  );
}
