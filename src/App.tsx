/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { QuickViewModal } from './components/common/QuickViewModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WholesalePage } from './pages/WholesalePage';
import { SaveToBuyPage } from './pages/SaveToBuyPage';
import { BNPLPage } from './pages/BNPLPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { LegalPage } from './pages/LegalPage';

import { X, CheckCircle2, AlertTriangle, Info, MessageCircle } from 'lucide-react';

interface NavigationState {
  page: string;
  params?: Record<string, any>;
}

const AppContent: React.FC = () => {
  const { toasts, removeToast } = useStore();

  const [navState, setNavState] = useState<NavigationState>(() => {
    // Read initial hash or default to home
    const hash = window.location.hash.replace('#/', '');
    if (hash) {
      const [page, queryString] = hash.split('?');
      const params = queryString ? Object.fromEntries(new URLSearchParams(queryString)) : {};
      return { page: page || 'home', params };
    }
    return { page: 'home', params: {} };
  });

  // Keep the first in-app page in the browser history so Back returns to the store, not a blank external entry.
  useEffect(() => {
    if (!window.history.state?.page) {
      window.history.replaceState({ page: navState.page, params: navState.params || {} }, '', window.location.href);
    }
  }, []);

  // Handle browser back and forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        setNavState(event.state);
        window.scrollTo({ top: 0, behavior: 'auto' });
      } else {
        const hash = window.location.hash.replace('#/', '');
        const [page, queryString] = hash.split('?');
        const params = queryString ? Object.fromEntries(new URLSearchParams(queryString)) : {};
        const fallbackState = { page: page || 'home', params };
        setNavState(fallbackState);
        // Recover gracefully if the browser restores an entry without app state.
        window.history.replaceState(fallbackState, '', window.location.href);
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigate handler that pushes to browser history
  const handleNavigate = (page: string, params: Record<string, any> = {}) => {
    const newState = { page, params };
    setNavState(newState);

    // Build hash query string
    const query = new URLSearchParams(params).toString();
    const hashPath = query ? `#/${page}?${query}` : `#/${page}`;
    window.history.pushState(newState, '', hashPath);

    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="light-storefront min-h-screen flex flex-col bg-white text-zinc-900 selection:bg-[#D4AF37] selection:text-black">
      {/* Global Luxury Sticky Navbar */}
      <Navbar currentPage={navState.page} onNavigate={handleNavigate} />

      {/* Main Page Body */}
      <main className="flex-1">
        {navState.page === 'home' && (
          <HomePage onNavigate={handleNavigate} />
        )}

        {navState.page === 'shop' && (
          <ShopPage 
            onNavigate={handleNavigate} 
            initialCategory={navState.params?.category || 'all'}
            initialSearch={navState.params?.search || ''}
          />
        )}

        {navState.page === 'clothing' && (
          <ShopPage onNavigate={handleNavigate} initialCategory="clothing" />
        )}

        {navState.page === 't-shirts' && (
          <ShopPage onNavigate={handleNavigate} initialCategory="t-shirts" />
        )}

        {navState.page === 'shoes' && (
          <ShopPage onNavigate={handleNavigate} initialCategory="shoes" />
        )}

        {navState.page === 'bags' && (
          <ShopPage onNavigate={handleNavigate} initialCategory="bags" />
        )}

        {navState.page === 'accessories' && (
          <ShopPage onNavigate={handleNavigate} initialCategory="accessories" />
        )}

        {navState.page === 'product-detail' && (
          <ProductDetailPage 
            slug={navState.params?.slug || ''} 
            onNavigate={handleNavigate} 
          />
        )}

        {navState.page === 'wholesale' && (
          <WholesalePage onNavigate={handleNavigate} />
        )}

        {navState.page === 'save-to-buy' && (
          <SaveToBuyPage 
            onNavigate={handleNavigate}
            initialProductId={navState.params?.productId}
            initialSize={navState.params?.selectedSize}
            initialColor={navState.params?.selectedColor}
            initialQuantity={navState.params?.quantity}
          />
        )}

        {navState.page === 'bnpl' && (
          <BNPLPage onNavigate={handleNavigate} />
        )}

        {navState.page === 'cart' && (
          <CartPage onNavigate={handleNavigate} />
        )}

        {navState.page === 'checkout' && (
          <CheckoutPage onNavigate={handleNavigate} />
        )}

        {navState.page === 'track-order' && (
          <OrderTrackingPage 
            onNavigate={handleNavigate} 
            initialOrderNumber={navState.params?.orderNumber}
          />
        )}

        {navState.page === 'customer' && (
          <CustomerDashboardPage 
            onNavigate={handleNavigate} 
            initialTab={navState.params?.tab || 'overview'}
          />
        )}

        {navState.page === 'admin' && (
          <AdminDashboardPage onNavigate={handleNavigate} />
        )}

        {navState.page === 'about' && (
          <AboutUsPage onNavigate={handleNavigate} />
        )}

        {navState.page === 'contact' && (
          <ContactUsPage />
        )}

        {navState.page === 'legal' && (
          <LegalPage 
            onNavigate={handleNavigate} 
            initialType={navState.params?.type || 'terms'}
          />
        )}
      </main>

      {/* Global Grand Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Overlays, Modals and Drawers */}
      <CartDrawer onNavigate={handleNavigate} />
      <AuthModal />
      <QuickViewModal onNavigate={handleNavigate} />

      <a\n        href="https://wa.me/2349012776272?text=Hello%20P-Kess%20Fashion%20World%2C%20I%20would%20like%20to%20make%20an%20enquiry."\n        target="_blank"\n        rel="noopener noreferrer"\n        aria-label="Chat with P-Kess Fashion World on WhatsApp"\n        title="Chat with us on WhatsApp"\n        className="whatsapp-float fixed bottom-6 right-4 sm:right-6 z-[60] w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"\n      >\n        <MessageCircle className="w-7 h-7" strokeWidth={2.4} />\n        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#25D366]" />\n      </a>\n\n      {/* Global Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border flex items-center justify-between gap-3 text-xs font-semibold backdrop-blur-md animate-slide-up ${
              toast.type === 'error'
                ? 'bg-red-950/90 border-red-500/40 text-red-200'
                : toast.type === 'warning'
                  ? 'bg-amber-950/90 border-amber-500/40 text-amber-200'
                  : toast.type === 'info'
                    ? 'bg-[#181824]/95 border-[#2E2E44] text-zinc-200'
                    : 'bg-[#101510]/95 border-emerald-500/40 text-emerald-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />}
              {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-[#D4AF37] shrink-0" />}
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              <span>{toast.message}</span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-zinc-400 hover:text-white shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
