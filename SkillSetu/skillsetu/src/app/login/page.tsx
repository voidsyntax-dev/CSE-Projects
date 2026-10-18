import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import Link from "next/link";

export default function LoginPage() {
  const handleSignIn = async (formData: FormData) => {
    "use server";
    try {
      await signIn("credentials", formData);
    } catch (error) {
      if (error instanceof AuthError) {
        // Just redirect back to login with error param for now
        // A robust app would extract the error and pass it to UI
      }
      throw error;
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-black/[.08] dark:border-white/[.145] p-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 text-center mb-8">
          Welcome back to SkillSetu
        </h1>

        <form action={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Test Email
            </label>
            <input
              name="email"
              type="email"
              required
              defaultValue="test@example.com"
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-zinc-500 mt-1">Hint: Use test@example.com</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              defaultValue="dummy"
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition flex justify-center mt-6"
          >
            Sign In (Prototype)
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Don&apos;t have an account? <Link href="/login" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
