import heroBg from '../../assets/FundoHero.png'
import styles from './Hero.module.css'

function Hero() {
  return (
    <section id="inicio" className={styles.hero}>
      <div
        className={styles.heroBg}
        style={{ backgroundImage: `url(${heroBg})` }}
        aria-hidden="true"
      />
      <div className={styles.heroContent}>
        <h1 className={styles.title}>MAISON</h1>
        <p className={styles.slogan}>Seu Cabelo. Sua Coroa.</p>
        <div className={styles.divider} />
        <p className={styles.description}>
          Peças exclusivas de wigs, laces e cabelos orgânicos, selecionadas
          para realçar a sua beleza natural com elegância e sofisticação.
        </p>
        <a href="#produtos" className={styles.cta}>
          Explorar coleção
        </a>
      </div>
    </section>
  )
}

export default Hero
