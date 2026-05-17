# Smart Leads Dashboard

A production-ready full-stack MERN application for managing sales leads with role-based access control, advanced filtering, and a modern dashboard UI.

## Features

- **JWT Authentication** — Register, login, protected routes, token expiration
- **Role-Based Access Control** — Admin (full CRUD) and Sales (no delete) roles
- **Lead Management** — Full CRUD with status and source tracking
- **Advanced Filtering** — Filter by status, source, search by name/email, sort by date
- **Debounced Search** — 500ms debounce to minimize API calls
- **Pagination** — Backend pagination with metadata
- **CSV Export** — Export filtered leads to CSV
- **Dark Mode** — Theme toggle with localStorage persistence
- **Responsive UI** — Mobile-first design with Tailwind CSS
- **Docker** — Full containerized setup with Docker Compose

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, TailwindCSS, React Router v6 |
| State | Zustand, TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| DevOps | Docker, Docker Compose |

## Project Structure

```
smart-leads-dashboard/
├── backend/
│   └── src/
│       ├── config/         # Database connection
│       ├── constants/      # Enums and app constants
│       ├── controllers/    # Route handlers
│       ├── interfaces/     # TypeScript interfaces
│       ├── middleware/     # Auth, validation, error handling
│       ├── models/         # Mongoose schemas
│       ├── routes/         # Express routes
│       ├── services/       # Business logic
│       ├── types/          # Express type augmentation
│       ├── utils/          # Helpers (JWT, response, AppError)
│       ├── validations/    # Zod schemas
│       ├── app.ts          # Express app setup
│       └── server.ts       # Entry point
├── frontend/
│   └── src/
│       ├── api/            # Axios API service layer
│       ├── components/     # Reusable UI components
│       ├── constants/      # Frontend constants
│       ├── hooks/          # Custom React hooks
│       ├── layouts/        # Page layouts
│       ├── pages/          # Route pages
│       ├── routes/         # Protected/Public route guards
│       ├── store/          # Zustand stores
│       ├── styles/         # Global CSS
│       ├── types/          # TypeScript types
│       ├── App.tsx         # Root component with router
│       └── main.tsx        # Entry point
└── docker-compose.yml
```

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- Docker (optional)

### Local Development

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your values
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### Docker Setup

```bash
# From project root
docker-compose up --build
```

Services:
- Frontend: http://localhost
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

## Environment Variables

### Backend (`backend/.env`)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

## API Documentation

### Auth Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
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
    "user": { "_id": "...", "name": "John Doe", "email": "john@example.com", "role": "sales" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Lead Endpoints

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/leads` | Get all leads (paginated) | Yes | All |
| GET | `/api/leads/:id` | Get single lead | Yes | All |
| POST | `/api/leads` | Create lead | Yes | All |
| PUT | `/api/leads/:id` | Update lead | Yes | All |
| DELETE | `/api/leads/:id` | Delete lead | Yes | Admin |
| GET | `/api/leads/export` | Export leads as CSV | Yes | All |

**Query Parameters for GET /api/leads:**
```
?status=Qualified&source=Instagram&search=John&sort=latest&page=1&limit=10
```

**Lead Response:**
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

## Deployment

### Frontend — Vercel
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
# Set VITE_API_URL environment variable in Vercel dashboard
```

### Backend — Render
1. Connect GitHub repo to Render
2. Set root directory to `backend/`
3. Build command: `npm install && npm run build`
4. Start command: `node dist/server.js`
5. Add environment variables in Render dashboard

### Database — MongoDB Atlas
1. Create cluster at https://cloud.mongodb.com
2. Get connection string
3. Set `MONGODB_URI` in backend environment variables

## Git Commit Strategy

```
feat: initial project setup with MERN stack
feat: add JWT authentication with bcrypt
feat: implement User and Lead Mongoose models
feat: add lead CRUD API with validation
feat: implement filtering, search, and pagination
feat: add CSV export endpoint
feat: setup React frontend with Vite and Tailwind
feat: implement auth pages (login/register)
feat: add leads page with table and filters
feat: implement dark mode with Zustand
feat: add Docker and docker-compose setup
docs: add README with API documentation
```

## Screenshots

> Add screenshots of your dashboard here after running the application.

## License

MIT
