# CinaVerse API Documentation

## Base URL
```
http://localhost:3001
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Auth Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

---

## 👤 User Endpoints

### Get Profile
```http
GET /users/profile
Authorization: Bearer <token>
```

### Update Profile
```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newemail@example.com"
}
```

---

## 🎬 Movies Endpoints

### Search Movies
```http
GET /movies/search?q=Inception
```

### Get Movie Details
```http
GET /movies/550
```

### Get Movie Trailer
```http
GET /movies/550/trailer
```

### Get Streaming Availability
```http
GET /movies/550/streaming
```

---

## 📌 Watchlist Endpoints

### Add to Watchlist
```http
POST /watchlist
Authorization: Bearer <token>
Content-Type: application/json

{
  "movieId": "550"
}
```

### Get Watchlist
```http
GET /watchlist
Authorization: Bearer <token>
```

### Remove from Watchlist
```http
DELETE /watchlist/1
Authorization: Bearer <token>
```

---

## ⭐ Reviews Endpoints

### Create Review
```http
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "movieId": "550",
  "rating": 9,
  "comment": "Amazing movie!"
}
```

### Get Reviews for Movie
```http
GET /reviews/550
```

### Update Review
```http
PUT /reviews/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 10,
  "comment": "Updated review"
}
```

### Delete Review
```http
DELETE /reviews/1
Authorization: Bearer <token>
```

---

## 👨‍👩‍👧 Parental Control Endpoints

### Set Parental Settings
```http
POST /parental/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "minAge": 13,
  "bannedGenres": "Horror,Violence"
}
```

### Get Parental Settings
```http
GET /parental/settings
Authorization: Bearer <token>
```

---

## 💳 Plans & Subscription Endpoints

### Get All Plans
```http
GET /plans
```

### Purchase Plan
```http
POST /plans/purchase
Authorization: Bearer <token>
Content-Type: application/json

{
  "planId": 1,
  "paymentMethodId": "pm_card_visa"
}
```

---

## 🛠️ Admin Endpoints
**Requires admin role**

### Get All Users
```http
GET /admin/users
Authorization: Bearer <admin_token>
```

### Delete User
```http
DELETE /admin/users/5
Authorization: Bearer <admin_token>
```

### Delete Review
```http
DELETE /admin/reviews/10
Authorization: Bearer <admin_token>
```

### Get Activity Logs
```http
GET /admin/logs
Authorization: Bearer <admin_token>
```

### Get All Watchlists
```http
GET /admin/watchlists
Authorization: Bearer <admin_token>
```

---

## 📊 Logs Endpoints

### Get User Logs
```http
GET /logs
Authorization: Bearer <token>
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Not Found"
}
```

---

## Testing with cURL

### Example: Complete Flow
```bash
# 1. Register
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# 2. Login
TOKEN=$(curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}' \
  | jq -r '.access_token')

# 3. Search movies
curl -X GET "http://localhost:3001/movies/search?q=Matrix" \
  -H "Authorization: Bearer $TOKEN"

# 4. Add to watchlist
curl -X POST http://localhost:3001/watchlist \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"movieId":"603"}'

# 5. Get watchlist
curl -X GET http://localhost:3001/watchlist \
  -H "Authorization: Bearer $TOKEN"
```

---

## Database Schema

### Tables Created:
- `user` - User accounts
- `role` - User roles
- `watchlist` - User watchlists
- `review` - Movie reviews
- `movie_cache` - Cached API responses
- `parental_settings` - Parental controls
- `plan` - Subscription plans
- `subscription` - User subscriptions
- `payment` - Payment records
- `log` - Activity logs

---

**Built for CinaVerse - Movie Discovery Platform**
