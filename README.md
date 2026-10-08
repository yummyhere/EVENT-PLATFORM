# 🎟️ CommuniVibe — Community Event Booking & Management Platform

A production-quality, full-stack **Community Event Booking & Management Platform** built with **React (Vite)**, **Node.js + Express**, and **SQLite3**. Features JWT authentication, relational foreign key constraints, atomic transactional bookings, live debounced search/filtering, an interactive ticket reservation modal, and an active vs. past user reservation dashboard with cancellation support.

---

## 🚀 Key Features

1. **Robust Authentication & Security (JWT)**:
   - User registration and login with secure **bcrypt** password hashing (10 salt rounds).
   - Bearer token authorization middleware with auto-logout on expiration/invalid token.
   - Never exposes password hashes in responses.

2. **Relational Database with Transactions (SQLite3)**:
   - Strict `PRAGMA foreign_keys = ON;` schema enforcement with `ON DELETE CASCADE`.
   - Atomic database transactions for booking creation and seat updates to prevent race conditions and overbooking.
   - Index optimization on `user_id`, `event_id`, `event_date`, and `category`.

3. **Event Discovery & Filtering Interface**:
   - Responsive grid of event cards featuring images, date/time, venue, category badge, real-time availability, and pricing.
   - Instant multi-parameter filtering: keyword search (title, description, location), category dropdown, date selector, and an **"Upcoming events only"** toggle.
   - Sold out and past event visual badges with automatic button disabling.

4. **Interactive Booking Workflow**:
   - Live modal with event summary, ticket stepper (quantity 1 to available seats), and dynamic price calculation.
   - Prevents booking for past events or exceeding remaining capacity.
   - Seamless list refresh and toast feedback upon completion.

5. **User Reservation Dashboard ("My Bookings")**:
   - Protected route with two dedicated tabs: **Active Bookings** (upcoming confirmed reservations) and **Past / Cancelled History**.
   - One-click **Cancel Booking** capability that atomically restores seats back to the event.

6. **Clean Modern Design (White & Blue Theme)**:
   - High-contrast, accessible, and clean aesthetic with CSS variables (`--primary: #2563eb`).
   - Fully responsive across desktop, tablet, and mobile devices.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18 (Vite), React Router v6, Context API, Axios, Lucide Icons, Pure CSS |
| **Backend** | Node.js, Express.js |
| **Database** | SQLite3 (`sqlite3` driver with Foreign Keys & ACID Transactions) |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` |
| **Utilities & Middleware** | `cors`, `dotenv`, centralized error handlers, input validators |

---

## 📁 Monorepo Project Structure

```
EVENT PLATFORM/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js               # SQLite3 connection, foreign keys & promise wrappers
│   │   │   └── env.js              # Environment variable loader
│   │   ├── controllers/
│   │   │   ├── authController.js   # Register, login, profile check
│   │   │   ├── bookingController.js# Transactional booking, user bookings, cancellation
│   │   │   └── eventController.js  # Event search, filters, single event detail
│   │   ├── database/
│   │   │   ├── schema.sql          # Users, events, bookings tables with FKs & indexes
│   │   │   └── seed.js             # 12 sample events (upcoming & past) + demo user
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js   # JWT verification & req.user attachment
│   │   │   ├── errorMiddleware.js  # Centralized JSON error handling & 404 handler
│   │   │   └── validateMiddleware.js # Input validation helpers
│   │   ├── routes/
│   │   │   ├── authRoutes.js       # /api/auth endpoints
│   │   │   ├── bookingRoutes.js    # /api/bookings endpoints
│   │   │   ├── eventRoutes.js      # /api/events endpoints
│   │   │   └── userRoutes.js       # /api/user endpoints
│   │   ├── app.js                  # Express middleware pipeline setup
│   │   └── server.js               # Server entry point (auto DB init + listener)
│   ├── .env.example
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js            # Axios client with JWT interceptor & 401 handler
│   │   ├── components/
│   │   │   ├── BookingModal.jsx    # Live price calculation & ticket stepper modal
│   │   │   ├── EventCard.jsx       # Event card with status badges & book button
│   │   │   ├── Loader.jsx          # Loading spinner
│   │   │   ├── Navbar.jsx          # Header with dynamic auth navigation
│   │   │   ├── ProtectedRoute.jsx  # Route guard for /my-bookings
│   │   │   ├── SearchFilters.jsx   # Search input, category, date & upcoming toggles
│   │   │   └── Toast.jsx           # Success and error notifications
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # User state, token persistence & auth actions
│   │   ├── pages/
│   │   │   ├── EventDetail.jsx     # Single event view with full description & stats
│   │   │   ├── Events.jsx          # Main event catalog & filter view
│   │   │   ├── Login.jsx           # Login page with demo autofill
│   │   │   ├── MyBookings.jsx      # Dashboard with Active vs Past tabs & cancel action
│   │   │   ├── NotFound.jsx        # 404 page
│   │   │   └── Register.jsx        # User registration page
│   │   ├── styles/
│   │   │   └── global.css          # White & Blue CSS custom design tokens
│   │   ├── App.jsx                 # Routes configuration & layout
│   │   └── main.jsx                # Application root with BrowserRouter & AuthProvider
│   ├── index.html                  # HTML template with Inter font & SEO meta
│   ├── vite.config.js
│   ├── .env.example
│   ├── .env
│   └── package.json
├── .gitignore
├── package.json                    # Monorepo convenience scripts
└── README.md
```

---

## ⚡ Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher (v20+ / v24+ supported)
- **npm**: v9.0.0 or higher

---

## ⚙️ Environment Variables Template

### Backend (`backend/.env`)
```env
PORT=5000
JWT_SECRET=super_secret_jwt_key_community_events_2026_dev
JWT_EXPIRES_IN=1d
DB_PATH=./src/database/events.db
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Step-by-Step Installation & Setup

### 1. Clone & Navigate to Project
```bash
cd "EVENT PLATFORM"
```

### 2. Install Dependencies
Install both backend and frontend dependencies:
```bash
# Install backend packages
cd backend
npm install

# Install frontend packages
cd ../frontend
npm install

# Return to root
cd ..
```

### 3. Seed Database
Initialize SQLite database schema and insert demo user + 12 sample events:
```bash
cd backend
npm run seed
cd ..
```

> **Seeding Output**:
> - 👤 Demo User: `demo@community.com` / `password123`
> - 📅 12 Curated Events (Tech, Music, Food, Wellness, Charity, Business)
> - 🎟️ Sample active and past bookings for testing the dashboard.

---

## 🏃 Running the Application

### Option A: Run Both Simultaneously (Two Terminals)

**Terminal 1 — Backend Server:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 — Frontend App:**
```bash
cd frontend
npm run dev
# Vite runs on http://localhost:5173
```

Open your browser and navigate to **`http://localhost:5173`**.

---

## 👤 Demo Credentials

For quick evaluation, use the pre-configured demo account or click **"Fill Demo Credentials"** on the Login page:
- **Email**: `demo@community.com`
- **Password**: `password123`

*(Or register any new account on `/register`)*

---

## 📖 API Documentation

### Base URL: `http://localhost:5000/api`

### 1. Authentication Endpoints

#### `POST /auth/register`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "password": "password123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "user": {
      "id": 2,
      "name": "Alex Johnson",
      "email": "alex@example.com",
      "created_at": "2026-10-07T05:54:00.000Z"
    }
  }
  ```

#### `POST /auth/login`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "demo@community.com",
    "password": "password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "user": {
      "id": 1,
      "name": "Alex Johnson",
      "email": "demo@community.com",
      "created_at": "2026-10-07T05:50:00.000Z"
    }
  }
  ```

#### `GET /auth/me`
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Response (200 OK)**: Current authenticated user details.

---

### 2. Events Endpoints

#### `GET /events`
- **Auth Required**: No
- **Query Parameters**:
  - `search`: filters by title, description, or location keyword
  - `category`: filters by category (e.g., `Technology`, `Music`, `Food & Drink`)
  - `date`: filters by specific date (`YYYY-MM-DD`)
  - `upcoming`: `true` to filter events occurring today or in the future
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "count": 12,
    "categories": ["Arts & Crafts", "Business", "Community & Charity", "Food & Drink", "Music", "Technology", "Wellness & Fitness"],
    "events": [
      {
        "id": 1,
        "title": "Community Web3 & AI Developer Summit 2026",
        "description": "Join industry pioneers...",
        "category": "Technology",
        "location": "Innovation Hub Auditorium, 400 Tech Plaza",
        "event_date": "2026-10-12 09:30:00",
        "price": 25.0,
        "total_seats": 120,
        "available_seats": 84,
        "image_url": "https://images.unsplash.com/..."
      }
    ]
  }
  ```

#### `GET /events/:id`
- **Auth Required**: No
- **Response (200 OK)**: Full details of a single event with real-time booking statistics.

---

### 3. Bookings Endpoints

#### `POST /bookings`
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Request Body**:
  ```json
  {
    "event_id": 1,
    "tickets": 2
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Tickets booked successfully!",
    "booking": {
      "id": 4,
      "user_id": 1,
      "event_id": 1,
      "tickets": 2,
      "total_price": 50.0,
      "status": "confirmed",
      "booked_at": "2026-10-07 11:00:00",
      "event_title": "Community Web3 & AI Developer Summit 2026",
      "event_date": "2026-10-12 09:30:00",
      "event_location": "Innovation Hub Auditorium, 400 Tech Plaza",
      "event_category": "Technology",
      "unit_price": 25.0,
      "remaining_seats": 82
    }
  }
  ```

#### `GET /user/bookings`
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "count": 3,
    "bookings": [
      {
        "id": 1,
        "user_id": 1,
        "event_id": 1,
        "tickets": 2,
        "total_price": 50.0,
        "status": "confirmed",
        "booked_at": "2026-10-05 11:00:00",
        "event_title": "Community Web3 & AI Developer Summit 2026",
        "event_date": "2026-10-12 09:30:00",
        "event_location": "Innovation Hub Auditorium",
        "event_category": "Technology",
        "unit_price": 25.0,
        "is_active": true,
        "is_upcoming": true
      }
    ]
  }
  ```

#### `PATCH /bookings/:id/cancel`
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Response (200 OK)**: Cancels reservation and releases tickets back to the event atomically.

---

## 📜 Recommended Git Commit History (Conventional Commits)

```
1. chore: initialize repository with .gitignore and folder structure
2. feat(backend): setup express server and sqlite connection
3. feat(db): add users, events and bookings schema with foreign keys
4. feat(auth): add register and login endpoints with JWT
5. feat(api): add events listing endpoint with search filters
6. feat(api): add booking creation and user bookings endpoints
7. chore(db): add seed script
8. feat(frontend): setup react app, routing and theme
9. feat(auth-ui): add AuthContext, login/register pages and protected routes
10. feat(events-ui): add events page with search filters and event cards
11. feat(booking-ui): add booking modal workflow
12. feat(dashboard): add My Bookings dashboard with active/past sections
13. docs: add README with setup instructions and env templates
```

---

## 🧪 Requirement Verification Checklist

- [x] **A1. JWT Authentication**: `POST /api/auth/register`, `POST /api/auth/login`, Bearer token auth middleware, bcrypt hashing, secret & expiry from env.
- [x] **A2. SQLite3 Relational Schema**: `PRAGMA foreign_keys = ON`, `Users`, `Events`, `Bookings` with `ON DELETE CASCADE`, check constraints, indexes, auto-initialization on startup, and seed script with 12 events + demo user.
- [x] **A3. Required API Endpoints**:
  - `GET /api/events` (with search, category, date, upcoming filters)
  - `POST /api/bookings` (protected, atomic database transaction decreasing seats)
  - `GET /api/user/bookings` (protected, joined with event details, sorted newest first, active vs past flag)
  - `PATCH /api/bookings/:id/cancel` & `GET /api/events/:id` (bonus endpoints)
- [x] **A4. Backend Quality**: Proper HTTP status codes, consistent JSON responses, parameterized queries, centralized error & 404 handler, CORS configured via env.
- [x] **B1. Global State & Protected Routes**: `AuthContext` (login, register, logout, session restoration), Axios instance with auto JWT attachment and 401 handling, `ProtectedRoute` for `/my-bookings`, dynamic Navbar.
- [x] **B2. Event Browse Interface**: Responsive event card grid, debounced search & filter bar, loading/empty/error states, sold out & past event handling, guest redirect to login.
- [x] **B3. Booking Workflow**: Interactive `BookingModal` with event summary, ticket stepper, live total price, loading states, error display, automatic seat update.
- [x] **B4. User Dashboard**: Protected `/my-bookings` with "Active Bookings" and "Past / Cancelled" tabs, full booking details, empty states, and cancel reservation action.
- [x] **B5. Auth Pages**: Login & Register pages with validation, error messaging, and quick demo autofill.
- [x] **5. Design & Theme**: White & Blue palette (`--primary: #2563eb`), Inter font, responsive layout, clear success/error visual indicators.
- [x] **6. Documentation & Git**: Complete README, `.env.example` templates, API spec, conventional commit history.

---

## 📄 License

This project is licensed under the MIT License.
