import { getInternshipsForUser } from "@/lib/internships";
import InternshipCard from "@/components/InternshipCard";
import PageTransition from "@/components/PageTransition";
import Link from "next/link";

export default async function InternshipsPage() {
  const internships = await getInternshipsForUser();

  return (
    <PageTransition>
      <main className="min-h-screen bg-zinc-50 dark:bg-black">
        <div className="mx-auto max-w-6xl px-6 py-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
                Internship Matching
              </h1>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
                Match your skill mastery to real-world opportunities. We calculate your readiness based on your performance trends.
              </p>
            </div>
            <Link href="/dashboard" className="px-6 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-bold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm">
               Dashboard
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {internships.map((intern: any) => (
              <InternshipCard key={intern.id} internship={intern} />
            ))}
          </div>

          {/* Opportunity Banner */}
          <div className="mt-20 p-10 rounded-[2.5rem] bg-blue-600 text-white overflow-hidden relative shadow-2xl shadow-blue-500/20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[120px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-[100px] -ml-32 -mb-32" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-xl text-center md:text-left">
                <h3 className="text-3xl font-extrabold mb-4">Unlock Premium Roles</h3>
                <p className="text-blue-100 text-lg leading-relaxed font-medium">
                  Boost your mastery scores in core engineering skills to unlock exclusive internship opportunities with top-tier partners. Reach 80% mastery in at least 3 skills to get fast-tracked.
                </p>
              </div>
              <Link 
                href="/careers" 
                className="px-10 py-5 bg-white text-blue-600 rounded-[1.5rem] font-black text-sm hover:bg-blue-50 transition-all hover:scale-[1.05] active:scale-[0.95] shadow-xl whitespace-nowrap uppercase tracking-widest"
              >
                Boost My Scores
              </Link>
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
