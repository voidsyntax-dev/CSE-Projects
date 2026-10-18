"use client";

import { useState, useMemo } from "react";
import CareerCard from "@/components/CareerCard";
import { Career } from "@/types";

interface CareerExplorerProps {
  initialCareers: Career[];
}

export default function CareerExplorer({ initialCareers }: CareerExplorerProps) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("default");

  const filteredCareers = useMemo(() => {
    let result = [...initialCareers];

    // Search
    if (search) {
      result = result.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Difficulty
    if (difficulty !== "All") {
      result = result.filter(c => c.difficulty === difficulty);
    }

    // Sort
    if (sortBy === "salary_desc") {
      result.sort((a, b) => {
        const valA = parseInt(a.avgSalary.replace(/[$,]/g, ""));
        const valB = parseInt(b.avgSalary.replace(/[$,]/g, ""));
        return valB - valA;
      });
    } else if (sortBy === "salary_asc") {
        result.sort((a, b) => {
          const valA = parseInt(a.avgSalary.replace(/[$,]/g, ""));
          const valB = parseInt(b.avgSalary.replace(/[$,]/g, ""));
          return valA - valB;
        });
    }

    return result;
  }, [initialCareers, search, difficulty, sortBy]);

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-black/[.08] dark:border-white/[.1] shadow-sm">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search careers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
          />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <select 
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="All">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="default">Sort by</option>
            <option value="salary_desc">Highest Salary</option>
            <option value="salary_asc">Lowest Salary</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {filteredCareers.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCareers.map((career) => (
            <CareerCard key={career.id} career={career} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold dark:text-zinc-100">No careers found</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
