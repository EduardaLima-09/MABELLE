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

  return (
    <div className={styles.filtersArea}>
      <div className={styles.filters}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Buscar produto..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <select
          className={styles.select}
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
          className={styles.select}
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
          className={styles.select}
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="default">Ordenar por</option>
          <option value="price-asc">Menor preço</option>
          <option value="price-desc">Maior preço</option>
        </select>

        <button
          className={`${styles.favBtn} ${showFavoritesOnly ? styles.favBtnActive : ''}`}
          onClick={onToggleFavorites}
        >
          Favoritos
        </button>

        <button className={styles.clearBtn} onClick={onClear}>
          Limpar
        </button>
      </div>
    </div>
  )
}

export default ProductFilters
