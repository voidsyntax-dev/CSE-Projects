import { getCareerById, getSkillsForCareer } from "@/lib/data";
import SkillCard from "@/components/SkillCard";
import SkillGraph from "@/components/SkillGraph";
import CareerFitCard from "@/components/CareerFitCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const career = await getCareerById(id);
  return {
    title: career ? `${career.name} Mastery Path` : "Career Not Found",
    description: career?.description || "Explore engineering career paths."
  };
}

export default async function CareerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const career = await getCareerById(id);

  if (!career) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Career not found</h1>
      </div>
    );
  }

  const skills = await getSkillsForCareer(id);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        
        <Breadcrumbs 
          items={[
            { label: "Careers", href: "/careers" },
            { label: career.name }
          ]} 
        />
        
        {/* Career Metadata Header */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 shadow-sm border border-black/[.08] dark:border-white/[.145]">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">
                {career.name}
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6 font-medium">
                {career.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Difficulty</span>
                  <span>{career.difficulty}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Avg Salary</span>
                  <span>{career.avgSalary}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Timeline</span>
                  <span>{career.learningTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Career Fit Score (PRD §16) */}
        <CareerFitCard careerId={career.id} />

        {/* Learning Roadmap Skills Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-2">
            Skill Roadmap
          </h2>
          
          <div className="mb-10 w-full rounded-2xl bg-white p-6 shadow-sm border border-black/[.08] dark:bg-zinc-900 dark:border-white/[.145]">
             <SkillGraph careerId={career.id} />
          </div>

          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-2">
            Skill Details
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
