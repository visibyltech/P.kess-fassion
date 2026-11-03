export type ProductCategory = 'clothing' | 't-shirts' | 'shoes' | 'bags' | 'accessories';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  description: string;
  retailPrice: number;
  wholesalePrice: number;
  wholesaleMinQty: number;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  sku: string;
  discountPercent?: number;
  featured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewCount: number;
  details: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  isWholesale: boolean;
  unitPrice: number;
}

export type PaymentMethod = 'paystack' | 'bank_transfer' | 'bnpl_credibly';
export type PaymentStatus = 'pending' | 'awaiting_verification' | 'verified' | 'failed';
export type OrderStatus = 'pending' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';
export type DeliveryMethod = 'home' | 'pickup';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: DeliveryMethod;
  state: string;
  lga: string;
  address: string;
  deliveryInstructions?: string;
  items: CartItem[];
  subtotal: number;
  wholesaleSavings: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  courier?: string;
  proofOfPaymentUrl?: string;
  bankTransferRef?: string;
  createdAt: string;
  estimatedDeliveryDate?: string;
}

export interface SaveTransaction {
  id: string;
  planId: string;
  amount: number;
  date: string;
  paymentMethod: 'paystack' | 'bank_transfer';
  status: 'pending' | 'approved' | 'rejected';
  reference: string;
  proofUrl?: string;
}

export interface SaveToBuyPlan {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  totalAmount: number;
  amountSaved: number;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  durationMonths: number;
  depositPerCycle: number;
  nextPaymentDate: string;
  status: 'active' | 'completed' | 'cancelled' | 'overdue';
  transactions: SaveTransaction[];
  createdAt: string;
}

export interface BNPLApplication {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  itemsSummary: string;
  status: 'submitted' | 'under_review' | 'awaiting_provider_terms' | 'pre_approved' | 'declined';
  provider: 'Credibly';
  referenceNumber: string;
  createdAt: string;
  employmentStatus: string;
  monthlyIncome: number;
  bvnLast4: string;
  providerNote: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  role: 'customer' | 'admin';
  savedAddress?: {
    state: string;
    lga: string;
    street: string;
  };
  wishlist: string[];
  createdAt: string;
}

export interface WholesaleSettings {
  minUnits: number;
  defaultDiscountPercent: number;
  tierDiscounts: {
    minQty: number;
    discountPercent: number;
  }[];
  enableAutoDiscount: boolean;
}

export interface PaymentSettings {
  bankName: string;
  accountName: string;
  accountNumber: string;
  bankInstructions: string;
  paystackPublicKey: string;
  paystackSecretKey: string;
  paystackLiveMode: boolean;
}

export interface DeliveryZone {
  state: string;
  fee: number;
  estimatedDays: string;
}
