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

const { default: Checkout } = await load('/src/components/Checkout/Checkout.jsx')
const { default: OrderSuccess } = await load(
  '/src/components/Checkout/OrderSuccess.jsx'
)
const { default: Cart } = await load('/src/components/Cart/Cart.jsx')
const { categories } = await load('/src/data/products.js')

const catalogProduct = categories[0].products[0]

const cartItems = [
  {
    id: catalogProduct.id,
    name: catalogProduct.name,
    price: catalogProduct.price,
    image: catalogProduct.image,
    category: categories[0].title,
    quantity: 2,
  },
]

const renderCheckout = (props = {}) =>
  renderToStaticMarkup(
    createElement(Checkout, {
      items: cartItems,
      onClose: () => {},
      onBackToStore: () => {},
      ...props,
    })
  )

test.after(() => vite.close())

test('o carrinho exibe o botão de finalizar compra', () => {
  const html = renderToStaticMarkup(
    createElement(Cart, {
      isOpen: true,
      items: cartItems,
      totalPrice: cartItems[0].price * cartItems[0].quantity,
      onClose: () => {},
      onIncrease: () => {},
      onDecrease: () => {},
      onRemove: () => {},
      onCheckout: () => {},
    })
  )

  assert.match(html, /Finalizar compra/)
})

test('o carrinho vazio informa que a sacola está vazia', () => {
  const html = renderToStaticMarkup(
    createElement(Cart, {
      isOpen: true,
      items: [],
      totalPrice: 0,
      onClose: () => {},
      onIncrease: () => {},
      onDecrease: () => {},
      onRemove: () => {},
      onCheckout: () => {},
    })
  )

  assert.match(html, /Sua sacola está vazia/)
})

test('o checkout abre com o formulário de identificação', () => {
  const html = renderCheckout()

  assert.match(html, /Finalizar compra/)
  assert.match(html, /Nome completo/)
  assert.match(html, /E-mail/)
  assert.match(html, /Revisar pedido/)
})

test('o resumo do pedido mostra produto, quantidade, preço unitário, subtotal e total', () => {
  const html = renderCheckout()

  assert.match(html, new RegExp(catalogProduct.name))
  assert.match(html, /2 ×/)
  assert.match(html, /R\$\s*280,00/)
  assert.match(html, /R\$\s*560,00/)
  assert.match(html, /Subtotal/)
  assert.match(html, /Total/)
  assert.match(html, /Wig Valentina/)
})

test('o checkout com a sacola vazia não permite concluir o pedido', () => {
  const html = renderCheckout({ items: [] })

  assert.match(html, /Não há produtos para finalizar/)
  assert.doesNotMatch(html, /Confirmar pedido/)
  assert.doesNotMatch(html, /Revisar pedido/)
})

test('a tela de sucesso exibe número do pedido, resumo, total e aviso de demonstração', () => {
  const html = renderToStaticMarkup(
    createElement(OrderSuccess, {
      order: {
        number: 'MAB-20261021-1234',
        customer: { name: 'Maria Eduarda Lima', email: 'maria@mabelle.com.br' },
        items: [
          {
            id: catalogProduct.id,
            name: catalogProduct.name,
            category: categories[0].title,
            image: catalogProduct.image,
            quantity: 2,
            unitPrice: catalogProduct.price,
            subtotal: catalogProduct.price * 2,
          },
        ],
        subtotal: catalogProduct.price * 2,
        total: catalogProduct.price * 2,
      },
      onBackToStore: () => {},
    })
  )

  assert.match(html, /Pedido confirmado/)
  assert.match(html, /MAB-20261021-1234/)
  assert.match(html, /Maria Eduarda Lima/)
  assert.match(html, /R\$\s*560,00/)
  assert.match(
    html,
    /Pedido demonstrativo concluído\. Nenhuma compra ou cobrança real foi realizada\./
  )
  assert.match(html, /Voltar à loja/)
})
