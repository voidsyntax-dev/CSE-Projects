import { getCareers } from "@/lib/data";
import CareerExplorer from "@/components/CareerExplorer";
import PageTransition from "@/components/PageTransition";

export default async function CareersPage() {
  const careers = await getCareers();

  return (
    <PageTransition>
      <main className="min-h-screen bg-zinc-50 dark:bg-black">
        <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
            Explore Careers
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Discover a wide range of career paths and start mastering the skills required to succeed in modern industries.
          </p>
        </div>

        <CareerExplorer initialCareers={careers} />
      </div>
    </main>
    </PageTransition>
  );
}
