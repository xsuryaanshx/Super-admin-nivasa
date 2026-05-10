import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/layout/Topbar";
import { GlassPanel } from "@/components/ui-fx/GlassPanel";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · Nivasa Admin" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-6">
      <Topbar title="Settings" subtitle="Workspace, security and integrations" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassPanel title="Organization" delay={0.05}>
          <Field label="Company" value="Ami Group" />
          <Field label="Platform" value="Nivasa" />
          <Field label="Region" value="Asia / Mumbai" />
        </GlassPanel>
        <GlassPanel title="Security" delay={0.1}>
          <Toggle label="Two-factor authentication" on />
          <Toggle label="SSO with Google Workspace" on />
          <Toggle label="IP allowlisting" />
        </GlassPanel>
        <GlassPanel title="Integrations" delay={0.15}>
          <Field label="Payments" value="Razorpay · connected" />
          <Field label="Email" value="Resend · connected" />
          <Field label="Backend" value="Supabase · pending setup" />
        </GlassPanel>
        <GlassPanel title="Notifications" delay={0.2}>
          <Toggle label="P1 ticket alerts" on />
          <Toggle label="Failed payment alerts" on />
          <Toggle label="Weekly digest email" on />
        </GlassPanel>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function Toggle({ label, on }: { label: string; on?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
      <span className="text-sm">{label}</span>
      <div className={`h-5 w-9 rounded-full p-0.5 transition ${on ? "" : "bg-white/10"}`}
           style={on ? { background: "var(--gradient-primary)" } : undefined}>
        <div className={`h-4 w-4 rounded-full bg-white transition-transform ${on ? "translate-x-4" : ""}`} />
      </div>
    </div>
  );
}
