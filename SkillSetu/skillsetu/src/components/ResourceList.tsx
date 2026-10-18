"use client";

import { useState, useMemo } from "react";
import ResourceCard from "./ResourceCard";

interface ResourceData {
  id: string;
  type: string;
  title: string;
  url: string;
  duration: string | null;
  difficulty: number;
  rating: number | null;
}

interface ResourceListProps {
  resources: ResourceData[];
  userProgressMap: Record<string, { isCompleted: boolean; liked: boolean | null }>;
}

export default function ResourceList({ resources, userProgressMap }: ResourceListProps) {
  const [filterType, setFilterType] = useState<string>("All");
  const [filterDifficulty, setFilterDifficulty] = useState<number | "All">("All");
  const [showCompleted, setShowCompleted] = useState(true);

  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const typeMatch = filterType === "All" || res.type.toLowerCase() === filterType.toLowerCase();
      const diffMatch = filterDifficulty === "All" || res.difficulty === filterDifficulty;
      const progress = userProgressMap[res.id];
      const completedMatch = showCompleted || !progress?.isCompleted;
      return typeMatch && diffMatch && completedMatch;
    });
  }, [resources, userProgressMap, filterType, filterDifficulty, showCompleted]);

  const types = ["All", "Video", "Article", "Course"];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-black/[.05] dark:border-white/[.05]">
        <div className="flex flex-wrap items-center gap-2">
           <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mr-2">Filter</span>
          <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  filterType === type 
                    ? "bg-white text-blue-600 shadow-sm dark:bg-zinc-900 dark:text-blue-400" 
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <select 
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value === "All" ? "All" : Number(e.target.value))}
            className="bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg text-xs font-semibold text-zinc-600 px-3 py-2 outline-none dark:text-zinc-400 cursor-pointer"
          >
            <option value="All">All Levels</option>
            <option value="1">Beginner</option>
            <option value="2">Intermediate</option>
            <option value="3">Advanced</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
           <label className="flex items-center cursor-pointer gap-2 select-none">
              <span className="text-xs font-semibold text-zinc-500">Show Completed</span>
              <div 
                onClick={() => setShowCompleted(!showCompleted)}
                className={`w-10 h-5 rounded-full p-1 transition-colors duration-200 ${showCompleted ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
              >
                <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-200 ${showCompleted ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
           </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredResources.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl">
            <p className="text-zinc-500 dark:text-zinc-500 font-medium italic">No resources match your filters.</p>
          </div>
        ) : (
          filteredResources.map((res) => (
            <ResourceCard
              key={res.id}
              id={res.id}
              title={res.title}
              url={res.url}
              type={res.type}
              duration={res.duration}
              difficulty={res.difficulty}
              initialCompleted={userProgressMap[res.id]?.isCompleted || false}
              initialLiked={userProgressMap[res.id]?.liked || null}
            />
          ))
        )}
      </div>
    </div>
  );
}
