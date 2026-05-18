# API Documentation & Setup Instructions

## Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Base URL](#base-url)
3. [Authentication](#authentication)
4. [Error Handling](#error-handling)
5. [Auth Endpoints](#auth-endpoints)
6. [Lead Endpoints](#lead-endpoints)
7. [Health Check](#health-check)

---

## Setup Instructions

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/Akashvasan2003/Smart-Leads-Dashboard-Project.git
cd Smart-Leads-Dashboard-Project
```

---

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

```bash
npm install
npm run dev
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

### 4. Docker Setup (Optional)

```bash
# From project root
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost |
| Backend API | http://localhost:5000 |
| MongoDB | localhost:27017 |

---

### 5. Production Build

**Backend:**
```bash
cd backend
npm run build
node dist/server.js
```

**Frontend:**
```bash
cd frontend
npm run build
node static-server.js
```

---

### 6. Railway Deployment

**Backend Variables:**

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | MongoDB Atlas or Railway MongoDB URL |
| `JWT_SECRET` | Strong secret (min 32 chars) |
| `JWT_EXPIRES_IN` | `7d` |
| `CORS_ORIGIN` | `https://your-frontend.up.railway.app` |
| `RATE_LIMIT_WINDOW_MS` | `900000` |
| `RATE_LIMIT_MAX` | `100` |

**Frontend Variables:**

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://your-backend.up.railway.app/api` |

> `VITE_API_URL` is baked in at build time. Redeploy frontend after changing it.

---

## Base URL

| Environment | URL |
|---|---|
| Local | `http://localhost:5000/api` |
| Production | `https://smart-leads-dashboard-project-production.up.railway.app/api` |

---

## Authentication

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

Token is returned on login and register. It expires based on `JWT_EXPIRES_IN` (default `7d`).

---

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

### HTTP Status Codes

| Code | Meaning |
|---|---|
| `200` | Success |
| `201` | Created |
| `400` | Validation error / Bad request |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — insufficient role |
| `404` | Resource not found |
| `429` | Too many requests (rate limited) |
| `500` | Internal server error |

---

## Auth Endpoints

### POST `/api/auth/register`

Register a new user.

**Auth Required:** No

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "sales"
}
```

| Field | Type | Required | Rules |
|---|---|---|---|
| `name` | string | Yes | Min 2 characters |
| `email` | string | Yes | Valid email format |
| `password` | string | Yes | Min 6 characters |
| `role` | string | No | `admin` or `sales` (default: `sales`) |

**Response `201`:**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "sales",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### POST `/api/auth/login`

Login with existing credentials.

**Auth Required:** No

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response `200`:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "sales"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### GET `/api/auth/me`

Get the currently authenticated user.

**Auth Required:** Yes

**Response `200`:**

```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "user": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "sales"
    }
  }
}
```

---

## Lead Endpoints

All lead endpoints require authentication.

### GET `/api/leads`

Get paginated list of leads with optional filters.

**Auth Required:** Yes | **Role:** All

**Query Parameters:**

| Parameter | Type | Default | Options |
|---|---|---|---|
| `status` | string | — | `New`, `Contacted`, `Qualified`, `Lost` |
| `source` | string | — | `Website`, `Instagram`, `Referral` |
| `search` | string | — | Searches name and email |
| `sort` | string | `latest` | `latest`, `oldest` |
| `page` | number | `1` | Any positive integer |
| `limit` | number | `10` | Max `100` |

**Example Request:**
```
GET /api/leads?status=Qualified&source=Instagram&search=john&sort=latest&page=1&limit=10
```

**Response `200`:**

```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "status": "Qualified",
      "source": "Instagram",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 5,
    "totalRecords": 48,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### GET `/api/leads/:id`

Get a single lead by ID.

**Auth Required:** Yes | **Role:** All

**Response `200`:**

```json
{
  "success": true,
  "message": "Lead fetched successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "status": "New",
    "source": "Website",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### POST `/api/leads`

Create a new lead.

**Auth Required:** Yes | **Role:** All

**Request Body:**

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "status": "New",
  "source": "Website"
}
```

| Field | Type | Required | Options |
|---|---|---|---|
| `name` | string | Yes | Min 2 characters |
| `email` | string | Yes | Valid email format |
| `status` | string | No | `New`, `Contacted`, `Qualified`, `Lost` (default: `New`) |
| `source` | string | Yes | `Website`, `Instagram`, `Referral` |

**Response `201`:**

```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "status": "New",
    "source": "Website",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### PUT `/api/leads/:id`

Update an existing lead. All fields are optional.

**Auth Required:** Yes | **Role:** All

**Request Body:**

```json
{
  "status": "Qualified"
}
```

**Response `200`:**

```json
{
  "success": true,
  "message": "Lead updated successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "status": "Qualified",
    "source": "Website",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-16T08:00:00.000Z"
  }
}
```

---

### DELETE `/api/leads/:id`

Delete a lead permanently.

**Auth Required:** Yes | **Role:** Admin only

**Response `200`:**

```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

---

### GET `/api/leads/stats`

Get lead statistics grouped by status and source.

**Auth Required:** Yes | **Role:** All

**Response `200`:**

```json
{
  "success": true,
  "message": "Stats fetched successfully",
  "data": {
    "total": 48,
    "byStatus": {
      "New": 12,
      "Contacted": 15,
      "Qualified": 14,
      "Lost": 7
    },
    "bySource": {
      "Website": 20,
      "Instagram": 18,
      "Referral": 10
    }
  }
}
```

---

### GET `/api/leads/export`

Export leads as a CSV file with optional filters (same query params as GET `/api/leads` except `page` and `limit`).

**Auth Required:** Yes | **Role:** All

**Example Request:**
```
GET /api/leads/export?status=Qualified&source=Instagram
```

**Response:** CSV file download

```
Name,Email,Status,Source,Created At
Jane Smith,jane@example.com,Qualified,Instagram,2024-01-15T10:30:00.000Z
```

---

## Health Check

### GET `/health`

Check if the server is running. No auth required.

**Response `200`:**

```json
{
  "success": true,
  "message": "Server is running",
  "env": "production"
}
```
