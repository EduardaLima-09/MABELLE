import { DEMO_DISCLAIMER } from '../../model/checkout.js'
import OrderSummary from './OrderSummary.jsx'
import styles from './Checkout.module.css'

function OrderSuccess({ order, onBackToStore }) {
  const firstName = (order?.customer?.name ?? '').split(/\s+/)[0]

  return (
    <div className={styles.success}>
      <span className={styles.successIcon} aria-hidden="true">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>

      <p className={styles.eyebrow}>Pedido demonstrativo</p>
      <h3 className={styles.title}>Pedido confirmado</h3>
      <p className={styles.lead}>
        Obrigada{firstName ? `, ${firstName}` : ''}. Registramos o seu pedido de
        demonstração.
      </p>

      <div className={styles.orderNumber}>
        <span className={styles.orderNumberLabel}>Número do pedido</span>
        <strong className={styles.orderNumberValue}>{order?.number}</strong>
      </div>

      <dl className={styles.reviewList}>
        <div className={styles.reviewRow}>
          <dt className={styles.reviewLabel}>Nome</dt>
          <dd className={styles.reviewValue}>{order?.customer?.name}</dd>
        </div>
        <div className={styles.reviewRow}>
          <dt className={styles.reviewLabel}>E-mail</dt>
          <dd className={styles.reviewValue}>{order?.customer?.email}</dd>
        </div>
      </dl>

      <OrderSummary
        lines={order?.items ?? []}
        subtotal={order?.subtotal ?? 0}
        total={order?.total ?? 0}
      />

      <p className={styles.disclaimer}>{DEMO_DISCLAIMER}</p>

      <button type="button" className={styles.primaryBtn} onClick={onBackToStore}>
        Voltar à loja
      </button>
    </div>
  )
}

export default OrderSuccess
