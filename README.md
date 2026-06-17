# GharKaZaika 🫙

> **"Ghar ka swad, aapke darwaze tak"** — Homemade pickles, papads, and chutneys made with love in Karachi, Pakistan.

GharKaZaika is a modern full-stack web application designed for a home-based food business. It has two parts:
1. **A Customer Storefront** where users can browse products, select weight variants (250g / 500g / 1kg) with live price updates, and check out directly via WhatsApp with pre-filled order messages.
2. **A Private Admin Panel** where the business owner can manage products (CRUD + Multer image upload), transition order statuses (Pending, Confirmed, Delivered), and manage inventory levels (with dynamic inline edits and low-stock highlights).

---

## Tech Stack

*   **Frontend:** Vue.js 3 (Composition API), Vue Router (navigation protection), Pinia (state stores), Axios (API client), Tailwind CSS v4 (design system).
*   **Backend:** Node.js, Express.js (REST API, JWT Authentication, Multer file upload).
*   **Database:** MongoDB with Mongoose (with a **transparent local JSON file database fallback** if MongoDB is not running locally).

---

## Project Structure

```
GHARKAKHAZANA/
├── backend/                  # Node.js + Express API
│   ├── data/                 # Local JSON database files (fallback mode)
│   ├── middleware/           # JWT Authentication middleware
│   ├── models/               # Mongoose & mock schemas (User, Product, Order)
│   ├── routes/               # API endpoints (Auth, Products, Orders, Inventory)
│   ├── scripts/              # Database seed script
│   ├── uploads/              # Uploaded product image files
│   ├── .env                  # Environment configurations
│   └── server.js             # Main server entrypoint
├── frontend/                 # Vue.js 3 SPA
│   ├── src/
│   │   ├── assets/           # Static photos (hero, kitchen)
│   │   ├── components/       # UI elements (Navbar, Footer, Floating WhatsApp)
│   │   ├── lib/              # Central brand details & links
│   │   ├── router/           # Navigation setup
│   │   ├── stores/           # Pinia stores (Auth, Products, Orders)
│   │   └── views/            # Screen views (Home, Catalogue, About, Admin Panel)
│   ├── index.html            # Main HTML wrapper
│   └── vite.config.js        # Vite & dev proxy settings
└── package.json              # Root script coordination workspace
```

---

## Setup & Local Run Instructions

### Prerequisites
*   **Node.js** (v18+ recommended)
*   **npm** (comes packaged with Node.js)

### 1. Install Dependencies
In the root directory, run the following command to automatically install packages for both the backend and frontend:
```bash
npm run install:all
```

### 2. Seed the Database
Seed the database with default products, admin credentials, and test orders. 
*Note: If you do not have MongoDB running locally, the seed script will automatically detect this and seed our local JSON-file fallback database under `backend/data/` so you can test immediately!*
```bash
npm run seed
```

### 3. Run the Development Server
Run both the Express backend API (port 5000) and the Vite frontend (port 5173) simultaneously:
```bash
npm run dev
```

*   **Storefront:** Open [http://localhost:5173](http://localhost:5173) in your browser.
*   **Admin Panel:** Access [http://localhost:5173/admin/login](http://localhost:5173/admin/login).

---

## Admin Credentials

The seed script registers the business owner's email with a default password. Use these to log into the Admin panel:
*   **Email:** `katariakirti2003@gmail.com`
*   **Password:** `admin123`

---

## Key Features Built

1.  **WhatsApp Integration:** Checkout buttons construct a pre-filled Urdu/English greeting link targeted at `923352787538` including the exact product name, selected weight, and total price.
2.  **Adaptive Database Engine:** Connects to MongoDB Atlas in production, but falls back seamlessly to a local JSON file-based database if MongoDB is down, preventing local setup friction.
3.  **Dynamic Pricing Picker:** Standard weight variants dropdown updates pricing on the fly in the catalog without reloading.
4.  **Admin Controls:**
    *   **Product Manager:** Edit products, upload images (via Multer), toggle catalog visibility, and delete items.
    *   **Orders Manager:** Manually record custom orders (multi-item selectors) and transition statuses (Pending ➔ Confirmed ➔ Delivered). Placed orders automatically decrement corresponding product stock levels.
    *   **Inventory Manager:** View stock quantities, inline double-click stock updates with instant saves, and highlight low stock warnings (< 5 units).
5.  **Aesthetics:** Earthy colors (Primary Red `#C0392B`, Mustard/Yellow `#F39C12`, Warm light background `#FFF8F0`) with beautiful visual jar motifs and clean Google Fonts (Poppins, Anek Devanagari).
