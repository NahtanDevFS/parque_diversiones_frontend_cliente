import { motion, AnimatePresence } from "motion/react";
import { style } from "motion/react-client";
import styles from "./Navbar.module.css";
import React from "react";

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
                            <a href="/">Inicio</a>
                        </li>
                        <li>
                            <a href="#">Comprar</a>
                        </li>
                        <li>
                            <a href="#">Mis tickets</a>
                        </li>
                        <li>
                            <a href="#">Eventos</a>
                        </li>
                    </ul>
                </div>
            </motion.div>)}
    </AnimatePresence>
  );
};

export default ResponsiveMenu;
