"use client";

import React from 'react'
import { NavbarMenu } from '@/mockData/data';
import styles from '@/components/Navbar/Navbar.module.css';
import { MdMenu } from 'react-icons/md';
import ResponsiveMenu from './ResponsiveMenu';
import Link from 'next/link';

export const Navbar = () => {

    const [open, setOpen] = React.useState(false);

  return (
    <> 
        <nav>
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
                    <Link href='/login'>
                        <button type='button' className={styles.button}>Iniciar sesión</button>
                    </Link>
                    <Link href='/registro'>
                        <button type='button' className={styles.button}>Registrarme</button>
                    </Link>
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
