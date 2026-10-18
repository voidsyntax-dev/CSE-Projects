import Link from 'next/link';
import { auth, signOut } from '@/auth';
import MobileMenu from './MobileMenu';

export default async function Navbar() {
  const session = await auth();

  const signOutAction = async () => {
    "use server";
    await signOut();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 dark:bg-black dark:border-white/[.145]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-blue-600 dark:text-blue-500">
          SkillSetu
        </Link>
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/" className="text-zinc-600 hover:text-blue-600 font-medium transition dark:text-zinc-400 dark:hover:text-blue-400">
            Home
          </Link>
          <Link href="/careers" className="text-zinc-600 hover:text-blue-600 font-medium transition dark:text-zinc-400 dark:hover:text-blue-400">
            Careers
          </Link>
          <Link href="/dashboard" className="text-zinc-600 hover:text-blue-600 font-medium transition dark:text-zinc-400 dark:hover:text-blue-400">
            Dashboard
          </Link>
          <Link href="/proofs" className="text-zinc-600 hover:text-blue-600 font-medium transition dark:text-zinc-400 dark:hover:text-blue-400">
            Portfolio
          </Link>
          <Link href="/internships" className="text-zinc-600 hover:text-blue-600 font-medium transition dark:text-zinc-400 dark:hover:text-blue-400">
            Internships
          </Link>
          <Link href="/ai-navigator" className="text-zinc-600 hover:text-blue-600 font-medium transition dark:text-zinc-400 dark:hover:text-blue-400">
            AI Mentor
          </Link>
        </div>

        <div className="hidden md:flex items-center">
          {session?.user ? (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-zinc-200 dark:border-zinc-800">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {session.user.name}
              </span>
              <form
                action={signOutAction}
              >
                <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-700 transition dark:text-red-400">
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <div className="ml-4 pl-4 border-l border-zinc-200 dark:border-zinc-800">
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Mobile View Toggle */}
        <MobileMenu session={session} signOutAction={signOutAction} />
      </div>
    </nav>
  );
}
