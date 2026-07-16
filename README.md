# ModaPerde

A Next.js e-commerce web application for curtains and window coverings (curtains, blinds, roller shades, etc.), built with the Next.js App Router, Prisma ORM, PostgreSQL, NextAuth.js, and a Radix UI / shadcn-style component library. The `package.json` internal package name is `plicell` (the git remote is `github.com/ceyhun64/plicell`); the project folder and public-facing brand are "ModaPerde" ("fashion curtain" in Turkish).

## Overview

The application serves a Turkish-market storefront for curtains, blinds, and related window-covering products, including:

- A public storefront with category browsing, product detail pages, custom width/height measurement input, a shopping cart, a wishlist, a multi-step checkout with iyzico payment, order history, a blog, and informational/legal pages (KVKK, distance-sale agreement, etc.).
- An `/admin` area for managing products, orders, blog posts, a single homepage banner, users, and newsletter subscribers.
- A REST API implemented as Next.js Route Handlers under `app/api/**`, backed by a PostgreSQL database accessed through Prisma.

This README was produced by reading the actual source (`package.json`, `prisma/schema.prisma`, every `app/api/**/route.ts`/`route.js` file, `lib/`, `contexts/`, `utils/`, `components.json`, `next.config.ts`, `.env`/`.env.local` variable names, and `public/`). Where the previous README described things that do not exist in the code (see below), those claims have been removed or corrected.

> **Note on the previous README:** the prior version of this file described a MySQL database, a different set of environment variable names, several API endpoints/methods that don't exist, a Docker deployment path with no `Dockerfile` in the repo, and Banner/Blog features (image, link, active-flag banners) not present in the actual Prisma schema. This rewrite reflects only what is verifiable in the current codebase.

---

## Features

Verified by reading the corresponding page/component/route source under `app/`, `components/`, and `contexts/`.

### Customer-facing

- Product catalog with per-category pages (`app/products/<category>/page.tsx` for plicell, zebra, roller — including a `roller/laser-cut` sub-page —, wooden, metal, sheer, vertical, rustic, drapes, accessories) plus a combined `/products` listing.
- Product detail pages (`components/modules/products/productDetail.tsx`) with a measurement modal (`measureModal.tsx`) and a profile/color selector modal (`profileModal.tsx`).
- Custom measurement: width/height input with an m² calculation (`m2 = max(1, width*height/10000)`, computed in `app/api/cart/route.ts`), stored on `CartItem` and copied to `OrderItem` at checkout.
- Search page (`app/search`), FAQ (`app/faq`), Blog listing/detail (`app/blog`, `app/blog/[id]`).
- Shopping cart with two modes: an authenticated, database-backed cart (`CartItem` Prisma model, via `/api/cart*`) and a `localStorage`-based guest cart (`utils/cart.ts`, key `guestCart`).
- Favorites/wishlist for logged-in users (`Favorite` model, `/api/favorites*`).
- Multi-step checkout (`components/modules/checkout/checkout.tsx`, `stepAddress.tsx`, `stepPayment.tsx`) with address selection/creation and iyzico card payment.
- Turkish province/district/neighborhood address form (`components/modules/profile/addressForm.tsx`): the province list comes from the local `public/city.json` file; district and neighborhood lists are fetched live through this app's own `/api/location/ilceler/[ilId]` and `/api/location/mahalleler/[ilceId]` routes, which in turn call the external `turkiyeapi.dev` API.
- User profile, saved addresses, and order history/cancellation (`app/profile/*`).
- Password reset flow via a random token stored on the `User` row and emailed with Nodemailer (`/api/account/forgot_password`, `/api/account/reset_password`).
- Newsletter subscription (`Subscribe` model, `/api/subscribe`).
- Contact form that sends mail via `/api/send-mail`.
- Legal/informational pages: `/contracts/kvkk`, `/contracts/distance_sale`, `/contracts/personal_data`, `/contracts/payment_options`, `/institutional/*`, `/info/*`.

### Admin (`/admin/*`)

- Dashboard with charts (Recharts is a dependency; `components/modules/admin/dashboard/dashboard.tsx`).
- Product management: create/edit/delete, with image upload proxied through `/api/upload` to Cloudinary.
- Order management: list and update order status via `PATCH /api/order`.
- Single-banner management: the schema only supports one `Banner` row with a `title` and `subtitle` (no image, link, or active flag); `POST /api/banner` explicitly rejects the request if a banner already exists.
- Blog management: create/update/delete blog posts, with the cover image uploaded through `/api/upload` (Cloudinary).
- User list (`GET /api/user/all`) and user deletion (`DELETE /api/user/all/[id]`).
- Newsletter subscriber list/removal (`/api/subscribe`, `/api/subscribe/[id]`).

**Important caveat verified in code:** none of the "admin" API routes check the caller's `role`. Every admin-facing route handler (`banner`, `blog`, `products`, `user/all`, etc.) only checks `if (!session)` — i.e. it requires *any* logged-in user, not specifically `role === "ADMIN"`. There is no `middleware.ts` in the project either. Access to the `/admin` UI is therefore gated only by client-side/page-level checks, not by server-side role enforcement on the API. This should be treated as a real security gap, not a documentation gap.

---

## Technology Stack

Versions below are copied verbatim from `package.json` (`^` = minimum compatible version per npm semver).

### Frontend

| Technology | Version | Notes |
|---|---|---|
| Next.js | ^16.0.10 | App Router |
| React / react-dom | 19.2.0 | pinned exact version |
| TypeScript | ^5 | |
| Tailwind CSS | ^4 | via `@tailwindcss/postcss` |
| Radix UI | various `^1.x`/`^2.x` packages | 25+ `@radix-ui/react-*` primitives, wrapped in `components/ui/` (53 files) in shadcn "new-york" style (`components.json`) |
| react-hook-form + @hookform/resolvers | ^7.66.0 / ^5.2.2 | forms |
| zod | ^4.1.12 | schema validation |
| framer-motion / motion | ^12.23.24 | animation |
| embla-carousel-react | ^8.6.0 | carousels |
| react-medium-image-zoom | ^5.4.0 | product image zoom |
| recharts | ^2.15.4 | admin dashboard charts |
| sonner | ^2.0.7 | toasts |
| next-themes | ^0.4.6 | theme handling |
| date-fns | ^4.1.0 | date formatting |
| lucide-react | ^0.553.0 | icons |

### Backend / Data

| Technology | Version | Notes |
|---|---|---|
| Prisma / @prisma/client | ^6.19.0 | ORM; client generated to `lib/generated/prisma` (custom `output` in `schema.prisma`) |
| PostgreSQL | — | actual `datasource` provider in `prisma/schema.prisma` is `postgresql` |
| mysql2 / mysql | ^3.15.3 / ^2.18.1 | present as dependencies but the datasource is PostgreSQL; `.env` contains a commented-out legacy MySQL connection string, and `scripts/migrate-mysql-to-postgres.ts` exists, indicating a past migration off MySQL |
| next-auth | ^4.24.13 | Credentials provider, JWT sessions |
| bcrypt | ^6.0.0 | password hashing |
| nodemailer | ^7.0.10 | password-reset and contact-form email |
| cloudinary / next-cloudinary | ^2.8.0 / ^6.17.5 | image hosting, used by `/api/upload` |
| iyzipay | ^2.0.64 | listed as a dependency but **not imported anywhere in the code**; the actual iyzico integration in `app/api/payment/route.ts` is a hand-rolled REST client using Node's `crypto` module (HMAC-SHA256 request signing), not the SDK |
| tsx | ^4.20.6 | runs `prisma/seed.ts` |

### Infra hints found in the repo

- A `.vercel/` directory and a `.env.local` header comment "Created by Vercel CLI" indicate the project is linked to a Vercel project, but no Vercel build settings beyond the default Next.js detection were found in the repo.
- No `Dockerfile` or `docker-compose.yml` exists in the repository.

---

## Architecture

```
Browser
   │
   ▼
Next.js 16 App Router (app/)
 ├── Public pages (/, /products/*, /cart, /checkout, /profile, /blog, /search, /faq, ...)
 ├── Auth pages (/login, /register, /forgot-password, /reset-password)
 ├── Admin pages (/admin/*) — client/page-level session check only
 └── API route handlers (app/api/**/route.ts|js)
        │
        ├── Prisma Client (lib/db.ts, generated to lib/generated/prisma)
        │      └── PostgreSQL (DATABASE_URL)
        ├── NextAuth (Credentials provider, JWT sessions)
        ├── Cloudinary (image upload, via /api/upload)
        ├── Nodemailer / SMTP (password reset, contact form, order-status mail)
        ├── iyzico REST API (custom HMAC-signed requests in /api/payment)
        └── turkiyeapi.dev (external district/neighborhood lookup, proxied by /api/location/*)
```

Two separate `NextAuthOptions`/`AuthOptions` objects exist in the codebase and are not the same object:
- `lib/auth.ts` exports `authOptions`, imported by every other API route that calls `getServerSession(authOptions)`.
- `app/api/auth/[...nextauth]/route.ts` defines its **own**, unexported, near-duplicate `authOptions` (same Credentials provider logic) that is what's actually passed to `NextAuth(...)` to create the sign-in handler, and is the only one of the two that sets `session.maxAge` (24 hours). The `lib/auth.ts` copy has no `maxAge`, but since both configurations produce structurally compatible JWTs, `getServerSession` elsewhere still reads the session correctly.

---

## Folder Structure

```
ModaPerde/
├── app/
│   ├── page.tsx, layout.tsx, not-found.tsx, globals.css
│   ├── login/, register/, forgot-password/, reset-password/
│   ├── about/, contact/, faq/, search/, cart/, favorites/
│   ├── blog/, blog/[id]/
│   ├── products/ (page.tsx, [id]/, accessories/, drapes/, metal/, plicell/,
│   │              roller/ (+ roller/laser-cut/), rustic/, sheer/, vertical/, wooden/, zebra/)
│   ├── checkout/ (page.tsx, success/, unsuccess/)
│   ├── profile/ (page.tsx, orders/, addresses/)
│   ├── institutional/ (about/, bank_accounts/, documents/, measurement/, why_us/)
│   ├── info/ (advantage/, measure/, terms/, why/)
│   ├── contracts/ (kvkk/, distance_sale/, personal_data/, payment_options/)
│   ├── admin/ (page.tsx, dashboard/, products/, orders/, blogs/, banner/, users/, subscribers/)
│   └── api/
│       ├── auth/[...nextauth]/, auth/logout/
│       ├── account/check/, account/register/, account/forgot_password/, account/reset_password/
│       ├── products/, products/[id]/, products/category/[categoryId]/
│       ├── cart/, cart/[id]/
│       ├── order/, order/user/
│       ├── payment/
│       ├── review/, review/[id]/
│       ├── favorites/, favorites/[id]/
│       ├── blog/, blog/[id]/
│       ├── banner/, banner/[id]/
│       ├── address/, address/[id]/
│       ├── user/, user/all/, user/all/[id]/
│       ├── subscribe/ (.js), subscribe/[id]/ (.js)   ← plain JS, not TS, unlike the rest of app/api
│       ├── upload/
│       ├── send-mail/
│       └── location/ilceler/[ilId]/, location/mahalleler/[ilceId]/
│
├── components/
│   ├── layout/          # navbar, topbar, footer, mega menus, mobile nav sheet, cart dropdown, etc.
│   ├── modules/          # feature components grouped by domain (admin, auth, blog, cart, checkout,
│   │                      # contracts, favorites, home, info, institutional, products, profile, search)
│   └── ui/                # 53 shadcn/Radix-based primitives + components/ui/shadcn-io/{gradient-text,image-zoom}
│
├── contexts/
│   ├── cartContext.tsx        # authenticated cart state (calls /api/cart)
│   └── favoriteContext.tsx    # favorites state
│
├── lib/
│   ├── auth.ts                # exported NextAuth config used by getServerSession() call sites
│   ├── db.ts                  # Prisma client singleton (imports from lib/generated/prisma)
│   ├── session.ts             # next-session cookie config (secure/httpOnly, 1-day maxAge) — unused by the NextAuth flow
│   ├── utils.ts                # cn() class-merging helper (clsx + tailwind-merge)
│   └── generated/prisma/       # Prisma Client output (generated, not hand-written)
│
├── hooks/
│   └── use-mobile.ts
│
├── data/
│   └── products.json          # static product seed data consumed by prisma/seed.ts
│
├── types/
│   ├── product.ts, order.ts, next-auth.d.ts (session/JWT augmentation),
│   │ iyzipay.d.ts, nodemailer.d.ts, bcrypt.d.ts, formidable.d.ts
│
├── utils/
│   └── cart.ts                # localStorage-based guest cart helpers
│
├── scripts/
│   └── migrate-mysql-to-postgres.ts   # one-off data migration script (reads MYSQL_SOURCE_URL)
│
├── prisma/
│   ├── schema.prisma           # PostgreSQL datasource
│   ├── seed.ts                 # seeds an admin user, categories, rooms, and products
│   └── migrations/
│       └── 20260714141026_init_postgresql/
│
├── backups/                    # present in the repo root (contents not inspected as part of this audit)
└── public/
    ├── categories/ (12 .webp), heroes/ (6 .webp: dikey, fon, plise, stor, tul, tum),
    │ products/ (20 .webp, files 1–19 plus 8.1), profiles/ (6 .webp: antrasit, beyaz, gri, kahve, krem, siyah),
    │ about/ (3 .webp), banner/ (1 .webp), measure/ (measure1.webp, measure2.webp),
    │ iyzico/ (3 .webp), logo/ (3 .webp), socialMedia/ (4 .webp)
    ├── city.json                # Turkish province list used by the address form
    └── og-image.webp, file.svg, globe.svg, next.svg, vercel.svg, window.svg
```

---

## Installation

### Prerequisites

- Node.js (version not pinned in `package.json`/`.nvmrc` — not verifiable; use a current LTS compatible with Next.js 16 and React 19)
- A PostgreSQL database
- Cloudinary account (for `/api/upload`)
- iyzico merchant credentials (for `/api/payment`)
- An SMTP-capable email account (used via Nodemailer for password reset and contact form)

### Steps

```bash
git clone https://github.com/ceyhun64/plicell.git
cd plicell   # or ModaPerde, depending on the local folder name
npm install
```

`npm install` triggers `postinstall` → `prisma generate` automatically.

Create a `.env.local` (or `.env`) file with the variables listed in [Environment Variables](#environment-variables), then:

```bash
npx prisma migrate dev   # applies prisma/migrations/ against your PostgreSQL database
npm run seed              # runs prisma/seed.ts (see Available Scripts)
npm run dev
```

Open `http://localhost:3000`.

---

## Environment Variables

Names and purposes only, taken from the actual `.env` and `.env.local` files in the repo (values redacted). No values are reproduced here.

| Variable | Purpose | Read in code |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `prisma/schema.prisma` |
| `NEXTAUTH_SECRET` | NextAuth JWT signing secret | `lib/auth.ts`, `app/api/auth/[...nextauth]/route.ts` |
| `NEXT_PUBLIC_BASE_URL` | Base URL used for server-to-server fetches (e.g. calling `/api/upload`, `/api/send-mail` from other route handlers) and for building the password-reset link | multiple `app/api/**/route.ts` files |
| `ADMIN_NAME`, `ADMIN_SURNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Credentials for the one admin user created by `prisma/seed.ts`; seeding is skipped if any of these are missing | `prisma/seed.ts` |
| `CLOUD_NAME`, `API_KEY`, `API_SECRET` | Cloudinary credentials (note: **not** prefixed `CLOUDINARY_*` in this codebase) | `app/api/upload/route.ts` |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` | SMTP credentials for Nodemailer | `app/api/send-mail/route.ts` |
| `IYZICO_API_KEY`, `IYZICO_SECRET_KEY`, `IYZICO_BASE_URL` | iyzico merchant API credentials and endpoint (sandbox vs. production URL) | `app/api/payment/route.ts` |

Additional variables observed but not part of the application's own configuration:
- `VERCEL_OIDC_TOKEN` — present only in `.env.local`, auto-injected by the Vercel CLI; not read anywhere in application code.
- A comment in `.env` references a legacy `mysql://...` connection string kept for rollback purposes; it is not an active variable.

No `NEXTAUTH_URL` variable is set in either `.env` file and no application code reads it — be aware that NextAuth v4 normally expects `NEXTAUTH_URL` to be set explicitly in production deployments even though this repo currently omits it.

No `.env.example` file exists in the repository.

---

## Available Scripts

Exactly as defined in `package.json`:

| Script | Command | Behavior |
|---|---|---|
| `npm run dev` | `next dev` | Starts the Next.js development server. |
| `npm run build` | `next build` | Production build. |
| `npm start` | `next start` | Serves the production build (run `build` first). |
| `npm run seed` | `tsx prisma/seed.ts` | Seeds an admin user (from `ADMIN_*` env vars, skipped if already present or if vars are missing), a fixed list of Turkish category names, a fixed list of room names, and products from `data/products.json` (skips products whose `title` already exists). **Not destructive** — it only creates missing rows, it does not delete or reset data. |
| `postinstall` | `prisma generate` | Runs automatically after `npm install`; regenerates the Prisma Client into `lib/generated/prisma`. |

### Prisma CLI commands (not npm scripts, run via `npx`)

These are standard Prisma CLI operations relevant to this project but are **not** declared in `package.json`:

- `npx prisma generate` — regenerate the Prisma Client.
- `npx prisma migrate dev` — create/apply a migration in development.
- `npx prisma studio` — open Prisma's visual data browser.
- `npx prisma migrate reset` — **destructive**: drops and recreates the database, reapplies all migrations, then runs seeding. Do not run against a database with data you need.

---

## Development

```bash
npm run dev
```

Path alias `@/*` maps to the project root (`tsconfig.json`). Styling is Tailwind CSS v4 configured through `@tailwindcss/postcss` (see `postcss.config.mjs`); UI primitives follow the shadcn "new-york" style with base color `zinc` (`components.json`), aliased to `@/components`, `@/components/ui`, `@/lib`, `@/hooks`.

## Build

```bash
npm run build
npm start
```

`next.config.ts` only configures `images.remotePatterns` to allow `https://res.cloudinary.com/**`; no other custom Next.js config (redirects, headers, rewrites, etc.) is present.

## Deployment

The presence of a `.vercel/` directory and a Vercel-CLI-generated `.env.local` header indicate this project is linked to Vercel, and Next.js projects deploy to Vercel with zero extra configuration by default. Beyond that link, no deployment scripts, CI workflow files, or a `Dockerfile`/`docker-compose.yml` exist in this repository, so no other deployment path can be verified from the code.

If deploying to Vercel (or any host), the environment variables listed above must be configured on the host, since `.env`/`.env.local` are git-ignored (see `.gitignore`).

---

## API

All routes are Next.js Route Handlers under `app/api/`. Method and behavior for every route were confirmed by reading each `route.ts`/`route.js` file. "Auth" = requires a valid NextAuth session unless noted otherwise.

### Auth & account

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET / POST | `/api/auth/[...nextauth]` | NextAuth Credentials sign-in/session handler | — |
| POST | `/api/auth/logout` | Clears the session cookie | — |
| GET | `/api/account/check` | Returns the current session's user (or `{ user: null }`) — effectively a "who am I" check, **not** an email-availability check | optional |
| POST | `/api/account/register` | Registers a new user (hashes password with bcrypt); rejects if the email already exists | — |
| POST | `/api/account/forgot_password` | Generates a reset token (30-minute expiry) and emails a reset link; always returns a generic success message even if the email doesn't exist | — |
| POST | `/api/account/reset_password` | Validates the token/expiry and sets a new bcrypt-hashed password | — |

### Products

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/products` | List all products with category/subCategory/room included | — |
| POST | `/api/products` | Create a product from `multipart/form-data` (uploads images via `/api/upload`) | none checked in code |
| GET | `/api/products/[id]` | Get one product | — |
| PUT | `/api/products/[id]` | Update a product, optionally replacing images | none checked in code |
| DELETE | `/api/products/[id]` | Delete a product and attempt to remove its image files from `public/` | none checked in code |
| GET | `/api/products/category/[categoryId]` | Products filtered by numeric category ID | — |

### Cart

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/cart` | Current user's cart items (returns `[]` if not logged in) | optional |
| POST | `/api/cart` | Add an item (merges quantity into an existing matching line by product/profile/device/note) | required |
| PATCH | `/api/cart/[id]` | Update a cart line's quantity | required |
| DELETE | `/api/cart/[id]` | Remove one cart line | required |
| DELETE | `/api/cart` | Clear all of the current user's cart items | required |

### Orders & payment

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/order` | Creates an order and calls iyzico to take payment | none checked in code |
| GET | `/api/order` | Lists **all** orders in the system (admin dashboard use) | none checked in code |
| PATCH | `/api/order` | Updates an order's `status` (`pending`/`paid`/`shipped`/`delivered`/`cancelled`) | none checked in code |
| GET | `/api/order/user` | Current user's own orders | required |
| PATCH | `/api/order/user` | Cancels the current user's own order (only if not already `delivered`/`shipped`/`cancelled`); emails the user and a hard-coded admin address | required |
| POST | `/api/payment` | Signs and sends a payment request directly to the iyzico REST API (custom HMAC implementation) | — |

### Reviews

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/review` | Create a review (1–5 rating); unique per user/product | required |
| GET | `/api/review/[id]` | List reviews for the product whose ID is `[id]` (includes reviewer name) | — |

### Favorites

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/favorites` | Current user's favorites (returns `[]` if not logged in) | optional |
| POST | `/api/favorites` | Add a favorite | required |
| DELETE | `/api/favorites/[id]` | Remove a favorite | required |

### Blog

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/blog` | List all blog posts | — |
| POST | `/api/blog` | Create a post from form-data (image uploaded via `/api/upload`) | required |
| PUT | `/api/blog/[id]` | Update a post | required |
| DELETE | `/api/blog/[id]` | Delete a post and attempt to remove its referenced image from `public/upload/blogs` | required |

There is no `GET /api/blog/[id]` route — single-post fetching is not exposed as a dedicated endpoint in `app/api`.

### Banner

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/banner` | List banners (`title`, `subtitle` only) | — |
| POST | `/api/banner` | Create a banner; rejected if one already exists (single-banner limit) | required |
| DELETE | `/api/banner/[id]` | Delete a banner | required |

There is no `PUT /api/banner/[id]` route.

### Addresses & location

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/address` | Current user's saved addresses | required |
| POST | `/api/address` | Create an address (accepts a `userId` from the request body for guest checkout if not logged in) | optional |
| PATCH | `/api/address/[id]` | Update an address (ownership-checked) | required |
| DELETE | `/api/address/[id]` | Delete an address (ownership-checked) | required |
| GET | `/api/location/ilceler/[ilId]` | Districts for a province, proxied from `turkiyeapi.dev` | — |
| GET | `/api/location/mahalleler/[ilceId]` | Neighborhoods for a district, proxied from `turkiyeapi.dev` | — |

### Users & subscribers

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/user` | Current session user | required |
| PATCH | `/api/user` | Update `name`/`surname`/`phone` for the current user | required |
| GET | `/api/user/all` | List all users with addresses | required (no role check) |
| DELETE | `/api/user/all/[id]` | Delete a user | none checked in code |
| GET | `/api/subscribe` | List all newsletter subscribers | — |
| POST | `/api/subscribe` | Subscribe an email | — |
| DELETE | `/api/subscribe/[id]` | Remove a subscriber | none checked in code |
| POST | `/api/send-mail` | Send an email via SMTP (used by contact form, password reset, order-cancellation notices) | — |
| POST | `/api/upload` | Upload a file to Cloudinary, returns `secure_url` | none checked in code |

---

## Database

Prisma `datasource` provider is **`postgresql`** (`prisma/schema.prisma`), despite `mysql`/`mysql2` still being listed as npm dependencies. The Prisma Client is generated to a custom output path, `lib/generated/prisma`, not the default `node_modules/.prisma/client`.

### Models

| Model | Key fields | Notes |
|---|---|---|
| `User` | name, surname, email (unique), password (bcrypt hash), phone?, role (`UserRole`), resetToken?, resetTokenExpires? | `@@map("user")` |
| `product` | title, pricePerM2, rating, reviewCount?, mainImage, subImage/subImage2/subImage3?, description, categoryId, subCategoryId?, roomId? | Prisma model name is lower-case `product` (no `@@map`); relates to `Category`, `SubCategory`, `Room` |
| `Category` | name | `@@map("category")`; has many `product`, `SubCategory` |
| `SubCategory` | name, categoryId | `@@map("sub_category")` |
| `Room` | name | no `@@map`; has many `product` |
| `CartItem` | userId? (nullable, comment: "guest cart için"), productId, quantity, note?, profile, width, height, m2, device? | `@@map("cartitem")` |
| `Favorite` | userId, productId | unique on (userId, productId); `@@map("favorite")` |
| `Review` | userId, productId, rating, title?, comment? | unique on (userId, productId); `@@map("review")` |
| `Address` | userId, title, firstName, lastName, address, neighborhood?, district, city, tcno? (VarChar(11)), zip, phone, country | `@@map("address")` |
| `Order` | userId, status (`OrderStatus`), totalPrice, paidPrice, currency, paymentMethod, transactionId? | `@@map("order")`; has many `OrderItem`, `OrderAddress` |
| `OrderItem` | orderId, productId, quantity, unitPrice, totalPrice, note?, profile?, width?, height?, m2?, device? | `@@map("orderitem")` |
| `OrderAddress` | orderId, type, firstName, lastName, address, district, tcno?, city, zip, phone, country | `@@map("orderaddress")` |
| `Blog` | title, content, image, category | `@@map("blog")` |
| `Subscribe` | email (unique) | `@@map("subscribe")` |
| `Banner` | title?, subtitle? | no `@@map`; **no image/link/active fields** despite what the previous README claimed |

### Enums

- `OrderStatus`: `pending`, `paid`, `shipped`, `delivered`, `cancelled`
- `UserRole`: `USER`, `ADMIN`

### Relationships

- `product` belongs to one `Category`, optionally one `SubCategory`, and optionally one `Room`.
- `CartItem`/`OrderItem` carry per-line `width`, `height`, `m2`, and `profile` to preserve made-to-measure specifications.
- `Order` has many `OrderItem` and many `OrderAddress` (an order can store more than one address row, e.g. shipping and billing, distinguished by the `type` string field).
- `Address` and `OrderAddress` both store a Turkish national ID (`tcno`), consistent with the app's Turkish distance-selling legal pages.

### Migrations

Only one migration exists in `prisma/migrations/`: `20260714141026_init_postgresql`. A `scripts/migrate-mysql-to-postgres.ts` script (reading a `MYSQL_SOURCE_URL` env var, not otherwise documented in `.env`) confirms this schema previously ran on MySQL and was migrated to PostgreSQL; the earlier MySQL-era migrations are no longer present in the repo.

---

## Authentication

- **Mechanism:** NextAuth.js v4 with a single `CredentialsProvider` (email + password). Passwords are hashed with `bcrypt` (`bcrypt.hash(password, 10)` at registration/reset) and compared with `bcrypt.compare` at sign-in (`lib/auth.ts`, `app/api/auth/[...nextauth]/route.ts`).
- **Session strategy:** JWT (`session: { strategy: "jwt" }`). The handler in `app/api/auth/[...nextauth]/route.ts` additionally sets `maxAge: 24 * 60 * 60` (24 hours); the parallel `authOptions` in `lib/auth.ts` used elsewhere for `getServerSession` does not set a `maxAge`.
- **Session contents:** `id`, `name`, `surname`, `email`, `role` are copied from the DB user into the JWT and exposed on `session.user` (see `types/next-auth.d.ts` for the type augmentation, which also declares an `"EDITOR"` role not present in the Prisma `UserRole` enum).
- **Authorization:** the `role` field exists on the session but, as noted under [API](#api), server-side route handlers do not check it — they only verify a session exists. Any authenticated user can call the admin-oriented endpoints directly. There is no `middleware.ts` route-protection layer.
- **Password reset:** a random token (`Math.random().toString(36)`) with a 30-minute expiry stored on `User.resetToken`/`resetTokenExpires`; not a cryptographically strong token generator.

---

## Configuration

- `next.config.ts`: only sets `images.remotePatterns` to allow `res.cloudinary.com`.
- `components.json`: shadcn "new-york" style, base color `zinc`, RSC + TSX enabled, path aliases `@/components`, `@/components/ui`, `@/lib`, `@/hooks`.
- `tsconfig.json`: `strict: true`, path alias `@/*` → project root, target `ES2017`.
- `lib/session.ts` configures a `next-session` cookie (httpOnly, secure in production, 1-day maxAge) via the `next-session` package, but this is unrelated to and not used by the actual NextAuth login flow — it appears to be unused/leftover code (no other file in the repo imports it).

---

## Troubleshooting

Realistic issues for this stack, based on what the code actually depends on:

- **`prisma generate` errors on install** — the client output path is customized to `lib/generated/prisma` in `prisma/schema.prisma`; if that folder is deleted or `.gitignore`d incorrectly, imports from `@/lib/generated/prisma` (used by `lib/db.ts`) will fail until `npx prisma generate` is re-run.
- **Database connection errors** — confirm `DATABASE_URL` points to a **PostgreSQL** instance, not MySQL; the dependency list still includes `mysql`/`mysql2`, which can mislead you into pointing at the wrong database engine.
- **Image uploads failing** — `/api/upload` requires `CLOUD_NAME`, `API_KEY`, `API_SECRET` (Cloudinary), not the more common `CLOUDINARY_*` names.
- **Emails not sending** — `/api/send-mail` requires `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`; there is no `EMAIL_FROM`, the "from" address is derived from `EMAIL_USER`.
- **Payments failing in development** — `/api/payment` calls `IYZICO_BASE_URL` directly; make sure it points at iyzico's sandbox host during development, since the code performs raw signed HTTP calls rather than using the `iyzipay` SDK's own sandbox toggle.
- **NextAuth session issues in production** — no `NEXTAUTH_URL` is set in the sample env files; NextAuth v4 typically needs this set explicitly when deployed behind a proxy/CDN.
- **Seed does nothing** — `npm run seed` silently skips admin creation if any of `ADMIN_EMAIL`/`ADMIN_PASSWORD`/`ADMIN_NAME`/`ADMIN_SURNAME` are unset, and skips products/categories that already exist by name.

---

<div align="center">

_ModaPerde_

</div>
