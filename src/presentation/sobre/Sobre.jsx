import { useReveal } from '../../viewmodel/useReveal.js'
import styles from './Sobre.module.css'

const highlights = [
  {
    title: 'Qualidade',
    text: 'Produtos selecionados com atenção aos detalhes.',
  },
  {
    title: 'Estilo',
    text: 'Opções para diferentes personalidades e ocasiões.',
  },
  {
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
      className={`${styles.section} ${visible ? styles.revealed : styles.hidden}`}
    >
      <div className={styles.content}>
        <p className={styles.overline}>Sobre a MAISON</p>
        <h2 className={styles.title}>Mais do que beleza, uma experiência.</h2>
        <p className={styles.text}>
          A MAISON nasceu para valorizar a beleza, a confiança e a individualidade de cada pessoa.
          Somos uma boutique especializada em cabelos e acessórios, com uma curadoria pensada para
          quem busca qualidade, estilo e praticidade. Queremos que cada escolha seja uma experiência
          especial, com produtos que combinem com sua personalidade e seu jeito de se expressar.
        </p>

        <div className={styles.highlights}>
          {highlights.map((item) => (
            <div key={item.title} className={styles.highlight}>
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
