# VARAD Healthcare Static Catalog Site (GitHub Pages Ready)

This is a pure static website built with **HTML + CSS + JavaScript** (no backend, no database).

## Pages

- `index.html` - Homepage (hero, featured products, why choose, popular products, FAQ, contact)
- `products.html` - Product listing with category filters + live search
- `product.html` - Product details page (`?slug=...`) with gallery, features, benefits, recommended-for, and enquiry CTA

## Data + Assets

- `assets/js/products-data.js` - Local product data (28 products)
- `assets/js/main.js` - All page logic (filters, detail rendering, WhatsApp CTA, navigation)
- `assets/css/styles.css` - Complete styling
- `images/` - Product images + placeholders

## Run Locally

```bash
python3 -m http.server 5500
```

Then open: `http://localhost:5500`

## Deploy To GitHub Pages

1. Push this folder to your GitHub repository.
2. Go to **Settings -> Pages**.
3. Under **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: **main** (or your default branch)
   - Folder: **/ (root)**
4. Save and wait for deployment.
5. Your site will be live at your GitHub Pages URL.

No build step is required.
