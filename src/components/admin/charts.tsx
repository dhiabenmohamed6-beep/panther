"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Panel, PanelHeader, Badge } from "@/components/admin/ui";
import { formatPrice } from "@/lib/utils";

export interface AnalyticsPoint {
  date: string;
  revenue: number;
  orders: number;
}

const PURPLE = "#5A0891";
const PURPLE_SOFT = "#9C4DCC";
const PURPLE_DEEP = "#2E0A4E";

const shortDate = (iso: string) => {
  const [, month, day] = iso.split("-");
  return `${month}/${day}`;
};

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-purple-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-500">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="mt-0.5 text-sm font-semibold text-purple-950">
          {entry.name === "revenue" ? formatPrice(Number(entry.value)) : entry.value}{" "}
          <span className="font-normal text-purple-500">{entry.name}</span>
        </p>
      ))}
    </div>
  );
}

export function RevenueAreaChart({ data }: { data: AnalyticsPoint[] }) {
  const total = data.reduce((sum, point) => sum + point.revenue, 0);
  const best = data.reduce<AnalyticsPoint | null>(
    (top, point) => (top === null || point.revenue > top.revenue ? point : top),
    null
  );

  return (
    <Panel>
      <PanelHeader
        title="Revenue"
        description="Daily revenue across the selected period"
        action={
          <Badge tone="purple">
            {formatPrice(total)} total
          </Badge>
        }
      />
      <div className="p-5">
        <div className="mb-4 flex flex-wrap gap-2 text-xs text-purple-500">
          <span className="rounded-md bg-purple-50 px-2.5 py-1 font-medium">
            Best day: {best && best.revenue > 0 ? `{shortDate(best.date)} — {formatPrice(best.revenue)}` : "—"}
          </span>
          <span className="rounded-md bg-purple-50 px-2.5 py-1 font-medium">
            Avg / day: {formatPrice(total / (data.length || 1))}
          </span>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 8, bottom: 0, left: -18 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={PURPLE} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={PURPLE} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E9D5F2" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={shortDate}
                stroke="#9C4DCC"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                minTickGap={24}
              />
              <YAxis
                stroke="#9C4DCC"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatPrice(value)}
                width={70}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={PURPLE}
                strokeWidth={2.5}
                fill="url(#revenueFill)"
                dot={false}
                activeDot={{ r: 4, fill: PURPLE_DEEP }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Panel>
  );
}

export function OrdersBarChart({ data }: { data: AnalyticsPoint[] }) {
  const total = data.reduce((sum, point) => sum + point.orders, 0);
  const peak = data.reduce<AnalyticsPoint | null>(
    (top, point) => (top === null || point.orders > top.orders ? point : top),
    null
  );

  return (
    <Panel>
      <PanelHeader
        title="Orders"
        description="Daily order volume"
        action={
          <Badge tone="purple">
            {total} order{total === 1 ? "" : "s"}
          </Badge>
        }
      />
      <div className="p-5">
        <div className="mb-4 flex flex-wrap gap-2 text-xs text-purple-500">
          <span className="rounded-md bg-purple-50 px-2.5 py-1 font-medium">
            Peak: {peak && peak.orders > 0 ? `${shortDate(peak.date)} — ${peak.orders}` : "—"}
          </span>
          <span className="rounded-md bg-purple-50 px-2.5 py-1 font-medium">
            Avg / day: {(total / (data.length || 1)).toFixed(1)}
          </span>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 8, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E9D5F2" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={shortDate}
                stroke="#9C4DCC"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                minTickGap={24}
              />
              <YAxis
                stroke="#9C4DCC"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                width={34}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: PURPLE_SOFT, fillOpacity: 0.08 }} />
              <Bar dataKey="orders" radius={[6, 6, 0, 0]} maxBarSize={26}>
                {data.map((point) => (
                  <Cell key={point.date} fill={point.orders > 0 ? PURPLE : "#E9D5F2"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Panel>
  );
}

export function StatusDonutChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const colors = [PURPLE, PURPLE_SOFT, "#C89BE0", PURPLE_DEEP, "#E9D5F2"];
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <Panel>
      <PanelHeader title="Orders by status" description={`${total} order${total === 1 ? "" : "s"}`} />
      {total === 0 ? (
        <div className="px-6 py-16 text-center text-sm text-purple-500">
          No orders in this period yet.
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 p-5 sm:flex-row">
          <div className="h-52 w-52 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={54}
                  outerRadius={86}
                  paddingAngle={2}
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={entry.label} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value: string) => (
                    <span className="text-xs font-medium text-purple-900">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="w-full space-y-2">
            {data.map((entry, index) => (
              <li
                key={entry.label}
                className="flex items-center justify-between gap-3 rounded-lg border border-purple-100 bg-purple-50/50 px-3 py-2"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-purple-900">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                    aria-hidden="true"
                  />
                  {entry.label}
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-purple-950">{entry.value}</span>
                  <span className="text-xs text-purple-500">
                    {total ? Math.round((entry.value / total) * 100) : 0}%
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Panel>
  );
}

export function RangePicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (days: number) => void;
}) {
  const options = [7, 30, 90];
  return (
    <div className="inline-flex rounded-lg border border-purple-200 bg-white p-0.5">
      {options.map((days) => (
        <button
          key={days}
          type="button"
          onClick={() => onChange(days)}
          aria-pressed={value === days}
          className={
            value === days
              ? "rounded-md bg-purple-700 px-3 py-1.5 text-xs font-semibold text-white"
              : "rounded-md px-3 py-1.5 text-xs font-medium text-purple-700 transition-colors hover:bg-purple-50"
          }
        >
          {days}d
        </button>
      ))}
    </div>
  );
}