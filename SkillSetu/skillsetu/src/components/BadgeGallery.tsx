"use client";

interface Badge {
  id: string;
  name: string;
  description: string;
  earnedAt: Date | string;
}

interface BadgeGalleryProps {
  badges: Badge[];
}

export default function BadgeGallery({ badges }: BadgeGalleryProps) {
  if (badges.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/[.08] dark:bg-zinc-900 dark:border-white/[.145] h-full flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
          <span className="text-xl opacity-30">🏆</span>
        </div>
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">No Badges Yet</h3>
        <p className="text-xs text-zinc-500 mt-1 italic">Keep practicing to unlock achievements.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/[.08] dark:bg-zinc-900 dark:border-white/[.145] h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Hall of Fame</h3>
        <span className="text-xs font-bold text-blue-500">{badges.length} Unlocked</span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div 
            key={badge.id}
            className="group relative flex flex-col items-center p-4 rounded-xl bg-zinc-50 border border-zinc-100 transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1 dark:bg-zinc-800/50 dark:border-white/[.05] dark:hover:bg-zinc-800"
          >
             <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 text-2xl group-hover:scale-110 transition-transform dark:bg-zinc-700">
               {getBadgeEmoji(badge.name)}
             </div>
             <span className="text-[10px] font-bold text-center text-zinc-900 dark:text-zinc-100">
               {badge.name}
             </span>
             <span className="text-[8px] text-center text-zinc-500 mt-1 leading-tight">
               {new Date(badge.earnedAt).toLocaleDateString()}
             </span>

             {/* Tooltip */}
             <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-40 p-2 rounded bg-zinc-900 text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center shadow-xl">
               {badge.description}
               <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zinc-900" />
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getBadgeEmoji(name: string) {
  if (name.includes("Early Bird")) return "🌅";
  if (name.includes("Night Owl")) return "🦉";
  if (name.includes("Deep Diver")) return "🧬";
  if (name.includes("Rising Star")) return "⭐";
  if (name.includes("Master in Training")) return "🔥";
  if (name.includes("Ultimate Expert")) return "👑";
  return "🎖️";
}
