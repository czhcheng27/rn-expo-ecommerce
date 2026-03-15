import { HealthStatus } from "@/components/health-status";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-100 px-6 py-16 text-stone-950">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <section className="rounded-[2rem] bg-white px-8 py-10 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-stone-500">
            RN Expo Ecommerce Admin
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight">
            Admin requests are now standardized behind the same `/api/*` entry.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
            Browser-side code should call the shared helper instead of hardcoding
            the backend domain. The Next app proxies those requests to Railway
            through the `API_ORIGIN` rewrite.
          </p>
        </section>

        <HealthStatus />
      </div>
    </main>
  );
}
