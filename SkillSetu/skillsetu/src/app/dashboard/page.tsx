import StreakWidget from "@/components/StreakWidget";
import WeakSkillsList from "@/components/WeakSkillsList";
import StreakCalendar from "@/components/StreakCalendar";
import BadgeGallery from "@/components/BadgeGallery";
import ResetProgressButton from "@/components/ResetProgressButton";
import AIGapAnalysis from "@/components/AIGapAnalysis";
import Link from "next/link";
import { getUserBadges } from "@/lib/badges";
import { getMastery, getMasteryStore, getWeeklyProgress, getUserStreak, getWeakSkills, getStreakActivities } from "@/lib/mastery";
import { getEffectiveScore, getDecayRisk } from "@/lib/masteryClient";
import { getAllCareerFitScores } from "@/lib/careerFit";
import { RadarData } from "@/components/MasteryRadarChart";
import ProgressBar from "@/components/ProgressBar";
import DecayBadge from "@/components/DecayBadge";
import DailyTasksSection from "@/components/DailyTasksSection";
import PageTransition from "@/components/PageTransition";
import WeeklyProgressChart from "@/components/WeeklyProgressChart";
import MasteryRadarChart from "@/components/MasteryRadarChart";
import { DecayRisk } from "@/types";

function getHeatmapColor(score: number) {
  if (score <= 20) return "bg-red-200";
  if (score <= 40) return "bg-orange-200";
  if (score <= 60) return "bg-yellow-200";
  if (score <= 80) return "bg-green-200";
  return "bg-green-500";
}

interface DecayAlert {
  key: string;
  skillName: string;
  subskillName: string;
  effectiveScore: number;
  decayAmount: number;
  risk: DecayRisk;
  skillId: string;
  subskillId: string;
}

export default async function DashboardPage() {
  const mastery = await getMastery();
  const store = await getMasteryStore();
  const careerFits = await getAllCareerFitScores();
  const weeklyData = await getWeeklyProgress();
  const streak = await getUserStreak();
  const weakSkills = await getWeakSkills();
  const streakActivities = await getStreakActivities();
  const badges = await getUserBadges();

  // 1. Build decay alerts from enriched store
  const decayAlerts: DecayAlert[] = [];
  for (const [key, data] of Object.entries(store)) {
    const effective = getEffectiveScore(data);
    const risk = getDecayRisk(effective);
    const amount = data.score - effective;
    if (risk === "high" || risk === "medium") {
      const [skillId, subskillId] = key.split(":");
      decayAlerts.push({
        key,
        skillName: skillId.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        subskillName: subskillId.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        effectiveScore: effective,
        decayAmount: amount,
        risk,
        skillId,
        subskillId,
      });
    }
  }
  decayAlerts.sort((a, b) => a.effectiveScore - b.effectiveScore);

  const entries = Object.entries(mastery);

  // 2. Compute Metrics
  const skillsPracticed = new Set(Object.keys(mastery).map((k) => k.split(":")[0])).size;
  const avgMastery = entries.length > 0
    ? Math.round(entries.reduce((a, [_, val]) => a + val, 0) / entries.length)
    : 0;

  // 3. Aggregate Skill Maps
  const skillMap: Record<string, number[]> = {};
  for (const key in mastery) {
    const [skill] = key.split(":");
    if (!skillMap[skill]) skillMap[skill] = [];
    skillMap[skill].push(mastery[key]);
  }

  let topSkill = "None";
  let maxAvg = -1;
  const skillAverages: Record<string, number> = {};
  const radarData: RadarData[] = [];

  for (const skill in skillMap) {
    const scores = skillMap[skill];
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    skillAverages[skill] = avg;
    
    // Add to radar map
    radarData.push({
      skill: skill.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      mastery: avg,
      fullMark: 100
    });

    if (avg > maxAvg) {
      maxAvg = avg;
      topSkill = skill.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }
  }

  const bestFit = careerFits.length > 0
    ? careerFits.reduce((a, b) => (a.fitScore >= b.fitScore ? a : b))
    : null;

  return (
    <PageTransition>
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Learning Dashboard</h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2">Your personalized command center.</p>
          </div>
          <ResetProgressButton />
        </header>

        {/* ─── Top Level Command Center (Phase 3) ─── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
             <StreakWidget currentStreak={streak.currentStreak} longestStreak={streak.longestStreak} />
          </div>
          <div className="lg:col-span-5 h-[320px]">
             <WeeklyProgressChart data={weeklyData} />
          </div>
          <div className="lg:col-span-4 h-[320px]">
             <MasteryRadarChart data={radarData} />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl border bg-gray-50 border-black/[.08] text-center dark:bg-zinc-800/50 dark:border-white/[.145]">
            <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-2">Skills Practiced</h3>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{skillsPracticed}</p>
          </div>
          <div className="p-6 rounded-xl border bg-gray-50 border-black/[.08] text-center dark:bg-zinc-800/50 dark:border-white/[.145]">
            <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-2">Average Mastery</h3>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{avgMastery}%</p>
          </div>
          <div className="p-6 rounded-xl border bg-gray-50 border-black/[.08] text-center dark:bg-zinc-800/50 dark:border-white/[.145]">
            <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-2">Top Skill</h3>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{topSkill}</p>
          </div>
          <div className="p-6 rounded-xl border bg-gray-50 border-black/[.08] text-center dark:bg-zinc-800/50 dark:border-white/[.145]">
            <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-2">Best Career Fit</h3>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {bestFit ? `${bestFit.fitScore}%` : "—"}
            </p>
            {bestFit && (
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">{bestFit.careerName}</p>
            )}
          </div>
        </section>

        {/* ─── AI Strategic Layer (Phase 7.2) ─── */}
        {bestFit && (
          <section>
            <AIGapAnalysis 
               targetCareer={bestFit.careerName} 
               masteryData={radarData.map(r => ({ skillName: r.skill, score: r.mastery }))} 
            />
          </section>
        )}

        {/* ─── Gamification Row (Phase 5) ─── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div>
              <StreakCalendar activities={streakActivities as any} />
           </div>
           <div>
              <BadgeGallery badges={badges as any} />
           </div>
        </section>

        {/* ─── Focus & Task Action Row ─── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
           <div>
              <DailyTasksSection />
           </div>
           <div>
              <WeakSkillsList skills={weakSkills} />
           </div>
        </section>

        {/* ─── Decay Alerts ─── */}
        {decayAlerts.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">⚠️ Decay Alerts</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              These subskills are losing mastery due to inactivity.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {decayAlerts.map((alert) => (
                <div
                  key={alert.key}
                  className={`p-4 rounded-xl border shadow-sm ${
                    alert.risk === "high"
                      ? "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20"
                      : "border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-950/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <DecayBadge risk={alert.risk} />
                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                      {alert.effectiveScore}%
                    </span>
                  </div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                    {alert.skillName}
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    {alert.subskillName} · -{alert.decayAmount}% decayed
                  </p>
                  <Link
                    href={`/practice/${alert.skillId}/${alert.subskillId}`}
                    className="mt-3 inline-block text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                  >
                    Revise Now
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Career Readiness  ─── */}
        {careerFits.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">🎓 Career Readiness</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {careerFits.map((cf) => (
                <Link
                  key={cf.careerId}
                  href={`/career/${cf.careerId}`}
                  className="p-5 rounded-xl border bg-white shadow-sm border-black/[.08] dark:bg-zinc-900 dark:border-white/[.145] hover:shadow-md transition-shadow"
                >
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2">{cf.careerName}</h3>
                  <div className="flex justify-between items-center text-sm font-semibold mb-2">
                    <span className="text-zinc-500 dark:text-zinc-400">Fit Score</span>
                    <span className={`${
                      cf.fitScore >= 70 ? "text-green-600 dark:text-green-400" :
                      cf.fitScore >= 30 ? "text-yellow-600 dark:text-yellow-400" :
                      "text-red-600 dark:text-red-400"
                    }`}>
                      {cf.fitScore}%
                    </span>
                  </div>
                  <ProgressBar value={cf.fitScore} max={100} />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ─── Skill Mastery Cards ─── */}
        <section>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">📊 Skill Mastery Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(skillAverages).map(([skill, avg]) => (
              <div key={skill} className="p-6 rounded-xl border bg-white shadow-sm border-black/[.08] space-y-4 dark:bg-zinc-900 dark:border-white/[.145]">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 capitalize">
                    {skill.replace(/_/g, " ")}
                  </h3>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{avg}%</span>
                </div>
                <ProgressBar value={avg} max={100} />
                <div className="pt-2">
                  <a
                    href={`/skills/${skill}`}
                    className="inline-block px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    Practice
                  </a>
                </div>
              </div>
            ))}
            {entries.length === 0 && (
              <div className="col-span-full p-8 text-center text-zinc-500 dark:text-zinc-400 border border-dashed rounded-xl border-black/[.08] dark:border-white/[.145]">
                <p className="mb-4">Start practicing skills to map your radar and populate your metrics!</p>
                <Link href="/careers" className="inline-block px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600">
                  Explore Careers
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ─── Mastery Heatmap ─── */}
        {entries.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Node Heatmap</h2>
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
              {entries.map(([key, score]) => {
                const [skill, subskill] = key.split(":");
                const formattedSkill = skill.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
                const formattedSubskill = subskill.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
                return (
                  <div
                    key={key}
                    className={`w-8 h-8 rounded ${getHeatmapColor(score)} hover:scale-110 transition-transform cursor-pointer`}
                    title={`${formattedSkill} — ${formattedSubskill} (${score}%)`}
                  ></div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
    </PageTransition>
  );
}
