# Deployment Guide — Nivasa Admin

This project is built on **TanStack Start** with the Cloudflare Workers
adapter (provided by `@lovable.dev/vite-tanstack-config`). The production
build emits a Worker bundle, not a Node.js server.

---

## ✅ Recommended: Cloudflare Pages / Workers (zero config)

This is the platform the project is configured for and the fastest path to
production.

1. Push the repo to GitHub.
2. Cloudflare Dashboard → **Workers & Pages → Create → Connect to Git**.
3. Select the repo. Cloudflare auto-detects Vite + Wrangler.
   - Build command: `bun run build` (or `npm run build`)
   - Deploy command: leave default (uses `wrangler.jsonc`)
4. Click **Save and Deploy**.

`wrangler.jsonc` and `src/server.ts` are already wired — no extra setup.

---

## ⚠️ Deploying to Vercel

The default build targets Cloudflare Workers, so a stock Vercel deployment
will fail with "no output directory" or a Worker bundle that Vercel cannot
serve. You have two options:

### Option A — Run as a static SPA on Vercel (simplest)

If you don't need SSR (this admin panel is fully client-side mock data —
SSR is not required), you can deploy the Vite client build only.

1. Add the included `vercel.json` (already in this zip).
2. In Vercel project settings:
   - **Framework Preset**: Other
   - **Build Command**: `bun run build:client` (already added to `package.json`)
   - **Output Directory**: `dist/client`
   - **Install Command**: `bun install` (or `npm install`)
3. Deploy.

### Option B — Switch the SSR target to Vercel

Replace the Cloudflare adapter with the Vercel one. This requires editing
`vite.config.ts` and removing `wrangler.jsonc`, which is beyond the scope of
this generated app — Cloudflare is strongly recommended instead.

---

## Environment variables

Copy `.env.example` to `.env` and fill in any backend keys. None are
required to run the demo (all data is mocked).

---

## Local dev

```bash
bun install
bun dev          # http://localhost:8080
bun run build    # production build
```
