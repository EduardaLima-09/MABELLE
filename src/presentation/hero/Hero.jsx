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
      <span className={styles.scrim} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>MABELLE · Beleza · Estilo · Elegância</p>

          <h1 className={styles.title}>
            Sua beleza,
            <br />
            sua assinatura.
          </h1>

          <span className={styles.rule} aria-hidden="true" />

          <p className={styles.text}>
            Wigs, lace front, cabelo humano e acessórios selecionados para
            quem entende que elegância é detalhe. Uma curadoria feita para
            transformar o cuidado em estilo.
          </p>

          <div className={styles.actions}>
            <a href="#produtos" className={styles.cta}>
              Descobrir mais
            </a>
          </div>
        </div>
      </div>

      <p className={styles.caption}>Linha wig &amp; lace front</p>
    </section>
  )
}

export default Hero
