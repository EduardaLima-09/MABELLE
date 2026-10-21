import { useState } from 'react'
import logo from '../../assets/LogoMabelleWordmark.png'
import styles from './Footer.module.css'

const categoryLinks = [
  { id: 'wigs', label: 'Wigs' },
  { id: 'lace-front', label: 'Lace Front' },
  { id: 'cabelo-humano', label: 'Cabelo' },
  { id: 'rabos-de-cavalo', label: 'Rabos de Cavalo' },
  { id: 'acessorios', label: 'Acessórios' },
]

function Footer() {
  const [currentYear] = useState(() => new Date().getFullYear())

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <img src={logo} alt="MABELLE" className={styles.logoImg} />
            <p className={styles.slogan}>Seu cabelo. Sua Coroa.</p>
            <p className={styles.tagline}>MABELLE · Beleza · Estilo · Elegância</p>
          </div>

          <div className={styles.links}>
            <h4>Categorias</h4>
            <ul>
              {categoryLinks.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.contact}>
            <h4>Contato</h4>
            <p>@mabelle.boutique</p>
            <p>contato@mabelle.com</p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.disclaimer}>
            Todos os produtos, preços e dados comerciais são fictícios, para fins acadêmicos.
          </p>
          <p className={styles.copyright}>
            © {currentYear} MABELLE. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
