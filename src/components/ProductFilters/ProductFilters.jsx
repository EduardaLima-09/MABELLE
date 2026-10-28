import styles from './ProductFilters.module.css'

function ProductFilters({
  categories,
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedTexture,
  onTextureChange,
  sortBy,
  onSortChange,
  showFavoritesOnly,
  onToggleFavorites,
  onClear,
}) {
  const textures = ['liso', 'ondulado', 'cacheado']

  const searchFilled = search.trim() !== ''
  const categoryFilled = selectedCategory !== ''
  const textureFilled = selectedTexture !== ''
  const sortFilled = sortBy !== 'default'

  return (
    <div className={styles.filtersArea}>
      <div className={styles.captionRow}>
        <p className={styles.caption}>Coleção completa</p>
        <span className={styles.captionRule} aria-hidden="true" />
      </div>

      <div className={styles.filters}>
        <div
          className={`${styles.searchField} ${searchFilled ? styles.filled : ''
            }`}
        >
          <svg
            className={styles.searchIcon}
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" />
          </svg>

          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar produto..."
            aria-label="Buscar produto"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <select
          className={`${styles.select} ${categoryFilled ? styles.filled : ''}`}
          aria-label="Filtrar por categoria"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
          ))}
        </select>

        <select
          className={`${styles.select} ${textureFilled ? styles.filled : ''}`}
          aria-label="Filtrar por textura"
          value={selectedTexture}
          onChange={(e) => onTextureChange(e.target.value)}
        >
          <option value="">Todas as texturas</option>
          {textures.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>

        <select
          className={`${styles.select} ${sortFilled ? styles.filled : ''}`}
          aria-label="Ordenar produtos"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="default">Ordenar por</option>
          <option value="price-asc">Menor preço</option>
          <option value="price-desc">Maior preço</option>
        </select>

        <button
          type="button"
          className={`${styles.favBtn} ${showFavoritesOnly ? styles.favBtnActive : ''}`}
          onClick={onToggleFavorites}
          aria-pressed={showFavoritesOnly}
        >
          Favoritos
        </button>

        <button type="button" className={styles.clearBtn} onClick={onClear}>
          Limpar
        </button>
      </div>
    </div>
  )
}

export default ProductFilters
