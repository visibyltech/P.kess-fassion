import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  PiggyBank 
} from 'lucide-react';

interface CartDrawerProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    cartTotal, 
    cartSubtotal, 
    cartWholesaleSavings,
    wholesaleSettings 
  } = useStore();

  if (!isCartOpen) return null;

  const totalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const unitsNeededForWholesale = Math.max(0, wholesaleSettings.minUnits - totalItemCount);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)} 
      />

      <div className="fixed inset-y-0 right-0 w-full max-w-md">
        <div className="h-full w-full min-w-0 bg-[#0D0D12] border-l border-[#242432] shadow-2xl flex flex-col overflow-x-hidden">
          {/* Header */}
          <div className="p-5 border-b border-[#1E1E2A] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1A1A24] border border-[#2D2D3E] flex items-center justify-center text-[#D4AF37]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-brand-display text-white text-base font-bold tracking-wide">
                  Your Shopping Bag
                </h3>
                <span className="text-xs text-zinc-400">
                  {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wholesale Discount Threshold Bar */}
          <div className="bg-[#14141B] px-4 sm:px-5 py-3 border-b border-[#222230] min-w-0">
            {unitsNeededForWholesale === 0 ? (
              <div className="flex items-center gap-2 text-xs text-[#ECC260] font-medium">
                <Sparkles className="w-4 h-4 text-[#E6007A] shrink-0" />
                <span>
                  🎉 <strong>Wholesale Unlocked!</strong> You are receiving up to 15% bulk discounts on eligible items.
                </span>
              </div>
            ) : (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-zinc-300 mb-1.5">
                  <span className="flex items-center gap-1 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Wholesale Threshold:
                  </span>
                  <span className="text-[#ECC260] font-bold">
                    Add {unitsNeededForWholesale} more for 15% Off
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E6007A] transition-all duration-300"
                    style={{ width: `${Math.min(100, (totalItemCount / wholesaleSettings.minUnits) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden p-3 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#161620] border border-[#2A2A38] flex items-center justify-center text-zinc-500 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-white font-medium text-base mb-1">Your bag is empty</h4>
                <p className="text-xs text-zinc-400 max-w-xs mb-6">
                  Explore our luxury gowns, Italian heels, designer bags and accessories.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigate('shop');
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#D4AF37] text-black font-semibold text-xs tracking-wider uppercase hover:brightness-110 transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div 
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
                  className="w-full min-w-0 p-3 rounded-xl bg-[#14141B] border border-[#242432] flex gap-3 relative group"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-lg bg-black shrink-0 border border-[#2A2A3A]"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between overflow-hidden">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-white text-xs font-semibold truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[11px] text-zinc-400 mt-1">
                        <span className="bg-[#1C1C26] px-1.5 py-0.5 rounded text-zinc-300">
                          Size: {item.selectedSize}
                        </span>
                        <span className="bg-[#1C1C26] px-1.5 py-0.5 rounded text-zinc-300">
                          {item.selectedColor}
                        </span>
                      </div>

                      {item.isWholesale && (
                        <div className="mt-1.5">
                          <span className="text-[10px] font-bold text-black bg-[#ECC260] px-1.5 py-0.2 rounded uppercase tracking-wider">
                            Wholesale Pricing
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-zinc-800/60 min-w-0">
                      <div>
                        <span className="text-xs font-bold text-[#ECC260]">
                          ₦{item.unitPrice.toLocaleString()}
                        </span>
                        {item.isWholesale && (
                          <span className="ml-1.5 text-[10px] text-zinc-500 line-through">
                            ₦{item.product.retailPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Quantity buttons */}
                      <div className="flex items-center gap-2 bg-[#1B1B24] border border-[#2F2F40] rounded-lg p-0.5">
                        <button
                          onClick={() => updateCartQuantity(index, item.quantity - 1)}
                          className="p-1 text-zinc-400 hover:text-white rounded"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(index, item.quantity + 1)}
                          className="p-1 text-zinc-400 hover:text-white rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="shrink-0 min-w-0 p-3 sm:p-5 border-t border-[#1F1F2C] bg-[#111116] space-y-3">
              <div className="space-y-1.5 text-xs min-w-0">
                <div className="flex justify-between gap-3 text-zinc-400 min-w-0">
                  <span>Subtotal:</span>
                  <span>₦{cartSubtotal.toLocaleString()}</span>
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

                <div className="flex justify-between items-center gap-3 text-white text-base font-bold pt-2 border-t border-zinc-800 min-w-0">
                  <span>Total Payable:</span>
                  <span className="text-[#ECC260] text-right whitespace-nowrap">₦{cartTotal.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-zinc-500 text-right">
                  Delivery calculated at checkout based on Nigerian state
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigate('checkout');
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#ECC260] to-[#B88B22] text-black font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-[#D4AF37]/20"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      onNavigate('cart');
                    }}
                    className="flex-1 py-2 rounded-lg bg-[#1B1B24] border border-[#2E2E3E] text-zinc-300 text-xs font-medium hover:bg-white/5 transition-colors text-center"
                  >
                    View Bag Details
                  </button>
                  <button
                    onClick={clearCart}
                    className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400 text-xs transition-colors"
                    title="Clear entire cart"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="pt-2 text-center flex flex-wrap items-center justify-center gap-2 text-[10px] leading-relaxed text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Secure Checkout & P-Kess Verified Delivery Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
