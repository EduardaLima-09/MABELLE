import { useState } from 'react'
import { useReveal } from '../../viewmodel/useReveal.js'
import SectionHeading from '../../components/SectionHeading/SectionHeading.jsx'
import styles from './CategorySection.module.css'

function formatPrice(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function CategorySection({
  category,
  index = 0,
  onAddToCart,
  onViewDetails,
  onToggleFavorite,
  isFavorite,
}) {
  const { id, title, description, products } = category
  const { ref, visible } = useReveal()

  return (
    <section
      id={id}
      ref={ref}
      data-reveal
      className={`${styles.section} ${index % 2 === 1 ? styles.alt : ''} ${
        visible ? styles.revealed : styles.hidden
      }`}
    >
      <div className={styles.inner}>
        <SectionHeading
          eyebrow="Coleção"
          title={title}
          subtitle={description}
          visible={visible}
        />

        <div className={styles.grid}>
          {products.map((product, productIndex) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryTitle={title}
              index={productIndex}
              onAddToCart={onAddToCart}
              onViewDetails={onViewDetails}
              onToggleFavorite={onToggleFavorite}
              isFavorite={isFavorite}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCard({
  product,
  categoryTitle,
  index = 0,
  onAddToCart,
  onViewDetails,
  onToggleFavorite,
  isFavorite,
}) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const showImage = product.image && !imageError
  const favorite = isFavorite(product.id)

  return (
    <article className={styles.card} style={{ '--i': index }}>
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
          <span className={styles.imagePlaceholder}>{categoryTitle}</span>
        )}
      </div>

      <button
        className={`${styles.heartBtn} ${favorite ? styles.heartBtnActive : ''}`}
        onClick={() => onToggleFavorite(product.id)}
        aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        aria-pressed={favorite}
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill={favorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.4"
          aria-hidden="true"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      <div className={styles.info}>
        <p className={styles.category}>{categoryTitle}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price}>{formatPrice(product.price)}</p>
        <span className={styles.divider} aria-hidden="true" />

        <div className={styles.actions}>
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
      </div>
    </article>
  )
}

export default CategorySection
