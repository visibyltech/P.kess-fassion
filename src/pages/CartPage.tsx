import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { NIGERIAN_STATES } from '../data/nigeriaLocations';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck,
  RotateCcw
} from 'lucide-react';

interface CartPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    cartTotal, 
    cartSubtotal, 
    cartWholesaleSavings,
    wholesaleSettings 
  } = useStore();

  const [selectedState, setSelectedState] = useState<string>('Delta');
  const estimatedDelivery = NIGERIAN_STATES[selectedState]?.deliveryFee || 2500;

  const totalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const unitsNeededForWholesale = Math.max(0, wholesaleSettings.minUnits - totalItemCount);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-[#161622] border border-[#2B2B3E] flex items-center justify-center text-zinc-500 mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif-luxury text-2xl font-bold text-white">Your Shopping Bag is Empty</h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
          Explore our signature Swiss lace boubous, Italian metallic heels, structured bags and 24K gold jewelry.
        </p>
        <div className="pt-2">
          <button
            onClick={() => onNavigate('shop')}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B88B22] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg"
          >
            Explore Collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-[#232330] pb-4 flex justify-between items-end">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">
            Shopping Cart
          </span>
          <h1 className="font-brand-display text-2xl sm:text-4xl font-bold text-white uppercase">
            Review Your <span className="gold-gradient-text">Selected Pieces</span>
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear Bag
        </button>
      </div>

      {/* Wholesale Tier Notice */}
      <div className="p-4 rounded-2xl bg-[#14141E] border border-[#2C2C40] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#ECC260] shrink-0">
            <Sparkles className="w-5 h-5 text-[#E6007A]" />
          </div>
          <div>
            <h4 className="text-white text-xs font-bold">
              {unitsNeededForWholesale === 0 
                ? 'Wholesale Tier Discount Active (15% Off Eligible Items)'
                : `Add ${unitsNeededForWholesale} more item(s) to unlock 15% wholesale discount!`}
            </h4>
            <p className="text-[11px] text-zinc-400">
              Automatic volume pricing applies when total cart quantity reaches {wholesaleSettings.minUnits} units.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('wholesale')}
          className="text-xs text-[#ECC260] font-semibold underline shrink-0"
        >
          View Wholesale Hub
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item, index) => (
            <div
              key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
              className="p-4 sm:p-5 rounded-2xl bg-[#111117] border border-[#242432] flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xl border border-zinc-800 shrink-0"
                />
                <div className="space-y-1">
                  <span className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-wider">
                    {item.product.category}
                  </span>
                  <h3 
                    onClick={() => onNavigate('product-detail', { slug: item.product.slug })}
                    className="font-serif-luxury text-sm sm:text-base font-bold text-white hover:text-[#D4AF37] cursor-pointer"
                  >
                    {item.product.name}
                  </h3>
                  <div className="text-xs text-zinc-400">
                    Size: <span className="text-zinc-200">{item.selectedSize}</span> • Color: <span className="text-zinc-200">{item.selectedColor}</span>
                  </div>
                  {item.isWholesale && (
                    <span className="inline-block mt-1 text-[10px] font-bold text-black bg-[#ECC260] px-2 py-0.5 rounded uppercase">
                      Wholesale Tier Applied
                    </span>
                  )}
                </div>
              </div>

              {/* Price and Quantity Controls */}
              <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                <div className="flex items-center border border-[#2D2D40] rounded-xl bg-[#161622]">
                  <button
                    onClick={() => updateCartQuantity(index, item.quantity - 1)}
                    className="px-3 py-1.5 text-zinc-400 hover:text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 text-xs font-bold text-white min-w-[28px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(index, item.quantity + 1)}
                    className="px-3 py-1.5 text-zinc-400 hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[100px]">
                  <div className="text-sm font-bold text-[#ECC260]">
                    ₦{(item.unitPrice * item.quantity).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    ₦{item.unitPrice.toLocaleString()} each
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(index)}
                  className="text-zinc-500 hover:text-red-400 p-1.5 transition-colors"
                  title="Remove from bag"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl bg-[#121218] border border-[#2A2A3C] p-6 space-y-5 shadow-xl">
            <h3 className="font-brand-display text-base font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-3">
              Order Summary
            </h3>

            {/* Estimated State Selector */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Estimate Delivery State:
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-[#181824] border border-[#2E2E42] text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-[#D4AF37]"
              >
                {Object.keys(NIGERIAN_STATES).map(st => (
                  <option key={st} value={st}>{st} State</option>
                ))}
              </select>
            </div>

            <div className="space-y-2.5 text-xs text-zinc-400 pt-2">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="text-white">₦{cartSubtotal.toLocaleString()}</span>
              </div>

              {cartWholesaleSavings > 0 && (
                <div className="flex justify-between text-[#ECC260] font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#E6007A]" />
                    Wholesale Savings:
                  </span>
                  <span>-₦{cartWholesaleSavings.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Delivery ({selectedState}):</span>
                <span className="text-white">₦{estimatedDelivery.toLocaleString()}</span>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-between items-baseline text-base font-bold text-white">
                <span>Estimated Total:</span>
                <span className="text-[#ECC260] text-xl">
                  ₦{(cartTotal + estimatedDelivery).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('checkout')}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#ECC260] to-[#B88B22] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-[#D4AF37]/25"
            >
              Proceed to Secure Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center text-[11px] text-zinc-400 space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-zinc-300">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Paystack PCI-DSS Verified & Central Bank Protected</span>
              </div>
              <p>Store pickup is free at our Asaba showroom.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
