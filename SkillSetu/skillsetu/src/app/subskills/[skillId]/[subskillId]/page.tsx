import Link from "next/link";
import { getSubskill, getResourcesForSubskill, getQuestionsForSubskill } from "@/lib/data";
import { getMasteryStore } from "@/lib/mastery";
import { getEffectiveScore, getDecayRisk, getDaysSinceLastPractice } from "@/lib/masteryClient";
import { getUserResourceProgressMap } from "@/lib/resources";
import ProgressBar from "@/components/ProgressBar";
import DecayBadge from "@/components/DecayBadge";
import ResourceList from "@/components/ResourceList";
import PageTransition from "@/components/PageTransition";
import Breadcrumbs from "@/components/Breadcrumbs";
import SubskillAIWidget from "@/components/SubskillAIWidget";
import { Resource } from "@prisma/client";

export default async function SubskillPage({ params }: { params: Promise<{ skillId: string, subskillId: string }> }) {
  const { skillId, subskillId } = await params;
  
  const subskill = await getSubskill(skillId, subskillId);
  const skill = await getSubskill(skillId, ""); // Simplified mock for skill name if needed

  if (!subskill) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Subskill not found</h1>
      </div>
    );
  }

  const resources = await getResourcesForSubskill(skillId, subskillId);
  const userProgressMap = await getUserResourceProgressMap(subskillId);
  const questions = await getQuestionsForSubskill(skillId, subskillId);
  const questionCount = questions.length;

  const store = await getMasteryStore();
  const key = `${skillId}:${subskillId}`;
  const data = store[key];
  
  let mastery = 0;
  let risk: "stable" | "medium" | "high" | null = null;
  let daysSince: number | null = null;
  let decayAmount = 0;
  let accuracy: string | null = null;

  if (data) {
    mastery = getEffectiveScore(data as any);
    risk = getDecayRisk(mastery);
    daysSince = Math.round(getDaysSinceLastPractice(data as any));
    decayAmount = data.score - mastery;
    if (data.attemptCount > 0) {
      accuracy = `${Math.round((data.correctCount / data.attemptCount) * 100)}%`;
    }
  }

  return (
    <PageTransition>
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        
        <Breadcrumbs 
          items={[
            { label: "Careers", href: "/careers" },
            { label: skillId.replace(/_/g, " ").replace(/\b\w/g, k => k.toUpperCase()), href: `/skills/${skillId}` },
            { label: subskill.name }
          ]} 
        />

        {/* Subskill Header */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-black/[.08] dark:bg-zinc-900 dark:border-white/[.145]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {subskill.name}
              </h1>
              {risk && <DecayBadge risk={risk} />}
            </div>
            <div className="w-full md:w-64 shrink-0">
              <div className="flex justify-between items-center text-sm font-semibold mb-1">
                <span className="text-zinc-700 dark:text-zinc-300">Mastery Progress</span>
                <span className="text-blue-600 dark:text-blue-400">{mastery}%</span>
              </div>
              <ProgressBar value={mastery} max={100} />
            </div>
          </div>

          {/* Decay & Stats Info */}
          {(daysSince !== null || accuracy !== null) && (
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              {daysSince !== null && (
                <div className="text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Last practiced: </span>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {daysSince === 0 ? "Today" : daysSince === 1 ? "Yesterday" : `${daysSince} days ago`}
                  </span>
                </div>
              )}
              {accuracy !== null && (
                <div className="text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Accuracy: </span>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">{accuracy}</span>
                </div>
              )}
              {decayAmount > 0 && (
                <div className="text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Decayed: </span>
                  <span className="font-medium text-red-600 dark:text-red-400">-{decayAmount}%</span>
                </div>
              )}
            </div>
          )}
        </section>

        {/* AI Mastery Widget */}
        <SubskillAIWidget subskillName={subskill.name} skillName={skillId} />

        {/* Learning Resources Section */}
        {resources && resources.length > 0 && (
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-black/[.08] dark:bg-zinc-900 dark:border-white/[.145]">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              Learning Resources
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Hand-picked materials to help you master this concept.
            </p>
            <ResourceList 
              resources={resources as any} 
              userProgressMap={userProgressMap} 
            />
          </section>
        )}

        {/* Practice Section */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-black/[.08] dark:bg-zinc-900 dark:border-white/[.145]">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Practice
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-zinc-900 font-medium dark:text-zinc-100">
                Practice Questions Available
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {questionCount} questions
              </p>
            </div>
            
            <Link 
              href={`/practice/${skillId}/${subskillId}`}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              {risk === "high" ? "Revise Now" : risk === "medium" ? "Reinforce" : "Start Practice"}
            </Link>
          </div>
        </section>

      </div>
    </main>
    </PageTransition>
  );
}
