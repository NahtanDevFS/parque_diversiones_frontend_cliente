"use client";

import React from 'react'
import { NavbarMenu } from '@/app/mockData/data';
import styles from '@/app/components/Navbar/Navbar.module.css';
import { MdMenu } from 'react-icons/md';
import ResponsiveMenu from './ResponsiveMenu';

export const Navbar = () => {

    const [open, setOpen] = React.useState(false);

  return (
    <> 
        <nav>
            <div className={styles.container}>
                {/* Logo */}
                <div className={styles.logo}>
                    <p>Oriente</p>
                    <p className={styles.logo_text_color}>Magico</p>
                </div>
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
                <div>
                    <button className={styles.button}>Iniciar sesión</button>
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
