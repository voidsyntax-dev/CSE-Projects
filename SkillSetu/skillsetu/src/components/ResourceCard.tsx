"use client";

import { useState } from "react";
import { toggleResourceComplete, toggleResourceLiked } from "@/lib/resources";

interface ResourceCardProps {
  id: string;
  title: string;
  url: string;
  type: string;
  duration: string | null;
  difficulty: number;
  initialCompleted: boolean;
  initialLiked: boolean | null;
}

export default function ResourceCard({
  id,
  title,
  url,
  type,
  duration,
  difficulty,
  initialCompleted,
  initialLiked
}: ResourceCardProps) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      await toggleResourceComplete(id, !completed);
      setCompleted(!completed);
    } catch (error) {
      console.error("Failed to toggle complete", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLiked = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const nextLiked = liked === true ? false : liked === false ? null : true;
      await toggleResourceLiked(id, nextLiked === true);
      setLiked(nextLiked);
    } catch (error) {
      console.error("Failed to toggle liked", error);
    }
  };

  return (
    <div 
      className={`group relative p-4 rounded-xl border transition-all duration-200 ${
        completed 
          ? "bg-zinc-50 border-green-200 dark:bg-zinc-900/50 dark:border-green-900/30 opacity-75 hover:opacity-100" 
          : "bg-white border-black/[.08] dark:bg-zinc-900 dark:border-white/[.145] hover:shadow-md hover:scale-[1.01]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex-grow min-w-0"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
              type.toLowerCase() === "video" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
              type.toLowerCase() === "article" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
              "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
            }`}>
              {type}
            </span>
            <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
              {difficulty === 1 ? "Beginner" : difficulty === 2 ? "Intermediate" : "Advanced"}
            </span>
            {duration && (
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500">• {duration}</span>
            )}
          </div>
          <h3 className={`font-bold text-sm sm:text-base truncate ${
            completed ? "text-zinc-500 line-through dark:text-zinc-400" : "text-zinc-900 dark:text-zinc-100"
          }`}>
            {title}
          </h3>
        </a>

        <div className="flex items-center gap-1 shrink-0">
           <button 
            onClick={handleToggleLiked}
            className={`p-1.5 rounded-lg transition-colors ${
              liked === true ? "text-orange-500 bg-orange-50 dark:bg-orange-950/30" : 
              liked === false ? "text-zinc-300 dark:text-zinc-700" : "text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
             title={liked === true ? "Liked" : "Like this resource"}
          >
            <svg className="w-4 h-4" fill={liked === true ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.708C19.746 10 20.5 10.824 20.5 11.917v1.166c0 .416-.125.833-.417 1.167l-3.333 4.167C16.458 18.75 16 19 15.5 19h-6c-.5 0-1-.25-1.25-.667l-3-4.5c-.167-.25-.25-.5-.25-.833V12c0-1.104.896-2 2-2h3V6c0-1.104.825-2 1.841-2A1.841 1.841 0 0113.682 6v4z"></path>
            </svg>
          </button>

          <button 
            onClick={handleToggleComplete}
            disabled={loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              completed 
                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" 
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
          >
            {completed ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                Done
              </>
            ) : "Mark Done"}
          </button>
        </div>
      </div>
    </div>
  );
}
