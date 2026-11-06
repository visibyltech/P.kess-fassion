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
  Search,
  Menu,
  Home,
  Tags,
  LayoutDashboard,
  LoaderCircle
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
    isAdmin,
    setIsAuthModalOpen,
    showToast 
  } = useStore();

  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'categories' | 'products' | 'orders' | 'savings' | 'bnpl' | 'wholesale' | 'payments' | 'business'
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
    images: [],
    sizes: ['UK 8', 'UK 10', 'UK 12', 'UK 14'],
    colors: ['Metallic Gold', 'Deep Magenta', 'Midnight Black'],
    details: ['Designer-led Nigerian clothing collection'],
    featured: true,
    isNewArrival: true
  });

  const [isUploadingProductImages, setIsUploadingProductImages] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [productImageUploadError, setProductImageUploadError] = useState('');

  // Cloudinary unsigned browser uploads. These values are public configuration,
  // not API secrets. Never place the Cloudinary API secret in frontend code.
  const CLOUDINARY_CLOUD_NAME = 'jmit9wsv';
  const CLOUDINARY_UPLOAD_PRESET = 'pkess-products';

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
  const productsInStock = products.filter(product => Number(product.stock) > 0).length;
  const totalAvailableUnits = products.reduce((sum, product) => sum + Math.max(0, Number(product.stock) || 0), 0);
  const categorySummaries = [
    { id: 'clothing', label: 'Clothing & Native Wear' },
    { id: 't-shirts', label: 'T-Shirts' },
    { id: 'shoes', label: 'Shoes & Sandals' },
    { id: 'bags', label: 'Bags & Handbags' },
    { id: 'accessories', label: 'Fashion Accessories' }
  ].map(category => ({ ...category, count: products.filter(product => product.category === category.id).length }));

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
      images: [],
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

  const handleProductImageUpload = async (files: FileList | null) => {
    if (!files?.length) return;

    const selectedFiles = Array.from(files);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    const invalidFile = selectedFiles.find(file => !allowedTypes.includes(file.type) || file.size > 10 * 1024 * 1024);

    if (invalidFile) {
      setProductImageUploadError(
        !allowedTypes.includes(invalidFile.type)
          ? 'Please select JPG, PNG, WebP or AVIF images.'
          : 'Each image must be 10 MB or smaller.'
      );
      return;
    }

    setIsUploadingProductImages(true);
    setProductImageUploadError('');
    const uploadedUrls: string[] = [];

    try {
      for (const file of selectedFiles) {
        const body = new FormData();
        body.append('file', file);
        body.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        body.append('asset_folder', 'pkess-products');

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body }
        );
        const result = await response.json();

        if (!response.ok || !result.secure_url) {
          const providerMessage = String(result.error?.message || '');
          console.error('Product image upload configuration error:', providerMessage);
          if (/upload preset.*not found|preset.*not found/i.test(providerMessage)) {
            throw new Error('Image upload is not configured correctly yet. Please check the store image-upload settings.');
          }
          throw new Error('We could not upload this photo. Please try again with a JPG, PNG, WebP or AVIF image.');
        }
        uploadedUrls.push(result.secure_url);
      }

      setProductForm(current => ({
        ...current,
        images: [...(current.images || []).filter(Boolean), ...uploadedUrls]
      }));
    } catch (error) {
      setProductImageUploadError(
        error instanceof Error ? error.message : 'Image upload failed. Please try again.'
      );
    } finally {
      setIsUploadingProductImages(false);
    }
  };

  const setMainProductImage = (imageUrl: string) => {
    setProductForm(current => {
      const images = current.images || [];
      return { ...current, images: [imageUrl, ...images.filter(image => image !== imageUrl)] };
    });
  };

  const removeProductImage = (imageUrl: string) => {
    setProductForm(current => ({
      ...current,
      images: (current.images || []).filter(image => image !== imageUrl)
    }));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.retailPrice || !(productForm.images || []).length) {
      showToast('Add at least one product photo before saving.', 'warning');
      return;
    }

    setIsSavingProduct(true);
    try {
      if (editingProductId) {
        await updateProduct(editingProductId, productForm);
      } else {
        await addProduct({
          name: productForm.name || 'New Creation',
          slug: (productForm.name || 'item').toLowerCase().replace(/\s+/g, '-'),
          category: productForm.category as ProductCategory || 'clothing',
          description: productForm.description || '',
          retailPrice: Number(productForm.retailPrice),
          wholesalePrice: Number(productForm.wholesalePrice || Math.round(Number(productForm.retailPrice) * 0.85)),
          wholesaleMinQty: Number(productForm.wholesaleMinQty || 10),
          images: productForm.images || [],
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
      showToast(editingProductId ? 'Product updated successfully.' : 'Product saved successfully.', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not save product. Please try again.', 'error');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleSaveWholesaleSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateWholesaleSettings({
      minUnits: Number(wsMinUnits),
      defaultDiscountPercent: Number(wsDiscount)
    });
  };

  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePaymentSettings({
      bankName,
      accountName,
      accountNumber,
      bankInstructions,
      paystackPublicKey: paystackPubKey,
      paystackLiveMode: paystackLive
    });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#09090F] px-5">
        <div className="max-w-md w-full rounded-2xl border border-[#2A2A3C] bg-[#121218] p-7 text-center space-y-4">
          <ShieldCheck className="w-10 h-10 text-[#D4AF37] mx-auto" />
          <h1 className="text-xl font-bold text-white">Administrator Sign-In Required</h1>
          <p className="text-sm text-zinc-400">Sign in with the authorised P-Kess administrator account to access store management.</p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
          >
            Sign In as Administrator
          </button>
        </div>
      </div>
    );
  }

  const adminNavItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package, count: products.length },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'orders', label: 'Orders', icon: Truck, count: orders.length },
    { id: 'savings', label: 'Save to Buy', icon: PiggyBank },
    { id: 'bnpl', label: 'BNPL Applications', icon: CreditCard },
    { id: 'wholesale', label: 'Wholesale', icon: Percent },
    { id: 'payments', label: 'Payments & Bank', icon: Building2 },
    { id: 'business', label: 'Showroom & Delivery', icon: Settings }
  ];

  return (
    <div className="admin-dashboard-root min-h-screen bg-[#F4F5F7] text-[#25252B]">
      {/* Desktop management navigation */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-[248px] flex-col border-r border-[#E6E8EC] bg-white shadow-sm">
        <div className="border-b border-[#ECEEF1] px-6 py-6">
          <div className="text-lg font-black tracking-[0.12em] text-[#24242A]">P-KESS</div>
          <div className="mt-1 text-[10px] font-bold tracking-[0.22em] text-[#9A7B89]">FASHION WORLD</div>
          <div className="mt-4 rounded-lg bg-[#FFF7E5] px-3 py-2 text-xs font-semibold text-[#88610B]">Store administration</div>
        </div>
        <div className="px-5 pb-2 pt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9298A2]">Workspace</div>
        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {adminNavItems.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={"mb-1 flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 text-left text-[13px] transition-colors " + (active ? "bg-[#FFF4D6] font-semibold text-[#815C0A] border-l-[3px] border-[#D4A62C]" : "text-[#515761] hover:bg-[#F4F5F7]")}>
              <Icon className="h-[17px] w-[17px] shrink-0" /><span className="flex-1">{item.label}</span>{item.count !== undefined && <span className={"rounded-full px-2 py-0.5 text-[10px] " + (active ? "bg-[#F3E2B4] text-[#815C0A]" : "bg-[#F0F1F3] text-[#777E89]")}>{item.count}</span>}
            </button>;
          })}
          <div className="my-4 border-t border-[#ECEEF1]" />
          <button onClick={handleOpenAddProduct} className="flex min-h-[44px] w-full items-center gap-3 rounded-lg bg-[#D4A62C] px-3 text-left text-[13px] font-bold text-[#241D0C] hover:bg-[#C69619]"><Plus className="h-4 w-4" /> Add new product</button>
          <button onClick={() => onNavigate('shop')} className="mt-2 flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 text-left text-[13px] text-[#515761] hover:bg-[#F4F5F7]"><ExternalLink className="h-4 w-4" /> View storefront</button>
        </nav>
        <div className="border-t border-[#ECEEF1] px-4 py-4">
          <p className="truncate text-xs font-semibold text-[#353A43]">{currentUser?.name || 'Administrator'}</p>
          <p className="mt-1 truncate text-[10px] text-[#858B95]">{currentUser?.email}</p>
        </div>
      </aside>

      {/* Mobile admin navigation drawer */}
      {adminMenuOpen && (
        <div className="fixed inset-0 z-[120] lg:hidden">
          <button aria-label="Close admin menu" onClick={() => setAdminMenuOpen(false)} className="absolute inset-0 bg-black/60" />
          <aside className="absolute inset-y-0 left-0 flex w-[min(84vw,300px)] flex-col border-r border-[#E6E8EC] bg-white text-[#25252B] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#ECEEF1] px-5 py-5">
              <div><p className="text-sm font-black tracking-[0.14em]">P-KESS ADMIN</p><p className="mt-1 text-[10px] text-[#858B95]">Store management</p></div>
              <button onClick={() => setAdminMenuOpen(false)} aria-label="Close menu" className="rounded-lg p-2 text-[#59606A] hover:bg-[#F2F3F5]"><X className="h-5 w-5" /></button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4">
              {adminNavItems.map(item => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return <button key={item.id} onClick={() => { setActiveTab(item.id as any); setAdminMenuOpen(false); }} className={"mb-1 flex min-h-[46px] w-full items-center gap-3 rounded-lg px-3 text-left text-sm " + (active ? "bg-[#FFF4D6] font-semibold text-[#815C0A]" : "text-[#424852] hover:bg-[#F4F5F7]")}>
                  <Icon className="h-4 w-4" /><span className="flex-1">{item.label}</span>{item.count !== undefined && <span className="text-xs text-[#858B95]">{item.count}</span>}
                </button>;
              })}
              <div className="my-3 border-t border-[#ECEEF1]" />
              <button onClick={() => { setAdminMenuOpen(false); handleOpenAddProduct(); }} className="flex min-h-[46px] w-full items-center gap-3 rounded-lg bg-[#FFF4D6] px-3 text-left text-sm font-semibold text-[#815C0A]"><Plus className="h-4 w-4" /> Add product</button>
              <button onClick={() => { setAdminMenuOpen(false); onNavigate('shop'); }} className="mt-1 flex min-h-[46px] w-full items-center gap-3 rounded-lg px-3 text-left text-sm text-[#424852] hover:bg-[#F4F5F7]"><Home className="h-4 w-4" /> Storefront</button>
            </nav>
          </aside>
        </div>
      )}

      <div className="lg:ml-[248px]">
        {/* Compact responsive admin header */}
        <header className="sticky top-0 z-30 flex min-h-[68px] items-center justify-between gap-3 border-b border-[#E6E8EC] bg-white/95 px-4 py-3 shadow-sm backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={() => setAdminMenuOpen(true)} aria-label="Open admin navigation" className="rounded-lg border border-[#E2E5E9] p-2 text-[#414852] hover:bg-[#F4F5F7] lg:hidden"><Menu className="h-5 w-5" /></button>
            <div className="min-w-0">
              <h1 className="truncate text-[15px] font-bold text-[#252A32] sm:text-lg">{activeTab === 'overview' ? 'Dashboard overview' : adminNavItems.find(item => item.id === activeTab)?.label || 'Store management'}</h1>
              <p className="hidden text-[11px] text-[#858B95] sm:block">P-Kess Fashion World <span className="mx-1">/</span> Administration</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden rounded-full bg-[#FFF4D6] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#815C0A] sm:inline-flex">Administrator</span>
            <button onClick={() => onNavigate('shop')} className="inline-flex min-h-[38px] items-center gap-2 rounded-lg border border-[#E2E5E9] px-3 text-xs font-semibold text-[#424852] hover:bg-[#F4F5F7]"><ExternalLink className="h-3.5 w-3.5" /><span className="hidden sm:inline">View store</span><span className="sm:hidden">Store</span></button>
          </div>
        </header>
        <main className="mx-auto max-w-[1440px] space-y-5 px-3 py-5 sm:px-5 lg:px-7">
      {/* TAB 1: EXECUTIVE KPIS OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Main KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-3 sm:gap-4">
            <div className="min-h-[112px] rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm sm:p-4 space-y-2">
              <span className="text-[10px] sm:text-[11px] text-[#777E89] uppercase font-semibold tracking-wide">Total Revenue</span>
              <div className="text-xl sm:text-2xl font-bold text-[#936A0A]">₦{totalRevenue.toLocaleString()}</div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                Payment settings
              </span>
            </div>

            <div className="min-h-[112px] rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm sm:p-4 space-y-2">
              <span className="text-[10px] sm:text-[11px] text-[#777E89] uppercase font-semibold tracking-wide">Total Orders</span>
              <div className="text-xl sm:text-2xl font-bold text-[#252A32]">{orders.length}</div>
              <span className="text-[11px] text-[#B33B73]">{wholesaleOrders.length} wholesale orders</span>
            </div>
            <div className="min-h-[112px] rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm sm:p-4 space-y-2">
              <span className="text-[10px] sm:text-[11px] text-[#777E89] uppercase font-semibold tracking-wide">Total Products</span>
              <div className="text-xl sm:text-2xl font-bold text-[#252A32]">{products.length}</div>
              <span className="text-[11px] text-[#737B86]">Products uploaded</span>
            </div>
            <div className="min-h-[112px] rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm sm:p-4 space-y-2">
              <span className="text-[10px] sm:text-[11px] text-[#777E89] uppercase font-semibold tracking-wide">Products In Stock</span>
              <div className="text-xl sm:text-2xl font-bold text-emerald-700">{productsInStock}</div>
              <span className="text-[11px] text-[#737B86]">{totalAvailableUnits.toLocaleString()} available units</span>
            </div>

            <div className="min-h-[112px] rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm sm:p-4 space-y-2">
              <span className="text-[10px] sm:text-[11px] text-[#777E89] uppercase font-semibold tracking-wide">Pending Bank Approvals</span>
              <div className="text-xl sm:text-2xl font-bold text-[#B7791F]">{pendingPayments}</div>
              <span className="text-[11px] text-[#737B86]">Awaiting verification</span>
            </div>

            <div className="min-h-[112px] rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm sm:p-4 space-y-2">
              <span className="text-[10px] sm:text-[11px] text-[#777E89] uppercase font-semibold tracking-wide">Active Save to Buy Plans</span>
              <div className="text-xl sm:text-2xl font-bold text-[#B33B73]">{savingsPlans.length}</div>
              <span className="text-[11px] text-[#737B86]">Running plans</span>
            </div>
          </div>

          <section className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-[#252A32]">Products by category</h3>
                <p className="mt-1 text-xs text-[#737B86]">Live count of uploaded products in each category</p>
              </div>
              <button onClick={() => setActiveTab('categories')} className="shrink-0 text-xs font-semibold text-[#946B12] hover:underline">Manage categories</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {categorySummaries.map(category => (
                <button key={category.id} onClick={() => setActiveTab('products')} className="rounded-lg border border-[#E8E9ED] bg-[#F8F9FB] p-3 text-left transition-colors hover:border-[#D4A62C] hover:bg-[#FFF9EA]">
                  <span className="block text-[11px] font-medium leading-snug text-[#626A75]">{category.label}</span>
                  <span className="mt-2 block text-xl font-bold tabular-nums text-[#252A32]">{category.count}</span>
                  <span className="text-[10px] text-[#858B95]">{category.count === 1 ? 'product' : 'products'}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Quick Action Alerts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Pending Payments Alert */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2 text-[#946B12] text-sm font-semibold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Orders Requiring Payment Verification</span>
                </div>
                <button onClick={() => setActiveTab('orders')} className="text-xs text-[#946B12] hover:underline">
                  View All Orders
                </button>
              </div>

              {orders.filter(o => o.paymentStatus === 'awaiting_verification').length === 0 ? (
                <p className="text-xs text-[#737B86] py-3">All bank transfer payments are verified!</p>
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
                        <span className="text-[#252A32] font-semibold line-clamp-1">{p.name}</span>
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


      {activeTab === 'categories' && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#242432] pb-4">
            <div><h2 className="text-lg font-bold text-white">Product Categories</h2><p className="mt-1 text-xs text-zinc-400">Manage the categories used to organise the storefront catalogue.</p></div>
            <button onClick={handleOpenAddProduct} className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-xs font-bold text-black"><Plus className="h-4 w-4" /> Add Product</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            {[
              { id: 'clothing', label: 'Clothing & Native Wear' },
              { id: 't-shirts', label: 'T-Shirts' },
              { id: 'shoes', label: 'Shoes & Sandals' },
              { id: 'bags', label: 'Bags & Handbags' },
              { id: 'accessories', label: 'Fashion Accessories' }
            ].map(category => {
              const count = products.filter(product => product.category === category.id).length;
              return <div key={category.id} className="rounded-xl border border-[#302B38] bg-[#15151D] p-3 sm:p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#D4AF37]/15 text-[#ECC260]"><Tags className="h-4 w-4" /></div>
                <h3 className="text-sm font-semibold text-white">{category.label}</h3>
                <p className="mt-1 text-xs text-zinc-400">{count} products</p>
                <button onClick={() => setActiveTab('products')} className="mt-3 text-xs font-semibold text-[#ECC260] hover:underline">View products</button>
              </div>;
            })}
          </div>
          <p className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-xs text-amber-200">The storefront currently supports these five category types. Adding a brand-new category requires updating the shared catalogue category model so it appears consistently in product uploads and storefront filters.</p>
        </section>
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

          <div className="rounded-xl bg-white border border-[#E5E7EB] overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-[#F5F6F8] text-[#69717D] uppercase tracking-wider border-b border-[#E5E7EB] text-[10px]">
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
                  <tr key={prod.id} className="hover:bg-[#F7F8FA] transition-colors">
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

        </main>
      </div>

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

              <div className="space-y-3 rounded-2xl border border-[#3B3540] bg-[#17151D] p-4">
                <div>
                  <label className="text-white block mb-1 font-semibold">Product Photos</label>
                  <p className="text-zinc-400 text-[11px]">Upload multiple product photos from your phone. JPG, PNG, WebP or AVIF; maximum 10 MB per image.</p>
                </div>
                <label className={`flex items-center justify-center gap-2 w-full rounded-xl border border-dashed border-[#D4AF37]/70 bg-[#211D18] px-4 py-4 text-[#F1D27A] font-semibold cursor-pointer ${isUploadingProductImages ? 'opacity-60 pointer-events-none' : 'hover:bg-[#2B251A]'}`}>
                  <Plus size={17} />
                  {isUploadingProductImages ? 'Uploading photos…' : 'Choose photos from phone'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    multiple
                    disabled={isUploadingProductImages}
                    onChange={(e) => {
                      void handleProductImageUpload(e.target.files);
                      e.currentTarget.value = '';
                    }}
                    className="hidden"
                  />
                </label>
                {productImageUploadError && (
                  <p role="alert" className="text-rose-400 text-[11px]">{productImageUploadError}</p>
                )}
                {(productForm.images || []).length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {(productForm.images || []).map((image, index) => (
                      <div key={image + index} className="relative rounded-lg overflow-hidden border border-zinc-700 bg-black">
                        <img src={image} alt={`Product photo ${index + 1}`} className="w-full h-24 object-contain" />
                        <button
                          type="button"
                          onClick={() => removeProductImage(image)}
                          aria-label={`Remove product photo ${index + 1}`}
                          className="absolute top-1 right-1 rounded-full bg-black/80 text-white p-1"
                        >
                          <X size={13} />
                        </button>
                        {index === 0 ? <span className="absolute bottom-0 inset-x-0 bg-[#D4AF37] text-black text-center text-[9px] font-bold py-1">MAIN PHOTO</span> : <button type="button" onClick={() => setMainProductImage(image)} className="absolute bottom-0 inset-x-0 bg-black/85 text-[#FFE08A] text-center text-[9px] font-semibold py-1.5">Set as main photo</button>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500 text-[11px]">No photos selected yet. Upload at least one photo before saving.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isUploadingProductImages || isSavingProduct || !(productForm.images || []).length}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B88B22] text-black font-bold text-xs uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(isUploadingProductImages || isSavingProduct) && <LoaderCircle className="inline-block mr-2 h-4 w-4 animate-spin" />}
                {isUploadingProductImages ? 'Uploading photos…' : isSavingProduct ? 'Saving product…' : 'Save Product'}
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
