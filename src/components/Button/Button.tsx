import Styles from './Button.module.css';

interface ButtonProps {
    text: string; // Texto del botón
    onClick?: () => void; // Función a ejecutar al hacer clic
    className?: string; // Clases CSS adicionales
    type?: 'button' | 'submit' | 'reset'; // Tipo de botón
  }
  
export const Button = ({ text, onClick, type = 'button' }: ButtonProps) => {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`${Styles.button}`} // Aplica la clase base y las clases adicionales
      >
        {text}
      </button>
    );
  };
  