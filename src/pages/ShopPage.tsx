import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { ProductCategory } from '../types';
import { 
  Filter, 
  SlidersHorizontal, 
  Search, 
  Sparkles, 
  X, 
  ArrowUpDown,
  ShoppingBag,
  Percent
} from 'lucide-react';

interface ShopPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
  initialCategory?: ProductCategory | 'all';
  initialSearch?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({ 
  onNavigate, 
  initialCategory = 'all', 
  initialSearch = '' 
}) => {
  const { products, wholesaleSettings } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [wholesaleMode, setWholesaleMode] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-low' | 'price-high' | 'rating'>('newest');
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state if props change
  React.useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  React.useEffect(() => {
    if (initialSearch) setSearchQuery(initialSearch);
  }, [initialSearch]);

  const categories = [
    { id: 'all', label: 'All Creations' },
    { id: 'clothing', label: 'Clothing & Gowns' },
    { id: 'shoes', label: 'Shoes & Heels' },
    { id: 'bags', label: 'Luxury Bags' },
    { id: 'accessories', label: 'Accessories' }
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      // Price filter
      const comparePrice = wholesaleMode ? product.wholesalePrice : product.retailPrice;
      if (comparePrice > maxPrice) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesSku = product.sku.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesSku && !matchesCategory) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      }
      if (sortBy === 'price-low') {
        const priceA = wholesaleMode ? a.wholesalePrice : a.retailPrice;
        const priceB = wholesaleMode ? b.wholesalePrice : b.retailPrice;
        return priceA - priceB;
      }
      if (sortBy === 'price-high') {
        const priceA = wholesaleMode ? a.wholesalePrice : a.retailPrice;
        const priceB = wholesaleMode ? b.wholesalePrice : b.retailPrice;
        return priceB - priceA;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, wholesaleMode, sortBy, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#121217] via-[#1A141A] to-[#121217] border border-[#2B2B38] p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5 text-[#E6007A]" />
            Official P-Kess Catalogue
          </div>
          <h1 className="font-brand-display text-3xl sm:text-4xl font-bold text-white uppercase tracking-tight">
            {selectedCategory === 'all' ? 'All Collections' : categories.find(c => c.id === selectedCategory)?.label}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
            Discover bespoke Nigerian fashion couture, handcrafted stiletto heels, Italian leather bags and regal gold jewelry.
          </p>
        </div>

        {/* Wholesale Mode Toggle */}
        <div className="bg-[#171720] border border-[#2F2F40] p-4 rounded-xl flex items-center justify-between md:justify-end gap-4 shrink-0">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-[#ECC260]" />
              Wholesale Pricing View
            </div>
            <div className="text-[11px] text-zinc-400">
              Discounts of 15% on orders of 10+ units
            </div>
          </div>
          <button
            onClick={() => setWholesaleMode(prev => !prev)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              wholesaleMode ? 'bg-[#D4AF37]' : 'bg-zinc-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                wholesaleMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-4 border-b border-[#222230]">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B88B22] text-black shadow-md'
                  : 'bg-[#14141B] text-zinc-300 hover:text-white border border-[#272738] hover:border-zinc-500'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Right Controls: Search, Sort, Price Filter Trigger */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search in catalogue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#131318] border border-[#282836] rounded-xl py-2 pl-9 pr-8 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
            <Search className="w-3.5 h-3.5 text-[#D4AF37] absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#131318] border border-[#282836] text-zinc-300 text-xs rounded-xl py-2 px-3 focus:outline-none focus:border-[#D4AF37] appearance-none cursor-pointer pr-8"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ArrowUpDown className="w-3 h-3 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(prev => !prev)}
            className="lg:hidden p-2 rounded-xl bg-[#14141B] border border-[#272738] text-zinc-300"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>
      </div>

      {/* Price Slider Bar (Expandable or on desktop) */}
      <div className={`p-4 rounded-xl bg-[#101016] border border-[#242432] ${isMobileFilterOpen ? 'block' : 'hidden lg:flex'} items-center justify-between gap-6`}>
        <div className="flex items-center gap-3 w-full max-w-sm">
          <span className="text-xs text-zinc-400 whitespace-nowrap">Filter Max Price:</span>
          <input
            type="range"
            min={20000}
            max={150000}
            step={5000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-[#D4AF37] cursor-pointer"
          />
          <span className="text-xs font-bold text-[#ECC260] whitespace-nowrap">
            ₦{maxPrice.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-zinc-400 mt-2 lg:mt-0">
          <span>Showing <strong>{filteredProducts.length}</strong> of {products.length} products</span>
          {(searchQuery || selectedCategory !== 'all' || maxPrice < 150000) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setMaxPrice(150000);
              }}
              className="text-[#FF2A85] hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-[#0F0F14] rounded-2xl border border-[#242432]">
          <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-white font-serif-luxury text-lg font-bold mb-1">No products found</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto mb-6">
            We couldn't find any creations matching your search or filters. Try adjusting your search query or reset your price filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setMaxPrice(150000);
            }}
            className="px-6 py-2.5 rounded-full bg-[#D4AF37] text-black font-semibold text-xs tracking-wider uppercase hover:brightness-110"
          >
            Show All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onNavigate={onNavigate}
              showWholesalePriceFirst={wholesaleMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};
