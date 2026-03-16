# RCSB Website

Official website for the **Rotaract Club of Seshadripuram Bangalore (RCSB)**.  
Built with Next.js 14, Clerk authentication, a Cloudflare Worker API, Cloudflare D1 (SQLite), and Cloudflare R2 for media storage.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| Auth | Clerk |
| API | Cloudflare Worker (TypeScript) |
| Database | Cloudflare D1 (SQLite) |
| Media Storage | Cloudflare R2 (served via Worker `/media/` proxy) |

---

## Project Structure

```
├── app/
│   ├── page.tsx              # Home page
│   ├── team/                 # Public leadership page
│   ├── projects/             # Projects showcase
│   ├── blogs/                # Blog listing
│   ├── contact/              # Contact form
│   ├── admin/                # Admin dashboard (Clerk-protected)
│   │   ├── team/             # Manage Board of Directors
│   │   ├── projects/         # Manage projects & events
│   │   └── blogs/            # Manage blog posts
│   └── api/
│       └── admin/            # Next.js API routes (proxies to Cloudflare Worker)
│           ├── team/
│           ├── projects/
│           └── upload/
├── cloudflare-worker/
│   ├── src/index.ts          # Worker source (all API + D1 + R2 logic)
│   └── schema.sql            # D1 database schema
├── lib/
│   ├── api.ts                # apiFetch helper + env constants
│   └── admin.ts              # isAdmin() helper
└── middleware.ts             # Clerk auth middleware
```

---

## Getting Started

### 1. Clone & install

```bash
git clone <repo-url>
cd RCSB-Website-
npm install
```

### 2. Environment variables

Copy `.env.local` and fill in your values:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_ADMIN_EMAIL=admin@yourdomain.com

# Cloudflare Worker & D1
NEXT_PUBLIC_CLOUDFLARE_API_URL=https://your-worker.workers.dev
CLOUDFLARE_WORKER_SECRET=your_secret_key

# R2 (served via worker /media/ proxy)
NEXT_PUBLIC_R2_PUBLIC_URL=https://your-worker.workers.dev/media
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Cloudflare Worker Setup

The worker handles all data operations and media storage. It is deployed separately.

```bash
cd cloudflare-worker
npm install
```

### Deploy the Worker

```bash
npx wrangler deploy
```

### Set up D1 database

```bash
# Create the D1 database
npx wrangler d1 create rcsb-db

# Apply the schema
npx wrangler d1 execute rcsb-db --file=./schema.sql
```

### Set worker secret

```bash
npx wrangler secret put WORKER_SECRET
```

---

## Database Schema

Five tables managed in Cloudflare D1:

- **`projects`** — Projects, events, and blog posts (unified, differentiated by `type`)
- **`team_members`** — Board of Directors with `order_index` for display order
- **`authorized_admins`** — RBAC table; roles are `admin` or `blogger`
- **`comments`** — Blog post comments, linked to `projects`
- **`contact_submissions`** — Public contact form submissions

---

## Admin Panel

The admin dashboard is available at `/admin` and is protected by Clerk.  
Role-based access is enforced at the Worker level via the `authorized_admins` table.

| Role | Capabilities |
|---|---|
| `admin` | Full access — manage team, projects, events, blogs, messages |
| `blogger` | Can only create and edit blog posts |

---

## API Endpoints (Cloudflare Worker)

All protected endpoints require `Authorization: Bearer <WORKER_SECRET>`.

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/projects` | Public | List all projects |
| `GET` | `/api/team` | Public | List team members |
| `POST` | `/api/contact` | Public | Submit contact form |
| `GET` | `/media/:key` | Public | Serve R2 media |
| `POST` | `/api/upload` | Protected | Upload image to R2 |
| `POST` | `/api/projects` | Protected | Create project |
| `PUT` | `/api/projects/:id` | Protected | Update project |
| `DELETE` | `/api/projects/:id` | Protected | Delete project |
| `POST` | `/api/team` | Protected | Add team member |
| `PUT` | `/api/team/:id` | Protected | Update team member |
| `DELETE` | `/api/team/:id` | Protected | Delete team member |
| `GET` | `/api/messages` | Protected | List contact submissions |

---

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## License

See [LICENSE](./LICENSE).
