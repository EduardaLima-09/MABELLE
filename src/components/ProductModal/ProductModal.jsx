import { useState } from 'react'
import styles from './ProductModal.module.css'

function formatPrice(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function ProductModal({ product, categoryTitle, onClose, onAddToCart }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const showImage = product.image && !imageError

  if (!product) return null

  const handleAdd = () => {
    onAddToCart(product, categoryTitle)
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.imageWrapper}>
          {showImage && (
            <img
              src={product.image}
              alt={product.name}
              className={styles.image}
              onError={() => setImageError(true)}
              onLoad={() => setImageLoaded(true)}
              style={{ opacity: imageLoaded ? 1 : 0 }}
            />
          )}
          {!showImage && (
            <span className={styles.imagePlaceholder}>{categoryTitle}</span>
          )}
        </div>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar detalhes">
          ×
        </button>
        <div className={styles.content}>
          <p className={styles.category}>{categoryTitle}</p>
          <h2 className={styles.name}>{product.name}</h2>
          <p className={styles.description}>{product.description}</p>
          <ul className={styles.details}>
            {product.texture && (
              <li>
                <span className={styles.detailsLabel}>Textura: </span>
                {product.texture}
              </li>
            )}
            {product.length && (
              <li>
                <span className={styles.detailsLabel}>Comprimento: </span>
                {product.length}
              </li>
            )}
            {product.color && (
              <li>
                <span className={styles.detailsLabel}>Cor: </span>
                {product.color}
              </li>
            )}
            {product.type && (
              <li>
                <span className={styles.detailsLabel}>Tipo: </span>
                {product.type}
              </li>
            )}
            {product.purpose && (
              <li>
                <span className={styles.detailsLabel}>Finalidade: </span>
                {product.purpose}
              </li>
            )}
          </ul>
          <p className={styles.price}>{formatPrice(product.price)}</p>
          <button className={styles.addBtn} onClick={handleAdd}>
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductModal
