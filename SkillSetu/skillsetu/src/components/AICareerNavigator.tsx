"use client";

import { useState } from "react";
import { analyzeCareerNav } from "@/lib/ai";
import { Career } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface AICareerNavigatorProps {
  careers: Career[];
}

export default function AICareerNavigator({ careers }: AICareerNavigatorProps) {
  const [interest, setInterest] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!interest.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await analyzeCareerNav(interest, careers);
      setResult(response);
    } catch (error) {
      setResult("The AI mentor encountered a problem. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Input Section */}
      <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-black/[.08] dark:border-white/[.1] shadow-xl">
        <h2 className="text-2xl font-bold mb-4 dark:text-zinc-100 flex items-center gap-2">
            <span className="text-blue-600">🧭</span> Find Your Career Path
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-sm">
            Tell the AI mentor what you love, what you're good at, or what projects you've enjoyed. We'll map your interests to the perfect engineering career.
        </p>
        <div className="space-y-4">
          <textarea
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            placeholder="e.g., 'I love designing mechanical parts and working with 3D models, but I also enjoy some coding for automation.'"
            className="w-full min-h-[120px] p-6 bg-zinc-50 dark:bg-zinc-800/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-sm leading-relaxed"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !interest.trim()}
            className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
              loading 
                ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                AI is Analyzing...
              </>
            ) : "Start Discovery"}
          </button>
        </div>
      </div>

      {/* Result Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-[3rem] border border-blue-100 dark:border-blue-800/30 shadow-sm relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-8 text-4xl opacity-20 pointer-events-none">✨</div>
             
             <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-h3:text-blue-700 dark:prose-h3:text-blue-400 prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: result }}
             />
             
             <div className="mt-8 pt-8 border-t border-blue-100 dark:border-blue-800/20 flex flex-wrap gap-4">
                <p className="w-full text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-widest mb-2 text-center md:text-left">Recommended Next Steps</p>
                <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-blue-100 dark:border-blue-800/30 flex-1 min-w-[200px] text-center">
                    <p className="text-[10px] text-zinc-400 mb-1">Step 1</p>
                    <p className="text-xs font-bold dark:text-zinc-100 italic">Select Suggested Career</p>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-blue-100 dark:border-blue-800/30 flex-1 min-w-[200px] text-center">
                    <p className="text-[10px] text-zinc-400 mb-1">Step 2</p>
                    <p className="text-xs font-bold dark:text-zinc-100 italic">Complete Mastery Assessment</p>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-blue-100 dark:border-blue-800/30 flex-1 min-w-[200px] text-center">
                    <p className="text-[10px] text-zinc-400 mb-1">Step 3</p>
                    <p className="text-xs font-bold dark:text-zinc-100 italic">Apply for Internships</p>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!result && !loading && (
        <div className="text-center py-20 opacity-40">
           <div className="text-5xl mb-6">🤖</div>
           <p className="text-sm italic">The AI Mentor is waiting for your inputs...</p>
        </div>
      )}
    </div>
  );
}
