# Kairos — Web Portal

**Staff-only admin & moderator monitoring console.**

The Kairos Web Portal is the internal control plane: platform health,
moderation load, trust signals, user/role management, companies and an
append-only audit trail. Not public — every surface requires a `moderator+`
session. The community app for newcomers lives in the separate
**Kairos — App** project.

> Internal operations tool. Robots are disallowed; no public landing.

---

## Scope

| Surface       | Routes                                                          |
| ------------- | --------------------------------------------------------------- |
| Auth          | `/login`, `/signup`, `/auth/callback`                           |
| Admin         | `/admin`, `/admin/users`, `/admin/companies`, `/admin/moderation`, `/admin/audit` |
| Moderator     | `/moderator`, `/moderator/queue`, `/moderator/trust`            |

Root `/` redirects to `/login`; an authenticated staff session is forwarded
to `/admin`.

## Stack

| Layer      | Tech                                                            |
| ---------- | --------------------------------------------------------------- |
| Frontend   | Next.js 15 (App Router), React 19, TypeScript, Tailwind, shadcn-style UI |
| Backend    | Supabase (Postgres, Auth, RLS)                                  |
| Analytics  | PostHog (optional)                                              |
| Hosting    | Vercel                                                          |

## Features

1. **Admin Control Centre** — monitoring overview, users & roles, companies,
   moderation queue, append-only audit logs.
2. **Moderator Control System** — scoped review desk, review queue, trust
   indicators. Billing / infrastructure / DB admin deliberately out of scope.

## Demo mode (no setup)

Without Supabase env the portal runs against a curated dataset so every screen
is explorable. Default demo identity is `admin` — change with
`NEXT_PUBLIC_DEMO_ROLE` (`moderator` | `admin` | `super_admin`) to exercise
RBAC. Real auth always overrides demo when wired.

## Setup

```bash
npm install
# create .env.local and fill the Supabase keys
npm run dev                     # http://localhost:3000
```

Supabase wiring, optional integrations (PostHog) and the security model are
unchanged from the shared codebase. **Database schema, RLS policies and seed
SQL are intentionally not shipped in this repo** — provision them separately
(migrations first, then seed). The Stripe billing surface is **not** part of
the portal; it ships with Kairos — App.

## Scripts

```bash
npm run dev        # develop
npm run build      # production build
npm run start      # serve production build
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```

## Project structure

```
src/
  app/
    (auth)/        login, signup
    (admin)/       admin control centre   (RBAC: moderator+, pages tighten to admin)
    (moderator)/   moderator control system (RBAC: moderator)
  components/      ui/ (primitives), shell/, admin/, trust/ (badge), brand/
  lib/             auth/ (rbac, guard, session, actions), supabase/, data/ (queries, mod-actions, seed), nav, types
```

> Database schema, RLS policies and seed SQL are **not** included in this
> repository.

## Security model

- **RLS everywhere** — every table has policies (SQL not shipped in repo).
- **RBAC** — `user` → `premium_user` → `moderator` → `admin` → `super_admin`;
  capability matrix in `src/lib/auth/rbac.ts`; route guards in
  `src/lib/auth/guard.ts`; middleware session refresh + protected routing.
- **Privilege-escalation guard** — DB trigger blocks self-role changes; only
  `super_admin` mints admin roles.
- **Append-only audit log** — writes only via a `security definer` function or
  service role; admins read, nobody edits.
- Security headers (HSTS, frame deny, no-sniff) in `next.config.mjs`;
  server-side Zod validation; service-role key server-only.
