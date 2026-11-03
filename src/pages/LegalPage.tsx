import React, { useState } from 'react';
import { BRAND_CONSTANTS } from '../data/initialData';
import { ShieldCheck, FileText, Truck, RefreshCcw, PiggyBank, CreditCard, ChevronRight } from 'lucide-react';

interface LegalPageProps {
  initialType?: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialType = 'terms', onNavigate }) => {
  const [activeTab, setActiveTab] = useState(initialType);

  const policySections = [
    { id: 'terms', label: 'Terms and Conditions', icon: FileText },
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'shipping', label: 'Shipping & Delivery Policy', icon: Truck },
    { id: 'returns', label: 'Refund and Return Policy', icon: RefreshCcw },
    { id: 'save-to-buy', label: 'Save to Buy Programme Terms', icon: PiggyBank },
    { id: 'bnpl', label: 'Buy Now Pay Later Disclosure', icon: CreditCard }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="border-b border-[#242432] pb-4">
        <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">
          Legal & Regulatory Policies
        </span>
        <h1 className="font-brand-display text-2xl sm:text-4xl font-bold text-white uppercase">
          P-Kess Fashion World <span className="gold-gradient-text">Governance & Terms</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 rounded-2xl bg-[#111116] border border-[#252536] p-3 space-y-1">
          {policySections.map(s => {
            const Icon = s.icon;
            const isActive = activeTab === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveTab(s.id)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{s.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            );
          })}
        </div>

        {/* Policy Content */}
        <div className="lg:col-span-8 rounded-3xl bg-[#101016] border border-[#252536] p-6 sm:p-10 space-y-6 text-zinc-300 text-xs sm:text-sm leading-relaxed">
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white">Terms and Conditions</h2>
              <p className="text-xs text-zinc-400">Effective Date: November 2026</p>

              <h3 className="font-bold text-white text-sm pt-2">1. Introduction & Acceptance</h3>
              <p>
                Welcome to <strong>P-Kess Fashion World</strong> (registered in Nigeria). By accessing or placing orders through our website, mobile interface, or physically at our showroom located at <strong>{BRAND_CONSTANTS.address}</strong>, you agree to comply with and be bound by the following Terms and Conditions.
              </p>

              <h3 className="font-bold text-white text-sm pt-2">2. Pricing, Currency & Wholesale Orders</h3>
              <p>
                All prices are stated and processed in <strong>Nigerian Naira (₦)</strong>. Retail prices apply to orders under 10 units. Orders meeting or exceeding the minimum wholesale quantity (10 units) automatically receive volume wholesale rates ranging from 15% to 22%. Wholesale orders are final upon verified payment.
              </p>

              <h3 className="font-bold text-white text-sm pt-2">3. Intellectual Property</h3>
              <p>
                The official P-Kess Fashion World brand emblem, logos, dress designs, photographic campaign materials, and trademarks are the exclusive intellectual property of P-Kess Fashion World. Unauthorized reproduction, replication, or distribution is prohibited under Nigerian copyright law.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white">Privacy Policy</h2>
              <p className="text-xs text-zinc-400">Nigeria Data Protection Act (NDPA) Compliant</p>

              <h3 className="font-bold text-white text-sm pt-2">1. Information We Collect</h3>
              <p>
                We collect customer contact details (name, email address, phone number), delivery addresses across Nigerian states, and transaction evidence. Sensitive financial data such as debit card numbers and PINs are handled securely through PCI-DSS Level 1 certified gateways (Paystack) and are never stored on our servers.
              </p>

              <h3 className="font-bold text-white text-sm pt-2">2. Data Usage & Security</h3>
              <p>
                Your personal information is used exclusively to fulfill purchases, dispatch couriers, administer Save to Buy installment ledgers, and transmit transactional notifications. We never sell or lease customer information to third-party marketers.
              </p>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white">Shipping & Delivery Policy</h2>
              <p className="text-xs text-zinc-400">Nationwide Coverage Across 36 States & FCT</p>

              <h3 className="font-bold text-white text-sm pt-2">1. Asaba Flagship Showroom Pickup</h3>
              <p>
                Store pickup is <strong>100% FREE</strong> for all customers. Orders may be collected within 2–4 hours of payment verification from our showroom at No. 12, DLA Road, off Summit Road, Asaba, Delta State.
              </p>

              <h3 className="font-bold text-white text-sm pt-2">2. Courier Delivery Timelines</h3>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-zinc-300">
                <li><strong>Delta State & Adjacent South-South:</strong> Same-day to 24 hours.</li>
                <li><strong>Lagos & Abuja (FCT):</strong> 24 to 48 hours via GIG Logistics or Speedaf.</li>
                <li><strong>South-East & South-West:</strong> 24 to 48 hours.</li>
                <li><strong>Northern States:</strong> 2 to 4 business days with tracked door-to-door transit.</li>
              </ul>
            </div>
          )}

          {activeTab === 'returns' && (
            <div className="space-y-4">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white">Refund and Return Policy</h2>

              <h3 className="font-bold text-white text-sm pt-2">1. Eligibility for Exchange</h3>
              <p>
                We accept exchanges for unworn, unwashed items in their original packaging with security tags intact within <strong>48 hours of delivery</strong>. Due to hygiene standards, bespoke tailored alterations and earrings are non-returnable.
              </p>

              <h3 className="font-bold text-white text-sm pt-2">2. Defective or Incorrect Items</h3>
              <p>
                If you receive a flawed piece or incorrect size, please notify our Asaba concierge immediately at <strong>09012776272</strong> or email <strong>pkessvariety@gmail.com</strong> with photographic evidence. P-Kess Fashion World will cover return freight charges for verified factory defects.
              </p>
            </div>
          )}

          {activeTab === 'save-to-buy' && (
            <div className="space-y-4">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white">Save to Buy Programme Terms</h2>

              <h3 className="font-bold text-white text-sm pt-2">1. Overview & Price Lock Guarantee</h3>
              <p>
                The P-Kess "Save to Buy" scheme allows clients to reserve inventory at the current retail price and fund their purchase over a duration of 1 to 3 months using scheduled installments (daily, weekly, biweekly, or monthly). The agreed product price is locked and immune to inflationary market increases.
              </p>

              <h3 className="font-bold text-white text-sm pt-2">2. Fulfillment & Zero Debt</h3>
              <p>
                Products are held in our atelier and are dispatched once 100% of the target purchase price is saved and verified. If a client chooses to cancel an active plan before completion, accumulated deposits may be converted into store credit with zero penalties.
              </p>
            </div>
          )}

          {activeTab === 'bnpl' && (
            <div className="space-y-4">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white">Buy Now Pay Later (BNPL) Disclosure</h2>

              <h3 className="font-bold text-white text-sm pt-2">1. Credibly Financing Evaluation</h3>
              <p>
                Buy Now Pay Later arrangements are conducted in collaboration with independent third-party credit underwriting providers, including Credibly. All BNPL applications are subject to provider availability and regulatory merchant authorization in Nigeria.
              </p>

              <h3 className="font-bold text-white text-sm pt-2">2. Merchant Status</h3>
              <p>
                P-Kess Fashion World does not act as a direct moneylender. Submissions for BNPL pre-screening do not guarantee credit approval. We will never mark an application approved without verified partner contract execution.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
