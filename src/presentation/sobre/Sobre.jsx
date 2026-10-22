import { useReveal } from '../../viewmodel/useReveal.js'
import sobreImage from '../../assets/2.png'
import styles from './Sobre.module.css'

const highlights = [
  {
    number: '01',
    title: 'Qualidade',
    text: 'Produtos selecionados com atenção aos detalhes.',
  },
  {
    number: '02',
    title: 'Estilo',
    text: 'Opções para diferentes personalidades e ocasiões.',
  },
  {
    number: '03',
    title: 'Experiência',
    text: 'Uma jornada de compra simples, elegante e acolhedora.',
  },
]

function Sobre() {
  const { ref, visible } = useReveal()

  return (
    <section
      id="sobre"
      ref={ref}
      data-reveal
      className={`${styles.section} ${visible ? styles.revealed : styles.hidden}`}
    >
      <div className={styles.inner}>
        <div className={styles.main}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Sobre a MABELLE</p>

            <h2 className={styles.title}>A essência da Mabelle</h2>

            <span className={styles.rule} aria-hidden="true" />

            <p className={styles.lead}>
              Mais do que beleza, uma expressão de quem você é.
            </p>

            <div className={styles.texts}>
              <p>
                A MABELLE nasceu para valorizar a beleza, a confiança e a
                individualidade de cada pessoa.
              </p>
              <p>
                Somos uma loja especializada em cabelos e acessórios, com
                uma curadoria pensada para quem busca qualidade, estilo e
                praticidade.
              </p>
              <p>
                Queremos que cada escolha seja uma experiência especial, com
                produtos que combinem com sua personalidade e seu jeito de se
                expressar.
              </p>
            </div>

            <p className={styles.tagline}>Beleza · Estilo · Elegância</p>
          </div>

          <div className={styles.visual}>
            <span className={styles.frame} aria-hidden="true" />
            <img
              src={sobreImage}
              alt="Modelo com peruca da linha MABELLE"
              className={styles.image}
            />
          </div>
        </div>

        <div className={styles.highlights}>
          {highlights.map((item, index) => (
            <div
              key={item.title}
              className={styles.highlight}
              style={{ '--i': index }}
            >
              <span className={styles.number}>{item.number}</span>
              <h3 className={styles.highlightTitle}>{item.title}</h3>
              <p className={styles.highlightText}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Sobre
