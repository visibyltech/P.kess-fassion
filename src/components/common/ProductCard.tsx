import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Heart, Eye, ShoppingBag, PiggyBank, Sparkles, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string, params?: Record<string, any>) => void;
  showWholesalePriceFirst?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onNavigate,
  showWholesalePriceFirst = false 
}) => {
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useStore();

  const discountedRetail = product.discountPercent 
    ? Math.round(product.retailPrice * (1 - product.discountPercent / 100))
    : product.retailPrice;

  return (
    <div className="group relative bg-[#111116] rounded-2xl border border-[#22222E] hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
      {/* Product Image Box */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/60">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNewArrival && (
            <span className="bg-[#D4AF37] text-black text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-md">
              New Arrival
            </span>
          )}
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="bg-[#E6007A] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wider shadow-md">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-black/80 backdrop-blur-sm border border-[#D4AF37]/40 text-[#ECC260] text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-colors ${
            isInWishlist(product.id)
              ? 'bg-[#E6007A] text-white'
              : 'bg-black/60 text-zinc-300 hover:text-white hover:bg-black/90'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-white' : ''}`} />
        </button>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-x-3 bottom-3 z-10 hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={() => setQuickViewProduct(product)}
            className="flex-1 py-2 px-3 rounded-xl bg-black/80 backdrop-blur-md text-white text-xs font-semibold hover:bg-black flex items-center justify-center gap-1.5 border border-white/20 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
            Quick View
          </button>
          <button
            onClick={() => addToCart(product, 1)}
            className="p-2 rounded-xl bg-[#D4AF37] text-black hover:brightness-110 flex items-center justify-center transition-all shadow-md"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-zinc-400 mb-1">
            <span className="uppercase tracking-wider text-[#ECC260] font-medium text-[9px] sm:text-[10px] truncate max-w-[90px]">
              {product.category}
            </span>
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#ECC260] fill-[#ECC260]" />
                <span className="text-[10px] sm:text-[11px]">{product.rating}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 
            onClick={() => onNavigate('product-detail', { slug: product.slug })}
            className="font-serif-luxury text-xs sm:text-sm font-semibold text-white hover:text-[#D4AF37] cursor-pointer transition-colors line-clamp-1 mb-1.5"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Pricing Row: Retail vs Wholesale */}
          <div className="space-y-1 mb-2.5">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm md:text-base font-bold text-white">
                ₦{discountedRetail.toLocaleString()}
              </span>
              {product.discountPercent && product.discountPercent > 0 && (
                <span className="text-[10px] sm:text-xs text-zinc-500 line-through">
                  ₦{product.retailPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Wholesale Callout */}
            <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-[#ECC260] bg-[#191924] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md border border-[#2E2E40]">
              <span className="flex items-center gap-1 font-medium truncate">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#E6007A] shrink-0" />
                <span className="hidden sm:inline">Wholesale (10+):</span>
                <span className="sm:hidden">Wholesale:</span>
              </span>
              <span className="font-bold shrink-0">
                ₦{product.wholesalePrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile / Direct Action Buttons */}
        <div className="pt-2 border-t border-[#1C1C28] flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => addToCart(product, 1)}
            className="flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg bg-[#181822] hover:bg-[#D4AF37] hover:text-black border border-[#2D2D3E] hover:border-[#D4AF37] text-zinc-200 text-[11px] sm:text-xs font-semibold transition-all flex items-center justify-center gap-1 sm:gap-1.5 truncate"
          >
            <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37] group-hover:text-black shrink-0" />
            <span className="truncate">Add to Bag</span>
          </button>

          <button
            onClick={() => onNavigate('save-to-buy', { productId: product.id })}
            className="p-1.5 sm:p-2 rounded-lg bg-[#181822] hover:bg-[#E6007A]/20 border border-[#2D2D3E] hover:border-[#E6007A] text-zinc-400 hover:text-[#FF66B2] transition-colors shrink-0"
            title="Save to Buy this item"
          >
            <PiggyBank className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
