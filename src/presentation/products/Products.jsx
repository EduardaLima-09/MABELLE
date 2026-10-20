import { products } from '../../model/products.js'
import styles from './Products.module.css'

function getCategoryClass(category) {
  if (category === 'Wigs & Laces') return styles.imageWigs
  if (category === 'Cabelos & Bundles') return styles.imageBundles
  return styles.imageAccessories
}

function formatPrice(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function Products() {
  return (
    <section id="produtos" className={styles.section}>
      <div className={styles.header}>
        <p className={styles.overline}>Boutique</p>
        <h2 className={styles.title}>A coleção MAISON</h2>
        <p className={styles.description}>
          Peças cuidadosamente selecionadas para celebrar a sua beleza.
          Qualidade, elegância e exclusividade em cada detalhe.
        </p>
      </div>

      <div className={styles.grid}>
        {products.map((product) => (
          <article key={product.id} className={styles.card}>
            <div className={`${styles.image} ${getCategoryClass(product.category)}`}>
              {product.category}
            </div>
            <div className={styles.info}>
              <p className={styles.category}>{product.category}</p>
              <h3 className={styles.name}>{product.name}</h3>
              <p className={styles.price}>{formatPrice(product.price)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Products
