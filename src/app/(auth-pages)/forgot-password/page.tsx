"use client";

import { useState } from "react";
import { forgotPassword } from "../actions";
import './forgot_pass.css'

export default function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { success, message } = await forgotPassword(email);
    if (success) {
      setMessage(message);
    } else {
      setMessage(message);
    }
  };

  return (
    <div className="forgot_pass_page">
      <div className="forgot_pass_container">
        <h1 className="forgot_pass_title">Recuperar Contraseña</h1>
        <form onSubmit={handleSubmit} className="forgot_pass_form">
          <label htmlFor="email" className="forgot_pass_label">Correo Electrónico</label>
          <input
          className="forgot_pass_input"
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="forgot_pass_button_container">
            <button type="submit" className="forgot_pass_button">Enviar Enlace de Restablecimiento</button>
          </div> 
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  )
}
