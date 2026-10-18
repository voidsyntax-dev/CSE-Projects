"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface InternshipCardProps {
  internship: {
    id: string;
    company: string;
    title: string;
    description: string;
    location: string;
    stipend: string | null;
    eligibility: number;
    missingSkills: string[];
    requiredSkills: { id: string, name: string }[];
  };
}

export default function InternshipCard({ internship }: InternshipCardProps) {
  const isHighEligibility = internship.eligibility >= 70;
  const isMediumEligibility = internship.eligibility >= 40 && internship.eligibility < 70;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-black/[.08] dark:border-white/[.1] shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">
            {internship.company}
          </h4>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 italic">
            {internship.title}
          </h3>
        </div>
        <div className={`px-4 py-2 rounded-2xl font-bold text-sm ${
          isHighEligibility 
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
            : isMediumEligibility 
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
        }`}>
          {Math.round(internship.eligibility)}% Match
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          {internship.location}
        </span>
        {internship.stipend && (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {internship.stipend}
          </span>
        )}
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 line-clamp-2 leading-relaxed">
        {internship.description}
      </p>

      {/* Progress Bar */}
      <div className="mb-6 space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-zinc-400">
          <span>Match Readiness</span>
          <span>{Math.round(internship.eligibility)}%</span>
        </div>
        <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${internship.eligibility}%` }}
            transition={{ duration: 1 }}
            className={`h-full ${
              isHighEligibility ? "bg-green-500" : isMediumEligibility ? "bg-amber-500" : "bg-zinc-400"
            }`}
          />
        </div>
      </div>

      {/* Skill Gap Analysis */}
      <div className="space-y-4">
        <div>
          <h5 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Required Skills</h5>
          <div className="flex flex-wrap gap-2">
            {internship.requiredSkills.map(s => (
              <span key={s.id} className="px-2 py-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 text-[10px] rounded-lg">
                {s.name}
              </span>
            ))}
          </div>
        </div>

        {internship.missingSkills.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
            <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-2">Skill Gap Detected</h5>
            <p className="text-xs text-amber-800 dark:text-amber-300 mb-3">You need more practice in: {internship.missingSkills.join(", ")}</p>
            <Link 
              href="/careers" 
              className="text-[10px] font-bold text-amber-900 dark:text-amber-200 hover:underline flex items-center gap-1"
            >
              Master these now &rarr;
            </Link>
          </div>
        )}
      </div>

      <button className="w-full mt-6 py-3 rounded-2xl bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all">
        Apply Now
      </button>
    </motion.div>
  );
}
