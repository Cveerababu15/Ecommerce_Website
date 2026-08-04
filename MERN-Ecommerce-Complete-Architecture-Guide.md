# Full-Stack MERN E-Commerce — Complete Architecture Guide

**Project:** Ecommerce-Project (Full-Stack MERN E-Commerce Website)  
**Author reference:** Architecture documentation generated from the live codebase  
**Stack:** React (Vite) · Tailwind CSS · Axios · Node.js · Express.js (MVC) · MongoDB · Mongoose · JWT · RBAC · Razorpay · Cloudinary · Multer

---

## Table of Contents

1. [Phase 1 — System Architecture & File Tree](#phase-1--system-architecture--file-tree)
2. [Phase 2 — Backend Architecture & Data Layer](#phase-2--backend-architecture--data-layer)
3. [Phase 3 — Frontend Architecture & API Integration](#phase-3--frontend-architecture--api-integration)
4. [Phase 4 — End-to-End Data Flow](#phase-4--end-to-end-data-flow)
5. [Environment Variables Reference](#environment-variables-reference)
6. [API Endpoint Reference](#api-endpoint-reference)
7. [Security Checklist](#security-checklist)

---

# Phase 1 — System Architecture & File Tree

## 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENT (React + Vite)                           │
│  Pages → Components → Context (Cart/Theme/Toast) → Axios (api.js)       │
│  React Router: Public | ProtectedRoute | AdminRoute                     │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ HTTPS / JSON
                                │ Authorization: Bearer <JWT>
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      SERVER (Node.js + Express MVC)                       │
│  server.js → Routes → Middleware (auth, admin, multer) → Controllers    │
│                              ↓                                            │
│                         Mongoose Models → MongoDB                         │
└───────────────┬─────────────────────────────┬───────────────────────────┘
                │                             │
                ▼                             ▼
         ┌──────────────┐              ┌──────────────┐
         │ MongoDB Atlas│              │  Cloudinary  │
         └──────────────┘              │  Razorpay    │
                                       └──────────────┘
```

### MVC in a REST API

| Layer | Location | Role |
|-------|----------|------|
| **Model** | `backend/models/` | Schemas, validation, relationships |
| **View** | `frontend/src/` (React) | UI the user sees (no server-side views) |
| **Controller** | `backend/controllers/` | Business logic, HTTP responses |
| **Routes** | `backend/routes/` | URL mapping + middleware chain |

---

## 1.2 Current Repository File Tree

```
Ecommerce-Project/
├── README.md
├── MERN-Ecommerce-Complete-Architecture-Guide.md   ← this file
│
├── backend/
│   ├── .env
│   ├── server.js
│   ├── package.json
│   ├── config/
│   │   ├── db.js
│   │   ├── cloudinary.js
│   │   ├── multer.js
│   │   └── razorpay.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── paymentController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── paymentRoutes.js
│   └── middleware/
│       └── auth.js
│
└── frontend/
    ├── .env.example
    ├── index.html
    ├── vite.config.js
    ├── package.json
    ├── public/
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── services/api.js
        ├── context/
        │   ├── AuthContext.jsx      (empty — session via localStorage today)
        │   ├── CartContext.jsx
        │   ├── ThemeContext.jsx
        │   └── ToastContext.jsx
        ├── utils/
        │   ├── ProtectedRoute.jsx
        │   └── AdminRoute.jsx
        ├── layouts/
        │   ├── MainLayout.jsx
        │   ├── AdminLayout.jsx
        │   └── CartContext.jsx      (duplicate — use src/context only)
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── Hero.jsx
        │   ├── ProductCard.jsx
        │   └── Loader.jsx
        └── pages/
            ├── Auth/     (Login, Register)
            ├── user/     (Home, Products, ProductDetails, Cart, Checkout, Orders)
            └── Admin/    (Dashboard, AddProduct, ManageProducts, ManageOrders)
```

---

## 1.3 Production-Ready Target Tree (recommended additions)

```
backend/
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js      ← centralized 4xx/5xx
│   └── notFound.js          ← 404 handler
├── services/                ← extract heavy logic from controllers
└── utils/asyncHandler.js    ← DRY async try/catch wrapper

frontend/src/
├── hooks/                   ← useAuth, useCart, useProducts
└── context/AuthContext.jsx  ← mount in main.jsx
```

---

## 1.4 Frontend Route Zones

| Zone | Paths | Guard | Layout |
|------|-------|-------|--------|
| **Public** | `/`, `/login`, `/register`, `/products`, `/product/:id` | None | MainLayout |
| **Protected** | `/cart`, `/orders`, `/checkout` | ProtectedRoute | MainLayout |
| **Admin** | `/admin`, `/admin/add-product`, `/admin/products`, `/admin/orders` | AdminRoute | AdminLayout |

**Provider nesting (App.jsx):**  
`ThemeProvider` → `CartProvider` → `ToastProvider` → `BrowserRouter`

---

# Phase 2 — Backend Architecture & Data Layer

## 2.1 Mongoose Schemas (current + recommended enhancements)

### User Model (`backend/models/User.js`)

**Current:**

```javascript
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, "Password is required"] },
    role: { type: String, default: "user" },  // "user" | "admin"
});
module.exports = mongoose.model("User", UserSchema);
```

**Recommended enhancements:**

```javascript
role: {
  type: String,
  enum: ["user", "admin"],
  default: "user",
  index: true,
},
// UserSchema.index({ email: 1 }); // unique: true already creates index
```

---

### Category Model (`backend/models/Category.js`)

**Current:**

```javascript
const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    subcategories: [String]
});
module.exports = mongoose.model("Category", CategorySchema);
```

**Recommended:** `CategorySchema.index({ name: 1 }, { unique: true });`

---

### Product Model (`backend/models/Product.js`)

**Current fields:** name, price, image, category, subcategory, description, sizes[], gender

**Recommended indexes for catalog queries:**

```javascript
ProductSchema.index({ category: 1, subcategory: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ name: "text", description: "text" }); // optional full-text
```

---

### Cart Model (`backend/models/Cart.js`)

**Relationship:** One cart per user (`userId` → User), line items reference Product.

```javascript
const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1, min: 1 },
        size: { type: String, default: null }
    }]
});
// CartSchema.index({ userId: 1 }, { unique: true });
```

---

### Order Model (`backend/models/Order.js`)

**Relationships:** userId → User; products[].productId → Product  
**Payment fields:** razorpayOrderId, isPaid  
**Status enum:** Pending → Processing → Shipped → Out for Delivery → Delivered | Cancelled

```javascript
// Recommended indexes
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
```

---

## 2.2 Entity Relationship Diagram

```
┌──────────┐       1:1        ┌──────────┐
│   User   │─────────────────│   Cart   │
└────┬─────┘                  └────┬─────┘
     │ 1:N                         │ N (embedded lines)
     ▼                             ▼
┌──────────┐                  ┌──────────┐
│  Order   │──products[]─────▶│ Product  │
└──────────┘                  └──────────┘
     │
     │ references
     ▼
┌──────────┐
│ Category │  (standalone; products use string category/subcategory)
└──────────┘
```

---

## 2.3 Authentication & Authorization Middleware

**File:** `backend/middleware/auth.js`

### `auth` — JWT verification

1. Read `Authorization` header.
2. Strip `Bearer ` prefix if present.
3. `jwt.verify(token, process.env.JWT_SECRET)`.
4. Attach payload to `req.user` → `{ id, role }`.
5. On failure → `401 Unauthorized` or `Invalid token`.

```javascript
const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

exports.admin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin only" });
    }
    next();
};
```

### JWT payload (issued in authController)

```javascript
jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

### RBAC matrix

| Action | Middleware chain |
|--------|------------------|
| Register / Login | None |
| List products / categories | None |
| Add to cart / get cart | `auth` |
| Create order / user orders | `auth` |
| Payment create / verify | `auth` |
| Create product / category | `auth`, `admin` |
| Delete product | `auth`, `admin` |
| All orders / update status | `auth` (admin check in controller recommended) |

---

## 2.4 Auth Controller (`backend/controllers/authController.js`)

### Register flow

1. Validate `name`, `email`, `password`.
2. Normalize email (`toLowerCase`, `trim`).
3. Check duplicate → `400 User already exists`.
4. `bcrypt.hash(password, 10)`.
5. **RBAC guard:** `role === "admin"` only if `ALLOW_ADMIN_REGISTER=true`, else force `"user"`.
6. `User.create(...)`.
7. Sign JWT, return `{ success, token, user }`.

### Login flow

1. Validate email + password.
2. Find user → compare with `bcrypt.compare`.
3. Sign JWT, return token + safe user object (no password).

---

## 2.5 Product Controller Highlights

**File:** `backend/controllers/productController.js`

| Method | Endpoint | Features |
|--------|----------|----------|
| `addProduct` | POST `/api/products/create` | Multer `image` → Cloudinary path; sizes JSON parse; gender Men/Women |
| `getProducts` | GET `/api/products` | Search, category, subcategory, price range, gender, size, pagination |
| `deleteProduct` | DELETE `/api/products/:id` | `findByIdAndDelete` |

**Multer + Cloudinary** (`backend/config/multer.js`):

```javascript
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary.js");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "uploads",
        allowed_formats: ["jpg", "png", "jpeg", "gif", "webp"]
    }
});
const upload = multer({ storage });
module.exports = upload;
```

**Route wiring:**

```javascript
router.post("/create", auth, admin, upload.single("image"), addProduct);
router.get("/", getProducts);
router.delete("/:id", auth, admin, deleteProduct);
```

---

## 2.6 Cart Controller Highlights

**File:** `backend/controllers/cartController.js`

- Validates product exists and size rules (if product has sizes, size required and must match).
- One cart document per `userId`.
- Merges line items by `productId + size`.
- `getCart` uses `.populate("products.productId", "name price image sizes gender")`.

---

## 2.7 Order Controller Highlights

**File:** `backend/controllers/orderController.js`

| Method | Behavior |
|--------|----------|
| `createOrder` | Reads cart → sums prices → creates Order → clears cart |
| `getUserOrders` | Filter by `req.user.id`, populate products |
| `getAllOrders` | All orders (admin UI) |
| `updateOrderStatus` | `{ orderId, status }` body |

---

## 2.8 Payment Controller (Razorpay)

**File:** `backend/controllers/paymentController.js`

1. **createpayment:** `amount * 100` paise → `razorpay.orders.create()`.
2. **verifyPayment:** Sets `order.isPaid = true`, `status = "Processing"`.

**Config** (`backend/config/razorpay.js`):

```javascript
const Razorpay = require("razorpay");
const razorpay = new Razorpay({
    key_id: process.env.razorpay_key_id,
    key_secret: process.env.razorpay_key_secret
});
module.exports = razorpay;
```

---

## 2.9 Server Entry Point (`backend/server.js`)

**Current responsibilities:**

- `dotenv.config()`
- `connectDB()` via `MONGO_URL`
- CORS with `CORS_ORIGINS` comma list, `credentials: true`
- `express.json()`
- Route mounts under `/api/*`

**Recommended additions (append before `app.listen`):**

```javascript
// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
```

**Optional security headers:** use `helmet` package.

---

## 2.10 Database Connection (`backend/config/db.js`)

```javascript
await mongoose.connect(process.env.MONGO_URL);
```

> Note: README mentions `MONGODB_URI`; your code uses `MONGO_URL`. Keep `.env` consistent with `db.js`.

---

# Phase 3 — Frontend Architecture & API Integration

## 3.1 Application Bootstrap

**`frontend/src/main.jsx`**

```javascript
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

**Recommended:** wrap `<App />` with `AuthProvider` when AuthContext is implemented.

---

## 3.2 Routing (`frontend/src/App.jsx`)

```javascript
// Public
<Route path="/" element={<MainLayout><Home /></MainLayout>} />
<Route path="/login" element={<MainLayout><Login /></MainLayout>} />
<Route path="/products" element={<MainLayout><Products /></MainLayout>} />
<Route path="/product/:id" element={<MainLayout><ProductDetails /></MainLayout>} />

// Protected
<Route path="/cart" element={
  <ProtectedRoute><MainLayout><Cart /></MainLayout></ProtectedRoute>
} />

// Admin
<Route path="/admin" element={
  <AdminRoute><AdminLayout><Dashboard /></AdminLayout></AdminRoute>
} />
```

---

## 3.3 Route Guards

### ProtectedRoute (`frontend/src/utils/ProtectedRoute.jsx`)

```javascript
const token = localStorage.getItem("token");
if (!token) return <Navigate to="/login" />;
return children;
```

### AdminRoute (`frontend/src/utils/AdminRoute.jsx`)

```javascript
const token = localStorage.getItem("token");
if (!token) return <Navigate to="/login" />;
const role = (localStorage.getItem("role") || "").toLowerCase().trim();
if (role !== "admin") return <Navigate to="/" />;
return children;
```

> **Important:** UI guards are not security. The API must always enforce `auth` + `admin` middleware.

---

## 3.4 Axios Configuration (`frontend/src/services/api.js`)

```javascript
const API = axios.create({
  baseURL: API_ORIGIN ? `${API_ORIGIN}/api` : "http://localhost:5000/api",
});

// Request interceptor — attach JWT
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});
```

### Recommended response interceptor

```javascript
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

### API modules exported

| Module | Methods |
|--------|---------|
| `authAPI` | login, register |
| `productAPI` | getAll, getAllAdmin, create, delete |
| `cartAPI` | getCart, addToCart |
| `orderAPI` | create, getAll, getUserOrders, updateStatus |
| `paymentAPI` | create, verify |
| `categoryAPI` | getAll |

---

## 3.5 Authentication State (current pattern)

**Login.jsx** stores session client-side:

```javascript
localStorage.setItem("token", res.data.token);
localStorage.setItem("role", res.data.user?.role || "user");
// Redirect: admin → /admin, user → /products
```

`AuthContext.jsx` exists but is **empty** — session is decentralized across pages + localStorage.

### Recommended AuthContext (reference implementation)

```javascript
import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) setUser({ role });
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const res = await authAPI.login(credentials);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.user.role);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

---

## 3.6 Global Context Providers

### CartContext

- State: `cartCount`
- `fetchCartCount()` calls `cartAPI.getCart()` when token exists
- Exposed via `useCart()` hook

### ThemeContext

- Persists `light` / `dark` in localStorage
- Toggles `document.documentElement` class

### ToastContext

- `success(msg)` / `error(msg)` with Framer Motion toasts
- Used in Login, Checkout, Admin pages

---

## 3.7 Layouts

| Layout | Used for | Contains |
|--------|----------|----------|
| `MainLayout` | Customer-facing pages | Navbar, Footer, outlet children |
| `AdminLayout` | Admin dashboard pages | Admin sidebar/nav, outlet children |

---

# Phase 4 — End-to-End Data Flow

## 4.1 User Login (full journey)

```
[UI] Login form submit
  ↓
[Axios] POST /api/auth/login  { email, password }
  ↓
[Express] authRoutes → authController.login
  ↓
[MongoDB] User.findOne({ email })
  ↓
[bcrypt] compare password
  ↓
[jwt.sign] { id, role } → token
  ↓
[Response] { success, token, user }
  ↓
[Client] localStorage.setItem("token"), setItem("role")
  ↓
[Router] navigate("/admin") or navigate("/products")
```

---

## 4.2 Add to Cart (authenticated)

```
[UI] "Add to Cart" on ProductDetails
  ↓
[Axios] POST /api/cart/addtocart
        Headers: Authorization: Bearer <token>
        Body: { productId, quantity, size? }
  ↓
[Middleware] auth → req.user.id
  ↓
[Controller] cartController.addToCart
  - Validate product + size rules
  - Find or create Cart for userId
  - Merge or push line item
  - cart.save()
  ↓
[MongoDB] Cart collection updated
  ↓
[Response] { success, cart }
  ↓
[Client] CartContext.fetchCartCount() → Navbar badge updates
```

---

## 4.3 Checkout & Payment

```
[UI] Checkout page
  ↓
[1] POST /api/orders/create  (auth)
      → create Order from cart, clear cart
  ↓
[2] POST /api/payment/create  (auth)  { amount }
      → Razorpay order created (paise)
  ↓
[UI] Razorpay checkout widget (frontend SDK)
  ↓
[3] POST /api/payment/verify  (auth)  { orderId }
      → Order.isPaid = true, status = Processing
  ↓
[UI] Toast success, redirect to /orders
```

---

## 4.4 Admin Add Product (with image upload)

```
[UI] AddProduct form (multipart/form-data)
  ↓
[Axios] POST /api/products/create
        Fields: name, price, category, subcategory, description, sizes, gender
        File: image
  ↓
[Middleware] auth → admin → multer.single("image")
  ↓
[Multer] CloudinaryStorage uploads to folder "uploads"
  ↓
[Controller] productController.addProduct
        image: req.file.path
  ↓
[MongoDB] Product.create(...)
  ↓
[Response] { message, product }
  ↓
[UI] Admin product list refresh
```

---

## 4.5 Request lifecycle diagram (generic)

```
Browser Action
    → React Event Handler
    → api.js (interceptor adds JWT)
    → HTTP Request
    → Express CORS + JSON parser
    → Route matcher
    → Middleware chain (auth / admin / multer)
    → Controller (try/catch)
    → Mongoose Model (query/save)
    → MongoDB
    ← JSON Response
    ← Axios response
    → setState / Context update
    → UI re-render
```

---

# Environment Variables Reference

## Backend (`backend/.env`)

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_strong_secret_key
CORS_ORIGINS=http://localhost:5173,https://your-frontend-domain.com

# Optional: allow admin registration from API
ALLOW_ADMIN_REGISTER=false

# Razorpay
razorpay_key_id=your_key_id
razorpay_key_secret=your_key_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
```

Copy from `frontend/.env.example` for local development.

---

# API Endpoint Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Create user + JWT |
| POST | `/api/auth/login` | Public | Login + JWT |
| POST | `/api/categories/create` | Admin | Create category |
| GET | `/api/categories/get` | Public | List categories |
| POST | `/api/products/create` | Admin | Add product + image |
| GET | `/api/products` | Public | List/filter/paginate products |
| DELETE | `/api/products/:id` | Admin | Delete product |
| POST | `/api/cart/addtocart` | User | Add/update cart line |
| GET | `/api/cart/getcart` | User | Get cart with populated products |
| POST | `/api/orders/create` | User | Create order from cart |
| GET | `/api/orders/user-orders` | User | User's order history |
| GET | `/api/orders/all-orders` | User* | All orders (admin UI) |
| PUT | `/api/orders/update-status` | User* | Update order status |
| POST | `/api/payment/create` | User | Create Razorpay order |
| POST | `/api/payment/verify` | User | Mark order paid |

\*Recommend adding `admin` middleware on admin-only order routes.

---

# Security Checklist

| Item | Status in project | Recommendation |
|------|-------------------|----------------|
| Password hashing (bcrypt) | ✅ | Keep salt rounds ≥ 10 |
| JWT expiry | ✅ 7 days | Consider shorter + refresh token |
| Admin self-registration blocked | ✅ `ALLOW_ADMIN_REGISTER` | Keep `false` in production |
| API RBAC on mutations | ✅ `admin` middleware | Add to `all-orders` routes |
| CORS allowlist | ✅ `CORS_ORIGINS` | Set explicitly in production |
| Token in localStorage | ⚠️ Current | Consider HttpOnly cookies for XSS resistance |
| Payment signature verify | ⚠️ Basic | Verify Razorpay `signature` server-side |
| Rate limiting | ❌ | Add `express-rate-limit` on `/auth` |
| Helmet security headers | ❌ | Add `helmet` middleware |
| Input validation | Partial | Add `express-validator` or Zod |

---

# HttpOnly Cookie Alternative (optional hardening)

**Backend (login response):**

```javascript
res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

**Axios:**

```javascript
const API = axios.create({
  baseURL: "...",
  withCredentials: true,
});
```

**CORS:** already has `credentials: true` in `server.js`.

Remove `localStorage` token storage when using cookies; read user role from `/api/auth/me` endpoint instead.

---

# Quick Start Commands

```bash
# Backend
cd backend
npm install
# create .env with variables above
npm run dev

# Frontend (new terminal)
cd frontend
npm install
# create .env with VITE_API_URL
npm run dev
```

Open: **http://localhost:5173**

---

# Document Info

- **Generated from:** Ecommerce-Project codebase snapshot
- **File location:** `MERN-Ecommerce-Complete-Architecture-Guide.md` (project root)
- **Phases covered:** 1 (Architecture), 2 (Backend), 3 (Frontend), 4 (Data Flow)
- **Download:** Right-click this file in your IDE → Save / copy to your machine, or open in browser via file path

---

*End of guide.*
