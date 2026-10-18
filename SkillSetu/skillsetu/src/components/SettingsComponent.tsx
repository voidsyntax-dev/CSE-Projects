"use client";

import { useState } from "react";
import { updateUserPreferences } from "@/lib/user";
import { Career } from "@/types";
import { useRouter } from "next/navigation";

interface SettingsComponentProps {
  careers: Career[];
  initialPrefs: {
    targetCareerId: string | null;
    weeklyGoal: number;
  } | null;
}

export default function SettingsComponent({ careers, initialPrefs }: SettingsComponentProps) {
  const [targetCareerId, setTargetCareerId] = useState(initialPrefs?.targetCareerId || "");
  const [weeklyGoal, setWeeklyGoal] = useState(initialPrefs?.weeklyGoal || 3);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await updateUserPreferences({
        targetCareerId: targetCareerId || undefined,
        weeklyGoal: Number(weeklyGoal)
      });
      setMessage("Preferences updated successfully!");
      router.refresh();
    } catch (error) {
      setMessage("Failed to update preferences.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-black/[.08] dark:border-white/[.1] shadow-xl">
        <h2 className="text-2xl font-bold mb-6 dark:text-zinc-100">Learning Preferences</h2>
        
        <div className="space-y-6">
          {/* Target Career */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Target Career Path
            </label>
            <p className="text-xs text-zinc-500 mb-2">Setting a target career will prioritize relevant skills on your dashboard.</p>
            <select
              value={targetCareerId}
              onChange={(e) => setTargetCareerId(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="">Select a career...</option>
              {careers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Weekly Goal */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Weekly Learning Goal
              </label>
              <span className="text-blue-600 dark:text-blue-400 font-bold">{weeklyGoal} days/week</span>
            </div>
            <input
              type="range"
              min="1"
              max="7"
              value={weeklyGoal}
              onChange={(e) => setWeeklyGoal(parseInt(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-zinc-400">
              <span>1 day</span>
              <span>7 days</span>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full py-4 rounded-2xl font-bold transition-all ${
              saving 
                ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-[0.98]"
            }`}
          >
            {saving ? "Saving..." : "Save Preferences"}
          </button>

          {message && (
            <p className={`text-center text-sm font-medium ${
              message.includes("success") ? "text-green-500" : "text-red-500"
            }`}>
              {message}
            </p>
          )}
        </div>
      </div>

      <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
        <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Why set a goal?
        </h3>
        <p className="text-xs text-blue-700/80 dark:text-blue-400/80 leading-relaxed">
            Consistent learning is the fastest way to mastery. Users who set a weekly goal are 3x more likely to reach their target career within 6 months.
        </p>
      </div>
    </div>
  );
}
