import Link from "next/link";
import { Career } from "../types";

interface CareerCardProps {
  career: Career;
}

export default function CareerCard({ career }: CareerCardProps) {
  const badgeColor = {
    Beginner: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    Intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    Advanced: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  }[career.difficulty];

  return (
    <Link 
      href={`/career/${career.id}`}
      className="block rounded-xl bg-white p-6 shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg dark:bg-zinc-900 dark:border dark:border-zinc-800"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4 gap-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2">
            {career.name}
          </h2>
          <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeColor}`}>
            {career.difficulty}
          </span>
        </div>
        
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 flex-grow line-clamp-3">
          {career.description}
        </p>
        
        <div className="flex flex-col space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 dark:text-zinc-500">Avg. Salary</span>
            <span>{career.avgSalary}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 dark:text-zinc-500">Learning Time</span>
            <span>{career.learningTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
