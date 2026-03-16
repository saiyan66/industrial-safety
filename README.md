Hypervise — Industrial Safety Dashboard

A full-stack web application for monitoring PPE compliance and managing safety violations across industrial environments in real time.



Features



Real-time PPE compliance tracking — helmets, vests, violations by zone and camera

Safety alert management with live badge counts and event resolution

Live camera stream access

Analytics with compliance trends and violation breakdowns

Role-based access control with JWT authentication

Protected routes with automatic token handling via Axios interceptors





Tech Stack

Frontend: React, Vite, React Router, Axios, Material UI

Backend: Node.js, Express, MySQL, JWT, bcrypt



Getting Started

Backend

bashcd backend

npm install

node --env-file=.env server.js

Frontend

bashcd frontend

npm install

npm run dev

Environment Variables

Create a .env file in /backend:

PORT=5000

JWT\_SECRET=your\_secret

DB\_HOST=localhost

DB\_USER=your\_db\_user

DB\_PASSWORD=your\_db\_password

DB\_NAME=industry\_safety



Project Structure

hypervise/

├── frontend/src/

│   ├── api/          # Axios instance and API functions

│   ├── components/   # Layout, Sidebar, Appbar, KPICard

│   ├── pages/        # Login, Register, Overview, Analytics, Alerts, LiveStream

│   └── utils/        # AuthContext, ProtectedRoute

│

└── backend/

&#x20;   ├── modules/

&#x20;   │   ├── auth/       # Login, Register, JWT, middleware

&#x20;   │   ├── analytics/  # PPE and compliance data

&#x20;   │   └── events/     # Alerts and event resolution

&#x20;   └── db/             # MySQL connection pool

