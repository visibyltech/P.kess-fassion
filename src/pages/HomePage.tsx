import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { BrandLogo } from '../components/common/BrandLogo';
import { BRAND_CONSTANTS } from '../data/initialData';
import { 
  ArrowRight, 
  Sparkles, 
  ShoppingBag, 
  PiggyBank, 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  TrendingUp, 
  CheckCircle2, 
  Layers, 
  Percent
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { products } = useStore();

  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);

  const categories = [
    {
      id: 'clothing',
      title: 'Nigerian Clothing & Native Wear',
      subtitle: 'Ankara styles, elegant gowns, native sets & occasion wear',
      image: 'https://afrikanattire.com/cdn/shop/products/10bd8fb91289518e3d25f7ac7f025722.jpg?v=1652830900',
      itemCount: '12+ Styles'
    },
    {
      id: 't-shirts',
      title: 'T-Shirts & Everyday Wear',
      subtitle: 'Graphic tees and relaxed styles with a Nigerian point of view',
      image: 'https://www.gettyimages.com/gi-resources/images/500px/983794168.jpg',
      itemCount: 'New Styles'
    },
    {
      id: 'shoes',
      title: 'Shoes & Sandals',
      subtitle: 'Locally crafted footwear for everyday and special occasions',
      image: 'https://media-assets.grailed.com/prd/listing/33612893/527637d4714540ecaf1da94cf0c96d01?auto=format',
      itemCount: '8+ Styles'
    },
    {
      id: 'bags',
      title: 'Bags & Handbags',
      subtitle: 'Ankara, fabric and statement bags',
      image: 'https://www.zeestore.ca/cdn/shop/files/balangi-african-print-handbag-9801401.jpg?v=1769832557',
      itemCount: '10+ Styles'
    },
    {
      id: 'accessories',
      title: 'Fashion Accessories',
      subtitle: 'Beads, headwraps, caps, scarves and finishing touches',
      image: 'https://curiosityafricanboutique.com/cdn/shop/files/CuriosityAfricanBoutique_AfricanCurioShopinSouthAfricaonZuluNyalaHeritageSafariLodge_ArtisinalandHandcraftedAfricanProducts_Decor_CraftsandArt--794copy.png?v=1702631348&width=2000',
      itemCount: '14+ Styles'
    }
  ];

  return (
    <div className="space-y-24">
      {/* SECTION A — HERO BANNER */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-[#252535]">
        {/* Background Editorial Fashion Campaign Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://commons.wikimedia.org/wiki/Special:FilePath/A_Nigerian_lady_in_Ankara_clothing.jpg?width=1600"
            alt="Nigerian model wearing Ankara fashion — editorial brand imagery"
            className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-105 scale-105 animate-fade-in"
          />
          {/* Gradients to blend smoothly with dark brand identity */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-black/60 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#08080A] via-transparent to-[#08080A]/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Brand Emblem & Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/40 mb-6 shadow-xl">
            <Sparkles className="w-4 h-4 text-[#E6007A]" />
            <span className="text-xs sm:text-sm font-medium tracking-widest uppercase text-[#FFE898]">
              P-Kess Fashion World · Asaba, Nigeria
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-brand-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white uppercase drop-shadow-2xl mb-4 leading-none">
            Elegance in <span className="gold-gradient-text">Every Detail</span>
          </h1>

          {/* Supporting Text */}
          <p className="font-serif-luxury italic text-lg sm:text-2xl text-zinc-200 max-w-2xl mx-auto mb-8 font-light tracking-wide">
            "Discover Fashion. Express Yourself. Create Elegance."
          </p>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto mb-10 leading-relaxed font-normal">
            Nigerian style, beautifully made. Discover clothing, native-inspired looks, T-shirts, footwear, bags and accessories from P-Kess Fashion World.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('shop')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#ECC260] to-[#B88B22] text-black font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(212,175,55,0.35)] flex items-center justify-center gap-2 group"
            >
              Shop Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('wholesale')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#121218]/90 hover:bg-[#1A1A24] text-white border border-[#D4AF37]/50 hover:border-[#D4AF37] font-semibold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <Percent className="w-4 h-4 text-[#ECC260]" />
              Explore Wholesale (15% Off)
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-zinc-400">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>100% Authentic Quality</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Truck className="w-4 h-4 text-[#E6007A]" />
              <span>All 36 States Delivery</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Paystack Secured</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <PiggyBank className="w-4 h-4 text-[#E6007A]" />
              <span>Save to Buy Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B — SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#232330]">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#E6007A] block mb-1">
              Curated Masterpieces
            </span>
            <h2 className="font-brand-display text-2xl sm:text-4xl font-bold text-white uppercase tracking-wide">
              Shop by <span className="gold-gradient-text">Category</span>
            </h2>
          </div>
          <p className="text-xs text-zinc-400 max-w-md mt-2 md:mt-0">
            Explore the P-Kess collections: clothing, T-shirts, shoes, bags and fashion accessories.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('shop', { category: cat.id })}
              className="group relative aspect-[4/5] min-w-0 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer border border-[#242432] hover:border-[#D4AF37] transition-all duration-300 shadow-xl"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-contain p-2 sm:p-4 bg-[#F7F5F0] object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent group-hover:from-black/95 transition-colors" />

              <div className="absolute inset-x-0 bottom-0 p-2 sm:p-4 flex flex-col justify-end">
                <span className="text-[8px] sm:text-[10px] font-bold tracking-wide text-[#ECC260] uppercase mb-1">
                  {cat.itemCount}
                </span>
                <h3 className="font-serif-luxury text-[11px] leading-tight sm:text-base lg:text-lg font-bold text-white mb-1 group-hover:text-[#ECC260] transition-colors line-clamp-2">
                  {cat.title}
                </h3>
                <p className="text-[9px] leading-snug sm:text-xs text-zinc-300 line-clamp-2 mb-2 sm:mb-3 opacity-90">
                  {cat.subtitle}
                </p>

                <div className="inline-flex items-center gap-1 text-[9px] sm:text-xs font-semibold text-white group-hover:text-[#D4AF37] transition-colors">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION C — NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#232330]">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">
              Fresh Off The Runway
            </span>
            <h2 className="font-brand-display text-2xl sm:text-3xl font-bold text-white uppercase">
              New <span className="text-[#FF2A85]">Arrivals</span>
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-semibold text-[#ECC260] hover:text-white flex items-center gap-1.5 transition-colors"
          >
            View All ({products.length})
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {newArrivals.map(prod => (
            <ProductCard key={prod.id} product={prod} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* SECTION E — WHOLESALE SHOPPING BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/40 bg-gradient-to-r from-[#121218] via-[#1A131C] to-[#121218] p-8 sm:p-12 lg:p-16 shadow-2xl">
          {/* Subtle gold ambient ring glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#D4AF37]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#E6007A]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#ECC260] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#E6007A]" />
                B2B & Retailer Programme
              </div>

              <h2 className="font-brand-display text-3xl sm:text-5xl font-extrabold text-white uppercase">
                More Style. <span className="gold-gradient-text">More Savings.</span>
              </h2>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                Are you a boutique owner or fashion retailer? Shop in bulk and enjoy up to <strong>15% wholesale savings</strong> on eligible orders of 10 or more units. Contact P-Kess for bulk enquiries and delivery arrangements.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-lg font-bold text-[#ECC260]">10 - 24 Units</div>
                  <div className="text-xs text-zinc-400">15% Bulk Discount</div>
                </div>
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-lg font-bold text-[#ECC260]">25 - 49 Units</div>
                  <div className="text-xs text-zinc-400">18% Bulk Discount</div>
                </div>
                <div className="p-3.5 rounded-xl bg-black/40 border border-[#E6007A]/40">
                  <div className="text-lg font-bold text-[#FF66B2]">50+ Units</div>
                  <div className="text-xs text-zinc-400">15% Wholesale Savings</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <button
                onClick={() => onNavigate('wholesale')}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B88B22] text-black font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Shop Wholesale Now
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={BRAND_CONSTANTS.socials.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-6 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 hover:bg-[#25D366]/30 text-[#25D366] font-semibold text-xs text-center transition-colors"
              >
                Chat Wholesale Desk on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION D — BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#232330]">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#E6007A] block mb-1">
              Customer Favorites
            </span>
            <h2 className="font-brand-display text-2xl sm:text-3xl font-bold text-white uppercase">
              Best <span className="gold-gradient-text">Sellers</span>
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-semibold text-[#ECC260] hover:text-white flex items-center gap-1.5 transition-colors"
          >
            Explore Catalogue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {bestSellers.map(prod => (
            <ProductCard key={prod.id} product={prod} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* SECTION F — SAVE TO BUY PROGRAMME */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#2B2B3E] bg-[#0E0E14] overflow-hidden p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6007A]/15 border border-[#E6007A]/40 text-[#FF66B2] text-xs font-bold uppercase tracking-wider">
                <PiggyBank className="w-4 h-4" />
                Flexible Fashion Savings
              </div>

              <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-white leading-tight">
                "Your Favourite Fashion, <br />
                <span className="text-[#FF2A85]">One Step at a Time."</span>
              </h2>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                Save towards selected P-Kess styles at a pace that works for you. Choose an eligible product, follow your savings schedule and track your progress from your customer account.
              </p>

              <div className="space-y-3 pt-2 text-xs text-zinc-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#ECC260] flex items-center justify-center font-bold text-xs">1</div>
                  <span>Choose any product from our clothing, shoes, bags or accessories catalogue.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#ECC260] flex items-center justify-center font-bold text-xs">2</div>
                  <span>Select your savings duration (1 to 3 months) and preferred contribution frequency.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#ECC260] flex items-center justify-center font-bold text-xs">3</div>
                  <span>Pay installments via Paystack or direct Bank Transfer with proof upload.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#E6007A]/20 text-[#FF66B2] flex items-center justify-center font-bold text-xs">4</div>
                  <span>Once your savings target is complete, confirm your order and delivery details.</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onNavigate('save-to-buy')}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#E6007A] to-[#B3005F] text-white font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-[#E6007A]/20"
                >
                  Start a Save to Buy Plan
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#14141D] rounded-2xl border border-[#2B2B3E] p-6 space-y-4">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between border-b border-zinc-800 pb-2">
                <span>Sample Savings Plan</span>
                <span className="text-[#ECC260]">Interactive Preview</span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=300&q=80"
                  alt="Nigerian Ankara fashion editorial"
                  className="w-16 h-20 object-cover rounded-lg border border-[#2F2F40]"
                />
                <div>
                  <h4 className="text-white text-xs font-bold">P-Kess Nigerian Fashion Collection</h4>
                  <div className="text-[#ECC260] text-sm font-extrabold mt-0.5">₦85,000</div>
                  <div className="text-[11px] text-zinc-400">Duration: 2 Months (8 Weeks)</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Progress:</span>
                  <span className="text-[#FF2A85] font-bold">₦57,000 / ₦85,000 (67%)</span>
                </div>
                <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E6007A] w-[67%]" />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black/40 text-[11px] text-zinc-400 space-y-1">
                <div className="flex justify-between">
                  <span>Weekly Installment:</span>
                  <span className="text-white font-semibold">₦10,625</span>
                </div>
                <div className="flex justify-between">
                  <span>Next Deposit Due:</span>
                  <span className="text-[#ECC260] font-semibold">In 5 Days</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('save-to-buy')}
                className="w-full py-2.5 rounded-lg bg-[#222230] hover:bg-[#2C2C3E] text-zinc-200 text-xs font-semibold text-center border border-zinc-700/60 transition-colors"
              >
                Calculate My Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION G — BUY NOW PAY LATER (CREDIBLY) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#2B2B3E] bg-gradient-to-b from-[#13131B] to-[#0A0A0E] p-8 sm:p-12 lg:p-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#ECC260] text-xs font-bold uppercase tracking-wider">
              <CreditCard className="w-4 h-4 text-[#ECC260]" />
              Buy Now Pay Later Solutions
            </div>

            <h2 className="font-brand-display text-2xl sm:text-4xl font-extrabold text-white uppercase">
              Wear Today, <span className="gold-gradient-text">Spread the Cost</span>
            </h2>

            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
              Buy Now Pay Later is planned through Credibly. This option will be activated only after provider eligibility, merchant onboarding and the supported Nigerian payment flow have been confirmed.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('bnpl')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#181824] hover:bg-[#222232] text-white border border-[#D4AF37]/50 font-semibold text-xs tracking-wider uppercase transition-colors"
              >
                Check BNPL Eligibility Status
              </button>

              <button
                onClick={() => onNavigate('save-to-buy')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#D4AF37] hover:brightness-110 text-black font-bold text-xs tracking-wider uppercase transition-colors"
              >
                Use Guaranteed Save to Buy
              </button>
            </div>

            <p className="text-[11px] text-zinc-500 pt-2">
              *All BNPL requests are processed through verified external partner assessment. P-Kess Fashion World never collects unauthorized credit fees.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
