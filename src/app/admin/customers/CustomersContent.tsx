"use client";

import * as React from "react";
import { formatPrice } from "@/lib/utils";
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
  Select,
  Toggle,
  useAdminResource,
  adminRequest,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Search, Pencil, Trash2, Users, Shield } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  orderCount: number;
  lifetimeValue: number;
}

export function CustomersContent() {
  const { data: session } = useSession();
  const { data, loading, error, reload } = useAdminResource<{ customers: Customer[] }>(
    "/api/admin/customers"
  );
  const [query, setQuery] = React.useState("");
  const [editing, setEditing] = React.useState<Customer | null>(null);
  const [deleting, setDeleting] = React.useState<Customer | null>(null);
  const [saving, setSaving] = React.useState(false);

  const customers = data?.customers ?? [];
  const filtered = customers.filter((customer) => {
    const haystack = `${customer.name ?? ""} ${customer.email}`.toLowerCase();
    return !query || haystack.includes(query.toLowerCase());
  });

  const handleDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      await adminRequest(`/api/admin/customers/${deleting.id}`, { method: "DELETE" });
      toast({ title: "Customer deleted", variant: "success" });
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-purple-950">Customers</h1>
        <p className="mt-1 text-sm text-purple-950/50">
          {customers.length} registered user{customers.length === 1 ? "" : "s"}
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Panel>
        <PanelHeader
          title="All customers"
          action={
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-950/35"
                aria-hidden="true"
              />
              <TextInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search customers"
                aria-label="Search customers"
                className="pl-9 sm:w-56"
              />
            </div>
          }
        />

        {loading ? (
          <div className="p-10 text-center text-sm text-purple-950/40">Loading…</div>
        ) : !filtered.length ? (
          <EmptyState title="No customers found" icon={Users} />
        ) : (
          <TableShell>
            <thead>
              <tr>
                <Th>Customer</Th>
                <Th>Role</Th>
                <Th>Orders</Th>
                <Th>Lifetime value</Th>
                <Th>Joined</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.id} className="transition-colors hover:bg-purple-50/60">
                  <Td>
                    <p className="font-semibold text-purple-950">{customer.name || "Unnamed"}</p>
                    <p className="text-xs text-purple-950/45">{customer.email}</p>
                  </Td>
                  <Td>
                    <Badge tone={customer.role === "ADMIN" ? "purple" : "neutral"}>
                      {customer.role === "ADMIN" ? (
                        <Shield className="h-3 w-3" aria-hidden="true" />
                      ) : null}
                      {customer.role}
                    </Badge>
                  </Td>
                  <Td>{customer.orderCount}</Td>
                  <Td className="font-semibold text-purple-950">{formatPrice(customer.lifetimeValue)}</Td>
                  <Td className="whitespace-nowrap text-xs text-purple-950/45">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditing(customer)}
                        disabled={customer.id === session?.user?.id}
                        aria-label={`Edit ${customer.email}`}
                        title={
                          customer.id === session?.user?.id
                            ? "You cannot edit your own account here"
                            : undefined
                        }
                        className="rounded-lg p-2 text-purple-950/50 transition-colors hover:bg-purple-600/10 hover:text-purple-700 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(customer)}
                        disabled={customer.id === session?.user?.id}
                        aria-label={`Delete ${customer.email}`}
                        title={
                          customer.id === session?.user?.id
                            ? "You cannot delete your own account"
                            : undefined
                        }
                        className="rounded-lg p-2 text-purple-950/50 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
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

      {editing && (
        <CustomerModal
          customer={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
        />
      )}

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete customer"
        description="This cannot be undone"
        size="sm"
        footer={
          <>
            <Button variant="light" onClick={() => setDeleting(null)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} loading={saving}>
              Delete customer
            </Button>
          </>
        }
      >
        <p className="text-sm text-purple-950/70">
          Delete <span className="font-semibold text-purple-950">{deleting?.email}</span> and all of their
          order records? Their order history will be removed.
        </p>
      </Modal>
    </div>
  );
}

function CustomerModal({
  customer,
  onClose,
  onSaved,
}: {
  customer: Customer;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = React.useState(customer.name ?? "");
  const [email, setEmail] = React.useState(customer.email);
  const [role, setRole] = React.useState(customer.role);
  const [password, setPassword] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminRequest(`/api/admin/customers/${customer.id}`, {
        method: "PATCH",
        body: JSON.stringify({ name, email, role, password: password || undefined }),
      });
      toast({ title: "Customer updated", variant: "success" });
      onSaved();
    } catch (err) {
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Edit customer"
      description={customer.email}
      footer={
        <>
          <Button variant="light" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="admin" onClick={handleSave} loading={saving}>
            Save changes
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Name" htmlFor="customer-name">
          <TextInput id="customer-name" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>

        <Field label="Email" htmlFor="customer-email">
          <TextInput
            id="customer-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field label="Role" htmlFor="customer-role" hint="Admins can access the admin dashboard">
          <Select id="customer-role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Admin</option>
          </Select>
        </Field>

        <Field label="New password" htmlFor="customer-password" hint="Leave blank to keep the current password">
          <TextInput
            id="customer-password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Optional"
          />
        </Field>
      </div>
    </Modal>
  );
}
