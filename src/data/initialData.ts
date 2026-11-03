import { Product, WholesaleSettings, PaymentSettings, Order, SaveToBuyPlan, CustomerUser } from '../types';

export const BRAND_CONSTANTS = {
  name: "P-Kess Fashion World",
  slogan: "Creating Elegance",
  description: "P-Kess Fashion World produces and sells fashionable clothing and fashion accessories, including shoes, handbags, clothing and other fashion products.",
  address: "No. 12, DLA Road, off Summit Road, Asaba, Delta State, Nigeria",
  showroomCity: "Asaba, Delta State",
  email: "pkessvariety@gmail.com",
  phoneNumbers: ["09012776272", "08103575549"],
  phoneFormatted: "+234 901 277 6272 / +234 810 357 5549",
  currency: "₦",
  logoUrl: "/assets/aistudio/file_00000000a39082439c40a40d766f0f82_c1fea296.png",
  socials: {
    instagram: "https://instagram.com/pkessfashionworld",
    facebook: "https://facebook.com/pkessfashionworld",
    whatsapp: "https://wa.me/2349012776272",
    tiktok: "https://tiktok.com/@pkessfashion"
  }
};

export const INITIAL_PRODUCTS: Product[] = [
  // --- CLOTHING ---
  {
    id: "prod-clo-1",
    name: "The Royal Ebere Lace Boubou Gown",
    slug: "royal-ebere-lace-boubou-gown",
    category: "clothing",
    description: "Hand-embellished luxury Swiss dry lace boubou with metallic gold thread borders and magenta Swarovski crystal embellishments. Designed for queens and high-society occasions in Nigeria.",
    retailPrice: 85000,
    wholesalePrice: 72250, // 15% off
    wholesaleMinQty: 10,
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["One Size (UK 10-22)", "Custom Made"],
    colors: ["Metallic Gold & Magenta", "Deep Onyx Black", "Royal Emerald", "Champagne Gold"],
    stock: 24,
    sku: "PK-CLO-001",
    discountPercent: 0,
    featured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 38,
    details: [
      "Fabric: 100% Premium Swiss Voile Dry Lace with Metallic Embroidery",
      "Embellishments: Genuine Austrian Crystals & Beadwork",
      "Includes matching raw silk inner slip gown",
      "Dry clean only",
      "Tailored at P-Kess Haute Couture Atelier in Asaba"
    ]
  },
  {
    id: "prod-clo-2",
    name: "Aura Magenta Velvet Corset Gala Gown",
    slug: "aura-magenta-velvet-corset-gala-gown",
    category: "clothing",
    description: "Sculpted stretch velvet evening dress featuring a boned corset bodice, asymmetric thigh slit, and draped metallic gold accent chain. The epitome of modern Nigerian luxury.",
    retailPrice: 95000,
    wholesalePrice: 80750,
    wholesaleMinQty: 10,
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["UK 8", "UK 10", "UK 12", "UK 14", "UK 16"],
    colors: ["Rich Magenta", "Midnight Black", "Regal Gold"],
    stock: 18,
    sku: "PK-CLO-002",
    discountPercent: 10,
    featured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 29,
    details: [
      "Fabric: Micro-stretch French Velvet with Silk Lining",
      "Boned internal corset with laced back for perfect fit",
      "Concealed back zip closure",
      "Floor-length sweeping train"
    ]
  },
  {
    id: "prod-clo-3",
    name: "The Prestige Senator Two-Piece Suit",
    slug: "prestige-senator-two-piece-suit",
    category: "clothing",
    description: "Impeccably tailored men and unisex senator ensemble cut from Italian wool cashmere with geometric gold embroidered neck and cuff detailing.",
    retailPrice: 75000,
    wholesalePrice: 63750,
    wholesaleMinQty: 10,
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["S (Chest 38)", "M (Chest 40)", "L (Chest 42)", "XL (Chest 44)", "XXL (Chest 46)"],
    colors: ["Onyx Black & Gold", "Deep Navy", "Pure Ivory", "Burgundy Magenta"],
    stock: 30,
    sku: "PK-CLO-003",
    discountPercent: 0,
    featured: false,
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 42,
    details: [
      "Fabric: Italian Super 140s Wool Blend",
      "Handcrafted gold piping along chest placket",
      "Trousers with adjustable waistband side tabs"
    ]
  },
  {
    id: "prod-clo-4",
    name: "Sovereign Gold Brocade Blazer & Trouser Set",
    slug: "sovereign-gold-brocade-blazer-trouser-set",
    category: "clothing",
    description: "Statement power suit woven with metallic gold jacquard leaf motifs on obsidian black fabric. Features peak lapels and sculpted waistline.",
    retailPrice: 110000,
    wholesalePrice: 93500,
    wholesaleMinQty: 10,
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["UK 8", "UK 10", "UK 12", "UK 14", "UK 16"],
    colors: ["Metallic Gold & Black", "Magenta & Gold"],
    stock: 12,
    sku: "PK-CLO-004",
    discountPercent: 0,
    featured: true,
    isNewArrival: true,
    isBestSeller: false,
    rating: 5.0,
    reviewCount: 16,
    details: [
      "Fabric: Premium Jacquard Brocade with Gold Weft",
      "Double-breasted metallic gold crested buttons",
      "Fully lined in breathable cupro silk"
    ]
  },

  // --- SHOES ---
  {
    id: "prod-sho-1",
    name: "The P-Kess Aurelia Metallic Gold Stiletto",
    slug: "pkess-aurelia-metallic-gold-stiletto",
    category: "shoes",
    description: "Handcrafted 105mm stiletto pump in liquid mirror metallic gold calfskin, inspired by the gold high heel featured in our brand emblem. Features a cushioned red carpet memory sole.",
    retailPrice: 58000,
    wholesalePrice: 49300,
    wholesaleMinQty: 10,
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["EU 37 / UK 4", "EU 38 / UK 5", "EU 39 / UK 6", "EU 40 / UK 7", "EU 41 / UK 8", "EU 42 / UK 9"],
    colors: ["Mirror Liquid Gold", "Onyx Black Patent", "Vibrant Magenta Satin"],
    stock: 35,
    sku: "PK-SHO-001",
    discountPercent: 12,
    featured: true,
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 64,
    details: [
      "Heel height: 105mm / 4.1 inches",
      "Upper: Genuine Italian Mirror Metallic Calfskin",
      "Insole: Dual-density ergonomic memory foam",
      "Sole: Non-slip natural leather with signature protective rubber tread"
    ]
  },
  {
    id: "prod-sho-2",
    name: "Empress Magenta Suede Crystal Strappy Sandal",
    slug: "empress-magenta-suede-crystal-strappy-sandal",
    category: "shoes",
    description: "Sensational barely-there evening sandal crafted in rich magenta Italian kid suede, adorned with hand-set crystal vines that climb elegantly around the ankle.",
    retailPrice: 62000,
    wholesalePrice: 52700,
    wholesaleMinQty: 10,
    images: [
      "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["EU 38 / UK 5", "EU 39 / UK 6", "EU 40 / UK 7", "EU 41 / UK 8", "EU 42 / UK 9"],
    colors: ["Vibrant Magenta", "Rose Gold", "Jet Black Crystal"],
    stock: 22,
    sku: "PK-SHO-002",
    discountPercent: 0,
    featured: true,
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.9,
    reviewCount: 19,
    details: [
      "Heel height: 95mm / 3.75 inches",
      "Upper: Premium Kidskin Suede with Crystal Micro-mesh",
      "Ankle buckle strap with customizable fit"
    ]
  },
  {
    id: "prod-sho-3",
    name: "Duke of Asaba Gold-Buckle Velvet Loafer",
    slug: "duke-of-asaba-gold-buckle-velvet-loafer",
    category: "shoes",
    description: "Luxury smoking slippers for distinguished gentlemen and fashion connoisseurs. Black silk velvet with heavy 24k gold-plated crown bit ornament.",
    retailPrice: 68000,
    wholesalePrice: 57800,
    wholesaleMinQty: 10,
    images: [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["EU 40", "EU 41", "EU 42", "EU 43", "EU 44", "EU 45"],
    colors: ["Obsidian Black Velvet", "Wine Burgundy", "Navy Blue"],
    stock: 25,
    sku: "PK-SHO-003",
    discountPercent: 0,
    featured: false,
    isNewArrival: false,
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 31,
    details: [
      "Upper: Black Italian silk velvet with calfskin trim",
      "Hardware: Heavy cast gold alloy bit",
      "Goodyear welted leather outsole"
    ]
  },
  {
    id: "prod-sho-4",
    name: "Celeste Sculpted Gold Heel Mule",
    slug: "celeste-sculpted-gold-heel-mule",
    category: "shoes",
    description: "Contemporary slip-on mules featuring an architectural hollow gold sphere heel and ultra-soft nappa leather band in rich midnight noir.",
    retailPrice: 52000,
    wholesalePrice: 44200,
    wholesaleMinQty: 10,
    images: [
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["EU 37", "EU 38", "EU 39", "EU 40", "EU 41"],
    colors: ["Noir Black", "Magenta Crush", "Ivory Cream"],
    stock: 20,
    sku: "PK-SHO-004",
    discountPercent: 15,
    featured: false,
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.8,
    reviewCount: 14,
    details: [
      "Heel height: 80mm architectural gold electroplated brass",
      "Padded footbed with arch support",
      "Square modern open toe"
    ]
  },

  // --- BAGS ---
  {
    id: "prod-bag-1",
    name: "The P-Kess Sovereign Structured Top-Handle Bag",
    slug: "pkess-sovereign-structured-top-handle-bag",
    category: "bags",
    description: "Our signature flagship handbag as portrayed in our brand emblem. Sculpted from croc-embossed calfskin with heavy gold turn-lock closure and dual top handles.",
    retailPrice: 78000,
    wholesalePrice: 66300,
    wholesaleMinQty: 10,
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["Medium (30 x 22 x 12 cm)", "Large (36 x 26 x 14 cm)"],
    colors: ["Rich Magenta Pink", "Midnight Black Croc", "Caramel Gold Croc"],
    stock: 28,
    sku: "PK-BAG-001",
    discountPercent: 0,
    featured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 52,
    details: [
      "Material: Full-grain embossed calf leather",
      "Hardware: 24K electroplated gold brass hardware",
      "Compartments: Center zip divider, smartphone pocket, RFID card slots",
      "Includes detachable leather and gold chain shoulder strap",
      "Protective gold metal base studs"
    ]
  },
  {
    id: "prod-bag-2",
    name: "Lumière Crystal Minaudière Evening Clutch",
    slug: "lumiere-crystal-minaudiere-evening-clutch",
    category: "bags",
    description: "Dazzling hard-case evening clutch encrusted with thousands of multifaceted crystals set on a metallic gold frame. Comes with a discreet fold-in snake chain.",
    retailPrice: 48000,
    wholesalePrice: 40800,
    wholesaleMinQty: 10,
    images: [
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["One Size (20 x 12 x 5 cm)"],
    colors: ["Champagne Gold", "Magenta Prism", "Diamond Silver", "Jet Obsidian"],
    stock: 32,
    sku: "PK-BAG-002",
    discountPercent: 10,
    featured: true,
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 47,
    details: [
      "Hand-applied high refractive glass crystals",
      "Velvet lined interior with card holder",
      "Gold push-lock clasp closure",
      "Drop-in 110cm gold crossbody chain"
    ]
  },
  {
    id: "prod-bag-3",
    name: "Palazzo Quilted Chain Shoulder Bag",
    slug: "palazzo-quilted-chain-shoulder-bag",
    category: "bags",
    description: "Classic diamond-quilted lambskin shoulder bag with sliding dual gold chain and engraved P-Kess emblem clasp. Transitions seamlessly from daytime boardroom to gala dinners.",
    retailPrice: 65000,
    wholesalePrice: 55250,
    wholesaleMinQty: 10,
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["Medium (25 x 16 x 8 cm)"],
    colors: ["Black Onyx with Gold Chain", "Magenta Rouge", "Cream Ecru"],
    stock: 19,
    sku: "PK-BAG-003",
    discountPercent: 0,
    featured: false,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 33,
    details: [
      "Supple buttery Italian lambskin leather",
      "Double flap closure for complete security",
      "Convertible strap can be worn shoulder or crossbody"
    ]
  },
  {
    id: "prod-bag-4",
    name: "Executive Grand Shopper Tote",
    slug: "executive-grand-shopper-tote",
    category: "bags",
    description: "Spacious luxury work & shopping tote with padded 15-inch laptop compartment and reinforced leather handles. Clean, minimalist elegance for modern women on the move.",
    retailPrice: 55000,
    wholesalePrice: 46750,
    wholesaleMinQty: 10,
    images: [
      "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["Large (42 x 30 x 15 cm)"],
    colors: ["Midnight Black", "Warm Tan Camel", "Deep Bordeaux"],
    stock: 25,
    sku: "PK-BAG-004",
    discountPercent: 0,
    featured: false,
    isNewArrival: false,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 21,
    details: [
      "Durable scratch-resistant saffiano calf leather",
      "Main zip enclosure with side slip organizers",
      "Fits 13-16 inch laptops and files comfortably"
    ]
  },

  // --- ACCESSORIES ---
  {
    id: "prod-acc-1",
    name: "Imperial Majesty 24K Gold Statement Choker",
    slug: "imperial-majesty-gold-statement-choker",
    category: "accessories",
    description: "Heavy gold-layered collar necklace handcrafted with tiered filigree leaves and bezel-set magenta tourmaline gems. Designed to turn heads at Nigerian weddings and royal galas.",
    retailPrice: 38000,
    wholesalePrice: 32300,
    wholesaleMinQty: 10,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["Adjustable Collar"],
    colors: ["24K Yellow Gold Plated", "Rose Gold Plated"],
    stock: 45,
    sku: "PK-ACC-001",
    discountPercent: 15,
    featured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 58,
    details: [
      "Base: Hypoallergenic jeweler's bronze with 3-micron 24K gold vacuum plating",
      "Stones: Hand-cut lab magenta tourmaline and cubic zirconia",
      "Includes matching drop earrings and presentation jewel box",
      "Tarnish-resistant coating guaranteed 2+ years"
    ]
  },
  {
    id: "prod-acc-2",
    name: "P-Kess Royal Chronograph Diamond Watch",
    slug: "pkess-royal-chronograph-diamond-watch",
    category: "accessories",
    description: "Luxury timepiece featuring a sunray dial, tachymeter bezel set with Austrian baguette crystals, and a solid stainless steel link bracelet in two-tone gold and onyx.",
    retailPrice: 72000,
    wholesalePrice: 61200,
    wholesaleMinQty: 10,
    images: [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38mm (Women's)", "42mm (Men's / Unisex)"],
    colors: ["Two-Tone Gold & Black", "Full Gold Dial", "Rose Gold Dial"],
    stock: 20,
    sku: "PK-ACC-002",
    discountPercent: 0,
    featured: true,
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 36,
    details: [
      "Movement: Japanese Miyota Precision Quartz Chronograph",
      "Case: 316L Surgical Grade Stainless Steel",
      "Water resistance: 5 ATM (50 meters)",
      "Crystal: Scratch-resistant anti-reflective sapphire coated mineral"
    ]
  },
  {
    id: "prod-acc-3",
    name: "Monogram Silk Twill Reversible Scarf",
    slug: "monogram-silk-twill-reversible-scarf",
    category: "accessories",
    description: "Large 90x90cm 100% mulberry silk twill scarf printed with ornate golden baroque crowns, chains, and magenta floral emblems. Hand-rolled contrast edges.",
    retailPrice: 22000,
    wholesalePrice: 18700,
    wholesaleMinQty: 10,
    images: [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["90 x 90 cm"],
    colors: ["Black, Gold & Magenta", "Cream & Champagne Gold"],
    stock: 50,
    sku: "PK-ACC-003",
    discountPercent: 0,
    featured: false,
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.8,
    reviewCount: 22,
    details: [
      "100% Mulberry Silk, 16 momme twill weave",
      "Traditional hand-rolled edges",
      "Wearable as headwrap, neck scarf, or bag accessory"
    ]
  },
  {
    id: "prod-acc-4",
    name: "Versailles Gold-Rimmed Polarized Sunglasses",
    slug: "versailles-gold-rimmed-polarized-sunglasses",
    category: "accessories",
    description: "Oversized geometric statement sunglasses with sculpted gold metal temples featuring the engraved P-Kess emblem and gradient UV400 lenses.",
    retailPrice: 28000,
    wholesalePrice: 23800,
    wholesaleMinQty: 10,
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["One Size"],
    colors: ["Gold & Gradient Smoke", "Gold & Magenta Rose Gradient", "Gold & Amber Tortoise"],
    stock: 40,
    sku: "PK-ACC-004",
    discountPercent: 0,
    featured: false,
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 39,
    details: [
      "100% UVA/UVB Category 3 Polarized protection",
      "Ultra-lightweight gold titanium alloy frames",
      "Comes with hard leather travel case and microfiber cloth"
    ]
  }
];

export const INITIAL_WHOLESALE_SETTINGS: WholesaleSettings = {
  minUnits: 10,
  defaultDiscountPercent: 15,
  tierDiscounts: [
    { minQty: 10, discountPercent: 15 },
    { minQty: 25, discountPercent: 18 },
    { minQty: 50, discountPercent: 22 }
  ],
  enableAutoDiscount: true
};

export const INITIAL_PAYMENT_SETTINGS: PaymentSettings = {
  bankName: "Zenith Bank PLC",
  accountName: "P-KESS FASHION WORLD LTD",
  accountNumber: "1019842501",
  bankInstructions: "Please transfer the exact amount using your Order Number as your reference or transfer narration. Upload your debit receipt screenshot immediately after completing payment for fast 15-minute verification.",
  paystackPublicKey: "pk_test_pkess_fashion_world_2026",
  paystackSecretKey: "sk_test_pkess_secret_secured_key",
  paystackLiveMode: false
};

export const INITIAL_CUSTOMERS: CustomerUser[] = [
  {
    id: "user-1",
    name: "Dr. Chioma Okonkwo",
    email: "chioma.okonkwo@gmail.com",
    phone: "08034567890",
    role: "customer",
    savedAddress: {
      state: "Delta",
      lga: "Oshimili South (Asaba)",
      street: "Plot 14 Okpanam Road, Asaba"
    },
    wishlist: ["prod-clo-1", "prod-bag-1"],
    createdAt: "2026-09-12"
  },
  {
    id: "user-admin",
    name: "P-Kess Executive Admin",
    email: "pkessvariety@gmail.com",
    phone: "09012776272",
    role: "admin",
    wishlist: [],
    createdAt: "2026-01-01"
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-1001",
    orderNumber: "PK-2026-8910",
    customerId: "user-1",
    customerName: "Dr. Chioma Okonkwo",
    customerEmail: "chioma.okonkwo@gmail.com",
    customerPhone: "08034567890",
    deliveryMethod: "home",
    state: "Delta",
    lga: "Oshimili South (Asaba)",
    address: "Plot 14 Okpanam Road, Asaba, Delta State",
    deliveryInstructions: "Call upon arrival at the gate.",
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedSize: "One Size (UK 10-22)",
        selectedColor: "Metallic Gold & Magenta",
        isWholesale: false,
        unitPrice: 85000
      },
      {
        product: INITIAL_PRODUCTS[4],
        quantity: 1,
        selectedSize: "EU 39 / UK 6",
        selectedColor: "Mirror Liquid Gold",
        isWholesale: false,
        unitPrice: 51040
      }
    ],
    subtotal: 136040,
    wholesaleSavings: 0,
    deliveryFee: 2500,
    total: 138540,
    paymentMethod: "bank_transfer",
    paymentStatus: "verified",
    orderStatus: "processing",
    trackingNumber: "GIG-PK-99201",
    courier: "GIG Logistics",
    bankTransferRef: "TRF-9021-ZEN",
    createdAt: "2026-11-02T14:20:00Z",
    estimatedDeliveryDate: "2026-11-04"
  },
  {
    id: "ord-1002",
    orderNumber: "PK-2026-8911",
    customerId: "guest-retail-2",
    customerName: "Bolanle Adeyemi",
    customerEmail: "bolanle.adeyemi@yahoo.com",
    customerPhone: "08129983411",
    deliveryMethod: "home",
    state: "Lagos",
    lga: "Eti-Osa (Victoria Island / Lekki)",
    address: "Admiralty Way, Lekki Phase 1, Lagos",
    items: [
      {
        product: INITIAL_PRODUCTS[8],
        quantity: 10,
        selectedSize: "Medium (30 x 22 x 12 cm)",
        selectedColor: "Rich Magenta Pink",
        isWholesale: true,
        unitPrice: 66300
      }
    ],
    subtotal: 663000,
    wholesaleSavings: 117000,
    deliveryFee: 4500,
    total: 667500,
    paymentMethod: "paystack",
    paymentStatus: "verified",
    orderStatus: "dispatched",
    trackingNumber: "SPD-NG-88310",
    courier: "Speedaf Express",
    createdAt: "2026-11-01T10:15:00Z",
    estimatedDeliveryDate: "2026-11-03"
  },
  {
    id: "ord-1003",
    orderNumber: "PK-2026-8912",
    customerId: "guest-retail-3",
    customerName: "Engr. Emeka Nwosu",
    customerEmail: "emeka.nwosu@outlook.com",
    customerPhone: "08023418899",
    deliveryMethod: "pickup",
    state: "Delta",
    lga: "Oshimili South (Asaba)",
    address: "Store Pickup at P-Kess Showroom (No. 12, DLA Road, Asaba)",
    items: [
      {
        product: INITIAL_PRODUCTS[2],
        quantity: 1,
        selectedSize: "L (Chest 42)",
        selectedColor: "Onyx Black & Gold",
        isWholesale: false,
        unitPrice: 75000
      }
    ],
    subtotal: 75000,
    wholesaleSavings: 0,
    deliveryFee: 0,
    total: 75000,
    paymentMethod: "bank_transfer",
    paymentStatus: "awaiting_verification",
    orderStatus: "pending",
    proofOfPaymentUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80",
    bankTransferRef: "REF-29184820",
    createdAt: "2026-11-03T09:40:00Z"
  }
];

export const INITIAL_SAVINGS_PLANS: SaveToBuyPlan[] = [
  {
    id: "stb-201",
    customerId: "user-1",
    customerName: "Dr. Chioma Okonkwo",
    customerEmail: "chioma.okonkwo@gmail.com",
    customerPhone: "08034567890",
    productId: "prod-clo-2",
    product: INITIAL_PRODUCTS[1],
    quantity: 1,
    selectedSize: "UK 12",
    selectedColor: "Rich Magenta",
    totalAmount: 85500, // discounted price
    amountSaved: 57000,
    frequency: "weekly",
    durationMonths: 2,
    depositPerCycle: 10688,
    nextPaymentDate: "2026-11-09",
    status: "active",
    createdAt: "2026-10-10",
    transactions: [
      {
        id: "tx-1",
        planId: "stb-201",
        amount: 28500,
        date: "2026-10-10",
        paymentMethod: "paystack",
        status: "approved",
        reference: "STB-TX-001"
      },
      {
        id: "tx-2",
        planId: "stb-201",
        amount: 28500,
        date: "2026-10-24",
        paymentMethod: "bank_transfer",
        status: "approved",
        reference: "STB-TX-002"
      }
    ]
  }
];
