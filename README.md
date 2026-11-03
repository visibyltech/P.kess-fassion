# P-Kess Fashion World

**Slogan:** Creating Elegance

A Nigerian fashion storefront for P-Kess Fashion World, based at No. 12, DLA Road, off Summit Road, Asaba, Delta State, Nigeria.

## Brand direction

The attached P-Kess logo is the official identity. The storefront uses the logo's metallic gold, magenta, black and white palette.

The product presentation is centred on Nigerian fashion and the designer's own clothing line. Main shopping categories:

- Clothing and native-inspired wear
- T-Shirts
- Shoes and sandals
- Bags and handbags
- Fashion accessories

The current editorial photographs are Nigerian/African fashion reference images sourced from Wikimedia Commons. They are illustrative references only and must not be represented as P-Kess-owned product photography. Replace them with the owner's approved product and model photographs before live selling, and retain the relevant image credits/licence notices.

## Store features

- Responsive homepage, shop and product details
- Category browsing, search, filtering and sorting
- Retail and wholesale price presentation
- Wholesale eligibility and discount settings
- Cart, wishlist and product quick view
- Save to Buy interface
- BNPL information page for planned Credibly integration
- Checkout and Nigerian state/LGA selection
- Customer and admin interface screens
- Order tracking page
- Business contact and legal pages

## Business contact

- Email: pkessvariety@gmail.com
- Phone: 09012776272 / 08103575549
- Address: No. 12, DLA Road, off Summit Road, Asaba, Delta State, Nigeria

## Development

- React
- TypeScript
- Vite
- Tailwind CSS
- Local browser storage for current client-side state

Run locally:

```bash
npm install
npm run dev
```

## Before production launch

This repository currently contains a client-side storefront implementation. It is not yet a production-connected commerce backend. Before accepting real orders or payments, connect and test:

1. A secure authentication service and customer database.
2. Server-side product, inventory, cart, order and savings persistence.
3. Paystack server-side payment initialization, verification and signed webhooks.
4. The approved business bank details and payment evidence workflow.
5. Credibly merchant eligibility and official API integration, if available for this business.
6. Transactional email and order notifications.
7. Secure administrator authentication and role-based access.

Payment credentials and bank account details are intentionally blank; do not add secret keys to frontend code.

Wholesale settings are intended to support a 10-unit minimum and a configurable 10–15% discount. Confirm the final product catalogue, product prices, stock, delivery rates, policies and actual P-Kess product photographs with the business owner before enabling live checkout.
