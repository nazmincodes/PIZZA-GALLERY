# 🍕 PizzaHub — Pizza Ordering & Management Platform

PizzaHub is a full-stack pizza ordering and management platform designed to connect customers, vendors, and administrators through a seamless digital experience.

Customers can explore pizzas, place orders, and manage their accounts. Vendors can manage their menus and orders, while administrators can oversee platform activities and subscriptions.

## 🌐 Live Demo

**Live Website:** [Add Your Frontend Live URL]

**Backend API:** [Add Your Backend API URL]

## ✨ Key Features

### 👤 Authentication & Authorization
- Email and password authentication.
- Google authentication.
- Role-based access control.
- Separate dashboards for customers, vendors, and administrators.
- Secure user sessions.

### 🍕 Customer Features
- Browse available pizza items.
- Explore pizza details and categories.
- Place pizza orders.
- Track order information.
- Manage customer profile.
- Access personal dashboard.

### 🏪 Vendor Features
- Dedicated vendor dashboard.
- Manage pizza menu items.
- Add, update, and manage products.
- Manage incoming orders.
- View vendor-specific information.
- Access subscription details.

### 🛠️ Admin Features
- Dedicated admin dashboard.
- Manage platform users and vendors.
- Monitor orders and platform activities.
- Manage vendor subscriptions.
- View subscription status and payment history.
- Access platform management information.

### 💳 Subscription & Payment
- Free and Premium subscription plans.
- Stripe payment integration.
- Subscription status management.
- Subscription start and expiry information.
- Payment history tracking.

## 🧰 Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- DaisyUI

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB

### Authentication & Security
- Better Auth
- Google OAuth
- JWT

### Payment
- Stripe

### Additional Services
- ImgBB — Image Hosting
- Resend — Email Service
- Vercel — Deployment

## 📁 Project Structure

```text
pizzahub-client/
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── dashboard/
│   │   ├── menu/
│   │   ├── login/
│   │   └── register/
│   │
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── lib/
│   └── types/
│
├── .env
├── package.json
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone YOUR_FRONTEND_REPOSITORY_URL
```

### 2. Navigate to the Project

```bash
cd pizzahub-client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
BETTER_AUTH_SECRET=your_better_auth_secret
MONGODB_URL=your_mongodb_connection_string
BETTER_AUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
RESEND_API_KEY=your_resend_api_key

NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Important:** Never upload your actual environment variables or secret keys to GitHub.

### 5. Start the Development Server

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

## 🚀 Backend Setup

The backend runs as a separate Express.js application.

```bash
git clone YOUR_BACKEND_REPOSITORY_URL
cd pizzahub-server
npm install
```

Configure the backend environment variables before starting the server.

```bash
npm run dev
```

Make sure both frontend and backend servers are running during local development.

## 🔐 User Roles

| Role | Responsibilities |
|---|---|
| Customer | Browse pizzas, place orders, manage profile |
| Vendor | Manage menu items, orders, and subscriptions |
| Admin | Manage users, vendors, and platform activities |

## 💳 Payment Integration

PizzaHub uses Stripe to support subscription payments.

Vendors can access subscription plans and manage their Premium membership through the platform.

## 🌍 Deployment

- Frontend: Vercel
- Backend: Vercel
- Database: MongoDB Atlas

## 🎯 Project Goals

- Build a complete full-stack pizza ordering platform.
- Implement role-based dashboards.
- Integrate secure authentication.
- Connect frontend and backend APIs.
- Implement subscription and payment functionality.
- Develop a responsive and user-friendly interface.

## 👩‍💻 Developer

***Nazmin Akter***

Computer Science & Engineering Student

Interested in Full-Stack Web Development and MERN Stack Technologies.

---

⭐ If you find this project interesting, feel free to explore the repository!