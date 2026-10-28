import test from 'node:test'
import assert from 'node:assert/strict'
import {
  describeDifferences,
  findAlternatives,
  findExactMatches,
  findReferenceProduct,
  findSuggestions,
  isSelectionComplete,
  normalizeLength,
  TRYON_COLORS,
  TRYON_LENGTHS,
  TRYON_STYLES,
} from '../src/model/tryOn.js'

const categories = [
  {
    id: 'wigs',
    title: 'Wigs',
    products: [
      { id: 'wigs-1', name: 'Wig A', price: 280, texture: 'liso', length: 'médio', color: 'castanho', image: 'a.jpg' },
      { id: 'wigs-2', name: 'Wig B', price: 320, texture: 'ondulado', length: 'longo', color: 'preto', image: 'b.jpg' },
      { id: 'wigs-3', name: 'Wig C', price: 290, texture: 'liso', length: 'curto', color: 'castanho', image: 'c.jpg' },
    ],
  },
  {
    id: 'cabelo-humano',
    title: 'Cabelo',
    products: [
      { id: 'ch-1', name: 'Bundle D', price: 890, texture: 'liso', length: '18"', color: 'preto', image: 'd.jpg' },
      { id: 'ch-2', name: 'Bundle E', price: 1090, texture: 'ondulado', length: '22"', color: 'mel', image: 'e.jpg' },
    ],
  },
  {
    id: 'acessorios',
    title: 'Acessórios',
    products: [
      { id: 'acc-1', name: 'Pente', price: 25, type: 'Pente', image: 'f.jpg' },
    ],
  },
]

test('normalizeLength converte polegadas nas faixas documentadas', () => {
  assert.equal(normalizeLength('18"'), 'médio')
  assert.equal(normalizeLength('20"'), 'médio')
  assert.equal(normalizeLength('22"'), 'longo')
  assert.equal(normalizeLength('24"'), 'longo')
  assert.equal(normalizeLength('26"'), 'longo')
})

test('normalizeLength mantém faixas descritivas e trata valores vazios', () => {
  assert.equal(normalizeLength('curto'), 'curto')
  assert.equal(normalizeLength('médio'), 'médio')
  assert.equal(normalizeLength('longo'), 'longo')
  assert.equal(normalizeLength(''), '')
  assert.equal(normalizeLength(undefined), '')
})

test('as listas de opções do provador contêm os quatro estilos', () => {
  assert.deepEqual(TRYON_STYLES, ['liso', 'ondulado', 'cacheado', 'crespo'])
  assert.deepEqual(TRYON_LENGTHS, ['curto', 'médio', 'longo'])
  assert.deepEqual(TRYON_COLORS, ['preto', 'castanho', 'mel', 'platinum'])
})

test('isSelectionComplete exige as três escolhas', () => {
  assert.equal(isSelectionComplete({ style: '', length: '', color: '' }), false)
  assert.equal(isSelectionComplete({ style: 'liso', length: '', color: '' }), false)
  assert.equal(isSelectionComplete({ style: 'liso', length: 'longo', color: '' }), false)
  assert.equal(isSelectionComplete({ style: 'liso', length: 'longo', color: 'preto' }), true)
})

test('correspondência exata retorna o produto real com categoria', () => {
  const reference = findReferenceProduct(
    { style: 'ondulado', length: 'longo', color: 'preto' },
    categories
  )

  assert.equal(reference.id, 'wigs-2')
  assert.equal(reference.categoryTitle, 'Wigs')
  assert.equal(reference.image, 'b.jpg')
})

test('correspondência exata compara comprimento por faixa, ignorando polegadas', () => {
  const reference = findReferenceProduct(
    { style: 'liso', length: 'médio', color: 'preto' },
    categories
  )

  assert.equal(reference.id, 'ch-1')
})

test('a referência é determinística: primeira correspondência na ordem do catálogo', () => {
  const withTwoMatches = [
    {
      id: 'duplos',
      title: 'Duplos',
      products: [
        { id: 'x-1', name: 'X1', price: 100, texture: 'liso', length: 'longo', color: 'mel', image: 'x1.jpg' },
        { id: 'x-2', name: 'X2', price: 200, texture: 'liso', length: 'longo', color: 'mel', image: 'x2.jpg' },
      ],
    },
  ]

  const reference = findReferenceProduct(
    { style: 'liso', length: 'longo', color: 'mel' },
    withTwoMatches
  )

  assert.equal(reference.id, 'x-1')
})

test('não há referência quando falta escolha obrigatória', () => {
  assert.equal(
    findReferenceProduct({ style: 'liso', length: 'longo', color: '' }, categories),
    null
  )
  assert.equal(
    findReferenceProduct({ style: '', length: '', color: '' }, categories),
    null
  )
})

test('não há referência sem correspondência exata, mesmo com parcial', () => {
  const reference = findReferenceProduct(
    { style: 'liso', length: 'curto', color: 'mel' },
    categories
  )

  assert.equal(reference, null)
})

test('crespo não gera referência nem correspondências quando não há produto', () => {
  const selections = { style: 'crespo', length: 'longo', color: 'preto' }

  assert.equal(findReferenceProduct(selections, categories), null)
  assert.deepEqual(findExactMatches(selections, categories), [])
})

test('produtos sem textura (acessórios) nunca entram na correspondência', () => {
  const accessoryOnly = [
    { id: 'acessorios', title: 'Acessórios', products: categories[2].products },
  ]

  assert.equal(
    findReferenceProduct({ style: 'liso', length: 'longo', color: 'mel' }, accessoryOnly),
    null
  )
  assert.ok(
    !findSuggestions(
      { style: 'liso', length: 'longo', color: 'mel' },
      accessoryOnly
    ).some((product) => product.id === 'acc-1')
  )
})

test('alternativas excluem a referência e limitam a três', () => {
  const multipleMatches = [
    {
      id: 'duplos',
      title: 'Duplos',
      products: [
        { id: 'x-1', name: 'X1', price: 100, texture: 'liso', length: 'longo', color: 'mel', image: 'x1.jpg' },
        { id: 'x-2', name: 'X2', price: 200, texture: 'liso', length: 'longo', color: 'mel', image: 'x2.jpg' },
        { id: 'x-3', name: 'X3', price: 300, texture: 'liso', length: 'longo', color: 'mel', image: 'x3.jpg' },
        { id: 'x-4', name: 'X4', price: 400, texture: 'liso', length: 'longo', color: 'mel', image: 'x4.jpg' },
        { id: 'x-5', name: 'X5', price: 500, texture: 'liso', length: 'longo', color: 'mel', image: 'x5.jpg' },
      ],
    },
  ]
  const selections = { style: 'liso', length: 'longo', color: 'mel' }
  const alternatives = findAlternatives(selections, multipleMatches)

  assert.equal(alternatives.length, 3)
  assert.ok(!alternatives.some((product) => product.id === 'x-1'))
  assert.deepEqual(
    alternatives.map((product) => product.id),
    ['x-2', 'x-3', 'x-4']
  )
})

test('sugestões nunca são correspondências exatas e trazem as diferenças', () => {
  const selections = { style: 'ondulado', length: 'longo', color: 'preto' }
  const suggestions = findSuggestions(selections, categories, ['wigs-2'])

  assert.ok(suggestions.length > 0)
  for (const suggestion of suggestions) {
    assert.notEqual(suggestion.id, 'wigs-2')
    assert.ok(suggestion.differences.length > 0)
  }
})

test('sugestões identificam as características diferentes', () => {
  const selections = { style: 'liso', length: 'curto', color: 'mel' }
  const suggestions = findSuggestions(selections, categories)
  const wigA = suggestions.find((product) => product.id === 'wigs-1')

  assert.ok(wigA)
  assert.deepEqual(
    wigA.differences.map((diff) => diff.field),
    ['length', 'color']
  )
  assert.equal(
    wigA.differences.find((diff) => diff.field === 'length').actual,
    'médio'
  )
})

test('sugestões excluem produtos sem nenhum ponto de aderência', () => {
  const selections = { style: 'crespo', length: 'curto', color: 'mel' }
  const suggestions = findSuggestions(selections, categories)

  assert.ok(!suggestions.some((product) => product.id === 'wigs-2'))
})

test('sugestões ordenam por aderência: estilo primeiro, depois cor/comprimento', () => {
  const selections = { style: 'ondulado', length: 'curto', color: 'mel' }
  const suggestions = findSuggestions(selections, categories)

  assert.equal(suggestions[0].id, 'ch-2')
})

test('sem seleção completa não há sugestões', () => {
  assert.deepEqual(
    findSuggestions({ style: 'liso', length: '', color: '' }, categories),
    []
  )
  assert.deepEqual(findSuggestions({ style: '', length: '', color: '' }, categories), [])
})

test('atualizar a escolha muda o produto de referência', () => {
  const base = { style: 'liso', length: '', color: '' }
  const first = findReferenceProduct({ ...base, length: 'curto', color: 'castanho' }, categories)
  const second = findReferenceProduct({ ...base, length: 'médio', color: 'castanho' }, categories)

  assert.equal(first.id, 'wigs-3')
  assert.equal(second.id, 'wigs-1')
})

test('describeDifferences devolve lista vazia para produto idêntico às escolhas', () => {
  const differences = describeDifferences(
    { texture: 'liso', length: '18"', color: 'preto' },
    { style: 'liso', length: 'médio', color: 'preto' }
  )

  assert.deepEqual(differences, [])
})
