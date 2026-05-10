# Deployment Guide — Nivasa Admin

This project is built on **TanStack Start** with the **Cloudflare Workers**
adapter. The production build emits a Worker bundle (not a Node server,
not a static SPA), so the deployment target must understand Workers.

---

## ✅ Recommended: Cloudflare Pages (zero config, free, 2 minutes)

This is what the template is wired for. No file changes needed.

1. Push this repo to GitHub.
2. Go to **Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git**.
3. Pick the repo.
4. Build settings (Cloudflare auto-detects most of this):
   - **Framework preset**: None
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`
5. Click **Save and Deploy**.

`wrangler.jsonc` and `src/server.ts` are already wired. Done.

---

## ❌ Vercel — not supported out of the box

Why your Vercel deploy returned **404 NOT_FOUND on every URL**:

- The build emits a Cloudflare Worker (`.wrangler/` + `dist/_worker.js`),
  not a Node serverless function and not a static SPA.
- `dist/client/` contains JS/CSS assets but **no `index.html`**, because
  HTML is rendered by the Worker at request time. Vercel's static host has
  nothing to serve, so it 404s.
- Pointing `vercel.json` `outputDirectory` at `dist/client/` (the previous
  config) does not fix this — there is no HTML entry to fall back to.

To actually run on Vercel you'd need to:

1. Remove `@cloudflare/vite-plugin` from the build.
2. Swap to a Vercel-compatible TanStack Start adapter (Node or Edge).
3. Delete `wrangler.jsonc` and `src/server.ts`.
4. Reconfigure `vite.config.ts` accordingly.

That's a non-trivial rewrite of the build pipeline. **Cloudflare Pages is
strongly recommended instead** — same Git-based workflow, same auto-deploy
on push, and it just works with this codebase.

---

## Environment variables

Copy `.env.example` to `.env` for local dev. None are required to run the
demo (all data is mocked).

In Cloudflare Pages, add any future env vars under
**Settings → Environment variables**.

---

## Local dev

```bash
bun install      # or npm install
bun dev          # http://localhost:8080
bun run build    # production build
```
