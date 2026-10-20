import { useState } from 'react'
import { useReveal } from '../../viewmodel/useReveal.js'
import styles from './CategorySection.module.css'

function formatPrice(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function CategorySection({ category, onAddToCart, onViewDetails, onToggleFavorite, isFavorite }) {
  const { id, title, description, products } = category
  const { ref, visible } = useReveal()

  return (
    <section
      id={id}
      ref={ref}
      className={`${styles.section} ${visible ? styles.revealed : styles.hidden}`}
    >
      <div className={styles.header}>
        <p className={styles.overline}>MAISON</p>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>

      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            categoryTitle={title}
            onAddToCart={onAddToCart}
            onViewDetails={onViewDetails}
            onToggleFavorite={onToggleFavorite}
            isFavorite={isFavorite}
          />
        ))}
      </div>
    </section>
  )
}

function ProductCard({ product, categoryTitle, onAddToCart, onViewDetails, onToggleFavorite, isFavorite }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const showImage = product.image && !imageError

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        {showImage && (
          <img
            src={product.image}
            alt={product.name}
            className={styles.image}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
        )}
        {!showImage && (
          <span className={styles.imagePlaceholder}>
            {categoryTitle}
          </span>
        )}
      </div>

      <button
        className={`${styles.heartBtn} ${isFavorite(product.id) ? styles.heartBtnActive : ''}`}
        onClick={() => onToggleFavorite(product.id)}
        aria-label={isFavorite(product.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorite(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      <div className={styles.info}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price}>{formatPrice(product.price)}</p>
        <button
          className={styles.detailsBtn}
          onClick={() => onViewDetails(product, categoryTitle)}
        >
          Ver detalhes
        </button>
        <button
          className={styles.addBtn}
          onClick={() => onAddToCart(product, categoryTitle)}
        >
          Adicionar à sacola
        </button>
      </div>
    </article>
  )
}

export default CategorySection
