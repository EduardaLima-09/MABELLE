import { useReveal } from '../../viewmodel/useReveal.js'
import SectionHeading from '../../components/SectionHeading/SectionHeading.jsx'
import { featuredProducts } from '../../data/products.js'
import styles from './Queridinhos.module.css'

function Queridinhos() {
  const { ref, visible } = useReveal()

  return (
    <section
      id="queridinhos"
      ref={ref}
      data-reveal
      className={`${styles.section} ${visible ? styles.revealed : styles.hidden}`}
    >
      <SectionHeading
        title="Os queridinhos da MABELLE"
        subtitle="Descubra os destaques da nossa coleção."
        tone="dark"
        visible={visible}
      />

      <div className={styles.grid}>
        {featuredProducts.map((product, index) => (
          <FeaturedCard key={product.id} product={product} index={index} />
        ))}
      </div>

      <div className={styles.footer}>
        <a href="#produtos" className={styles.collectionLink}>
          Ver todos os produtos
        </a>
      </div>
    </section>
  )
}

function FeaturedCard({ product, index }) {
  return (
    <article className={styles.card} style={{ '--i': index }}>
      <div className={styles.media}>
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className={styles.image}
            loading="lazy"
          />
        )}
      </div>

      <span className={styles.badge}>{product.badge}</span>

      <div className={styles.info}>
        <p className={styles.category}>{product.categoryTitle}</p>
        <h3 className={styles.name}>{product.name}</h3>
      </div>
    </article>
  )
}

export default Queridinhos
