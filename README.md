# KosHub-Accommodation

Backend API service untuk manajemen akomodasi kos (boarding house) dengan fitur booking dan membership.

## Deskripsi

KosHub-Accommodation adalah RESTful API yang dibangun menggunakan Express.js untuk mengelola:
- **Akomodasi** - CRUD data kos/penginapan
- **Booking** - Sistem pemesanan dengan kalkulasi harga otomatis
- **User** - Manajemen profil pengguna dengan level membership
- **Authentication** - Login/Register menggunakan Supabase Auth

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js 5
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth + JWT
- **Containerization**: Docker

## Struktur Proyek

```
├── app.js                 # Express app configuration
├── index.js               # Entry point
├── env.js                 # Environment loader
├── controllers/           # Business logic
├── db/
│   └── pool.js            # PostgreSQL connection pool
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── routes/
│   ├── accommodations.js  # Accommodation endpoints
│   ├── authenticate.js    # Auth endpoints (login/register)
│   └── bookings.js        # Booking endpoints
├── services/
│   └── users.js           # User profile endpoints
├── Dockerfile
└── docker-compose.yml
```

## Instalasi & Setup

### Prerequisites
- Node.js 20+
- PostgreSQL atau Supabase account
- Docker (optional)

### 1. Clone Repository
```bash
git clone https://github.com/wiijaakk/KosHub-Accommodation.git
cd KosHub-Accommodation
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Buat file `.env` di root project:
```env
PORT=3000
DATABASE_URL=postgresql://user:password@host:port/database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_JWT_SECRET=your-jwt-secret
```

### 4. Jalankan Aplikasi

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

### 5. Menggunakan Docker
```bash
docker-compose up --build
```

## API Endpoints

### Authentication (`/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login dengan email & password |
| POST | `/auth/register` | Register user baru |

### Users (`/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get current user profile |
| PUT | `/users` | Update profile & membership |

### Accommodations (`/accommodations`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/accommodations` | List semua akomodasi tersedia |
| POST | `/accommodations` | Tambah akomodasi baru |
| GET | `/accommodations/:id` | Detail akomodasi |

### Bookings (`/bookings`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/bookings` | List semua booking |
| POST | `/bookings` | Buat booking baru |
| PUT | `/bookings/:id` | Update status booking |
| GET | `/bookings/active/:id` | List booking yang aktif |

> API dalam Users, Accommodations, dan Bookings Membutuhkan Authorization header dengan Bearer token

## Membership Levels

| Level | Discount Rate |
|-------|---------------|
| BASIC | 0% |
| SILVER | 5% |
| GOLD | 10% |

## Contoh Request

### Register
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "membership_level": "SILVER"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create Booking
```bash
curl -X POST http://localhost:3000/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "accommodation_id": 1,
    "start_date": "2026-01-15",
    "end_date": "2026-02-15"
  }'
```

## Database Schema

### Users
- `id` (UUID, from Supabase Auth)
- `name` (VARCHAR)
- `membership_level` (ENUM: BASIC, SILVER, GOLD)
- `discount_rate` (DECIMAL)

### Accommodations
- `accommodation_id` (SERIAL)
- `name` (VARCHAR)
- `address` (VARCHAR)
- `city` (VARCHAR)
- `price` (DECIMAL)
- `total_units` (INTEGER)
- `available_units` (INTEGER)

### Bookings
- `booking_id` (SERIAL)
- `accommodation_id` (FK)
- `user_id` (FK)
- `base_price` (DECIMAL)
- `discount_applied` (DECIMAL)
- `final_price` (DECIMAL)
- `start_date` (DATE)
- `end_date` (DATE)
- `status` (ENUM: PENDING, SUCCESS, CANCELLED)
