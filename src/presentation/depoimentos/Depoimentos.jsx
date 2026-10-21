import { useReveal } from '../../viewmodel/useReveal.js'
import SectionHeading from '../../components/SectionHeading/SectionHeading.jsx'
import styles from './Depoimentos.module.css'

const testimonials = [
  {
    name: 'Ana C.',
    text: 'Gostei da proposta da loja e da organização dos produtos. Ficou mais fácil comparar as opções.',
  },
  {
    name: 'Júlia M.',
    text: 'A apresentação dos produtos é elegante e ajuda a encontrar referências para diferentes estilos.',
  },
  {
    name: 'Camila R.',
    text: 'Gostei da identidade visual e da facilidade para explorar as categorias.',
  },
]

function Depoimentos() {
  const { ref, visible } = useReveal()

  return (
    <section
      id="depoimentos"
      ref={ref}
      data-reveal
      className={`${styles.section} ${visible ? styles.revealed : styles.hidden}`}
    >
      <div className={styles.content}>
        <SectionHeading
          eyebrow="Experiência"
          title="Quem escolhe a MABELLE"
          subtitle="Cada detalhe importa na experiência de beleza."
          visible={visible}
        />

        <div className={styles.grid}>
          {testimonials.map((item, index) => (
            <article
              key={item.name}
              className={styles.card}
              style={{ '--i': index }}
            >
              <div className={styles.quoteWrap} aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9.5 5.5C6.5 6.6 4.6 9.3 4.6 12.9c0 3 1.7 5 4.2 5 2.1 0 3.7-1.6 3.7-3.7 0-2-1.4-3.5-3.3-3.5-.4 0-.8.1-1 .1.3-1.9 1.7-3.6 3.6-4.4l-2.3-1.4zm9 0c-3 1.1-4.9 3.8-4.9 7.4 0 3 1.7 5 4.2 5 2.1 0 3.7-1.6 3.7-3.7 0-2-1.4-3.5-3.3-3.5-.4 0-.8.1-1 .1.3-1.9 1.7-3.6 3.6-4.4l-2.3-1.4z" />
                </svg>
              </div>
              <p className={styles.text}>{item.text}</p>
              <div className={styles.footer}>
                <span className={styles.divider} aria-hidden="true" />
                <p className={styles.name}>{item.name}</p>
              </div>
            </article>
          ))}
        </div>

        <p className={styles.note}>Depoimentos ilustrativos</p>
      </div>
    </section>
  )
}

export default Depoimentos
