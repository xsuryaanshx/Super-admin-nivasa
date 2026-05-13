import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouter,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AppShell } from "@/components/layout/AppShell";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-strong p-10 max-w-md text-center">
        <h1 className="text-7xl font-display font-semibold text-gradient">404</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          This signal didn't reach the control center.
        </p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-background"
              style={{ background: "var(--gradient-primary)" }}>
          Return to overview
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-strong p-10 max-w-md text-center">
        <h1 className="font-display text-xl">Subsystem fault detected</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-background"
          style={{ background: "var(--gradient-primary)" }}
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Nivasa · Admin Control Center · Ami Group" },
      { name: "description", content: "Super-admin control plane for the Nivasa property management SaaS by Ami Group." },
      { name: "author", content: "Ami Group" },
      { property: "og:title", content: "Nivasa · Admin Control Center" },
      { property: "og:description", content: "Platform analytics, landlord operations and SaaS revenue intelligence for Nivasa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
      <Toaster
        theme="dark"
        position="bottom-right"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            toast: "glass-strong !bg-transparent !border-white/10 !text-foreground",
          },
        }}
      />
    </QueryClientProvider>
  );
}
