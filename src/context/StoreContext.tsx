import React, { createContext, useContext, useState, useEffect } from 'react';
import { onSnapshot, collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { firebaseAuth, firestore } from '../lib/firebase';
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
  isAuthInitializing: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
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
  // Do not hydrate the shared catalogue from stale browser data or demo items.
  // The Firestore snapshot below is the only authority, including when it is empty.
  const [products, setProducts] = useState<Product[]>([]);


  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('pkess_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(null);
  const [isAuthInitializing, setIsAuthInitializing] = useState(true);
  const ADMIN_EMAIL = 'pkessvariety@gmail.com';

  // Firebase Authentication is the sole source of signed-in identity.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      setIsAuthInitializing(true);
      try {
        if (!firebaseUser) {
          setCurrentUser(null);
          return;
        }

        const email = (firebaseUser.email || '').trim().toLowerCase();
        if (email === ADMIN_EMAIL) {
          setCurrentUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'P-Kess Administrator',
            email,
            phone: firebaseUser.phoneNumber || '',
            role: 'admin',
            wishlist: [],
            createdAt: firebaseUser.metadata.creationTime || new Date().toISOString()
          });
          return;
        }

        try {
          const profileRef = doc(firestore, 'users', firebaseUser.uid);
          const profileSnapshot = await getDoc(profileRef);
          const profile = profileSnapshot.exists() ? profileSnapshot.data() : {};
          setCurrentUser({
            id: firebaseUser.uid,
            name: profile.name || firebaseUser.displayName || email.split('@')[0],
            email,
            phone: profile.phone || firebaseUser.phoneNumber || '',
            avatarUrl: profile.avatarUrl || undefined,
            role: 'customer',
            savedAddress: profile.savedAddress,
            wishlist: Array.isArray(profile.wishlist) ? profile.wishlist : [],
            createdAt: profile.createdAt || firebaseUser.metadata.creationTime || new Date().toISOString()
          });
        } catch (error) {
          console.error('Could not load customer profile:', error);
          setCurrentUser({ id: firebaseUser.uid, name: email.split('@')[0], email, phone: '', role: 'customer', wishlist: [], createdAt: new Date().toISOString() });
        }
      } finally {
        setIsAuthInitializing(false);
      }
    });
    return unsubscribe;
  }, []);

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

  // Subscribe to the shared Firestore catalogue. An empty snapshot means
  // there are genuinely no products; never repopulate deleted starter items.
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, 'products'),
      snapshot => {
        const remoteProducts = snapshot.docs.map(item => ({ ...(item.data() as Omit<Product, 'id'>), id: item.id }));
        setProducts(remoteProducts);
      },
      error => {
        console.error('Firestore product catalogue listener failed:', error);
        setProducts([]);
        setProductsLoaded(true);
      }
    );
    return unsubscribe;
  }, []);

  // Remove the legacy product cache so deleted items cannot reappear on refresh.
  useEffect(() => {
    localStorage.removeItem('pkess_products');
  }, []);

  useEffect(() => {
    localStorage.setItem('pkess_cart', JSON.stringify(cart));
  }, [cart]);

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

  // Firebase email/password authentication. Admin access is tied to the exact owner email.
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const credential = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
      if ((credential.user.email || '').toLowerCase() !== ADMIN_EMAIL) {
        const profile = await getDoc(doc(firestore, 'users', credential.user.uid));
        if (!profile.exists()) {
          await signOut(firebaseAuth);
          showToast('Your customer profile could not be found. Please register again.', 'error');
          return false;
        }
      }
      showToast('Signed in successfully.');
      return true;
    } catch (error: any) {
      console.error('Firebase sign-in failed:', error);
      const message = error?.code === 'auth/invalid-credential' || error?.code === 'auth/wrong-password' || error?.code === 'auth/user-not-found'
        ? 'Incorrect email or password.'
        : error?.code === 'auth/too-many-requests'
          ? 'Too many attempts. Please try again later.'
          : error?.message || 'Sign-in failed. Please try again.';
      showToast(message, 'error');
      return false;
    }
  };

  const register = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    try {
      const credential = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);
      const profile = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        role: 'customer',
        wishlist: [],
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(firestore, 'users', credential.user.uid), profile);
      showToast(`Account created successfully. Welcome, ${name}!`);
      return true;
    } catch (error: any) {
      console.error('Firebase registration failed:', error);
      const message = error?.code === 'auth/email-already-in-use'
        ? 'An account already exists with this email. Please sign in.'
        : error?.code === 'auth/weak-password'
          ? 'Please use a password with at least 6 characters.'
          : error?.message || 'Could not create your account. Please try again.';
      showToast(message, 'error');
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await sendPasswordResetEmail(firebaseAuth, email.trim());
      showToast('Password reset email sent. Check your inbox.');
      return true;
    } catch (error: any) {
      console.error('Password reset failed:', error);
      showToast(error?.message || 'Could not send password reset email.', 'error');
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(firebaseAuth);
      showToast('You have been logged out', 'info');
    } catch (error) {
      console.error('Firebase sign-out failed:', error);
      showToast('Could not sign out. Please try again.', 'error');
    }
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
      isAuthInitializing,
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
