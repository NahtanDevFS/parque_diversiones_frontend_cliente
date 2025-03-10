'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import bcrypt from 'bcryptjs';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { success: false, message: error?.message };
  }

  return { success: true,
    session: authData.session,
    user: authData.user
   };

  // revalidatePath('/', 'layout')
  // redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    nombre: formData.get('nombre') as string,
    fecha_nacimiento: formData.get('fecha_nacimiento') as string,
    telefono: formData.get('telefono') as string,
  }

  // 1️⃣ Registro en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  })

  if (authError || !authData.user) {
    // redirect('/error')
    return { success: false, message: authError?.message };
  }

  // 2️⃣ Obtener ID de usuario generado por Auth
  const userId = authData.user.id

  const hashedPassword = await bcrypt.hash(data.password, 10);

  // 3️⃣ Insertar en la tabla CLIENTE
  const { error: insertError } = await supabase.from('cliente').insert([
    {
      id_cliente: userId, // Asociar con el ID de Auth
      nombre: data.nombre,
      fecha_nacimiento: data.fecha_nacimiento,
      email: data.email,
      contrasena: hashedPassword, // ⚠️ Debes usar hashing antes de guardar la contraseña
      telefono: data.telefono,
      puntos: 0, // Puntos iniciales
    },
  ])

  if (insertError) {
    // redirect('/error')
    console.log('Error en Insert:', insertError)
    return { success: false, message: insertError.message }; // Devolver el mensaje de error
  }

  // 3️⃣ Iniciar sesión automáticamente después del registro
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (signInError) {
    return { success: false, message: "Registro exitoso, pero no se pudo iniciar sesión automáticamente." };
  }

  return { success: true }; // Registro exitoso

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function forgotPassword(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "https://parque-diversiones-frontend-cliente.vercel.app/reset-password", // Cambia esto a tu dominio en producción
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Revisa tu correo para restablecer tu contraseña." };
}


export async function updatePassword(newPassword: string) {
  const supabase = await createClient();

  // Obtener la sesión actual del usuario
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !sessionData.session) {
    return { success: false, message: "Sesión no encontrada. Intenta nuevamente desde el enlace de recuperación." };
  }

  // Actualizar la contraseña del usuario autenticado
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Contraseña actualizada correctamente. Ahora puedes iniciar sesión." };
}

