export const CHECKOUT_STEPS = [
  { id: 'dados', label: 'Identificação' },
  { id: 'revisao', label: 'Revisão' },
  { id: 'concluido', label: 'Concluído' },
]

export const DEMO_DISCLAIMER =
  'Pedido demonstrativo concluído. Nenhuma compra ou cobrança real foi realizada.'

export const EMPTY_CART_MESSAGE =
  'Sua sacola está vazia. Adicione produtos antes de finalizar a compra.'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/

export const initialCheckoutState = {
  step: 'dados',
  form: { name: '', email: '' },
  errors: {},
  order: null,
}

export function validateCheckoutForm(values = {}) {
  const errors = {}
  const name = (values.name ?? '').trim()
  const email = (values.email ?? '').trim()

  if (!name) {
    errors.name = 'Informe seu nome completo.'
  } else if (name.split(/\s+/).filter(Boolean).length < 2) {
    errors.name = 'Informe nome e sobrenome.'
  }

  if (!email) {
    errors.email = 'Informe seu e-mail.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Informe um e-mail válido, como nome@dominio.com.'
  }

  return errors
}

export function isCheckoutFormValid(values = {}) {
  return Object.keys(validateCheckoutForm(values)).length === 0
}

export function canOpenCheckout(items = []) {
  return items.length > 0
}

export function summarizeOrder(items = []) {
  const lines = items.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category ?? '',
    image: item.image ?? '',
    quantity: item.quantity,
    unitPrice: item.price,
    subtotal: item.price * item.quantity,
  }))

  const subtotal = lines.reduce((sum, line) => sum + line.subtotal, 0)
  const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0)

  return { lines, subtotal, total: subtotal, totalItems }
}

export function generateOrderNumber(date = new Date(), random = Math.random) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const suffix = String(Math.floor(random() * 10000)).padStart(4, '0')

  return `MAB-${year}${month}${day}-${suffix}`
}

export function createDemoOrder({ items = [], customer = {}, date, random } = {}) {
  const summary = summarizeOrder(items)

  return {
    number: generateOrderNumber(date, random),
    customer: {
      name: (customer.name ?? '').trim(),
      email: (customer.email ?? '').trim(),
    },
    items: summary.lines,
    subtotal: summary.subtotal,
    total: summary.total,
    totalItems: summary.totalItems,
  }
}

function clearFieldError(errors, field) {
  if (!errors[field]) return errors
  const next = { ...errors }
  delete next[field]
  return next
}

export function checkoutReducer(state, action) {
  switch (action.type) {
    case 'field':
      return {
        ...state,
        form: { ...state.form, [action.field]: action.value },
        errors: clearFieldError(state.errors, action.field),
      }

    case 'review': {
      if (!action.items?.length) return state
      const errors = validateCheckoutForm(state.form)
      if (Object.keys(errors).length > 0) {
        return { ...state, errors, step: 'dados' }
      }
      return { ...state, errors: {}, step: 'revisao' }
    }

    case 'back':
      return { ...state, step: 'dados' }

    case 'confirm': {
      if (!action.items?.length) return state
      const errors = validateCheckoutForm(state.form)
      if (Object.keys(errors).length > 0) {
        return { ...state, errors, step: 'dados' }
      }
      return {
        ...state,
        errors: {},
        order: createDemoOrder({ items: action.items, customer: state.form }),
        step: 'concluido',
      }
    }

    case 'reset':
      return { ...initialCheckoutState }

    default:
      return state
  }
}
