"use client";

import * as React from "react";
import {
  Panel,
  PanelHeader,
  TableShell,
  Th,
  Td,
  EmptyState,
  Modal,
  Field,
  TextInput,
  useAdminResource,
  adminRequest,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Ruler } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SizeRow {
  id: string;
  size: string;
  chest: number;
  length: number;
  shoulder: number;
}

const emptyForm = { size: "", chest: "", length: "", shoulder: "" };

type FormState = typeof emptyForm & { id?: string };

export function SizeGuideContent() {
  const { data, loading, error, reload } = useAdminResource<{ sizes: SizeRow[] }>(
    "/api/admin/size-guide"
  );
  const [form, setForm] = React.useState<FormState | null>(null);
  const [deleting, setDeleting] = React.useState<SizeRow | null>(null);
  const [saving, setSaving] = React.useState(false);

  const rows = data?.sizes ?? [];

  const handleSave = async () => {
    if (!form) return;
    if (!form.size.trim()) {
      toast({ title: "Size is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        size: form.size,
        chest: Number(form.chest) || 0,
        length: Number(form.length) || 0,
        shoulder: Number(form.shoulder) || 0,
      };
      if (form.id) {
        await adminRequest(`/api/admin/size-guide/${form.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await adminRequest("/api/admin/size-guide", { method: "POST", body: JSON.stringify(payload) });
      }
      toast({ title: form.id ? "Size updated" : "Size added", variant: "success" });
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
      await adminRequest(`/api/admin/size-guide/${deleting.id}`, { method: "DELETE" });
      toast({ title: "Size removed", variant: "success" });
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
          <h1 className="text-2xl font-bold tracking-tight text-purple-950">Size guide</h1>
          <p className="mt-1 text-sm text-purple-950/50">Measurements in centimetres</p>
        </div>
        <Button variant="light" onClick={() => setForm({ ...emptyForm })}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add size
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Panel>
        <PanelHeader title="Measurements" description={`${rows.length} size(s)`} />
        {loading ? (
          <div className="p-10 text-center text-sm text-purple-950/40">Loading…</div>
        ) : !rows.length ? (
          <EmptyState
            title="No sizes configured"
            description="Add your first size to publish the size guide."
            icon={Ruler}
            action={
              <Button variant="light" onClick={() => setForm({ ...emptyForm })}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add size
              </Button>
            }
          />
        ) : (
          <TableShell>
            <thead>
              <tr>
                <Th>Size</Th>
                <Th>Chest (cm)</Th>
                <Th>Length (cm)</Th>
                <Th>Shoulder (cm)</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-purple-50/60">
                  <Td className="font-semibold uppercase text-purple-950">{row.size}</Td>
                  <Td>{row.chest}</Td>
                  <Td>{row.length}</Td>
                  <Td>{row.shoulder}</Td>
                  <Td>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            id: row.id,
                            size: row.size,
                            chest: String(row.chest),
                            length: String(row.length),
                            shoulder: String(row.shoulder),
                          })
                        }
                        aria-label={`Edit size ${row.size}`}
                        className="rounded-lg p-2 text-purple-950/50 transition-colors hover:bg-purple-600/10 hover:text-purple-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(row)}
                        aria-label={`Delete size ${row.size}`}
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
          title={form.id ? "Edit size" : "New size"}
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
            <Field label="Size" htmlFor="size-label">
              <TextInput
                id="size-label"
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value.toUpperCase() })}
                placeholder="M"
                className="uppercase"
              />
            </Field>
            <Field label="Chest (cm)" htmlFor="size-chest">
              <TextInput
                id="size-chest"
                type="number"
                min="0"
                value={form.chest}
                onChange={(e) => setForm({ ...form, chest: e.target.value })}
              />
            </Field>
            <Field label="Length (cm)" htmlFor="size-length">
              <TextInput
                id="size-length"
                type="number"
                min="0"
                value={form.length}
                onChange={(e) => setForm({ ...form, length: e.target.value })}
              />
            </Field>
            <Field label="Shoulder (cm)" htmlFor="size-shoulder">
              <TextInput
                id="size-shoulder"
                type="number"
                min="0"
                value={form.shoulder}
                onChange={(e) => setForm({ ...form, shoulder: e.target.value })}
              />
            </Field>
          </div>
        </Modal>
      )}

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Remove size"
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
          Remove size <span className="font-semibold uppercase text-purple-950">{deleting?.size}</span>{" "}
          from the size guide?
        </p>
      </Modal>
    </div>
  );
}
