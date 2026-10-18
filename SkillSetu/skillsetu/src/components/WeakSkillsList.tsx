import Link from "next/link";
import ProgressBar from "./ProgressBar";

export interface WeakSkill {
  skillId: string;
  subskillId: string;
  skillName: string;
  subskillName: string;
  score: number;
}

interface WeakSkillsListProps {
  skills: WeakSkill[];
}

export default function WeakSkillsList({ skills }: WeakSkillsListProps) {
  if (skills.length === 0) return null;

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-black/[.08] dark:bg-zinc-900 dark:border-white/[.145]">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <span>⚠️</span> Focus Areas
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Subskills with less than 40% mastery after multiple attempts.
        </p>
      </div>

      <div className="space-y-3">
        {skills.map((ws) => (
          <div key={`${ws.skillId}:${ws.subskillId}`} className="p-4 rounded-xl border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20">
            <div className="flex justify-between items-start mb-2">
              <div>
                <Link href={`/skills/${ws.skillId}`} className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline uppercase tracking-wider">
                  {ws.skillName}
                </Link>
                <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mt-0.5">
                  {ws.subskillName}
                  <span className="text-red-700 dark:text-red-300 font-bold text-sm bg-red-100 dark:bg-red-900/60 px-2 py-0.5 rounded">
                    {ws.score}%
                  </span>
                </div>
              </div>
              <Link 
                href={`/subskills/${ws.skillId}/${ws.subskillId}`}
                className="shrink-0 text-sm bg-white dark:bg-zinc-800 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-3 py-1.5 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/60 transition"
              >
                Review
              </Link>
            </div>
            <div className="mt-2 h-1.5 w-full bg-red-200 dark:bg-red-950 rounded-full overflow-hidden">
               <div className="h-full bg-red-500" style={{ width: `${ws.score}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
