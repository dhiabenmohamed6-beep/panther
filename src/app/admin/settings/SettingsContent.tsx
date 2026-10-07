"use client";

import * as React from "react";
import {
  Panel,
  PanelHeader,
  Field,
  TextInput,
  TextArea,
  Toggle,
  Badge,
  adminRequest,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Save, Store, Truck, CreditCard, Wrench } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Settings {
  brandName: string;
  tagline: string | null;
  logo: string | null;
  instagramUrl: string;
  contactEmail: string;
  contactPhone: string | null;
  shippingPrice: number;
  freeShippingOver: number;
  currency: string;
  storeStatus: boolean;
  maintenanceMode: boolean;
}

const defaults: Settings = {
  brandName: "PANTHER",
  tagline: null,
  logo: null,
  instagramUrl: "",
  contactEmail: "",
  contactPhone: null,
  shippingPrice: 5,
  freeShippingOver: 150,
  currency: "TND",
  storeStatus: true,
  maintenanceMode: false,
};

export function SettingsContent() {
  const [form, setForm] = React.useState<Settings>(defaults);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load settings");
        if (active && json.settings) {
          setForm({
            ...defaults,
            ...json.settings,
            tagline: json.settings.tagline ?? "",
            logo: json.settings.logo ?? "",
            contactPhone: json.settings.contactPhone ?? "",
          });
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Failed to load settings");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await adminRequest("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify(form),
      });
      toast({ title: "Settings saved", variant: "success" });
    } catch (err) {
      toast({
        title: "Save failed",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-purple-950">Settings</h1>
          <p className="mt-1 text-sm text-purple-950/50">Store details, contact info and shipping rules</p>
        </div>
        <Button variant="admin" onClick={save} loading={saving} disabled={loading}>
          <Save className="h-4 w-4" aria-hidden="true" />
          Save settings
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-purple-200/70 bg-white px-4 py-3">
        <Badge tone={form.storeStatus ? "green" : "red"}>
          <Store className="h-3 w-3" aria-hidden="true" />
          {form.storeStatus ? "Store open" : "Store closed"}
        </Badge>
        <Badge tone={form.maintenanceMode ? "yellow" : "neutral"}>
          <Wrench className="h-3 w-3" aria-hidden="true" />
          {form.maintenanceMode ? "Maintenance mode" : "No maintenance"}
        </Badge>
      </div>

      <Panel>
        <PanelHeader title="Brand" description="Shown in the navbar, footer and metadata" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Brand name" htmlFor="settings-brand">
            <TextInput
              id="settings-brand"
              value={form.brandName}
              onChange={(e) => setForm({ ...form, brandName: e.target.value })}
            />
          </Field>
          <Field label="Tagline" htmlFor="settings-tagline">
            <TextInput
              id="settings-tagline"
              value={form.tagline ?? ""}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              placeholder="Built different"
            />
          </Field>
          <Field label="Logo path" htmlFor="settings-logo" className="sm:col-span-2" hint="For example /images/logo.png">
            <TextInput
              id="settings-logo"
              value={form.logo ?? ""}
              onChange={(e) => setForm({ ...form, logo: e.target.value })}
              placeholder="/images/logo.png"
            />
          </Field>
          <Field label="Instagram URL" htmlFor="settings-instagram" className="sm:col-span-2">
            <TextInput
              id="settings-instagram"
              value={form.instagramUrl}
              onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
              placeholder="https://instagram.com/panther"
            />
          </Field>
        </div>
      </Panel>

      <Panel>
        <PanelHeader title="Contact" description="Shown in the footer and contact page" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Contact email" htmlFor="settings-email">
            <TextInput
              id="settings-email"
              type="email"
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            />
          </Field>
          <Field label="Contact phone" htmlFor="settings-phone">
            <TextInput
              id="settings-phone"
              value={form.contactPhone ?? ""}
              onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
              placeholder="Optional"
            />
          </Field>
        </div>
      </Panel>

      <Panel>
        <PanelHeader
          title="Shipping & currency"
          description="Applied at checkout"
          action={<Truck className="h-4 w-4 text-purple-950/35" aria-hidden="true" />}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Shipping price" htmlFor="settings-shipping">
            <TextInput
              id="settings-shipping"
              type="number"
              min="0"
              step="0.01"
              value={form.shippingPrice}
              onChange={(e) => setForm({ ...form, shippingPrice: Number(e.target.value) })}
            />
          </Field>
          <Field label="Free shipping over" htmlFor="settings-free" hint="Set 0 to disable">
            <TextInput
              id="settings-free"
              type="number"
              min="0"
              step="0.01"
              value={form.freeShippingOver}
              onChange={(e) => setForm({ ...form, freeShippingOver: Number(e.target.value) })}
            />
          </Field>
          <Field label="Currency" htmlFor="settings-currency">
            <TextInput
              id="settings-currency"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })}
              maxLength={3}
            />
          </Field>
        </div>
      </Panel>

      <Panel>
        <PanelHeader title="Store status" description="Control storefront availability" />
        <div className="space-y-4">
          <Toggle
            id="settings-store-status"
            checked={form.storeStatus}
            onChange={(v) => setForm({ ...form, storeStatus: v })}
            label="Store is open"
            hint="Customers can browse and check out"
          />
          <Toggle
            id="settings-maintenance"
            checked={form.maintenanceMode}
            onChange={(v) => setForm({ ...form, maintenanceMode: v })}
            label="Maintenance mode"
            hint="Pause ordering while you make changes"
          />
        </div>
      </Panel>

      <div className="flex justify-end">
        <Button variant="admin" onClick={save} loading={saving} disabled={loading}>
          <CreditCard className="h-4 w-4" aria-hidden="true" />
          Save settings
        </Button>
      </div>
    </div>
  );
}
