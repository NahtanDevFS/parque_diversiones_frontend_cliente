"use client";

import { useState } from "react";
import { updatePassword } from "../actions";
import { useSearchParams } from "next/navigation";
import "./reset_password.css";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { success, message } = await updatePassword(password);
    setMessage(message);
  };

  return (
    <div className="reset_pass_page">
        <div className="reset_pass_container">
            <h1 className="reset_pass_title">Restablecer Contraseña</h1>
            <form onSubmit={handleSubmit}>
                <label className="reset_pass_label" htmlFor="password">Nueva Contraseña:</label>
                <input
                className="reset_pass_input"
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                <div className="reset_pass_button_container">
                    <button className="reset_pass_button" type="submit">Actualizar Contraseña</button>
                </div>
            </form>
            {message && <p>{message}</p>}
        </div>
    </div>
  );
}
