import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Order, OrderStatus, PaymentStatus, ProductCategory } from '../types';
import { BRAND_CONSTANTS } from '../data/initialData';
import { NIGERIAN_STATES } from '../data/nigeriaLocations';
import { 
  ShieldCheck, 
  Package, 
  ShoppingBag, 
  Truck, 
  PiggyBank, 
  CreditCard, 
  Settings, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  Percent, 
  Building2, 
  Sparkles, 
  AlertTriangle,
  ExternalLink,
  Save,
  Search
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    orders, 
    updateOrderStatus, 
    updatePaymentStatus, 
    savingsPlans, 
    verifySavingsTransaction,
    bnplApplications,
    updateBNPLStatus,
    wholesaleSettings,
    updateWholesaleSettings,
    paymentSettings,
    updatePaymentSettings,
    currentUser,
    showToast 
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'orders' | 'savings' | 'bnpl' | 'wholesale' | 'payments' | 'business'
  >('overview');

  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    category: 'clothing',
    description: '',
    retailPrice: 50000,
    wholesalePrice: 42500,
    wholesaleMinQty: 10,
    stock: 20,
    sku: 'PK-CLO-NEW',
    images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'],
    sizes: ['UK 8', 'UK 10', 'UK 12', 'UK 14'],
    colors: ['Metallic Gold', 'Deep Magenta', 'Midnight Black'],
    details: ['Designer-led Nigerian clothing collection'],
    featured: true,
    isNewArrival: true
  });

  // Order Details Modal / Proof viewer
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);
  const [courierInput, setCourierInput] = useState('GIG Logistics');
  const [trackingCodeInput, setTrackingCodeInput] = useState('');

  // Wholesale settings form state
  const [wsMinUnits, setWsMinUnits] = useState(wholesaleSettings.minUnits);
  const [wsDiscount, setWsDiscount] = useState(wholesaleSettings.defaultDiscountPercent);

  // Payment settings form state
  const [bankName, setBankName] = useState(paymentSettings.bankName);
  const [accountName, setAccountName] = useState(paymentSettings.accountName);
  const [accountNumber, setAccountNumber] = useState(paymentSettings.accountNumber);
  const [bankInstructions, setBankInstructions] = useState(paymentSettings.bankInstructions);
  const [paystackPubKey, setPaystackPubKey] = useState(paymentSettings.paystackPublicKey);
  const [paystackLive, setPaystackLive] = useState(paymentSettings.paystackLiveMode);

  // Overview KPIs
  const totalRevenue = orders.reduce((sum, o) => o.paymentStatus === 'verified' ? sum + o.total : sum, 0);
  const pendingPayments = orders.filter(o => o.paymentStatus === 'awaiting_verification' || o.paymentStatus === 'pending').length;
  const pendingDeliveries = orders.filter(o => o.orderStatus === 'processing' || o.orderStatus === 'dispatched').length;
  const wholesaleOrders = orders.filter(o => o.items.some(i => i.isWholesale));
  const lowStockProducts = products.filter(p => p.stock < 15);

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      category: 'clothing',
      description: '',
      retailPrice: 50000,
      wholesalePrice: 42500,
      wholesaleMinQty: 10,
      stock: 20,
      sku: 'PK-' + Math.floor(100 + Math.random() * 900),
      images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'],
      sizes: ['UK 8', 'UK 10', 'UK 12', 'UK 14'],
      colors: ['Metallic Gold', 'Deep Magenta', 'Midnight Black'],
      details: ['P-Kess designer clothing and fashion collection'],
      featured: true,
      isNewArrival: true,
      rating: 5.0,
      reviewCount: 1
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductForm({ ...prod });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.retailPrice) return;

    if (editingProductId) {
      updateProduct(editingProductId, productForm);
    } else {
      addProduct({
        name: productForm.name || 'New Creation',
        slug: (productForm.name || 'item').toLowerCase().replace(/\s+/g, '-'),
        category: productForm.category as ProductCategory || 'clothing',
        description: productForm.description || '',
        retailPrice: Number(productForm.retailPrice),
        wholesalePrice: Number(productForm.wholesalePrice || Math.round(Number(productForm.retailPrice) * 0.85)),
        wholesaleMinQty: Number(productForm.wholesaleMinQty || 10),
        images: productForm.images || ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'],
        sizes: productForm.sizes || ['Standard'],
        colors: productForm.colors || ['Gold', 'Black'],
        stock: Number(productForm.stock || 10),
        sku: productForm.sku || 'PK-NEW',
        featured: Boolean(productForm.featured),
        isNewArrival: Boolean(productForm.isNewArrival),
        rating: 5.0,
        reviewCount: 0,
        details: productForm.details || ['P-Kess Original Edition']
      });
    }
    setIsProductModalOpen(false);
  };

  const handleSaveWholesaleSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateWholesaleSettings({
      minUnits: Number(wsMinUnits),
      defaultDiscountPercent: Number(wsDiscount)
    });
  };

  const handleSavePaymentSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentSettings({
      bankName,
      accountName,
      accountNumber,
      bankInstructions,
      paystackPublicKey: paystackPubKey,
      paystackLiveMode: paystackLive
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Admin Top Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#171410] via-[#1E1712] to-[#121217] border border-[#D4AF37]/50 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#D4AF37] flex items-center justify-center text-black font-black text-xl shadow-lg">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-brand-display text-xl sm:text-2xl font-bold text-white uppercase">
                P-Kess Executive Control Panel
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37] text-black uppercase">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Enterprise management for products, orders, Paystack, manual transfers, wholesale tiers, and Save to Buy.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('shop')}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Storefront
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#242432] scrollbar-none text-xs font-semibold">
        {[
          { id: 'overview', label: 'Executive KPIs', icon: ShieldCheck },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'orders', label: `Orders (${orders.length})`, icon: Truck, badge: pendingPayments > 0 ? `${pendingPayments} Pending` : undefined },
          { id: 'savings', label: `Save to Buy (${savingsPlans.length})`, icon: PiggyBank },
          { id: 'bnpl', label: `BNPL Credibly (${bnplApplications.length})`, icon: CreditCard },
          { id: 'wholesale', label: 'Wholesale Settings', icon: Percent },
          { id: 'payments', label: 'Payment Gateways & Bank', icon: Building2 },
          { id: 'business', label: 'Showroom & Delivery', icon: Settings }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2.5 rounded-xl whitespace-nowrap flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                  : 'bg-[#121217] text-zinc-400 hover:text-white border border-[#242432]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
              {t.badge && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#E6007A] text-white text-[9px] font-bold">
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE KPIS OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Main KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#13131A] border border-[#252536] space-y-2">
              <span className="text-[11px] text-zinc-400 uppercase font-bold tracking-wider">Total Revenue</span>
              <div className="text-2xl font-black text-[#ECC260]">₦{totalRevenue.toLocaleString()}</div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                Payment settings
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#13131A] border border-[#252536] space-y-2">
              <span className="text-[11px] text-zinc-400 uppercase font-bold tracking-wider">Total Orders</span>
              <div className="text-2xl font-black text-white">{orders.length}</div>
              <span className="text-[11px] text-[#FF66B2]">
                {wholesaleOrders.length} Wholesale bulk orders
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#13131A] border border-[#252536] space-y-2">
              <span className="text-[11px] text-zinc-400 uppercase font-bold tracking-wider">Pending Bank Approvals</span>
              <div className="text-2xl font-black text-amber-400">{pendingPayments}</div>
              <span className="text-[11px] text-zinc-400">
                Awaiting transfer receipt verification
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#13131A] border border-[#252536] space-y-2">
              <span className="text-[11px] text-zinc-400 uppercase font-bold tracking-wider">Active Save to Buy Plans</span>
              <div className="text-2xl font-black text-[#FF66B2]">{savingsPlans.length}</div>
              <span className="text-[11px] text-zinc-400">
                Cumulative installments running
              </span>
            </div>
          </div>

          {/* Quick Action Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Payments Alert */}
            <div className="rounded-2xl bg-[#14141D] border border-[#2A2A3E] p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Orders Requiring Payment Verification</span>
                </div>
                <button onClick={() => setActiveTab('orders')} className="text-xs text-[#ECC260] hover:underline">
                  View All Orders
                </button>
              </div>

              {orders.filter(o => o.paymentStatus === 'awaiting_verification').length === 0 ? (
                <p className="text-xs text-zinc-500 py-3">All bank transfer payments are verified!</p>
              ) : (
                <div className="space-y-3">
                  {orders.filter(o => o.paymentStatus === 'awaiting_verification').map(o => (
                    <div key={o.id} className="p-3.5 rounded-xl bg-black/40 border border-zinc-800 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-white font-mono">{o.orderNumber}</strong> — {o.customerName}
                        <span className="block text-zinc-400 text-[11px]">
                          Amount: ₦{o.total.toLocaleString()} • Ref: {o.bankTransferRef || 'N/A'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setInspectingOrder(o);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black font-bold text-xs"
                      >
                        Inspect Proof
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Low Stock Alerts */}
            <div className="rounded-2xl bg-[#14141D] border border-[#2A2A3E] p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2 text-[#ECC260] text-sm font-bold">
                  <Package className="w-4 h-4 text-[#D4AF37]" />
                  <span>Inventory Status (Asaba Showroom)</span>
                </div>
                <button onClick={() => setActiveTab('products')} className="text-xs text-[#ECC260] hover:underline">
                  Manage Stock
                </button>
              </div>

              <div className="space-y-2.5">
                {products.slice(0, 3).map(p => (
                  <div key={p.id} className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-black/40 border border-zinc-800/80">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt="" className="w-10 h-12 object-cover rounded-lg" />
                      <div>
                        <span className="text-white font-semibold line-clamp-1">{p.name}</span>
                        <span className="text-zinc-500 text-[10px]">SKU: {p.sku}</span>
                      </div>
                    </div>
                    <span className="text-[#ECC260] font-bold">{p.stock} in stock</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT INVENTORY MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#242432] pb-4">
            <div>
              <h2 className="font-serif-luxury text-xl font-bold text-white">Catalogue & Pricing Management</h2>
              <p className="text-xs text-zinc-400">Add, edit, modify stock, set retail and wholesale prices.</p>
            </div>
            <button
              onClick={handleOpenAddProduct}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B88B22] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add New Product
            </button>
          </div>

          <div className="rounded-2xl bg-[#111116] border border-[#252536] overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-[#171722] text-zinc-400 uppercase tracking-wider border-b border-zinc-800 text-[10px]">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Retail Price</th>
                  <th className="p-4">Wholesale Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {products.map(prod => (
                  <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={prod.images[0]} alt="" className="w-12 h-14 object-cover rounded-lg shrink-0 border border-zinc-800" />
                      <div>
                        <div className="font-bold text-white line-clamp-1">{prod.name}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{prod.sku}</div>
                      </div>
                    </td>
                    <td className="p-4 uppercase text-[#D4AF37] font-semibold text-[10px]">
                      {prod.category}
                    </td>
                    <td className="p-4 font-bold text-white">
                      ₦{prod.retailPrice.toLocaleString()}
                    </td>
                    <td className="p-4 font-bold text-[#ECC260]">
                      ₦{prod.wholesalePrice.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        prod.stock > 10 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {prod.stock} Units
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditProduct(prod)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                        title="Edit Product"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="border-b border-[#242432] pb-4">
            <h2 className="font-serif-luxury text-xl font-bold text-white">Orders & Payment Verification</h2>
            <p className="text-xs text-zinc-400">Inspect customer transfer receipts, approve payments, and update courier dispatch tracking.</p>
          </div>

          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="p-5 rounded-2xl bg-[#12121A] border border-[#262638] space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div>
                    <span className="font-mono text-sm font-black text-white">{order.orderNumber}</span>
                    <span className="text-zinc-400 ml-3">{order.customerName} ({order.customerPhone})</span>
                    <span className="text-zinc-500 text-[10px] block mt-0.5">Placed: {order.createdAt}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Payment status badge */}
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      order.paymentStatus === 'verified' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      Payment: {order.paymentStatus}
                    </span>

                    {/* Order status badge */}
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#D4AF37]/20 text-[#ECC260] border border-[#D4AF37]/30">
                      Order: {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Items & Shipping Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-zinc-300">
                  <div className="space-y-1">
                    <span className="text-zinc-500 text-[10px] uppercase font-bold block">Items:</span>
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{it.quantity}x {it.product.name} ({it.selectedSize})</span>
                        <span className="text-[#ECC260] font-bold">₦{(it.unitPrice * it.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="pt-1 text-right text-white font-bold">
                      Total: ₦{order.total.toLocaleString()}
                    </div>
                  </div>

                  <div className="space-y-1 bg-black/40 p-3 rounded-xl border border-zinc-800">
                    <span className="text-zinc-500 text-[10px] uppercase font-bold block">Delivery Details:</span>
                    <div className="text-white font-medium">{order.deliveryMethod === 'pickup' ? 'Store Pickup (Asaba Showroom)' : order.address}</div>
                    <div className="text-zinc-400 text-[11px]">{order.state} State • {order.lga}</div>
                    <div className="text-zinc-400 text-[11px]">Courier: {order.courier || 'Pending'} • Tracking: {order.trackingNumber || 'Pending'}</div>
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800">
                  <div className="flex items-center gap-2">
                    {order.paymentStatus !== 'verified' && (
                      <button
                        onClick={() => updatePaymentStatus(order.id, 'verified')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center gap-1 border border-emerald-500/40"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve Payment
                      </button>
                    )}

                    {order.proofOfPaymentUrl && (
                      <button
                        onClick={() => setInspectingOrder(order)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Inspect Receipt
                      </button>
                    )}
                  </div>

                  {/* Status changer */}
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 text-[11px]">Update Status:</span>
                    {(['processing', 'dispatched', 'delivered'] as OrderStatus[]).map(st => (
                      <button
                        key={st}
                        onClick={() => updateOrderStatus(order.id, st, order.trackingNumber || 'GIG-PK-' + Math.floor(10000 + Math.random() * 90000), 'GIG Logistics')}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                          order.orderStatus === st
                            ? 'bg-[#D4AF37] text-black'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SAVE TO BUY MANAGEMENT */}
      {activeTab === 'savings' && (
        <div className="space-y-6">
          <div className="border-b border-[#242432] pb-4">
            <h2 className="font-serif-luxury text-xl font-bold text-white">Save to Buy Accounts & Deposits</h2>
            <p className="text-xs text-zinc-400">Verify customer savings installments and approve final order delivery.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savingsPlans.map(plan => {
              const percent = Math.min(100, Math.round((plan.amountSaved / plan.totalAmount) * 100));
              return (
                <div key={plan.id} className="p-5 rounded-2xl bg-[#12121A] border border-[#262638] space-y-4 text-xs">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                    <div>
                      <span className="text-white font-bold">{plan.customerName}</span>
                      <span className="text-zinc-500 block text-[11px]">{plan.customerPhone} • {plan.customerEmail}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      plan.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#D4AF37]/20 text-[#ECC260]'
                    }`}>
                      {plan.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img src={plan.product.images[0]} alt="" className="w-14 h-16 object-cover rounded-lg" />
                    <div>
                      <h4 className="text-white font-bold">{plan.product.name}</h4>
                      <span className="text-[#ECC260] font-bold block">
                        Saved: ₦{plan.amountSaved.toLocaleString()} of ₦{plan.totalAmount.toLocaleString()} ({percent}%)
                      </span>
                    </div>
                  </div>

                  {/* Pending Transactions that need verification */}
                  <div className="space-y-2 pt-2 border-t border-zinc-800">
                    <span className="text-zinc-400 font-semibold block text-[11px]">Installment Ledger:</span>
                    {plan.transactions.map(t => (
                      <div key={t.id} className="p-2.5 rounded-lg bg-black/40 border border-zinc-800 flex items-center justify-between">
                        <div>
                          <span className="text-white font-bold">₦{t.amount.toLocaleString()}</span>
                          <span className="text-zinc-500 text-[10px] ml-2">{t.date} ({t.paymentMethod})</span>
                        </div>

                        {t.status === 'pending' ? (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => verifySavingsTransaction(plan.id, t.id, true)}
                              className="px-2 py-1 rounded bg-emerald-500 text-black font-bold text-[10px]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => verifySavingsTransaction(plan.id, t.id, false)}
                              className="px-2 py-1 rounded bg-red-500 text-white font-bold text-[10px]"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-emerald-400 font-bold uppercase text-[10px]">{t.status}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: BNPL (CREDIBLY) MANAGEMENT */}
      {activeTab === 'bnpl' && (
        <div className="space-y-6">
          <div className="border-b border-[#242432] pb-4">
            <h2 className="font-serif-luxury text-xl font-bold text-white">BNPL Applications (Credibly Underwriting)</h2>
            <p className="text-xs text-zinc-400">Manage client financing assessments and update facility statuses.</p>
          </div>

          <div className="space-y-4">
            {bnplApplications.map(app => (
              <div key={app.id} className="p-5 rounded-2xl bg-[#12121A] border border-[#262638] space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-mono font-bold text-white text-sm">{app.referenceNumber}</span>
                    <span className="text-zinc-400 ml-3">{app.customerName} ({app.customerPhone})</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300">
                    {app.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-black/40 p-3 rounded-xl border border-zinc-800 text-zinc-300">
                  <div>Requested: <strong className="text-[#ECC260]">₦{app.amount.toLocaleString()}</strong></div>
                  <div>Monthly Income: ₦{app.monthlyIncome.toLocaleString()}</div>
                  <div>BVN Check: •••• {app.bvnLast4}</div>
                </div>

                <p className="text-zinc-400 italic">
                  Note: "{app.providerNote}"
                </p>

                <div className="flex gap-2 pt-2 border-t border-zinc-800">
                  <button
                    onClick={() => updateBNPLStatus(app.id, 'awaiting_provider_terms', 'Credibly merchant onboarding terms pending review.')}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700"
                  >
                    Mark Awaiting Terms
                  </button>
                  <button
                    onClick={() => updateBNPLStatus(app.id, 'under_review', 'Underwriter assessing bank verification.')}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700"
                  >
                    Mark In Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: WHOLESALE CONFIGURATION */}
      {activeTab === 'wholesale' && (
        <div className="rounded-3xl bg-[#121218] border border-[#2A2A3C] p-6 sm:p-8 space-y-6 max-w-2xl">
          <div className="border-b border-zinc-800 pb-3">
            <h2 className="font-serif-luxury text-xl font-bold text-white">Wholesale Pricing Rules</h2>
            <p className="text-xs text-zinc-400">Configure minimum unit thresholds and automated discount percentages.</p>
          </div>

          <form onSubmit={handleSaveWholesaleSettings} className="space-y-5 text-xs">
            <div>
              <label className="text-zinc-300 block mb-1 font-semibold">Minimum Wholesale Quantity (Default: 10 units)</label>
              <input
                type="number"
                min="5"
                max="100"
                value={wsMinUnits}
                onChange={(e) => setWsMinUnits(Number(e.target.value))}
                className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-3 text-white text-sm font-bold focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-zinc-300 block mb-1 font-semibold">Default Wholesale Discount (%): (Range 10% - 15%)</label>
              <input
                type="number"
                min="10"
                max="25"
                value={wsDiscount}
                onChange={(e) => setWsDiscount(Number(e.target.value))}
                className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-3 text-white text-sm font-bold focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 text-zinc-400 space-y-1">
              <span className="text-[#ECC260] font-bold block">Example Calculation:</span>
              <p>For an item priced at ₦20,000 retail with {wsDiscount}% discount:</p>
              <p className="text-white font-medium">Wholesale unit price = ₦{(20000 * (1 - wsDiscount / 100)).toLocaleString()}</p>
              <p className="text-emerald-400 font-medium">At {wsMinUnits} units, client saves ₦{(20000 * wsMinUnits * (wsDiscount / 100)).toLocaleString()}</p>
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase"
            >
              Save Wholesale Settings
            </button>
          </form>
        </div>
      )}

      {/* TAB 7: PAYMENT SETTINGS (PAYSTACK & BANK) */}
      {activeTab === 'payments' && (
        <div className="rounded-3xl bg-[#121218] border border-[#2A2A3C] p-6 sm:p-8 space-y-6 max-w-2xl">
          <div className="border-b border-zinc-800 pb-3">
            <h2 className="font-serif-luxury text-xl font-bold text-white">Payment Gateway & Bank Account</h2>
            <p className="text-xs text-zinc-400">Configure Paystack API keys and business bank account details displayed to customers.</p>
          </div>

          <form onSubmit={handleSavePaymentSettings} className="space-y-4 text-xs">
            <div className="space-y-3 pb-4 border-b border-zinc-800">
              <span className="text-[#ECC260] uppercase tracking-wider font-bold block">Business Bank Transfer Details</span>
              <div>
                <label className="text-zinc-300 block mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 block mb-1">Account Name</label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 block mb-1">Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-2.5 text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-300 block mb-1">Payment Instructions</label>
                <textarea
                  rows={3}
                  value={bankInstructions}
                  onChange={(e) => setBankInstructions(e.target.value)}
                  className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-[#0BA4DB] uppercase tracking-wider font-bold block">Paystack Credentials</span>
              <div>
                <label className="text-zinc-300 block mb-1">Public Key (Client Safe)</label>
                <input
                  type="text"
                  value={paystackPubKey}
                  onChange={(e) => setPaystackPubKey(e.target.value)}
                  className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="livemode"
                  checked={paystackLive}
                  onChange={(e) => setPaystackLive(e.target.checked)}
                  className="accent-[#D4AF37]"
                />
                <label htmlFor="livemode" className="text-zinc-300 cursor-pointer">
                  Enable Live Production Mode (Defaults to Test Mode)
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase"
            >
              Update Payment Settings
            </button>
          </form>
        </div>
      )}

      {/* TAB 8: BUSINESS INFORMATION & SHOWROOM */}
      {activeTab === 'business' && (
        <div className="rounded-3xl bg-[#121218] border border-[#2A2A3C] p-6 sm:p-8 space-y-6 max-w-2xl text-xs">
          <div className="border-b border-zinc-800 pb-3">
            <h2 className="font-serif-luxury text-xl font-bold text-white">Brand Information & Showroom</h2>
            <p className="text-zinc-400">Physical address, email and contact numbers for P-Kess Fashion World.</p>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-black/40 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">Business Address</span>
              <span className="text-white font-semibold">{BRAND_CONSTANTS.address}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">Official Email</span>
              <span className="text-white font-semibold">{BRAND_CONSTANTS.email}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">Official Phone Numbers</span>
              <span className="text-white font-semibold">{BRAND_CONSTANTS.phoneFormatted}</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={() => setIsProductModalOpen(false)} />
          <div className="relative bg-[#111118] border border-[#2D2D42] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 text-zinc-300 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-serif-luxury text-lg font-bold text-white">
                {editingProductId ? 'Edit Product Details' : 'Add New Fashion Creation'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-300 block mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 block mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                    className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-2.5 text-white"
                  >
                    <option value="clothing">Clothing & Native Wear</option>
                    <option value="t-shirts">T-Shirts</option>
                    <option value="shoes">Shoes & Sandals</option>
                    <option value="bags">Bags</option>
                    <option value="accessories">Fashion Accessories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-zinc-300 block mb-1">Retail Price (₦)</label>
                  <input
                    type="number"
                    required
                    value={productForm.retailPrice}
                    onChange={(e) => setProductForm({ ...productForm, retailPrice: Number(e.target.value) })}
                    className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-2.5 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 block mb-1">Wholesale Price (₦)</label>
                  <input
                    type="number"
                    value={productForm.wholesalePrice}
                    onChange={(e) => setProductForm({ ...productForm, wholesalePrice: Number(e.target.value) })}
                    className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-2.5 text-white font-bold text-[#ECC260]"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-300 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-300 block mb-1">Primary Image URL</label>
                <input
                  type="text"
                  value={productForm.images?.[0] || ''}
                  onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                  className="w-full bg-[#181824] border border-[#2E2E42] rounded-xl p-2.5 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B88B22] text-black font-bold text-xs uppercase"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INSPECT PAYMENT RECEIPT */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={() => setInspectingOrder(null)} />
          <div className="relative bg-[#111118] border border-[#2D2D42] rounded-3xl max-w-lg w-full p-6 shadow-2xl z-10 text-zinc-300 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-serif-luxury text-base font-bold text-white">
                Payment Evidence — {inspectingOrder.orderNumber}
              </h3>
              <button onClick={() => setInspectingOrder(null)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <div>Customer: <strong className="text-white">{inspectingOrder.customerName}</strong></div>
              <div>Amount to Verify: <strong className="text-[#ECC260] text-sm">₦{inspectingOrder.total.toLocaleString()}</strong></div>
              <div>Bank Transfer Ref: <strong className="font-mono text-white">{inspectingOrder.bankTransferRef || 'Not Provided'}</strong></div>
            </div>

            <div className="rounded-xl overflow-hidden border border-zinc-800 max-h-72 bg-black">
              {inspectingOrder.proofOfPaymentUrl ? (
                <img src={inspectingOrder.proofOfPaymentUrl} alt="Receipt proof" className="w-full h-full object-contain" />
              ) : (
                <div className="p-12 text-center text-zinc-500">No screenshot uploaded</div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  updatePaymentStatus(inspectingOrder.id, 'verified');
                  setInspectingOrder(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs"
              >
                Approve & Mark Verified
              </button>
              <button
                onClick={() => {
                  updatePaymentStatus(inspectingOrder.id, 'failed');
                  setInspectingOrder(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-red-500/20 text-red-400 font-bold text-xs"
              >
                Reject Evidence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
