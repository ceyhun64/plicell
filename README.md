# 🪟 ModaPerde — Curtains & Window Coverings E-Commerce Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.0.10-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6.19.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)

**A modern full-stack e-commerce platform for premium curtains, blinds, and window covering solutions**

[Features](#-features) • [Tech Stack](#️-technology-stack) • [Installation](#-installation) • [API](#-api-endpoints) • [Database](#️-database-schema) • [Deployment](#-deployment)

</div>

---

## 📋 About the Project

**ModaPerde** is a feature-complete e-commerce platform specializing in curtains and window coverings — from sheer voile curtains and zebra blinds to plicell honeycomb shades, wooden slat blinds, roller shutters, and decorative accessories. The platform is built for Turkish consumers and businesses, offering custom measurement support, iyzico payment integration, and a comprehensive admin management panel.

The platform handles the full shopping lifecycle: product discovery with category and filter navigation, custom-sized orders with width/height/m² calculation, multi-step checkout, order tracking, and customer reviews — all within a Next.js App Router application backed by MySQL via Prisma.

---

## ✨ Features

### 🛍️ Customer Features

- **Product Catalog** — Browse by 10+ categories: Plicell, Zebra, Roller (including Laser Cut), Wooden Blinds, Metal Blinds, Sheer Curtains, Vertical Blinds, Rustic Curtains, Drapes, and Accessories
- **Custom Measurement Tool** — Width × Height input with automatic square meter calculation, measurement guide images, and a measurement modal per product
- **Profile Selector** — Choose from multiple frame/profile color options (Anthracite, White, Grey, Brown, Cream, Black)
- **Product Detail Pages** — Multi-image galleries with zoom (react-medium-image-zoom), variant selection, product descriptions, and customer reviews
- **Recommended Products** — Related product suggestions on detail pages
- **Advanced Search** — Full-text product search with results page
- **Filter & Sort** — Category filters, price sorting, and mobile-friendly filter drawer
- **Shopping Cart** — Persistent cart with quantity management, variant tracking, and real-time totals
- **Wishlist / Favorites** — Save products across sessions
- **Multi-Step Checkout** — Address selection → Payment, guided by a stepper component
- **Secure Payment** — iyzico payment gateway with installment options
- **Order Tracking** — Order history and status in user profile
- **User Profile** — Personal info, saved addresses (with district/neighborhood lookup), and order management
- **Password Recovery** — Forgot password and reset-password flow via Nodemailer
- **Newsletter Subscription** — Email signup for campaigns
- **Blog** — Interior design tips and product guides
- **FAQ Page** — Common questions and answers
- **Institutional Pages** — About, why us, measurement guide, bank accounts, documents
- **Legal Pages** — KVKK, distance sale agreement, personal data policy, payment options
- **Contact Page** — Inquiry form with email delivery
- **Responsive Design** — Mobile-first layout with mobile nav sheet and mobile filter drawer
- **Social Sidebar** — Persistent links (WhatsApp, Instagram, Facebook, phone)

### 🔧 Admin Features

- **Admin Dashboard** — Sales analytics, order volume, and revenue graphs (Recharts)
- **Product Management** — Add, edit, and delete products with image upload, category/room assignment, and measurement support
- **Order Management** — Full order list with detail dialog and status updates
- **User Management** — List all users, view roles, manage accounts
- **Blog Management** — Create (add), edit (update), and delete blog posts with Cloudinary image upload
- **Banner Management** — Create and manage homepage promotional banners
- **Subscriber Management** — View and manage newsletter subscribers
- **Protected Routes** — Admin panel locked behind session authentication

### ⚙️ Technical Features

- **Next.js App Router** — SSR, SSG, ISR, and API routes in a single unified framework
- **Prisma ORM + MySQL** — Type-safe relational database access with full migration history
- **NextAuth.js** — Email/password authentication with session management
- **Location API** — Dynamic district (`ilçe`) and neighborhood (`mahalle`) lookup from `city.json`
- **Cloudinary + next-cloudinary** — Optimized image upload and CDN delivery
- **Framer Motion** — Smooth page transitions and UI animations
- **SEO** — Open Graph meta tags, `og-image.webp`, and structured page titles

---

## 🛠️ Technology Stack

### Frontend

| Technology              | Version  | Description                               |
| ----------------------- | -------- | ----------------------------------------- |
| Next.js                 | 16.0.10  | App Router, SSR/SSG, API Routes           |
| React                   | 19.2.0   | Component-based UI                        |
| TypeScript              | 5        | Type-safe development                     |
| Tailwind CSS            | 4        | Utility-first styling                     |
| Radix UI                | 1.x      | Accessible UI primitives (20+ components) |
| Framer Motion           | 12.23.24 | Animations and transitions                |
| Lucide React            | 0.553.0  | Icon library                              |
| Embla Carousel          | 8.6.0    | Product image carousel                    |
| react-medium-image-zoom | 5.4.0    | Product image zoom on detail pages        |
| React Hook Form         | 7.66.0   | Form state management                     |
| Zod                     | 4.1.12   | Schema validation                         |
| Recharts                | 2.15.4   | Admin analytics charts                    |
| Sonner                  | 2.0.7    | Toast notifications                       |
| date-fns                | 4.1.0    | Date formatting                           |
| next-themes             | 0.4.6    | Theme management                          |

### Backend & Database

| Technology      | Version | Description                                        |
| --------------- | ------- | -------------------------------------------------- |
| Prisma          | 6.19.0  | ORM & database migrations                          |
| MySQL           | 8.0     | Relational database                                |
| mysql2          | 3.15.3  | MySQL driver                                       |
| NextAuth.js     | 4.24.13 | Authentication & session management                |
| bcrypt          | 6.0.0   | Password hashing                                   |
| Nodemailer      | 7.0.10  | Transactional email (contact form, password reset) |
| Cloudinary      | 2.8.0   | Image upload & CDN                                 |
| next-cloudinary | 6.17.5  | Next.js Cloudinary integration                     |
| iyzipay         | 2.0.64  | iyzico payment gateway SDK                         |

### Infrastructure

| Technology    | Description                                  |
| ------------- | -------------------------------------------- |
| Vercel        | Frontend deployment (recommended)            |
| Cloudinary    | CDN & image optimization                     |
| MySQL (cloud) | Managed DB (PlanetScale / Railway / AWS RDS) |

---

## 🏗️ Architecture Overview

```
Browser / Client
       │
       ▼
  Next.js 16 (App Router)
  ┌────────────────────────────────────────────────┐
  │  Public Pages                                  │
  │  ├── / (Homepage)                              │
  │  ├── /products/[id] (Product Detail)           │
  │  ├── /products/[category] (Category Listing)   │
  │  │   └── /products/roller/laser-cut            │
  │  ├── /cart, /checkout, /favorites              │
  │  ├── /profile (orders, addresses)              │
  │  ├── /blog & /blog/[id]                        │
  │  ├── /search, /faq, /contact, /about           │
  │  ├── /institutional/* (about, why, measure...) │
  │  ├── /info/* (advantage, measure, terms, why)  │
  │  └── /contracts/* (kvkk, distance_sale...)     │
  │                                                │
  │  Auth Pages                                    │
  │  ├── /login, /register                         │
  │  ├── /forgot-password, /reset-password         │
  │                                                │
  │  Admin Pages (/admin/*)                        │
  │  ├── dashboard, products, orders               │
  │  ├── blogs, banner, users, subscribers         │
  │                                                │
  │  API Routes (/api/*)                           │
  │  ├── auth, account, products, cart             │
  │  ├── order, payment, review, favorites         │
  │  ├── blog, banner, address, subscribe          │
  │  ├── upload, send-mail, user, location         │
  └────────────────────────────────────────────────┘
         │                      │
         ▼                      ▼
       MySQL               Cloudinary
    (via Prisma)            (Images/CDN)
         │
      iyzico            Nodemailer
    (Payments)     (Email: contact + reset)
```

---

## 📁 Project Structure

```
ModaPerde/
├── app/
│   ├── page.tsx                              # Homepage
│   ├── layout.tsx                            # Root layout
│   ├── not-found.tsx                         # 404 page
│   ├── globals.css
│   │
│   ├── login/page.tsx                        # Login page
│   ├── register/page.tsx                     # Registration page
│   ├── forgot-password/page.tsx              # Forgot password
│   ├── reset-password/page.tsx               # Reset password
│   ├── about/page.tsx                        # About page
│   ├── contact/page.tsx                      # Contact form
│   ├── faq/page.tsx                          # FAQ page
│   ├── search/page.tsx                       # Search results
│   ├── cart/page.tsx                         # Shopping cart
│   ├── favorites/page.tsx                    # Wishlist
│   ├── blog/
│   │   ├── page.tsx                          # Blog listing
│   │   └── [id]/page.tsx                     # Blog detail
│   │
│   ├── products/
│   │   ├── page.tsx                          # All products
│   │   ├── [id]/page.tsx                     # Product detail
│   │   ├── accessories/page.tsx
│   │   ├── drapes/page.tsx
│   │   ├── metal/page.tsx
│   │   ├── plicell/page.tsx
│   │   ├── roller/
│   │   │   ├── page.tsx                      # Roller blinds
│   │   │   └── laser-cut/page.tsx            # Laser cut roller (sub-category)
│   │   ├── rustic/page.tsx
│   │   ├── sheer/page.tsx
│   │   ├── vertical/page.tsx
│   │   ├── wooden/page.tsx
│   │   └── zebra/page.tsx
│   │
│   ├── checkout/
│   │   ├── page.tsx                          # Multi-step checkout
│   │   ├── success/page.tsx                  # Payment success
│   │   └── unsuccess/page.tsx                # Payment failure
│   │
│   ├── profile/
│   │   ├── page.tsx                          # Profile overview
│   │   ├── orders/page.tsx                   # Order history
│   │   └── addresses/page.tsx                # Saved addresses
│   │
│   ├── institutional/
│   │   ├── about/page.tsx
│   │   ├── bank_accounts/page.tsx
│   │   ├── documents/page.tsx
│   │   ├── measurement/page.tsx
│   │   └── why_us/page.tsx
│   │
│   ├── info/
│   │   ├── advantage/page.tsx
│   │   ├── measure/page.tsx
│   │   ├── terms/page.tsx
│   │   └── why/page.tsx
│   │
│   ├── contracts/
│   │   ├── kvkk/page.tsx
│   │   ├── distance_sale/page.tsx
│   │   ├── personal_data/page.tsx
│   │   └── payment_options/page.tsx
│   │
│   ├── admin/
│   │   ├── page.tsx                          # Admin login
│   │   ├── dashboard/page.tsx                # Analytics dashboard
│   │   ├── products/page.tsx                 # Product management
│   │   ├── orders/page.tsx                   # Order management
│   │   ├── blogs/page.tsx                    # Blog management
│   │   ├── banner/page.tsx                   # Banner management
│   │   ├── users/page.tsx                    # User management
│   │   └── subscribers/page.tsx              # Subscriber management
│   │
│   └── api/
│       ├── auth/[...nextauth]/               # NextAuth handler
│       ├── auth/logout/                      # Session destroy
│       ├── account/check/                   # Email existence check
│       ├── account/register/                # User registration
│       ├── account/forgot_password/         # Send reset email
│       ├── account/reset_password/          # Apply password reset
│       ├── products/                         # Product CRUD + listing
│       ├── products/[id]/                    # Single product
│       ├── products/category/[categoryId]/  # Filter by category
│       ├── cart/                             # Cart management
│       ├── cart/[id]/                        # Cart item operations
│       ├── order/                            # Order creation
│       ├── order/user/                       # User order list
│       ├── payment/                          # iyzico payment
│       ├── review/                           # Product reviews
│       ├── review/[id]/
│       ├── favorites/                        # Wishlist
│       ├── favorites/[id]/
│       ├── blog/                             # Blog CRUD
│       ├── blog/[id]/
│       ├── banner/                           # Banner management
│       ├── banner/[id]/
│       ├── address/                          # User addresses
│       ├── address/[id]/
│       ├── user/                             # Current user profile
│       ├── user/all/                         # Admin user list
│       ├── user/all/[id]/
│       ├── subscribe/                        # Newsletter subscriptions
│       ├── subscribe/[id]/
│       ├── upload/                           # Cloudinary upload
│       ├── send-mail/                        # Contact form email
│       └── location/
│           ├── ilceler/[ilId]/               # Districts by province
│           └── mahalleler/[ilceId]/          # Neighborhoods by district
│
├── components/
│   ├── layout/
│   │   ├── ClientLayoutWrapper.tsx           # Client boundary wrapper
│   │   ├── navbar.tsx                        # Navigation bar
│   │   ├── topbar.tsx                        # Top announcement bar
│   │   ├── footer.tsx                        # Site footer
│   │   ├── mobileNavSheet.tsx                # Mobile navigation drawer
│   │   ├── cartDropdown.tsx                  # Navbar cart dropdown
│   │   ├── cartItem.tsx                      # Cart item in dropdown
│   │   ├── collectionMegaMenu.tsx            # Category mega menu
│   │   ├── userMegaMenu.tsx                  # User account mega menu
│   │   ├── pagination.tsx                    # Shared pagination
│   │   ├── scrollToTop.tsx                   # Scroll-to-top button
│   │   ├── socialSidebar.tsx                 # Social media sidebar
│   │   ├── testimonial.tsx                   # Customer testimonials
│   │   ├── contact.tsx                       # Contact section
│   │   ├── faq.tsx                           # FAQ section
│   │   └── unauthorized.tsx                  # Access denied page
│   │
│   ├── modules/
│   │   ├── admin/
│   │   │   ├── login/login.tsx
│   │   │   ├── sideBar.tsx
│   │   │   ├── dashboard/dashboard.tsx
│   │   │   ├── products/                     # Product table + dialog
│   │   │   ├── orders/                       # Orders table + detail dialog
│   │   │   ├── blogs/                        # Blog list, add, update
│   │   │   ├── banner/banner.tsx
│   │   │   ├── users/users.tsx
│   │   │   └── subscribers/subscribers.tsx
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   ├── forgot-password.tsx
│   │   │   └── reset-password.tsx
│   │   ├── blog/
│   │   │   ├── blog.tsx
│   │   │   └── blogDetail.tsx
│   │   ├── cart/
│   │   │   ├── cart.tsx
│   │   │   ├── cartItem.tsx
│   │   │   └── cartSummary.tsx
│   │   ├── checkout/
│   │   │   ├── checkout.tsx                  # Stepper controller
│   │   │   ├── paymentStepper.tsx            # Step progress indicator
│   │   │   ├── stepAddress.tsx               # Address step
│   │   │   ├── stepPayment.tsx               # iyzico payment step
│   │   │   ├── cartSummary.tsx               # Order summary sidebar
│   │   │   ├── success.tsx
│   │   │   └── unsuccess.tsx
│   │   ├── contracts/
│   │   │   ├── kvkk.tsx
│   │   │   ├── distanceSale.tsx
│   │   │   ├── personalData.tsx
│   │   │   └── paymentOptions.tsx
│   │   ├── favorites/
│   │   │   ├── favorites.tsx
│   │   │   └── productCard.tsx
│   │   ├── home/
│   │   │   ├── carousel.tsx                  # Hero carousel
│   │   │   ├── banner.tsx                    # Promotional banner
│   │   │   ├── categories.tsx                # Category grid
│   │   │   ├── products.tsx                  # Featured products
│   │   │   ├── newArrivals.tsx               # New arrivals section
│   │   │   ├── measurement.tsx               # Measurement guide CTA
│   │   │   ├── services.tsx                  # Services section
│   │   │   └── subscribe.tsx                 # Newsletter signup
│   │   ├── info/
│   │   │   ├── advantage.tsx
│   │   │   ├── measure.tsx
│   │   │   ├── termsCondition.tsx
│   │   │   └── why.tsx
│   │   ├── institutional/
│   │   │   ├── about.tsx
│   │   │   ├── bank_accounts.tsx
│   │   │   ├── documents.tsx
│   │   │   ├── measurement.tsx
│   │   │   └── why_us.tsx
│   │   ├── products/
│   │   │   ├── allProducts.tsx               # All products listing
│   │   │   ├── productCard.tsx               # Product card component
│   │   │   ├── productDetail.tsx             # Full product detail
│   │   │   ├── productDetailSkeleton.tsx     # Loading skeleton
│   │   │   ├── productSkeleton.tsx
│   │   │   ├── productTopbar.tsx             # Sort & view controls
│   │   │   ├── filter.tsx                    # Desktop filter panel
│   │   │   ├── mobileFilter.tsx              # Mobile filter drawer
│   │   │   ├── measureModal.tsx              # Measurement input modal
│   │   │   ├── profileModal.tsx              # Profile/color selector modal
│   │   │   ├── descriptionAndReview.tsx      # Tabs: description + reviews
│   │   │   ├── recommended.tsx               # Recommended products
│   │   │   ├── category/                     # Per-category listing components
│   │   │   │   ├── plicell.tsx, zebra.tsx, roller.tsx, wooden.tsx
│   │   │   │   ├── metal.tsx, sheer.tsx, vertical.tsx
│   │   │   │   ├── rustic.tsx, drapes.tsx, accessories.tsx
│   │   │   └── subCategory/
│   │   │       └── laserCut.tsx              # Laser-cut roller sub-category
│   │   ├── profile/
│   │   │   ├── sideBar.tsx
│   │   │   ├── myPersonalInformation.tsx
│   │   │   ├── orders.tsx
│   │   │   ├── addresses.tsx
│   │   │   └── addressForm.tsx
│   │   └── search/search.tsx
│   │
│   └── ui/                                   # 45+ Radix-based UI primitives
│       └── shadcn-io/
│           ├── gradient-text/                # Gradient text effect
│           └── image-zoom/                   # Image zoom component
│
├── contexts/
│   ├── cartContext.tsx                        # Global cart state
│   └── favoriteContext.tsx                    # Global favorites state
│
├── lib/
│   ├── auth.ts                               # NextAuth configuration
│   ├── db.ts                                 # Prisma client singleton
│   ├── session.ts                            # Session helpers
│   └── utils.ts                              # General utilities (cn, etc.)
│
├── hooks/
│   └── use-mobile.ts                         # Mobile breakpoint hook
│
├── data/
│   └── products.json                         # Static product reference data
│
├── types/
│   ├── product.ts                            # Product type definitions
│   ├── order.ts                              # Order type definitions
│   ├── next-auth.d.ts                        # NextAuth session augmentation
│   ├── iyzipay.d.ts                          # iyzico SDK types
│   ├── nodemailer.d.ts
│   ├── bcrypt.d.ts
│   └── formidable.d.ts
│
├── utils/
│   └── cart.ts                               # Cart calculation helpers
│
├── prisma/
│   ├── schema.prisma                         # Database schema
│   ├── seed.ts                               # Initial data seed
│   └── migrations/                           # Migration history
│       ├── 20251118065807_init/
│       ├── 20251119065034_add_sub_images_and_description/
│       ├── 20251119135918_add_room_to_products/
│       ├── 20251122061547_add_tcno_to_address/
│       └── 20251122092416_add_tcno_to_addresses/
│
└── public/
    ├── categories/          # Category cover images (12 WebP)
    ├── heroes/              # Hero carousel images (6 WebP: dikey, fon, plise, stor, tul, tum)
    ├── products/            # Product images (19 WebP)
    ├── profiles/            # Frame color swatches (6 WebP)
    ├── about/               # About page images
    ├── banner/              # Promotional banner image
    ├── measure/             # Measurement guide images
    ├── iyzico/              # Payment branding
    ├── logo/                # Site logos (3 variants including transparent)
    ├── socialMedia/         # Social platform icons
    ├── city.json            # Turkish province/district/neighborhood data
    └── og-image.webp        # Open Graph image
```

---

## 🗄️ Database Schema

All models are managed with Prisma and stored in MySQL.

### Core Tables

```
User              → Customer accounts (name, email, hashed password, phone, role)

Product           → Product catalog
                    (name, price, description, category, room, images[], subImages[],
                     width, height, stock, featured)
Category          → Product categories
                    (plicell, zebra, roller, laser_cut, wooden, metal, sheer,
                     vertical, rustic, drapes, accessories)

CartItem          → Active cart items (userId, productId, quantity, width, height, profile)
Favorite          → User wishlist items (userId, productId)
Review            → Product reviews (rating, comment, userId, productId)

Order             → Customer orders (status, total, cargoCode, timestamps)
OrderItem         → Line items (productId, quantity, price, width, height, profile)
OrderAddress      → Delivery address snapshot at order time
                    (name, phone, city, district, neighborhood, address, tcNo)

Address           → Saved user addresses (with tcNo for Turkish legal compliance)
Blog              → Blog posts (title, content, image, createdAt)
Banner            → Homepage banners (image, title, link, active)
Subscribe         → Newsletter subscribers (email, createdAt)
```

### Key Relationships

- `Product` belongs to one `Category` and optionally has a `room` tag for interior-style filtering
- `Product` stores an array of `subImages` (added in migration `20251119`) for gallery slides
- `CartItem` carries custom `width`, `height`, and `profile` fields to support made-to-measure orders
- `OrderItem` mirrors these measurement fields so the exact specification is preserved on the order
- `OrderAddress` stores a `tcNo` (Turkish national ID) field required by Turkish Distance Selling Law
- `Address` also stores `tcNo` so it auto-fills during checkout from saved addresses

---

## 🚀 Installation

### Prerequisites

- Node.js **18+**
- MySQL **8.0+**
- npm or yarn
- Cloudinary account _(for image uploads)_
- iyzico account _(for payment processing)_

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/modaperde.git
cd modaperde
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/modaperde"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# iyzico Payment Gateway
IYZICO_API_KEY="your-iyzico-api-key"
IYZICO_SECRET_KEY="your-iyzico-secret-key"
IYZICO_BASE_URL="https://sandbox-api.iyzipay.com"   # Switch to production URL for live

# Email (Gmail SMTP)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-gmail-app-password"
EMAIL_FROM="noreply@modaperde.com"
```

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App Passwords to generate a dedicated SMTP password for Nodemailer.

> **iyzico Sandbox:** Use `https://sandbox-api.iyzipay.com` for development and testing. Switch to `https://api.iyzipay.com` for production.

---

### 4. Set Up the Database

```bash
# Generate Prisma client
npx prisma generate

# Apply all migrations
npx prisma migrate dev

# Seed initial data
npm run seed
```

---

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Production Build

```bash
npm run build
npm start
```

---

## 🔌 API Endpoints

### Base URL

```
http://localhost:3000/api
```

### 🔐 Authentication

| Method | Endpoint                       | Description                          |
| ------ | ------------------------------ | ------------------------------------ |
| POST   | `/api/auth/[...nextauth]`      | NextAuth sign-in handler             |
| POST   | `/api/auth/logout`             | Destroy session and sign out         |
| GET    | `/api/account/check`           | Check if email is already registered |
| POST   | `/api/account/register`        | Register new user                    |
| POST   | `/api/account/forgot_password` | Send password reset email            |
| POST   | `/api/account/reset_password`  | Apply new password with token        |

### 📦 Products

| Method | Endpoint                              | Description                      |
| ------ | ------------------------------------- | -------------------------------- |
| GET    | `/api/products`                       | List all products (with filters) |
| POST   | `/api/products`                       | Create product (Admin)           |
| GET    | `/api/products/[id]`                  | Get product by ID                |
| PUT    | `/api/products/[id]`                  | Update product (Admin)           |
| DELETE | `/api/products/[id]`                  | Delete product (Admin)           |
| GET    | `/api/products/category/[categoryId]` | Products filtered by category    |

### 🛒 Cart

| Method | Endpoint         | Description                          |
| ------ | ---------------- | ------------------------------------ |
| GET    | `/api/cart`      | Get user's active cart               |
| POST   | `/api/cart`      | Add item to cart (with measurements) |
| PUT    | `/api/cart/[id]` | Update cart item                     |
| DELETE | `/api/cart/[id]` | Remove item from cart                |

### 📋 Orders

| Method | Endpoint          | Description               |
| ------ | ----------------- | ------------------------- |
| POST   | `/api/order`      | Create new order          |
| GET    | `/api/order/user` | Get current user's orders |

### 💳 Payment

| Method | Endpoint       | Description                     |
| ------ | -------------- | ------------------------------- |
| POST   | `/api/payment` | Initiate iyzico payment session |

### ❤️ Favorites

| Method | Endpoint              | Description             |
| ------ | --------------------- | ----------------------- |
| GET    | `/api/favorites`      | Get user's wishlist     |
| POST   | `/api/favorites`      | Add product to wishlist |
| DELETE | `/api/favorites/[id]` | Remove from wishlist    |

### ⭐ Reviews

| Method | Endpoint           | Description                 |
| ------ | ------------------ | --------------------------- |
| GET    | `/api/review`      | List product reviews        |
| POST   | `/api/review`      | Submit a review             |
| DELETE | `/api/review/[id]` | Delete review (Admin/Owner) |

### 📝 Blog

| Method | Endpoint         | Description              |
| ------ | ---------------- | ------------------------ |
| GET    | `/api/blog`      | List all blog posts      |
| POST   | `/api/blog`      | Create blog post (Admin) |
| GET    | `/api/blog/[id]` | Get post by ID           |
| PUT    | `/api/blog/[id]` | Update blog post (Admin) |
| DELETE | `/api/blog/[id]` | Delete blog post (Admin) |

### 🖼️ Banners

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| GET    | `/api/banner`      | List all banners      |
| POST   | `/api/banner`      | Create banner (Admin) |
| PUT    | `/api/banner/[id]` | Update banner (Admin) |
| DELETE | `/api/banner/[id]` | Delete banner (Admin) |

### 📍 Addresses & Location

| Method | Endpoint                            | Description                      |
| ------ | ----------------------------------- | -------------------------------- |
| GET    | `/api/address`                      | Get user's saved addresses       |
| POST   | `/api/address`                      | Add new address                  |
| PUT    | `/api/address/[id]`                 | Update address                   |
| DELETE | `/api/address/[id]`                 | Delete address                   |
| GET    | `/api/location/ilceler/[ilId]`      | Get districts by province ID     |
| GET    | `/api/location/mahalleler/[ilceId]` | Get neighborhoods by district ID |

### 👤 Users & Utilities

| Method | Endpoint              | Description                |
| ------ | --------------------- | -------------------------- |
| GET    | `/api/user`           | Get current user profile   |
| PUT    | `/api/user`           | Update user profile        |
| GET    | `/api/user/all`       | List all users (Admin)     |
| PUT    | `/api/user/all/[id]`  | Update user (Admin)        |
| DELETE | `/api/user/all/[id]`  | Delete user (Admin)        |
| POST   | `/api/subscribe`      | Subscribe to newsletter    |
| DELETE | `/api/subscribe/[id]` | Delete subscriber (Admin)  |
| POST   | `/api/send-mail`      | Send contact form email    |
| POST   | `/api/upload`         | Upload image to Cloudinary |

---

## 📏 Custom Measurement System

ModaPerde's core differentiator is support for made-to-measure window coverings. Every product in curtain/blind categories accepts custom dimensions.

### How It Works

1. On the product detail page, a **measurement modal** (`measureModal.tsx`) guides the customer through width and height input
2. The system automatically calculates **square meters** (width × height / 10,000)
3. Pricing adjusts based on dimensions (price per m² or price per unit depending on category)
4. A **profile/color selector modal** (`profileModal.tsx`) lets customers choose frame colors: Anthracite, White, Grey, Brown, Cream, Black
5. Measurements and profile selection are stored on `CartItem` and preserved in `OrderItem`
6. The **measurement guide pages** (`/institutional/measurement`, `/info/measure`) and guide images help customers measure correctly before ordering

### Measurement Reference Images

Located in `public/measure/`:

- `measure1.webp` — How to measure width (inside recess vs. outside)
- `measure2.webp` — How to measure drop/height

---

## 💳 Payment Integration — iyzico

ModaPerde uses [iyzico](https://iyzico.com) for secure payment processing with Turkish bank card support.

### Checkout Flow

1. Customer fills cart with measured products
2. **Step 1 — Address**: Select or add delivery address (with district/neighborhood auto-fill from `city.json`)
3. **Step 2 — Payment**: Card details entered via iyzico secure form
4. iyzico processes the payment via `/api/payment`
5. On success → order created in DB → redirect to `/checkout/success`
6. On failure → redirect to `/checkout/unsuccess`

> **Sandbox Testing:** Use `https://sandbox-api.iyzipay.com` with iyzico's [test card numbers](https://dev.iyzipay.com/en/test-cards).

---

## 🔐 Security

- **NextAuth.js** — Session management with encrypted JWT in HttpOnly cookies
- **bcrypt** — Password hashing (salt rounds: 12)
- **Zod** — Schema validation on all API route inputs
- **Role-based access control** — Admin routes protected by session role middleware
- **Cloudinary signed uploads** — All uploads require server-side signed credentials
- **TC Identity Number (tcNo)** — Stored on `Address` and `OrderAddress` for legal compliance with Turkish Distance Selling Law (TKHK Madde 48)
- **KVKK compliance** — Dedicated `/contracts/kvkk` and `/contracts/personal_data` pages
- **Password reset flow** — Time-limited tokens sent via Nodemailer, never stored in plaintext
- **Environment isolation** — All secrets in `.env.local`, never exposed to the client bundle

---

## 🧪 Development Tools

### Database Management

```bash
# Open Prisma Studio (visual DB editor)
npx prisma studio

# Create a new migration
npx prisma migrate dev --name describe-your-change

# Seed the database
npm run seed

# Reset database (destructive)
npx prisma migrate reset
```

### Build

```bash
npm run dev       # Development server
npm run build     # Production build
npm start         # Start production server
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push your repository to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local` in the Vercel dashboard
4. Deploy — Vercel auto-detects Next.js and handles the build

```bash
npx vercel --prod
```

### Docker

```bash
docker build -t modaperde .
docker run -p 3000:3000 --env-file .env modaperde
```

### Production Checklist

- Set `NODE_ENV=production`
- Update `NEXTAUTH_URL` and `NEXT_PUBLIC_BASE_URL` to your live domain
- Switch `IYZICO_BASE_URL` to `https://api.iyzipay.com`
- Use a managed MySQL instance (PlanetScale, Railway, AWS RDS)
- Configure Cloudinary for the production environment
- Enable HTTPS (automatic on Vercel; use Let's Encrypt for VPS)
- Verify all legal pages (KVKK, distance sale, personal data) are up to date

---

## 🤝 Contributing

1. **Fork** this repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'feat: add AmazingFeature'
   ```
4. Push your branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a **Pull Request**

### Code Standards

- Use **TypeScript** strictly — no `any` types
- Validate all API inputs with **Zod**
- Follow **Conventional Commits** (`feat:`, `fix:`, `docs:`, `refactor:`)
- Run `npm run build` before submitting PRs to catch type and build errors

---

## 📄 License

This project is **proprietary software**. All rights reserved.

---

<div align="center">

_ModaPerde — Dressing your windows, beautifully._ 🪟

</div>
