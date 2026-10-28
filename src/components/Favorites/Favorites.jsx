import styles from './Favorites.module.css'

function formatPrice(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function Favorites({ isOpen, items, onClose, onRemove, onClear, onViewDetails, onAddToCart }) {
  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={onClose}
      />
      <aside
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
        aria-label="Meus favoritos"
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Meus Favoritos</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </div>

        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyText}>Você ainda não favoritou nenhum produto</p>
              <p className={styles.emptyHint}>
                Toque no coração dos produtos para salvá-los aqui.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className={styles.item}>
                {item.image ? (
                  <img src={item.image} alt={item.name} className={styles.itemImage} />
                ) : (
                  <span className={styles.itemImageFallback} aria-hidden="true" />
                )}

                <div className={styles.itemInfo}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemCategory}>{item.categoryTitle}</p>
                  <p className={styles.itemPrice}>{formatPrice(item.price)}</p>

                  <div className={styles.itemActions}>
                    <button
                      className={styles.detailBtn}
                      onClick={() => onViewDetails(item)}
                    >
                      Ver detalhes
                    </button>
                    <button
                      className={styles.removeBtn}
                      onClick={() => onRemove(item.id)}
                      aria-label={`Remover ${item.name} dos favoritos`}
                    >
                      Remover
                    </button>
                  </div>
                </div>

                <button
                  className={styles.addBtn}
                  onClick={() => onAddToCart(item, item.categoryTitle)}
                  aria-label={`Adicionar ${item.name} à sacola`}
                >
                  +
                </button>
              </div>
            ))
          )}
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.clearBtn}
            onClick={onClear}
            disabled={items.length === 0}
          >
            Esvaziar favoritos
          </button>
        </div>
      </aside>
    </>
  )
}

export default Favorites
