"use client";

import { resetMastery } from "@/lib/mastery";

export default function ResetProgressButton() {
  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset all progress?")) {
      await resetMastery();
      window.location.reload();
    }
  };

  return (
    <button
      onClick={handleReset}
      className="px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm font-medium transition dark:border-white/[.145]"
    >
      Reset Progress
    </button>
  );
}
