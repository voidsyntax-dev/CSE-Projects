"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDailyTasks, TaskRecommendation } from "@/lib/dailyTasks";
import DecayBadge from "./DecayBadge";

export default function DailyTasksSection() {
  const [tasks, setTasks] = useState<TaskRecommendation[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getDailyTasks(5).then(res => {
      setTasks(res);
      setIsLoaded(true);
    });
  }, []);

  if (!isLoaded) return null;

  if (tasks.length === 0) {
    return (
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-black/[.08] dark:bg-zinc-900 dark:border-white/[.145]">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          🎯 Daily Focus
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          All caught up! No urgent tasks right now.
        </p>
      </section>
    );
  }

  const typeConfig = {
    revision: { label: "REVISION", color: "border-l-red-500", icon: "🔴" },
    reinforcement: { label: "REINFORCE", color: "border-l-yellow-500", icon: "🟡" },
    new: { label: "NEW", color: "border-l-green-500", icon: "🟢" },
  };

  return (
    <section>
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
        🎯 Daily Focus
      </h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
        Today&apos;s recommended practice based on your mastery decay and progress.
      </p>

      <div className="space-y-3">
        {tasks.map((task) => {
          const cfg = typeConfig[task.type];
          return (
            <div
              key={`${task.skillId}:${task.subskillId}`}
              className={`flex items-center justify-between p-4 rounded-xl border border-black/[.08] bg-white shadow-sm border-l-4 ${cfg.color} dark:bg-zinc-900 dark:border-white/[.145] hover:shadow-md transition-shadow`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                    {cfg.icon} {cfg.label}
                  </span>
                  <DecayBadge risk={task.decayRisk} compact />
                </div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {task.skillName} → {task.subskillName}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {task.reason} · {task.questionCount} questions
                </p>
              </div>

              <Link
                href={`/practice/${task.skillId}/${task.subskillId}`}
                className="ml-4 shrink-0 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {task.type === "new" ? "Start" : "Practice"}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
