import { getCareers } from "@/lib/data";
import AICareerNavigator from "@/components/AICareerNavigator";
import PageTransition from "@/components/PageTransition";

export default async function AICareerNavigatorPage() {
  const careers = await getCareers();

  return (
    <PageTransition>
      <main className="min-h-screen bg-zinc-50 dark:bg-black">
        <div className="mx-auto max-w-4xl px-6 py-12">
          
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
              AI Career Navigator
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Not sure which path to choose? Let the AI Mentor help you discover your ideal engineering career.
            </p>
          </div>

          <AICareerNavigator careers={careers} />
        </div>
      </main>
    </PageTransition>
  );
}
