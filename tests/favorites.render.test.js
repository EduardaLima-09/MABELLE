import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const vite = await createServer({
  configFile: fileURLToPath(new URL('../vite.config.js', import.meta.url)),
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'silent',
})

const load = (path) => vite.ssrLoadModule(path)

const { default: Favorites } = await load('/src/components/Favorites/Favorites.jsx')
const { default: Navbar } = await load('/src/presentation/navbar/Navbar.jsx')
const { categories } = await load('/src/data/products.js')
const { resolveFavorites } = await load('/src/model/favorites.js')

const catalogProduct = categories[0].products[0]
const favoriteItems = resolveFavorites(
  [catalogProduct.id, categories[1].products[0].id],
  categories
)

test.after(() => vite.close())

const renderFavorites = (props = {}) =>
  renderToStaticMarkup(
    createElement(Favorites, {
      isOpen: true,
      items: favoriteItems,
      onClose: () => {},
      onRemove: () => {},
      onClear: () => {},
      onViewDetails: () => {},
      onAddToCart: () => {},
      ...props,
    })
  )

test('a área de favoritos exibe o título Meus Favoritos', () => {
  const html = renderFavorites()

  assert.match(html, /Meus Favoritos/)
})

test('a área de favoritos lista os produtos salvos com nome e preço', () => {
  const html = renderFavorites()

  assert.match(html, new RegExp(catalogProduct.name))
  assert.match(html, new RegExp(categories[1].products[0].name))
  assert.match(html, /R\$\s*280,00/)
})

test('a área de favoritos vazia convida a favoritar produtos', () => {
  const html = renderFavorites({ items: [] })

  assert.match(html, /Você ainda não favoritou nenhum produto/)
  assert.match(html, /Toque no coração dos produtos para salvá-los aqui\./)
  assert.doesNotMatch(html, new RegExp(catalogProduct.name))
})

test('cada favorito permite remover, ver detalhes e adicionar à sacola', () => {
  const html = renderFavorites()

  assert.match(html, /Ver detalhes/)
  assert.match(html, /Remover/)
  assert.match(
    html,
    new RegExp(`Adicionar ${catalogProduct.name} à sacola`)
  )
})

test('a área de favoritos exibe botão para esvaziar a lista', () => {
  const html = renderFavorites()

  assert.match(html, /Esvaziar favoritos/)
})

test('o botão de esvaziar fica desabilitado quando não há favoritos', () => {
  const html = renderFavorites({ items: [] })

  assert.match(html, /disabled=""/)
})

test('o botão de favoritos da navbar mostra o contador', () => {
  const html = renderToStaticMarkup(
    createElement(Navbar, {
      totalItems: 0,
      onOpenCart: () => {},
      favoriteCount: 3,
      onOpenFavorites: () => {},
    })
  )

  assert.match(html, /Abrir favoritos, 3 itens/)
})

test('a navbar sem favoritos não exibe contador', () => {
  const html = renderToStaticMarkup(
    createElement(Navbar, {
      totalItems: 0,
      onOpenCart: () => {},
      favoriteCount: 0,
      onOpenFavorites: () => {},
    })
  )

  assert.match(html, /Abrir favoritos/)
  assert.doesNotMatch(html, /Abrir favoritos, /)
})
