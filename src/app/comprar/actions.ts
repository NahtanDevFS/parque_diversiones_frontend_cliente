'use server'

import { createClient } from '@/utils/supabase/server'

export async function comprar(formData: FormData) {
  const supabase = await createClient();

  const id_cliente = formData.get("id_cliente") as string; // UUID del cliente
  const precio = formData.get("precio") as string;
  const id_metodo_pago = formData.get("metodopago") as string;

  if (!id_cliente) {
    return { success: false, message: "Error: Usuario no autenticado." };
  }

  // Generar un QR aleatorio para el ticket
  const qrCode = Math.random().toString(36).substring(2, 12);

  const { data, error } = await supabase
    .from("ticket")
    .insert([
      {
        qr: qrCode,
        precio: parseFloat(precio),
        id_cliente,
        id_metodo_pago: parseInt(id_metodo_pago),
      },
    ])
    .select();

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, qr: qrCode };
}
