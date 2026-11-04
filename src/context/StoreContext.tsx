import React, { createContext, useContext, useState, useEffect } from 'react';
import { onSnapshot, collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import { 
  Product, 
  CartItem, 
  Order, 
  SaveToBuyPlan, 
  BNPLApplication, 
  CustomerUser, 
  WholesaleSettings, 
  PaymentSettings,
  OrderStatus,
  PaymentStatus
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_WHOLESALE_SETTINGS, 
  INITIAL_PAYMENT_SETTINGS, 
  INITIAL_CUSTOMERS, 
  INITIAL_ORDERS, 
  INITIAL_SAVINGS_PLANS 
} from '../data/initialData';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface StoreContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartSubtotal: number;
  cartWholesaleSavings: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // User & Auth
  currentUser: CustomerUser | null;
  isAdmin: boolean;
  login: (email: string, role?: 'customer' | 'admin') => boolean;
  register: (name: string, email: string, phone: string) => boolean;
  logout: () => void;
  updateUserProfile: (updates: Partial<CustomerUser>) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string, courier?: string) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  uploadOrderProof: (orderId: string, proofUrl: string, bankRef: string) => void;
  getOrderById: (orderIdOrNumber: string) => Order | undefined;

  // Save to Buy
  savingsPlans: SaveToBuyPlan[];
  createSavingsPlan: (plan: Omit<SaveToBuyPlan, 'id' | 'createdAt' | 'amountSaved' | 'transactions' | 'status'>, initialDeposit?: number) => SaveToBuyPlan;
  addSavingsTransaction: (planId: string, amount: number, paymentMethod: 'paystack' | 'bank_transfer', proofUrl?: string, reference?: string) => void;
  verifySavingsTransaction: (planId: string, transactionId: string, approve: boolean) => void;

  // BNPL (Credibly)
  bnplApplications: BNPLApplication[];
  submitBNPLApplication: (app: Omit<BNPLApplication, 'id' | 'createdAt' | 'status' | 'referenceNumber' | 'providerNote'>) => BNPLApplication;
  updateBNPLStatus: (appId: string, status: BNPLApplication['status'], note?: string) => void;

  // Settings
  wholesaleSettings: WholesaleSettings;
  updateWholesaleSettings: (settings: Partial<WholesaleSettings>) => void;
  paymentSettings: PaymentSettings;
  updatePaymentSettings: (settings: Partial<PaymentSettings>) => void;

  // Quick View Product
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Global Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Firestore is the source of truth for the shared product catalogue.
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('pkess_products');
    if (saved) {
      try { return JSON.parse(saved) as Product[]; } catch { /* use starter catalogue */ }
    }
    return INITIAL_PRODUCTS;
  });
  const [productsLoaded, setProductsLoaded] = useState(false);


  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('pkess_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(() => {
    const saved = localStorage.getItem('pkess_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('pkess_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('pkess_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [savingsPlans, setSavingsPlans] = useState<SaveToBuyPlan[]>(() => {
    const saved = localStorage.getItem('pkess_savings_plans');
    return saved ? JSON.parse(saved) : [];
  });

  const [bnplApplications, setBnplApplications] = useState<BNPLApplication[]>(() => {
    const saved = localStorage.getItem('pkess_bnpl_apps');
    return saved ? JSON.parse(saved) : [];
  });

  const [wholesaleSettings, setWholesaleSettings] = useState<WholesaleSettings>(() => {
    const saved = localStorage.getItem('pkess_wholesale_settings');
    return saved ? JSON.parse(saved) : INITIAL_WHOLESALE_SETTINGS;
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => {
    const saved = localStorage.getItem('pkess_payment_settings');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENT_SETTINGS;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Subscribe to the shared Firestore catalogue. If it is empty, retain the
  // starter display catalogue until the owner begins adding real products.
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, 'products'),
      snapshot => {
        const remoteProducts = snapshot.docs.map(item => ({ ...(item.data() as Omit<Product, 'id'>), id: item.id }));
        setProducts(remoteProducts.length ? remoteProducts : INITIAL_PRODUCTS);
        setProductsLoaded(true);
      },
      error => {
        console.error('Firestore product catalogue listener failed:', error);
        setProductsLoaded(true);
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (productsLoaded) localStorage.setItem('pkess_products', JSON.stringify(products));
  }, [products, productsLoaded]);

  useEffect(() => {
    localStorage.setItem('pkess_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('pkess_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('pkess_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('pkess_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('pkess_savings_plans', JSON.stringify(savingsPlans));
  }, [savingsPlans]);

  useEffect(() => {
    localStorage.setItem('pkess_bnpl_apps', JSON.stringify(bnplApplications));
  }, [bnplApplications]);

  useEffect(() => {
    localStorage.setItem('pkess_wholesale_settings', JSON.stringify(wholesaleSettings));
  }, [wholesaleSettings]);

  useEffect(() => {
    localStorage.setItem('pkess_payment_settings', JSON.stringify(paymentSettings));
  }, [paymentSettings]);

  // Toast notification helper
  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart calculations with wholesale logic
  const calculateCartItemUnitPrice = (product: Product, quantity: number): { unitPrice: number; isWholesale: boolean } => {
    if (quantity >= wholesaleSettings.minUnits) {
      // Find matching tier or default wholesale
      let discountRate = wholesaleSettings.defaultDiscountPercent;
      for (const tier of wholesaleSettings.tierDiscounts) {
        if (quantity >= tier.minQty && tier.discountPercent > discountRate) {
          discountRate = tier.discountPercent;
        }
      }
      const calculatedWholesale = Math.round(product.retailPrice * (1 - discountRate / 100));
      const finalPrice = product.wholesalePrice < calculatedWholesale ? product.wholesalePrice : calculatedWholesale;
      return { unitPrice: finalPrice, isWholesale: true };
    }
    const retailDiscounted = product.discountPercent ? Math.round(product.retailPrice * (1 - product.discountPercent / 100)) : product.retailPrice;
    return { unitPrice: retailDiscounted, isWholesale: false };
  };

  const addToCart = (product: Product, quantity = 1, selectedSize?: string, selectedColor?: string) => {
    const size = selectedSize || product.sizes[0] || 'Standard';
    const color = selectedColor || product.colors[0] || 'Standard';

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color);
      
      let newCart = [...prev];
      if (existingIndex > -1) {
        const newQty = newCart[existingIndex].quantity + quantity;
        const { unitPrice, isWholesale } = calculateCartItemUnitPrice(product, newQty);
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newQty,
          unitPrice,
          isWholesale
        };
      } else {
        const { unitPrice, isWholesale } = calculateCartItemUnitPrice(product, quantity);
        newCart.push({
          product,
          quantity,
          selectedSize: size,
          selectedColor: color,
          unitPrice,
          isWholesale
        });
      }
      return newCart;
    });

    showToast(`Added ${quantity}x "${product.name}" to cart`);
    setIsCartOpen(true);
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart(prev => {
      const item = prev[index];
      if (!item) return prev;
      const { unitPrice, isWholesale } = calculateCartItemUnitPrice(item.product, quantity);
      const updated = [...prev];
      updated[index] = {
        ...item,
        quantity,
        unitPrice,
        isWholesale
      };
      return updated;
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
    showToast("Item removed from cart", "info");
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Subtotal without wholesale discount
  const cartSubtotal = cart.reduce((acc, item) => {
    const standardPrice = item.product.discountPercent 
      ? Math.round(item.product.retailPrice * (1 - item.product.discountPercent / 100))
      : item.product.retailPrice;
    return acc + (standardPrice * item.quantity);
  }, 0);

  // Actual total paying
  const cartTotal = cart.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const cartWholesaleSavings = Math.max(0, cartSubtotal - cartTotal);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast("Removed from wishlist", "info");
        return prev.filter(id => id !== productId);
      } else {
        showToast("Added to wishlist ❤️");
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Auth
  const login = (email: string, _role: 'customer' | 'admin' = 'customer'): boolean => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      showToast("Enter a valid email address.", "error");
      return false;
    }
    const found = INITIAL_CUSTOMERS.find(c => c.email.toLowerCase() === normalizedEmail && c.role === 'customer');
    if (found) {
      setCurrentUser(found);
      showToast(`Welcome back, ${found.name}!`);
      return true;
    }
    showToast("Customer authentication must be connected to the approved account service before sign-in can be enabled.", "warning");
    return false;
  };

  const register = (name: string, email: string, phone: string): boolean => {
    const newUser: CustomerUser = {
      id: 'cust-' + Date.now(),
      name,
      email,
      phone,
      role: 'customer',
      wishlist: [],
      createdAt: new Date().toISOString()
    };
    setCurrentUser(newUser);
    showToast(`Account registered successfully. Welcome, ${name}!`);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast("You have been logged out", "info");
  };

  const updateUserProfile = (updates: Partial<CustomerUser>) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    showToast("Profile details updated successfully");
  };

  // Products CRUD — records and Cloudinary image URLs are stored in Firestore.
  const addProduct = async (productData: Omit<Product, 'id'>): Promise<void> => {
    try {
      const result = await addDoc(collection(firestore, 'products'), {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      const newProduct: Product = { ...productData, id: result.id };
      setProducts(prev => [newProduct, ...prev.filter(item => item.id !== result.id)]);
      showToast(`Product "${newProduct.name}" saved to the online catalogue`);
    } catch (error) {
      console.error('Could not save product to Firestore:', error);
      showToast('Could not save product. Check your admin access and Firestore rules.', 'error');
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
    try {
      await updateDoc(doc(firestore, 'products', id), {
        ...updates,
        updatedAt: serverTimestamp()
      });
      setProducts(prev => prev.map(product => product.id === id ? { ...product, ...updates } : product));
      showToast('Product updated in the online catalogue');
    } catch (error) {
      console.error('Could not update Firestore product:', error);
      showToast('Could not update product. Check your admin access and Firestore rules.', 'error');
      throw error;
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(firestore, 'products', id));
      setProducts(prev => prev.filter(product => product.id !== id));
      showToast('Product deleted from the online catalogue', 'info');
    } catch (error) {
      console.error('Could not delete Firestore product:', error);
      showToast('Could not delete product. Check your admin access and Firestore rules.', 'error');
      throw error;
    }
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      orderNumber: `PK-2026-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string, courier?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId || o.orderNumber === orderId) {
        return {
          ...o,
          orderStatus: status,
          ...(trackingNumber ? { trackingNumber } : {}),
          ...(courier ? { courier } : {})
        };
      }
      return o;
    }));
    showToast(`Order status updated to ${status.toUpperCase()}`);
  };

  const updatePaymentStatus = (orderId: string, status: PaymentStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId || o.orderNumber === orderId) {
        return { ...o, paymentStatus: status };
      }
      return o;
    }));
    showToast(`Payment status updated to ${status.toUpperCase()}`);
  };

  const uploadOrderProof = (orderId: string, proofUrl: string, bankRef: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId || o.orderNumber === orderId) {
        return {
          ...o,
          proofOfPaymentUrl: proofUrl,
          bankTransferRef: bankRef,
          paymentStatus: 'awaiting_verification'
        };
      }
      return o;
    }));
    showToast("Payment proof submitted! Awaiting admin verification.");
  };

  const getOrderById = (idOrNumber: string) => {
    const clean = idOrNumber.trim().toUpperCase();
    return orders.find(o => o.id.toUpperCase() === clean || o.orderNumber.toUpperCase() === clean);
  };

  // Save to Buy
  const createSavingsPlan = (
    planData: Omit<SaveToBuyPlan, 'id' | 'createdAt' | 'amountSaved' | 'transactions' | 'status'>,
    initialDeposit = 0
  ): SaveToBuyPlan => {
    const planId = 'stb-' + Date.now();
    const initialTx = initialDeposit > 0 ? [{
      id: 'tx-' + Date.now(),
      planId,
      amount: initialDeposit,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'paystack' as const,
      status: 'approved' as const,
      reference: 'DEP-INIT-' + Math.floor(1000 + Math.random() * 9000)
    }] : [];

    const newPlan: SaveToBuyPlan = {
      ...planData,
      id: planId,
      amountSaved: initialDeposit,
      status: initialDeposit >= planData.totalAmount ? 'completed' : 'active',
      createdAt: new Date().toISOString().split('T')[0],
      transactions: initialTx
    };

    setSavingsPlans(prev => [newPlan, ...prev]);
    showToast(`Save to Buy plan activated for ${planData.product.name}!`);
    return newPlan;
  };

  const addSavingsTransaction = (
    planId: string, 
    amount: number, 
    paymentMethod: 'paystack' | 'bank_transfer',
    proofUrl?: string,
    reference?: string
  ) => {
    setSavingsPlans(prev => prev.map(p => {
      if (p.id === planId) {
        const isApprovedNow = paymentMethod === 'paystack';
        const newTx = {
          id: 'tx-' + Date.now(),
          planId,
          amount,
          date: new Date().toISOString().split('T')[0],
          paymentMethod,
          status: isApprovedNow ? 'approved' as const : 'pending' as const,
          reference: reference || 'STB-DEP-' + Math.floor(1000 + Math.random() * 9000),
          proofUrl
        };
        const newTotalSaved = isApprovedNow ? p.amountSaved + amount : p.amountSaved;
        const newStatus = newTotalSaved >= p.totalAmount ? 'completed' : p.status;
        return {
          ...p,
          amountSaved: newTotalSaved,
          status: newStatus,
          transactions: [newTx, ...p.transactions]
        };
      }
      return p;
    }));

    if (paymentMethod === 'bank_transfer') {
      showToast("Deposit receipt uploaded! Pending admin confirmation.", "info");
    } else {
      showToast(`₦${amount.toLocaleString()} deposited successfully!`);
    }
  };

  const verifySavingsTransaction = (planId: string, transactionId: string, approve: boolean) => {
    setSavingsPlans(prev => prev.map(p => {
      if (p.id === planId) {
        const tx = p.transactions.find(t => t.id === transactionId);
        if (!tx || tx.status !== 'pending') return p;

        const updatedTxList = p.transactions.map(t => {
          if (t.id === transactionId) {
            return { ...t, status: approve ? 'approved' as const : 'rejected' as const };
          }
          return t;
        });

        const newSaved = approve ? p.amountSaved + tx.amount : p.amountSaved;
        const newStatus = newSaved >= p.totalAmount ? 'completed' : p.status;

        return {
          ...p,
          amountSaved: newSaved,
          status: newStatus,
          transactions: updatedTxList
        };
      }
      return p;
    }));
    showToast(approve ? "Deposit approved!" : "Deposit rejected", approve ? "success" : "warning");
  };

  // BNPL
  const submitBNPLApplication = (appData: Omit<BNPLApplication, 'id' | 'createdAt' | 'status' | 'referenceNumber' | 'providerNote'>): BNPLApplication => {
    const newApp: BNPLApplication = {
      ...appData,
      id: 'bnpl-' + Date.now(),
      status: 'under_review',
      referenceNumber: 'CRD-NG-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      providerNote: "Application logged in Credibly merchant queue. Awaiting provider credit facility terms."
    };
    setBnplApplications(prev => [newApp, ...prev]);
    showToast("Credibly BNPL application submitted for assessment!", "info");
    return newApp;
  };

  const updateBNPLStatus = (appId: string, status: BNPLApplication['status'], note?: string) => {
    setBnplApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          status,
          ...(note ? { providerNote: note } : {})
        };
      }
      return a;
    }));
    showToast(`BNPL Application status updated to ${status}`);
  };

  // Settings
  const updateWholesaleSettings = (newSettings: Partial<WholesaleSettings>) => {
    setWholesaleSettings(prev => ({ ...prev, ...newSettings }));
    showToast("Wholesale tier rules saved");
  };

  const updatePaymentSettings = (newSettings: Partial<PaymentSettings>) => {
    setPaymentSettings(prev => ({ ...prev, ...newSettings }));
    showToast("Payment gateways & bank account updated");
  };

  return (
    <StoreContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      cart,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      cartTotal,
      cartSubtotal,
      cartWholesaleSavings,
      cartCount,
      isCartOpen,
      setIsCartOpen,
      wishlist,
      toggleWishlist,
      isInWishlist,
      currentUser,
      isAdmin: currentUser?.role === 'admin',
      login,
      register,
      logout,
      updateUserProfile,
      isAuthModalOpen,
      setIsAuthModalOpen,
      orders,
      createOrder,
      updateOrderStatus,
      updatePaymentStatus,
      uploadOrderProof,
      getOrderById,
      savingsPlans,
      createSavingsPlan,
      addSavingsTransaction,
      verifySavingsTransaction,
      bnplApplications,
      submitBNPLApplication,
      updateBNPLStatus,
      wholesaleSettings,
      updateWholesaleSettings,
      paymentSettings,
      updatePaymentSettings,
      quickViewProduct,
      setQuickViewProduct,
      toasts,
      showToast,
      removeToast
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
