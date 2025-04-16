// app/mis_tickets/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import "./mis_tickets.css";

type Ticket = {
  id_ticket: number;
  precio: string;
  fecha_compra: string;
  estado: string;
  id_cliente: string;
  id_metodo_pago: number | null;
  usos: number;
  qr_imagen_base64: string | null;
  qr: string;
  tipo_ticket: string;
  correo_electronico: string;
  fecha_vencimiento: string;
};

export default function MisTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Ticket | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("supabaseSession");
    if (!stored) {
      setLoading(false);
      return;
    }
    const session = JSON.parse(stored);
    const userId: string = session.user.id;

    supabase
      .from("ticket")
      .select("*")
      .eq("id_cliente", userId)
      .then(({ data, error }) => {
        if (error) console.error("Error obteniendo los tickets:", error);
        else if (data) setTickets(data as Ticket[]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="mis_tickets_page">
        <p>Cargando tus tickets…</p>
      </div>
    );
  }

  return (
    <div className="mis_tickets_page">
      <div className="mis_tickets_container">
        <h1>Historial de compra de tickets</h1>

        {tickets.length > 0 ? (
          <ul className="ticket_list">
            {tickets.map((ticket) => (
              <li
                key={ticket.id_ticket}
                className="ticket_card"
                onClick={() => setSelected(ticket)}
                style={{ cursor: "pointer" }}
              >
                {ticket.qr_imagen_base64 && (
                  <div className="ticket_qr">
                    <img
                      src={`data:image/png;base64,${ticket.qr_imagen_base64}`}
                      alt="Código QR"
                      className="qr_image"
                    />
                  </div>
                )}
                <div className="ticket_info">
                  <p><strong>ID:</strong> {ticket.id_ticket}</p>
                  <p><strong>Tipo:</strong> {ticket.tipo_ticket}</p>
                  <p><strong>Precio:</strong> Q{ticket.precio}</p>
                  <p>
                    <strong>Estado:</strong>{" "}
                    <span
                      className={
                        ticket.estado.toLowerCase() === "disponible"
                          ? "estado_disponible"
                          : "estado_agotado_usado"
                      }
                    >
                      {ticket.estado}
                    </span>
                  </p>
                  <p>
                    <strong>Comprado:</strong>{" "}
                    {new Date(ticket.fecha_compra).toLocaleDateString("es-GT")}
                  </p>
                  <p><strong>Usos:</strong> {ticket.usos}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tienes tickets asociados.</p>
        )}
      </div>

      {/* Modal Overlay */}
      {selected && (
        <div
          className="modal-overlay"
          onClick={() => setSelected(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-button"
              onClick={() => setSelected(null)}
            >
              &times;
            </button>

            {/* QR ampliado */}
            {selected.qr_imagen_base64 && (
              <img
                src={`data:image/png;base64,${selected.qr_imagen_base64}`}
                alt="QR ampliado"
                className="modal-qr-image"
              />
            )}

            {/* Info detallada */}
            <div className="modal-ticket-info">
              <p><strong>ID:</strong> {selected.id_ticket}</p>
              <p><strong>Tipo:</strong> {selected.tipo_ticket}</p>
              <p><strong>Precio:</strong> Q{selected.precio}</p>
              <p><strong>Estado:</strong> <span
                      className={
                        selected.estado.toLowerCase() === "disponible"
                          ? "estado_disponible"
                          : "estado_agotado_usado"
                      }
                    >
                      {selected.estado}
                    </span></p>
              <p>
                <strong>Comprado:</strong>{" "}
                {new Date(selected.fecha_compra).toLocaleDateString("es-GT")}
              </p>
              {/*<p>
                <strong>Vence:</strong>{" "}
                {new Date(selected.fecha_vencimiento).toLocaleDateString("es-GT")}
              </p>*/}
              <p><strong>Usos restantes:</strong> {selected.usos}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
