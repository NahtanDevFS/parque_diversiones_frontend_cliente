import { motion, AnimatePresence } from "motion/react";
import styles from "./Navbar.module.css";
import React from "react";
import Link from "next/link";

interface ResponsiveMenuProps {
  open: boolean;
}

const ResponsiveMenu: React.FC<ResponsiveMenuProps> = ({ open }) => {
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
                            <Link href="/">Inicio</Link>
                        </li>
                        <li>
                            <Link href="/comprar">Comprar</Link>
                        </li>
                        <li>
                            <Link href="/mis_tickets">Mis tickets</Link>
                        </li>
                        <li>
                            <Link href="/eventos">Eventos</Link>
                        </li>
                        <li>
                            <Link href="/login">Iniciar sesión</Link>
                        </li>
                        <li>
                            <Link href="/registro">Registrame</Link>
                        </li>
                    </ul>
                </div>
            </motion.div>)}
    </AnimatePresence>
  );
};

export default ResponsiveMenu;
