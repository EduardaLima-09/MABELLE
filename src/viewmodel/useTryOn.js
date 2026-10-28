import { useCallback, useMemo, useState } from 'react'
import {
  findAlternatives,
  findReferenceProduct,
  findSuggestions,
  isSelectionComplete,
} from '../model/tryOn.js'

const EMPTY_SELECTIONS = { style: '', length: '', color: '' }

export function useTryOn(categories) {
  const [selections, setSelections] = useState(EMPTY_SELECTIONS)

  const selectOption = useCallback((field, value) => {
    setSelections((prev) => ({
      ...prev,
      [field]: prev[field] === value ? '' : value,
    }))
  }, [])

  const clearSelections = useCallback(() => setSelections(EMPTY_SELECTIONS), [])

  const complete = isSelectionComplete(selections)

  const reference = useMemo(
    () => findReferenceProduct(selections, categories),
    [selections, categories]
  )

  const alternatives = useMemo(
    () => findAlternatives(selections, categories, 3),
    [selections, categories]
  )

  const suggestions = useMemo(
    () =>
      findSuggestions(
        selections,
        categories,
        [reference?.id, ...alternatives.map((product) => product.id)],
        3
      ),
    [selections, categories, reference, alternatives]
  )

  return {
    selections,
    complete,
    selectOption,
    clearSelections,
    reference,
    alternatives,
    suggestions,
  }
}
