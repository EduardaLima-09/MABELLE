import { useCallback, useMemo, useState } from 'react'
import {
  isQuizComplete,
  QUIZ_QUESTIONS,
  recommendAlternatives,
  recommendProduct,
} from '../model/quiz.js'

const EMPTY_ANSWERS = {
  goal: '',
  style: '',
  length: '',
  color: '',
  budget: '',
}

export function useQuiz(categories) {
  const [answers, setAnswers] = useState(EMPTY_ANSWERS)
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)

  const selectAnswer = useCallback((field, value) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: prev[field] === value ? '' : value,
    }))
  }, [])

  const start = useCallback(() => setStarted(true), [])

  const restart = useCallback(() => {
    setAnswers(EMPTY_ANSWERS)
    setFinished(false)
  }, [])

  const finish = useCallback(() => {
    if (!isQuizComplete(answers)) return false
    setFinished(true)
    return true
  }, [answers])

  const complete = isQuizComplete(answers)

  const recommendation = useMemo(
    () => (finished ? recommendProduct(answers, categories) : null),
    [finished, answers, categories]
  )

  const alternatives = useMemo(
    () => (finished ? recommendAlternatives(answers, categories, 3) : []),
    [finished, answers, categories]
  )

  return {
    questions: QUIZ_QUESTIONS,
    answers,
    started,
    finished,
    complete,
    recommendation,
    alternatives,
    selectAnswer,
    start,
    finish,
    restart,
  }
}
