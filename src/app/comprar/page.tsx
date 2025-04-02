'use client';

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import Head from 'next/head';
import QRCode from 'react-qr-code';
import { comprar } from './actions';
import { supabase } from '@/utils/supabase/client';

export default function Comprar() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null); // UUID del usuario

  useEffect(() => {
    // Intentar obtener el usuario desde localStorage
    const session = localStorage.getItem("supabaseSession");
    if (session) {
      const parsedSession = JSON.parse(session);
      setUserId(parsedSession?.user?.id || null);
    }
  }, []);

  if (!userId) {
    return <p>Por favor, inicia sesión para comprar un ticket.</p>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    
    formData.append("id_cliente", userId); // Agregar el ID del usuario autenticado

    const { success, qr, message } = await comprar(formData);

    setLoading(false);

    if (success) {
      setQrCode(qr ?? null);
    } else {
      alert(message ?? 'Error desconocido');
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Compra de Ticket</title>
      </Head>

      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Compra de Ticket</h1>

        <label htmlFor="precio">Precio:</label>
        <input type="number" id="precio" name="precio" required />

        <label htmlFor="metodopago">Método de Pago:</label>
        <input type="number" id="metodopago" name="metodopago" required />

        <div className={styles.buttonContainer}>
          <button type="submit" disabled={loading}>
            {loading ? 'Comprando...' : 'Comprar'}
          </button>
        </div>
      </form>

      {qrCode && (
        <div className={styles.qrContainer}>
          <h2>Tu Código QR</h2>
          <QRCode value={qrCode} size={200} />
        </div>
      )}
    </div>
  );
}
