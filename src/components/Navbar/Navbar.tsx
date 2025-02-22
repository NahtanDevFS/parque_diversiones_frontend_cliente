"use client";

import React from 'react'
import { NavbarMenu } from '@/mockData/data';
import styles from '@/components/Navbar/Navbar.module.css';
import { MdMenu } from 'react-icons/md';
import ResponsiveMenu from './ResponsiveMenu';

export const Navbar = () => {

    const [open, setOpen] = React.useState(false);

  return (
    <> 
        <nav>
            <div className={styles.container}>
                {/* Logo */}
                <a href='/' className={styles.logo}>
                    <p>Oriente</p>
                    <p className={styles.logo_text_color}>Magico</p>
                </a>
                {/* menu */}
                    <div>
                        <ul className={styles.list}>
                            {NavbarMenu.map((item) => (
                                <li key={item.id}>
                                    <a href={item.link}>{item.title}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                {/* user */}
                <div className={styles.user_container}>
                    <button className={styles.button}>Iniciar sesión</button>
                    <button className={styles.button}>Registrarme</button>
                </div>
                {/* mobile menu button */}
                <div className={styles.mobile_menu}>
                    <MdMenu onClick={() => setOpen(!open)} />
                </div>
            </div>
        </nav>

        {/* mobile sidebar */}
        <div className={styles.sidebar}>
            <ResponsiveMenu open={open} />
        </div>
    </>
  )
}
