import { useCallback, useMemo, useReducer } from 'react'
import {
  checkoutReducer,
  initialCheckoutState,
  summarizeOrder,
} from '../model/checkout.js'

export function useCheckout({ items = [] } = {}) {
  const [state, dispatch] = useReducer(checkoutReducer, initialCheckoutState)

  const summary = useMemo(() => summarizeOrder(items), [items])
  const isEmpty = items.length === 0

  const setField = useCallback((field, value) => {
    dispatch({ type: 'field', field, value })
  }, [])

  const goToReview = useCallback(() => {
    dispatch({ type: 'review', items })
  }, [items])

  const backToForm = useCallback(() => {
    dispatch({ type: 'back' })
  }, [])

  const confirmOrder = useCallback(() => {
    dispatch({ type: 'confirm', items })
  }, [items])

  const reset = useCallback(() => {
    dispatch({ type: 'reset' })
  }, [])

  return {
    step: state.step,
    form: state.form,
    errors: state.errors,
    order: state.order,
    summary,
    isEmpty,
    setField,
    goToReview,
    backToForm,
    confirmOrder,
    reset,
  }
}
