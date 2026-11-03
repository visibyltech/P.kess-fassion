import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Heart, 
  PiggyBank, 
  Check, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface QuickViewModalProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ onNavigate }) => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    wholesaleSettings 
  } = useStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const activeSize = selectedSize || quickViewProduct.sizes[0] || 'Standard';
  const activeColor = selectedColor || quickViewProduct.colors[0] || 'Standard';

  const isWholesaleEligible = quantity >= wholesaleSettings.minUnits;
  const currentUnitPrice = isWholesaleEligible 
    ? quickViewProduct.wholesalePrice 
    : (quickViewProduct.discountPercent 
        ? Math.round(quickViewProduct.retailPrice * (1 - quickViewProduct.discountPercent / 100))
        : quickViewProduct.retailPrice);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, activeSize, activeColor);
    setQuickViewProduct(null);
  };

  const handleSaveToBuy = () => {
    setQuickViewProduct(null);
    onNavigate('save-to-buy', { 
      productId: quickViewProduct.id,
      selectedSize: activeSize,
      selectedColor: activeColor,
      quantity 
    });
  };

  const handleViewFullDetails = () => {
    const slug = quickViewProduct.slug;
    setQuickViewProduct(null);
    onNavigate('product-detail', { slug });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={() => setQuickViewProduct(null)} 
      />

      <div className="relative bg-[#101016] border border-[#2B2B3C] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl z-10 text-zinc-300">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 text-zinc-400 hover:text-white rounded-full bg-black/50 hover:bg-black/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Column */}
          <div className="p-6 bg-[#0B0B0E] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#222230]">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black/40 border border-[#20202C]">
              <img
                src={quickViewProduct.images[selectedImage] || quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover object-center"
              />
              {quickViewProduct.discountPercent && quickViewProduct.discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-[#E6007A] text-white text-[11px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {quickViewProduct.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {quickViewProduct.images.length > 1 && (
              <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
                {quickViewProduct.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImage === i ? 'border-[#D4AF37] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span className="uppercase tracking-widest text-[#D4AF37] font-semibold">
                  {quickViewProduct.category}
                </span>
                <span>SKU: {quickViewProduct.sku}</span>
              </div>

              {/* Title */}
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
                {quickViewProduct.name}
              </h2>

              {/* Ratings */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-[#ECC260]">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < Math.floor(quickViewProduct.rating) ? 'fill-[#ECC260]' : 'text-zinc-600'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs text-zinc-400">
                  {quickViewProduct.rating} ({quickViewProduct.reviewCount} reviews)
                </span>
              </div>

              {/* Pricing Box: Retail vs Wholesale */}
              <div className="p-3.5 rounded-xl bg-[#171720] border border-[#2B2B3C] mb-5">
                <div className="flex items-baseline justify-between mb-1">
                  <div>
                    <span className="text-xs text-zinc-400 block">Retail Price:</span>
                    <span className="text-xl font-bold text-white">
                      ₦{quickViewProduct.retailPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[#ECC260] font-medium block flex items-center gap-1 justify-end">
                      <Sparkles className="w-3 h-3 text-[#E6007A]" />
                      Wholesale Price (10+ units):
                    </span>
                    <span className="text-lg font-bold text-[#ECC260]">
                      ₦{quickViewProduct.wholesalePrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
                  <span>Wholesale Savings:</span>
                  <span className="text-[#FF2A85] font-semibold">
                    Save ₦{(quickViewProduct.retailPrice - quickViewProduct.wholesalePrice).toLocaleString()} per unit (15% off)
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed mb-5 line-clamp-3">
                {quickViewProduct.description}
              </p>

              {/* Sizes */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-zinc-300 block mb-2">
                  Select Size:
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        activeSize === sz
                          ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#ECC260]'
                          : 'border-[#2D2D3E] text-zinc-400 hover:text-white hover:border-zinc-500'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-zinc-300 block mb-2">
                  Available Shades:
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.colors.map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        activeColor === col
                          ? 'border-[#FF2A85] bg-[#E6007A]/15 text-white'
                          : 'border-[#2D2D3E] text-zinc-400 hover:text-white hover:border-zinc-500'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-xs font-semibold text-zinc-300">Quantity:</label>
                <div className="flex items-center border border-[#2D2D3E] rounded-lg bg-[#14141B]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-zinc-400 hover:text-white"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold text-white min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-zinc-400 hover:text-white"
                  >
                    +
                  </button>
                </div>

                {isWholesaleEligible && (
                  <span className="text-[11px] font-bold text-black bg-[#ECC260] px-2 py-0.5 rounded-full uppercase">
                    Wholesale Applied
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-3 border-t border-[#222230]">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B88B22] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart (₦{(currentUnitPrice * quantity).toLocaleString()})
                </button>

                <button
                  onClick={handleSaveToBuy}
                  className="py-3 px-4 rounded-xl bg-[#1A1A24] border border-[#E6007A]/50 text-[#FF66B2] hover:bg-[#E6007A]/15 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <PiggyBank className="w-4 h-4" />
                  Save to Buy
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => toggleWishlist(quickViewProduct.id)}
                  className="text-xs text-zinc-400 hover:text-[#FF2A85] flex items-center gap-1.5 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(quickViewProduct.id) ? 'fill-[#FF2A85] text-[#FF2A85]' : ''}`} />
                  {isInWishlist(quickViewProduct.id) ? 'Saved in Wishlist' : 'Add to Wishlist'}
                </button>

                <button
                  onClick={handleViewFullDetails}
                  className="text-xs text-[#ECC260] hover:underline flex items-center gap-1"
                >
                  View Complete Product Page
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
