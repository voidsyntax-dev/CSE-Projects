"use client";

import { useEffect, useState } from "react";
import { getMastery, resetMastery } from "@/lib/mastery";
import PageTransition from "@/components/PageTransition";

export default function DevPage() {
  const [mastery, setMastery] = useState({});

  useEffect(() => {
    setMastery(getMastery());
  }, []);

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all progress?")) {
      resetMastery();
      window.location.reload();
    }
  };

  return (
    <PageTransition>
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        <header className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Mastery Debug Panel</h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-2">Test progression parsing with JSON.</p>
            </div>
            <button 
              onClick={handleReset}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Reset Progress
            </button>
        </header>

        <section className="bg-white p-6 rounded-xl border border-black/[.08] shadow-sm overflow-x-auto dark:bg-zinc-900 dark:border-white/[.145]">
          <pre className="text-sm text-zinc-800 dark:text-zinc-200 font-mono">
            {JSON.stringify(mastery, null, 2)}
          </pre>
        </section>
      </div>
    </main>
    </PageTransition>
  );
}
