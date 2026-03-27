# Rotaract Club of Swarna Bengaluru (RCSB) — Official Website

Official digital platform for the **Rotaract Club of Swarna Bengaluru (RCSB)**. This is a high-performance web application built to manage club projects, showcase the leadership team, and engage the community through an AI-powered newsletter system.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | [Next.js 14](https://nextjs.org/) (App Router, Edge Runtime) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) |
| **Authentication** | [Clerk](https://clerk.com/) |
| **AI Engine** | [Groq](https://groq.com/) (Llama 3.3 70B) for Newsletter Generation |
| **Email Delivery** | [Gmail API](https://developers.google.com/gmail/api) (OAuth2) |
| **API / Backend** | [Cloudflare Workers](https://workers.cloudflare.com/) (TypeScript) |
| **Database** | [Cloudflare D1](https://developers.cloudflare.com/d1/) (Edge SQLite) |
| **Media Storage** | [Cloudflare R2](https://developers.cloudflare.com/r2/) (served via Worker proxy) |

---

## ✨ Key Features

- **AI-Powered Newsletter Engine**: Generate professional newsletter drafts from project descriptions using Llama 3.3. Refine content iteratively and send to all subscribers in bulk via the Gmail API.
- **Dynamic Board Management**: Manage the current Board of Directors and Past Presidents with an intuitive drag-and-drop reordering interface.
- **Unified Projects & Blogs**: A versatile content management system for club projects, events, and blog posts with multimedia support (R2 storage).
- **Engagement Hooks**: Interactive project liking, nested comments, and a subscription lead magnet with automated sync on user login.
- **Admin Dashboard**: A secure, Clerk-protected workspace for authorized admins to manage all site content, media, and configurations.
- **Edge Optimized**: Built on the Next.js Edge Runtime and Cloudflare network for sub-second global response times.

---

## 📂 Project Structure

```text
├── app/
│   ├── admin/                # Secure Admin Dashboard
│   │   ├── newsletter/       # AI Newsletter management & distribution
│   │   ├── team/             # D&D Board of Directors management
│   │   ├── projects/         # CMS for projects and blogs
│   │   └── settings/         # Global site configurations (e.g., about photos)
│   ├── api/
│   │   ├── newsletter/       # Newsletter logic (Groq + Gmail Auth)
│   │   └── admin/            # Admin proxy routes to Cloudflare Worker
│   ├── projects/             # Public project showcase
│   ├── team/                 # Public leadership & members page
│   └── page.tsx              # Immersive homepage
├── cloudflare-worker/
│   ├── src/index.ts          # Core API + D1 + R2 logic
│   └── schema.sql            # Database schema migrations
├── components/
│   ├── home/                 # Homepage sections (Hero, Gallery, etc.)
│   ├── newsletter/           # AI components and sub-popups
│   └── shared/               # Reusable UI elements
├── lib/
│   ├── api.ts                # apiFetch & environment constants
│   └── admin.ts              # Authorization Helpers
└── middleware.ts             # Clerk auth & route protection
```

---

## 🔧 Getting Started

### 1. Installation

```bash
git clone <repo-url>
npm install
```

### 2. Environment Setup

Create a `.env.local` file with the following keys:

```env
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_ADMIN_EMAIL=...

# Cloudflare Worker & API
NEXT_PUBLIC_CLOUDFLARE_API_URL=https://your-worker.workers.dev
CLOUDFLARE_WORKER_SECRET=your_secret_key

# Groq AI
GROQ_API_KEY=gsk_...

# Gmail API (for Newsletter)
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
GMAIL_REFRESH_TOKEN=...
GMAIL_USER=rcsb.allert@gmail.com
```

### 3. Development

```bash
npm run dev
```

---

## ☁️ Cloudflare Setup

### Worker Deployment
```bash
cd cloudflare-worker
npm install
npx wrangler deploy
```

### Database (D1) Initialization
```bash
npx wrangler d1 create rcsb-db
npx wrangler d1 execute rcsb-db --file=./schema.sql
npx wrangler secret put WORKER_SECRET
```

---

## 📊 Database Schema

The SQLite database (D1) manages 9 core tables:

1.  **`projects`** — Unified storage for projects, events, and blog posts.
2.  **`team_members`** — Current Board of Directors with `order_index`.
3.  **`past_presidents`** — Legacy leadership history.
4.  **`gallery_slides`** — Dynamic homepage carousel assets.
5.  **`partners`** — Collaboration and sponsor logos.
6.  **`newsletter_subscribers`** — Audience list with secure tokens.
7.  **`authorized_admins`** — Role-based access control (Admin/Blogger).
8.  **`comments`** — User engagement on blog posts.
9.  **`contact_submissions`** — Contact form message tracking.

---

## 📝 License

Distributed under the MIT License. See [LICENSE](./LICENSE) for details.
