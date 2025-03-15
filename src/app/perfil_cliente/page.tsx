"use client";

import React, { useEffect, useState } from 'react';
import './perfil_cliente.css';
import { getUserData, logoutUser, updateUserData } from './actions';
//import bcrypt from 'bcryptjs';

const Perfil_page = () => {

  const [user, setUser] = useState({
    nombre: "",
    fecha_nacimiento: "",
    telefono: "",
    contrasena: "",
    email: "",
    puntos: 0,
  });

  const [newPassword, setNewPassword] = useState(""); // Para cambiar la contraseña
  const [loading, setLoading] = useState(false);

  // Cargar datos del usuario desde la BD
  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserData();
      if (userData) {
        setUser(userData);
      }
    };
    fetchUserData();
  }, []);

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Guardar cambios en la BD
  const handleSave = async () => {
    setLoading(true);
    const {success, message} = await updateUserData({ ...user, contrasena: newPassword });
    if (success) {
      alert("Datos actualizados correctamente");
    } else {
      alert(message ?? "Error desconocido");
    }
    setLoading(false);
  };

  // Cerrar sesión (elimina token y recarga la página)
  const handleLogout = () => {
    logoutUser();
    window.location.href = "/";
  };

  return (
    <div className='user_info_page'>
      <h1>Perfil de Usuario</h1>

      <div className='user_info_container'>
        <label className='user_info_label'>Correo Electrónico:</label>
        <input className='user_info_input' type="email" value={user.email} disabled />

        <label className='user_info_label'>Nombre:</label>
        <input className='user_info_input' type="text" name="nombre" value={user.nombre} onChange={handleChange} />

        <label className='user_info_label'>Fecha de Nacimiento:</label>
        <input className='user_info_input' type="date" name="fecha_nacimiento" value={user.fecha_nacimiento} onChange={handleChange} />

        <label className='user_info_label'>Teléfono:</label>
        <input className='user_info_input' type="tel" name="telefono" value={user.telefono} onChange={handleChange} />

        <label className='user_info_label'>Contraseña:</label>
        <input className='user_info_input' type="password" value={user.contrasena} onChange={handleChange} disabled />

        <label className='user_info_label'>Nueva Contraseña:</label>
        <input className='user_info_input' type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

        <label className='user_info_label'>Puntos Acumulados:</label>
        <input className='user_info_input' type="text" value={user.puntos} disabled />

      </div>
      <div className='user_button_container'>
        <button onClick={handleSave} className='user_button_save_changes' disabled={loading}>{loading ? "Guardando..." : "Guardar Cambios"}</button>
        <button onClick={handleLogout} className='user_button_logout'>Cerrar Sesión</button>
      </div>
    </div>
  );
}

export default Perfil_page