# Hypervise — Industrial Safety Dashboard

A full-stack web application for monitoring PPE compliance and managing safety violations across industrial environments in real time.

---

## Features

- Real-time PPE compliance tracking — helmets, vests, violations by zone and camera
- Safety alert management with live badge counts and event resolution
- Live camera stream access
- Analytics with compliance trends and violation breakdowns
- Role-based access control with JWT authentication
- Protected routes with automatic token handling via Axios interceptors

---

## Tech Stack

**Frontend:** React, Vite, React Router, Axios, Material UI  
**Backend:** Node.js, Express, MySQL, JWT, bcrypt

---
New users are assigned `viewer` by default. Roles are managed by an admin.
---

## Getting Started

### Backend
```bash
cd backend
npm install
node --env-file=.env server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create a `.env` file in `/backend`:
```
PORT=5000
JWT_SECRET=your_secret
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=industry_safety
```

---

## Project Structure
```
hypervise/
├── frontend/src/
│   ├── api/          # Axios instance and API functions
│   ├── components/   # Layout, Sidebar, Appbar, KPICard
│   ├── pages/        # Login, Register, Overview, Analytics, Alerts, LiveStream
│   └── utils/        # AuthContext, ProtectedRoute
└── backend/
    ├── modules/
    │   ├── auth/       # Login, Register, JWT, middleware
    │   ├── analytics/  # PPE and compliance data
    │   └── events/     # Alerts and event resolution
    └── db/             # MySQL connection pool
```

---
