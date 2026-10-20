import { useEffect, useRef } from 'react'
import styles from './WelcomeModal.module.css'

function WelcomeModal({ onClose }) {
  const buttonRef = useRef(null)

  useEffect(() => {
    buttonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      <div className={styles.modal}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Fechar boas-vindas"
        >
          ×
        </button>

        <h2 id="welcome-title" className={styles.title}>
          Bem-vinda à MAISON
        </h2>
        <p className={styles.slogan}>Seu Cabelo. Sua Coroa.</p>
        <div className={styles.divider} />

        <p className={styles.text}>
          Descubra uma curadoria especial de wigs, lace-fronts, cabelos humanos e
          acessórios, pensada para realçar a sua beleza com elegância e sofisticação.
        </p>

        <button
          type="button"
          ref={buttonRef}
          className={styles.cta}
          onClick={onClose}
        >
          Explorar coleção
        </button>
      </div>
    </div>
  )
}

export default WelcomeModal
