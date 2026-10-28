import { useCallback, useState, useMemo } from 'react'
import Navbar from './presentation/navbar/Navbar.jsx'
import Hero from './presentation/hero/Hero.jsx'
import Sobre from './presentation/sobre/Sobre.jsx'
import Depoimentos from './presentation/depoimentos/Depoimentos.jsx'
import Faq from './presentation/faq/Faq.jsx'
import Queridinhos from './presentation/queridinhos/Queridinhos.jsx'
import Provador from './presentation/provador/Provador.jsx'
import CategorySection from './components/CategorySection/CategorySection.jsx'
import ProductFilters from './components/ProductFilters/ProductFilters.jsx'
import ProductModal from './components/ProductModal/ProductModal.jsx'
import WelcomeModal from './components/WelcomeModal/WelcomeModal.jsx'
import Cart from './components/Cart/Cart.jsx'
import Checkout from './components/Checkout/Checkout.jsx'
import Footer from './components/Footer/Footer.jsx'
import { useCart } from './viewmodel/useCart.js'
import { useFavorites } from './viewmodel/useFavorites.js'
import { canOpenCheckout } from './model/checkout.js'
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
  const [showWelcome, setShowWelcome] = useState(true)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const closeWelcome = useCallback(() => {
    setShowWelcome(false)
  }, [])

  const exploreWelcome = useCallback(() => {
    closeWelcome()
    const prefersReducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches
    window.requestAnimationFrame(() => {
      document
        .getElementById('produtos')
        ?.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        })
    })
  }, [closeWelcome])

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

  const openCheckout = useCallback(() => {
    if (!canOpenCheckout(cart.items)) return

    cart.closeCart()
    setIsCheckoutOpen(true)
  }, [cart])

  const closeCheckout = useCallback(() => {
    setIsCheckoutOpen(false)
  }, [])

  const backToStore = useCallback(() => {
    setIsCheckoutOpen(false)
    const prefersReducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches
    window.requestAnimationFrame(() => {
      document.getElementById('produtos')?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      })
    })
  }, [])

  return (
    <div className={styles.main}>
      <Navbar totalItems={cart.totalItems} onOpenCart={cart.openCart} />
      <Hero />
      <Sobre />
      <Queridinhos onAddToCart={cart.addToCart} />
      <Provador
        categories={categories}
        onAddToCart={cart.addToCart}
        onViewDetails={handleViewDetails}
      />
      <section id="produtos" className={styles.catalog}>
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
        {filteredCategories.map((category, index) => (
          <CategorySection
            key={category.id}
            category={category}
            index={index}
            onAddToCart={cart.addToCart}
            onViewDetails={handleViewDetails}
            onToggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
          />
        ))}
      </section>
      <Depoimentos />
      <Faq />
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
        onCheckout={openCheckout}
      />
      {isCheckoutOpen && (
        <Checkout
          items={cart.items}
          onClose={closeCheckout}
          onBackToStore={backToStore}
        />
      )}
      <Footer />
      {showWelcome && (
        <WelcomeModal onClose={closeWelcome} onExplore={exploreWelcome} />
      )}
    </div>
  )
}

export default App
