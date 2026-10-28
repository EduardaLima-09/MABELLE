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

const { default: Provador } = await load('/src/presentation/provador/Provador.jsx')
const { categories } = await load('/src/data/products.js')
const { findExactMatches, findReferenceProduct } = await load(
  '/src/model/tryOn.js'
)

test.after(() => vite.close())

const render = () =>
  renderToStaticMarkup(
    createElement(Provador, {
      categories,
      onAddToCart: () => {},
      onViewDetails: () => {},
    })
  )

test('o provador exibe os quatro estilos, comprimentos e cores do catálogo', () => {
  const html = render()

  assert.match(html, /Liso/)
  assert.match(html, /Ondulado/)
  assert.match(html, /Cacheado/)
  assert.match(html, /Crespo/)
  assert.match(html, /Curto/)
  assert.match(html, /Médio/)
  assert.match(html, /Longo/)
  assert.match(html, /Preto/)
  assert.match(html, /Castanho/)
  assert.match(html, /Mel/)
  assert.match(html, /Platinum/)
})

test('o provador inicia com o estado vazio instrutivo e limpar desabilitado', () => {
  const html = render()

  assert.match(html, /Seu visual começa aqui/)
  assert.match(html, /Escolha o estilo, o comprimento e a cor/)
  assert.match(html, /Limpar escolhas/)
  assert.doesNotMatch(html, /Adicionar à sacola/)
  assert.doesNotMatch(html, /Correspondência exata/)
  assert.doesNotMatch(html, /R\$\s*\d/)
})

test('o provador sem seleções não exibe produtos do catálogo', () => {
  const html = render()

  const names = categories.flatMap((cat) => cat.products.map((p) => p.name))
  const shown = names.filter((name) => html.includes(name))
  assert.equal(shown.length, 0)
})

test('o catálogo real permite encontrar uma referência exata válida', () => {
  const reference = findReferenceProduct(
    { style: 'liso', length: 'longo', color: 'castanho' },
    categories
  )

  assert.ok(reference)
  assert.equal(reference.texture, 'liso')
  assert.equal(reference.color, 'castanho')
  assert.ok(reference.image)
  assert.ok(reference.price > 0)
})

test('o catálogo real não tem referência exata para crespo', () => {
  const reference = findReferenceProduct(
    { style: 'crespo', length: 'longo', color: 'preto' },
    categories
  )

  assert.equal(reference, null)
})

test('o catálogo real permite alternativas quando há mais de uma correspondência', () => {
  const exact = findExactMatches(
    { style: 'liso', length: 'longo', color: 'preto' },
    categories
  )

  assert.ok(exact.length >= 1)
  assert.ok(exact.length <= 4)
  for (const product of exact) {
    assert.equal(product.texture, 'liso')
    assert.equal(product.color, 'preto')
  }
})
