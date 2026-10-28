import { normalizeLength } from './tryOn.js'

/*
 * Lógica pura do quiz de recomendação.
 *
 * O quiz faz perguntas sobre as preferências da pessoa e recomenda produtos
 * reais de src/data/products.js. Nada aqui depende de React ou de navegador,
 * o que mantém a regra testável isoladamente (tests/quiz.model.test.js).
 *
 * As perguntas usam os atributos reais do catálogo:
 * - categoria (goal) -> categoria do produto
 * - textura (style)  -> product.texture
 * - comprimento      -> product.length, normalizado por normalizeLength
 * - cor (color)      -> product.color
 * - orçamento        -> faixa de product.price
 */

/*
 * Categorias que o quiz entende, mapeadas para os ids reais de
 * src/data/products.js. 'acessorio' inclui itens sem textura/comprimento.
 */
export const QUIZ_GOALS = [
  { id: 'peruca', label: 'Uma peruca completa', categoryId: 'wigs' },
  { id: 'lace', label: 'Uma lace frontal', categoryId: 'lace-front' },
  { id: 'extensao', label: 'Extensões e bundles', categoryId: 'cabelo-humano' },
  { id: 'rabo', label: 'Rabo de cavalo', categoryId: 'rabos-de-cavalo' },
  { id: 'acessorio', label: 'Acessórios e acabamento', categoryId: 'acessorios' },
]

export const QUIZ_STYLES = ['liso', 'ondulado', 'cacheado']

export const QUIZ_LENGTHS = ['curto', 'médio', 'longo']

export const QUIZ_COLORS = ['preto', 'castanho', 'mel', 'platinum']

/*
 * Faixas de orçamento em reais, alinhadas aos preços do catálogo.
 */
export const QUIZ_BUDGETS = [
  { id: 'ate-200', label: 'Até R$ 200', min: 0, max: 200 },
  { id: '200-500', label: 'R$ 200 a R$ 500', min: 200, max: 500 },
  { id: '500-1000', label: 'R$ 500 a R$ 1.000', min: 500, max: 1000 },
  { id: 'acima-1000', label: 'Acima de R$ 1.000', min: 1000, max: Infinity },
]

const WEIGHTS = {
  goal: 10,
  style: 3,
  length: 2,
  color: 2,
  budgetIn: 2,
  budgetOut: -4,
}

export function findGoal(goalId) {
  return QUIZ_GOALS.find((goal) => goal.id === goalId) ?? null
}

/*
 * Apenas a pergunta de objetivo é obrigatória: sem ela não há como saber
 * em qual categoria procurar. As demais afinam a recomendação.
 */
export function isQuizComplete(answers) {
  return Boolean(answers?.goal)
}

/*
 * Pontua um produto contra as respostas. Retorna null quando o produto não
 * pertence à categoria escolhida; caso contrário, um número que pode ser
 * negativo (orçamento fora da faixa).
 */
function scoreProduct(product, answers) {
  const goal = findGoal(answers.goal)
  if (!goal) return null
  if (product.categoryId !== goal.categoryId) return null

  let score = WEIGHTS.goal

  if (answers.style && product.texture === answers.style) score += WEIGHTS.style
  if (answers.length && normalizeLength(product.length) === answers.length)
    score += WEIGHTS.length
  if (answers.color && product.color === answers.color) score += WEIGHTS.color

  if (answers.budget) {
    const range = QUIZ_BUDGETS.find((item) => item.id === answers.budget)
    if (range) {
      const within =
        product.price >= range.min &&
        (range.max === Infinity || product.price < range.max)
      score += within ? WEIGHTS.budgetIn : WEIGHTS.budgetOut
    }
  }

  return score
}

/*
 * Achata o catálogo marcando cada produto com o id da sua categoria,
 * para que a pontuação possa comparar com o objetivo escolhido.
 */
function catalogEntries(categories) {
  const list = []
  for (const category of categories ?? []) {
    for (const product of category.products ?? []) {
      list.push({
        product: { ...product, categoryId: category.id },
        categoryTitle: category.title,
      })
    }
  }
  return list
}

/*
 * Todos os produtos da categoria escolhida, com a pontuação e a ordem do
 * catálogo preservadas. Lista vazia quando o objetivo ainda não foi dado.
 */
export function rankProducts(answers, categories) {
  if (!isQuizComplete(answers)) return []

  return catalogEntries(categories)
    .map((entry) => ({
      ...entry.product,
      categoryTitle: entry.categoryTitle,
      score: scoreProduct(entry.product, answers) ?? -Infinity,
    }))
    .filter((entry) => entry.score > -Infinity)
}

/*
 * Recomendação principal: determinística, o produto de maior pontuação
 * dentro da categoria escolhida. Empates são resolvidos pela ordem do
 * catálogo, então a mesma resposta sempre indica o mesmo produto.
 */
export function recommendProduct(answers, categories) {
  const ranked = rankProducts(answers, categories)
  if (ranked.length === 0) return null

  let best = ranked[0]
  for (const entry of ranked) {
    if (entry.score > best.score) best = entry
  }

  const { score: _score, ...product } = best
  return product
}

/*
 * Demais boas opções (exclui a principal), limitadas a `limit` itens,
 * ainda em ordem decrescente de aderência.
 */
export function recommendAlternatives(answers, categories, limit = 3) {
  const main = recommendProduct(answers, categories)
  const ranked = rankProducts(answers, categories)

  return ranked
    .filter((entry) => entry.id !== main?.id)
    .slice(0, limit)
    .map(({ score: _score, ...product }) => product)
}

export const QUIZ_QUESTIONS = [
  {
    id: 'goal',
    question: 'O que você procura hoje?',
    required: true,
  },
  {
    id: 'style',
    question: 'Qual textura você prefere?',
    required: false,
  },
  {
    id: 'length',
    question: 'Qual comprimento combina com você?',
    required: false,
  },
  {
    id: 'color',
    question: 'Qual cor você gostaria?',
    required: false,
  },
  {
    id: 'budget',
    question: 'Qual faixa de preço combina com o seu orçamento?',
    required: false,
  },
]
