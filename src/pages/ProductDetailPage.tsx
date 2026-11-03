import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  PiggyBank, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  MapPin, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { BRAND_CONSTANTS } from '../data/initialData';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const { products, addToCart, toggleWishlist, isInWishlist, wholesaleSettings } = useStore();

  const product = products.find(p => p.slug === slug) || products[0];

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'wholesale'>('details');

  // Update selection if product changes
  React.useEffect(() => {
    setActiveImage(0);
    setSelectedSize(product.sizes[0] || 'Standard');
    setSelectedColor(product.colors[0] || 'Standard');
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, product]);

  const isWholesale = quantity >= wholesaleSettings.minUnits;
  
  // Calculate unit price dynamically based on quantity and wholesale settings
  const retailUnitPrice = product.discountPercent 
    ? Math.round(product.retailPrice * (1 - product.discountPercent / 100))
    : product.retailPrice;

  const currentUnitPrice = isWholesale ? product.wholesalePrice : retailUnitPrice;
  const totalPrice = currentUnitPrice * quantity;
  const standardRetailTotal = retailUnitPrice * quantity;
  const wholesaleSavings = Math.max(0, standardRetailTotal - totalPrice);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    onNavigate('checkout');
  };

  const handleStartSaveToBuy = () => {
    onNavigate('save-to-buy', {
      productId: product.id,
      selectedSize,
      selectedColor,
      quantity
    });
  };

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.featured))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400">
        <button onClick={() => onNavigate('home')} className="hover:text-white">Home</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => onNavigate('shop')} className="hover:text-white">Shop</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button 
          onClick={() => onNavigate('shop', { category: product.category })} 
          className="hover:text-white uppercase"
        >
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-zinc-200 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-black/50 border border-[#2B2B3C] shadow-2xl">
            <img
              src={product.images[activeImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNewArrival && (
                <span className="bg-[#D4AF37] text-black text-xs font-black uppercase px-3 py-1 rounded-full shadow-lg">
                  New Arrival
                </span>
              )}
              {product.discountPercent && product.discountPercent > 0 && (
                <span className="bg-[#E6007A] text-white text-xs font-bold uppercase px-3 py-1 rounded-full shadow-lg">
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all ${
                isInWishlist(product.id)
                  ? 'bg-[#E6007A] text-white shadow-lg'
                  : 'bg-black/60 text-zinc-300 hover:text-white hover:bg-black/80'
              }`}
            >
              <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === idx
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30 scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Buying Decisions & Pricing */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
              <span className="uppercase tracking-widest text-[#ECC260] font-bold">
                {product.category}
              </span>
              <span>SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-[#ECC260]">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-[#ECC260]' : 'text-zinc-600'}`} 
                  />
                ))}
              </div>
              <span className="text-xs text-zinc-300">
                {product.rating} ({product.reviewCount} verified client reviews)
              </span>
            </div>
          </div>

          {/* DUAL PRICING DISPLAY BOX */}
          <div className="rounded-2xl bg-[#14141C] border border-[#2E2E40] p-5 space-y-3 shadow-lg">
            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-zinc-800">
              {/* Retail Price */}
              <div>
                <span className="text-xs text-zinc-400 block font-medium">Individual Retail:</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-bold text-white">
                    ₦{retailUnitPrice.toLocaleString()}
                  </span>
                  {product.discountPercent && product.discountPercent > 0 && (
                    <span className="text-xs text-zinc-500 line-through">
                      ₦{product.retailPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Wholesale Price */}
              <div className="text-right">
                <span className="text-xs text-[#ECC260] font-semibold block flex items-center justify-end gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#E6007A]" />
                  Wholesale (10+ Units):
                </span>
                <div className="text-2xl font-extrabold text-[#ECC260] mt-0.5">
                  ₦{product.wholesalePrice.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Dynamic Wholesale Calculator Notice */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Wholesale Discount:</span>
              <span className="text-[#FF2A85] font-bold">
                Save ₦{(retailUnitPrice - product.wholesalePrice).toLocaleString()} per unit (15% OFF)
              </span>
            </div>

            {isWholesale ? (
              <div className="p-2.5 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-xs text-[#ECC260] flex items-center justify-between">
                <span>🎉 Wholesale Bulk Tier Activated!</span>
                <span className="font-bold">Total Savings: ₦{wholesaleSavings.toLocaleString()}</span>
              </div>
            ) : (
              <div className="text-[11px] text-zinc-400">
                Tip: Order <strong>{wholesaleSettings.minUnits} or more units</strong> to automatically unlock wholesale pricing!
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {product.description}
          </p>

          {/* Available Sizes */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-zinc-300">Select Size:</span>
              <span className="text-zinc-400 text-[11px]">Available Sizes</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    selectedSize === size
                      ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#ECC260] shadow-sm'
                      : 'border-[#2D2D3E] text-zinc-400 hover:text-white hover:border-zinc-500'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Available Colours */}
          <div className="space-y-2">
            <span className="font-semibold text-zinc-300 text-xs block">Available Colorway:</span>
            <div className="flex flex-wrap gap-2.5">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    selectedColor === color
                      ? 'border-[#FF2A85] bg-[#E6007A]/20 text-white'
                      : 'border-[#2D2D3E] text-zinc-400 hover:text-white hover:border-zinc-500'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector & Stock Status */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-300">Quantity:</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3 h-3" />
                {product.stock > 0 ? `In Stock (${product.stock} available in Asaba)` : 'Made to Order'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#2D2D3E] rounded-xl bg-[#14141C]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2.5 text-zinc-400 hover:text-white"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 text-center bg-transparent text-sm font-bold text-white focus:outline-none"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2.5 text-zinc-400 hover:text-white"
                >
                  +
                </button>
              </div>

              {/* Wholesale quick preset buttons */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-zinc-500 text-[11px]">Bulk Presets:</span>
                <button
                  onClick={() => setQuantity(10)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                    quantity === 10 ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  10 (Wholesale)
                </button>
                <button
                  onClick={() => setQuantity(25)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                    quantity === 25 ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  25
                </button>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-[#232330]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#ECC260] to-[#B88B22] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-[#D4AF37]/20"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart (₦{totalPrice.toLocaleString()})
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3.5 px-6 rounded-xl bg-white hover:bg-zinc-100 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
              >
                Buy Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Save to Buy Special Button */}
            <button
              onClick={handleStartSaveToBuy}
              className="w-full py-3 px-6 rounded-xl bg-[#171722] hover:bg-[#E6007A]/15 border border-[#E6007A]/50 text-[#FF66B2] font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <PiggyBank className="w-4 h-4" />
              Save to Buy This Product (Installment Savings)
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-[#232330] space-y-2.5 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#D4AF37]" />
              <span>Free showroom pickup in Asaba. Fast delivery across Nigeria.</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Official P-Kess quality assurance with authentic craftsmanship.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs (Details, Delivery, Wholesale) */}
      <div className="rounded-2xl bg-[#111116] border border-[#242432] p-6 sm:p-8">
        <div className="flex gap-6 border-b border-zinc-800 pb-4 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-2 transition-colors relative ${
              activeTab === 'details' ? 'text-[#ECC260]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Product Specifications
            {activeTab === 'details' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />}
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-2 transition-colors relative ${
              activeTab === 'shipping' ? 'text-[#ECC260]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Delivery & Asaba Pickup
            {activeTab === 'shipping' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />}
          </button>
          <button
            onClick={() => setActiveTab('wholesale')}
            className={`pb-2 transition-colors relative ${
              activeTab === 'wholesale' ? 'text-[#ECC260]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Wholesale Terms
            {activeTab === 'wholesale' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />}
          </button>
        </div>

        <div className="pt-6 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          {activeTab === 'details' && (
            <ul className="space-y-2 list-disc list-inside">
              {product.details.map((item, idx) => (
                <li key={idx} className="text-zinc-300">{item}</li>
              ))}
            </ul>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <p>
                All orders are dispatched from the P-Kess Fashion World business address located at <strong>{BRAND_CONSTANTS.address}</strong>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/40 border border-zinc-800">
                  <div className="font-semibold text-white mb-1">Showroom Pickup (Asaba)</div>
                  <p className="text-xs text-zinc-400">FREE. Available within 2-4 hours of order confirmation.</p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-zinc-800">
                  <div className="font-semibold text-white mb-1">Delta State & South-South</div>
                  <p className="text-xs text-zinc-400">Same day to 24 hours via local logistics dispatch.</p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-zinc-800">
                  <div className="font-semibold text-white mb-1">Lagos & Abuja (FCT)</div>
                  <p className="text-xs text-zinc-400">24 to 48 hours delivery via GIG Logistics or Speedaf.</p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-zinc-800">
                  <div className="font-semibold text-white mb-1">All Other Nigerian States</div>
                  <p className="text-xs text-zinc-400">2 to 4 business days with tracked door-to-door delivery.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wholesale' && (
            <div className="space-y-3">
              <p>
                Wholesale eligibility begins at a minimum order of <strong>10 units</strong>. Wholesale buyers receive discounts of 10% to 15%, subject to the product and current wholesale settings.
              </p>
              <p>
                Wholesale orders can be composed of mixed sizes and colors of the same style. Custom tailoring and bulk branding are available on request.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('wholesale')}
                  className="text-xs text-[#ECC260] font-semibold underline flex items-center gap-1"
                >
                  Visit Dedicated Wholesale Hub
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#232330]">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">
              Curated For You
            </span>
            <h3 className="font-brand-display text-xl sm:text-2xl font-bold text-white uppercase">
              Complete Your Ensemble
            </h3>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs text-[#ECC260] hover:text-white flex items-center gap-1"
          >
            View More
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {relatedProducts.map(p => (
            <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </div>
  );
};
