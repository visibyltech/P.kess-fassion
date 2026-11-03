import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { NIGERIAN_STATES } from '../data/nigeriaLocations';
import { BRAND_CONSTANTS } from '../data/initialData';
import { 
  ShieldCheck, 
  Truck, 
  MapPin, 
  Building2, 
  Copy, 
  Check, 
  Upload, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Phone,
  Mail,
  User,
  ShoppingBag
} from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { 
    cart, 
    cartTotal, 
    cartSubtotal, 
    cartWholesaleSavings, 
    createOrder, 
    currentUser, 
    setIsAuthModalOpen,
    paymentSettings,
    showToast 
  } = useStore();

  // Form State
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [deliveryMethod, setDeliveryMethod] = useState<'home' | 'pickup'>('home');
  const [selectedState, setSelectedState] = useState<string>(currentUser?.savedAddress?.state || 'Delta');
  const [selectedLga, setSelectedLga] = useState<string>(currentUser?.savedAddress?.lga || 'Oshimili South (Asaba)');
  const [streetAddress, setStreetAddress] = useState<string>(currentUser?.savedAddress?.street || '');
  const [deliveryInstructions, setDeliveryInstructions] = useState<string>('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'save_to_buy' | 'bnpl_credibly'>('bank_transfer');
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [awaitingAuthentication, setAwaitingAuthentication] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);
  const [uploadedProofUrl, setUploadedProofUrl] = useState<string>('');
  const [bankReference, setBankReference] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);


  useEffect(() => {
    if (awaitingAuthentication && currentUser) {
      setFullName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setAwaitingAuthentication(false);
      setShowPaymentDetails(true);
      showToast('You are signed in. You can now continue with payment.');
    }
  }, [awaitingAuthentication, currentUser]);

  const currentStateData = NIGERIAN_STATES[selectedState] || NIGERIAN_STATES['Delta'];
  const deliveryFee = deliveryMethod === 'pickup' ? 0 : currentStateData.deliveryFee;
  const finalPayableTotal = cartTotal + deliveryFee;

  // Sync LGAs when state changes
  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const stateObj = NIGERIAN_STATES[stateName];
    if (stateObj && stateObj.lgas.length > 0) {
      setSelectedLga(stateObj.lgas[0]);
    }
  };

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(paymentSettings.accountNumber);
    setCopiedBank(true);
    showToast("Bank account number copied to clipboard!");
    setTimeout(() => setCopiedBank(false), 3000);
  };

  const handleSimulateReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create local preview blob
      const url = URL.createObjectURL(file);
      setUploadedProofUrl(url);
      showToast("Transfer receipt attached successfully!");
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Require a customer account before exposing payment instructions.
    if (!currentUser) {
      setAwaitingAuthentication(true);
      setIsAuthModalOpen(true);
      return;
    }

    if (!fullName || !email || !phone) {
      showToast("Please fill in your name, email and phone number", "error");
      return;
    }

    if (deliveryMethod === 'home' && !streetAddress) {
      showToast("Please enter your delivery street address", "error");
      return;
    }

    if (!showPaymentDetails) {
      setShowPaymentDetails(true);
      showToast('Choose your payment option below to continue.');
      return;
    }

    if (paymentMethod === 'save_to_buy') {
      const firstItem = cart[0];
      onNavigate('save-to-buy', {
        ...(firstItem ? {
          productId: firstItem.product.id,
          selectedSize: firstItem.selectedSize,
          selectedColor: firstItem.selectedColor,
          quantity: firstItem.quantity
        } : {})
      });
      return;
    }

    if (paymentMethod === 'bnpl_credibly') {
      onNavigate('bnpl');
      return;
    }

    // Require real transfer evidence before recording a bank-transfer order.
    if (!uploadedProofUrl) {
      showToast('Please upload your bank transfer receipt before submitting the order.', 'error');
      return;
    }

    // Process Bank Transfer Order
    setIsProcessing(true);
    setTimeout(() => {
      const newOrder = createOrder({
        customerId: currentUser?.id || 'guest-' + Date.now(),
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        deliveryMethod,
        state: selectedState,
        lga: deliveryMethod === 'pickup' ? 'Asaba Showroom' : selectedLga,
        address: deliveryMethod === 'pickup' 
          ? BRAND_CONSTANTS.address 
          : streetAddress,
        deliveryInstructions,
        items: cart,
        subtotal: cartSubtotal,
        wholesaleSavings: cartWholesaleSavings,
        deliveryFee,
        total: finalPayableTotal,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'awaiting_verification',
        orderStatus: 'pending',
        proofOfPaymentUrl: uploadedProofUrl,
        bankTransferRef: bankReference || 'TRF-' + Math.floor(10000000 + Math.random() * 90000000),
        courier: 'Pending Verification'
      });
      setIsProcessing(false);
      setConfirmedOrder(newOrder);
    }, 1200);
  };

  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
            Order Confirmed
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white">
            Thank You, {confirmedOrder.customerName}!
          </h1>
          <p className="text-sm text-zinc-300">
            Your order has been recorded. Reference Number:{' '}
            <strong className="text-[#ECC260] font-mono text-base">{confirmedOrder.orderNumber}</strong>
          </p>
        </div>

        {/* Receipt Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#12121A] border border-[#2B2B3E] text-left space-y-5 text-xs text-zinc-300">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <div>
              <span className="text-zinc-500 block">Payment Method</span>
              <span className="text-white font-bold uppercase">{confirmedOrder.paymentMethod.replace('_', ' ')}</span>
            </div>
            <div className="text-right">
              <span className="text-zinc-500 block">Payment Status</span>
              <span className={`font-bold uppercase ${confirmedOrder.paymentStatus === 'verified' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {confirmedOrder.paymentStatus.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-zinc-500 block font-semibold">Ordered Items ({confirmedOrder.items.length}):</span>
            {confirmedOrder.items.map((it: any, i: number) => (
              <div key={i} className="flex justify-between items-center py-1">
                <span className="text-white">
                  {it.quantity}x {it.product.name} ({it.selectedSize}, {it.selectedColor})
                </span>
                <span className="text-[#ECC260] font-semibold">₦{(it.unitPrice * it.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-zinc-400">Delivery Method:</span>
              <span className="text-white capitalize">{confirmedOrder.deliveryMethod === 'pickup' ? 'Store Pickup (Asaba Showroom)' : 'Home Delivery'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Delivery Address:</span>
              <span className="text-white text-right max-w-xs">{confirmedOrder.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Delivery Fee:</span>
              <span className="text-white">{confirmedOrder.deliveryFee === 0 ? 'FREE' : `₦${confirmedOrder.deliveryFee.toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-zinc-800">
              <span>Total Paid:</span>
              <span className="text-[#ECC260]">₦{confirmedOrder.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate('track-order', { orderNumber: confirmedOrder.orderNumber })}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B88B22] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg"
          >
            Track Order Progress
          </button>
          <button
            onClick={() => onNavigate('shop')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1A1A24] text-zinc-300 hover:text-white border border-zinc-700 text-xs font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-white font-serif-luxury text-2xl font-bold">Your cart is empty</h2>
        <p className="text-xs text-zinc-400">Please add items to your cart before proceeding to checkout.</p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-2.5 rounded-full bg-[#D4AF37] text-black font-bold text-xs uppercase"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-[#242432] pb-4">
        <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">
          Secure Nigerian Checkout
        </span>
        <h1 className="font-brand-display text-2xl sm:text-4xl font-bold text-white uppercase">
          Finalize Your <span className="gold-gradient-text">Delivery & Payment</span>
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Details & Delivery & Payment */}
        <div className="lg:col-span-8 space-y-8">
          {/* STEP 1: CUSTOMER CONTACT */}
          <div className="rounded-3xl bg-[#111117] border border-[#252536] p-6 sm:p-8 space-y-5 shadow-xl">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 text-[#ECC260] flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h2 className="font-serif-luxury text-lg font-bold text-white">
                Customer & Contact Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-zinc-300 block mb-1 font-medium">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Chioma Okonkwo"
                    className="w-full bg-[#181824] border border-[#2D2D42] rounded-xl p-3 pl-9 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                  <User className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="text-zinc-300 block mb-1 font-medium">Email Address (Order Updates) *</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. chioma@gmail.com"
                    className="w-full bg-[#181824] border border-[#2D2D42] rounded-xl p-3 pl-9 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                  <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="text-zinc-300 block mb-1 font-medium">Phone Number (Call on Delivery) *</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 09012776272"
                    className="w-full bg-[#181824] border border-[#2D2D42] rounded-xl p-3 pl-9 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                  <Phone className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: DELIVERY METHOD & LOCATION */}
          <div className="rounded-3xl bg-[#111117] border border-[#252536] p-6 sm:p-8 space-y-5 shadow-xl">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 text-[#ECC260] flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h2 className="font-serif-luxury text-lg font-bold text-white">
                Delivery Method & Nigerian Location
              </h2>
            </div>

            {/* Delivery Method Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDeliveryMethod('home')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  deliveryMethod === 'home'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                    : 'border-[#262638] bg-[#151520] hover:border-zinc-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-bold text-white text-xs">Doorstep Courier Delivery</span>
                  </div>
                  <span className="text-xs text-[#ECC260] font-bold">₦{currentStateData.deliveryFee.toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Delivered to your home or office address across all 36 states & FCT.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod('pickup')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  deliveryMethod === 'pickup'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                    : 'border-[#262638] bg-[#151520] hover:border-zinc-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#E6007A]" />
                    <span className="font-bold text-white text-xs">Asaba Showroom Pickup</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold uppercase">FREE</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Pick up at No. 12, DLA Road, off Summit Road, Asaba, Delta State.
                </p>
              </button>
            </div>

            {/* Location Inputs (When home delivery selected) */}
            {deliveryMethod === 'home' ? (
              <div className="space-y-4 pt-2 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-300 block mb-1 font-medium">Nigerian State *</label>
                    <select
                      value={selectedState}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full bg-[#181824] border border-[#2D2D42] rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      {Object.keys(NIGERIAN_STATES).map(st => (
                        <option key={st} value={st}>{st} State</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-300 block mb-1 font-medium">Local Government Area (LGA) *</label>
                    <select
                      value={selectedLga}
                      onChange={(e) => setSelectedLga(e.target.value)}
                      className="w-full bg-[#181824] border border-[#2D2D42] rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      {currentStateData.lgas.map(lga => (
                        <option key={lga} value={lga}>{lga}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-zinc-300 block mb-1 font-medium">Street Address / Landmark *</label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="e.g. Plot 14 Okpanam Road, Near Federal Secretariat"
                    className="w-full bg-[#181824] border border-[#2D2D42] rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 block mb-1 font-medium">Delivery Notes / Gate Instructions (Optional)</label>
                  <input
                    type="text"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    placeholder="e.g. Call my second line 08103575549 if unavailable"
                    className="w-full bg-[#181824] border border-[#2D2D42] rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-1.5 text-xs">
                <span className="text-[#ECC260] font-bold block">Showroom Collection Address:</span>
                <p className="text-white font-medium">{BRAND_CONSTANTS.address}</p>
                <p className="text-zinc-400 text-[11px]">
                  Hours: Monday – Saturday, 8:30 AM – 7:00 PM. We will notify you via SMS/Email as soon as your items are packed.
                </p>
              </div>
            )}
          </div>

          {showPaymentDetails && (
          {/* STEP 3: PAYMENT METHOD */}
          <div className="rounded-3xl bg-[#111117] border border-[#252536] p-6 sm:p-8 space-y-5 shadow-xl">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 text-[#ECC260] flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h2 className="font-serif-luxury text-lg font-bold text-white">
                Payment Channel
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('save_to_buy')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'save_to_buy'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/15'
                    : 'border-[#262638] bg-[#151520]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-bold text-white text-xs">Save to Buy (Installment Payments)</span>
                </div>
                <p className="text-[11px] text-zinc-400">Pay gradually with a scheduled installment plan</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-[#FF2A85] bg-[#E6007A]/15'
                    : 'border-[#262638] bg-[#151520]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 text-[#FF2A85]" />
                  <span className="font-bold text-white text-xs">Bank Transfer</span>
                </div>
                <p className="text-[11px] text-zinc-400">Manual transfer with proof receipt upload</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('bnpl_credibly')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'bnpl_credibly'
                    ? 'border-[#ECC260] bg-[#ECC260]/15'
                    : 'border-[#262638] bg-[#151520]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#ECC260]" />
                  <span className="font-bold text-white text-xs">Buy Now Pay Later (Credibly)</span>
                </div>
                <p className="text-[11px] text-zinc-400">Installment evaluation status</p>
              </button>
            </div>

            {/* MANUAL BANK TRANSFER INSTRUCTIONS & RECEIPT UPLOAD */}
            {paymentMethod === 'bank_transfer' && (
              <div className="p-5 rounded-2xl bg-[#161622] border border-[#2D2D42] space-y-4 text-xs">
                <div className="border-b border-zinc-800 pb-3">
                  <span className="text-[#ECC260] uppercase tracking-wider font-bold block mb-1">
                    Official P-Kess Fashion World Account Details
                  </span>
                  <p className="text-zinc-300">
                    {paymentSettings.bankInstructions}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-black/40 p-3.5 rounded-xl border border-zinc-800">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Bank:</span>
                    <span className="text-white font-bold">{paymentSettings.bankName}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Account Name:</span>
                    <span className="text-white font-bold">{paymentSettings.accountName}</span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-start gap-2">
                    <div>
                      <span className="text-zinc-500 block text-[10px]">Account Number:</span>
                      <span className="text-[#ECC260] font-mono text-sm font-black">{paymentSettings.accountNumber}</span>
                    </div>
                    <button
                      type="button"
                      onClick={copyAccountNumber}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                      title="Copy Account Number"
                    >
                      {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Upload proof of payment */}
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <label className="text-zinc-300 font-semibold block">
                    Upload Bank Transfer Receipt (Debit Alert / Screenshot):
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs flex items-center gap-2 border border-zinc-700">
                      <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{uploadedProofUrl ? 'Receipt Attached (Change)' : 'Select Receipt File'}</span>
                      <input 
                        type="file" 
                        accept="image/*,.pdf" 
                        className="hidden" 
                        onChange={handleSimulateReceiptUpload}
                      />
                    </label>

                    {uploadedProofUrl && (
                      <span className="text-emerald-400 flex items-center gap-1 font-semibold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        Evidence Uploaded
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          )}
        </div>

        {/* Right Column: Order Review & Final Submit */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl bg-[#121218] border border-[#2B2B3E] p-6 space-y-5 shadow-xl sticky top-24">
            <h3 className="font-brand-display text-base font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-3">
              Order Items ({cart.length})
            </h3>

            {/* Item list */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cart.map((item, i) => (
                <div key={i} className="flex gap-3 text-xs">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-14 object-cover rounded-lg border border-zinc-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold truncate">{item.product.name}</h4>
                    <span className="text-zinc-400 block text-[11px]">
                      {item.quantity}x • {item.selectedSize} • {item.selectedColor}
                    </span>
                    <span className="text-[#ECC260] font-bold">₦{(item.unitPrice * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 pt-3 border-t border-zinc-800 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-white">₦{cartSubtotal.toLocaleString()}</span>
              </div>

              {cartWholesaleSavings > 0 && (
                <div className="flex justify-between text-[#ECC260] font-semibold">
                  <span>Wholesale Discount:</span>
                  <span>-₦{cartWholesaleSavings.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span className="text-white">
                  {deliveryFee === 0 ? 'FREE (Store Pickup)' : `₦${deliveryFee.toLocaleString()}`}
                </span>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-between items-baseline text-base font-bold text-white">
                <span>Total Amount:</span>
                <span className="text-[#ECC260] text-xl">
                  ₦{finalPayableTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#ECC260] to-[#B88B22] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-[#D4AF37]/25 disabled:opacity-50"
            >
              {isProcessing ? 'Processing Transaction...' : !currentUser ? 'Sign In / Sign Up to Continue' : !showPaymentDetails ? 'Continue to Payment' : paymentMethod === 'save_to_buy' ? 'Continue to Save to Buy' : paymentMethod === 'bnpl_credibly' ? 'Continue to Credibly' : `Submit Order (₦${finalPayableTotal.toLocaleString()})`}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-[10px] text-zinc-400 space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-zinc-300">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Your order and payment details are protected</span>
              </div>
            </div>
          </div>
        </div>
      </form>

    </div>
  );
};
