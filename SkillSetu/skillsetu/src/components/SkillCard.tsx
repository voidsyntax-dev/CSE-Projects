"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Skill } from "../types";
import { getSkillMastery } from "../lib/mastery";

interface SkillCardProps {
  skill: Skill;
}

export default function SkillCard({ skill }: SkillCardProps) {
  const [mastery, setMastery] = useState(0);

  // Fetch mastery on mount to avoid server SSR hydration mismatch
  useEffect(() => {
    getSkillMastery(skill.id).then(setMastery);
  }, [skill.id]);

  const subskillCount = skill.subskills.length;

  return (
    <Link 
      href={`/skills/${skill.id}`}
      className="block rounded-xl bg-white p-6 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer dark:bg-zinc-900 dark:border dark:border-zinc-800"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-2 gap-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {skill.name}
          </h2>
          <span className="inline-flex shrink-0 items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {subskillCount} Subskills
          </span>
        </div>
        
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 flex-grow line-clamp-3">
          {skill.description}
        </p>
        
        <div className="flex flex-col space-y-2 mt-auto">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-zinc-700 dark:text-zinc-300">Mastery progress</span>
            <span className="text-blue-600 dark:text-blue-400">{mastery}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${mastery}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
