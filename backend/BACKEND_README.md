# CinaVerse Backend - NestJS + PostgreSQL

Production-ready REST API backend for the CinaVerse movie discovery platform.

## 🏗️ Architecture

Built with **modular separation of concerns**:
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Entities**: TypeORM database models
- **DTOs**: Request/response validation
- **Guards**: JWT authentication & role-based authorization

## 📦 Tech Stack

- **NestJS** - Scalable Node.js framework
- **TypeORM** - ORM for PostgreSQL
- **PostgreSQL** - Relational database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Stripe** - Payment processing
- **TMDb API** - Movie data
- **Axios** - HTTP client

## 📂 Project Structure

```
src/
├── auth/              # Authentication module (register, login, JWT)
├── users/             # User profile management
├── movies/            # Movie search, details, trailers (TMDb API)
├── watchlist/         # User watchlist CRUD
├── reviews/           # Movie reviews and ratings
├── parental/          # Parental controls (age & genre restrictions)
├── plans/             # Subscription plans & Stripe payments
├── admin/             # Admin panel APIs (user/review management)
├── logs/              # Activity logging
├── entities/          # TypeORM entities (User, Review, etc.)
├── common/            # Guards, decorators, utilities
│   ├── guards/        # JwtAuthGuard, RolesGuard
│   └── decorators/    # @Roles, @AuthUser
├── config/            # Database & environment config
└── main.ts            # App entry point
```

## 🗄️ Database Entities

- **User** - User accounts (email, password, role)
- **Role** - User roles (admin, user)
- **Watchlist** - User movie watchlists
- **Review** - Movie reviews & ratings
- **MovieCache** - Cached TMDb API responses
- **ParentalSettings** - Age & genre restrictions
- **Plan** - Subscription plans
- **Subscription** - User subscriptions
- **Payment** - Stripe payment records
- **Log** - Activity logs (API usage, login/logout)

## 🔐 API Endpoints

### Auth (FR-1, FR-2, FR-3)
```
POST   /auth/register      - Register new user
POST   /auth/login         - Login & get JWT token
POST   /auth/logout        - Logout (protected)
```

### Users
```
GET    /users/profile      - Get user profile (protected)
PUT    /users/profile      - Update profile (protected)
```

### Movies (FR-4, FR-5)
```
GET    /movies/search?q=   - Search movies (TMDb)
GET    /movies/:id         - Get movie details
GET    /movies/:id/trailer - Get movie trailer
GET    /movies/:id/streaming - Get streaming availability
```

### Watchlist (FR-6)
```
POST   /watchlist          - Add to watchlist (protected)
GET    /watchlist          - Get user watchlist (protected)
DELETE /watchlist/:id      - Remove from watchlist (protected)
```

### Reviews (FR-7)
```
POST   /reviews            - Create review (protected)
GET    /reviews/:movieId   - Get reviews for movie
PUT    /reviews/:id        - Update review (protected)
DELETE /reviews/:id        - Delete review (protected)
```

### Parental (FR-10)
```
POST   /parental/settings  - Set parental controls (protected)
GET    /parental/settings  - Get parental settings (protected)
```

### Plans (FR-11, FR-12)
```
GET    /plans              - Get all subscription plans
POST   /plans/purchase     - Purchase plan with Stripe (protected)
```

### Admin (FR-9) - Requires admin role
```
GET    /admin/users        - Get all users
DELETE /admin/users/:id    - Delete user
DELETE /admin/reviews/:id  - Delete review
GET    /admin/logs         - View activity logs
GET    /admin/watchlists   - View all watchlists
```

### Logs (FR-13)
```
GET    /logs               - Get user activity logs (protected)
```

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=3001
NODE_ENV=development

# PostgreSQL Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=cinaverse

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=1d

# TMDb API
TMDB_API_KEY=your_tmdb_api_key

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 3. Setup PostgreSQL Database
```bash
# Install PostgreSQL
# Create database
createdb cinaverse

# Or use pgAdmin / SQL:
CREATE DATABASE cinaverse;
```

### 4. Run Database Migrations
```bash
# TypeORM will auto-create tables (synchronize: true in dev)
npm run start:dev
```

### 5. Start Development Server
```bash
npm run start:dev
```

Backend runs on: `http://localhost:3001`

## 📝 API Testing

Test endpoints with:
- **Postman** / **Insomnia**
- **Thunder Client** (VS Code extension)
- **cURL**

Example:
```bash
# Register
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Search movies (with JWT token)
curl -X GET "http://localhost:3001/movies/search?q=Inception" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔒 Security Features

✅ **JWT Authentication** - Secure token-based auth  
✅ **Password Hashing** - Bcrypt with salt rounds  
✅ **Role-Based Access Control** - Admin vs User  
✅ **Input Validation** - Class-validator DTOs  
✅ **CORS** - Configured for frontend  
✅ **Environment Variables** - Secrets never committed  

## 🧪 Running Tests
```bash
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Coverage report
```

## 📊 Logging

All user activities are logged:
- Login/logout events
- Movie API calls
- Watchlist changes
- Payment transactions

View logs:
```bash
GET /admin/logs (admin only)
GET /logs (user's own logs)
```

## 🎯 Functional Requirements Mapping

| FR  | Feature | Implementation |
|-----|---------|----------------|
| FR-1 | User Registration | `POST /auth/register` |
| FR-2 | User Login | `POST /auth/login` |
| FR-3 | User Logout | `POST /auth/logout` |
| FR-4 | Movie Search | `GET /movies/search` |
| FR-5 | Movie Details | `GET /movies/:id` |
| FR-6 | Watchlist | `CRUD /watchlist` |
| FR-7 | Reviews | `CRUD /reviews` |
| FR-8 | Streaming Availability | `GET /movies/:id/streaming` |
| FR-9 | Admin Panel | `/admin/*` routes |
| FR-10 | Parental Controls | `/parental/settings` |
| FR-11 | Subscription Plans | `GET /plans` |
| FR-12 | Payment Integration | `POST /plans/purchase` |
| FR-13 | Activity Logging | Automatic logging service |

## 🛠️ Production Build
```bash
npm run build
npm run start:prod
```

## 📄 License
UNLICENSED - Academic project for 5th semester Software Engineering

---

**Built with ❤️ for CinaVerse - Movie Discovery Platform**
