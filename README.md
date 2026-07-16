# ⚡ QuickCylinder — LPG Gas Booking System

> **Your Gas, Your Way — Booked in a Flash ⚡**

A production-grade, full-stack LPG Gas Cylinder Booking Web Application for India, built with **React**, **Spring Boot**, and **MariaDB**. Features a premium **Liquid Glass Morphism** UI with 3D animated backgrounds.

---

## 🎯 Overview

QuickCylinder enables users to book LPG gas cylinders from India's top 3 government-authorized providers — **Indane Gas (IOCL)**, **HP Gas (HPCL)**, and **Bharat Gas (BPCL)** — through a sleek, fintech-grade interface.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite |
| **Backend** | Spring Boot 3.3 (Java 17) |
| **Database** | MariaDB |
| **Auth** | JWT (JSON Web Tokens) |
| **3D Graphics** | Three.js + React Three Fiber |
| **Animations** | Framer Motion |
| **Styling** | Liquid Glass Morphism (Custom CSS) |

## ✨ Features

### User Features
- 🔐 **JWT Authentication** — Secure registration and login
- 🏠 **6-Step Booking Flow** — Provider → Consumer → Delivery → Summary → Payment → Confirmation
- 💳 **Payment Simulation** — UPI, Credit/Debit Card (3D animated), Net Banking, Wallets
- 📊 **Dashboard** — Booking history, stats, active orders
- 📦 **Booking Tracking** — Status timeline (Confirmed → Dispatched → Out for Delivery → Delivered)
- 🧾 **PDF Receipt** — Downloadable booking receipts
- ❌ **Cancel Booking** — Cancel active orders
- 🎫 **Support Tickets** — Submit and track support requests

### Admin Features
- 📈 **Revenue Dashboard** — Total users, bookings, revenue stats
- 👥 **User Management** — View all registered users
- 📋 **Booking Management** — View/update all bookings and statuses
- 💰 **Price Management** — Update cylinder prices by city
- 🎫 **Ticket Management** — View and respond to support tickets

### UI/UX
- 🔮 **Liquid Glass Morphism** — Premium glassmorphism effects throughout
- 🎨 **3D Animated Background** — Floating glass spheres, cubes, torus shapes with mouse parallax
- ⚡ **Micro-animations** — Smooth transitions, hover effects, confetti on booking
- 📱 **Responsive Design** — Mobile-first, works on all devices
- 🌙 **Dark Theme** — Navy-to-dark-blue gradient

## 🧠 How It Works (Architecture Overview)

### 1. Authentication (Login/Signup)
The app uses a completely stateless, JWT-based authentication system:
- **Backend:** When a user registers, Spring Security hashes their password using `Bcrypt` and saves the user to MariaDB. On login, if the credentials match, the backend generates a secure **JWT (JSON Web Token)** containing the User ID and Role.
- **Frontend:** The React frontend receives this token and stores it in `localStorage`. An Axios **Request Interceptor** automatically attaches this JWT to the `Authorization: Bearer <token>` header for all future API requests. If a token expires, a response interceptor catches the `401 Unauthorized` error and logs the user out.

### 2. The Booking Flow
The booking flow is designed as a multi-step wizard managed by React Context:
- **State Management:** `BookingContext.jsx` remembers user choices across steps (Provider → Consumer → Delivery → Summary → Payment).
- **Finalization:** Upon hitting "Pay", the frontend gathers the scattered state into a JSON payload and POSTs it to the `/api/bookings` endpoint.
- **Backend Processing:** `BookingService.java` takes over. It creates or finds an `LpgConnection`, creates a `DeliveryAddress`, links them to a new `Booking` record, generates a unique `QC-XXXX` tracking ID, saves it to MariaDB, and logs a `BookingStatusHistory` event.

### 3. Dashboard & Receipt Generation
- **Dashboard:** Fetches live bookings via `GET /api/bookings`. Because of the JWT token, the backend securely returns only the bookings belonging to the logged-in user.
- **Cancel Booking:** Hitting cancel calls `PUT /api/bookings/{id}/cancel`. The backend verifies ownership and updates the status to `CANCELLED`.
- **Download Receipt:** Clicking "Download Receipt" calls `/api/bookings/{id}/receipt`. The backend dynamically generates a beautifully formatted plain-text (`.txt`) bill containing all transaction details and triggers a native browser download.

## 🏢 Gas Providers

| Provider | Parent Company | Customer Care |
|----------|---------------|---------------|
| 🔥 Indane Gas | Indian Oil Corporation (IOCL) | 1800-2333-555 |
| ⛽ HP Gas | Hindustan Petroleum (HPCL) | 1800-2333-666 |
| 🛢️ Bharat Gas | Bharat Petroleum (BPCL) | 1800-224-344 |

## ⛽ Cylinder Types & Pricing

| Type | Weight | Approx. Price |
|------|--------|--------------|
| Domestic LPG | 14.2 kg | ~₹803 |
| Commercial LPG | 19 kg | ~₹1,800+ |
| Free Trade (Chhotu) | 5 kg | ~₹339 |

City-based pricing for 14 major cities: Delhi, Mumbai, Kolkata, Chennai, Bangalore, Hyderabad, Pune, Ahmedabad, Jaipur, Lucknow, Patna, Chandigarh, Bhopal, Guwahati.

## 🚀 Setup & Installation

### Prerequisites
- Java 17+
- Node.js 18+
- MariaDB 10.5+

### 1. Database Setup
```bash
sudo mariadb -e "
CREATE DATABASE IF NOT EXISTS quickcylinder CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'quickcylinder'@'localhost' IDENTIFIED BY 'QuickCyl2025!';
GRANT ALL PRIVILEGES ON quickcylinder.* TO 'quickcylinder'@'localhost';
FLUSH PRIVILEGES;
"
```

### 2. Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```
Backend starts at `http://localhost:8080`

### 3. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
Frontend starts at `http://localhost:5173`

### Default Admin Credentials
- **Email:** admin@quickcylinder.com
- **Password:** Admin@123

## 📁 Project Structure

```
QuickCylinder/
├── frontend/                     # React + Vite
│   ├── src/
│   │   ├── api/                  # Axios API client
│   │   ├── components/
│   │   │   ├── booking/          # 6-step booking flow
│   │   │   └── layout/           # Navbar, Footer, 3D Background
│   │   ├── context/              # Auth & Booking state
│   │   ├── data/                 # Providers, cities, banks
│   │   ├── pages/                # Home, Login, Register, Dashboard, Admin
│   │   └── index.css             # Glass morphism design system
│   └── package.json
│
├── backend/                      # Spring Boot
│   ├── src/main/java/com/quickcylinder/
│   │   ├── config/               # Security, Data Initializer
│   │   ├── controller/           # REST APIs
│   │   ├── dto/                  # Request/Response DTOs
│   │   ├── entity/               # JPA entities
│   │   │   ├── User.java
│   │   │   ├── Booking.java
│   │   │   ├── LpgConnection.java
│   │   │   ├── DeliveryAddress.java
│   │   │   ├── CylinderPrice.java
│   │   │   ├── SupportTicket.java
│   │   │   ├── Notification.java
│   │   │   └── BookingStatusHistory.java
│
├── setup_db.sh                   # Database setup script
└── README.md
```

## 🔒 Security

- BCrypt password encryption
- JWT token-based authentication (24h expiry)
- Protected API routes with role-based access
- CORS configured for frontend origin
- Input validation on all endpoints

## 💳 Payment Simulation

> ⚠️ **No real money is transacted.** All payment processing is simulated with realistic UI behavior.

- **UPI:** Enter UPI ID or select popular apps (GPay, PhonePe, Paytm, BHIM) + QR code
- **Card:** 3D animated card with auto brand detection (Visa, Mastercard, RuPay), flip animation for CVV
- **Net Banking:** 8 popular banks + "Other Banks" dropdown
- **Wallets:** Paytm, PhonePe, Amazon Pay, Mobikwik
- **Processing:** Animated overlay with progress bar and step-by-step status
- **Success:** Confetti animation + booking confirmation

## 📜 License

This project is for educational and demonstration purposes.

---

**Built with ❤️ for India** 🇮🇳