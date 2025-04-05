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
  const [userId, setUserId] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const precioUnitario = 50;
  const total = cantidad * precioUnitario;
  const [tarjeta, setTarjeta] = useState({
    numero: '',
    vencimiento: '',
    cvv: '',
    titular: ''
  });

  const [tipoTarjeta, setTipoTarjeta] = useState<string | null>(null);
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

  const formatearNumeroTarjeta = (value: string) => {
    const limpio = value.replace(/\D/g, '').slice(0, 16);
    return limpio.replace(/(.{4})/g, '$1 ').trim();
  };

  const detectarTipoTarjeta = (numero: string) => {
    const prefijos = {
      Visa: /^4/,
      MasterCard: /^5[1-5]/,
      Amex: /^3[47]/,
      Discover: /^6(?:011|5)/,
      Diners: /^3(?:0[0-5]|[68])/,
      JCB: /^(?:2131|1800|35)/,
    };

    for (const [tipo, regex] of Object.entries(prefijos)) {
      if (regex.test(numero)) {
        return tipo;
      }
    }
    return null;
  };

  const handleVencimientoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4); // Solo números, máximo 4 caracteres
  
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
  
    setTarjeta({ ...tarjeta, vencimiento: value });
  };
  

  const handleNumeroTarjetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeroFormateado = formatearNumeroTarjeta(e.target.value);
    setTarjeta({ ...tarjeta, numero: numeroFormateado });
    setTipoTarjeta(detectarTipoTarjeta(numeroFormateado.replace(/\s/g, '')));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    
    formData.append("id_cliente", userId); // Agregar el ID del usuario autenticado
    formData.append("cantidad", cantidad.toString());
    formData.append("precio", total.toString());
    formData.append("metodopago", "1");
    formData.append("numero_tarjeta", tarjeta.numero.replace(/\s/g, ''));
    formData.append("vencimiento", tarjeta.vencimiento);
    formData.append("cvv", tarjeta.cvv);
    formData.append("titular", tarjeta.titular);

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

      <div style={{ marginTop: 20 }}>
        <h1>Datos del comprador</h1>
         <label htmlFor="nombre_completo">Nombre Completo:</label>
          <input
            type="text"
            id="nombre_completo"
            name="nombre_completo"
            placeholder="Juan Pérez"
            required
          />

          <label htmlFor="dpi">DPI:</label>
          <input
            type="text"
            id="dpi"
            name="dpi"
            placeholder="1234567890101"
            required
            maxLength={13}
          />

          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="correo@example.com"
            required
          />
        </div>

        <div style={{ marginTop: 20 }}>
        <h1>Compra de Ticket</h1>

          <label htmlFor="precio">Precio por Ticket (Q):</label>
          <input type="number" id="precio" value={precioUnitario} disabled />

          <label htmlFor="cantidad">Usos del Ticket:</label>
          <input
            type="number"
            id="cantidad"
            name="cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            required
          />

          <label htmlFor="total">Total (Q):</label>
          <input type="number" id="total" value={total} disabled />

          <label htmlFor="tipo_ticket">Tipo de Ticket:</label>
          <select id="tipo_ticket" name="tipo_ticket" required>
            <option value="entrada">Entrada</option>
            <option value="juegos">Juegos</option>
          </select>

        </div>

        <div style={{ marginTop: 20 }}>
        <h1>Datos de Tarjeta</h1>

        <label htmlFor="numero_tarjeta">Número de Tarjeta:</label>
        <input
          type="text"
          id="numero_tarjeta"
          name="numero_tarjeta"
          value={tarjeta.numero}
          onChange={handleNumeroTarjetaChange}
          placeholder="1234 5678 9101 1121"
          required
          maxLength={19}
        />

        <label htmlFor="vencimiento">Fecha de Vencimiento:</label>
        <input
            type="text"
            id="vencimiento"
            name="vencimiento"
            value={tarjeta.vencimiento}
            onChange={handleVencimientoChange}
            placeholder="MM/YY"
            required
            maxLength={5}
          />

        <label htmlFor="cvv">CVV:</label>
        <input
          type="password"
          id="cvv"
          name="cvv"
          value={tarjeta.cvv}
          onChange={(e) => setTarjeta({ ...tarjeta, cvv: e.target.value })}
          placeholder="123"
          required
          maxLength={3}
        />

        <label htmlFor="titular">Nombre del Titular:</label>
        <input
          type="text"
          id="titular"
          name="titular"
          value={tarjeta.titular}
          onChange={(e) => setTarjeta({ ...tarjeta, titular: e.target.value })}
          placeholder="Nombre Apellido"
          required
        />
        </div>

        <div className={styles.buttonContainer}>
          <button type="submit" disabled={loading}>
            {loading ? 'Comprando...' : 'Comprar'}
          </button>
        </div>

        <div style={{ marginTop: 50 }}>
        {qrCode && (
          <div className={styles.qrContainer} >
            <h2>Tu Código QR</h2>
            <QRCode value={qrCode} size={200} />
            <button className={styles.emailButton}>
              Enviar al correo
            </button>
          </div>
        )}
        </div>

      </form>

    </div>
  );
}
