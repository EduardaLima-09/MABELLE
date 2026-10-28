import { useState } from 'react'
import { useReveal } from '../../viewmodel/useReveal.js'
import { useQuiz } from '../../viewmodel/useQuiz.js'
import SectionHeading from '../../components/SectionHeading/SectionHeading.jsx'
import {
  QUIZ_BUDGETS,
  QUIZ_COLORS,
  QUIZ_GOALS,
  QUIZ_LENGTHS,
  QUIZ_STYLES,
} from '../../model/quiz.js'
import { formatPrice } from '../../shared/formatPrice.js'
import styles from './Quiz.module.css'

const COLOR_SWATCHES = {
  preto: '#241017',
  castanho: '#5b3a29',
  mel: '#b07d3f',
  platinum: '#ddd6cc',
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/*
 * Opções de cada pergunta, ligadas aos atributos reais do catálogo.
 */
function optionsFor(field) {
  switch (field) {
    case 'goal':
      return QUIZ_GOALS.map((goal) => ({
        value: goal.id,
        label: goal.label,
      }))
    case 'style':
      return QUIZ_STYLES.map((style) => ({
        value: style,
        label: capitalize(style),
        swatch: COLOR_SWATCHES[style] ? style : null,
      }))
    case 'length':
      return QUIZ_LENGTHS.map((length) => ({
        value: length,
        label: capitalize(length),
      }))
    case 'color':
      return QUIZ_COLORS.map((color) => ({
        value: color,
        label: capitalize(color),
        swatch: color,
      }))
    case 'budget':
      return QUIZ_BUDGETS.map((range) => ({
        value: range.id,
        label: range.label,
      }))
    default:
      return []
  }
}

function Quiz({ categories, onAddToCart, onViewDetails, onToggleFavorite, isFavorite }) {
  const { ref, visible } = useReveal()
  const {
    questions,
    answers,
    started,
    finished,
    complete,
    recommendation,
    alternatives,
    selectAnswer,
    start,
    finish,
    restart,
  } = useQuiz(categories)

  const [step, setStep] = useState(0)

  const current = questions[step]
  const isLast = step === questions.length - 1
  const progress = Math.round(((step + 1) / questions.length) * 100)

  const handleNext = () => {
    if (!isLast) {
      setStep((value) => value + 1)
      return
    }
    finish()
  }

  const handleBack = () => setStep((value) => Math.max(0, value - 1))

  const handleRestart = () => {
    restart()
    setStep(0)
  }

  const favorited = recommendation ? isFavorite(recommendation.id) : false

  return (
    <section
      id="quiz"
      ref={ref}
      data-reveal
      className={`${styles.section} ${visible ? styles.revealed : styles.hidden}`}
    >
      <div className={styles.inner}>
        <SectionHeading
          eyebrow="Quiz Mabelle"
          title="Descubra o cabelo ideal para você"
          subtitle="Responda algumas perguntas sobre as suas preferências e receba uma recomendação de produtos reais do nosso catálogo."
          visible={visible}
        />

        {!started && (
          <div className={styles.intro}>
            <p className={styles.introText}>
              São {questions.length} perguntas rápidas. Ao final, indicamos o
              produto que mais combina com o que você procura — e você pode
              favoritar ou adicionar direto à sacola.
            </p>
            <button type="button" className={styles.startBtn} onClick={start}>
              Começar o quiz
            </button>
          </div>
        )}

        {started && !finished && (
          <div className={styles.panel}>
            <div className={styles.progressRow}>
              <span className={styles.progressLabel}>
                Pergunta {step + 1} de {questions.length}
              </span>
              <span className={styles.progressTrack} aria-hidden="true">
                <span
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </span>
            </div>

            <fieldset className={styles.group} key={current.id}>
              <legend className={styles.legend}>{current.question}</legend>
              <div
                className={
                  current.id === 'color' || current.id === 'style'
                    ? styles.swatches
                    : styles.chips
                }
              >
                {optionsFor(current.id).map((option) => {
                  const active = answers[current.id] === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={
                        option.swatch
                          ? `${styles.swatch} ${active ? styles.swatchActive : ''}`
                          : `${styles.chip} ${active ? styles.chipActive : ''}`
                      }
                      aria-pressed={active}
                      onClick={() => selectAnswer(current.id, option.value)}
                    >
                      {option.swatch && (
                        <span
                          className={styles.swatchDot}
                          style={{ background: COLOR_SWATCHES[option.swatch] }}
                          aria-hidden="true"
                        />
                      )}
                      {option.label}
                    </button>
                  )
                })}
              </div>
              {!current.required && (
                <p className={styles.optionalHint}>
                  Opcional — você pode pular esta pergunta.
                </p>
              )}
            </fieldset>

            <div className={styles.navRow}>
              <button
                type="button"
                className={styles.backBtn}
                onClick={handleBack}
                disabled={step === 0}
              >
                Voltar
              </button>
              <button
                type="button"
                className={styles.nextBtn}
                onClick={handleNext}
                disabled={current.required && !answers[current.id]}
              >
                {isLast ? 'Ver recomendação' : 'Próxima'}
              </button>
            </div>
          </div>
        )}

        {finished && recommendation && (
          <div className={styles.result} aria-live="polite">
            <p className={styles.resultBadge}>Sua recomendação</p>
            <figure className={styles.card}>
              <div className={styles.cardMedia}>
                <img
                  src={recommendation.image}
                  alt={`${recommendation.name}, ${recommendation.categoryTitle}`}
                  className={styles.cardImage}
                  loading="lazy"
                />
              </div>
              <figcaption className={styles.cardInfo}>
                <p className={styles.cardCategory}>
                  {recommendation.categoryTitle}
                </p>
                <h3 className={styles.cardName}>{recommendation.name}</h3>
                <p className={styles.cardPrice}>
                  {formatPrice(recommendation.price)}
                </p>
                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={styles.favoriteBtn}
                    onClick={() => onToggleFavorite(recommendation.id)}
                    aria-pressed={favorited}
                  >
                    {favorited ? 'Remover dos favoritos' : 'Favoritar'}
                  </button>
                  <button
                    type="button"
                    className={styles.detailsBtn}
                    onClick={() =>
                      onViewDetails(recommendation, recommendation.categoryTitle)
                    }
                  >
                    Ver detalhes
                  </button>
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={() =>
                      onAddToCart(recommendation, recommendation.categoryTitle)
                    }
                  >
                    Adicionar à sacola
                  </button>
                </div>
              </figcaption>
            </figure>

            {alternatives.length > 0 && (
              <div className={styles.related}>
                <p className={styles.relatedTitle}>Também pode gostar</p>
                <div className={styles.relatedGrid}>
                  {alternatives.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      className={styles.relatedCard}
                      onClick={() =>
                        onViewDetails(product, product.categoryTitle)
                      }
                    >
                      <span className={styles.relatedMedia}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className={styles.relatedImage}
                          loading="lazy"
                        />
                      </span>
                      <span className={styles.relatedInfo}>
                        <span className={styles.relatedCategory}>
                          {product.categoryTitle}
                        </span>
                        <span className={styles.relatedName}>
                          {product.name}
                        </span>
                        <span className={styles.relatedPrice}>
                          {formatPrice(product.price)}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              className={styles.restartBtn}
              onClick={handleRestart}
            >
              Refazer o quiz
            </button>
          </div>
        )}

        {finished && !complete && (
          <div className={styles.intro}>
            <p className={styles.introText}>
              Você ainda não escolheu o objetivo. Volte e responda a primeira
              pergunta para receber uma recomendação.
            </p>
            <button type="button" className={styles.startBtn} onClick={handleRestart}>
              Recomeçar
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default Quiz
