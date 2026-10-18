"use client";

import { useEffect, useState } from "react";
import { getCareerFitScore, CareerFitResult } from "@/lib/careerFit";
import ProgressBar from "./ProgressBar";
import Link from "next/link";

export default function CareerFitCard({ careerId }: { careerId: string }) {
  const [fit, setFit] = useState<CareerFitResult | null>(null);

  useEffect(() => {
    getCareerFitScore(careerId).then(setFit);
  }, [careerId]);

  if (!fit) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/[.08] dark:bg-zinc-900 dark:border-white/[.145]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Career Fit Score
        </h3>
        <span className={`text-2xl font-extrabold ${
          fit.fitScore >= 70 ? "text-green-600 dark:text-green-400" :
          fit.fitScore >= 30 ? "text-yellow-600 dark:text-yellow-400" :
          "text-red-600 dark:text-red-400"
        }`}>
          {fit.fitScore}%
        </span>
      </div>

      <ProgressBar value={fit.fitScore} max={100} />

      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3">
        {fit.completedSkills.length} of {fit.totalSkills} skills completed (≥70% mastery)
      </p>

      {fit.missingSkills.length > 0 && (
        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Skills to Complete
          </h4>
          <div className="space-y-2">
            {fit.missingSkills.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <Link
                  href={`/skills/${s.id}`}
                  className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  {s.name}
                </Link>
                <span className={`font-semibold ${
                  s.mastery >= 40 ? "text-yellow-600 dark:text-yellow-400" :
                  "text-red-600 dark:text-red-400"
                }`}>
                  {s.mastery}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {fit.nextRecommendedSkill && (
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Recommended Next</p>
          <Link
            href={`/skills/${fit.nextRecommendedSkill.id}`}
            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Learn {fit.nextRecommendedSkill.name} →
          </Link>
        </div>
      )}
    </div>
  );
}
