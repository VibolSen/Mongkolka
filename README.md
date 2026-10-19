# Mongkolka (មង្គលការ)

> **Decoupled Architecture**: Next.js 16 Frontend with 3-Role Layout Architecture (`Front/`) and Express + TypeScript + Prisma ORM Backend with MySQL (`Back/`).

---

## 📁 Repository Structure

```
Mongkolka/
├── Front/                               # Next.js 16 App Router Frontend (Port 3000)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx               # Root Shell: Global <Header /> + Providers
│   │   │   ├── (auth)/                  # Auth group: login, register
│   │   │   ├── (main)/                  # Marketing landing page (/)
│   │   │   ├── admin/                   # 👑 ADMIN portal (dashboard, users, events, templates, songs, settings)
│   │   │   ├── user/                    # 💍 USER / Host portal (dashboard, builder, guests, seating, staff)
│   │   │   ├── staff/                   # 📱 STAFF portal (QR scanner, guest lookup)
│   │   │   └── e/[slug]/                # 💌 Public Invitation (SSR, floating header, music, RSVP)
│   │   ├── components/                  # Pure view components called by thin page delegates
│   │   │   ├── shared/                  # Adaptive Header, Footer, Language & Theme toggles
│   │   │   ├── admin/                   # AdminDashboard, Users, Events, Templates, Songs, Settings
│   │   │   ├── user/                    # BuilderCanvas, Guests, Seating, StaffPINs, Analytics
│   │   │   ├── staff/                   # QrScannerView, StaffGuestLookup
│   │   │   ├── templates/               # Invitation sections (Hero, KhmerCeremony, Gallery, RSVP...)
│   │   │   └── ui/                      # Reusable UI primitives
│   │   └── lib/
│   │       ├── api.ts                   # Centralized HTTP REST client with JWT injection
│   │       └── i18n/                    # Khmer & English translations
│   ├── package.json
│   └── tsconfig.json
│
├── Back/                                # Node.js + Express + TypeScript Backend (Port 5000)
│   ├── prisma/
│   │   ├── schema.prisma                # Prisma MySQL schema (User, Template, UserEvent, Guest, etc.)
│   │   └── seed.ts                      # Database seeder (Admin account, default templates, songs)
│   ├── src/
│   │   ├── controllers/                 # Auth, Events, Staff, Songs, Templates, Admin, Upload
│   │   ├── middleware/                  # requireAuth, requireRole (JWT verification)
│   │   ├── routes/                      # API endpoint definitions
│   │   └── server.ts                    # Express entrypoint with CORS & error handlers
│   ├── package.json
│   └── tsconfig.json
│
├── architecture_restructure_plan.md     # Full architectural restructuring blueprint & matrix
└── README.md
```

---

## 🚀 Quick Start

### 1. Backend Setup & Run

```bash
# Navigate to Back directory
cd Back

# Install dependencies (if not yet installed)
npm install

# Push database schema to MySQL
npm run prisma:push

# Seed default admin & initial templates
npm run prisma:seed

# Start the Express API server (runs on http://localhost:5000)
npm run dev
```

> **Default Seeded Admin**: `admin@mongkolka.com` / `admin123456`

### 2. Frontend Setup & Run

```bash
# Navigate to Front directory
cd Front

# Install dependencies (if not yet installed)
npm install

# Start the Next.js development server (runs on http://localhost:3000)
npm run dev
```

---

## 👥 Role Matrix

| Role | Access Scope |
| :--- | :--- |
| **👑 ADMIN** | Full platform superuser. Complete access to `/admin/*` (users, events, templates, songs, settings) + all host capabilities. |
| **💍 USER (Host)** | Event creation wizard, visual builder, guest list management, banquet seating planner, and staff PIN authorization (`/user/*`). |
| **📱 STAFF** | Venue door check-in scanner and guest table lookup tool (`/staff/*`). |
| **💌 Public Guest** | View invitation (`/e/[slug]`), submit RSVP with instant digital check-in QR pass, and post blessings to the guestbook wall. |
