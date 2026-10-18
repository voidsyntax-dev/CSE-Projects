import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import { getCareers } from "@/lib/data";
import CareerCard from "@/components/CareerCard";

export default async function HomePage() {
  const allCareers = await getCareers();
  const trending = allCareers.slice(0, 3); // Just take first 3 as "trending" for now

  return (
    <PageTransition>
      <div className="flex flex-col">
      {/* Landing Page Hero */}
      <section className="max-w-4xl mx-auto text-center py-24 px-6 space-y-6">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Master Skills for Real Engineering Careers
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto dark:text-zinc-400">
          SkillSetu maps careers to the exact skills you need to learn — then helps you master them through structured practice.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            href="/careers" 
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600 w-full sm:w-auto"
          >
            Explore Careers
          </Link>
        </div>
      </section>

      {/* Product Explanation Section */}
      <section className="bg-white border-y border-black/[.08] dark:bg-zinc-900/50 dark:border-white/[.145]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto py-20 px-6">
          <div className="p-6 rounded-xl border bg-white shadow-sm text-center border-black/[.08] dark:bg-zinc-800/50 dark:border-white/[.145] space-y-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Choose a Career</h3>
            <p className="text-gray-600 dark:text-zinc-400">
              Explore engineering careers and see the skills required to succeed.
            </p>
          </div>
          <div className="p-6 rounded-xl border bg-white shadow-sm text-center border-black/[.08] dark:bg-zinc-800/50 dark:border-white/[.145] space-y-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Discover the Skills</h3>
            <p className="text-gray-600 dark:text-zinc-400">
              Each career is mapped to structured skills and subskills.
            </p>
          </div>
          <div className="p-6 rounded-xl border bg-white shadow-sm text-center border-black/[.08] dark:bg-zinc-800/50 dark:border-white/[.145] space-y-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Practice to Mastery</h3>
            <p className="text-gray-600 dark:text-zinc-400">
              Solve targeted practice questions and track mastery progress.
            </p>
          </div>
        </div>
      </section>

      {/* Trending Careers Section */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Trending Careers</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2">Explore the most in-demand paths right now.</p>
          </div>
          <Link href="/careers" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trending.map(career => (
            <CareerCard key={career.id} career={career} />
          ))}
        </div>
      </section>

    </div>
    </PageTransition>
  );
}
