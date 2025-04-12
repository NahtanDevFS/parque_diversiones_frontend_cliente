'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import QRCode from 'qrcode'
import styles from '../eventos/page.module.css'
import { v4 as uuidv4 } from 'uuid'

const Page = () => {
  const [nombre, setNombre] = useState('')
  const [dpi, setDpi] = useState('')
  const [tarjeta, setTarjeta] = useState('')
  const [vencimiento, setVencimiento] = useState('')
  const [cvv, setCvv] = useState('')
  const [tipo, setTipo] = useState('entrada')
  const [email, setEmail] = useState('')
  const [precio, setPrecio] = useState(25)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [sending, setSending] = useState(false)

  const precios = {
    entrada: 25,
    atracciones: 50,
    total: 80,
  }

  const usosPorTipo: Record<string, number | null> = {
    entrada: 1,
    atracciones: 20,
    total: null,
  }

  const handleTipoChange = (value: string) => {
    setTipo(value)
    setPrecio(precios[value as keyof typeof precios])
  }

  const handleSubmit = async () => {
    if (!nombre || !dpi || !tarjeta || !vencimiento || !cvv || !email) {
      return alert('Por favor completa todos los campos')
    }

    const idTicket = uuidv4()
    const qr = await QRCode.toDataURL(idTicket)

    const datos = {
      id: idTicket,
      nombre,
      dpi,
      tarjeta,
      vencimiento,
      cvv,
      tipo,
      usos: usosPorTipo[tipo],
      email,
      precio,
      fechaCompra: new Date().toLocaleString(),
      qrBase64: qr,
    }

    setQrDataUrl(qr)
    setSending(true)

    try {
      const res = await fetch('/api/send-qr-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, qr, datos }),
      })

      const data = await res.json()
      alert(data.message || 'Correo enviado')
    } catch (err) {
      console.error(err)
      alert('Error al enviar el correo')
    } finally {
      setSending(false)
    }
  }

  return (
    <div
      className={styles.eventos_container}
      style={{ paddingTop: '100px' }}
    >
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-700 text-center mb-6">
          Comprar ticket - Envío por correo
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-1 text-sm font-medium">Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Ej: Ana Pérez"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">DPI</label>
            <input
              type="text"
              value={dpi}
              onChange={(e) => setDpi(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Ej: 1234567890101"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Número de tarjeta</label>
            <input
              type="text"
              value={tarjeta}
              onChange={(e) => setTarjeta(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="XXXX-XXXX-XXXX-1234"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Fecha de vencimiento</label>
            <input
              type="month"
              value={vencimiento}
              onChange={(e) => setVencimiento(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">CVV</label>
            <input
              type="password"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="123"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Tipo de ticket</label>
            <select
              value={tipo}
              onChange={(e) => handleTipoChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="entrada">Solo entrada</option>
              <option value="atracciones">Acceso a atracciones</option>
              <option value="total">Acceso total</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="md:col-span-2 text-right text-lg font-semibold text-gray-700">
            Precio: Q{precio}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={sending}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          {sending ? 'Enviando...' : 'Comprar ticket'}
        </button>

        {qrDataUrl && (
          <div className="mt-8 text-center">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">QR generado:</h2>
            <Image src={qrDataUrl} alt="QR" width={200} height={200} className="mx-auto" />
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
