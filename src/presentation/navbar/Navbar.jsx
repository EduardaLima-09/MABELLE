import logo from '../../assets/LogoMaison.png'
import styles from './Navbar.module.css'

function Navbar({ totalItems, onOpenCart }) {
  return (
    <header className={styles.navbar}>
      <nav className={styles.navContent}>
        <a href="#inicio" className={styles.logo}>
          <img src={logo} alt="MAISON" className={styles.logoImg} />
        </a>
        <ul className={styles.navLinks}>
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#wigs">Wigs</a></li>
          <li><a href="#lace-front">Lace Front</a></li>
          <li><a href="#cabelo-humano">Cabelo Humano</a></li>
          <li><a href="#rabos-de-cavalo">Rabos</a></li>
          <li><a href="#acessorios">Acessórios</a></li>
          <li>
            <button className={styles.cartBtn} onClick={onOpenCart} aria-label="Abrir carrinho">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {totalItems > 0 && <span className={styles.cartCount}>{totalItems}</span>}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
