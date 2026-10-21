import { formatPrice } from '../../shared/formatPrice.js'
import styles from './Checkout.module.css'

export function SummaryItem({ line }) {
  return (
    <li className={styles.summaryItem}>
      <span className={styles.summaryThumb}>
        {line.image ? (
          <img src={line.image} alt={line.name} className={styles.summaryImage} />
        ) : (
          <span className={styles.summaryThumbText}>{line.category}</span>
        )}
      </span>

      <span className={styles.summaryInfo}>
        <span className={styles.summaryName}>{line.name}</span>
        <span className={styles.summaryMeta}>
          {line.quantity} × {formatPrice(line.unitPrice)}
        </span>
      </span>

      <span className={styles.summarySubtotal}>{formatPrice(line.subtotal)}</span>
    </li>
  )
}

function OrderSummary({ lines, subtotal, total, note, showTotals = true }) {
  return (
    <>
      <ul className={styles.summaryItems}>
        {lines.map((line) => (
          <SummaryItem key={line.id} line={line} />
        ))}
      </ul>

      {showTotals && (
        <div className={styles.totals}>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Subtotal</span>
            <span className={styles.totalValue}>{formatPrice(subtotal)}</span>
          </div>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>{formatPrice(total)}</span>
          </div>
        </div>
      )}

      {note && <p className={styles.summaryNote}>{note}</p>}
    </>
  )
}

export default OrderSummary
