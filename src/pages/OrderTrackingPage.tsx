import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Phone
} from 'lucide-react';
import { BRAND_CONSTANTS } from '../data/initialData';

interface OrderTrackingPageProps {
  initialOrderNumber?: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ 
  initialOrderNumber = '', 
  onNavigate 
}) => {
  const { getOrderById, orders } = useStore();
  const [searchInput, setSearchInput] = useState(initialOrderNumber);
  const [searchedOrder, setSearchedOrder] = useState<any>(
    initialOrderNumber ? getOrderById(initialOrderNumber) : orders[0]
  );
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const found = getOrderById(searchInput.trim());
    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const steps = [
    { id: 'pending', label: 'Order Placed', desc: 'Order details recorded in system' },
    { id: 'payment', label: 'Payment Confirmed', desc: 'Paystack or Bank transfer verified' },
    { id: 'processing', label: 'Haute Atelier Packing', desc: 'Inspection & luxury packaging in Asaba' },
    { id: 'dispatched', label: 'In Transit / Dispatched', desc: 'With courier or ready for showroom pickup' },
    { id: 'delivered', label: 'Delivered', desc: 'Successfully received by customer' }
  ];

  const getStepProgress = (order: any) => {
    if (!order) return 0;
    if (order.orderStatus === 'delivered') return 4;
    if (order.orderStatus === 'dispatched') return 3;
    if (order.orderStatus === 'processing') return 2;
    if (order.paymentStatus === 'verified') return 1;
    return 0;
  };

  const currentStepIndex = getStepProgress(searchedOrder);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#ECC260] text-xs font-bold uppercase tracking-wider">
          <Truck className="w-4 h-4 text-[#D4AF37]" />
          Live Logistics Tracking
        </div>
        <h1 className="font-brand-display text-3xl sm:text-4xl font-bold text-white uppercase tracking-tight">
          Track Your <span className="gold-gradient-text">P-Kess Order</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          Enter your unique P-Kess Order Number (e.g. PK-2026-8910) to monitor dispatch, payment clearance, and courier status.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto pt-4 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              required
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="e.g. PK-2026-8910"
              className="w-full bg-[#13131A] border border-[#2D2D40] rounded-xl py-3 pl-10 pr-4 text-xs sm:text-sm text-white focus:outline-none focus:border-[#D4AF37] uppercase"
            />
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B88B22] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shrink-0"
          >
            Track
          </button>
        </form>

        {/* Quick helper pills */}
        <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 pt-1">
          <span>Try sample orders:</span>
          {orders.slice(0, 3).map(o => (
            <button
              key={o.id}
              onClick={() => {
                setSearchInput(o.orderNumber);
                setSearchedOrder(o);
                setHasSearched(true);
              }}
              className="text-[#ECC260] hover:underline"
            >
              {o.orderNumber}
            </button>
          ))}
        </div>
      </div>

      {/* TRACKING TIMELINE & DETAILS */}
      {searchedOrder ? (
        <div className="rounded-3xl bg-[#111117] border border-[#272738] p-6 sm:p-10 space-y-8 shadow-2xl">
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
            <div>
              <span className="text-xs text-zinc-400 block">Order Reference:</span>
              <h2 className="text-2xl font-black text-white font-mono">{searchedOrder.orderNumber}</h2>
              <span className="text-xs text-zinc-400">Placed on: {searchedOrder.createdAt.split('T')[0]}</span>
            </div>

            <div className="flex flex-wrap gap-2 sm:text-right">
              <div>
                <span className="text-[10px] text-zinc-400 block uppercase">Payment Status</span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  searchedOrder.paymentStatus === 'verified'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {searchedOrder.paymentStatus.replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block uppercase">Dispatch Status</span>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#D4AF37]/20 text-[#ECC260] border border-[#D4AF37]/30">
                  {searchedOrder.orderStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="py-4">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
              {steps.map((st, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={st.id} className="flex flex-col items-start sm:items-center text-left sm:text-center space-y-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isPassed 
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#E6007A] text-white shadow-lg' 
                        : 'bg-[#1C1C26] border border-zinc-700 text-zinc-500'
                    }`}>
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>

                    <div>
                      <h4 className={`text-xs font-bold ${isCurrent ? 'text-[#ECC260]' : isPassed ? 'text-white' : 'text-zinc-500'}`}>
                        {st.label}
                      </h4>
                      <p className="text-[10px] text-zinc-400 max-w-[140px] hidden sm:block">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Logistics & Courier Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#161622] p-5 rounded-2xl border border-[#2A2A3E] text-xs">
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase font-bold">Assigned Logistics Courier</span>
              <span className="text-white font-bold text-sm">{searchedOrder.courier || 'GIG Logistics / Speedaf'}</span>
              <span className="text-zinc-400 block text-[11px] mt-0.5">
                Tracking Code: <strong className="text-[#ECC260] font-mono">{searchedOrder.trackingNumber || 'PENDING DISPATCH'}</strong>
              </span>
            </div>

            <div>
              <span className="text-zinc-500 block text-[10px] uppercase font-bold">Estimated Arrival</span>
              <span className="text-white font-bold text-sm">{searchedOrder.estimatedDeliveryDate || '24 - 48 Hours'}</span>
              <span className="text-zinc-400 block text-[11px] mt-0.5">
                Dispatch point: Asaba, Delta State
              </span>
            </div>

            <div>
              <span className="text-zinc-500 block text-[10px] uppercase font-bold">Delivery Destination</span>
              <span className="text-white font-bold text-sm">{searchedOrder.state} State ({searchedOrder.lga})</span>
              <span className="text-zinc-400 block text-[11px] mt-0.5 truncate">{searchedOrder.address}</span>
            </div>
          </div>

          {/* Items in this Order */}
          <div className="space-y-3 pt-4 border-t border-zinc-800">
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider">
              Ensemble Pieces ({searchedOrder.items.length}):
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {searchedOrder.items.map((it: any, i: number) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-black/40 border border-zinc-800 text-xs">
                  <img
                    src={it.product.images[0]}
                    alt={it.product.name}
                    className="w-14 h-16 object-cover rounded-lg shrink-0"
                  />
                  <div>
                    <h4 className="text-white font-bold line-clamp-1">{it.product.name}</h4>
                    <span className="text-zinc-400 text-[11px] block">
                      Size: {it.selectedSize} • Color: {it.selectedColor} • Qty: {it.quantity}
                    </span>
                    <span className="text-[#ECC260] font-bold">₦{(it.unitPrice * it.quantity).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Need help row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              <span>Questions regarding dispatch? Call our logistics desk at 09012776272.</span>
            </div>

            <button
              onClick={() => onNavigate('shop')}
              className="text-[#ECC260] hover:underline font-semibold"
            >
              Back to Collections
            </button>
          </div>
        </div>
      ) : hasSearched ? (
        <div className="text-center py-16 bg-[#111117] rounded-3xl border border-[#272738] space-y-3">
          <Clock className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-white font-serif-luxury text-lg font-bold">No Order Found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            We couldn't locate an order with the code <strong className="text-white">{searchInput}</strong>. Please verify your receipt or contact our Asaba support team.
          </p>
        </div>
      ) : null}
    </div>
  );
};
