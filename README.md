## Build Market — Next.js Dashboard

Build Market is a Next.js App Router project with authentication, a responsive landing page, and a protected dashboard. It uses NextAuth for auth (Google OAuth and credentials), Postgres for persistence, and Tailwind CSS for styling.

### Tech stack
- **Framework**: Next.js (App Router)
- **Auth**: NextAuth (Google, Credentials)
- **DB**: Postgres
- **Styling**: Tailwind CSS, Heroicons, Next/Image
- **Deployment**: Vercel

## Getting started

### Prerequisites
- Node.js 18+ and pnpm/npm/yarn
- Postgres database (local or hosted)
- Google Cloud OAuth 2.0 Client (Web)

### 1) Clone and install
```bash
pnpm install
# or
npm install
```

### 2) Configure environment
Create a `.env.local` in the project root with:
```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-strong-random-string

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# Database
POSTGRES_URL=postgres://user:password@host:port/dbname
```

Notes:
- `NEXTAUTH_SECRET`: use `openssl rand -base64 32` (or any secure random).
- `POSTGRES_URL` must be reachable from your environment. SSL is required in `auth.ts` (adjust if needed).

### 3) Run the app
```bash
pnpm dev
# or
npm run dev
```
Open `http://localhost:3000`.

## Authentication

- The sign-in page is at `/login`.
- Google sign-in is available on both desktop and mobile on the landing page and `/login`.
- Credentials sign-in is configured in `auth.ts` using email/password and bcrypt.
- Route protection is handled via `authorized` callback in `auth.config.ts`:
  - Unauthenticated users are blocked from `/dashboard`. Authenticated users visiting non-dashboard routes are redirected to `/dashboard`.

Key files:
- `auth.ts`: NextAuth init, providers (Credentials, Google).
- `auth.config.ts`: NextAuth config and callbacks.
- `app/api/auth/[...nextauth]/route.ts`: Auth API routes.

## Project structure
```
app/
  layout.tsx         # Root layout with Header/Footer
  page.tsx           # Landing page (hero + Google sign-in)
  api/auth/[...nextauth]/route.ts
  ui/GoogleSignIn.tsx
  ui/header.tsx, ui/footer.tsx, ui/fonts.ts
auth.ts
auth.config.ts
```

## Scripts
- `dev`: start local dev server
- `build`: production build
- `start`: start production server

## Deployment (Vercel)
1. Push to GitHub.
2. Import the repo into Vercel.
3. Set Environment Variables (same as `.env.local`).
4. Deploy.

Ensure your Google OAuth Client has authorized redirect URIs for both local and production, e.g.:
- `http://localhost:3000/api/auth/callback/google`
- `https://your-domain.vercel.app/api/auth/callback/google`

## Troubleshooting
- Attempted to call client function from server: move `next-auth/react` APIs (like `signIn`, `getProviders`) into client components (e.g., `app/ui/GoogleSignIn.tsx`).
- Invalid credentials: verify user exists in DB and passwords are hashed with bcrypt.
- OAuth redirect errors: check Google OAuth redirect URIs and env vars.

## License
MIT
