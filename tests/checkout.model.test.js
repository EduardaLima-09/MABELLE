import test from 'node:test'
import assert from 'node:assert/strict'
import {
  canOpenCheckout,
  checkoutReducer,
  createDemoOrder,
  EMPTY_CART_MESSAGE,
  generateOrderNumber,
  initialCheckoutState,
  isCheckoutFormValid,
  summarizeOrder,
  validateCheckoutForm,
} from '../src/model/checkout.js'

const CART_ITEMS = [
  {
    id: 'wigs-1',
    name: 'Wig Valentina',
    price: 280,
    image: '/assets/wig.jpg',
    category: 'Wigs',
    quantity: 2,
  },
  {
    id: 'acessorios-3',
    name: 'Pente Baby Hair',
    price: 25,
    image: '/assets/pente.jpg',
    category: 'Acessórios',
    quantity: 1,
  },
]

const VALID_FORM = { name: 'Maria Eduarda Lima', email: 'maria@mabelle.com.br' }

test('validação exige nome completo e e-mail', () => {
  const errors = validateCheckoutForm({ name: '', email: '' })

  assert.ok(errors.name)
  assert.ok(errors.email)
  assert.equal(isCheckoutFormValid({ name: '', email: '' }), false)
})

test('validação exige nome e sobrenome', () => {
  const errors = validateCheckoutForm({ name: 'Maria', email: 'maria@mabelle.com.br' })

  assert.equal(errors.name, 'Informe nome e sobrenome.')
  assert.equal(errors.email, undefined)
})

test('validação aceita nomes e e-mails válidos', () => {
  const errors = validateCheckoutForm(VALID_FORM)

  assert.deepEqual(errors, {})
  assert.equal(isCheckoutFormValid(VALID_FORM), true)
})

test('validação recusa e-mails mal formatados', () => {
  const invalidEmails = ['maria', 'maria@', '@mabelle.com.br', 'maria@mabelle', 'maria @mabelle.com.br']

  invalidEmails.forEach((email) => {
    const errors = validateCheckoutForm({ name: VALID_FORM.name, email })
    assert.ok(errors.email, `esperava erro para o e-mail "${email}"`)
  })
})

test('resumo do pedido usa os dados do carrinho (produto, quantidade, preço e total)', () => {
  const summary = summarizeOrder(CART_ITEMS)

  assert.equal(summary.lines.length, 2)
  assert.equal(summary.lines[0].name, 'Wig Valentina')
  assert.equal(summary.lines[0].quantity, 2)
  assert.equal(summary.lines[0].unitPrice, 280)
  assert.equal(summary.lines[0].subtotal, 560)
  assert.equal(summary.lines[0].image, '/assets/wig.jpg')
  assert.equal(summary.subtotal, 585)
  assert.equal(summary.total, 585)
  assert.equal(summary.totalItems, 3)
})

test('resumo de carrinho vazio não gera valores', () => {
  const summary = summarizeOrder([])

  assert.deepEqual(summary.lines, [])
  assert.equal(summary.subtotal, 0)
  assert.equal(summary.total, 0)
})

test('número de pedido demonstrativo segue o padrão MAB', () => {
  const number = generateOrderNumber(new Date(2026, 9, 21), () => 0.1234)

  assert.equal(number, 'MAB-20261021-1234')
  assert.match(number, /^MAB-\d{8}-\d{4}$/)
})

test('pedido demonstrativo guarda cliente, itens e total', () => {
  const order = createDemoOrder({
    items: CART_ITEMS,
    customer: { name: '  Maria Eduarda Lima ', email: ' maria@mabelle.com.br ' },
    date: new Date(2026, 9, 21),
    random: () => 0.5,
  })

  assert.equal(order.number, 'MAB-20261021-5000')
  assert.equal(order.customer.name, 'Maria Eduarda Lima')
  assert.equal(order.customer.email, 'maria@mabelle.com.br')
  assert.equal(order.items.length, 2)
  assert.equal(order.total, 585)
})

test('fluxo não avança para a revisão com dados inválidos', () => {
  const state = checkoutReducer(initialCheckoutState, {
    type: 'review',
    items: CART_ITEMS,
  })

  assert.equal(state.step, 'dados')
  assert.ok(state.errors.name)
  assert.ok(state.errors.email)
})

test('fluxo avança para a revisão com dados válidos', () => {
  const filled = checkoutReducer(initialCheckoutState, {
    type: 'field',
    field: 'name',
    value: VALID_FORM.name,
  })
  const withEmail = checkoutReducer(filled, {
    type: 'field',
    field: 'email',
    value: VALID_FORM.email,
  })
  const state = checkoutReducer(withEmail, { type: 'review', items: CART_ITEMS })

  assert.equal(state.step, 'revisao')
  assert.deepEqual(state.errors, {})
})

test('fluxo bloqueia avanço e confirmação com o carrinho vazio', () => {
  const filled = checkoutReducer(initialCheckoutState, {
    type: 'field',
    field: 'name',
    value: VALID_FORM.name,
  })
  const withEmail = checkoutReducer(filled, {
    type: 'field',
    field: 'email',
    value: VALID_FORM.email,
  })

  const review = checkoutReducer(withEmail, { type: 'review', items: [] })
  const confirm = checkoutReducer(withEmail, { type: 'confirm', items: [] })

  assert.equal(review.step, 'dados')
  assert.equal(review.order, null)
  assert.equal(confirm.step, 'dados')
  assert.equal(confirm.order, null)
})

test('fluxo confirma o pedido e gera o resumo da compra', () => {
  const filled = checkoutReducer(initialCheckoutState, {
    type: 'field',
    field: 'name',
    value: VALID_FORM.name,
  })
  const withEmail = checkoutReducer(filled, {
    type: 'field',
    field: 'email',
    value: VALID_FORM.email,
  })
  const state = checkoutReducer(withEmail, { type: 'confirm', items: CART_ITEMS })

  assert.equal(state.step, 'concluido')
  assert.match(state.order.number, /^MAB-\d{8}-\d{4}$/)
  assert.equal(state.order.total, 585)
  assert.equal(state.order.items.length, 2)
  assert.equal(state.order.items[0].image, '/assets/wig.jpg')
})

test('erro de um campo é removido assim que o usuário corrige', () => {
  const invalid = checkoutReducer(initialCheckoutState, {
    type: 'review',
    items: CART_ITEMS,
  })
  const fixed = checkoutReducer(invalid, {
    type: 'field',
    field: 'email',
    value: VALID_FORM.email,
  })

  assert.equal(fixed.errors.email, undefined)
  assert.ok(fixed.errors.name)
})

test('estado inicial não possui pedido nem erros', () => {
  assert.equal(initialCheckoutState.step, 'dados')
  assert.equal(initialCheckoutState.order, null)
  assert.deepEqual(initialCheckoutState.errors, {})
  assert.deepEqual(initialCheckoutState.form, { name: '', email: '' })
})

test('a finalização só é permitida com itens na sacola', () => {
  assert.equal(canOpenCheckout([]), false)
  assert.equal(canOpenCheckout(CART_ITEMS), true)
  assert.match(
    EMPTY_CART_MESSAGE,
    /Sua sacola está vazia\. Adicione produtos antes de finalizar a compra\./
  )
})
