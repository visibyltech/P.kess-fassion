import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { BRAND_CONSTANTS } from '../data/initialData';
import { 
  PiggyBank, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Upload, 
  CreditCard, 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  Truck
} from 'lucide-react';

interface SaveToBuyPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
  initialProductId?: string;
  initialSize?: string;
  initialColor?: string;
  initialQuantity?: number;
}

export const SaveToBuyPage: React.FC<SaveToBuyPageProps> = ({
  onNavigate,
  initialProductId,
  initialSize,
  initialColor,
  initialQuantity = 1
}) => {
  const { 
    products, 
    savingsPlans, 
    createSavingsPlan, 
    addSavingsTransaction, 
    currentUser, 
    setIsAuthModalOpen,
    paymentSettings,
    createOrder
  } = useStore();

  const [activeTab, setActiveTab] = useState<'create' | 'dashboard'>('create');

  // Plan creation form state
  const [selectedProductId, setSelectedProductId] = useState<string>(initialProductId || products[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [selectedSize, setSelectedSize] = useState<string>(initialSize || '');
  const [selectedColor, setSelectedColor] = useState<string>(initialColor || '');
  const [durationMonths, setDurationMonths] = useState<number>(2);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [initialDepositPercent, setInitialDepositPercent] = useState<number>(20); // 20% initial deposit

  // Deposit modal state
  const [activePlanForDeposit, setActivePlanForDeposit] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(10000);
  const [depositMethod, setDepositMethod] = useState<'paystack' | 'bank_transfer'>('bank_transfer');
  const [proofUrl, setProofUrl] = useState<string>('');
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [depositRef, setDepositRef] = useState<string>('');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  React.useEffect(() => {
    if (selectedProduct && !selectedSize) {
      setSelectedSize(selectedProduct.sizes[0] || 'Standard');
    }
    if (selectedProduct && !selectedColor) {
      setSelectedColor(selectedProduct.colors[0] || 'Standard');
    }
  }, [selectedProduct]);

  // Calculations for contribution
  const productPrice = selectedProduct?.discountPercent 
    ? Math.round(selectedProduct.retailPrice * (1 - selectedProduct.discountPercent / 100))
    : (selectedProduct?.retailPrice || 0);

  const totalPlanAmount = productPrice * quantity;
  const initialDepositAmount = Math.round((totalPlanAmount * initialDepositPercent) / 100);
  const remainingAfterInitial = totalPlanAmount - initialDepositAmount;

  // Number of cycles calculation
  const totalDays = durationMonths * 30;
  let cyclesCount = 1;
  if (frequency === 'daily') cyclesCount = totalDays;
  else if (frequency === 'weekly') cyclesCount = durationMonths * 4;
  else if (frequency === 'biweekly') cyclesCount = durationMonths * 2;
  else if (frequency === 'monthly') cyclesCount = durationMonths;

  const depositPerCycle = cyclesCount > 0 ? Math.ceil(remainingAfterInitial / cyclesCount) : 0;

  // Filter plans belonging to current user or show demo plans
  const userPlans = savingsPlans.filter(p => !currentUser || p.customerId === currentUser.id || currentUser.role === 'admin');

  const handleStartPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!selectedProduct) return;

    // Calculate next payment date
    const nextDate = new Date();
    if (frequency === 'daily') nextDate.setDate(nextDate.getDate() + 1);
    else if (frequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
    else if (frequency === 'biweekly') nextDate.setDate(nextDate.getDate() + 14);
    else if (frequency === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);

    try {
    const plan = await createSavingsPlan({
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      customerPhone: currentUser.phone || '09012776272',
      productId: selectedProduct.id,
      product: selectedProduct,
      quantity,
      selectedSize: selectedSize || selectedProduct.sizes[0] || 'Standard',
      selectedColor: selectedColor || selectedProduct.colors[0] || 'Standard',
      totalAmount: totalPlanAmount,
      frequency,
      durationMonths,
      depositPerCycle,
      nextPaymentDate: nextDate.toISOString().split('T')[0],
    });

    setActiveTab('dashboard');
    setActivePlanForDeposit(plan.id);
    setDepositAmount(initialDepositAmount);
    setDepositRef('STB-' + Math.floor(100000 + Math.random() * 900000));
    setDepositMethod('bank_transfer');
    setProofUrl('');
    setIsDepositModalOpen(true);
    } catch (error) { console.error('Could not create savings plan:', error); }
  };

  const handleOpenDepositModal = (planId: string, suggestedAmount: number) => {
    setActivePlanForDeposit(planId);
    setDepositAmount(suggestedAmount);
    setDepositRef('STB-' + Math.floor(100000 + Math.random() * 900000));
    setIsDepositModalOpen(true);
  };

  const handleConfirmDeposit = async () => {
    if (!activePlanForDeposit) return;
    try {
      if (depositMethod === 'bank_transfer' && !proofUrl) { window.alert('Please upload your actual transfer receipt before submitting.'); return; }
      await addSavingsTransaction(activePlanForDeposit, depositAmount, depositMethod, proofUrl || undefined, depositRef);
      setIsDepositModalOpen(false);
    } catch (error) { console.error('Could not submit savings deposit:', error); }
  };

  const handleCompleteToOrder = async (plan: typeof savingsPlans[0]) => {
    // Generate order from completed plan
    await createOrder({
      customerId: plan.customerId,
      customerName: plan.customerName,
      customerEmail: plan.customerEmail,
      customerPhone: plan.customerPhone,
      deliveryMethod: 'home',
      state: 'Delta',
      lga: 'Oshimili South (Asaba)',
      address: 'Savings Plan Delivery Fulfillment',
      items: [{
        product: plan.product,
        quantity: plan.quantity,
        selectedSize: plan.selectedSize,
        selectedColor: plan.selectedColor,
        isWholesale: false,
        unitPrice: plan.totalAmount / plan.quantity
      }],
      subtotal: plan.totalAmount,
      wholesaleSavings: 0,
      deliveryFee: 0, // Free delivery reward on completed savings plan!
      total: plan.totalAmount,
      paymentMethod: 'bank_transfer',
      paymentStatus: 'verified',
      orderStatus: 'processing',
      courier: 'P-Kess Direct Logistics'
    });
    onNavigate('customer', { tab: 'orders' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#17131D] via-[#21111E] to-[#121218] border border-[#E6007A]/40 p-8 sm:p-12 shadow-2xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6007A]/20 border border-[#E6007A]/40 text-[#FF66B2] text-xs font-bold uppercase tracking-wider">
            <PiggyBank className="w-4 h-4" />
            Save to Buy (Installment Payments)
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-white leading-tight">
            "Your Favourite Fashion, <br />
            <span className="text-[#FF2A85]">One Step at a Time."</span>
          </h1>

          <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Save gradually towards your dream bespoke gowns, Swiss lace, Italian stiletto heels, or designer leather bags. Lock in current stock prices, choose your installment schedule, and enjoy free delivery across Nigeria upon completion!
          </p>

          <div className="flex gap-4 pt-2">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-[#E6007A] to-[#B3005F] text-white shadow-lg shadow-[#E6007A]/25'
                  : 'bg-[#181824] text-zinc-300 hover:text-white border border-zinc-700'
              }`}
            >
              Start New Plan
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/25'
                  : 'bg-[#181824] text-zinc-300 hover:text-white border border-zinc-700'
              }`}
            >
              My Savings Dashboard ({userPlans.length})
            </button>
          </div>
        </div>
      </div>

      {/* VIEW A: CREATE SAVINGS PLAN WIZARD */}
      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Form: Plan Setup */}
          <div className="lg:col-span-7 bg-[#101016] border border-[#2B2B3E] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-zinc-800 pb-3">
              <h2 className="font-serif-luxury text-xl font-bold text-white">
                Customize Your Savings Plan
              </h2>
              <p className="text-xs text-zinc-400">
                Configure your product preferences, target duration, and contribution frequency.
              </p>
            </div>

            <form onSubmit={handleStartPlan} className="space-y-5">
              {/* Product selector */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  1. Select Fashion Piece:
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-[#181822] border border-[#2D2D40] text-white text-xs sm:text-sm rounded-xl p-3 focus:outline-none focus:border-[#D4AF37]"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ₦{p.retailPrice.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Size & Color */}
              {selectedProduct && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Size:</label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full bg-[#181822] border border-[#2D2D40] text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-[#D4AF37]"
                    >
                      {selectedProduct.sizes.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Colorway:</label>
                    <select
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-full bg-[#181822] border border-[#2D2D40] text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-[#D4AF37]"
                    >
                      {selectedProduct.colors.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Quantity:</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#2D2D40] rounded-xl bg-[#181822]">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2 text-zinc-400 hover:text-white"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold text-white min-w-[24px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-2 text-zinc-400 hover:text-white"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-zinc-400">Total Purchase: <strong>₦{totalPlanAmount.toLocaleString()}</strong></span>
                </div>
              </div>

              {/* Savings Duration */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  2. Choose Savings Duration:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { months: 1, label: '1 Month', note: 'Fast Track' },
                    { months: 2, label: '2 Months', note: 'Popular' },
                    { months: 3, label: '3 Months', note: 'Relaxed' }
                  ].map(d => (
                    <button
                      key={d.months}
                      type="button"
                      onClick={() => setDurationMonths(d.months)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        durationMonths === d.months
                          ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#ECC260]'
                          : 'border-[#2D2D40] text-zinc-400 hover:text-white hover:border-zinc-500'
                      }`}
                    >
                      <div className="text-xs font-bold">{d.label}</div>
                      <div className="text-[10px] text-zinc-500">{d.note}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contribution Frequency */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  3. Select Payment Frequency:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['daily', 'weekly', 'biweekly', 'monthly'] as const).map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFrequency(f)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                        frequency === f
                          ? 'border-[#FF2A85] bg-[#E6007A]/20 text-white'
                          : 'border-[#2D2D40] text-zinc-400 hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Initial Deposit Percentage */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-zinc-300">4. Initial Commitment Deposit:</span>
                  <span className="text-[#ECC260] font-bold">{initialDepositPercent}% (₦{initialDepositAmount.toLocaleString()})</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={initialDepositPercent}
                  onChange={(e) => setInitialDepositPercent(parseInt(e.target.value))}
                  className="w-full accent-[#E6007A] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
                  <span>10% (Min)</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#E6007A] to-[#B3005F] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-[#E6007A]/25"
              >
                <PiggyBank className="w-4 h-4" />
                Activate Plan & Lock In Price
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Summary Card: Live Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-[#14141C] border border-[#2B2B3E] p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="text-xs uppercase tracking-widest text-[#ECC260] font-bold border-b border-zinc-800 pb-3 flex items-center justify-between">
                <span>Calculated Schedule</span>
                <Sparkles className="w-4 h-4 text-[#E6007A]" />
              </div>

              {selectedProduct && (
                <div className="flex items-center gap-4">
                  <img
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.name}
                    className="w-20 h-24 object-cover rounded-xl border border-zinc-800"
                  />
                  <div>
                    <h3 className="font-serif-luxury text-sm font-bold text-white">{selectedProduct.name}</h3>
                    <div className="text-xs text-zinc-400 mt-1">Size: {selectedSize} • Color: {selectedColor}</div>
                    <div className="text-xs text-[#ECC260] font-bold mt-1">Total: ₦{totalPlanAmount.toLocaleString()}</div>
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-3 border-t border-zinc-800/80 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Duration:</span>
                  <span className="text-white font-medium">{durationMonths} Months</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Payment Frequency:</span>
                  <span className="text-white font-medium capitalize">{frequency}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Initial Deposit:</span>
                  <span className="text-[#ECC260] font-bold">₦{initialDepositAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Remaining Installments:</span>
                  <span className="text-white font-medium">{cyclesCount} Cycles</span>
                </div>

                <div className="p-4 rounded-xl bg-black/50 border border-zinc-800/80 space-y-1 text-center">
                  <span className="text-[11px] text-zinc-400 block">Required Contribution per {frequency}:</span>
                  <span className="text-2xl font-black text-[#FF66B2]">
                    ₦{depositPerCycle.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-[11px] text-zinc-400 pt-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Item is reserved exclusively in our Asaba atelier upon activation.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>No hidden interest or fees. You pay the exact product retail price.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Free nationwide delivery once 100% of target is reached.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW B: CUSTOMER SAVINGS DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center pb-3 border-b border-[#242432]">
            <div>
              <h2 className="font-serif-luxury text-2xl font-bold text-white">
                Active Savings Accounts
              </h2>
              <p className="text-xs text-zinc-400">
                Track your savings balances, log deposits, and confirm your shipments.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('create')}
              className="px-4 py-2 rounded-xl bg-[#E6007A] text-white text-xs font-semibold hover:brightness-110"
            >
              + Start Another Plan
            </button>
          </div>

          {userPlans.length === 0 ? (
            <div className="text-center py-16 bg-[#101016] rounded-2xl border border-[#242432]">
              <PiggyBank className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-white font-medium text-base mb-1">No active savings plans</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-6">
                You haven't started any Save to Buy plans yet. Pick an item from our shop and save at your own pace!
              </p>
              <button
                onClick={() => setActiveTab('create')}
                className="px-6 py-2.5 rounded-full bg-[#D4AF37] text-black font-semibold text-xs tracking-wider uppercase"
              >
                Create Your First Plan
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {userPlans.map(plan => {
                const percent = Math.min(100, Math.round((plan.amountSaved / plan.totalAmount) * 100));
                const outstanding = Math.max(0, plan.totalAmount - plan.amountSaved);
                const isCompleted = percent >= 100;

                return (
                  <div 
                    key={plan.id}
                    className="rounded-3xl bg-[#111117] border border-[#2B2B3E] p-6 space-y-6 shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      {/* Plan Header */}
                      <div className="flex justify-between items-start gap-3 border-b border-zinc-800/80 pb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={plan.product.images[0]}
                            alt={plan.product.name}
                            className="w-16 h-20 object-cover rounded-xl border border-zinc-800"
                          />
                          <div>
                            <span className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-wider">
                              Plan #{plan.id.slice(-6)}
                            </span>
                            <h3 className="font-serif-luxury text-base font-bold text-white line-clamp-1">
                              {plan.product.name}
                            </h3>
                            <div className="text-xs text-zinc-400 mt-0.5">
                              Size: {plan.selectedSize} • Color: {plan.selectedColor} • Qty: {plan.quantity}
                            </div>
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isCompleted 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-[#D4AF37]/20 text-[#ECC260] border border-[#D4AF37]/30'
                        }`}>
                          {isCompleted ? 'Target Achieved' : 'Active Plan'}
                        </span>
                      </div>

                      {/* Progress Bar & Balances */}
                      <div className="space-y-2 pt-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-zinc-400 font-medium">Savings Progress:</span>
                          <span className="text-[#FF2A85] font-bold">{percent}%</span>
                        </div>
                        <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E6007A] transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                          <div className="p-2.5 rounded-xl bg-black/40 border border-zinc-800">
                            <span className="text-[10px] text-zinc-500 block">Total Target</span>
                            <span className="text-xs font-bold text-white">₦{plan.totalAmount.toLocaleString()}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-black/40 border border-zinc-800">
                            <span className="text-[10px] text-zinc-500 block">Amount Saved</span>
                            <span className="text-xs font-bold text-[#ECC260]">₦{plan.amountSaved.toLocaleString()}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-black/40 border border-zinc-800">
                            <span className="text-[10px] text-zinc-500 block">Outstanding</span>
                            <span className="text-xs font-bold text-[#FF66B2]">₦{outstanding.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Schedule info */}
                      <div className="p-3 rounded-xl bg-[#171722] border border-[#29293A] mt-4 flex justify-between items-center text-xs">
                        <div>
                          <span className="text-zinc-400 block text-[11px]">Installment Cycle:</span>
                          <span className="text-white font-semibold capitalize">
                            ₦{plan.depositPerCycle.toLocaleString()} / {plan.frequency}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-zinc-400 block text-[11px]">Next Payment Due:</span>
                          <span className="text-[#ECC260] font-semibold">{plan.nextPaymentDate}</span>
                        </div>
                      </div>

                      {/* Transaction History Snippet */}
                      <div className="mt-4 pt-3 border-t border-zinc-800/80">
                        <div className="text-xs font-semibold text-zinc-400 mb-2">Deposit History ({plan.transactions.length}):</div>
                        <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                          {plan.transactions.map(t => (
                            <div key={t.id} className="flex justify-between items-center text-xs p-2 rounded-lg bg-black/30 text-zinc-300">
                              <div>
                                <span className="font-semibold text-white">₦{t.amount.toLocaleString()}</span>
                                <span className="text-[10px] text-zinc-500 ml-2">{t.date}</span>
                              </div>
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                t.status === 'approved' 
                                  ? 'bg-emerald-500/10 text-emerald-400' 
                                  : t.status === 'pending'
                                    ? 'bg-amber-500/10 text-amber-400'
                                    : 'bg-red-500/10 text-red-400'
                              }`}>
                                {t.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-4 border-t border-zinc-800/80">
                      {isCompleted ? (
                        <button
                          onClick={() => handleCompleteToOrder(plan)}
                          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 shadow-lg"
                        >
                          <Truck className="w-4 h-4" />
                          Target Complete — Arrange Free Delivery Now
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenDepositModal(plan.id, plan.depositPerCycle)}
                          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B88B22] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 shadow-md"
                        >
                          <CreditCard className="w-4 h-4" />
                          Make Installment Deposit (₦{plan.depositPerCycle.toLocaleString()})
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL: MAKE DEPOSIT TO SAVE TO BUY */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md" 
            onClick={() => setIsDepositModalOpen(false)} 
          />
          <div className="relative bg-[#111118] border border-[#2D2D40] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl z-10 text-zinc-300 space-y-5">
            <div className="border-b border-zinc-800 pb-3">
              <h3 className="font-serif-luxury text-lg font-bold text-white">
                Log Installment Deposit
              </h3>
              <p className="text-xs text-zinc-400">
                Make your installment deposit by bank transfer or an approved payment method.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Deposit Amount (₦):
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full bg-[#181824] border border-[#2E2E42] text-white text-base font-bold rounded-xl p-3 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                Payment Channel:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled
                  onClick={() => window.alert('Paystack deposits are not activated yet. Please use bank transfer.')}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                    depositMethod === 'paystack'
                      ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#ECC260]'
                      : 'border-zinc-800 text-zinc-400'
                  }`}
                >
                  Paystack (coming soon)
                </button>
                <button
                  type="button"
                  onClick={() => setDepositMethod('bank_transfer')}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                    depositMethod === 'bank_transfer'
                      ? 'border-[#FF2A85] bg-[#E6007A]/15 text-white'
                      : 'border-zinc-800 text-zinc-400'
                  }`}
                >
                  Bank Transfer (Manual)
                </button>
              </div>
            </div>

            {depositMethod === 'bank_transfer' && (
              <div className="p-4 rounded-xl bg-black/50 border border-zinc-800 space-y-2 text-xs">
                <label className="block text-zinc-300 font-semibold">Upload actual transfer receipt</label>
                <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={isUploadingProof} onChange={async (e) => {
                  const input = e.currentTarget;
                  const file = input.files?.[0];
                  if (!file) return;
                  if (file.size > 10 * 1024 * 1024) { window.alert('Receipt must be under 10 MB.'); input.value = ''; return; }
                  setIsUploadingProof(true);
                  try {
                    const body = new FormData();
                    body.append('file', file);
                    body.append('upload_preset', 'pkess-products');
                    const response = await fetch('https://api.cloudinary.com/v1_1/jmit9wsv/image/upload', { method: 'POST', body });
                    if (!response.ok) throw new Error('Receipt upload failed.');
                    const result = await response.json();
                    if (!result.secure_url) throw new Error('No receipt URL returned.');
                    setProofUrl(result.secure_url);
                  } catch (error) { console.error(error); window.alert('Could not upload receipt. Please try again.'); }
                  finally { setIsUploadingProof(false); input.value = ''; }
                }} className="block w-full text-xs text-zinc-300" />
                {proofUrl && <p className="text-emerald-400">Receipt uploaded successfully.</p>}
              </div>
            )}
            {depositMethod === 'bank_transfer' && (
              <div className="p-4 rounded-xl bg-black/50 border border-zinc-800 space-y-2 text-xs">
                <div className="text-zinc-400">P-Kess Bank Account:</div>
                <div className="text-white font-bold">{paymentSettings.bankName}</div>
                <div className="text-[#ECC260] font-mono text-sm tracking-wider font-extrabold">
                  {paymentSettings.accountNumber}
                </div>
                <div className="text-zinc-400">{paymentSettings.accountName}</div>

                <div className="pt-2 border-t border-zinc-800">
                  <label className="block text-zinc-400 mb-1">Payment Reference / Narration:</label>
                  <input
                    type="text"
                    value={depositRef}
                    onChange={(e) => setDepositRef(e.target.value)}
                    className="w-full bg-[#161620] border border-zinc-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleConfirmDeposit}
              disabled={isUploadingProof}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B88B22] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 shadow-lg"
            >
              Confirm ₦{depositAmount.toLocaleString()} Deposit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
