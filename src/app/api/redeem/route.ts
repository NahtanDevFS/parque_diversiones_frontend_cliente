import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'
import QRCode from 'qrcode'
import nodemailer from 'nodemailer'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(req: Request) {
  try {
    // 1️⃣ Leer y validar JWT de la cabecera
    const auth = req.headers.get('authorization') || ''
    const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : null
    if (!token) {
      return NextResponse.json({ success: false, message: 'No estás autenticado.' }, { status: 401 })
    }

    // 2️⃣ Instanciar Supabase inyectando el token en los headers
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    })

    // 3️⃣ Validar token y obtener user
    const { data: userData, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userData?.user) {
      return NextResponse.json({ success: false, message: 'Token inválido.' }, { status: 401 })
    }
    const userId = userData.user.id

    // 4️⃣ Consultar email y puntos
    const { data: cliente, error: clientErr } = await supabase
      .from('cliente')
      .select('email, puntos')
      .eq('id_cliente', userId)
      .single()
    if (clientErr || !cliente) {
      return NextResponse.json({ success: false, message: 'No se pudo leer datos del cliente.' }, { status: 500 })
    }
    if (cliente.puntos < 50) {
      return NextResponse.json({ success: false, message: 'No tienes suficientes puntos.' }, { status: 400 })
    }

    // 5️⃣ Generar ticket y QR
    const id_ticket = uuidv4()
    const fecha_compra = new Date().toISOString().split('T')[0]
    const qrUrl = await QRCode.toDataURL(id_ticket)
    const qrBase64 = qrUrl.split('base64,')[1]

    // 6️⃣ Insertar en la BD
    const { data: inserted, error: dbErr } = await supabase
      .from('ticket')
      .insert([{
        qr: id_ticket,
        qr_imagen_base64: qrBase64,
        precio: 0,
        fecha_compra,
        tipo_ticket: 'juegos',
        estado: 'disponible',
        id_cliente: userId,
        correo_electronico: cliente.email,
        id_metodo_pago: 3,
        usos: 20,
      }])
    if (dbErr) {
      // devolvemos el mensaje para que lo veas en el cliente
      return NextResponse.json(
        { success: false, message: `Error al guardar ticket: ${dbErr.message}` },
        { status: 500 }
      )
    }

    // 7️⃣ Enviar correo
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
        <p>Sigue comprando para seguir Ganando con Oriente Magico 🎡.</p>
        <p>Tu ticket es válido para 20 usos.</p>
        <p>Uso Exclusivo para Juegos.</p>
        <img src="cid:qrimage" alt="QR Ticket Juegos" width="200" height="200"/>
      `,
      attachments: [{
        filename: 'qr_juegos.png',
        content: qrBase64,
        encoding: 'base64',
        cid: 'qrimage',
      }],
    })

    // 8️⃣ Descontar puntos
    await supabase
      .from('cliente')
      .update({ puntos: cliente.puntos - 50 })
      .eq('id_cliente', userId)

    // 9️⃣ Responder con el UUID
    return NextResponse.json({ success: true, qr: id_ticket })
  } catch (err: any) {
    console.error('Error en POST /api/redeem:', err)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
