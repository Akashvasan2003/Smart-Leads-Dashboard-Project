# Smart Leads Dashboard

A production-ready full-stack MERN application for managing sales leads with JWT authentication, role-based access control, advanced filtering, and a modern responsive dashboard UI.

**Live Demo:**
- Frontend: https://joyful-vibrancy-production-3f10.up.railway.app
- Backend API: https://smart-leads-dashboard-project-production.up.railway.app/health

---

## Features

- JWT Authentication — Register, login, protected routes, token expiration
- Role-Based Access Control — Admin (full CRUD) and Sales (read/create/update only)
- Lead Management — Full CRUD with status and source tracking
- Advanced Filtering — Filter by status, source, search by name/email, sort by date
- Debounced Search — 500ms debounce to minimize API calls
- Pagination — Backend pagination with metadata
- CSV Export — Export filtered leads to CSV
- Dark Mode — Theme toggle with localStorage persistence
- Responsive UI — Mobile-first design with Tailwind CSS
- Dockerized — Full containerized setup with Docker Compose

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, TailwindCSS, React Router v6 |
| State Management | Zustand, TanStack Query v5 |
| Forms & Validation | React Hook Form + Zod |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| DevOps | Docker, Docker Compose, Railway |

---

## Project Structure

```
smart-leads-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/         # Database connection
│   │   ├── constants/      # Enums and app constants
│   │   ├── controllers/    # Route handlers
│   │   ├── interfaces/     # TypeScript interfaces
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── models/         # Mongoose schemas (User, Lead)
│   │   ├── routes/         # Express routes
│   │   ├── services/       # Business logic layer
│   │   ├── types/          # Express type augmentation
│   │   ├── utils/          # JWT, response helpers, AppError
│   │   ├── validations/    # Zod validation schemas
│   │   ├── app.ts          # Express app setup (CORS, middleware)
│   │   └── server.ts       # Entry point
│   ├── Dockerfile
│   ├── railway.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios API service layer
│   │   ├── components/     # Reusable UI components
│   │   ├── constants/      # Frontend constants and API URL
│   │   ├── hooks/          # Custom React hooks
│   │   ├── layouts/        # Dashboard layout
│   │   ├── pages/          # Route pages
│   │   ├── routes/         # Protected/Public route guards
│   │   ├── store/          # Zustand stores (auth, theme)
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx         # Root component with router
│   │   └── main.tsx        # Entry point
│   ├── Dockerfile
│   ├── railway.json
│   ├── static-server.js
│   └── package.json
└── docker-compose.yml
```

---

## Local Development

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- Docker (optional)

### Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your values
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
cp .env.example .env
# Edit .env with your values
npm install
npm run dev
```

App runs at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Docker Setup

```bash
# From project root
docker-compose up --build
```

Services:
- Frontend: http://localhost
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

---

## Environment Variables

### Backend (`backend/.env`)

```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your_super_secret_jwt_key_minimum_32_chars
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## API Documentation

### Auth Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

**Register Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "sales"
}
```

**Login Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "sales"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Lead Endpoints

| Method | Endpoint | Description | Auth | Role |
|---|---|---|---|---|
| GET | `/api/leads` | Get all leads (paginated) | Yes | All |
| GET | `/api/leads/:id` | Get single lead | Yes | All |
| POST | `/api/leads` | Create lead | Yes | All |
| PUT | `/api/leads/:id` | Update lead | Yes | All |
| DELETE | `/api/leads/:id` | Delete lead | Yes | Admin only |
| GET | `/api/leads/export` | Export leads as CSV | Yes | All |

**Query Parameters for `GET /api/leads`:**
```
?status=Qualified&source=Instagram&search=John&sort=latest&page=1&limit=10
```

**Lead List Response:**
```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": [...],
  "meta": {
    "currentPage": 1,
    "totalPages": 5,
    "totalRecords": 48,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Health Check

```
GET /health
```
```json
{ "success": true, "message": "Server is running", "env": "production" }
```

---

## Deployment (Railway)

This project is deployed on [Railway](https://railway.app) with 3 services: Frontend, Backend, and MongoDB.

### Backend Variables (Railway Dashboard)

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Railway MongoDB URL or Atlas connection string |
| `JWT_SECRET` | Strong secret string (min 32 chars) |
| `JWT_EXPIRES_IN` | `7d` |
| `CORS_ORIGIN` | `https://your-frontend.up.railway.app` |
| `RATE_LIMIT_WINDOW_MS` | `900000` |
| `RATE_LIMIT_MAX` | `100` |

### Frontend Variables (Railway Dashboard)

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://your-backend.up.railway.app/api` |

> `VITE_API_URL` is a build-time variable. You must redeploy the frontend after changing it.

### Auto Deploy

Railway automatically redeploys on every push to `main`:

```bash
git add .
git commit -m "your changes"
git push
```

---

## Role Permissions

| Action | Admin | Sales |
|---|---|---|
| View leads | ✅ | ✅ |
| Create lead | ✅ | ✅ |
| Update lead | ✅ | ✅ |
| Delete lead | ✅ | ❌ |
| Export CSV | ✅ | ✅ |

---

## License

MIT
