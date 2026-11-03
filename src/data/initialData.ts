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
    name: "P-Kess Ankara Statement Boubou",
    slug: "royal-ebere-lace-boubou-gown",
    category: "clothing",
    description: "A flowing Nigerian-inspired boubou silhouette in a bold Ankara print, styled for celebrations, family occasions and elegant everyday wear.",
    retailPrice: 85000,
    wholesalePrice: 72250, // 15% off
    wholesaleMinQty: 10,
    images: ["https://commons.wikimedia.org/wiki/Special:FilePath/A_Nigerian_lady_in_Ankara_clothing.jpg?width=1000", "https://commons.wikimedia.org/wiki/Special:FilePath/A_Nigerian_lady_in_Ankara_clothing2.jpg?width=1000"],
    sizes: ["One Size (UK 10-22)", "Custom Made"],
    colors: ["Metallic Gold & Magenta", "Deep Onyx Black", "Royal Emerald", "Champagne Gold"],
    stock: 24,
    sku: "PK-CLO-001",
    discountPercent: 0,
    featured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 0,
    reviewCount: 0,
    details: [
      "Style: Nigerian-inspired boubou silhouette with Ankara print",
      "Embellishments: Genuine decorative Crystals & Beadwork",
      "Includes matching raw silk inner slip gown",
      "Dry clean only",
      "Designed for P-Kess Fashion World in Asaba"
    ]
  },
  {
    id: "prod-clo-2",
    name: "P-Kess Ankara Occasion Gown",
    slug: "aura-magenta-velvet-corset-gala-gown",
    category: "clothing",
    description: "A statement occasion gown with a flattering fitted shape and contemporary detailing. A polished choice for celebrations and special events.",
    retailPrice: 95000,
    wholesalePrice: 80750,
    wholesaleMinQty: 10,
    images: ["https://commons.wikimedia.org/wiki/Special:FilePath/Ankara_dress.jpg?width=1000", "https://commons.wikimedia.org/wiki/Special:FilePath/Cowries_Print_Maxi_Dress.JPG?width=1000"],
    sizes: ["UK 8", "UK 10", "UK 12", "UK 14", "UK 16"],
    colors: ["Rich Magenta", "Midnight Black", "Regal Gold"],
    stock: 18,
    sku: "PK-CLO-002",
    discountPercent: 10,
    featured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 0,
    reviewCount: 0,
    details: [
      "Style: Fitted occasion gown with contemporary detailing",
      "Boned internal corset with laced back for perfect fit",
      "Concealed back zip closure",
      "Floor-length sweeping train"
    ]
  },
  {
    id: "prod-clo-3",
    name: "P-Kess Senator Two-Piece Set",
    slug: "prestige-senator-two-piece-suit",
    category: "clothing",
    description: "A smart Nigerian senator-inspired two-piece set with a clean silhouette and refined neckline detailing for events and formal occasions.",
    retailPrice: 75000,
    wholesalePrice: 63750,
    wholesaleMinQty: 10,
    images: ["https://commons.wikimedia.org/wiki/Special:FilePath/A_Nigerian_family_in_Ankara_clothing.jpg?width=1000", "https://commons.wikimedia.org/wiki/Special:FilePath/A_Nigerian_man_in_a_Guinea_clothing.jpg?width=1000"],
    sizes: ["S (Chest 38)", "M (Chest 40)", "L (Chest 42)", "XL (Chest 44)", "XXL (Chest 46)"],
    colors: ["Onyx Black & Gold", "Deep Navy", "Pure Ivory", "Burgundy Magenta"],
    stock: 30,
    sku: "PK-CLO-003",
    discountPercent: 0,
    featured: false,
    isNewArrival: false,
    isBestSeller: true,
    rating: 0,
    reviewCount: 0,
    details: [
      "Style: Nigerian senator-inspired two-piece set",
      "Handcrafted gold piping along chest placket",
      "Trousers with adjustable waistband side tabs"
    ]
  },
  {
    id: "prod-clo-4",
    name: "P-Kess Aso-Oke Detail Two-Piece",
    slug: "sovereign-gold-brocade-blazer-trouser-set",
    category: "clothing",
    description: "A coordinated two-piece outfit inspired by Nigerian occasion dressing, with a structured finish and elegant detailing.",
    retailPrice: 110000,
    wholesalePrice: 93500,
    wholesaleMinQty: 10,
    images: ["https://commons.wikimedia.org/wiki/Special:FilePath/A_Nigerian_woman_in_a_Guinea_clothing_and_the_Gele_headtie.jpg?width=1000", "https://commons.wikimedia.org/wiki/Special:FilePath/A_Nigerian_Yoruba_lady_in_a_Buba_and_Gele_headtie.jpg?width=1000"],
    sizes: ["UK 8", "UK 10", "UK 12", "UK 14", "UK 16"],
    colors: ["Metallic Gold & Black", "Magenta & Gold"],
    stock: 12,
    sku: "PK-CLO-004",
    discountPercent: 0,
    featured: true,
    isNewArrival: true,
    isBestSeller: false,
    rating: 0,
    reviewCount: 0,
    details: [
      "Style: Coordinated two-piece outfit with structured finish",
      "Double-breasted metallic gold crested buttons",
      "Fully lined in breathable cupro silk"
    ]
  },

  // --- SHOES ---
  {
    id: "prod-sho-1",
    name: "P-Kess Classic Leather Sandals",
    slug: "pkess-aurelia-metallic-gold-stiletto",
    category: "shoes",
    description: "A versatile footwear style selected to complement Nigerian occasion wear and contemporary outfits. Check available sizes before ordering.",
    retailPrice: 58000,
    wholesalePrice: 49300,
    wholesaleMinQty: 10,
    images: ["https://commons.wikimedia.org/wiki/Special:FilePath/Nigerian_Sandal.jpg?width=1000", "https://commons.wikimedia.org/wiki/Special:FilePath/Handcrafted_sandals_01.jpg?width=1000"],
    sizes: ["EU 37 / UK 4", "EU 38 / UK 5", "EU 39 / UK 6", "EU 40 / UK 7", "EU 41 / UK 8", "EU 42 / UK 9"],
    colors: ["Mirror Liquid Gold", "Onyx Black Patent", "Vibrant Magenta Satin"],
    stock: 35,
    sku: "PK-SHO-001",
    discountPercent: 12,
    featured: true,
    isNewArrival: false,
    isBestSeller: true,
    rating: 0,
    reviewCount: 0,
    details: [
      "Heel height: 105mm / 4.1 inches",
      "Style: Classic footwear silhouette",
      "Insole: Dual-density ergonomic memory foam",
      "Sole: Non-slip natural leather with signature protective rubber tread"
    ]
  },
  {
    id: "prod-sho-2",
    name: "P-Kess Everyday Handmade Slides",
    slug: "empress-magenta-suede-crystal-strappy-sandal",
    category: "shoes",
    description: "A comfortable statement sandal for celebrations and everyday styling, designed to pair with dresses, native wear and casual looks.",
    retailPrice: 62000,
    wholesalePrice: 52700,
    wholesaleMinQty: 10,
    images: ["https://commons.wikimedia.org/wiki/Special:FilePath/Handcrafted_sandals_02.jpg?width=1000", "https://commons.wikimedia.org/wiki/Special:FilePath/A_handcrafted_pair_of_slides.jpg?width=1000"],
    sizes: ["EU 38 / UK 5", "EU 39 / UK 6", "EU 40 / UK 7", "EU 41 / UK 8", "EU 42 / UK 9"],
    colors: ["Vibrant Magenta", "Rose Gold", "Jet Black Crystal"],
    stock: 22,
    sku: "PK-SHO-002",
    discountPercent: 0,
    featured: true,
    isNewArrival: true,
    isBestSeller: false,
    rating: 0,
    reviewCount: 0,
    details: [
      "Heel height: 95mm / 3.75 inches",
      "Style: Open-toe occasion sandal",
      "Ankle buckle strap with customizable fit"
    ]
  },
  {
    id: "prod-sho-3",
    name: "P-Kess Men's Leather Sandals",
    slug: "duke-of-asaba-gold-buckle-velvet-loafer",
    category: "shoes",
    description: "A classic men's footwear option with a smart finish, suitable for native wear, senator outfits and relaxed formal looks.",
    retailPrice: 68000,
    wholesalePrice: 57800,
    wholesaleMinQty: 10,
    images: ["https://commons.wikimedia.org/wiki/Special:FilePath/Hand_made_Shoe.jpg?width=1000", "https://commons.wikimedia.org/wiki/Special:FilePath/Nigerian_Sandal.jpg?width=1000"],
    sizes: ["EU 40", "EU 41", "EU 42", "EU 43", "EU 44", "EU 45"],
    colors: ["Obsidian Black Velvet", "Wine Burgundy", "Navy Blue"],
    stock: 25,
    sku: "PK-SHO-003",
    discountPercent: 0,
    featured: false,
    isNewArrival: false,
    isBestSeller: true,
    rating: 0,
    reviewCount: 0,
    details: [
      "Style: Men's slip-on footwear",
      "Hardware: Heavy cast gold alloy bit",
      "Goodyear welted leather outsole"
    ]
  },
  {
    id: "prod-sho-4",
    name: "P-Kess Women's Statement Slides",
    slug: "celeste-sculpted-gold-heel-mule",
    category: "shoes",
    description: "An easy-to-style slip-on footwear option for day-to-evening outfits.",
    retailPrice: 52000,
    wholesalePrice: 44200,
    wholesaleMinQty: 10,
    images: ["https://commons.wikimedia.org/wiki/Special:FilePath/A_handcrafted_pair_of_slides.jpg?width=1000"],
    sizes: ["EU 37", "EU 38", "EU 39", "EU 40", "EU 41"],
    colors: ["Noir Black", "Magenta Crush", "Ivory Cream"],
    stock: 20,
    sku: "PK-SHO-004",
    discountPercent: 15,
    featured: false,
    isNewArrival: true,
    isBestSeller: false,
    rating: 0,
    reviewCount: 0,
    details: [
      "Heel height: 80mm architectural gold electroplated brass",
      "Padded footbed with arch support",
      "Square modern open toe"
    ]
  },

  // --- BAGS ---
  {
    id: "prod-bag-1",
    name: "P-Kess Ankara Top-Handle Bag",
    slug: "pkess-sovereign-structured-top-handle-bag",
    category: "bags",
    description: "A Nigerian-inspired Ankara fabric handbag with a structured shape for carrying everyday essentials and adding colour to your look.",
    retailPrice: 78000,
    wholesalePrice: 66300,
    wholesaleMinQty: 10,
    images: ["https://commons.wikimedia.org/wiki/Special:FilePath/Ankara_bag.jpg?width=1000", "https://commons.wikimedia.org/wiki/Special:FilePath/I_Love_Naija_Shoulder_Bag.JPG?width=1000"],
    sizes: ["Medium (30 x 22 x 12 cm)", "Large (36 x 26 x 14 cm)"],
    colors: ["Rich Magenta Pink", "Midnight Black Croc", "Caramel Gold Croc"],
    stock: 28,
    sku: "PK-BAG-001",
    discountPercent: 0,
    featured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 0,
    reviewCount: 0,
    details: [
      "Material: Ankara fabric and supporting bag materials",
      "Hardware: gold-tone hardware",
      "Compartments: Center zip divider, smartphone pocket, RFID card slots",
      "Includes detachable leather and gold chain shoulder strap",
      "Protective gold metal base studs"
    ]
  },
  {
    id: "prod-bag-2",
    name: "P-Kess Ankara Occasion Clutch",
    slug: "lumiere-crystal-minaudiere-evening-clutch",
    category: "bags",
    description: "A compact occasion bag with an elegant finish, suitable for weddings, parties and special events.",
    retailPrice: 48000,
    wholesalePrice: 40800,
    wholesaleMinQty: 10,
    images: ["https://commons.wikimedia.org/wiki/Special:FilePath/I_Love_Naija_Shoulder_Bag.JPG?width=1000", "https://commons.wikimedia.org/wiki/Special:FilePath/Ankara_bag.jpg?width=1000"],
    sizes: ["One Size (20 x 12 x 5 cm)"],
    colors: ["Champagne Gold", "Magenta Prism", "Diamond Silver", "Jet Obsidian"],
    stock: 32,
    sku: "PK-BAG-002",
    discountPercent: 10,
    featured: true,
    isNewArrival: false,
    isBestSeller: true,
    rating: 0,
    reviewCount: 0,
    details: [
      "Hand-applied high refractive glass crystals",
      "Velvet lined interior with card holder",
      "Gold push-lock clasp closure",
      "Drop-in 110cm gold crossbody chain"
    ]
  },
  {
    id: "prod-bag-3",
    name: "P-Kess Everyday Ankara Shoulder Bag",
    slug: "palazzo-quilted-chain-shoulder-bag",
    category: "bags",
    description: "A practical shoulder bag designed to complement both casual outfits and Nigerian occasion wear.",
    retailPrice: 65000,
    wholesalePrice: 55250,
    wholesaleMinQty: 10,
    images: ["https://commons.wikimedia.org/wiki/Special:FilePath/Ankara_bag.jpg?width=1000", "https://commons.wikimedia.org/wiki/Special:FilePath/I_Love_Naija_Shoulder_Bag.JPG?width=1000"],
    sizes: ["Medium (25 x 16 x 8 cm)"],
    colors: ["Black Onyx with Gold Chain", "Magenta Rouge", "Cream Ecru"],
    stock: 19,
    sku: "PK-BAG-003",
    discountPercent: 0,
    featured: false,
    isNewArrival: true,
    isBestSeller: true,
    rating: 0,
    reviewCount: 0,
    details: [
      "Supple buttery locally selected lambskin leather",
      "Double flap closure for complete security",
      "Convertible strap can be worn shoulder or crossbody"
    ]
  },
  {
    id: "prod-bag-4",
    name: "P-Kess Everyday Market Tote",
    slug: "executive-grand-shopper-tote",
    category: "bags",
    description: "A roomy everyday tote for shopping, work and daily essentials.",
    retailPrice: 55000,
    wholesalePrice: 46750,
    wholesaleMinQty: 10,
    images: ["https://commons.wikimedia.org/wiki/Special:FilePath/Ankara_bag.jpg?width=1000"],
    sizes: ["Large (42 x 30 x 15 cm)"],
    colors: ["Midnight Black", "Warm Tan Camel", "Deep Bordeaux"],
    stock: 25,
    sku: "PK-BAG-004",
    discountPercent: 0,
    featured: false,
    isNewArrival: false,
    isBestSeller: false,
    rating: 0,
    reviewCount: 0,
    details: [
      "Durable everyday bag material",
      "Main zip enclosure with side slip organizers",
      "Fits 13-16 inch laptops and files comfortably"
    ]
  },

  // --- ACCESSORIES ---
  {
    id: "prod-acc-1",
    name: "P-Kess Traditional Beaded Necklace Set",
    slug: "imperial-majesty-gold-statement-choker",
    category: "accessories",
    description: "A statement beaded accessory inspired by Nigerian traditional styling. A bold finishing touch for special occasions.",
    retailPrice: 38000,
    wholesalePrice: 32300,
    wholesaleMinQty: 10,
    images: ["https://commons.wikimedia.org/wiki/Special:FilePath/A_lady_adorned_with_the_white_bead.jpg?width=1000", "https://commons.wikimedia.org/wiki/Special:FilePath/Ankara_cap.jpg?width=1000"],
    sizes: ["Adjustable Collar"],
    colors: ["Gold Tone", "Rose Gold Plated"],
    stock: 45,
    sku: "PK-ACC-001",
    discountPercent: 15,
    featured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 0,
    reviewCount: 0,
    details: [
      "Base: Hypoallergenic jeweler's bronze with gold-tone finish",
      "Stones: Hand-cut lab magenta tourmaline and cubic zirconia",
      "Includes matching drop earrings and presentation jewel box",
      "Tarnish-resistant coating guaranteed 2+ years"
    ]
  },
  {
    id: "prod-acc-2",
    name: "P-Kess Statement Headwrap & Cap",
    slug: "pkess-royal-chronograph-diamond-watch",
    category: "accessories",
    description: "A fashion accessory selected to complete both contemporary and traditional looks.",
    retailPrice: 72000,
    wholesalePrice: 61200,
    wholesaleMinQty: 10,
    images: ["https://commons.wikimedia.org/wiki/Special:FilePath/Ankara_cap.jpg?width=1000", "https://commons.wikimedia.org/wiki/Special:FilePath/Aso_Oke.jpg?width=1000"],
    sizes: ["38mm (Women's)", "42mm (Men's / Unisex)"],
    colors: ["Two-Tone Gold & Black", "Full Gold Dial", "Rose Gold Dial"],
    stock: 20,
    sku: "PK-ACC-002",
    discountPercent: 0,
    featured: true,
    isNewArrival: false,
    isBestSeller: true,
    rating: 0,
    reviewCount: 0,
    details: [
      "Movement: Japanese Miyota Precision Quartz Chronograph",
      "Case: 316L Surgical Grade Stainless Steel",
      "Water resistance: 5 ATM (50 meters)",
      "Crystal: Scratch-resistant anti-reflective sapphire coated mineral"
    ]
  },
  {
    id: "prod-acc-3",
    name: "P-Kess Aso-Oke Inspired Scarf",
    slug: "monogram-silk-twill-reversible-scarf",
    category: "accessories",
    description: "A versatile scarf or headwrap inspired by Nigerian styling traditions. Wear it around the head, neck or as a bag accent.",
    retailPrice: 22000,
    wholesalePrice: 18700,
    wholesaleMinQty: 10,
    images: ["https://commons.wikimedia.org/wiki/Special:FilePath/Aso_oke.jpg?width=1000", "https://commons.wikimedia.org/wiki/Special:FilePath/Ankara_cap.jpg?width=1000"],
    sizes: ["90 x 90 cm"],
    colors: ["Black, Gold & Magenta", "Cream & Champagne Gold"],
    stock: 50,
    sku: "PK-ACC-003",
    discountPercent: 0,
    featured: false,
    isNewArrival: true,
    isBestSeller: false,
    rating: 0,
    reviewCount: 0,
    details: [
      "100% soft fabric, 16 momme twill weave",
      "Traditional hand-rolled edges",
      "Wearable as headwrap, neck scarf, or bag accessory"
    ]
  },
  {
    id: "prod-acc-4",
    name: "P-Kess Fashion Finishing Accessories",
    slug: "versailles-gold-rimmed-polarized-sunglasses",
    category: "accessories",
    description: "A stylish finishing accessory for everyday outfits and special occasions.",
    retailPrice: 28000,
    wholesalePrice: 23800,
    wholesaleMinQty: 10,
    images: ["https://commons.wikimedia.org/wiki/Special:FilePath/Ankara_cap.jpg?width=1000"],
    sizes: ["One Size"],
    colors: ["Gold & Gradient Smoke", "Gold & Magenta Rose Gradient", "Gold & Amber Tortoise"],
    stock: 40,
    sku: "PK-ACC-004",
    discountPercent: 0,
    featured: false,
    isNewArrival: false,
    isBestSeller: true,
    rating: 0,
    reviewCount: 0,
    details: [
      "100% UVA/UVB Category 3 Polarized protection",
      "Ultra-lightweight gold titanium alloy frames",
      "Comes with hard leather travel case and microfiber cloth"
    ]
  },

  // --- T-SHIRTS ---
  {
    id: "prod-tee-1",
    name: "P-Kess Naija Graphic T-Shirt",
    slug: "pkess-naija-graphic-t-shirt",
    category: "t-shirts",
    description: "A relaxed everyday tee celebrating Nigerian identity. Designed as an easy-to-style wardrobe staple for casual looks.",
    retailPrice: 25000,
    wholesalePrice: 21250,
    wholesaleMinQty: 10,
    images: ["https://commons.wikimedia.org/wiki/Special:FilePath/I_Love_Naija_Tee.JPG?width=1000"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black"],
    stock: 12,
    sku: "PK-TEE-001",
    discountPercent: 0,
    featured: true,
    isNewArrival: true,
    isBestSeller: false,
    rating: 0,
    reviewCount: 0,
    details: ["Everyday casual styling", "Available in multiple sizes", "Confirm colour and availability before dispatch"]
  },
  {
    id: "prod-tee-2",
    name: "P-Kess African Mask Print Tee",
    slug: "pkess-african-mask-print-tee",
    category: "t-shirts",
    description: "A casual graphic tee inspired by African art and visual heritage. Pair with denim, trousers or shorts for an effortless look.",
    retailPrice: 28000,
    wholesalePrice: 23800,
    wholesaleMinQty: 10,
    images: ["https://commons.wikimedia.org/wiki/Special:FilePath/African_Mask_Tee.JPG?width=1000"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White"],
    stock: 10,
    sku: "PK-TEE-002",
    discountPercent: 0,
    featured: true,
    isNewArrival: true,
    isBestSeller: false,
    rating: 0,
    reviewCount: 0,
    details: ["Relaxed casual fit", "Graphic-inspired styling", "Confirm colour and availability before dispatch"]
  },
  {
    id: "prod-tee-3",
    name: "P-Kess Everyday Nigerian Cotton Tee",
    slug: "pkess-everyday-nigerian-cotton-tee",
    category: "t-shirts",
    description: "A simple everyday T-shirt concept for easy pairing with jeans, skirts and casual sets.",
    retailPrice: 22000,
    wholesalePrice: 18700,
    wholesaleMinQty: 10,
    images: ["https://commons.wikimedia.org/wiki/Special:FilePath/Batik_Africa_Tshirt.jpg?width=1000"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Navy", "Black"],
    stock: 15,
    sku: "PK-TEE-003",
    discountPercent: 0,
    featured: false,
    isNewArrival: true,
    isBestSeller: false,
    rating: 0,
    reviewCount: 0,
    details: ["Everyday wardrobe staple", "Multiple size options", "Confirm colour and availability before dispatch"]
  },

];

export const INITIAL_WHOLESALE_SETTINGS: WholesaleSettings = {
  minUnits: 10,
  defaultDiscountPercent: 15,
  tierDiscounts: [
    { minQty: 10, discountPercent: 15 },
    { minQty: 25, discountPercent: 15 },
    { minQty: 50, discountPercent: 15 }
  ],
  enableAutoDiscount: true
};

export const INITIAL_PAYMENT_SETTINGS: PaymentSettings = {
  bankName: "",
  accountName: "",
  accountNumber: "",
  bankInstructions: "Business bank details will be provided by P-Kess Fashion World and configured by an administrator before bank-transfer payments are enabled.",
  paystackPublicKey: "",
  paystackSecretKey: "",
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
