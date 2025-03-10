import { motion, AnimatePresence } from "motion/react";
import styles from "./Navbar.module.css";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from '@supabase/supabase-js';
import { FaUserCircle } from "react-icons/fa";

interface ResponsiveMenuProps {
  open: boolean;
  onClose: () => void; // Nueva función para cerrar el menú
}

// Configurar Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ResponsiveMenu: React.FC<ResponsiveMenuProps> = ({ open, onClose }) => {

    const [user, setUser] = useState<{ name: string } | null>(null);

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
                    .select('nombre')
                    .eq('id_cliente', parsedSession.user.id)
                    .single();

                if (error) {
                    console.error("Error obteniendo usuario:", error);
                    return;
                }

                setUser({ name: data.nombre || "Usuario" });
            }
        };
        fetchUserData();
    }, []);


    const handleClose = () => {
        onClose(); // Llama a la función para cerrar el menú
    };

  return (
    <AnimatePresence mode="wait">
        {open && (
            <motion.div initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0}}
            exit={{ opacity: 0, y: -100 }}
            className={styles.responsive_menu}>
                <div className={styles.responsive_menu_container}>
                    <ul className={styles.responsive_list}>
                        <li>
                            <Link href="/" onClick={handleClose}>Inicio</Link>
                        </li>
                        <li>
                            <Link href="/comprar" onClick={handleClose}>Comprar tickets</Link>
                        </li>
                        <li>
                            <Link href="/mis_tickets" onClick={handleClose}>Mis tickets</Link>
                        </li>
                        <li>
                            <Link href="/eventos" onClick={handleClose}>Eventos</Link>
                        </li>
                        {user ? (
                            // Si hay sesión, mostrar icono y nombre
                            <li>
                                <Link href="/perfil_cliente" onClick={handleClose} className={styles.user_info}>
                                    <FaUserCircle size={32} />
                                    <span>{user.name}</span>
                                </Link>
                            </li>
                        ) : (
                            // Si no hay sesión, mostrar botones de Login y Registro
                            <>
                            <li>
                                <Link href="/login" onClick={handleClose}>Iniciar sesión</Link>
                            </li>
                            <li>
                                <Link href="/registro" onClick={handleClose}>Registrarme</Link>
                            </li>
                            </>
                        )}
                    </ul>
                </div>
            </motion.div>)}
    </AnimatePresence>
  );
};

export default ResponsiveMenu;
