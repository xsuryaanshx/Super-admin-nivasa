# Nivasa · Admin Control Center

A futuristic super-admin platform for **Ami Group** to operate the **Nivasa** property-management SaaS.

> Nivasa is the product Ami Group sells to landlords (who manage their buildings, tenants, rooms, rent and occupancy). This dashboard is **not** for tenants or landlords — it is the internal control plane for Ami Group to monitor every landlord, building, subscription and SaaS metric across the entire platform.

## Features

- **Cinematic boot sequence** — ambient grid, wireframe building assembly, data streams, system init log, brand reveal.
- **Platform Overview** — every key SaaS metric (active landlords, MRR, churn, occupancy), live activity feed, system status, recent landlords.
- **Landlords** — searchable / filterable / sortable landlord cards with detail side-panel and usage analytics drawer.
- **Buildings & Properties** — animated cards with wireframe building art, occupancy bars, health and maintenance status.
- **Subscriptions** — tier cards, MRR bar chart, renewal & failure rollup, upsell recommendations.
- **Revenue** — MRR / ARR / NRR / ARPU stats, area + line charts.
- **Platform Analytics** — growth charts, plan distribution radial, occupancy heatmap by city, churn signal.
- **AI Insights** — glowing AI orb, typing-animated daily briefing, alert / opportunity cards, "Ask Nivasa AI" prompt.
- **Support Center** — ticket dashboard with priority / status chips and response analytics.
- **Notifications & Settings** — notification stream, organization, security, integrations, alert preferences.

## Stack

- React 19 + TypeScript
- TanStack Start v1 (file-based routing, SSR-ready)
- Tailwind CSS v4 (oklch design tokens, glassmorphism utility classes)
- Framer Motion (page transitions, stagger, spring physics, animated counters, boot sequence)
- Recharts (area / bar / line / radial charts)
- Zustand (ready for future client state)
- TanStack Query (provider wired, ready for Supabase)
- shadcn/ui primitives
- lucide-react icons

## Design System

Defined in `src/styles.css` using **oklch** semantic tokens.

| Token | Hex |
|------|-----|
| `--cyan` | `#00D1FF` |
| `--blue` | `#2563EB` |
| `--violet` | `#7C3AED` |
| `--emerald` | `#10B981` |

Utility classes: `.glass`, `.glass-strong`, `.neon-border`, `.text-gradient`, `.grid-bg`, `.glow-cyan`, `.glow-violet`, `.glow-emerald`, `.animate-pulse-glow`, `.animate-float`, `.shimmer`.

Fonts: **Space Grotesk** (display) + **JetBrains Mono** (mono).

## Data

All data is mocked in `src/lib/mock-data.ts`. Every export represents a future database query (landlords, buildings, revenue series, tickets, AI insights, system status). Swap with Supabase / TanStack Query for production — `QueryClientProvider` is already wired in `__root.tsx`.

## Local development

```bash
bun install        # or pnpm install / npm install
bun dev            # starts the dev server on http://localhost:8080
bun run build      # production build
```

## Deployment

### Vercel

1. Push this repo to GitHub.
2. On vercel.com → **New Project** → import the repo.
3. Vercel auto-detects TanStack Start. Defaults are correct:
   - Build command: `bun run build` (or `npm run build`)
   - Output directory: handled by the framework adapter
4. Add any env vars from `.env.example` if you wire up backends.
5. Deploy.

### Other targets

The build is edge-runtime compatible (Cloudflare Workers, Netlify Edge). For a static export, pre-render any public route tree from `src/routes/`.

## Future Supabase integration

The architecture is ready:
- `QueryClient` is created per-request inside `getRouter()` (SSR-safe).
- All UI reads from `src/lib/mock-data.ts` — swap each export for a server function under `src/lib/*.functions.ts` calling Supabase.
- Add Lovable Cloud / Supabase env vars to `.env` (see `.env.example`).
- Use the `user_roles` table pattern (separate table, `has_role` security-definer function) for super-admin gating.

## License

Proprietary · Ami Group · 2026
