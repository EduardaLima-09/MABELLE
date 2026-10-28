import test from 'node:test'
import assert from 'node:assert/strict'
import {
  findGoal,
  isQuizComplete,
  QUIZ_BUDGETS,
  QUIZ_COLORS,
  QUIZ_GOALS,
  QUIZ_LENGTHS,
  QUIZ_QUESTIONS,
  QUIZ_STYLES,
  rankProducts,
  recommendAlternatives,
  recommendProduct,
} from '../src/model/quiz.js'

const categories = [
  {
    id: 'wigs',
    title: 'Wigs',
    products: [
      { id: 'wigs-1', name: 'Wig A', price: 280, texture: 'liso', length: 'médio', color: 'castanho', image: 'a.jpg' },
      { id: 'wigs-2', name: 'Wig B', price: 320, texture: 'ondulado', length: 'longo', color: 'preto', image: 'b.jpg' },
      { id: 'wigs-3', name: 'Wig C', price: 190, texture: 'liso', length: 'curto', color: 'preto', image: 'c.jpg' },
    ],
  },
  {
    id: 'lace-front',
    title: 'Lace Front',
    products: [
      { id: 'lace-1', name: 'Lace D', price: 480, texture: 'liso', length: 'longo', color: 'preto', image: 'd.jpg' },
    ],
  },
  {
    id: 'cabelo-humano',
    title: 'Cabelo',
    products: [
      { id: 'ch-1', name: 'Bundle E', price: 1090, texture: 'ondulado', length: '22"', color: 'mel', image: 'e.jpg' },
    ],
  },
  {
    id: 'rabos-de-cavalo',
    title: 'Rabos de Cavalo',
    products: [
      { id: 'rabo-1', name: 'Rabo H', price: 180, texture: 'liso', length: '20"', color: 'preto', image: 'h.jpg' },
    ],
  },
  {
    id: 'acessorios',
    title: 'Acessórios',
    products: [
      { id: 'acc-1', name: 'Pente', price: 25, image: 'f.jpg' },
      { id: 'acc-2', name: 'Kit', price: 120, image: 'g.jpg' },
    ],
  },
]

test('as listas de opções do quiz são estáveis e documentadas', () => {
  assert.deepEqual(QUIZ_STYLES, ['liso', 'ondulado', 'cacheado'])
  assert.deepEqual(QUIZ_LENGTHS, ['curto', 'médio', 'longo'])
  assert.deepEqual(QUIZ_COLORS, ['preto', 'castanho', 'mel', 'platinum'])
  assert.equal(QUIZ_GOALS.length, 5)
  assert.equal(QUIZ_BUDGETS.length, 4)
})

test('os objetivos do quiz apontam para ids reais do catálogo', () => {
  const ids = categories.map((category) => category.id)

  for (const goal of QUIZ_GOALS) {
    assert.ok(ids.includes(goal.categoryId), `${goal.id} -> ${goal.categoryId}`)
  }
})

test('isQuizComplete exige apenas o objetivo', () => {
  assert.equal(isQuizComplete({}), false)
  assert.equal(isQuizComplete({ style: 'liso' }), false)
  assert.equal(isQuizComplete({ goal: 'peruca' }), true)
  assert.equal(isQuizComplete(undefined), false)
})

test('findGoal devolve a categoria do objetivo ou null', () => {
  assert.equal(findGoal('peruca').categoryId, 'wigs')
  assert.equal(findGoal('acessorio').categoryId, 'acessorios')
  assert.equal(findGoal('inexistente'), null)
})

test('rankProducts devolve lista vazia sem objetivo', () => {
  assert.deepEqual(rankProducts({ style: 'liso' }, categories), [])
  assert.deepEqual(rankProducts({}, categories), [])
})

test('rankProducts considera apenas a categoria escolhida', () => {
  const ranked = rankProducts({ goal: 'peruca' }, categories)

  assert.equal(ranked.length, 3)
  assert.ok(ranked.every((product) => product.id.startsWith('wigs-')))
})

test('a recomendação responde às perguntas de textura, comprimento e cor', () => {
  const product = recommendProduct(
    { goal: 'peruca', style: 'ondulado', length: 'longo', color: 'preto' },
    categories
  )

  assert.equal(product.id, 'wigs-2')
  assert.equal(product.name, 'Wig B')
  assert.equal(product.categoryTitle, 'Wigs')
})

test('o comprimento em polegadas é comparado pela faixa normalizada', () => {
  const ranked = rankProducts(
    { goal: 'extensao', length: 'longo', color: 'mel' },
    categories
  )

  assert.equal(ranked[0].id, 'ch-1')
})

test('a recomendação é determinística em empates', () => {
  const answers = { goal: 'acessorio' }
  const first = recommendProduct(answers, categories)
  const second = recommendProduct(answers, categories)

  assert.equal(first.id, 'acc-1')
  assert.equal(second.id, 'acc-1')
})

test('o orçamento dentro da faixa é premiado e fora é penalizado', () => {
  const inBudget = recommendProduct(
    { goal: 'peruca', budget: 'ate-200' },
    categories
  )
  const outBudget = recommendProduct(
    { goal: 'peruca', budget: 'acima-1000' },
    categories
  )

  assert.equal(inBudget.id, 'wigs-3')
  assert.notEqual(outBudget.id, 'wigs-3')
})

test('sem objetivo não há recomendação nem alternativas', () => {
  assert.equal(recommendProduct({ style: 'liso' }, categories), null)
  assert.deepEqual(recommendAlternatives({ style: 'liso' }, categories), [])
})

test('alternativas excluem a recomendação principal e limitam a três', () => {
  const answers = { goal: 'peruca' }
  const main = recommendProduct(answers, categories)
  const alternatives = recommendAlternatives(answers, categories, 2)

  assert.equal(alternatives.length, 2)
  assert.ok(!alternatives.some((product) => product.id === main.id))
})

test('acessórios sem textura entram no quiz sem quebrar a pontuação', () => {
  const product = recommendProduct(
    { goal: 'acessorio', style: 'liso' },
    categories
  )

  assert.ok(product)
  assert.ok(product.id.startsWith('acc-'))
})

test('o catálogo original não é alterado pela recomendação', () => {
  const snapshot = JSON.stringify(categories)

  recommendProduct({ goal: 'peruca', style: 'liso' }, categories)
  rankProducts({ goal: 'peruca' }, categories)

  assert.equal(JSON.stringify(categories), snapshot)
})

test('as perguntas do quiz cobrem as cinco dimensões', () => {
  const ids = QUIZ_QUESTIONS.map((question) => question.id)

  assert.deepEqual(ids, ['goal', 'style', 'length', 'color', 'budget'])
  assert.equal(
    QUIZ_QUESTIONS.find((question) => question.id === 'goal').required,
    true
  )
})
