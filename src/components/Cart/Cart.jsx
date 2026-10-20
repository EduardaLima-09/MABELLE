import styles from './Cart.module.css'

function formatPrice(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function Cart({ isOpen, items, totalPrice, onClose, onIncrease, onDecrease, onRemove }) {
  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={onClose}
      />
      <aside className={`${styles.cart} ${isOpen ? styles.cartOpen : ''}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>Sua Sacola</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </div>

        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyText}>Sua sacola está vazia</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemInfo}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemCategory}>{item.category}</p>
                  <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
                </div>
                <div className={styles.itemRight}>
                  <div className={styles.quantity}>
                    <button className={styles.qtyBtn} onClick={() => onDecrease(item.id)}>
                      −
                    </button>
                    <span className={styles.qtyValue}>{item.quantity}</span>
                    <button className={styles.qtyBtn} onClick={() => onIncrease(item.id)}>
                      +
                    </button>
                  </div>
                  <p className={styles.subtotal}>
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <button className={styles.removeBtn} onClick={() => onRemove(item.id)}>
                    Remover
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.total}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalValue}>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}

export default Cart
