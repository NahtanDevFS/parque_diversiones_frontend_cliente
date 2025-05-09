'use client';

import React, { useEffect, useState } from 'react';
import './perfil_cliente.css';
import { getUserData, logoutUser, updateUserData } from './actions';
import QRCode from 'react-qr-code';
import Swal from 'sweetalert2';
import qrLib from 'qrcode';
import { supabase } from '@/utils/supabase/client';

interface User {
  nombre: string;
  fecha_nacimiento: string;
  telefono: string;
  contrasena: string;
  email: string;
  puntos: number;
}

export default function PerfilPage() {
  const [user, setUser] = useState<User>({
    nombre: '',
    fecha_nacimiento: '',
    telefono: '',
    contrasena: '',
    email: '',
    puntos: 0,
  });
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);

  // Carga inicial de datos
  useEffect(() => {
    (async () => {
      const data = await getUserData();
      if (data) setUser(data);
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    const { success, message } = await updateUserData({
      nombre: user.nombre,
      fecha_nacimiento: user.fecha_nacimiento,
      telefono: user.telefono,
      contrasena: newPassword || undefined,
    });
    setLoading(false);

    if (success) {
      Swal.fire('¡Listo!', 'Datos actualizados correctamente.', 'success');
      const updated = await getUserData();
      if (updated) setUser(updated);
      setNewPassword('');
    } else {
      Swal.fire('Error', message || 'No se pudieron actualizar los datos.', 'error');
    }
  };

  const handleLogout = () => {
    logoutUser();
  };

  const handleRedeem = async () => {
    setRedeeming(true);
    setQrCode(null);

    // Obtener JWT actual
    const {
      data: { session },
      error: sessErr,
    } = await supabase.auth.getSession();
    if (sessErr || !session) {
      Swal.fire('Error', 'No estás autenticado.', 'error');
      setRedeeming(false);
      return;
    }
    const token = session.access_token;

    try {
      const res = await fetch('/api/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        // Generar formato de imagen para el QR en el alert
        const qrDataUrl = await qrLib.toDataURL(data.qr);
        Swal.fire({
          title: 'Canje exitoso',
          text: 'Tu ticket gratuito ha sido generado.',
          imageUrl: qrDataUrl,
          imageWidth: 200,
          imageHeight: 200,
          imageAlt: 'Código QR',
        });
        setQrCode(data.qr);
        const updated = await getUserData();
        if (updated) setUser(updated);
      } else {
        Swal.fire('Error', data.message || 'Error al canjear puntos.', 'error');
      }
    } catch {
      Swal.fire('Error', 'Error de red al canjear puntos.', 'error');
    } finally {
      setRedeeming(false);
    }
  };

  const canRedeem = user.puntos >= 50;

  return (
    <div className="user_info_page">
      <h1>Perfil de Usuario</h1>

      <div className="user_info_container">
        <label className="user_info_label">Correo Electrónico:</label>
        <input
          className="user_info_input"
          type="email"
          value={user.email}
          disabled
        />

        <label className="user_info_label">Nombre:</label>
        <input
          className="user_info_input"
          type="text"
          name="nombre"
          value={user.nombre}
          onChange={handleChange}
        />

        <label className="user_info_label">Fecha de Nacimiento:</label>
        <input
          className="user_info_input"
          type="date"
          name="fecha_nacimiento"
          value={user.fecha_nacimiento}
          onChange={handleChange}
        />

        <label className="user_info_label">Teléfono:</label>
        <input
          className="user_info_input"
          type="tel"
          name="telefono"
          value={user.telefono}
          onChange={handleChange}
        />

        <label className="user_info_label">Contraseña Actual:</label>
        <input
          className="user_info_input"
          type="password"
          value={user.contrasena}
          disabled
        />

        <label className="user_info_label">Nueva Contraseña:</label>
        <input
          className="user_info_input"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <label className="user_info_label">Puntos Acumulados:</label>
        <input
          className="user_info_input"
          type="text"
          value={user.puntos}
          disabled
        />
      </div>

      <div className="user_button_container">
        <button
          onClick={handleSave}
          className="user_button_save_changes"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>

        <button
          onClick={handleLogout}
          className="user_button_logout"
        >
          Cerrar Sesión
        </button>

         <button
           onClick={handleRedeem}
           className={`user_button_redeem ${canRedeem ? 'highlight' : ''}`}
           disabled={!canRedeem || redeeming}
         >
           {redeeming ? 'Procesando...' : 'Canjear Puntos'}
       </button>
      </div>

      {qrCode && (
        <div
          className="qr_container"
          style={{
            marginTop: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <h2>Tu Ticket de Juegos</h2>
          <QRCode value={qrCode} size={200} />
        </div>
      )}
    </div>
  );
}
