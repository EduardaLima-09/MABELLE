import { useState, useMemo } from 'react'
import Navbar from './presentation/navbar/Navbar.jsx'
import Hero from './presentation/hero/Hero.jsx'
import Sobre from './presentation/sobre/Sobre.jsx'
import CategorySection from './components/CategorySection/CategorySection.jsx'
import ProductFilters from './components/ProductFilters/ProductFilters.jsx'
import ProductModal from './components/ProductModal/ProductModal.jsx'
import WelcomeModal from './components/WelcomeModal/WelcomeModal.jsx'
import Cart from './components/Cart/Cart.jsx'
import Footer from './components/Footer/Footer.jsx'
import { useCart } from './viewmodel/useCart.js'
import { useFavorites } from './viewmodel/useFavorites.js'
import { categories } from './data/products.js'
import styles from './App.module.css'

function App() {
  const cart = useCart()
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTexture, setSelectedTexture] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [showWelcome, setShowWelcome] = useState(() => {
    try {
      return !localStorage.getItem('maison-welcome-seen')
    } catch {
      return true
    }
  })

  const closeWelcome = () => {
    setShowWelcome(false)
    try {
      localStorage.setItem('maison-welcome-seen', '1')
    } catch {
      // storage unavailable
    }
  }

  const filteredCategories = useMemo(() => {
    return categories
      .filter((cat) => !selectedCategory || cat.id === selectedCategory)
      .map((cat) => ({
        ...cat,
        products: cat.products
          .filter((p) => {
            if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
            if (selectedTexture && p.texture !== selectedTexture) return false
            if (showFavoritesOnly && !favorites.includes(p.id)) return false
            return true
          })
          .sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price
            if (sortBy === 'price-desc') return b.price - a.price
            return 0
          }),
      }))
      .filter((cat) => cat.products.length > 0)
  }, [search, selectedCategory, selectedTexture, sortBy, showFavoritesOnly, favorites])

  const clearFilters = () => {
    setSearch('')
    setSelectedCategory('')
    setSelectedTexture('')
    setSortBy('default')
    setShowFavoritesOnly(false)
  }

  const handleViewDetails = (product, categoryTitle) => {
    setSelectedProduct({ ...product, categoryTitle })
  }

  return (
    <div className={styles.main}>
      {showWelcome && <WelcomeModal onClose={closeWelcome} />}
      <Navbar totalItems={cart.totalItems} onOpenCart={cart.openCart} />
      <Hero />
      <Sobre />
      <ProductFilters
        categories={categories}
        search={search}
        onSearchChange={setSearch}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedTexture={selectedTexture}
        onTextureChange={setSelectedTexture}
        sortBy={sortBy}
        onSortChange={setSortBy}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
        onClear={clearFilters}
      />
      {filteredCategories.map((category) => (
        <CategorySection
          key={category.id}
          category={category}
          onAddToCart={cart.addToCart}
          onViewDetails={handleViewDetails}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />
      ))}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          categoryTitle={selectedProduct.categoryTitle}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={cart.addToCart}
        />
      )}
      <Cart
        isOpen={cart.isOpen}
        items={cart.items}
        totalPrice={cart.totalPrice}
        onClose={cart.closeCart}
        onIncrease={cart.increaseQuantity}
        onDecrease={cart.decreaseQuantity}
        onRemove={cart.removeItem}
      />
      <Footer />
    </div>
  )
}

export default App
