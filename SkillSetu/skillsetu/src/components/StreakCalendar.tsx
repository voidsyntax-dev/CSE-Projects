"use client";

import { useMemo } from "react";

interface DailyActivity {
  date: Date;
  goalMet: boolean;
}

interface StreakCalendarProps {
  activities: DailyActivity[];
}

export default function StreakCalendar({ activities }: StreakCalendarProps) {
  const days = useMemo(() => {
    // Generate last 28 days (4 weeks)
    const result = [];
    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const activity = activities.find(a => 
        new Date(a.date).toISOString().split('T')[0] === dateStr
      );
      
      result.push({
        date: d,
        goalMet: activity?.goalMet || false,
        dayOfMonth: d.getDate(),
      });
    }
    return result;
  }, [activities]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/[.08] dark:bg-zinc-900 dark:border-white/[.145]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 italic tracking-tight">Active Heatmap</h3>
        <span className="text-[10px] uppercase font-bold text-zinc-400">Last 28 Days</span>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => (
          <div 
            key={idx}
            className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
              day.goalMet 
                ? "bg-green-500 text-white shadow-sm shadow-green-500/20 scale-105" 
                : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
            title={day.date.toDateString()}
          >
            {day.dayOfMonth}
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex items-center gap-4 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-green-500" />
          <span>Goal Met</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-zinc-100 dark:bg-zinc-800" />
          <span>Incomplete</span>
        </div>
      </div>
    </div>
  );
}
