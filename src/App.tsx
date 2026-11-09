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

import { X, CheckCircle2, AlertTriangle, Info, MessageCircle, LoaderCircle } from 'lucide-react';

interface NavigationState {
  page: string;
  params?: Record<string, any>;
}

const AppContent: React.FC = () => {
  const { toasts, removeToast, isAuthInitializing, products } = useStore();
  const [isPageLoading, setIsPageLoading] = useState(false);

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

  // Keep document metadata aligned with the visible storefront page.
  useEffect(() => {
    const product = navState.page === 'product-detail'
      ? products.find(item => item.slug === navState.params?.slug)
      : undefined;
    const pageMeta: Record<string, { title: string; description: string }> = {
      home: { title: 'P-Kess Fashion World | Nigerian Fashion, Shoes, Bags & Accessories', description: 'Shop P-Kess Fashion World for designer clothing, Nigerian native wear, T-shirts, shoes, handbags and fashion accessories. Visit our showroom in Asaba, Delta State, or shop online across Nigeria.' },
      shop: { title: 'Shop Fashion, Shoes, Bags & Accessories | P-Kess Fashion World', description: 'Explore the P-Kess Fashion World online collection of clothing, native wear, T-shirts, shoes, handbags and fashion accessories. Shop online in Nigeria.' },
      clothing: { title: 'Clothing & Nigerian Native Wear | P-Kess Fashion World', description: 'Explore clothing and Nigerian native-inspired styles from P-Kess Fashion World. Shop online from Asaba, Delta State, with nationwide shopping.' },
      't-shirts': { title: 'T-Shirts & Everyday Wear | P-Kess Fashion World', description: 'Browse T-shirts and everyday fashion from P-Kess Fashion World. Discover styles and shop online in Nigeria.' },
      shoes: { title: 'Shoes & Sandals | P-Kess Fashion World', description: 'Discover shoes and sandals at P-Kess Fashion World. Browse the collection and shop online in Nigeria.' },
      bags: { title: 'Bags & Handbags | P-Kess Fashion World', description: 'Explore bags and handbags at P-Kess Fashion World. Find a style for everyday wear and special occasions.' },
      accessories: { title: 'Fashion Accessories | P-Kess Fashion World', description: 'Shop fashion accessories from P-Kess Fashion World in Asaba, Nigeria.' },
      wholesale: { title: 'Wholesale Fashion & Bulk Orders | P-Kess Fashion World', description: 'Explore wholesale fashion offers for boutiques, retailers and bulk buyers at P-Kess Fashion World.' },
      about: { title: 'About P-Kess Fashion World | Asaba, Delta State', description: 'Learn about P-Kess Fashion World, a Nigerian fashion brand based in Asaba, Delta State.' },
      contact: { title: 'Contact P-Kess Fashion World | Asaba, Nigeria', description: 'Contact P-Kess Fashion World for product enquiries, sizing, wholesale orders and showroom information in Asaba, Delta State.' },
      'track-order': { title: 'Track Your Order | P-Kess Fashion World', description: 'Check the status of your P-Kess Fashion World order.' }
    };
    const fallback = pageMeta[navState.page] || { title: 'P-Kess Fashion World | Online Fashion Store Nigeria', description: 'Discover clothing, shoes, bags and fashion accessories at P-Kess Fashion World.' };
    const title = product ? `${product.name} | P-Kess Fashion World` : fallback.title;
    const description = product
      ? `${product.description} Shop ${product.name} at P-Kess Fashion World, Asaba, Nigeria.`.slice(0, 300)
      : fallback.description;
    document.title = title;
    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.setAttribute('name', 'description');
      document.head.appendChild(descriptionTag);
    }
    descriptionTag.setAttribute('content', description);
    for (const [property, content] of [['og:title', title], ['og:description', description], ['og:type', 'website']]) {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    }
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.setAttribute('name', 'twitter:title');
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.setAttribute('content', title);
    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDescription) {
      twitterDescription = document.createElement('meta');
      twitterDescription.setAttribute('name', 'twitter:description');
      document.head.appendChild(twitterDescription);
    }
    twitterDescription.setAttribute('content', description);
  }, [navState.page, navState.params?.slug, products]);

  // Keep the first in-app page in the browser history so Back returns to the store, not a blank external entry.
  useEffect(() => {
    if (!window.history.state?.page) {
      window.history.replaceState({ page: navState.page, params: navState.params || {} }, '', window.location.href);
    }
  }, []);

  // Handle browser back and forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      setIsPageLoading(true);
      window.setTimeout(() => setIsPageLoading(false), 350);
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
    if (page === navState.page && JSON.stringify(params) === JSON.stringify(navState.params || {})) return;
    setIsPageLoading(true);
    window.setTimeout(() => setIsPageLoading(false), 450);
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
    <div className="min-h-screen flex flex-col bg-[#08080A] text-zinc-100 selection:bg-[#D4AF37] selection:text-black">
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

      {(isPageLoading || isAuthInitializing) && <div role="status" aria-live="polite" className="fixed inset-0 z-[200] flex items-center justify-center bg-[#08080A]/75 backdrop-blur-sm"><div className="flex items-center gap-3 rounded-2xl border border-[#D4AF37]/30 bg-[#121216] px-5 py-4 text-sm font-semibold text-white shadow-2xl"><LoaderCircle className="h-5 w-5 animate-spin text-[#ECC260]" /> {isAuthInitializing ? 'Loading account…' : 'Loading page…'}</div></div>}

      {/* Global Grand Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Overlays, Modals and Drawers */}
      <CartDrawer onNavigate={handleNavigate} />
      <AuthModal />
      <QuickViewModal onNavigate={handleNavigate} />

      <a
        href="https://wa.me/2349012776272?text=Hello%20P-Kess%20Fashion%20World%2C%20I%20would%20like%20to%20make%20an%20enquiry."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with P-Kess Fashion World on WhatsApp"
        title="Chat with us on WhatsApp"
        className="whatsapp-float fixed bottom-6 right-4 sm:right-6 z-[60] w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
      >
        <MessageCircle className="w-7 h-7" strokeWidth={2.4} />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#25D366]" />
      </a>

      {/* Global Toast Notifications */}
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
