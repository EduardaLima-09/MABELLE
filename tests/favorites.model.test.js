import test from 'node:test'
import assert from 'node:assert/strict'
import {
  countFavorites,
  findProductById,
  resolveFavorites,
} from '../src/model/favorites.js'

const categories = [
  {
    id: 'wigs',
    title: 'Wigs',
    products: [
      { id: 'wigs-1', name: 'Wig A', price: 280, image: 'a.jpg' },
      { id: 'wigs-2', name: 'Wig B', price: 320, image: 'b.jpg' },
    ],
  },
  {
    id: 'acessorios',
    title: 'Acessórios',
    products: [{ id: 'acc-1', name: 'Pente', price: 25, image: 'c.jpg' }],
  },
]

test('findProductById retorna o produto com a categoria anexada', () => {
  const product = findProductById('wigs-2', categories)

  assert.equal(product.id, 'wigs-2')
  assert.equal(product.name, 'Wig B')
  assert.equal(product.categoryTitle, 'Wigs')
  assert.equal(product.image, 'b.jpg')
})

test('findProductById percorre todas as categorias', () => {
  const product = findProductById('acc-1', categories)

  assert.equal(product.name, 'Pente')
  assert.equal(product.categoryTitle, 'Acessórios')
})

test('findProductById devolve null para id inexistente ou lista vazia', () => {
  assert.equal(findProductById('nao-existe', categories), null)
  assert.equal(findProductById('wigs-1', []), null)
  assert.equal(findProductById('wigs-1', undefined), null)
})

test('resolveFavorites mantém a ordem em que foram favoritados', () => {
  const resolved = resolveFavorites(['acc-1', 'wigs-1'], categories)

  assert.deepEqual(
    resolved.map((product) => product.id),
    ['acc-1', 'wigs-1']
  )
})

test('resolveFavorites ignora ids que saíram do catálogo', () => {
  const resolved = resolveFavorites(['wigs-1', 'removido', 'acc-1'], categories)

  assert.deepEqual(
    resolved.map((product) => product.id),
    ['wigs-1', 'acc-1']
  )
})

test('resolveFavorites devolve lista vazia sem ids', () => {
  assert.deepEqual(resolveFavorites([], categories), [])
  assert.deepEqual(resolveFavorites(undefined, categories), [])
})

test('countFavorites conta os ids favoritados', () => {
  assert.equal(countFavorites(['wigs-1', 'acc-1']), 2)
  assert.equal(countFavorites([]), 0)
  assert.equal(countFavorites(undefined), 0)
})
