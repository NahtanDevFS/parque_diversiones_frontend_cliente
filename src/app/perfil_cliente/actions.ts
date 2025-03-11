import { createClient } from "@supabase/supabase-js";

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
    password, // Acepta la nueva contraseña
  }: {
    nombre?: string;
    fecha_nacimiento?: string;
    telefono?: string;
    password?: string;
  }) {

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