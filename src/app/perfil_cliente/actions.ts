import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
//import { createClientServer } from '@/utils/supabase/server'

// Configurar Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Obtener datos del usuario autenticado
export async function getUserData() {
  // Obtener sesión desde localStorage
  const sessionData = localStorage.getItem("supabaseSession");
  if (!sessionData) return null; //si no hay ninguna sesión iniciada retorna un null

  const session = JSON.parse(sessionData);
  const userId = session?.user?.id; // Obtener UID del usuario autenticado

  if (!userId) return null;

  // Consultar la base de datos
  const { data, error } = await supabase
    .from("cliente")
    .select("nombre, fecha_nacimiento, email, contrasena, telefono, puntos")
    .eq("id_cliente", userId)
    .single();

  if (error) {
    console.error("Error obteniendo datos del usuario:", error.message);
    return null;
  }

  return data;
}

export async function updateUserData({
    nombre,
    fecha_nacimiento,
    telefono,
    contrasena, // Acepta la nueva contraseña
  }: {
    nombre?: string;
    fecha_nacimiento?: string;
    telefono?: string;
    contrasena?: string;
  }) {

    const sessionData = localStorage.getItem("supabaseSession");
    if (!sessionData) return { success: false, message: "No hay sesión activa" };

    const session = JSON.parse(sessionData);
    const userId = session?.user?.id;

    if (!userId) return { success: false, message: "Usuario no autenticado" };

    let updatePayload: any = {
      nombre,
      fecha_nacimiento,
      telefono,
      contrasena
    };

    // Si el usuario quiere actualizar su contraseña, la encriptamos
    if (contrasena) {
      //const hashedPassword = await hashPassword(password);
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      updatePayload.contrasena = hashedPassword;
    }

    

    const { error } = await supabase
      .from("cliente")
      .update(updatePayload)
      .eq("id_cliente", userId);

    if (error) {
      console.error("Error actualizando datos:", error.message);
      return { success: false, message: "Error actualizando datos" };
    }

    return { success: true, message: "Datos actualizados correctamente" };

}


// 🔹 Cerrar sesión del usuario
export async function logoutUser() {
    // Eliminar sesión en Supabase
    await supabase.auth.signOut();
  
    // Eliminar sesión del LocalStorage
    localStorage.removeItem("supabaseSession");
  
    // Redirigir al usuario a la página de inicio de sesión
    window.location.href = "/";
}
  
  // 🔹 Función para encriptar la contraseña (simulada, puedes usar bcrypt)
// async function hashPassword(password: string): Promise<string> {
//     // Aquí puedes usar bcrypt en un entorno seguro en el backend
//     return btoa(password); // Simulación con Base64 (NO USAR EN PRODUCCIÓN)
// }