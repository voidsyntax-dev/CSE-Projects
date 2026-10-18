"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export interface RadarData {
  skill: string;
  mastery: number;
  fullMark: 100;
}

interface MasteryRadarChartProps {
  data: RadarData[];
}

export default function MasteryRadarChart({ data }: MasteryRadarChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const chartData = useMemo(() => {
    // Recharts radar expects an array of objects
    return data;
  }, [data]);

  if (!isMounted) return <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/[.08] dark:bg-zinc-900 dark:border-white/[.145] h-full" />;

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-black/[.08] dark:bg-zinc-900 dark:border-white/[.145] flex flex-col h-full">
      <div className="mb-2">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Mastery Radar
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Your proficiency distribution across skills.
        </p>
      </div>

      <div className="flex-grow min-h-[250px] w-full mt-4">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 text-sm">
            No skill data available to map.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: "#6b7280", fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              <Radar
                name="Mastery"
                dataKey="mastery"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.4}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
