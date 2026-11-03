# P-Kess Fashion World — Official Luxury E-Commerce Platform

> **"Creating Elegance"**  
> Luxury Haute Couture, Swiss Lace Boubous, Designer Footwear, Italian Leather Bags, 24K Gold Jewelry, Wholesale Hub, Save to Buy, and Buy Now Pay Later.

---

## 🏛️ Official Brand Identity
- **Business Name:** P-Kess Fashion World
- **Slogan:** Creating Elegance
- **Flagship Showroom & Atelier:** No. 12, DLA Road, off Summit Road, Asaba, Delta State, Nigeria
- **Email:** `pkessvariety@gmail.com`
- **Phone Lines:** `09012776272` / `08103575549`
- **Official Brand Colors:** Metallic Gold (`#D4AF37`, `#ECC260`), Rich Magenta (`#E6007A`, `#FF2A85`), Obsidian Black (`#08080A`, `#111116`), Crisp White (`#FFFFFF`).
- **Currency:** Nigerian Naira (₦)

---

## 🚀 Key Features Implemented

1. **Official Brand Logo Badge**:
   - The official circular P-Kess emblem (gold letter *P*, crown, high heel, bags, mannequin, and magenta ribbons) is seamlessly integrated into the navigation, footer, modals, customer portal, and invoice printouts.

2. **Full-Featured Product Catalogue**:
   - 4 Core Categories: Clothing, Shoes, Bags, Accessories.
   - Dual pricing architecture (Individual Retail vs Wholesale Bulk Price).
   - Dynamic search, category pills, price range filtering, and multiple sorting algorithms.
   - Quick-view modal with high-resolution image zoom and instant specifications.

3. **Wholesale System (10+ Units)**:
   - Configurable minimum eligibility (default 10 units).
   - Automated discount calculations (15% to 22%).
   - Interactive Wholesale Savings Simulator.
   - Mixed-product and mixed-size cart calculations.

4. **Save to Buy (Customer Installment Savings System)**:
   - Plan configurator: 1 to 3 months duration.
   - Flexible contribution frequencies: Daily, Weekly, Biweekly, or Monthly.
   - Automated installment breakdown with initial commitment deposit.
   - Customer savings dashboard with progress bar, payment history, and one-click transition to free delivery upon completion.
   - Admin verification workflow for deposit slips and receipts.

5. **Buy Now Pay Later (Credibly)**:
   - Transparent, regulatory-compliant integration.
   - Explains the underwriting status of Credibly for Nigerian commerce.
   - Pre-qualification assessment form that logs application records as *under review* without falsely marking unapproved credit as approved.

6. **Nigerian Checkout & Logistics Architecture**:
   - Full support for all 36 Nigerian States + FCT with accurate Local Government Areas (LGAs).
   - Doorstep Delivery rates calibrated by state zone.
   - Free Store Pickup at the Asaba Showroom (No. 12, DLA Road).
   - Paystack checkout simulation + Manual Bank Transfer with account copy button, order reference generation, and proof-of-payment upload.

7. **Live Order Tracking**:
   - 5-stage visual progress timeline: Order Placed → Payment Confirmed → Atelier Packing → In Transit → Delivered.
   - Logistics courier assignments (GIG Logistics, Speedaf, DHL) and tracking numbers.

8. **Customer & Admin Dashboards**:
   - Customer Dashboard: Overview, Order History, Wishlist, Active Save to Buy plans, Saved Delivery Addresses, Password & Profile.
   - Admin Control Panel: Executive KPIs, Catalogue CRUD (Add, Edit, Delete, Stock), Payment Approvals with Receipt Image Inspector, Wholesale Rules Configurator, Paystack & Bank Account Manager.

---

## 🛠️ Quick Local Setup

```bash
# 1. Clone repository
git clone https://github.com/your-username/pkess-fashion-world.git
cd pkess-fashion-world

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The app will run at `http://localhost:3000`.

---

## 💳 Payment Gateway Setup (Paystack)
1. Register or log into [Paystack](https://dashboard.paystack.com).
2. Retrieve your `Public Key` and `Secret Key` from **Settings → API Keys & Webhooks**.
3. In the Admin Dashboard (`/admin` → **Payment Gateways & Bank** tab), input your keys and toggle **Live Mode** when ready.

---

## 📦 Deployment to Vercel
1. Push your repository to GitHub.
2. In Vercel, click **Add New Project** and import your repository.
3. Framework Preset: **Vite**.
4. Set the Build Command: `npm run build` and Output Directory: `dist`.
5. Add any required environment variables from `.env.example`.
6. Click **Deploy**.
