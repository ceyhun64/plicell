# ModaPerde

ModaPerde is a modern, full-featured e-commerce platform specializing in curtains and window coverings. Built with Next.js and TypeScript, it offers a seamless online shopping experience for customers looking to purchase high-quality curtains, blinds, and related accessories. The platform includes user authentication, product management, shopping cart functionality, secure payments, and an admin dashboard for content management.

## Features

### Core E-commerce Functionality

- **Product Catalog**: Comprehensive product listings with categories (e.g., Plicell, Zebra, Stor, Wooden Blinds, Metal Blinds, Sheer Curtains, Vertical Blinds, Rustic Curtains, Drapes, Accessories)
- **Custom Measurements**: Products can be customized with width, height, and square meter calculations
- **Shopping Cart**: Persistent cart with guest and authenticated user support
- **Favorites**: Save favorite products for later
- **Secure Checkout**: Integrated with Iyzico payment gateway
- **Order Management**: Track orders from pending to delivered status
- **User Reviews**: Rate and review products
- **Search & Filtering**: Advanced product search and filtering capabilities

### User Management

- **Authentication**: NextAuth.js integration with email/password and social login options
- **User Profiles**: Manage personal information, addresses, and order history
- **Password Reset**: Secure password recovery via email
- **Role-based Access**: Separate user and admin roles

### Content Management

- **Blog System**: Create and manage blog posts
- **Banner Management**: Dynamic banner system for promotions
- **Newsletter Subscription**: Email subscription for marketing
- **Static Pages**: About, FAQ, Terms, Contact, and institutional pages

### Admin Dashboard

- **Product Management**: Add, edit, and delete products
- **Order Management**: View and update order statuses
- **User Management**: Manage user accounts and roles
- **Content Management**: Manage blogs, banners, and subscribers
- **Analytics**: Basic reporting and insights

### Technical Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Image Optimization**: Cloudinary integration for fast image loading
- **SEO Optimized**: Meta tags, Open Graph, and structured data
- **Performance**: Server-side rendering and static generation
- **Accessibility**: WCAG compliant components with shadcn/ui

## Tech Stack

### Frontend

- **Next.js 16**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **shadcn/ui**: Modern UI components built on Radix UI
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful icons

### Backend & Database

- **Prisma**: Type-safe ORM for database operations
- **MySQL**: Relational database
- **NextAuth.js**: Authentication and session management
- **bcrypt**: Password hashing
- **Nodemailer**: Email sending functionality

### Payments & Media

- **Iyzico**: Turkish payment gateway integration
- **Cloudinary**: Image hosting and optimization

### Development Tools

- **ESLint & TypeScript**: Code quality and type checking
- **PostCSS**: CSS processing
- **tsx**: TypeScript execution for scripts

## Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- MySQL database
- Cloudinary account (for image uploads)
- Iyzico merchant account (for payments)
- SMTP server (for emails)

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ModaPerde
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory with the following variables:

   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/modaperde"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
   CLOUDINARY_API_KEY="your-cloudinary-api-key"
   CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
   IYZICO_API_KEY="your-iyzico-api-key"
   IYZICO_SECRET_KEY="your-iyzico-secret-key"
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT="587"
   EMAIL_SERVER_USER="your-email@gmail.com"
   EMAIL_SERVER_PASSWORD="your-email-password"
   EMAIL_FROM="noreply@modaperde.com"
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # Seed the database (optional)
   npm run seed
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Customers

- Browse products by category or search
- Add items to cart with custom measurements
- Create an account or checkout as guest
- Complete payment via Iyzico
- Track orders in user profile

### For Admins

- Access admin dashboard at `/admin`
- Manage products, orders, users, and content
- View analytics and reports

## API Documentation

The application uses Next.js API routes. Key endpoints include:

### Authentication

- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signout` - User logout

### Products

- `GET /api/products` - Get all products
- `GET /api/products/[id]` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Cart & Orders

- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/[id]` - Update cart item
- `DELETE /api/cart/[id]` - Remove cart item
- `POST /api/order` - Create order
- `GET /api/order` - Get user's orders

### User Management

- `GET /api/user` - Get user profile
- `PUT /api/user` - Update user profile
- `GET /api/user/addresses` - Get user addresses
- `POST /api/user/addresses` - Add address

### Admin Endpoints

- `GET /api/admin/users` - List all users
- `GET /api/admin/orders` - List all orders
- `GET /api/admin/products` - List all products
- `POST /api/admin/banner` - Create banner
- `GET /api/blog` - Get blog posts
- `POST /api/blog` - Create blog post

All API endpoints return JSON responses. Authentication is required for protected routes using NextAuth.js sessions.

## Project Structure

```
ModaPerde/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── blog/              # Blog pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   └── ...                # Other pages
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── modules/          # Feature modules
│   └── ui/               # shadcn/ui components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── types/                # TypeScript type definitions
└── utils/                # Helper functions
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support or questions, please contact the development team or create an issue in the repository.

---

Built with ❤️ using Next.js and modern web technologies.
