import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { BRAND_CONSTANTS } from '../data/initialData';
import { 
  Percent, 
  Sparkles, 
  ShoppingBag, 
  Calculator, 
  CheckCircle2, 
  ArrowRight, 
  MessageCircle, 
  Truck, 
  ShieldCheck, 
  Phone
} from 'lucide-react';

interface WholesalePageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const WholesalePage: React.FC<WholesalePageProps> = ({ onNavigate }) => {
  const { products, wholesaleSettings, addToCart } = useStore();

  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [calculatorQty, setCalculatorQty] = useState<number>(10);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  // Calculate live savings in simulator
  const retailTotal = selectedProduct ? selectedProduct.retailPrice * calculatorQty : 0;
  const wholesaleUnitPrice = selectedProduct ? selectedProduct.wholesalePrice : 0;
  const wholesaleTotal = wholesaleUnitPrice * calculatorQty;
  const totalSavings = retailTotal - wholesaleTotal;
  const savingsPercent = retailTotal > 0 ? Math.round((totalSavings / retailTotal) * 100) : 15;

  const handleBulkAdd = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct, calculatorQty);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Hero Wholesale Banner */}
      <div className="wholesale-hero relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#14141A] via-[#201524] to-[#14141A] border border-[#D4AF37]/50 p-8 sm:p-14 lg:p-16 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#ECC260] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#E6007A]" />
            Official P-Kess Wholesale Programme
          </div>

          <h1 className="font-brand-display text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight">
            More Style. <span className="gold-gradient-text">More Savings.</span>
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            Welcome boutique owners, fashion retailers and bulk buyers. Explore Nigerian clothing, T-shirts, shoes, bags and fashion accessories with wholesale discounts of 10% to 15% on eligible orders of 10 or more units.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs text-zinc-300">
            <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Low Minimum: <strong>{wholesaleSettings.minUnits} Units</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-xl border border-white/10">
              <Truck className="w-4 h-4 text-[#E6007A]" />
              <span>Nationwide Freight or Asaba Pickup</span>
            </div>
            <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Quality Inspected Before Dispatch</span>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE WHOLESALE SAVINGS CALCULATOR */}
      <section className="rounded-3xl bg-[#101016] border border-[#2D2D3E] p-6 sm:p-10 shadow-xl">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ECC260]">
              <Calculator className="w-4 h-4 text-[#E6007A]" />
              Interactive Wholesale Calculator
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-white">
              Calculate Your Bulk Order Profit Margin
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Select any item from our catalogue and see your automatic wholesale price and instant client savings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#151520] p-6 sm:p-8 rounded-2xl border border-[#262636]">
            {/* Left: Input Selection */}
            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-2">
                  Select Product:
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-[#1B1B26] border border-[#333346] text-white text-xs sm:text-sm rounded-xl p-3 focus:outline-none focus:border-[#D4AF37]"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — Retail ₦{p.retailPrice.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-semibold text-zinc-300">Order Quantity:</span>
                  <span className="text-[#ECC260] font-bold text-sm">{calculatorQty} Units</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="1"
                  value={calculatorQty}
                  onChange={(e) => setCalculatorQty(parseInt(e.target.value))}
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
                  <span>10 Units (Min)</span>
                  <span>25 Units</span>
                  <span>50 Units</span>
                </div>
              </div>

              {selectedProduct && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-zinc-800">
                  <img
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.name}
                    className="w-14 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="text-white text-xs font-bold truncate max-w-[200px]">
                      {selectedProduct.name}
                    </h4>
                    <div className="text-[11px] text-zinc-400">
                      Standard Retail: ₦{selectedProduct.retailPrice.toLocaleString()} / unit
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Calculated Savings Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1C1C28] to-[#12121A] border border-[#3D3D52] space-y-4">
              <div className="text-xs uppercase tracking-wider text-zinc-400 font-bold border-b border-zinc-800 pb-2">
                Order Summary ({calculatorQty} Units)
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Retail Value:</span>
                  <span className="line-through">₦{retailTotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-white font-medium">
                  <span>Wholesale Unit Price:</span>
                  <span className="text-[#ECC260] font-bold">₦{wholesaleUnitPrice.toLocaleString()} / unit</span>
                </div>

                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-zinc-800">
                  <span>Wholesale Total:</span>
                  <span className="text-[#ECC260]">₦{wholesaleTotal.toLocaleString()}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#E6007A]/15 border border-[#E6007A]/40 text-center">
                  <span className="text-[11px] text-zinc-300 block">Your Instant Savings:</span>
                  <span className="text-xl font-black text-[#FF66B2]">
                    ₦{totalSavings.toLocaleString()} ({savingsPercent}% OFF)
                  </span>
                </div>
              </div>

              <button
                onClick={handleBulkAdd}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B88B22] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                Add {calculatorQty} Units to Cart
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Wholesale Product Showcase Grid */}
      <section className="space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#232330]">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">
              Top Wholesale Collections
            </span>
            <h2 className="font-brand-display text-2xl sm:text-3xl font-bold text-white uppercase">
              Fast-Moving Boutique Stocks
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs text-[#ECC260] hover:text-white flex items-center gap-1 font-semibold"
          >
            Explore Complete Wholesale Range
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {products.slice(0, 8).map(prod => (
            <ProductCard 
              key={prod.id} 
              product={prod} 
              onNavigate={onNavigate} 
              showWholesalePriceFirst={true} 
            />
          ))}
        </div>
      </section>

      {/* Custom Bulk Inquiries & WhatsApp Desk */}
      <section className="rounded-3xl bg-[#14141C] border border-[#2B2B3C] p-8 sm:p-12 text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center mx-auto">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
            Need Custom Tailoring or 50+ Units?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Our Head of Wholesale is ready to discuss custom fabric selections, uniform bridal party sizing, bespoke color palettes, and container-load pricing for international exporters.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={BRAND_CONSTANTS.socials.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#25D366] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <MessageCircle className="w-4 h-4" />
            Connect via WhatsApp (09012776272)
          </a>

          <a
            href={`tel:${BRAND_CONSTANTS.phoneNumbers[0]}`}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1E1E28] hover:bg-[#282836] text-white border border-zinc-700 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            <Phone className="w-4 h-4 text-[#D4AF37]" />
            Call Direct Wholesale Desk
          </a>
        </div>
      </section>
    </div>
  );
};
