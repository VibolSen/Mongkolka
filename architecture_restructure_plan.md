# Mongkolka — Architecture Restructuring & Implementation Plan
*(Decoupled Next.js Frontend with 3 Role-Based Route Folders + Express/MySQL Backend)*

---

## 1. Frontend Structure: 3-Role Layout Architecture (`Front/src/app/`)

### Architectural Principles:
- **`layout.tsx` is the gatekeeper**: Controls route access, validates the user's role, and wraps children in the role-specific navigation shell (sidebar etc.).
- **`page.tsx` files are ultra-thin route delegates**: No presentation logic — they only call the matching view component from `components/`.
- **Global `<Header />` lives in root `app/layout.tsx`**: One shared header component adapts its content per role. Applies to all routes **except** `e/[slug]/` which uses its own invitation-specific floating header.
- **No `page.tsx` on the role root**: `(auth)/`, `admin/`, `user/`, and `staff/` have no index `page.tsx` — the `layout.tsx` redirects to the correct default child (`/admin/dashboard`, `/user/dashboard`, `/staff/scanner`).

```
Front/
└── src/
    ├── app/
    │   ├── layout.tsx                       # ROOT: Global <Header /> + AuthProvider + ThemeProvider
    │   │
    │   ├── (auth)/                          # 🔑 Auth group (no page.tsx)
    │   │   ├── layout.tsx                   # Minimal centered card shell — no page.tsx
    │   │   ├── login/
    │   │   │   └── page.tsx                 # Delegate -> <LoginForm /> from components/auth
    │   │   └── register/
    │   │       └── page.tsx                 # Delegate -> <RegisterForm /> from components/auth
    │   │
    │   ├── (main)/                          # 🏠 Marketing (no shared URL prefix)
    │   │   ├── layout.tsx                   # Public navbar + footer layout
    │   │   └── page.tsx                     # Delegate -> <LandingView /> (route: /)
    │   │
    │   ├── admin/                           # 👑 Role 1: ADMIN (no page.tsx — redirects to /admin/dashboard)
    │   │   ├── layout.tsx                   # Guards ADMIN role → non-admin redirected to /login
    │   │   ├── dashboard/
    │   │   │   └── page.tsx                 # Delegate -> <AdminDashboard /> (platform stats)
    │   │   ├── users/
    │   │   │   └── page.tsx                 # Delegate -> <AdminUsersView /> (manage all users)
    │   │   ├── events/
    │   │   │   └── page.tsx                 # Delegate -> <AdminEventsView /> (monitor all events)
    │   │   ├── templates/
    │   │   │   └── page.tsx                 # Delegate -> <AdminTemplatesView /> (create/edit templates)
    │   │   └── songs/
    │   │       └── page.tsx                 # Delegate -> <AdminSongsView /> (upload/delete audio)
    │   │
    │   ├── user/                            # 💍 Role 2: USER/Host (no page.tsx — redirects to /user/dashboard)
    │   │   ├── layout.tsx                   # Guards USER role → non-user redirected to /login
    │   │   ├── dashboard/
    │   │   │   └── page.tsx                 # Delegate -> <UserDashboard /> (stats, events, quick actions)
    │   │   ├── create/
    │   │   │   └── page.tsx                 # Delegate -> <CreateEventWizard /> (template picker + slug)
    │   │   ├── events/
    │   │   │   └── page.tsx                 # Delegate -> <UserEventsList /> (list, edit, delete events)
    │   │   ├── builder/
    │   │   │   └── [id]/
    │   │   │       └── page.tsx             # Delegate -> <EventBuilderCanvas /> (visual section editor)
    │   │   ├── guests/
    │   │   │   └── page.tsx                 # Delegate -> <GuestsManager /> (RSVP list, status, pax)
    │   │   ├── seating/
    │   │   │   └── page.tsx                 # Delegate -> <TableSeatingView /> (tables + assign guests)
    │   │   ├── staff/
    │   │   │   └── page.tsx                 # Delegate -> <StaffAccessManager /> (issue staff PIN)
    │   │   ├── analytics/
    │   │   │   └── page.tsx                 # Delegate -> <AnalyticsView /> (RSVP trends, 7-day chart)
    │   │   └── settings/
    │   │       └── page.tsx                 # Delegate -> <UserSettingsView /> (profile, account)
    │   │
    │   ├── staff/                           # 📱 Role 3: STAFF (no page.tsx — goes to /staff/scanner)
    │   │   ├── layout.tsx                   # Guards STAFF role. Minimal mobile shell
    │   │   ├── scanner/
    │   │   │   └── page.tsx                 # Delegate -> <QrScannerView /> (camera QR check-in)
    │   │   └── guests/
    │   │       └── page.tsx                 # Delegate -> <StaffGuestLookup /> (name search + table)
    │   │
    │   └── e/
    │       └── [slug]/                      # 💌 Public Invitation (no auth required)
    │           ├── layout.tsx               # Invitation shell: theme colors + floating music header
    │           └── page.tsx                 # SSR -> <PublicEventView /> (Hero, Ceremony, RSVP…)
    │
    ├── components/
    │   ├── shared/                          # ← Shared across ALL roles
    │   │   ├── Header.tsx                   # Global adaptive header (role-aware)
    │   │   ├── Footer.tsx                   # Public marketing footer
    │   │   ├── LanguageToggle.tsx           # EN / KM language switcher
    │   │   └── ThemeToggle.tsx              # Light / Dark mode toggle
    │   ├── admin/                           # AdminDashboard, UsersTable, SongsManager, TemplatesEditor
    │   ├── user/                            # UserDashboard, BuilderCanvas, GuestList, TablePlanner, StaffPins
    │   ├── staff/                           # QrScannerView, StaffGuestLookup
    │   ├── templates/                       # HeroSection, KhmerCeremony, GallerySection, RsvpSection…
    │   ├── main/                            # LandingHero, FeaturesGrid, PricingTable, TestimonialsBlock
    │   ├── auth/                            # LoginForm, RegisterForm
    │   └── ui/                             # Button, Input, Modal, Card, Badge, Dropdown…
    │
    ├── lib/
    │   ├── api.ts                           # Centralized HTTP client → Express Back/
    │   └── i18n/                            # EN / KM translation dictionaries
    └── types/                               # Shared TypeScript interfaces & section schemas
```

---

## 1.1 Role Capabilities Matrix

> **ADMIN has all permissions.** As platform owner they can do everything a USER can do (create events, use the builder, manage guests, etc.) **plus** their exclusive admin-only controls. STAFF is limited exclusively to door check-in operations.

| Feature | 👑 ADMIN | 💍 USER (Host) | 📱 STAFF |
| :--- | :---: | :---: | :---: |
| **Platform Stats** (total users, events, revenue) | ✅ | ❌ | ❌ |
| **Manage All Users** (view, change role, suspend) | ✅ | ❌ | ❌ |
| **Monitor All Platform Events** | ✅ | ❌ | ❌ |
| **Manage Templates** (create / edit / delete) | ✅ | ❌ | ❌ |
| **Manage Song Library** (upload / delete) | ✅ | ❌ | ❌ |
| **Create Own Events** | ✅ | ✅ | ❌ |
| **Visual Event Builder** (sections, theme, music) | ✅ | ✅ | ❌ |
| **Publish / Unpublish Invitation** | ✅ | ✅ | ❌ |
| **Manage Guest List** (add, edit, delete) | ✅ | ✅ | ❌ |
| **Assign Guests to Banquet Tables** | ✅ | ✅ | ❌ |
| **Export Guest List** (Excel / CSV) | ✅ | ✅ | ❌ |
| **Authorize Staff Receptionists** (issue 6-digit PIN) | ✅ | ✅ | ❌ |
| **View RSVP Analytics** (trends, 7-day chart) | ✅ | ✅ | ❌ |
| **Edit Own Profile / Settings** | ✅ | ✅ | ✅ |
| **Scan Guest QR Code at Venue Door** | ❌ | ❌ | ✅ |
| **Manual Guest Name Search** | ❌ | ❌ | ✅ |
| **Display Guest's Assigned Table Number** | ❌ | ❌ | ✅ |

---

## 1.2 Global Header Behavior (`components/shared/Header.tsx`)

One `<Header />` component is mounted in the root `app/layout.tsx`. It reads the current user session/role and renders accordingly:

| Route Context | Header Content |
| :--- | :--- |
| **`(main)/`** — public | Logo + Nav links (Features, Templates, Pricing) + Login button + Language/Theme toggles |
| **`(auth)/`** — login/register | Logo only + Language/Theme toggles |
| **`admin/*`** | Logo + **"Admin Panel"** badge + User avatar + Sign out |
| **`user/*`** | Logo + **"Dashboard"** label + Notification bell + User avatar + Sign out |
| **`staff/*`** | Logo + **"Staff Mode"** badge + Assigned event name + Sign out |
| **`e/[slug]/`** | ❌ Global header **hidden** — invitation uses its own floating header (Mongkol brand + Music toggle) |

---

## 2. Database & ORM: Prisma ORM with MySQL (`Back/`)

> **Only `Back/` connects to MySQL via Prisma.** `Front/` has zero direct database access — all data flows through REST API endpoints.

### 2.1 Prisma Schema (`Back/prisma/schema.prisma`)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  ADMIN
  STAFF
}

model User {
  id          String                 @id @default(uuid())
  name        String?
  email       String                 @unique
  password    String
  role        Role                   @default(USER)
  createdAt   DateTime               @default(now())
  updatedAt   DateTime               @updatedAt
  events      UserEvent[]
  staffAccess EventStaffAssignment[]
}

model Template {
  id           String      @id @default(uuid())
  name         String
  type         String
  description  String?     @db.Text
  thumbnail    String?
  isPremium    Boolean     @default(false)
  defaultTheme Json?
  sections     Json?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  userEvents   UserEvent[]
}

model UserEvent {
  id           String                 @id @default(uuid())
  slug         String                 @unique
  title        String
  type         String
  date         DateTime?
  location     String?
  templateId   String?
  template     Template?              @relation(fields: [templateId], references: [id])
  theme        Json?
  sections     Json?
  musicData    Json?
  isPublished  Boolean                @default(false)
  userId       String
  user         User                   @relation(fields: [userId], references: [id], onDelete: Cascade)
  guests       Guest[]
  messages     GuestMessage[]
  tables       Table[]
  staffMembers EventStaffAssignment[]
  createdAt    DateTime               @default(now())
  updatedAt    DateTime               @updatedAt
}

// Authorizes a STAFF user to scan check-ins for a specific event
model EventStaffAssignment {
  id        String    @id @default(uuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  eventId   String
  event     UserEvent @relation(fields: [eventId], references: [id], onDelete: Cascade)
  passCode  String    // 6-digit PIN issued by the event Host
  createdAt DateTime  @default(now())

  @@unique([userId, eventId])
}

model Table {
  id        String    @id @default(uuid())
  eventId   String
  event     UserEvent @relation(fields: [eventId], references: [id], onDelete: Cascade)
  name      String    // e.g. "Table 01 – Bride VIP"
  capacity  Int       @default(10)
  guests    Guest[]
  createdAt DateTime  @default(now())
}

model Guest {
  id           String     @id @default(uuid())
  eventId      String
  event        UserEvent  @relation(fields: [eventId], references: [id], onDelete: Cascade)
  tableId      String?
  table        Table?     @relation(fields: [tableId], references: [id], onDelete: SetNull)
  name         String
  phone        String?
  status       String     @default("PENDING") // ATTENDING | DECLINED | PENDING | CHECKED_IN
  pax          Int        @default(1)
  foodPref     String?
  checkInToken String     @unique @default(uuid()) // Personal QR scanned at the door
  checkedInAt  DateTime?
  createdAt    DateTime   @default(now())
}

model GuestMessage {
  id        String    @id @default(uuid())
  eventId   String
  event     UserEvent @relation(fields: [eventId], references: [id], onDelete: Cascade)
  guestName String
  message   String    @db.Text
  isPrivate Boolean   @default(false)
  createdAt DateTime  @default(now())
}

model Song {
  id        String   @id @default(uuid())
  title     String
  artist    String?
  url       String
  createdAt DateTime @default(now())
}
```

---

## 3. Backend REST API Specification (`Back/src/`)

| Method | Route | Role | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Public | Register new account |
| **POST** | `/api/auth/login` | Public | Authenticate & return JWT |
| **GET** | `/api/auth/me` | Any | Get current user info & role |
| **PATCH** | `/api/auth/me` | Any | Update profile |
| **GET** | `/api/events` | USER \| ADMIN | List own events |
| **POST** | `/api/events` | USER \| ADMIN | Create event from template |
| **GET** | `/api/events/:id` | USER \| ADMIN | Get event data (sections, theme, music) |
| **PATCH** | `/api/events/:id` | USER \| ADMIN | Save builder changes / publish toggle |
| **DELETE** | `/api/events/:id` | USER \| ADMIN | Delete event (cascades all children) |
| **GET** | `/api/public/events/:slug` | Public | Fetch published invitation (SSR) |
| **POST** | `/api/public/events/:id/rsvp` | Public | Guest RSVP → returns check-in QR token |
| **GET** | `/api/public/events/:id/messages` | Public | Fetch guestbook wishes |
| **POST** | `/api/public/events/:id/messages` | Public | Post a blessing message |
| **GET** | `/api/events/:id/guests` | USER \| ADMIN | Get guest list + table assignments |
| **POST** | `/api/events/:id/guests` | USER \| ADMIN | Add guest manually |
| **PATCH** | `/api/events/:id/guests/:guestId` | USER \| ADMIN | Update guest status / table |
| **DELETE** | `/api/events/:id/guests/:guestId` | USER \| ADMIN | Remove guest |
| **GET** | `/api/events/:id/guests/export` | USER \| ADMIN | Export to Excel / CSV |
| **GET** | `/api/events/:id/tables` | USER \| ADMIN | List banquet tables |
| **POST** | `/api/events/:id/tables` | USER \| ADMIN | Create table |
| **POST** | `/api/events/:id/staff` | USER \| ADMIN | Authorize staff via PIN |
| **GET** | `/api/staff/events` | STAFF | List assigned events |
| **POST** | `/api/staff/scan` | STAFF | Validate QR token → mark CHECKED_IN |
| **GET** | `/api/staff/lookup` | STAFF | Search guest by name + get table |
| **GET** | `/api/templates` | Public | List available templates |
| **GET** | `/api/songs` | Public | List platform audio tracks |
| **POST** | `/api/upload` | USER / ADMIN | ImageKit upload (photos / audio) |
| **GET** | `/api/admin/stats` | ADMIN | Platform-wide stats |
| **GET** | `/api/admin/users` | ADMIN | List & manage all users |
| **PATCH** | `/api/admin/users/:id` | ADMIN | Change role or suspend user |
| **GET** | `/api/admin/events` | ADMIN | Monitor all platform events |
| **POST** | `/api/admin/songs` | ADMIN | Upload & register platform song |
| **DELETE** | `/api/admin/songs/:id` | ADMIN | Delete platform song |

---

## 4. Comprehensive Phased Implementation Roadmap

### Phase 1: Workspace Restructuring & Backend Foundation
- [ ] Create `Front/` and `Back/` folders in root `Mongkolka/`.
- [ ] Move existing Next.js project into `Front/` and reorganize into `Front/src/`:
  - `Front/src/app/admin/` — with `layout.tsx` (ADMIN guard, no `page.tsx`)
  - `Front/src/app/user/` — with `layout.tsx` (USER guard, no `page.tsx`)
  - `Front/src/app/staff/` — with `layout.tsx` (STAFF guard, no `page.tsx`)
  - `Front/src/app/(auth)/` — login & register sub-pages only
  - `Front/src/app/(main)/` — marketing landing page
  - `Front/src/app/e/[slug]/` — public invitation
- [ ] Move views out of `app/` into `Front/src/components/{admin,user,staff,templates,main,auth}`.
- [ ] Update `Front/tsconfig.json` path alias `@/* -> ./src/*`.
- [ ] Initialize Node.js + Express + TypeScript project in `Back/`.
- [ ] Setup `Back/prisma/schema.prisma` with MySQL, `Role` enum (`USER`, `ADMIN`, `STAFF`).
- [ ] Run initial Prisma migration: `npx prisma db push`.
- [ ] Implement JWT auth + role-guard middlewares (`requireAuth`, `requireRole`).

### Phase 2: Core REST APIs & Database Seeding
- [ ] Build Events CRUD endpoints (`/api/events`).
- [ ] Build Public Event + RSVP endpoints (`/api/public/events/:slug`, `/api/public/events/:id/rsvp`).
- [ ] Generate unique `checkInToken` per guest on RSVP submission.
- [ ] Build ImageKit upload handler (`/api/upload`).
- [ ] Build Song library CRUD (`/api/songs`, `/api/admin/songs`).
- [ ] Build Staff assignment + door scan endpoints (`/api/events/:id/staff`, `/api/staff/scan`, `/api/staff/lookup`).
- [ ] Write seed script `Back/prisma/seed.ts` (Khmer Traditional Royal template, Modern Romance template, admin user).

### Phase 3: Frontend Refactoring to Consume Express API
- [ ] Implement `Front/src/lib/api.ts` HTTP client with JWT token injection.
- [ ] Refactor Auth flow (login, register, session persistence) to consume Express JWT.
- [ ] Connect `<EventBuilderCanvas />` to Express PATCH/GET endpoints.
- [ ] Connect Public Event SSR page (`e/[slug]/page.tsx`) to `GET /api/public/events/:slug`.
- [ ] Connect `<UserDashboard />`, `<UserEventsList />`, `<GuestsManager />` to backend endpoints.
- [ ] Show Guest Digital QR Pass modal after RSVP submission.

### Phase 4: Feature Enhancements
- [ ] Build `<TableSeatingView />` (create tables, drag-assign guests).
- [ ] Build `<StaffAccessManager />` (generate & display 6-digit staff PIN codes).
- [ ] Build Excel/CSV export endpoint + download button in `<GuestsManager />`.
- [ ] Build `<QrScannerView />` with camera access, beep/vibrate on success.
- [ ] Build `<StaffGuestLookup />` with name search + table number display.
- [ ] Build interactive guestbook blessing wall on the public invitation.
- [ ] Complete Admin management tables (Users, Events, Templates, Songs).

### Phase 5: Hardening, Root Scripts & Verification
- [ ] Add root `package.json` with `npm run dev` (concurrently runs `Front/` on port 3000 & `Back/` on port 5000).
- [ ] Configure CORS, Helmet, and rate limiting in Express.
- [ ] Add `.env.example` for both `Front/` and `Back/`.
- [ ] End-to-end verification: create event → build → publish → RSVP → check-in.
