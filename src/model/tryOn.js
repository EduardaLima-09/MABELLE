export const TRYON_STYLES = ['liso', 'ondulado', 'cacheado', 'crespo']

export const TRYON_LENGTHS = ['curto', 'médio', 'longo']

export const TRYON_COLORS = ['preto', 'castanho', 'mel', 'platinum']

/*
 * Regra de normalização de comprimentos, documentada conforme os dados
 * reais de src/data/products.js:
 * - Wigs e Lace Front usam faixas descritivas: 'curto', 'médio', 'longo'.
 * - Cabelo humano (bundles) e Rabos de Cavalo usam polegadas.
 * Mapeamento de polegadas para faixas:
 * - 18" e 20"  -> 'médio'
 * - 22", 24" e 26" -> 'longo'
 * A regra é testada em tests/tryOn.model.test.js.
 */
const INCH_TO_RANGE = {
  '18"': 'médio',
  '20"': 'médio',
  '22"': 'longo',
  '24"': 'longo',
  '26"': 'longo',
}

export function normalizeLength(length) {
  if (!length) return ''
  return INCH_TO_RANGE[length] ?? length
}

function hairProducts(categories) {
  const list = []
  for (const category of categories ?? []) {
    for (const product of category.products ?? []) {
      if (!product.texture) continue
      list.push({ product, category })
    }
  }
  return list
}

export function isSelectionComplete(selections) {
  const { style, length, color } = selections ?? {}
  return Boolean(style && length && color)
}

function matchesExactly(product, { style, length, color }) {
  return (
    product.texture === style &&
    normalizeLength(product.length) === length &&
    product.color === color
  )
}

function scoreMatch(product, { style, length, color }) {
  let score = 0
  if (style && product.texture === style) score += 2
  if (length && normalizeLength(product.length) === length) score += 1
  if (color && product.color === color) score += 1
  return score
}

function withCategory(entry) {
  return { ...entry.product, categoryTitle: entry.category.title }
}

/*
 * Todas as correspondências exatas (estilo, comprimento normalizado e cor
 * iguais às escolhas), na ordem do catálogo. Exige seleção completa.
 */
export function findExactMatches(selections, categories) {
  if (!isSelectionComplete(selections)) return []
  return hairProducts(categories)
    .filter(({ product }) => matchesExactly(product, selections))
    .map(withCategory)
}

/*
 * Referência principal: determinística, sempre a primeira correspondência
 * exata na ordem do catálogo. Retorna null quando a seleção está incompleta
 * ou quando não existe correspondência exata — nunca um produto parcial.
 */
export function findReferenceProduct(selections, categories) {
  return findExactMatches(selections, categories)[0] ?? null
}

/*
 * Demais correspondências exatas (exclui a referência principal),
 * limitadas a `limit` itens.
 */
export function findAlternatives(selections, categories, limit = 3) {
  return findExactMatches(selections, categories).slice(1, 1 + limit)
}

const FIELD_LABELS = {
  style: 'estilo',
  length: 'comprimento',
  color: 'cor',
}

/*
 * Lista as características em que o produto difere das escolhas.
 * O comprimento é comparado pela faixa normalizada, mas o valor
 * exibido é o dado real do produto (ex.: 18").
 */
export function describeDifferences(product, selections) {
  const differences = []
  if (product.texture !== selections.style) {
    differences.push({
      field: 'style',
      label: FIELD_LABELS.style,
      actual: product.texture,
    })
  }
  if (normalizeLength(product.length) !== selections.length) {
    differences.push({
      field: 'length',
      label: FIELD_LABELS.length,
      actual: product.length,
    })
  }
  if (product.color !== selections.color) {
    differences.push({
      field: 'color',
      label: FIELD_LABELS.color,
      actual: product.color,
    })
  }
  return differences
}

/*
 * Sugestões reais de produtos próximos: não são correspondências exatas.
 * Exige seleção completa. Considera apenas produtos com textura (ignora
 * acessórios), exclui os ids informados e qualquer correspondência exata,
 * e ordena por aderência (estilo pesa mais que comprimento/cor).
 * Cada sugestão traz `differences` com o que difere das escolhas.
 */
export function findSuggestions(
  selections,
  categories,
  excludeIds = [],
  limit = 3
) {
  if (!isSelectionComplete(selections)) return []

  const scored = []
  for (const entry of hairProducts(categories)) {
    if (excludeIds.includes(entry.product.id)) continue
    if (matchesExactly(entry.product, selections)) continue
    const score = scoreMatch(entry.product, selections)
    if (score <= 0) continue
    scored.push({ ...entry, score })
  }

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((entry) => ({
    ...withCategory(entry),
    differences: describeDifferences(entry.product, selections),
  }))
}
