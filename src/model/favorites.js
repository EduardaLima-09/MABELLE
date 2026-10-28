/*
 * Lógica pura de favoritos.
 *
 * useFavorites guarda apenas os ids no localStorage; a área própria de
 * favoritos precisa resolver esses ids para produtos completos do catálogo
 * (src/data/products.js). A resolução é feita aqui para ficar testável
 * sem React e sem navegador.
 */

/*
 * Localiza um produto pelo id em qualquer categoria do catálogo.
 * Retorna o produto com `categoryTitle` anexado, ou null.
 */
export function findProductById(id, categories) {
  for (const category of categories ?? []) {
    const product = (category.products ?? []).find((item) => item.id === id)
    if (product) {
      return { ...product, categoryTitle: category.title }
    }
  }
  return null
}

/*
 * Converte a lista de ids favoritados em produtos completos, na ordem em
 * que foram favoritados. Ids que não existem mais no catálogo são ignorados
 * (catálogo pode mudar entre sessões).
 */
export function resolveFavorites(ids, categories) {
  const resolved = []
  for (const id of ids ?? []) {
    const product = findProductById(id, categories)
    if (product) resolved.push(product)
  }
  return resolved
}

export function countFavorites(ids) {
  return (ids ?? []).length
}
