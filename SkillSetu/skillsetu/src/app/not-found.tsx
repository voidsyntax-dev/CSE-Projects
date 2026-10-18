import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black px-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <h1 className="text-9xl font-black text-zinc-200 dark:text-zinc-800 animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-4xl">🛰️</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Lost in Orbit?
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            The mastery path you're looking for doesn't exist or has moved to a new coordinate.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-[0.98]"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/careers"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
          >
            Explore Careers
          </Link>
        </div>

        <div className="pt-12">
            <p className="text-xs text-zinc-400 italic">
                “Not all who wander are lost, but they might need a better skill map.”
            </p>
        </div>
      </div>
    </div>
  );
}
