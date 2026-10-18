import { Question } from "@/types";

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | null;
  setSelectedAnswer: (answer: string) => void;
  isSubmitted: boolean;
}

export default function QuestionCard({ question, selectedAnswer, setSelectedAnswer, isSubmitted }: QuestionCardProps) {
  function getDifficultyLabel(level: number) {
    if (level === 1) return "Beginner";
    if (level === 2) return "Intermediate";
    if (level === 3) return "Advanced";
    return `Level ${level}`;
  }

  return (
    <div className="p-6 rounded-xl border bg-white shadow-sm dark:bg-zinc-900 dark:border-white/[.145]">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300">
          Difficulty: {getDifficultyLabel(question.difficulty)}
        </span>
        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300 capitalize">
          Skill: {question.skill.replace(/_/g, " ")}
        </span>
        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300 capitalize">
          Subskill: {question.subskill ? question.subskill.replace(/_/g, " ") : ""}
        </span>
      </div>

      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
        {question.question}
      </h2>

      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          
          return (
            <button
              key={idx}
              onClick={() => {
                if (!isSubmitted) setSelectedAnswer(option);
              }}
              disabled={isSubmitted}
              className={`w-full text-left p-3 rounded-lg border transition-all duration-200 font-medium
                ${isSelected 
                  ? "border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-100" 
                  : "border-gray-200 bg-white text-zinc-700 hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 hover:dark:bg-zinc-800"}
                ${isSubmitted && !isSelected ? "opacity-60 cursor-not-allowed" : ""}
                ${isSubmitted && isSelected ? "cursor-not-allowed" : ""}
              `}
            >
              <span className="mr-3 text-zinc-400 dark:text-zinc-500 font-semibold">{String.fromCharCode(65 + idx)}</span>
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
