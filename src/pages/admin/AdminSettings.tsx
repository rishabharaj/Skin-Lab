import { Store, Bell, Shield, Globe } from "lucide-react";

const AdminSettings = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your store configuration</p>
      </div>

      {/* Store info */}
      <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Store size={20} className="text-primary" />
          <h2 className="font-display font-semibold">Store Information</h2>
        </div>
        <SettingsInput label="Store Name" defaultValue="SkinLab" />
        <SettingsInput label="Contact Email" defaultValue="hello@skinlab.com" />
        <SettingsInput label="Support Phone" defaultValue="+1 (555) 123-4567" />
      </div>

      {/* Shipping */}
      <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Globe size={20} className="text-primary" />
          <h2 className="font-display font-semibold">Shipping</h2>
        </div>
        <SettingsInput label="Free Shipping Threshold" defaultValue="$50.00" />
        <SettingsInput label="Standard Shipping Rate" defaultValue="$5.99" />
        <SettingsInput label="Tax Rate (%)" defaultValue="8" />
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Bell size={20} className="text-primary" />
          <h2 className="font-display font-semibold">Notifications</h2>
        </div>
        <SettingsToggle label="New order alerts" defaultChecked />
        <SettingsToggle label="Low stock warnings" defaultChecked />
        <SettingsToggle label="Customer review alerts" defaultChecked={false} />
      </div>

      {/* Security */}
      <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Shield size={20} className="text-primary" />
          <h2 className="font-display font-semibold">Security</h2>
        </div>
        <SettingsToggle label="Two-factor authentication" defaultChecked={false} />
        <SettingsToggle label="Login notifications" defaultChecked />
      </div>

      <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
        Save Changes
      </button>
    </div>
  );
};

const SettingsInput = ({ label, defaultValue }: { label: string; defaultValue: string }) => (
  <div>
    <label className="text-sm text-muted-foreground mb-1.5 block">{label}</label>
    <input
      type="text"
      defaultValue={defaultValue}
      className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
    />
  </div>
);

const SettingsToggle = ({ label, defaultChecked }: { label: string; defaultChecked: boolean }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm">{label}</span>
    <button
      className={`w-10 h-6 rounded-full transition-colors relative ${defaultChecked ? "bg-primary" : "bg-secondary"}`}
    >
      <span
        className={`absolute top-1 w-4 h-4 rounded-full bg-foreground transition-transform ${defaultChecked ? "left-5" : "left-1"}`}
      />
    </button>
  </div>
);

export default AdminSettings;
