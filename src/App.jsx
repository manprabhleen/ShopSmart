import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import FilterSidebar from './components/FilterSidebar';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import ComparisonPanel from './components/ComparisonPanel';
import CartDrawer from './components/CartDrawer';
import AIShopperModule from './components/AIShopperModule';
import SupportRAGModule from './components/SupportRAGModule';
import OrderTrackingModule from './components/OrderTrackingModule';
import { MOCK_PRODUCTS, USER_PROFILE } from './data/mockProducts';
import { Sparkles, Layers, SlidersHorizontal, ArrowRight, ShoppingBag } from 'lucide-react';

export default function App() {
  // Navigation & UI state
  const [activeTab, setActiveTab] = useState('store'); // 'store' | 'ai-shopper' | 'support' | 'compare' | 'orders'
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveApi, setIsLiveApi] = useState(false);

  // Storefront Filter state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('recommended'); // 'recommended' | 'price-low' | 'price-high' | 'rating'

  // Collections & Selections
  const [cartItems, setCartItems] = useState([
    { ...MOCK_PRODUCTS[0], quantity: 1 }
  ]);
  const [wishlistIds, setWishlistIds] = useState(['LAP101']);
  const [comparedIds, setComparedIds] = useState(['LAP101', 'LAP102']);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [latestOrderId, setLatestOrderId] = useState('ORD-2026-8941');

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((prod) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(q);
        const matchesBrand = prod.brand.toLowerCase().includes(q);
        const matchesCategory = prod.category.toLowerCase().includes(q);
        const matchesTags = prod.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesTags) return false;
      }

      // Category
      if (selectedCategory !== 'All' && prod.category !== selectedCategory) return false;

      // Brand
      if (selectedBrand !== 'All' && prod.brand !== selectedBrand) return false;

      // Price
      if (prod.price > maxPrice) return false;

      // In Stock
      if (inStockOnly && prod.availability === 'OUT_OF_STOCK') return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // recommended
    });
  }, [searchQuery, selectedCategory, selectedBrand, maxPrice, inStockOnly, sortBy]);

  // Cart actions
  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveCartItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  // Wishlist actions
  const handleToggleWishlist = (productId) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Compare actions
  const handleToggleCompare = (productId) => {
    setComparedIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 products at a time.');
        return prev;
      }
      return [...prev, productId];
    });
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setMaxPrice(2000);
    setInStockOnly(false);
    setSearchQuery('');
  };

  // Checkout action
  const handleCheckout = () => {
    const newOrd = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setLatestOrderId(newOrd);
    setCartItems([]);
    setIsCartOpen(false);
    setActiveTab('orders');
  };

  const comparedProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => comparedIds.includes(p.id));
  }, [comparedIds]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlistIds.length}
        compareCount={comparedIds.length}
        setIsCartOpen={setIsCartOpen}
        isLiveApi={isLiveApi}
        setIsLiveApi={setIsLiveApi}
        userProfile={USER_PROFILE}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Tab 1: Storefront */}
        {activeTab === 'store' && (
          <div className="space-y-6">
            {/* Storefront Hero / AI Assistant Callout */}
            <div className="relative bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 overflow-hidden backdrop-blur-md">
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> ShopSmart AI Co-Pilot Available
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Discover Products Powered by Intent & Agentic AI
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Browse our catalog with intelligent filters or ask our AI Shopping Co-Pilot to analyze your technical specs and budget requirements.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveTab('ai-shopper')}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-purple-600/30 transition-all active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" /> Launch AI Shopper
                  </button>
                  <button
                    onClick={() => setActiveTab('support')}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl font-semibold text-xs transition-colors"
                  >
                    View Policy RAG Assistant
                  </button>
                </div>
              </div>
            </div>

            {/* Catalog Layout: Filter Sidebar + Product Grid */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Sidebar */}
              <FilterSidebar
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                resetFilters={handleResetFilters}
              />

              {/* Grid Area */}
              <div className="flex-1 space-y-4">
                {/* Controls Bar */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-slate-400 font-medium">
                    Showing <strong className="text-slate-100">{filteredProducts.length}</strong> products
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-400 font-medium">Sort by:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="recommended">Featured / AI Recommended</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Customer Rating</option>
                    </select>
                  </div>
                </div>

                {/* Product Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                    <p className="text-slate-400 text-sm">No products match your current search filters.</p>
                    <button
                      onClick={handleResetFilters}
                      className="text-xs text-indigo-400 font-bold hover:underline"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onOpenDetails={setSelectedDetailProduct}
                        isWishlisted={wishlistIds.includes(product.id)}
                        onToggleWishlist={handleToggleWishlist}
                        isCompared={comparedIds.includes(product.id)}
                        onToggleCompare={handleToggleCompare}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: AI Shopping Co-Pilot */}
        {activeTab === 'ai-shopper' && (
          <AIShopperModule
            onAddToCart={handleAddToCart}
            onToggleCompare={handleToggleCompare}
            comparedIds={comparedIds}
            isLiveApi={isLiveApi}
            onOpenDetails={setSelectedDetailProduct}
          />
        )}

        {/* Tab 3: RAG Customer Knowledge */}
        {activeTab === 'support' && (
          <SupportRAGModule isLiveApi={isLiveApi} />
        )}

        {/* Tab 4: Compare Panel */}
        {activeTab === 'compare' && (
          <ComparisonPanel
            comparedProducts={comparedProducts}
            onRemoveFromCompare={handleToggleCompare}
            onAddToCart={handleAddToCart}
            onBackToStore={() => setActiveTab('store')}
          />
        )}

        {/* Tab 5: Order Tracking */}
        {activeTab === 'orders' && (
          <OrderTrackingModule latestOrderId={latestOrderId} />
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedDetailProduct}
        onClose={() => setSelectedDetailProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckout}
        userProfile={USER_PROFILE}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        ShopSmart AI Autonomous Platform • Hackathon Edition
      </footer>
    </div>
  );
}
