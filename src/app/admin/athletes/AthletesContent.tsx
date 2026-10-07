"use client";

import * as React from "react";
import {
  Panel,
  PanelHeader,
  Badge,
  TableShell,
  Th,
  Td,
  EmptyState,
  Modal,
  Field,
  TextInput,
  TextArea,
  Toggle,
  useAdminResource,
  adminRequest,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Upload, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Athlete {
  id: string;
  name: string;
  instagram: string | null;
  description: string | null;
  image: string | null;
  featured: boolean;
  position: number;
  discountCode: string | null;
  discountPercent: number;
}

const emptyForm = {
  name: "",
  instagram: "",
  description: "",
  image: "",
  featured: true,
  position: 0,
  discountCode: "",
  discountPercent: 0,
};

type FormState = typeof emptyForm & { id?: string };

export function AthletesContent() {
  const { data, loading, error, reload } = useAdminResource<{ athletes: Athlete[] }>(
    "/api/admin/athletes"
  );
  const [form, setForm] = React.useState<FormState | null>(null);
  const [deleting, setDeleting] = React.useState<Athlete | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);

  const athletes = data?.athletes ?? [];

  const openCreate = () => setForm({ ...emptyForm, position: athletes.length });

  const handleUpload = async (file: File) => {
    if (!form) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload-image", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Upload failed");
      setForm((prev) => (prev ? { ...prev, image: json.url } : prev));
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form) return;
    if (!form.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const editing = athletes.find((a) => a.id === form.id);
      if (editing) {
        await adminRequest(`/api/admin/athletes/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(form),
        });
      } else {
        await adminRequest("/api/admin/athletes", { method: "POST", body: JSON.stringify(form) });
      }
      toast({ title: editing ? "Athlete updated" : "Athlete added", variant: "success" });
      setForm(null);
      reload();
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

  const handleDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      await adminRequest(`/api/admin/athletes/${deleting.id}`, { method: "DELETE" });
      toast({ title: "Athlete removed", variant: "success" });
      setDeleting(null);
      reload();
    } catch (err) {
      toast({
        title: "Delete failed",
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
          <h1 className="text-2xl font-bold tracking-tight text-purple-950">Athletes</h1>
          <p className="mt-1 text-sm text-purple-950/50">Manage the crew shown on the storefront</p>
        </div>
        <Button variant="light" onClick={openCreate}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add athlete
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Panel>
        <PanelHeader title="Team" description={`${athletes.length} athlete(s)`} />
        {loading ? (
          <div className="p-10 text-center text-sm text-purple-950/40">Loading…</div>
        ) : !athletes.length ? (
          <EmptyState
            title="No athletes yet"
            description="Add your first athlete to fill the crew section."
            icon={Users}
            action={
              <Button variant="light" onClick={openCreate}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add athlete
              </Button>
            }
          />
        ) : (
          <TableShell>
            <thead>
              <tr>
                <Th>Athlete</Th>
                <Th>Instagram</Th>
                <Th>Discount Code</Th>
                <Th>Discount %</Th>
                <Th>Position</Th>
                <Th>Featured</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {athletes.map((athlete) => (
                <tr key={athlete.id} className="transition-colors hover:bg-purple-50/60">
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-purple-200/70 bg-black/[0.03]">
                        {athlete.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={athlete.image} alt="" className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-purple-950">{athlete.name}</p>
                        <p className="truncate text-xs text-purple-950/45">{athlete.description || "—"}</p>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    {athlete.instagram ? (
                      <a
                        href={athlete.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 hover:underline"
                      >
                        {athlete.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, "@")}
                      </a>
                    ) : (
                      <span className="text-xs text-purple-950/35">—</span>
                    )}
                  </Td>
                  <Td>
                    {athlete.discountCode ? (
                      <code className="text-sm bg-purple-50 px-2 py-1 rounded text-purple-950 font-mono">
                        {athlete.discountCode}
                      </code>
                    ) : (
                      <span className="text-xs text-purple-950/35">—</span>
                    )}
                  </Td>
                  <Td>
                    {athlete.discountPercent > 0 ? (
                      <span className="text-sm font-medium text-green-700">{athlete.discountPercent}%</span>
                    ) : (
                      <span className="text-xs text-purple-950/35">—</span>
                    )}
                  </Td>
                  <Td>{athlete.position}</Td>
                  <Td>
                    <Badge tone={athlete.featured ? "purple" : "neutral"}>
                      {athlete.featured ? "Featured" : "Hidden"}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            ...athlete,
                            instagram: athlete.instagram ?? "",
                            description: athlete.description ?? "",
                            image: athlete.image ?? "",
                            discountCode: athlete.discountCode ?? "",
                          })
                        }
                        aria-label={`Edit ${athlete.name}`}
                        className="rounded-lg p-2 text-purple-950/50 transition-colors hover:bg-purple-600/10 hover:text-purple-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(athlete)}
                        aria-label={`Delete ${athlete.name}`}
                        className="rounded-lg p-2 text-purple-950/50 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        )}
      </Panel>

      {form && (
        <Modal
          open
          onClose={() => setForm(null)}
          title={athletes.some((a) => a.id === form.id) ? "Edit athlete" : "New athlete"}
          footer={
            <>
              <Button variant="light" onClick={() => setForm(null)} disabled={saving}>
                Cancel
              </Button>
              <Button variant="admin" onClick={handleSave} loading={saving}>
                Save
              </Button>
            </>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" htmlFor="athlete-name" className="sm:col-span-2">
              <TextInput
                id="athlete-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Marcus Steele"
              />
            </Field>

            <Field label="Instagram URL" htmlFor="athlete-instagram" className="sm:col-span-2">
              <TextInput
                id="athlete-instagram"
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                placeholder="https://instagram.com/username"
              />
            </Field>

            <Field label="Description" htmlFor="athlete-description" className="sm:col-span-2">
              <TextArea
                id="athlete-description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Powerlifter. 3x National Champion. Built different."
              />
            </Field>

            <Field label="Discount Code" htmlFor="athlete-discount-code" hint="Unique code customers use at checkout (e.g., MARCUS20)">
              <TextInput
                id="athlete-discount-code"
                value={form.discountCode}
                onChange={(e) => setForm({ ...form, discountCode: e.target.value.toUpperCase() })}
                placeholder="MARCUS20"
                maxLength={20}
              />
            </Field>

            <Field label="Discount %" htmlFor="athlete-discount-percent" hint="Percentage discount this code gives (0-100)">
              <TextInput
                id="athlete-discount-percent"
                type="number"
                min="0"
                max="100"
                value={form.discountPercent}
                onChange={(e) => setForm({ ...form, discountPercent: Math.min(100, Math.max(0, Number(e.target.value))) })}
              />
            </Field>

            <Field label="Image URL" htmlFor="athlete-image">
              <TextInput
                id="athlete-image"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="/images/crew1.png"
              />
            </Field>

            <div className="flex items-end">
              <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-purple-200 px-4 text-sm font-medium text-purple-950 transition-colors hover:bg-purple-50">
                <Upload className="h-4 w-4" aria-hidden="true" />
                {uploading ? "Uploading…" : "Upload"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>

            <Field label="Position" htmlFor="athlete-position" hint="Lower numbers show first">
              <TextInput
                id="athlete-position"
                type="number"
                min="0"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: Number(e.target.value) })}
              />
            </Field>

            <div className="flex items-end">
              <Toggle
                id="athlete-featured"
                checked={form.featured}
                onChange={(v) => setForm({ ...form, featured: v })}
                label="Featured"
                hint="Show on the storefront crew section"
              />
            </div>
          </div>
        </Modal>
      )}

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Remove athlete"
        size="sm"
        footer={
          <>
            <Button variant="light" onClick={() => setDeleting(null)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} loading={saving}>
              Remove
            </Button>
          </>
        }
      >
        <p className="text-sm text-purple-950/70">
          Remove <span className="font-semibold text-purple-950">{deleting?.name}</span> from the crew?
        </p>
      </Modal>
    </div>
  );
}
