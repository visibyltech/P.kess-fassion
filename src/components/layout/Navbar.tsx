import React, { useState } from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { useStore } from '../../context/StoreContext';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  Phone, 
  MapPin, 
  ShieldCheck,
  Sparkles,
  ChevronDown,
  PiggyBank,
  Truck,
  Home,
  Package,
  ClipboardList,
  Info,
  MessageCircle,
  LogIn,
  UserPlus,
  ChevronRight,
  Percent,
  CreditCard
} from 'lucide-react';
import { BRAND_CONSTANTS } from '../../data/initialData';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { 
    cartCount, 
    setIsCartOpen, 
    wishlist, 
    currentUser, 
    setIsAuthModalOpen, 
    isAdmin, 
    logout 
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const mainNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'shop', label: 'Shop All Products', icon: ShoppingBag },
    { id: 'clothing', label: 'Clothing & Native Wear', filter: 'clothing', icon: Package },
    { id: 't-shirts', label: 'T-Shirts', filter: 't-shirts', icon: Package },
    { id: 'shoes', label: 'Shoes & Sandals', filter: 'shoes', icon: Package },
    { id: 'bags', label: 'Bags & Handbags', filter: 'bags', icon: ShoppingBag },
    { id: 'accessories', label: 'Fashion Accessories', filter: 'accessories', icon: Sparkles },
    { id: 'wholesale', label: 'Wholesale', badge: '15% Off', icon: Percent },
    { id: 'save-to-buy', label: 'Save to Buy (Installment Payments)', icon: PiggyBank },
    { id: 'bnpl', label: 'Buy Now Pay Later', icon: CreditCard },
    { id: 'track-order', label: 'Track My Order', icon: ClipboardList },
    { id: 'about', label: 'About P-Kess', icon: Info },
    { id: 'contact', label: 'Contact / WhatsApp', icon: MessageCircle }
  ];

  const handleNavClick = (item: typeof mainNavItems[0]) => {
    setMobileMenuOpen(false);
    if (item.filter) {
      onNavigate('shop', { category: item.filter });
    } else {
      onNavigate(item.id);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('shop', { search: searchQuery.trim() });
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="site-navbar sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#E8E3D9]">
      {/* Top Banner Ticker */}
      <div className="bg-gradient-to-r from-[#141418] via-[#1A1218] to-[#141418] border-b border-[#2C262E] text-xs text-white/90 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="inline-flex items-center gap-1.5 text-[#ECC260] font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#E6007A]" />
              Proudly Nigerian Fashion · Designed with Elegance
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-zinc-400">
              <MapPin className="w-3 h-3 text-[#D4AF37]" />
              Showroom: Asaba, Delta State (No. 12, DLA Road)
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <a 
              href={`tel:${BRAND_CONSTANTS.phoneNumbers[0]}`} 
              className="hidden lg:inline-flex items-center gap-1 text-zinc-300 hover:text-[#D4AF37] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#D4AF37]" />
              {BRAND_CONSTANTS.phoneNumbers[0]}
            </a>

          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-[72px] sm:h-20 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(prev => !prev)}
          className="p-2 text-zinc-800 hover:text-[#B88B22] hover:bg-zinc-100 rounded-lg"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo with Official Badge */}
        <BrandLogo 
          size="sm" 
          onClick={() => onNavigate('home')} 
          className="shrink-0"
        />

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search Nigerian designs, T-shirts, shoes, bags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#131317] border border-[#2B2B38] text-white text-xs sm:text-sm rounded-full py-2 pl-10 pr-10 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] placeholder-zinc-500 transition-colors"
            />
            <Search className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </form>
        </div>

        {/* Actions (Wishlist, Account, Cart) */}
        <div className="flex items-center gap-0.5 sm:gap-4 shrink-0 min-w-0">
          {/* Mobile search toggle */}
          <button
            onClick={() => setSearchOpen(prev => !prev)}
            className="md:hidden p-2 text-zinc-700 hover:text-[#B88B22] hover:bg-zinc-100 rounded-full"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist */}
          <button
            onClick={() => onNavigate('customer', { tab: 'wishlist' })}
            className="relative p-1.5 sm:p-2.5 text-zinc-700 hover:text-[#C21868] hover:bg-[#fff1f7] rounded-full transition-colors"
            aria-label="Wishlist"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#E6007A] text-white text-[10px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* User Account / Dropdown */}
          <div className="relative">
            {currentUser ? (
              <div>
                <button
                  onClick={() => setUserDropdownOpen(prev => !prev)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-[#24212a] border border-[#514958] hover:border-[#D4AF37] text-white text-xs transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#E6007A] flex items-center justify-center text-black font-bold text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline font-medium max-w-[100px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {userDropdownOpen && (
                  <div 
                    className="account-dropdown absolute right-0 mt-2 w-56 rounded-xl bg-[#141419] border border-[#2F2F3D] shadow-2xl py-2 z-50 text-xs"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-zinc-800">
                      <p className="font-semibold text-white truncate">{currentUser.name}</p>
                      <p className="text-zinc-400 text-[11px] truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium bg-[#D4AF37]/15 text-[#ECC260] uppercase">
                        {currentUser.role}
                      </span>
                    </div>

                    <button
                      onClick={() => onNavigate('customer', { tab: 'overview' })}
                      className="w-full text-left px-4 py-2 hover:bg-white/5 text-zinc-300 hover:text-white flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Customer Dashboard
                    </button>
                    <button
                      onClick={() => onNavigate('customer', { tab: 'orders' })}
                      className="w-full text-left px-4 py-2 hover:bg-white/5 text-zinc-300 hover:text-white flex items-center gap-2"
                    >
                      <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                      My Orders
                    </button>
                    <button
                      onClick={() => onNavigate('save-to-buy')}
                      className="w-full text-left px-4 py-2 hover:bg-white/5 text-zinc-300 hover:text-white flex items-center gap-2"
                    >
                      <PiggyBank className="w-3.5 h-3.5 text-[#E6007A]" />
                      Save to Buy Plans
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => onNavigate('admin')}
                        className="w-full text-left px-4 py-2 hover:bg-[#D4AF37]/15 text-[#ECC260] font-semibold flex items-center gap-2 border-t border-zinc-800"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Admin Control Panel
                      </button>
                    )}

                    <div className="border-t border-zinc-800 my-1" />
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-400 hover:text-red-300"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="p-1.5 sm:p-2.5 text-zinc-700 hover:text-[#8b6816] hover:bg-zinc-100 rounded-full transition-colors flex items-center gap-1.5"
                title="Customer Sign In / Register"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline text-xs font-medium">Sign In</span>
              </button>
            )}
          </div>

          {/* Cart with Live Count */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative px-2.5 sm:px-3.5 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B88B22] text-black font-semibold text-xs flex items-center gap-1.5 sm:gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#D4AF37]/20 shrink-0"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-black" />
            <span className="font-bold hidden sm:inline">Cart</span>
            <span className="bg-black text-[#ECC260] px-1.5 py-0.5 rounded-full text-[10px] font-extrabold min-w-[18px] text-center">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search Row (Expandable) */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141419] border border-[#2B2B38] text-white text-sm rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-[#D4AF37]"
              autoFocus
            />
            <Search className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>
        </div>
      )}

      {/* Main Desktop Horizontal Navigation Bar */}
      <nav className="hidden lg:block border-t border-[#1C1C24] bg-[#0A0A0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-between text-xs font-medium tracking-wider uppercase py-2.5 text-zinc-300">
            {mainNavItems.map(item => {
              const isActive = (item.filter && currentPage === 'shop') || currentPage === item.id;
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item)}
                    className={`relative py-1 px-2.5 transition-colors flex items-center gap-1.5 ${
                      isActive 
                        ? 'text-[#ECC260] font-bold' 
                        : 'hover:text-[#D4AF37]'
                    }`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5 text-[#E6007A]" />}
                    {item.label}
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded bg-[#E6007A] text-white text-[9px] font-bold tracking-tight lowercase">
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-[#D4AF37] rounded-full" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* FULL-HEIGHT STORE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100]">
          <button aria-label="Close navigation menu" onClick={() => setMobileMenuOpen(false)} className="absolute inset-0 bg-black/65 backdrop-blur-[2px]" />
          <aside className="store-navigation-drawer absolute inset-y-0 left-0 flex w-[min(82vw,500px)] flex-col bg-white text-[#28242d] shadow-2xl">
            <div className="flex h-[88px] shrink-0 items-center justify-between border-b border-[#eee8ec] px-6 sm:px-8">
              <button onClick={() => { setMobileMenuOpen(false); onNavigate('home'); }} className="text-left" aria-label="P-Kess Fashion World home">
                <span className="block font-serif-luxury text-xl font-bold tracking-[0.08em] text-[#4a3440]">P-KESS</span>
                <span className="mt-0.5 block text-[9px] font-semibold tracking-[0.28em] text-[#9a7b89]">FASHION WORLD</span>
              </button>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" className="rounded-full bg-[#f7f3f5] p-3 text-[#29242a] hover:bg-[#fce8ef]"><X className="h-5 w-5" /></button>
            </div>
            <nav className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-7">
              <div className="space-y-2">
                {mainNavItems.map(item => {
                  const active = (item.filter && currentPage === 'shop') || currentPage === item.id;
                  return <button key={item.id} onClick={() => handleNavClick(item)} className={"flex min-h-[66px] w-full items-center rounded-2xl px-5 text-left text-[17px] font-medium transition-colors " + (active ? "bg-[#f8f1f4] text-[#d94f86] font-semibold" : "text-[#302b31] hover:bg-[#faf6f8] hover:text-[#c94c7d]")}>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && <span className="rounded-full bg-[#fce8ef] px-2.5 py-1 text-[10px] font-bold text-[#c94c7d]">{item.badge}</span>}
                  </button>;
                })}
                <button onClick={() => { setMobileMenuOpen(false); onNavigate('customer', { tab: 'wishlist' }); }} className={"flex min-h-[66px] w-full items-center rounded-2xl px-5 text-left text-[17px] font-medium " + (currentPage === 'customer' ? "bg-[#f8f1f4] text-[#d94f86]" : "text-[#302b31] hover:bg-[#faf6f8]")}><span className="flex-1">My Wishlist</span></button>
                <button onClick={() => { setMobileMenuOpen(false); setIsCartOpen(true); }} className="flex min-h-[66px] w-full items-center rounded-2xl px-5 text-left text-[17px] font-medium text-[#302b31] hover:bg-[#faf6f8]"><span className="flex-1">Shopping Bag</span><span className="text-sm text-[#c94c7d]">{cartCount}</span></button>
              </div>
            </nav>
            <div className="shrink-0 border-t border-[#eee8ec] bg-white px-5 pb-6 pt-5 sm:px-7">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-[#eee8ec] px-4 py-3">
                    <p className="truncate text-sm font-semibold text-[#302b31]">{currentUser.name}</p>
                    <p className="truncate text-xs text-[#777078]">{currentUser.email}</p>
                  </div>
                  <button onClick={() => { setMobileMenuOpen(false); onNavigate('customer', { tab: 'overview' }); }} className="flex min-h-[58px] w-full items-center justify-center gap-2 rounded-2xl border border-[#e8e1e5] bg-white text-[16px] font-semibold text-[#302b31] hover:bg-[#faf6f8]"><User className="h-5 w-5 text-[#2878c7]" /> Customer Dashboard / Profile</button>
                  {isAdmin && <button onClick={() => { setMobileMenuOpen(false); onNavigate('admin'); }} className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl border border-[#ead7df] bg-[#fff7fa] text-[15px] font-semibold text-[#a83d69]"><ShieldCheck className="h-5 w-5" /> Admin Dashboard</button>}
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex min-h-[58px] w-full items-center justify-center gap-2 rounded-2xl bg-[#fbe9ec] text-[16px] font-semibold text-[#b53c49] hover:bg-[#f8dfe4]"><LogIn className="h-5 w-5 rotate-180" /> Logout</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { setMobileMenuOpen(false); setIsAuthModalOpen(true); }} className="min-h-[56px] rounded-2xl bg-[#d94f86] px-3 text-sm font-semibold text-white hover:bg-[#c64177]">Sign In</button>
                  <button onClick={() => { setMobileMenuOpen(false); setIsAuthModalOpen(true); }} className="min-h-[56px] rounded-2xl border border-[#d94f86] px-3 text-sm font-semibold text-[#c64177] hover:bg-[#fff4f8]">Sign Up</button>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

    </header>
  );
};
