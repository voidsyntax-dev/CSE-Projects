import { getQuestionsForSubskill } from "@/lib/data";
import { getMasteryStore } from "@/lib/mastery";
import PageTransition from "@/components/PageTransition";
import PracticeEngine from "@/components/PracticeEngine";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getEffectiveScore } from "@/lib/masteryClient";

export default async function PracticePage({ params }: { params: Promise<{ skillId: string, subskillId: string }> }) {
  const { skillId, subskillId } = await params;
  
  // Load local specific question block based on ID
  const questions = await getQuestionsForSubskill(skillId, subskillId);
  
  // Load initial mastery
  const store = await getMasteryStore();
  const id = `${skillId}:${subskillId}`;
  const masteryData = store[id];
  const initialMastery = masteryData ? getEffectiveScore(masteryData as any) : 0;

  return (
    <PageTransition>
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        
        <Breadcrumbs 
          items={[
            { label: "Careers", href: "/careers" },
            { label: skillId.replace(/_/g, " ").replace(/\b\w/g, k => k.toUpperCase()), href: `/skills/${skillId}` },
            { label: subskillId.replace(/_/g, " ").replace(/\b\w/g, k => k.toUpperCase()), href: `/subskills/${skillId}/${subskillId}` },
            { label: "Practice" }
          ]} 
        />

        <PracticeEngine 
          skillId={skillId} 
          subskillId={subskillId} 
          questions={questions} 
          initialMastery={initialMastery} 
        />
      </div>
    </main>
    </PageTransition>
  );
}
