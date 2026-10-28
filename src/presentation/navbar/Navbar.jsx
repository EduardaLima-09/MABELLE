import { useEffect, useState } from 'react'
import logo from '../../assets/LogoMabelleWordmark.png'
import styles from './Navbar.module.css'

const navLinks = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'provador', label: 'Provador' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'wigs', label: 'Wigs' },
  { id: 'lace-front', label: 'Lace Front' },
  { id: 'cabelo-humano', label: 'Cabelo' },
  { id: 'rabos-de-cavalo', label: 'Rabos' },
  { id: 'acessorios', label: 'Acessórios' },
]

function Navbar({ totalItems, onOpenCart, favoriteCount = 0, onOpenFavorites }) {
  const [scrolled, setScrolled] = useState(
    () => typeof window !== 'undefined' && window.scrollY > 20
  )
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = overflow
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  const handleDrawerLink = (event, id) => {
    event.preventDefault()
    closeMenu()
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  return (
    <>
      <header
        className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${menuOpen ? styles.menuIsOpen : ''
          }`}
      >
        <div className={styles.inner}>
          <a href="#inicio" className={styles.brand} onClick={closeMenu}>
            <img src={logo} alt="MABELLE" className={styles.logoImg} />
          </a>

          <nav className={styles.nav} aria-label="Navegação principal">
            <ul className={styles.links}>
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} className={styles.link}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            {onOpenFavorites && (
              <button
                type="button"
                className={styles.favoritesBtn}
                onClick={onOpenFavorites}
                aria-label={`Abrir favoritos${favoriteCount > 0 ? `, ${favoriteCount} itens` : ''}`}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 20.4 4.6 13a4.6 4.6 0 0 1 0-6.5 4.6 4.6 0 0 1 6.5 0l.9.9.9-.9a4.6 4.6 0 0 1 6.5 0 4.6 4.6 0 0 1 0 6.5Z" />
                </svg>
                {favoriteCount > 0 && (
                  <span className={styles.favoritesCount} key={favoriteCount}>
                    {favoriteCount}
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              className={styles.cartBtn}
              onClick={onOpenCart}
              aria-label={`Abrir sacola${totalItems > 0 ? `, ${totalItems} itens` : ''}`}
            >
              <svg
                width="31"
                height="31"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 7h12l-1.2 12.2a1.5 1.5 0 0 1-1.5 1.3H8.7a1.5 1.5 0 0 1-1.5-1.3L6 7Z" />
                <path d="M9 9.5V6.2a3 3 0 0 1 6 0v3.3" />
              </svg>
              {totalItems > 0 && (
                <span className={styles.cartCount} key={totalItems}>
                  {totalItems}
                </span>
              )}
            </button>

            <button
              type="button"
              className={`${styles.menuBtn} ${menuOpen ? styles.menuBtnOpen : ''}`}
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div
        id="menu-mobile"
        className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}
      >
        <nav aria-label="Navegação principal (mobile)">
          <ul className={styles.drawerLinks}>
            {navLinks.map((link, index) => (
              <li key={link.id} style={{ '--i': index }}>
                <a
                  href={`#${link.id}`}
                  onClick={(event) => handleDrawerLink(event, link.id)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}

export default Navbar
