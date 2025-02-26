'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import bcrypt from 'bcryptjs';

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
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
    console.log('Error en Auth:', authError)
    return false;
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
    return false;
  }

  return true;

  revalidatePath('/', 'layout')
  redirect('/')
}
