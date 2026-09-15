# 🛍️ E-Commerce Platform — Frontend

A modern, responsive e-commerce frontend built with **Next.js, TypeScript, Tailwind CSS, and Redux Toolkit**. The application provides a complete shopping experience including authentication, product browsing, categories, variants, cart management, checkout, addresses, order tracking, and an admin interface.

## ✨ Features

### 👤 Authentication

* User registration and login
* JWT-based authentication using HTTP-only cookies
* Persistent authentication state
* Logout functionality
* Role-based access for users and admins

### 🛍️ Products

* Product listing
* Product details
* Category-based product browsing
* Product variants
* Variant selection
* Stock-aware cart operations

### 📂 Categories

* Browse available categories
* Filter products by category

### 🛒 Cart

* Add products to cart
* Select product variants
* Update quantities
* Remove cart items
* Clear cart
* Real-time cart state management

### 📍 Addresses

* Add delivery addresses
* View saved addresses
* Update addresses
* Delete addresses
* Select delivery address during checkout

### 📦 Orders

* Create orders from checkout
* View order history
* View order details
* Track order status
* Cancel eligible orders

### 👑 Admin

* Admin dashboard
* Category management
* Product management
* Order management
* View order details
* Update order status

## 🛠️ Tech Stack

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Redux Toolkit**
* **Framer Motion**
* **Fetch API**
* **REST API**

## 📁 Project Structure

```text
src/
├── app/
│   ├── admin/
│   ├── account/
│   ├── cart/
│   ├── checkout/
│   ├── login/
│   ├── register/
│   └── products/
│
├── components/
│
├── features/
│   ├── auth/
│   ├── cart/
│   ├── category/
│   ├── product/
│   ├── address/
│   ├── order/
│   └── admin-order/
│
├── lib/
│   └── api.ts
│
└── store/
```

## 🔗 Backend

This frontend communicates with the e-commerce REST API built with **Node.js, Express, TypeScript, Prisma, and PostgreSQL**.

The API URL is configured using:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For production, replace it with the deployed backend URL:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url/api
```

## ⚙️ Getting Started


```

### . Install dependencies

```bash
npm install
```

### 3 Configure environment variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### . Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 🏗️ Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## 🔐 Authentication

Authentication uses JWT tokens stored in **HTTP-only cookies**.

The frontend sends cookies with API requests using:

```text
credentials: "include"
```

This allows protected requests such as:

```text
GET /auth/me
GET /cart
GET /orders
GET /admin/orders
```

## 🔄 API Architecture

API calls are separated from UI components.

```text
Component
   ↓
Feature API
   ↓
lib/api.ts
   ↓
Express REST API
   ↓
Prisma
   ↓
PostgreSQL
```

**Redux Toolkit is used for application state management, not for API calls.**

## 📌 Main Routes

### User

```text
/
 /products
 /products/[id]
 /cart
 /checkout
 /account/orders
 /account/orders/[id]
```

### Authentication

```text
/login
/register
```

### Admin

```text
/admin
/admin/categories
/admin/products
/admin/orders
/admin/orders/[id]
```

## 🚀 Deployment

The frontend can be deployed using **Vercel**.

Before deployment, configure:

```env
NEXT_PUBLIC_API_URL=<production-backend-api-url>
```

Make sure the production backend allows requests from the deployed frontend origin.

## 👨‍💻 Author

**Nehal Tariq**

Full Stack Web Developer

Built with **Next.js, TypeScript, Tailwind CSS, Redux Toolkit, Node.js, Prisma, and PostgreSQL**.
