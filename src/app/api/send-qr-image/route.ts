import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'

// Conexión a Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, qr, datos } = body

    if (!email || !qr || !datos) {
      return NextResponse.json({ message: 'Faltan datos' }, { status: 400 })
    }

    const qrBase64 = qr.split('base64,')[1]

    // Guardar en Supabase
    const { error } = await supabase.from('ticket').insert([
      {
        id: datos.id,
        nombre: datos.nombre,
        dpi: datos.dpi,
        tipo: datos.tipo,
        usos: datos.usos,
        precio: datos.precio,
        correo: datos.email,
        fecha_compra: datos.fechaCompra,
        qr_base64: qrBase64,
      },
    ])

    if (error) {
      console.error('Error al guardar en Supabase:', error)
      return NextResponse.json({ message: 'Error al guardar el ticket' }, { status: 500 })
    }

    // Enviar correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: `Oriente Mágico 🎡 <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎟️ Tu ticket para Oriente Mágico',
      html: `
        <h2>¡Gracias por tu compra, ${datos.nombre}!</h2>
        <p><strong>Tipo de ticket:</strong> ${datos.tipo}</p>
        <p><strong>Precio:</strong> Q${datos.precio}</p>
        <p><strong>DPI:</strong> ${datos.dpi}</p>
        <p><strong>Fecha de compra:</strong> ${datos.fechaCompra}</p>
        <p>Presenta este código QR en la entrada:</p>
        <img src="cid:qrimage" alt="Código QR" width="200" height="200" />
        <p>¡Te esperamos en Oriente Mágico! 🎢</p>
      `,
      attachments: [
        {
          filename: 'qr.png',
          content: qrBase64,
          encoding: 'base64',
          cid: 'qrimage',
        },
      ],
    }

    await transporter.sendMail(mailOptions)
    return NextResponse.json({ message: 'Correo enviado y ticket guardado' }, { status: 200 })
  } catch (error) {
    console.error('Error general:', error)
    return NextResponse.json({ message: 'Error interno' }, { status: 500 })
  }
}
