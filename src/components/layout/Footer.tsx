import React from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { BRAND_CONSTANTS } from '../../data/initialData';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  RefreshCcw, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#050507] border-t border-[#1F1F28] text-zinc-400 text-sm mt-24">
      {/* Value Proposition Bar */}
      <div className="border-b border-[#1A1A22] bg-[#0A0A0E] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#181820] border border-[#2D2D3A] flex items-center justify-center text-[#D4AF37] shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Authentic Luxury</h4>
              <p className="text-xs text-zinc-400">Hand-finished couture and premium leather</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#181820] border border-[#2D2D3A] flex items-center justify-center text-[#E6007A] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Nationwide Delivery</h4>
              <p className="text-xs text-zinc-400">Delivery information shown at checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#181820] border border-[#2D2D3A] flex items-center justify-center text-[#D4AF37] shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Payment options at checkout</h4>
              <p className="text-xs text-zinc-400">Paystack, verified bank transfer & BNPL</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#181820] border border-[#2D2D3A] flex items-center justify-center text-[#E6007A] shrink-0">
              <RefreshCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Save to Buy Flexibility</h4>
              <p className="text-xs text-zinc-400">Save gradually towards luxury fashion pieces</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-5">
          <BrandLogo size="lg" onClick={() => onNavigate('home')} />
          <p className="text-xs text-zinc-300 leading-relaxed max-w-sm">
            {BRAND_CONSTANTS.description} We are dedicated to creating elegance for discerning individuals, fashion retailers and wholesale partners across Nigeria.
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2.5 text-zinc-300">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>{BRAND_CONSTANTS.address}</span>
            </div>
            <div className="flex items-center gap-2.5 text-zinc-300">
              <Mail className="w-4 h-4 text-[#E6007A] shrink-0" />
              <a href={`mailto:${BRAND_CONSTANTS.email}`} className="hover:text-white transition-colors">
                {BRAND_CONSTANTS.email}
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-zinc-300">
              <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <div className="flex gap-2">
                <a href={`tel:${BRAND_CONSTANTS.phoneNumbers[0]}`} className="hover:text-white transition-colors">
                  {BRAND_CONSTANTS.phoneNumbers[0]}
                </a>
                <span>•</span>
                <a href={`tel:${BRAND_CONSTANTS.phoneNumbers[1]}`} className="hover:text-white transition-colors">
                  {BRAND_CONSTANTS.phoneNumbers[1]}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-zinc-400">
              <Clock className="w-4 h-4 text-[#ECC260] shrink-0" />
              <span>Mon - Sat: 8:30 AM – 7:00 PM</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h3 className="font-brand-display text-white text-sm font-semibold tracking-wider uppercase border-b border-zinc-800 pb-2">
            Collections
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <button 
                onClick={() => onNavigate('shop', { category: 'clothing' })}
                className="hover:text-[#D4AF37] transition-colors"
              >
                Haute Clothing & Gowns
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('shop', { category: 't-shirts' })}
                className="hover:text-[#D4AF37] transition-colors"
              >
                T-Shirts
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('shop', { category: 'shoes' })}
                className="hover:text-[#D4AF37] transition-colors"
              >
                Shoes & Sandals
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('shop', { category: 'bags' })}
                className="hover:text-[#D4AF37] transition-colors"
              >
                Bags & Handbags
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('shop', { category: 'accessories' })}
                className="hover:text-[#D4AF37] transition-colors"
              >
                Fashion Accessories
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('wholesale')}
                className="text-[#ECC260] font-medium hover:underline flex items-center gap-1"
              >
                Wholesale Hub (10+ Units)
                <Sparkles className="w-3 h-3 text-[#E6007A]" />
              </button>
            </li>
          </ul>
        </div>

        {/* Customer Services */}
        <div className="space-y-4">
          <h3 className="font-brand-display text-white text-sm font-semibold tracking-wider uppercase border-b border-zinc-800 pb-2">
            Services & Tracking
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <button 
                onClick={() => onNavigate('track-order')}
                className="hover:text-[#D4AF37] transition-colors"
              >
                Track Live Order
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('save-to-buy')}
                className="hover:text-[#D4AF37] transition-colors"
              >
                Save to Buy Programme
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('bnpl')}
                className="hover:text-[#D4AF37] transition-colors"
              >
                Buy Now Pay Later (Credibly)
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('customer', { tab: 'overview' })}
                className="hover:text-[#D4AF37] transition-colors"
              >
                Customer Dashboard
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('contact')}
                className="hover:text-[#D4AF37] transition-colors"
              >
                Visit Asaba Showroom
              </button>
            </li>
          </ul>
        </div>

        {/* Legal & Policies */}
        <div className="space-y-4">
          <h3 className="font-brand-display text-white text-sm font-semibold tracking-wider uppercase border-b border-zinc-800 pb-2">
            Trust & Legal
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <button 
                onClick={() => onNavigate('legal', { type: 'terms' })}
                className="hover:text-[#D4AF37] transition-colors"
              >
                Terms and Conditions
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('legal', { type: 'privacy' })}
                className="hover:text-[#D4AF37] transition-colors"
              >
                Privacy Policy
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('legal', { type: 'shipping' })}
                className="hover:text-[#D4AF37] transition-colors"
              >
                Shipping & Delivery Policy
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('legal', { type: 'returns' })}
                className="hover:text-[#D4AF37] transition-colors"
              >
                Refund and Return Policy
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('legal', { type: 'save-to-buy' })}
                className="hover:text-[#D4AF37] transition-colors"
              >
                Save to Buy Terms
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('legal', { type: 'bnpl' })}
                className="hover:text-[#D4AF37] transition-colors"
              >
                BNPL Provider Disclosure
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Editorial image attribution: all editorial reference photographs are sourced from Wikimedia Commons and remain subject to their individual CC BY-SA 4.0 / CC0 licences. They are not represented as P-Kess-owned product photography. */}
      <div className="border-t border-[#1A1A22] px-4 sm:px-6 lg:px-8 py-3 text-[10px] text-zinc-500 text-center">
        Editorial reference photography: Wikimedia Commons contributors · CC BY-SA 4.0 / CC0. These images are illustrative references, not confirmed P-Kess product photographs.
      </div>

      {/* Bottom Copyright & Disclaimer Bar */}
      <div className="border-t border-[#1A1A22] py-6 px-4 sm:px-6 lg:px-8 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} P-Kess Fashion World. All rights reserved.</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>Asaba, Delta State, Nigeria</span>
            <span>•</span>
            <span className="text-[#D4AF37]">Creating Elegance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
