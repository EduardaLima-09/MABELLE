import { useEffect, useRef } from 'react'
import logo from '../../assets/LogoMabelleWordmark.png'
import { useCheckout } from '../../viewmodel/useCheckout.js'
import { CHECKOUT_STEPS } from '../../model/checkout.js'
import OrderSummary from './OrderSummary.jsx'
import OrderSuccess from './OrderSuccess.jsx'
import styles from './Checkout.module.css'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function Checkout({ items, onClose, onBackToStore }) {
  const {
    step,
    form,
    errors,
    order,
    summary,
    isEmpty,
    setField,
    goToReview,
    backToForm,
    confirmOrder,
  } = useCheckout({ items })

  const panelRef = useRef(null)
  const titleRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    previousFocusRef.current = document.activeElement
    titleRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = panelRef.current?.querySelectorAll(FOCUSABLE)
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

  useEffect(() => {
    titleRef.current?.focus()
  }, [step])

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) onClose()
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    goToReview()
  }

  const currentStepIndex = CHECKOUT_STEPS.findIndex((item) => item.id === step)

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        className={styles.panel}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
      >
        <header className={styles.header}>
          <img src={logo} alt="MABELLE" className={styles.logo} />

          <h2
            id="checkout-title"
            className={styles.headerTitle}
            ref={titleRef}
            tabIndex={-1}
          >
            Finalizar compra
          </h2>

          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Fechar finalização de compra"
          >
            ×
          </button>
        </header>

        <ol className={styles.steps} aria-label="Etapas da finalização">
          {CHECKOUT_STEPS.map((item, index) => {
            const state =
              index < currentStepIndex
                ? 'done'
                : index === currentStepIndex
                  ? 'current'
                  : 'pending'

            const stateClass = {
              done: styles.stepDone,
              current: styles.stepCurrent,
              pending: styles.stepPending,
            }[state]

            return (
              <li
                key={item.id}
                className={`${styles.step} ${stateClass}`}
                aria-current={state === 'current' ? 'step' : undefined}
              >
                <span className={styles.stepBadge}>{index + 1}</span>
                <span className={styles.stepLabel}>{item.label}</span>
              </li>
            )
          })}
        </ol>

        <div
          className={`${styles.content} ${step === 'concluido' ? styles.contentSingle : ''}`}
        >
          <div className={styles.main}>
            {isEmpty ? (
              <div className={styles.emptyState}>
                <p className={styles.eyebrow}>Sacola vazia</p>
                <h3 className={styles.title}>Não há produtos para finalizar</h3>
                <p className={styles.lead}>
                  Sua sacola está vazia. Adicione produtos à coleção para continuar a
                  finalização da compra.
                </p>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={onBackToStore}
                >
                  Voltar à loja
                </button>
              </div>
            ) : step === 'dados' ? (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <p className={styles.eyebrow}>Etapa 1 de 3 · Identificação</p>
                <h3 className={styles.title}>Seus dados</h3>
                <p className={styles.lead}>
                  Preencha os dados abaixo para revisar seu pedido demonstrativo antes
                  de concluí-lo.
                </p>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="checkout-name">
                    Nome completo
                  </label>
                  <input
                    id="checkout-name"
                    name="name"
                    type="text"
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    placeholder="Maria Eduarda Lima"
                    autoComplete="name"
                    value={form.name}
                    onChange={(event) => setField('name', event.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'checkout-name-error' : undefined}
                  />
                  {errors.name && (
                    <p className={styles.error} id="checkout-name-error" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="checkout-email">
                    E-mail
                  </label>
                  <input
                    id="checkout-email"
                    name="email"
                    type="email"
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    placeholder="nome@dominio.com"
                    autoComplete="email"
                    value={form.email}
                    onChange={(event) => setField('email', event.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'checkout-email-error' : undefined}
                  />
                  {errors.email && (
                    <p className={styles.error} id="checkout-email-error" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                <p className={styles.note}>
                  Nenhum dado de pagamento é solicitado. A finalização é totalmente
                  demonstrativa e nada é cobrado.
                </p>

                <div className={styles.actions}>
                  <button type="button" className={styles.ghostBtn} onClick={onClose}>
                    Voltar à sacola
                  </button>
                  <button type="submit" className={styles.primaryBtn}>
                    Revisar pedido
                  </button>
                </div>
              </form>
            ) : step === 'revisao' ? (
              <div className={styles.review}>
                <p className={styles.eyebrow}>Etapa 2 de 3 · Confirmação</p>
                <h3 className={styles.title}>Revise antes de confirmar</h3>
                <p className={styles.lead}>
                  Confira os dados informados e o resumo da compra. Ao confirmar, um
                  pedido demonstrativo será gerado.
                </p>

                <dl className={styles.reviewList}>
                  <div className={styles.reviewRow}>
                    <dt className={styles.reviewLabel}>Nome</dt>
                    <dd className={styles.reviewValue}>{form.name}</dd>
                  </div>
                  <div className={styles.reviewRow}>
                    <dt className={styles.reviewLabel}>E-mail</dt>
                    <dd className={styles.reviewValue}>{form.email}</dd>
                  </div>
                </dl>

                <div className={styles.reviewItems}>
                  <p className={styles.reviewItemsTitle}>Produtos selecionados</p>
                  <OrderSummary
                    lines={summary.lines}
                    subtotal={summary.subtotal}
                    total={summary.total}
                    showTotals={false}
                  />
                </div>

                <div className={styles.actions}>
                  <button type="button" className={styles.ghostBtn} onClick={backToForm}>
                    Editar dados
                  </button>
                  <button
                    type="button"
                    className={styles.primaryBtn}
                    onClick={confirmOrder}
                  >
                    Confirmar pedido
                  </button>
                </div>
              </div>
            ) : (
              <OrderSuccess order={order} onBackToStore={onBackToStore} />
            )}
          </div>

          {step !== 'concluido' && (
            <aside className={styles.summaryCard} aria-label="Resumo do pedido">
              <p className={styles.summaryEyebrow}>Resumo do pedido</p>
              <h4 className={styles.summaryTitle}>Sua sacola</h4>

              <OrderSummary
                lines={summary.lines}
                subtotal={summary.subtotal}
                total={summary.total}
                note="Pedido demonstrativo — nenhuma cobrança é realizada."
              />
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}

export default Checkout
