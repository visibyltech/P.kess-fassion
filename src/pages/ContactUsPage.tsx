import React, { useState } from 'react';
import { BRAND_CONSTANTS } from '../data/initialData';
import { useStore } from '../context/StoreContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  Sparkles,
  Building
} from 'lucide-react';

export const ContactUsPage: React.FC = () => {
  const { showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Product / Sizing Inquiry');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    showToast("Message sent to P-Kess Concierge! We will respond shortly.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#ECC260] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#E6007A]" />
          Client Concierge & Showroom
        </div>
        <h1 className="font-brand-display text-3xl sm:text-5xl font-bold text-white uppercase tracking-tight">
          Connect With <span className="gold-gradient-text">P-Kess</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Have an inquiry regarding bespoke fitting, wholesale purchases, or order dispatch? Our team in Asaba is here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Contact Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-[#111116] border border-[#252536] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 text-[#ECC260] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-base font-bold text-white">Showroom & Atelier Address</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {BRAND_CONSTANTS.address}
            </p>
            <span className="text-[11px] text-[#ECC260] font-semibold block">
              Free Order Pickup Available During Open Hours
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-[#111116] border border-[#252536] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6007A]/20 text-[#FF66B2] flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-base font-bold text-white">Telephone & Direct Desk</h3>
            <div className="space-y-1 text-xs text-zinc-300">
              <div>Phone 1: <a href="tel:09012776272" className="text-white hover:text-[#D4AF37] font-semibold">09012776272</a></div>
              <div>Phone 2: <a href="tel:08103575549" className="text-white hover:text-[#D4AF37] font-semibold">08103575549</a></div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#111116] border border-[#252536] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-base font-bold text-white">WhatsApp VIP Support</h3>
            <p className="text-xs text-zinc-300">
              Instant response from our lead fashion stylist and wholesale officer.
            </p>
            <a
              href={BRAND_CONSTANTS.socials.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#25D366] hover:underline"
            >
              Start WhatsApp Conversation →
            </a>
          </div>

          <div className="p-6 rounded-3xl bg-[#111116] border border-[#252536] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-base font-bold text-white">Email Address</h3>
            <a href={`mailto:${BRAND_CONSTANTS.email}`} className="text-xs text-zinc-300 hover:text-white block font-medium">
              {BRAND_CONSTANTS.email}
            </a>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7 bg-[#101016] border border-[#2B2B3E] rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="border-b border-zinc-800 pb-3">
            <h2 className="font-serif-luxury text-xl font-bold text-white">
              Send a Direct Message
            </h2>
            <p className="text-xs text-zinc-400">
              We respond to all online inquiries within 2-4 hours.
            </p>
          </div>

          {sent ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-white">Message Dispatched</h3>
              <p className="text-xs text-zinc-300 max-w-sm mx-auto">
                Thank you, {name}. Our customer concierge team has received your message and will reach out to you via {email} or WhatsApp shortly.
              </p>
              <button
                onClick={() => setSent(false)}
                className="px-6 py-2.5 rounded-xl bg-zinc-800 text-zinc-200 text-xs font-semibold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-300 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Chioma Okonkwo"
                    className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 block mb-1">Your Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. chioma@gmail.com"
                    className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-300 block mb-1">Phone Number (Nigeria)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 09012776272"
                    className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 block mb-1">Nature of Inquiry</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Product / Sizing Inquiry">Product / Sizing Inquiry</option>
                    <option value="Wholesale & Bulk Orders">Wholesale & Bulk Orders (10+ Units)</option>
                    <option value="Save to Buy Programme">Save to Buy Programme Questions</option>
                    <option value="Delivery & Order Tracking">Delivery & Order Tracking</option>
                    <option value="Custom Haute Atelier Fitting">Custom Haute Atelier Fitting</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-300 block mb-1">Your Message *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you would like to know or request..."
                  className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B88B22] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 shadow-lg"
              >
                <Send className="w-4 h-4" />
                Submit Inquiry to P-Kess Concierge
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
