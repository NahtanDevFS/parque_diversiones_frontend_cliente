'use server'

import { v4 as uuidv4 } from 'uuid'
import QRCode from 'qrcode'
import nodemailer from 'nodemailer'
import { supabase } from '@/utils/supabase/client'

export async function comprar(formData: FormData) {
  try {
    // 1. Obtener cliente y normalizar empty string a null
    const rawIdCliente = formData.get('id_cliente') as string | null
    const id_cliente = rawIdCliente && rawIdCliente.trim() !== '' ? rawIdCliente : null
    if (!id_cliente) {
      console.warn('⚠️ Cliente no autenticado; guardando id_cliente = null en la BD')
    }

    // 2. Tipo de ticket y usos
    const tipo = formData.get('tipo_ticket') as string
    const usosPorTipo: Record<string, number | null> = {
      entrada: 1,
      juegos: 20,
      completo: null,
    }
    const usos = usosPorTipo[tipo] ?? null

    // 3. Otros datos del formulario 
    const dpi = formData.get('dpi') as string
    const nombre = formData.get('nombre_completo') as string
    const email = formData.get('email') as string
    const precio = parseFloat(formData.get('precio') as string)
    const tipo_ticket = formData.get('tipo_ticket') as string
    const id_metodo_pago = parseInt(formData.get('metodopago') as string, 10)

    // 4. Generar UUID y fecha
    const id_ticket = uuidv4()
    const fecha_compra = new Date().toISOString().split('T')[0]

        // 6. Generar la imagen QR (base64)
    const qrImageBase64 = await QRCode.toDataURL(id_ticket)
    const qrBase64Only = qrImageBase64.split('base64,')[1]

    // 5. Insertar en Supabase (id_cliente puede ser null)
    const { error: dbError } = await supabase
      .from('ticket')
      .insert([{
        qr: id_ticket,
        qr_imagen_base64: null,
        precio,
        fecha_compra,
        tipo_ticket: tipo_ticket,
        estado: 'disponible',
        id_cliente,  
        correo_electronico: email,       // ahora será null en lugar de ""
        id_metodo_pago,
        usos
      }])

    if (dbError) {
      console.error('❌ Error al insertar en Supabase:', dbError)
      return { success: false, message: 'Error al guardar en la base de datos.' }
    }

    // 7. Actualizar el registro con la imagen base64
    const { error: updError } = await supabase
      .from('ticket')
      .update({ qr_imagen_base64: qrBase64Only })
      .eq('qr', id_ticket)

    if (updError) {
      console.warn('⚠️ No se pudo actualizar la imagen QR en Supabase:', updError)
    }

    // 8. Enviar correo siempre
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })

      await transporter.sendMail({
        from: `Oriente Mágico 🎡 <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🎟️ Tu ticket para Oriente Mágico',
        html: `
          <h2>¡Gracias por tu compra, ${nombre}!</h2>
          <p><strong>Tipo de ticket:</strong> ${tipo}</p>
          <p><strong>Precio:</strong> Q${precio}</p>
          <p><strong>DPI:</strong> ${dpi}</p>
          <p><strong>Fecha de compra:</strong> ${fecha_compra}</p>
          <p>Presenta este código QR para poder acceder a un Mundo Mágico 🎡:</p>
          <img src="cid:qrimage" alt="Código QR" width="200" height="200" />
          <p>¡Te esperamos en Oriente Mágico! 🎢</p>
        `,
        attachments: [{
          filename: 'qr.png',
          content: qrBase64Only,
          encoding: 'base64',
          cid: 'qrimage',
        }],
        
      })

    } catch (mailError: any) {
      console.error('❌ Error al enviar correo:', mailError)
    }

    return { success: true, qr: id_ticket, message: 'Compra exitosa. Se ha enviado al correo electronico el Ticket' }

  } catch (err: any) {
    console.error('❌ Error en la compra:', err)
    return { success: false, message: 'Error interno del servidor.' }
  }
}