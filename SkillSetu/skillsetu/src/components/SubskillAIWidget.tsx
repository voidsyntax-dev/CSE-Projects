"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { solveSubskillDoubt, expandSubskillResources, generateSubskillChallenge } from "@/lib/ai";

interface SubskillAIWidgetProps {
  subskillName: string;
  skillName: string;
}

export default function SubskillAIWidget({ subskillName, skillName }: SubskillAIWidgetProps) {
  const [activeTab, setActiveTab] = useState<"none" | "doubt" | "resources" | "challenge">("none");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);

  const handleAction = async (type: "doubt" | "resources" | "challenge") => {
    setLoading(true);
    setActiveTab(type);
    setResponse(null);
    setUserAnswer(null);

    try {
      let result;
      if (type === "doubt") result = await solveSubskillDoubt(subskillName);
      else if (type === "resources") result = await expandSubskillResources(subskillName);
      else if (type === "challenge") result = await generateSubskillChallenge(subskillName);
      
      setResponse(result);
    } catch (error) {
      setResponse("Mentorship connection interrupted. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-950 p-1 rounded-3xl border border-blue-100 dark:border-white/5 shadow-xl overflow-hidden">
      <div className="bg-white dark:bg-zinc-900 rounded-[1.4rem] p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">AI Mentor Integrated</span>
            </div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 italic">
              Hyper-Focus Mastery
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => handleAction("doubt")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "doubt" ? "bg-blue-600 text-white shadow-lg" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"}`}
            >
              Clear Doubts
            </button>
            <button 
              onClick={() => handleAction("resources")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "resources" ? "bg-blue-600 text-white shadow-lg" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"}`}
            >
              Expand Resources
            </button>
            <button 
              onClick={() => handleAction("challenge")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "challenge" ? "bg-blue-600 text-white shadow-lg" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"}`}
            >
              Mastery Challenge
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab !== "none" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 border-t border-zinc-100 dark:border-zinc-800 pt-6"
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-zinc-500 animate-pulse">Consulting AI Mentor...</p>
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  {activeTab === "challenge" && response?.question ? (
                    <div className="space-y-6">
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-zinc-200 dark:border-white/5">
                            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6">{response.question}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {response.options.map((opt: string) => (
                                    <button
                                        key={opt}
                                        onClick={() => setUserAnswer(opt)}
                                        className={`p-4 rounded-xl text-left text-sm font-medium border-2 transition-all ${
                                            userAnswer === opt 
                                            ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" 
                                            : "border-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {userAnswer && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`p-6 rounded-2xl border ${userAnswer === response.answer ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/30" : "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/30"}`}
                            >
                                <p className="font-black text-lg mb-2">
                                    {userAnswer === response.answer ? "🎯 Bullseye!" : "🚀 Nice Try!"}
                                </p>
                                <p className="text-zinc-700 dark:text-zinc-300 mb-4">{response.explanation}</p>
                                <button 
                                    onClick={() => handleAction("challenge")}
                                    className="text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800"
                                >
                                    Get Another Challenge
                                </button>
                            </motion.div>
                        )}
                    </div>
                  ) : (
                    <div 
                      className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-serif"
                      dangerouslySetInnerHTML={{ __html: typeof response === 'string' ? response.replace(/\n/g, '<br/>') : 'Something went wrong.' }} 
                    />
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "none" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <p className="text-zinc-400 text-sm italic">
                Select an AI action above to deeply master <span className="font-bold text-zinc-900 dark:text-zinc-100">{subskillName}</span>.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
