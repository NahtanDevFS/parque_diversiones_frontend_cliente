"use client";

import React, { useEffect, useState } from 'react'
import { NavbarMenu } from '@/mockData/data';
import styles from '@/components/Navbar/Navbar.module.css';
import { MdMenu, MdAccountCircle, MdClose } from 'react-icons/md';
import ResponsiveMenu from './ResponsiveMenu';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Configurar Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const Navbar = () => {

    const [open, setOpen] = React.useState(false);
    const [user, setUser] = useState<{ name: string, puntos: number } | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        // Obtener sesión del localStorage
        const fetchUserData = async () => {
            const session = localStorage.getItem("supabaseSession");
            if (session) {
                const parsedSession = JSON.parse(session);
                // setUser({ name: parsedSession.user.user_metadata.nombre || "Usuario" });
                // Consultar la base de datos para obtener el nombre del usuario
                const { data, error } = await supabase
                    .from('cliente') // Asegúrate de que este es el nombre correcto de la tabla
                    .select('nombre, puntos')
                    .eq('id_cliente', parsedSession.user.id)
                    .single();

                if (error) {
                    console.error("Error obteniendo usuario:", error);
                    return;
                }

                setUser({ name: data.nombre || "Usuario" , puntos: data.puntos || 0});
            }
        };
        fetchUserData();
    }, []);

    // Detectar el scroll
    useEffect(() => {
        const handleScroll = () => {
        if (window.scrollY > lastScrollY) {
            setIsVisible(false); // Oculta el navbar si baja
        } else {
            setIsVisible(true); // Muestra el navbar si sube
        }
        setLastScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

  return (
    <> 
        <nav className={`${styles.navbar} ${isVisible ? styles.show : styles.hide}`}>
            <div className={styles.container}>
                {/* Logo */}
                <Link href='/' className={styles.logo}>
                    <p>Oriente</p>
                    <p className={styles.logo_text_color}>Magico</p>
                </Link>
                {/* menu */}
                    <div>
                        <ul className={styles.list}>
                            {NavbarMenu.map((item) => (
                                <li key={item.id}>
                                    <Link href={item.link}>{item.title}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                {/* user */}
                <div className={styles.user_container}>
                    {user ? (
                        <Link href='/perfil_cliente' className={styles.user_info}>
                            <span>Bienvenido, {user.name}</span>
                            <MdAccountCircle size={32} className={styles.user_icon} />
                            <span>Tus puntos son: {user.puntos}</span>
                        </Link>
                    ) : (
                        <>
                            <Link href='/login'>
                                <button type='button' className={styles.button}>Iniciar sesión</button>
                            </Link>
                            <Link href='/registro'>
                                <button type='button' className={styles.button}>Registrarme</button>
                            </Link>
                        </>
                    )}
                </div>

                {/* mobile menu button */}
                <div className={styles.mobile_menu}>
                    {open ? 
                        <MdClose onClick={() => setOpen(!open)} /> : <MdMenu onClick={() => setOpen(!open)} />
                    }
                </div>
            </div>
        </nav>

        {/* mobile sidebar */}
        <div className={styles.sidebar}>
            <ResponsiveMenu open={open} onClose={() => setOpen(false)} />
        </div>
    </>
  )
}
