"use client";

import * as React from "react";
import {
  Panel,
  PanelHeader,
  TableShell,
  Th,
  Td,
  Badge,
  EmptyState,
  useAdminResource,
  adminRequest,
} from "@/components/admin/ui";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, Mail, Trash2, Loader2, RefreshCw } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  createdAt: string;
}

const STATUS_TONES: Record<string, "yellow" | "blue" | "green" | "red"> = {
  NEW: "yellow",
  READ: "blue",
  REPLIED: "green",
  SPAM: "red",
};

export function MessagesContent() {
  const [filter, setFilter] = React.useState("ALL");
  const { data, loading, error, reload } = useAdminResource<{ messages: ContactMessage[] }>(
    `/api/admin/messages?status=${filter}`,
  );
  const [busyId, setBusyId] = React.useState<string | null>(null);

  const messages = data?.messages ?? [];

  const updateStatus = async (id: string, status: string) => {
    setBusyId(id);
    try {
      await adminRequest("/api/admin/messages", {
        method: "PATCH",
        body: JSON.stringify({ id, status }),
      });
      await reload();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Could not update message",
        variant: "destructive",
      });
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    setBusyId(id);
    try {
      await adminRequest(`/api/admin/messages?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      toast({ title: "Message deleted", variant: "success" });
      await reload();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Could not delete message",
        variant: "destructive",
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <Panel>
        <PanelHeader
          title="Contact messages"
          description="Submissions from the storefront contact form"
          action={
            <>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                aria-label="Filter messages by status"
                className="h-9 rounded-lg border border-purple-200 bg-white px-3 text-xs font-medium text-purple-950"
              >
                <option value="ALL">All statuses</option>
                <option value="NEW">New</option>
                <option value="READ">Read</option>
                <option value="REPLIED">Replied</option>
                <option value="SPAM">Spam</option>
              </select>
              <button
                type="button"
                onClick={reload}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-purple-200 px-3 text-xs font-medium text-purple-800 transition-colors hover:bg-purple-50"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Refresh
              </button>
            </>
          }
        />

        {loading ? (
          <div className="flex items-center gap-3 p-6 text-sm text-purple-950/50">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Loading messages…
          </div>
        ) : error ? (
          <div className="m-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        ) : messages.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No messages"
            description="Contact form submissions will appear here."
          />
        ) : (
          <TableShell>
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <Th>From</Th>
                  <Th>Message</Th>
                  <Th>Received</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100">
                {messages.map((message) => (
                  <tr key={message.id} className="align-top">
                    <Td className="whitespace-nowrap">
                      <p className="font-medium text-purple-950">{message.name}</p>
                      <a
                        href={`mailto:${message.email}`}
                        className="text-xs text-purple-700 underline underline-offset-2"
                      >
                        {message.email}
                      </a>
                    </Td>
                    <Td>
                      {message.subject && (
                        <p className="font-medium text-purple-950">{message.subject}</p>
                      )}
                      <p className="mt-1 max-w-md whitespace-pre-line text-purple-950/70">
                        {message.message}
                      </p>
                    </Td>
                    <Td className="whitespace-nowrap text-xs text-purple-950/60">
                      {new Date(message.createdAt).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Td>
                    <Td>
                      <Badge tone={STATUS_TONES[message.status] ?? "neutral"}>{message.status}</Badge>
                    </Td>
                    <Td className="whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <a
                          href={`mailto:${message.email}?subject=${encodeURIComponent(
                            `Re: ${message.subject || "Your Panther enquiry"}`,
                          )}`}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-purple-200 px-2.5 text-xs font-medium text-purple-800 transition-colors hover:bg-purple-50"
                        >
                          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                          Reply
                        </a>
                        {message.status === "NEW" && (
                          <button
                            type="button"
                            onClick={() => updateStatus(message.id, "READ")}
                            disabled={busyId === message.id}
                            className="h-8 rounded-lg border border-purple-200 px-2.5 text-xs font-medium text-purple-800 transition-colors hover:bg-purple-50 disabled:opacity-50"
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => remove(message.id)}
                          disabled={busyId === message.id}
                          aria-label={`Delete message from ${message.name}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableShell>
        )}
      </Panel>
    </div>
  );
}