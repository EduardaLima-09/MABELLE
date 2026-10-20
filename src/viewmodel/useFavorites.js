import { useState, useEffect } from 'react'

const STORAGE_KEY = 'maison-favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // storage unavailable
    }
  }, [favorites])

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    )
  }

  const isFavorite = (id) => favorites.includes(id)

  return { favorites, toggleFavorite, isFavorite }
}
