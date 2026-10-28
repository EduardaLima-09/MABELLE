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

const { default: Quiz } = await load('/src/presentation/quiz/Quiz.jsx')
const { categories } = await load('/src/data/products.js')

test.after(() => vite.close())

const renderQuiz = (props = {}) =>
  renderToStaticMarkup(
    createElement(Quiz, {
      categories,
      onAddToCart: () => {},
      onViewDetails: () => {},
      onToggleFavorite: () => {},
      isFavorite: () => false,
      ...props,
    })
  )

test('o quiz exibe título, subtítulo e botão de início', () => {
  const html = renderQuiz()

  assert.match(html, /Descubra o cabelo ideal para você/)
  assert.match(html, /Começar o quiz/)
})

test('o quiz anuncia o número de perguntas na introdução', () => {
  const html = renderQuiz()

  assert.match(html, /5 perguntas rápidas/)
})

test('o quiz não mostra a pergunta antes de começar', () => {
  const html = renderQuiz()

  assert.doesNotMatch(html, /O que você procura hoje\?/)
})

test('a seção do quiz está presente na aplicação com id âncora', () => {
  const html = renderQuiz()

  assert.match(html, /id="quiz"/)
})
