"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Head from 'next/head';
import { comprar } from './actions';
import Swal from 'sweetalert2';
import { supabase } from '@/utils/supabase/client';

export default function Comprar() {
  const router = useRouter();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [showPointsNotif, setShowPointsNotif] = useState(false);

  // Precios por tipo de ticket
  const precios: Record<string, number> = {
    entrada: 50,
    juegos: 80,
    completo: 120,
  };
  const [tipoTicket, setTipoTicket] = useState<string>('entrada');
  const [precioUnitario, setPrecioUnitario] = useState<number>(precios['entrada']);
  const total = cantidad * precioUnitario;

  // Datos de tarjeta
  const [tarjeta, setTarjeta] = useState({
    numero: '',
    vencimiento: '',
    cvv: '',
    titular: ''
  });
  const [cardType, setCardType] = useState<string>('');

  useEffect(() => {
    const session = localStorage.getItem("supabaseSession");
    if (session) {
      const parsed = JSON.parse(session);
      const id = parsed.user.id;
      setUserId(id);

      // comprobar puntos
      (async () => {
        const { data, error } = await supabase
          .from('cliente')
          .select('puntos')
          .eq('id_cliente', id)
          .single();
        if (!error && data?.puntos >= 50) {
          setShowPointsNotif(true);
        }
      })();
    } else {
      Swal.fire({
        title: "Aviso",
        text: "Necesitas crear una cuenta para comprar tickets",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }
  }, []);

  // Formatea y detecta tipo de tarjeta
  const formatearNumeroTarjeta = (value: string) => {
    const limpio = value.replace(/\D/g, '').slice(0, 16);
    // detectar tipo
    if (/^4/.test(limpio)) setCardType('VISA');
    else if (/^(5[1-5]|2[2-7])/.test(limpio)) setCardType('MASTERCARD');
    else if (/^3[47]/.test(limpio)) setCardType('AMERICAN EXPRESS');
    else setCardType('');
    return limpio.replace(/(.{4})/g, '$1 ').trim();
  };

  // Maneja cambio de número
  const handleNumeroTarjetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTarjeta({ ...tarjeta, numero: formatearNumeroTarjeta(e.target.value) });
  };

  // Maneja cambio de vencimiento
  const handleVencimientoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
    setTarjeta({ ...tarjeta, vencimiento: v });
  };

  // Valida fecha de vencimiento no caducada
  const isExpirationValid = (mmYY: string): boolean => {
    if (!/^\d{2}\/\d{2}$/.test(mmYY)) return false;
    const [mm, yy] = mmYY.split('/').map((s) => parseInt(s, 10));
    if (mm < 1 || mm > 12) return false;
    const year = 2000 + yy;
    // último día del mes
    const expDate = new Date(year, mm, 0, 23, 59, 59);
    return expDate >= new Date();
  };

  // Otros manejadores
  const handleTipoTicketChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tipo = e.target.value;
    setTipoTicket(tipo);
    setPrecioUnitario(precios[tipo] ?? precios['entrada']);
  };
  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10) || 1;
    setCantidad(val < 1 ? 1 : val);
  };
  const handleNotifClick = () => router.push('/perfil_cliente');
  const handleCloseNotif = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowPointsNotif(false);
  };

  // Envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      Swal.fire("Error", "Necesitas crear una cuenta para comprar tickets", "error");
      return;
    }
    // validar tarjeta
    const numDigits = tarjeta.numero.replace(/\s/g, '');
    if (!/^\d{13,16}$/.test(numDigits)) {
      Swal.fire("Error", "Número de tarjeta inválido", "error");
      return;
    }
    if (!cardType) {
      Swal.fire("Error", "No se reconoce el tipo de tarjeta", "error");
      return;
    }
    if (!isExpirationValid(tarjeta.vencimiento)) {
      Swal.fire("Error", "Fecha de vencimiento inválida o vencida", "error");
      return;
    }
    if (!/^\d{3,4}$/.test(tarjeta.cvv)) {
      Swal.fire("Error", "CVV inválido", "error");
      return;
    }

    // confirmación
    const form = e.currentTarget;
    const email = form.email.value;
    const { isConfirmed } = await Swal.fire({
      title: '¿Confirmar compra?',
      html: `
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Tipo:</strong> ${tipoTicket}</p>
        <p><strong>Cantidad:</strong> ${cantidad}</p>
        <p><strong>Total:</strong> Q${total}</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, comprar',
      cancelButtonText: 'Cancelar',
    });
    if (!isConfirmed) return;

    // proceso de compra
    setLoading(true);
    const formData = new FormData(form);
    formData.append("id_cliente", userId);
    formData.append("cantidad", cantidad.toString());
    formData.append("precio", precioUnitario.toString());
    formData.append("metodopago", "1");
    formData.append("numero_tarjeta", numDigits);
    formData.append("vencimiento", tarjeta.vencimiento);
    formData.append("cvv", tarjeta.cvv);
    formData.append("titular", tarjeta.titular);
    formData.append("tipo_ticket", tipoTicket);
    formData.append("total", total.toString());

    const { success, qrs: qr, message } = await comprar(formData);
    setLoading(false);

    if (success) {
      setQrCode(qr ? JSON.stringify(qr) : null);
      Swal.fire("¡Listo!", "El correo con tu código QR se ha enviado correctamente.", "success");
      router.push('/mis_tickets');
    } else {
      Swal.fire("Error", message ?? "Ocurrió un problema al procesar tu compra.", "error");
    }
  };

  // Descripciones de ticket
  const ticketDescriptions: Record<string, string> = {
    entrada: 'Este ticket de Entrada te permite el acceso general al parque una vez.',
    juegos: 'El ticket de Juegos incluye 20 juegos seleccionados dentro del parque.',
    completo: 'El ticket Completo ofrece la entrada y el acceso ilimitado y todos los juegos disponibles.',
  };
  const getTicketInfo = (tipo: string) => ticketDescriptions[tipo] || '';

  return (
    <div className={styles.container}>
      {showPointsNotif && (
        <div className={styles.pointsNotif} onClick={handleNotifClick}>
          <span>¡Ya puedes canjear tus puntos por un ticket!</span>
          <button className={styles.closeButton} onClick={handleCloseNotif}>×</button>
        </div>
      )}

      <Head><title>Compra de Ticket</title></Head>

      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Datos del comprador</h1>
        <label htmlFor="nombre_completo">Nombre Completo:</label>
        <input type="text" id="nombre_completo" name="nombre_completo" placeholder="Juan Pérez" required />

        <label htmlFor="dpi">DPI:</label>
        <input type="text" id="dpi" name="dpi" placeholder="1234567890101" required maxLength={13} />

        <label htmlFor="email">Correo Electrónico:</label>
        <input type="email" id="email" name="email" placeholder="correo@example.com" required />

        <h1>Compra de Ticket</h1>
        <label htmlFor="tipo_ticket">Tipo de Ticket:</label>
        <select id="tipo_ticket" name="tipo_ticket" value={tipoTicket} onChange={handleTipoTicketChange} required>
          <option value="entrada">Entrada</option>
          <option value="juegos">Juegos</option>
          <option value="completo">Completo</option>
        </select>
        <p className={styles.ticketInfo}>{getTicketInfo(tipoTicket)}</p>

        <label htmlFor="precio">Precio Unitario (Q):</label>
        <input type="number" id="precio" value={precioUnitario} disabled />

        <label htmlFor="cantidad">Cantidad de Tickets:</label>
        <input type="number" id="cantidad" name="cantidad" value={cantidad} onChange={handleCantidadChange} min={1} required />

        <label htmlFor="total">Total (Q):</label>
        <input type="number" id="total" value={total} disabled />

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
        {cardType && <p className={styles.cardType}>Tipo de tarjeta: {cardType}</p>}

        <label htmlFor="vencimiento">Fecha de Vencimiento (MM/YY):</label>
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
          maxLength={4}
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

        <div className={styles.buttonContainer}>
          <button type="submit" disabled={loading}>
            {loading ? 'Comprando...' : 'Comprar'}
          </button>
        </div>
      </form>
    </div>
  );
}
