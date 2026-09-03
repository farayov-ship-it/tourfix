"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  new: "#f59e0b",
  contacted: "#38bdf8",
  confirmed: "#34d399",
  closed: "#a1a1aa",
  spam: "#f87171",
};

const CHANNEL_COLORS = ["#25D366", "#2AABEE", "#f59e0b"];

const tooltipStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e4e4e7",
  borderRadius: 8,
  fontSize: 12,
  color: "#18181b",
};

export function BookingsTrendChart({
  data,
}: {
  data: { label: string; total: number; confirmed: number }[];
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="bookingsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e4e4e7" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "#3f3f46", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fill: "#3f3f46", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#3f3f46" }} />
          <Area
            type="monotone"
            dataKey="total"
            name="Arizalar"
            stroke="#f59e0b"
            strokeWidth={2}
            fill="url(#bookingsFill)"
          />
          <Area
            type="monotone"
            dataKey="confirmed"
            name="Tasdiqlangan"
            stroke="#34d399"
            strokeWidth={1.5}
            fill="transparent"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatusDonutChart({
  data,
}: {
  data: { key: string; name: string; value: number }[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-zinc-500">
        Hali ariza yo‘q
      </div>
    );
  }

  return (
    <div className="flex h-64 flex-col items-center sm:flex-row">
      <div className="h-48 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={78}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((d) => (
                <Cell key={d.key} fill={STATUS_COLORS[d.key] ?? "#71717a"} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="w-full space-y-1.5 px-2 text-xs sm:w-40">
        {data.map((d) => (
          <li key={d.key} className="flex items-center justify-between gap-2 text-zinc-700">
            <span className="flex items-center gap-2 font-medium">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: STATUS_COLORS[d.key] ?? "#71717a" }}
              />
              {d.name}
            </span>
            <span className="font-semibold text-zinc-900">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ChannelBarChart({
  data,
}: {
  data: { key: string; name: string; value: number }[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-52 items-center justify-center text-sm text-zinc-500">
        Ma’lumot yo‘q
      </div>
    );
  }

  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="#e4e4e7" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#3f3f46", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fill: "#3f3f46", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="value" name="Arizalar" radius={[6, 6, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={d.key} fill={CHANNEL_COLORS[i % CHANNEL_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
