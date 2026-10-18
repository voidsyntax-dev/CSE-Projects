import { getCareers } from "@/lib/data";
import { getUserPreferences } from "@/lib/user";
import SettingsComponent from "@/components/SettingsComponent";
import PageTransition from "@/components/PageTransition";

export default async function SettingsPage() {
  const careers = await getCareers();
  const initialPrefs = await getUserPreferences();

  return (
    <PageTransition>
      <main className="min-h-screen bg-zinc-50 dark:bg-black">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
              User Settings
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Personalize your learning experience and set career goals.
            </p>
          </div>

          <SettingsComponent 
            careers={careers} 
            initialPrefs={initialPrefs as any} 
          />
        </div>
      </main>
    </PageTransition>
  );
}
