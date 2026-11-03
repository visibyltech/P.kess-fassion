import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { NIGERIAN_STATES } from '../data/nigeriaLocations';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  PiggyBank, 
  CreditCard, 
  Truck, 
  MapPin, 
  Lock, 
  LogOut, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface CustomerDashboardPageProps {
  initialTab?: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const CustomerDashboardPage: React.FC<CustomerDashboardPageProps> = ({ 
  initialTab = 'overview', 
  onNavigate 
}) => {
  const { 
    currentUser, 
    orders, 
    wishlist, 
    products, 
    savingsPlans, 
    bnplApplications, 
    logout, 
    updateUserProfile,
    setIsCartOpen,
    showToast 
  } = useStore();

  const [activeTab, setActiveTab] = useState(initialTab);

  // Profile Form state
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [state, setState] = useState(currentUser?.savedAddress?.state || 'Delta');
  const [lga, setLga] = useState(currentUser?.savedAddress?.lga || 'Oshimili South (Asaba)');
  const [street, setStreet] = useState(currentUser?.savedAddress?.street || 'Plot 14 Okpanam Road, Asaba');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const userOrders = orders.filter(o => !currentUser || o.customerId === currentUser.id || o.customerEmail === currentUser.email);
  const userWishlistProducts = products.filter(p => wishlist.includes(p.id));
  const userSavings = savingsPlans.filter(s => !currentUser || s.customerId === currentUser.id);
  const userBnpl = bnplApplications.filter(b => !currentUser || b.customerId === currentUser.id);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      savedAddress: { state, lga, street }
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }
    showToast("Password changed successfully!");
    setCurrentPassword('');
    setNewPassword('');
  };

  const navTabs = [
    { id: 'overview', label: 'Dashboard Overview', icon: User },
    { id: 'orders', label: 'My Orders', icon: Truck, count: userOrders.length },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, count: userWishlistProducts.length },
    { id: 'savings', label: 'Save to Buy Plans', icon: PiggyBank, count: userSavings.length },
    { id: 'bnpl', label: 'BNPL Applications', icon: CreditCard, count: userBnpl.length },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'password', label: 'Change Password', icon: Lock }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Dashboard Top Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#14141B] via-[#1E1422] to-[#121218] border border-[#2B2B3E] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#E6007A] flex items-center justify-center text-black font-extrabold text-2xl shadow-lg">
            {currentUser?.name?.charAt(0).toUpperCase() || 'P'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white">
                {currentUser?.name || 'Valued Client'}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37]/20 text-[#ECC260] uppercase">
                {currentUser?.role === 'admin' ? 'Executive Admin' : 'VIP Fashion Member'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {currentUser?.email || 'pkessvariety@gmail.com'} • {currentUser?.phone || '09012776272'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('shop')}
            className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-semibold text-xs hover:brightness-110 transition-all"
          >
            Shop Catalogue
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar Tabs + Active Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Menu */}
        <div className="lg:col-span-3 rounded-2xl bg-[#111116] border border-[#252536] p-3 space-y-1">
          {navTabs.map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#D4AF37]/20 to-transparent text-[#ECC260] font-bold border-l-2 border-[#D4AF37]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#ECC260]' : 'text-zinc-500'}`} />
                  <span>{t.label}</span>
                </div>
                {t.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-[#D4AF37] text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#121218] border border-[#252536] space-y-1">
                  <span className="text-zinc-500 text-xs uppercase font-bold">Total Orders</span>
                  <div className="text-2xl font-black text-white">{userOrders.length}</div>
                  <span className="text-[11px] text-[#ECC260]">All deliveries tracked</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#121218] border border-[#252536] space-y-1">
                  <span className="text-zinc-500 text-xs uppercase font-bold">Wishlist Items</span>
                  <div className="text-2xl font-black text-white">{userWishlistProducts.length}</div>
                  <span className="text-[11px] text-[#FF66B2]">Saved fashion pieces</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#121218] border border-[#252536] space-y-1">
                  <span className="text-zinc-500 text-xs uppercase font-bold">Active Save to Buy</span>
                  <div className="text-2xl font-black text-white">{userSavings.length}</div>
                  <span className="text-[11px] text-emerald-400">Installment plans</span>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="rounded-2xl bg-[#111116] border border-[#252536] p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                  <h3 className="font-serif-luxury text-base font-bold text-white">Recent Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-[#ECC260] hover:underline">
                    View All
                  </button>
                </div>

                {userOrders.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4">No recent orders yet.</p>
                ) : (
                  <div className="space-y-3">
                    {userOrders.slice(0, 2).map(o => (
                      <div key={o.id} className="p-4 rounded-xl bg-black/40 border border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-white font-mono">{o.orderNumber}</strong>
                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#D4AF37]/20 text-[#ECC260]">
                              {o.orderStatus}
                            </span>
                          </div>
                          <span className="text-zinc-400 text-[11px] block mt-1">
                            {o.items.length} items • Total: ₦{o.total.toLocaleString()} • Placed on {o.createdAt.split('T')[0]}
                          </span>
                        </div>

                        <button
                          onClick={() => onNavigate('track-order', { orderNumber: o.orderNumber })}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5"
                        >
                          Track Live
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="rounded-2xl bg-[#111116] border border-[#252536] p-6 space-y-5">
              <h3 className="font-serif-luxury text-lg font-bold text-white border-b border-zinc-800 pb-3">
                All Order History ({userOrders.length})
              </h3>

              {userOrders.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-xs">
                  No orders recorded yet. Start shopping our collections!
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map(order => (
                    <div key={order.id} className="p-5 rounded-2xl bg-[#161622] border border-[#2B2B3E] space-y-4 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                        <div>
                          <span className="font-mono text-sm font-bold text-white">{order.orderNumber}</span>
                          <span className="text-zinc-500 ml-3 text-[11px]">{order.createdAt.split('T')[0]}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            order.paymentStatus === 'verified' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            Payment: {order.paymentStatus}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#D4AF37]/20 text-[#ECC260]">
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>

                      {/* Line items */}
                      <div className="space-y-2">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center text-zinc-300">
                            <span>{it.quantity}x {it.product.name} ({it.selectedSize}, {it.selectedColor})</span>
                            <span className="text-white font-semibold">₦{(it.unitPrice * it.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-zinc-800 text-zinc-400">
                        <span>Total Paid: <strong className="text-[#ECC260]">₦{order.total.toLocaleString()}</strong></span>
                        <button
                          onClick={() => onNavigate('track-order', { orderNumber: order.orderNumber })}
                          className="px-3.5 py-1.5 rounded-lg bg-[#D4AF37] text-black font-bold text-xs"
                        >
                          Track Delivery
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b border-[#242432] pb-3">
                <h3 className="font-serif-luxury text-lg font-bold text-white">
                  My Saved Fashion Pieces ({userWishlistProducts.length})
                </h3>
              </div>

              {userWishlistProducts.length === 0 ? (
                <div className="text-center py-16 bg-[#111116] rounded-2xl border border-[#252536] text-xs text-zinc-500">
                  Your wishlist is empty. Tap the heart icon on any product to save it for later.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userWishlistProducts.map(p => (
                    <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SAVINGS (SAVE TO BUY) */}
          {activeTab === 'savings' && (
            <div className="rounded-2xl bg-[#111116] border border-[#252536] p-6 space-y-5">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <h3 className="font-serif-luxury text-lg font-bold text-white">
                  Save to Buy Plans ({userSavings.length})
                </h3>
                <button
                  onClick={() => onNavigate('save-to-buy')}
                  className="px-3 py-1.5 rounded-lg bg-[#E6007A] text-white text-xs font-semibold"
                >
                  Go to Savings Portal
                </button>
              </div>

              {userSavings.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-xs">
                  No active savings plans right now.
                </div>
              ) : (
                <div className="space-y-4">
                  {userSavings.map(s => {
                    const percent = Math.min(100, Math.round((s.amountSaved / s.totalAmount) * 100));
                    return (
                      <div key={s.id} className="p-4 rounded-xl bg-[#161622] border border-[#29293C] space-y-3 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white text-sm">{s.product.name}</span>
                          <span className="text-[#ECC260] font-bold">₦{s.amountSaved.toLocaleString()} / ₦{s.totalAmount.toLocaleString()} ({percent}%)</span>
                        </div>
                        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E6007A]" style={{ width: `${percent}%` }} />
                        </div>
                        <div className="flex justify-between text-zinc-400">
                          <span>Next Installment Due: {s.nextPaymentDate}</span>
                          <span className="capitalize">{s.frequency} (₦{s.depositPerCycle.toLocaleString()})</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: BNPL APPLICATIONS */}
          {activeTab === 'bnpl' && (
            <div className="rounded-2xl bg-[#111116] border border-[#252536] p-6 space-y-5">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <h3 className="font-serif-luxury text-lg font-bold text-white">
                  Buy Now Pay Later Applications ({userBnpl.length})
                </h3>
                <button
                  onClick={() => onNavigate('bnpl')}
                  className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-bold"
                >
                  BNPL Information
                </button>
              </div>

              {userBnpl.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-xs">
                  No BNPL requests submitted.
                </div>
              ) : (
                <div className="space-y-3">
                  {userBnpl.map(app => (
                    <div key={app.id} className="p-4 rounded-xl bg-[#161622] border border-[#29293C] space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-white font-bold">{app.referenceNumber}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300">
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-zinc-400">
                        Requested Amount: <strong className="text-[#ECC260]">₦{app.amount.toLocaleString()}</strong>
                      </div>
                      <p className="text-[11px] text-zinc-500 italic">
                        "{app.providerNote}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="rounded-2xl bg-[#111116] border border-[#252536] p-6 space-y-5">
              <h3 className="font-serif-luxury text-lg font-bold text-white border-b border-zinc-800 pb-3">
                Personal Information & Contact
              </h3>

              <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-300 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-300 block mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-300 block mb-1">Phone Number (Nigeria)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="rounded-2xl bg-[#111116] border border-[#252536] p-6 space-y-5">
              <h3 className="font-serif-luxury text-lg font-bold text-white border-b border-zinc-800 pb-3">
                Saved Nigerian Delivery Address
              </h3>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-300 block mb-1">State</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      {Object.keys(NIGERIAN_STATES).map(st => (
                        <option key={st} value={st}>{st} State</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-300 block mb-1">LGA</label>
                    <input
                      type="text"
                      value={lga}
                      onChange={(e) => setLga(e.target.value)}
                      className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-300 block mb-1">Street Address</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleUpdateProfile}
                  className="py-3 px-6 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase"
                >
                  Update Saved Address
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: CHANGE PASSWORD */}
          {activeTab === 'password' && (
            <div className="rounded-2xl bg-[#111116] border border-[#252536] p-6 space-y-5">
              <h3 className="font-serif-luxury text-lg font-bold text-white border-b border-zinc-800 pb-3">
                Change Account Password
              </h3>

              <form onSubmit={handleChangePassword} className="space-y-4 text-xs max-w-md">
                <div>
                  <label className="text-zinc-300 block mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 block mb-1">New Password (Min 6 Characters)</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
