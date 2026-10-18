"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";

interface ProofCardProps {
  proof: {
    id: string;
    title: string;
    description: string | null;
    type: string;
    earnedAt: Date | string;
    metadata: string | null;
    skill?: { name: string } | null;
  };
}

export default function ProofCard({ proof }: ProofCardProps) {
  const metadata = JSON.parse(proof.metadata || "{}");
  const isMastery = proof.type === "MASTERY";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative h-full p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-black/[.08] dark:border-white/[.1] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Decorative Gradient Background */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none bg-gradient-to-br ${
        isMastery ? "from-blue-500 to-purple-600" : "from-emerald-500 to-teal-600"
      }`} />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isMastery 
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
          }`}>
            {proof.type}
          </div>
          <span className="text-[10px] text-zinc-400 font-medium">
            {format(new Date(proof.earnedAt), "MMM d, yyyy")}
          </span>
        </div>

        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {proof.title}
        </h3>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 mb-4 flex-grow">
          {proof.description}
        </p>

        {isMastery && metadata.score && (
          <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">Mastery Level</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{metadata.score.toFixed(1)}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${metadata.score}%` }}
                 transition={{ duration: 1, delay: 0.2 }}
                 className="h-full bg-blue-600 dark:bg-blue-500"
               />
            </div>
          </div>
        )}

        {proof.type === "PROJECT" && (
           <div className="mt-auto pt-4 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
             Code Base Verified
           </div>
        )}
      </div>
    </motion.div>
  );
}
