"use client";

import { useMemo, useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface ProgressData {
  date: string;
  gain: number;
}

interface WeeklyProgressChartProps {
  data: ProgressData[];
}

export default function WeeklyProgressChart({ data }: WeeklyProgressChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Memoize to prevent complete re-draws on parent renders unnecessarily
  const chartData = useMemo(() => {
    return data;
  }, [data]);

  if (!isMounted) return <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/[.08] dark:bg-zinc-900 dark:border-white/[.145] h-full" />;

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-black/[.08] dark:bg-zinc-900 dark:border-white/[.145] flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Weekly Progress
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Mastery gained over the last 7 days.
        </p>
      </div>

      <div className="flex-grow min-h-[250px] w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 text-sm">
            No mastery gains recorded this week.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.05)" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar
                dataKey="gain"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
