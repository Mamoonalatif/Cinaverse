# CinaVerse Backend - Simplified

## ✅ Complete & Optimized

**9 Modules** - Each with simple Controller + Service only (no DTOs, no spec files)

### 📁 Structure
```
src/
├── auth/           (register, login, logout)
├── users/          (profile get/update)
├── movies/         (search, details, trailer, streaming)
├── watchlist/      (CRUD)
├── reviews/        (CRUD)
├── parental/       (settings)
├── plans/          (Stripe payments)
├── admin/          (user & review management)
├── logs/           (activity logs)
├── entities/       (10 database models)
├── common/         (guards & decorators)
├── config/         (PostgreSQL setup)
├── app.module.ts
└── main.ts
```

## 🚀 Quick Start

```bash
cd backend
npm install
```

Configure `.env`:
```env
DATABASE_HOST=localhost
DATABASE_PASSWORD=postgres
JWT_SECRET=your_secret
TMDB_API_KEY=your_key
STRIPE_SECRET_KEY=your_key
```

Run:
```bash
npm run start:dev
```

## 📊 API Routes

- `POST /auth/register, /login, /logout`
- `GET /users/profile`, `PUT /users/profile`
- `GET /movies/search`, `GET /movies/:id`, `GET /movies/:id/trailer`
- `POST /watchlist`, `GET /watchlist`, `DELETE /watchlist/:id`
- `POST /reviews`, `GET /reviews/:movieId`, `PUT /reviews/:id`, `DELETE /reviews/:id`
- `POST /parental/settings`, `GET /parental/settings`
- `GET /plans`, `POST /plans/purchase`
- `GET /admin/users`, `DELETE /admin/users/:id`, `DELETE /admin/reviews/:id`, `GET /admin/logs`
- `GET /logs`

## ✨ Features

✅ JWT Authentication + Password Hashing  
✅ Role-Based Access Control  
✅ PostgreSQL + TypeORM  
✅ TMDb API Integration  
✅ Stripe Payments  
✅ Modular Architecture  
✅ Short, Optimized Code  

Ready to connect with frontend!
