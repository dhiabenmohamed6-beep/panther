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
  Field,
  TextInput,
  Toggle,
  useAdminResource,
  adminRequest,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, MessageSquareText, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MarqueeMessage {
  id: string;
  text: string;
  enabled: boolean;
  position: number;
}

export function MarqueeContent() {
  const { data, loading, error, reload } = useAdminResource<{ messages: MarqueeMessage[] }>(
    "/api/admin/marquee"
  );
  const [text, setText] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [busy, setBusy] = React.useState<string | null>(null);

  const messages = data?.messages ?? [];

  const addMessage = async () => {
    if (!text.trim()) {
      toast({ title: "Message text is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await adminRequest("/api/admin/marquee", {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      toast({ title: "Message added", variant: "success" });
      setText("");
      reload();
    } catch (err) {
      toast({
        title: "Add failed",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const patch = async (message: MarqueeMessage, data: Partial<MarqueeMessage>) => {
    setBusy(message.id);
    try {
      await adminRequest(`/api/admin/marquee/${message.id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      reload();
    } catch (err) {
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    } finally {
      setBusy(null);
    }
  };

  const remove = async (message: MarqueeMessage) => {
    setBusy(message.id);
    try {
      await adminRequest(`/api/admin/marquee/${message.id}`, { method: "DELETE" });
      toast({ title: "Message removed", variant: "success" });
      reload();
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    } finally {
      setBusy(null);
    }
  };

  const move = async (message: MarqueeMessage, direction: -1 | 1) => {
    const index = messages.findIndex((m) => m.id === message.id);
    const target = messages[index + direction];
    if (!target) return;
    setBusy(message.id);
    try {
      await Promise.all([
        adminRequest(`/api/admin/marquee/${message.id}`, {
          method: "PATCH",
          body: JSON.stringify({ position: target.position }),
        }),
        adminRequest(`/api/admin/marquee/${target.id}`, {
          method: "PATCH",
          body: JSON.stringify({ position: message.position }),
        }),
      ]);
      reload();
    } catch (err) {
      toast({
        title: "Reorder failed",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-purple-950">Marquee</h1>
        <p className="mt-1 text-sm text-purple-950/50">
          Scrolling announcements shown across the storefront
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Panel>
        <PanelHeader title="Add a message" description="Messages rotate in the order listed below" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Field label="Message" htmlFor="marquee-text" className="flex-1">
            <TextInput
              id="marquee-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="FREE SHIPPING ON ORDERS OVER 150 DT"
              onKeyDown={(e) => {
                if (e.key === "Enter") addMessage();
              }}
            />
          </Field>
          <Button variant="admin" onClick={addMessage} loading={saving} className="sm:mb-0.5">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add message
          </Button>
        </div>
      </Panel>

      <Panel>
        <PanelHeader title="Messages" description={`${messages.length} message(s)`} />
        {loading ? (
          <div className="p-10 text-center text-sm text-purple-950/40">Loading…</div>
        ) : !messages.length ? (
          <EmptyState
            title="No marquee messages"
            description="Add an announcement to display it on the storefront."
            icon={MessageSquareText}
          />
        ) : (
          <TableShell>
            <thead>
              <tr>
                <Th>Message</Th>
                <Th>Status</Th>
                <Th>Order</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message, index) => (
                <tr key={message.id} className="transition-colors hover:bg-purple-50/60">
                  <Td className="font-medium text-purple-950">{message.text}</Td>
                  <Td>
                    <Badge tone={message.enabled ? "green" : "neutral"}>
                      {message.enabled ? "Live" : "Hidden"}
                    </Badge>
                  </Td>
                  <Td>{index + 1}</Td>
                  <Td>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => move(message, -1)}
                        disabled={index === 0 || busy === message.id}
                        aria-label="Move up"
                        className="rounded-lg p-2 text-purple-950/50 transition-colors hover:bg-purple-50 disabled:opacity-30"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(message, 1)}
                        disabled={index === messages.length - 1 || busy === message.id}
                        aria-label="Move down"
                        className="rounded-lg p-2 text-purple-950/50 transition-colors hover:bg-purple-50 disabled:opacity-30"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => patch(message, { enabled: !message.enabled })}
                        disabled={busy === message.id}
                        aria-label={message.enabled ? "Hide message" : "Show message"}
                        className="rounded-lg px-2 py-1.5 text-xs font-medium text-purple-700 transition-colors hover:bg-purple-600/10"
                      >
                        {message.enabled ? "Hide" : "Show"}
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(message)}
                        disabled={busy === message.id}
                        aria-label="Delete message"
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
    </div>
  );
}
