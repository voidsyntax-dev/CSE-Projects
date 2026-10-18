import { getUserProofs } from "@/lib/proofs";
import ProofCard from "@/components/ProofCard";
import PageTransition from "@/components/PageTransition";
import Link from "next/link";

export default async function ProofsPage() {
  const proofs = await getUserProofs();

  return (
    <PageTransition>
      <main className="min-h-screen bg-zinc-50 dark:bg-black">
        <div className="mx-auto max-w-6xl px-6 py-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
                Proof Vault
              </h1>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
                Your verifiable skill portfolio. Every certificate and project here is backed by real performance data.
              </p>
            </div>
            <div className="flex gap-4">
               <button className="px-6 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-bold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm">
                  Export JSON
               </button>
               <Link href="/dashboard" className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                  Back to Dashboard
               </Link>
            </div>
          </div>

          {proofs.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {proofs.map((proof: any) => (
                <ProofCard key={proof.id} proof={proof} />
              ))}
            </div>
          ) : (
            <div className="py-32 text-center bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/50 shadow-sm px-8">
              <div className="max-w-md mx-auto space-y-6">
                <div className="text-6xl mx-auto">🏗️</div>
                <h2 className="text-2xl font-bold dark:text-zinc-100">Your vault is empty</h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                  Master your first skill or complete a practice session with &gt;80% accuracy to earn your first verifiable proof.
                </p>
                <Link 
                  href="/careers" 
                  className="inline-block px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                  Start Learning
                </Link>
              </div>
            </div>
          )}

          {/* Verification Banner */}
          <div className="mt-20 p-8 rounded-[2rem] bg-gradient-to-r from-zinc-900 to-zinc-800 text-white border border-white/5 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -mr-32 -mt-32" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl text-center md:text-left">
                <h3 className="text-2xl font-bold mb-3">Enterprise-Ready Verification</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Every entry in the SkillSetu Proof Vault is cryptographically hashed and linked to your unique learning journey. Share this link with recruiters to prove your expertise with real data.
                </p>
              </div>
              <button className="px-8 py-4 bg-white text-zinc-900 rounded-2xl font-bold text-sm hover:bg-zinc-100 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap">
                Copy Shareable Link
              </button>
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
