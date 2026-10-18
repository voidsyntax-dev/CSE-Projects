"use client";

import { useState } from "react";
import { analyzeSkillGap } from "@/lib/ai";
import { motion, AnimatePresence } from "framer-motion";

interface AIGapAnalysisProps {
  targetCareer: string;
  masteryData: { skillName: string; score: number }[];
}

export default function AIGapAnalysis({ targetCareer, masteryData }: AIGapAnalysisProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysis(null);
    try {
      const response = await analyzeSkillGap(targetCareer, masteryData);
      setAnalysis(response);
    } catch (error) {
      setAnalysis("AI Mentor is currently busy analyzing the market trends. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-black/[.08] dark:border-white/[.1] shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
            <h3 className="text-xl font-bold dark:text-zinc-100 italic flex items-center gap-2">
                <span className="text-blue-600">🤖</span> AI Skill Gap Analyzer
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-widest font-bold">
                Target: {targetCareer}
            </p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`px-6 py-3 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 ${
            loading 
              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" 
              : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-[1.05] active:scale-[0.95]"
          }`}
        >
          {loading ? "Analyzing..." : "Generate AI Insight ✨"}
        </button>
      </div>

      <AnimatePresence>
        {analysis ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="prose prose-sm dark:prose-invert max-w-none prose-h3:text-blue-600 dark:prose-h3:text-blue-400 prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-p:leading-relaxed bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-800/30"
            dangerouslySetInnerHTML={{ __html: analysis }}
          />
        ) : !loading && (
          <div className="py-10 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl">
             <p className="text-xs text-zinc-400 font-medium italic">Click "Generate AI Insight" to discover your strategic path to hire-readiness.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
