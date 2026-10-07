"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Panel({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-xl border border-purple-200/70 bg-white", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-purple-200/70 p-5 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div>
        <h2 className="text-sm font-bold tracking-wider uppercase text-purple-950">{title}</h2>
        {description && <p className="mt-1 text-xs text-purple-950/50">{description}</p>}
      </div>
      {action && <div className="flex flex-wrap items-center gap-2">{action}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
  tone?: "neutral" | "positive" | "warning" | "danger";
}) {
  const tones = {
    neutral: "text-purple-950",
    positive: "text-purple-700",
    warning: "text-amber-600",
    danger: "text-red-600",
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-purple-200/70 bg-white p-5">
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-purple-600/10 blur-2xl" />
      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium uppercase tracking-wider text-purple-950/50">{label}</p>
          {Icon && <Icon className="h-4 w-4 text-purple-700" />}
        </div>
        <p className={cn("mt-2 text-2xl font-bold", tones[tone])}>{value}</p>
        {hint && <p className="mt-1 text-xs text-purple-950/40">{hint}</p>}
      </div>
    </div>
  );
}

export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="block text-[11px] font-semibold uppercase tracking-wider text-purple-950/60">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-purple-950/40">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function TextInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-lg border border-purple-200 bg-white px-3 text-sm text-purple-950 transition-colors placeholder:text-purple-950/35 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20",
        className
      )}
      {...props}
    />
  );
}

export function TextArea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg border border-purple-200 bg-white px-3 py-2 text-sm text-purple-950 transition-colors placeholder:text-purple-950/35 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20",
        className
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-lg border border-purple-200 bg-white px-3 text-sm text-purple-950 transition-colors focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
  id,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  hint?: string;
  id: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-purple-600" : "bg-purple-200"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          )}
        />
      </button>
      <label htmlFor={id} className="cursor-pointer select-none">
        <span className="block text-sm font-medium text-purple-950">{label}</span>
        {hint && <span className="block text-xs text-purple-950/50">{hint}</span>}
      </label>
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "green" | "yellow" | "blue" | "purple" | "red";
  className?: string;
}) {
  const tones = {
    neutral: "bg-purple-50 text-purple-950/70 border-purple-200/70",
    green: "bg-purple-50 text-purple-800 border-purple-200",
    yellow: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-sky-50 text-sky-700 border-sky-200",
    purple: "bg-violet-50 text-violet-700 border-violet-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon: Icon,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="px-6 py-16 text-center">
      {Icon && <Icon className="mx-auto mb-4 h-10 w-10 text-purple-950/15" />}
      <p className="text-sm font-semibold text-purple-950">{title}</p>
      {description && <p className="mx-auto mt-1 max-w-sm text-sm text-purple-950/50">{description}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

export function TableShell({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full min-w-[720px] text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "whitespace-nowrap border-b border-purple-200/70 bg-purple-50/60 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-purple-950/50",
        className
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <td className={cn("border-b border-purple-100 px-4 py-3 align-middle text-purple-950/70", className)}>
      {children}
    </td>
  );
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl" };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-purple-500 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          "flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-purple-200/70 bg-white shadow-2xl sm:rounded-2xl",
          sizes[size],
          // Full width on mobile for lg modals
          size === "lg" && "sm:max-w-4xl w-full"
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-purple-200/70 p-5">
          <div>
            <h2 className="text-base font-bold tracking-wide uppercase text-purple-950">{title}</h2>
            {description && <p className="mt-1 text-xs text-purple-950/50">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-purple-950/40 transition-colors hover:bg-purple-50 hover:text-purple-950"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">{children}</div>

        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-purple-200/70 bg-purple-50/60 p-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function useAdminResource<T>(url: string) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, { cache: "no-store" });
      const text = await res.text();
      if (!res.ok) {
        let errMsg = "Failed to load";
        try {
          const json = JSON.parse(text);
          errMsg = json.error || errMsg;
        } catch {
          // Response is not JSON (e.g., HTML redirect)
        }
        throw new Error(errMsg);
      }
      if (!text) throw new Error("Empty response");
      setData(JSON.parse(text));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [url]);

  React.useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load, setData };
}

export async function adminRequest(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) {
    let errMsg = "Request failed";
    try {
      const json = JSON.parse(text);
      errMsg = json.error || errMsg;
    } catch {
      // Response is not JSON
    }
    throw new Error(errMsg);
  }
  if (!text) return {};
  return JSON.parse(text);
}
