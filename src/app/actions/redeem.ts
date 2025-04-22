// src/app/actions/redeem.ts
'use server'

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'
import QRCode from 'qrcode'
import nodemailer from 'nodemailer'

export async function redeemPointsServer() {
  // 1) Cliente Supabase con JWT extraído de cookies
  const supabase = createRouteHandlerClient({ cookies })

  // 2) Recuperar sesión / userId
  const {
    data: { session },
    error: sessErr
  } = await supabase.auth.getSession()
  if (sessErr || !session?.user?.id) {
    throw new Error('Usuario no autenticado')
  }
  const userId = session.user.id

  // 3) Obtener email y puntos
  const { data: cliente, error: clientErr } = await supabase
    .from('cliente')
    .select('email, puntos')
    .eq('id_cliente', userId)
    .single()
  if (clientErr || !cliente) {
    throw new Error('No se pudo recuperar datos del cliente')
  }
  if (cliente.puntos < 50) {
    throw new Error('No tienes suficientes puntos para canjear')
  }

  // 4) Generar ticket y QR
  const id_ticket    = uuidv4()
  const fecha_compra = new Date().toISOString().split('T')[0]
  const qrDataUrl    = await QRCode.toDataURL(id_ticket)
  const qrBase64     = qrDataUrl.split('base64,')[1]

  // 5) Insertar ticket
  const { error: dbErr } = await supabase.from('ticket').insert([{
    qr: id_ticket,
    qr_imagen_base64: qrBase64,
    precio: 0,
    fecha_compra,
    tipo_ticket: 'juegos',
    estado: 'disponible',
    id_cliente: userId,
    correo_electronico: cliente.email,
    id_metodo_pago: null,
    usos: 20,
  }])
  if (dbErr) {
    throw new Error('Error al guardar el ticket de canje')
  }

  // 6) Enviar correo
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  })
  await transporter.sendMail({
    from: `Oriente Mágico 🎡 <${process.env.EMAIL_USER}>`,
    to: cliente.email,
    subject: '🎟️ Tu ticket gratuito de juegos',
    html: `
      <h2>¡Felicidades!</h2>
      <p>Has canjeado 50 puntos por un ticket de juegos gratuito.</p>
      <img src="cid:qrimage" alt="QR Ticket Juegos" width="200" height="200"/>
    `,
    attachments: [{
      filename: 'qr_juegos.png',
      content: qrBase64,
      encoding: 'base64',
      cid: 'qrimage',
    }],
  })

  // 7) Descontar puntos
  await supabase
    .from('cliente')
    .update({ puntos: cliente.puntos - 50 })
    .eq('id_cliente', userId)

  // 8) Devolver el UUID para mostrar el QR en el cliente
  return id_ticket
}
