"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

interface StreakWidgetProps {
  currentStreak: number;
  longestStreak: number;
}

export default function StreakWidget({ currentStreak, longestStreak }: StreakWidgetProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check for milestone
    const milestones = [7, 14, 30, 50, 100];
    if (currentStreak > 0 && milestones.includes(currentStreak)) {
      // Fire confetti
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);
    }
  }, [currentStreak]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-sm border border-transparent p-6 text-white relative overflow-hidden dark:from-orange-600 dark:to-red-800">
      <div className="absolute -top-6 -right-6 text-9xl opacity-20 pointer-events-none select-none">
        🔥
      </div>
      
      <div className="relative z-10 flex-grow flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold opacity-90">Learning Streak</h2>
          <p className="text-sm opacity-80 mt-1">Keep it up!</p>
        </div>
        
        <div className="mt-6 flex items-end justify-between">
          <div>
            <span className="text-5xl font-black">{currentStreak}</span>
            <span className="text-lg font-medium opacity-80 ml-2">days</span>
          </div>
          
          <div className="text-right">
            <span className="text-sm opacity-80 block">Longest</span>
            <span className="text-xl font-bold">{longestStreak} days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
