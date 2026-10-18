"use client";

import { useState } from "react";
import QuestionCard from "@/components/QuestionCard";
import ProgressBar from "@/components/ProgressBar";
import MasteryToast from "@/components/MasteryToast";
import { updateMastery, logTaskAttempt } from "@/lib/mastery";
import { getRecommendedResources, RecommendedResource, TriggerReason } from "@/lib/resources";
import { checkAndAwardBadges } from "@/lib/badges";
import { generateMasteryProof } from "@/lib/proofs";
import { getExplanation } from "@/lib/ai";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { Question } from "@/types";

interface PracticeEngineProps {
  skillId: string;
  subskillId: string;
  questions: Question[];
  initialMastery: number;
}

export default function PracticeEngine({ skillId, subskillId, questions, initialMastery }: PracticeEngineProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const [masteryPercent, setMasteryPercent] = useState<number>(initialMastery);
  
  // Aggregate Session Stats
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [totalMasteryGained, setTotalMasteryGained] = useState(0);
  const [lastGain, setLastGain] = useState(0);

  // Time tracking
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [recommendedResources, setRecommendedResources] = useState<RecommendedResource[] | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<{name: string, type: string}[]>([]);

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastGain, setToastGain] = useState(0);

  // AI Assistant State
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleAiExplain = async () => {
    const questionDoc = questions[currentQuestionIndex];
    setAiLoading(true);
    setAiExplanation(null);
    try {
      const response = await getExplanation(
        questionDoc.question,
        selectedAnswer || "No answer",
        isCorrect || false,
        questionDoc.explanation
      );
      setAiExplanation(response);
    } catch (e) {
      setAiExplanation("AI tutor is slightly busy. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAnswer || isSubmitted) return;

    const question = questions[currentQuestionIndex];
    const correct = selectedAnswer === question.answer;
    const timeTakenMs = Date.now() - startTime;
    
    setIsCorrect(correct);
    setIsSubmitted(true);
    
    // Resource Engine Trigger (Phase 4)
    if (!correct || timeTakenMs > 30000) {
      const reason: TriggerReason = !correct ? "fail" : "slow";
      if (question.subskill) {
        getRecommendedResources(question.subskill, reason, timeTakenMs)
          .then(res => setRecommendedResources(res.length > 0 ? res : null))
          .catch(e => console.error("Could not fetch resources", e));
      }
    } else {
      setRecommendedResources(null); // Clear previous if successful
    }
    
    // Enhanced mastery update with difficulty weighting (PRD §11)
    const { newScore, gain } = await updateMastery(
      `${skillId}:${subskillId}`,
      correct,
      question.difficulty
    );

    // Log the attempt to the database (Phase 2.3 & 3)
    await logTaskAttempt(question.id, selectedAnswer, correct, timeTakenMs, gain);

    setMasteryPercent(newScore);
    setLastGain(gain);
    setTotalMasteryGained(prev => prev + gain);
    
    if (correct) {
      setCorrectCount(prev => prev + 1);
    } else {
      setIncorrectCount(prev => prev + 1);
    }

    if (gain > 0) {
      setToastGain(gain);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);

      // Phase 5: Trigger confetti on ANY mastery gain (correct answer)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#22c55e", "#f59e0b"]
      });

      // Check for new badges
      const newlyAwarded = await checkAndAwardBadges();
      if (newlyAwarded.length > 0) {
        setEarnedBadges(prev => [...prev, ...newlyAwarded]);
      }
      // Phase 7: Proof Vault - Auto-generate mastery proof if >= 80%
      if (newScore >= 80) {
        const session = await fetch("/api/auth/session").then(res => res.json());
        if (session?.user?.id) {
           await generateMasteryProof(session.user.id, skillId, newScore);
        }
      }
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setIsCorrect(null);
    setStartTime(Date.now());
    setRecommendedResources(null);
    setAiExplanation(null);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">No practice questions available yet.</h1>
      </div>
    );
  }

  // Session Complete Summary
  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Practice Complete</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          You answered {correctCount} out of {questions.length} correctly.
        </p>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-lg border bg-gray-50 border-black/[.08] dark:bg-zinc-800/50 dark:border-white/[.145]">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{correctCount}</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Correct</div>
          </div>
          <div className="p-4 rounded-lg border bg-gray-50 border-black/[.08] dark:bg-zinc-800/50 dark:border-white/[.145]">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{incorrectCount}</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Incorrect</div>
          </div>
          <div className="p-4 rounded-lg border bg-gray-50 border-black/[.08] dark:bg-zinc-800/50 dark:border-white/[.145]">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">+{totalMasteryGained}</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Mastery Gained</div>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-lg border bg-gray-50 border-black/[.08] dark:bg-zinc-800/50 dark:border-white/[.145]">
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <span className="text-zinc-600 dark:text-zinc-400">Final Mastery</span>
            <span className="text-blue-600 dark:text-blue-400">{masteryPercent}%</span>
          </div>
          <ProgressBar value={masteryPercent} max={100} />
        </div>
        
        <a
          href={`/subskills/${skillId}/${subskillId}`}
          className="inline-block mt-8 px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Return to Subskill
        </a>
      </div>
    );
  }

  const question = questions[currentQuestionIndex];

  return (
    <div className="space-y-8">
      {/* Practice Header */}
      <div className="flex flex-col space-y-4">
          <div>
            <a href={`/subskills/${skillId}/${subskillId}`} className="text-blue-600 hover:underline text-sm font-medium mb-1 block">
                &larr; Back to Subskill
            </a>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 capitalize mt-1 mb-1">
              {subskillId.replace(/_/g, ' ')} Practice
            </h1>
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-zinc-500 dark:text-zinc-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                Mastery: {masteryPercent}%
              </span>
            </div>
          </div>
          
          <ProgressBar value={masteryPercent} max={100} />
      </div>

      {/* Dynamic Question Instance Context */}
      <QuestionCard 
          question={question} 
          selectedAnswer={selectedAnswer} 
          setSelectedAnswer={setSelectedAnswer} 
          isSubmitted={isSubmitted} 
      />

      {/* Achievement Alert */}
      {earnedBadges.length > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-xl animate-bounce mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <h4 className="font-bold">Achievement Unlocked!</h4>
              <p className="text-xs opacity-90">
                You earned {earnedBadges.map(b => b.name).join(", ")}! 
                Check your dashboard to see your collection.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Engine Footer */}
      <div className="flex justify-end pt-2">
           <button
              onClick={handleSubmit}
              disabled={!selectedAnswer || isSubmitted}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
           >
              Submit Answer
           </button>
      </div>

      {/* Feedback Display */}
      {isSubmitted && (
        <div className={`mt-6 p-4 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/50' : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/50'} animation-fade-in`}>
          <div className="flex items-start">
            <div className="mr-3 mt-0.5">
               {isCorrect ? (
                 <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
               ) : (
                 <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
               )}
            </div>
            <div className="w-full">
               <h4 className={`font-bold ${isCorrect ? 'text-green-900 dark:text-green-400' : 'text-red-900 dark:text-red-400'}`}>
                 {isCorrect ? "Correct!" : "Incorrect."}
               </h4>
               <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                 {question.explanation}
               </p>
               
               {/* Phase 4 Intelligent Recommendations Inline */}
               {recommendedResources && recommendedResources.length > 0 && (
                 <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 w-full">
                    <h5 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-1.5">
                       <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                       Recommended Review
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                       {recommendedResources.map(res => (
                          <a key={res.id} href={res.url} target="_blank" rel="noopener noreferrer" className="block p-3 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700 transition group tracking-normal text-left">
                             <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">{res.type} • {res.difficulty === 1 ? "Beginner" : res.difficulty === 2 ? "Intermediate" : "Advanced"}</div>
                             <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">{res.title}</div>
                             <div className="text-xs text-zinc-500 mt-1.5 font-medium">{res.matchReason}</div>
                          </a>
                       ))}
                    </div>
                 </div>
               )}

               {/* Phase 7 AI Assistant Trigger */}
               <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10">
                  <button 
                     onClick={handleAiExplain}
                     disabled={aiLoading}
                     type="button"
                     className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors uppercase tracking-widest"
                  >
                      {aiLoading ? (
                        <><svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Analyzing...</>
                      ) : (
                        <><span className="text-sm">🤖</span> Explain with AI Assistant</>
                      )}
                  </button>
                  
                  <AnimatePresence>
                    {aiExplanation && (
                      <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="mt-3 p-4 bg-white dark:bg-zinc-800 rounded-xl border border-blue-100 dark:border-blue-900 shadow-lg text-xs leading-relaxed text-zinc-700 dark:text-zinc-300"
                      >
                          <strong className="block text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-tight text-[10px]">Deep Concept Insight ✨</strong>
                          {aiExplanation}
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </div>
            {isCorrect && (
              <div className="ml-auto text-right shrink-0">
                <span className="inline-block px-2 py-1 bg-green-200 text-green-800 text-xs font-bold rounded-lg dark:bg-green-900/60 dark:text-green-300">
                   +{lastGain}%
                </span>
              </div>
            )}
          </div>
          
          <div className="mt-4 border-t border-black/[.05] dark:border-white/[.05] pt-4 flex justify-end">
            {currentQuestionIndex >= questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                View Summary
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Next Question
              </button>
            )}
          </div>
        </div>
      )}

      <MasteryToast visible={showToast} gain={toastGain} />
    </div>
  );
}
