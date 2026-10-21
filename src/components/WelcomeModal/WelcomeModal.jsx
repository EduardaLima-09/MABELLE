import { useEffect, useRef } from 'react'
import welcomeImage from '../../assets/2.png'
import logo from '../../assets/LogoMabelleWordmark.png'
import styles from './WelcomeModal.module.css'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function WelcomeModal({ onClose, onExplore }) {
  const dialogRef = useRef(null)
  const ctaRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    previousFocusRef.current = document.activeElement
    ctaRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = dialogRef.current?.querySelectorAll(FOCUSABLE)
      if (!focusable || focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = overflow
      if (previousFocusRef.current?.isConnected) {
        previousFocusRef.current.focus()
      }
    }
  }, [onClose])

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) onClose()
  }

  const handleExplore = () => {
    if (onExplore) {
      onExplore()
      return
    }
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        className={styles.modal}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        aria-describedby="welcome-description"
      >
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Fechar boas-vindas"
        >
          ×
        </button>

        <div className={styles.media}>
          <img src={welcomeImage} alt="" className={styles.image} />
          <span className={styles.mediaShade} aria-hidden="true" />
        </div>

        <div className={styles.content}>
          <img src={logo} alt="MABELLE" className={styles.logo} />

          <p className={styles.eyebrow}>Beleza · Estilo · Elegância</p>

          <h2 id="welcome-title" className={styles.title}>
            Seu próximo visual começa aqui.
          </h2>

          <p id="welcome-description" className={styles.text}>
            Descubra laces, wigs e acessórios selecionados para expressar seu
            estilo com elegância.
          </p>

          <p className={styles.footnote}>É um prazer ter você aqui.</p>
        </div>
      </div>
    </div>
  )
}

export default WelcomeModal
