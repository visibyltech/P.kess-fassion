import React from 'react';
import { BrandLogo } from '../components/common/BrandLogo';
import { BRAND_CONSTANTS } from '../data/initialData';
import { Sparkles, MapPin, Award, Users, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

interface AboutUsPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Editorial Story Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#14141B] via-[#201524] to-[#121218] border border-[#D4AF37]/40 p-8 sm:p-14 lg:p-20 shadow-2xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#ECC260] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#E6007A]" />
            The P-Kess Heritage
          </div>

          <h1 className="font-brand-display text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight">
            Creating Elegance. <br />
            <span className="gold-gradient-text">Crafted for Royalty.</span>
          </h1>

          <p className="font-serif-luxury italic text-lg sm:text-xl text-zinc-200">
            "Fashion is not merely what you wear; it is the grand celebration of identity, grace, and royal poise."
          </p>

          <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Established at our flagship showroom in Asaba, Delta State, <strong>P-Kess Fashion World</strong> has grown into one of Nigeria's premier fashion destinations. We produce and curate high-society Swiss dry lace boubous, sculpted velvet corsets, handcrafted Italian leather shoes, statement handbags, and 24K gold accessories.
          </p>
        </div>
      </div>

      {/* Brand Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-[#111116] border border-[#252536] space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 flex items-center justify-center text-[#ECC260]">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-serif-luxury text-xl font-bold text-white">Uncompromising Quality</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Every garment, shoe, and handbag that carries the P-Kess emblem undergoes rigorous quality inspection in our Asaba atelier before dispatch.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#111116] border border-[#252536] space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E6007A]/20 flex items-center justify-center text-[#FF66B2]">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-serif-luxury text-xl font-bold text-white">Empowering Retailers</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Through our wholesale initiative, we partner with boutique owners and fashion vendors across Nigeria, offering discounts of up to 15% - 22% on orders of 10+ units.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#111116] border border-[#252536] space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 flex items-center justify-center text-[#ECC260]">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif-luxury text-xl font-bold text-white">Accessible Luxury</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            With our customer-centric "Save to Buy" programme, every client can acquire their dream pieces gradually with zero interest and zero debt.
          </p>
        </div>
      </div>

      {/* Asaba Flagship Showroom Highlight */}
      <div className="rounded-3xl bg-[#12121A] border border-[#2B2B3E] p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ECC260]">
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            Delta State Flagship Showroom
          </div>

          <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-white">
            Visit Our Showroom & Atelier in Asaba
          </h2>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Step into a world of tailored luxury. Browse ready-to-wear couture collections, enjoy private fitting sessions, or pick up your online orders directly from our flagship showroom:
          </p>

          <div className="p-4 rounded-2xl bg-black/40 border border-zinc-800 text-xs space-y-2">
            <div className="text-white font-bold text-sm">{BRAND_CONSTANTS.address}</div>
            <div className="text-zinc-400">Open: Monday to Saturday, 8:30 AM – 7:00 PM</div>
            <div className="text-[#ECC260] font-mono">{BRAND_CONSTANTS.phoneFormatted}</div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B88B22] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 flex items-center gap-2"
            >
              Get Driving Directions & Inquiries
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-[#2B2B3E] aspect-video sm:aspect-square bg-black">
          <img
            src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80"
            alt="P-Kess Luxury Showroom"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
