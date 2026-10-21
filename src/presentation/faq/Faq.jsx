import { useState } from 'react'
import { useReveal } from '../../viewmodel/useReveal.js'
import SectionHeading from '../../components/SectionHeading/SectionHeading.jsx'
import styles from './Faq.module.css'

const faqItems = [
  {
    question: 'Como escolher a lace ou wig ideal?',
    answer:
      'Considere o estilo, o comprimento, a textura e o acabamento desejados. Confira as descrições e imagens de cada produto para comparar as opções.',
  },
  {
    question: 'Qual é a diferença entre wig e lace front?',
    answer:
      'Wig é um termo usado para perucas em geral. Lace front é um modelo que possui uma tela delicada na parte frontal, ajudando a criar uma linha capilar com aparência natural.',
  },
  {
    question: 'Como cuidar da minha lace ou wig?',
    answer:
      'Siga as orientações de cuidado indicadas para o material do produto. Evite procedimentos ou produtos que não sejam recomendados pelo fabricante.',
  },
  {
    question: 'Os produtos possuem garantia?',
    answer:
      'Consulte as condições de garantia e as políticas de troca e devolução disponibilizadas pela loja antes de finalizar a compra.',
  },
  {
    question: 'Como funciona a compra pelo site?',
    answer:
      'Adicione os produtos desejados ao carrinho, confira os itens e o subtotal. Nesta versão demonstrativa, não implemente pagamentos reais nem prometa processamento de pedidos.',
  },
  {
    question: 'Como posso entrar em contato com a MABELLE?',
    answer:
      'Utilize os canais de contato disponíveis no rodapé do site. Esta é uma versão demonstrativa e não há outros canais de atendimento ativos.',
  },
]

function Faq() {
  const { ref, visible } = useReveal()
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? null : index))
  }

  return (
    <section
      id="faq"
      ref={ref}
      data-reveal
      className={`${styles.section} ${visible ? styles.revealed : styles.hidden}`}
    >
      <div className={styles.content}>
        <SectionHeading
          eyebrow="Atendimento"
          title="Dúvidas frequentes"
          subtitle="Tudo o que você precisa saber para escolher sua próxima beleza."
          visible={visible}
        />

        <div className={styles.list}>
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index
            const panelId = `faq-panel-${index}`
            const buttonId = `faq-button-${index}`

            return (
              <div key={item.question} className={styles.item}>
                <h3 className={styles.questionHeading}>
                  <button
                    id={buttonId}
                    type="button"
                    className={styles.question}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(index)}
                  >
                    <span className={styles.questionText}>{item.question}</span>
                    <span
                      className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`}
                      aria-hidden="true"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`${styles.answer} ${isOpen ? styles.answerOpen : ''}`}
                >
                  <div className={styles.answerInner}>
                    <p className={styles.answerText}>{item.answer}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Faq
