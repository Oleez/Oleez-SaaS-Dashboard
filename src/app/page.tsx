export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-zinc-900 text-zinc-50">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-12 px-6 py-16 sm:px-8">
        <section className="flex w-full flex-col gap-8 text-center sm:text-left lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-6 max-w-xl">
            <p className="text-sm font-semibold tracking-[0.2em] text-zinc-400 uppercase">
              Personal Activity Notes Dashboard
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Organize your activities{" "}
              <span className="text-emerald-400">
                with structured notes and categories.
              </span>
            </h1>
            <p className="text-lg leading-relaxed text-zinc-300">
              A lightweight web application where authenticated users can save
              short activity notes, tag them by category, and review them later in
              a clean dashboard. Simple, fast, and focused on your workflow.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-stretch">
              <a
                href="/api/auth/signin?callbackUrl=/dashboard"
                className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-400 px-8 text-sm font-semibold text-black shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-300"
              >
                Continue with Google
              </a>
              <p className="text-xs text-zinc-400">
                No installs. No spam. Just your notes, organized your way.
              </p>
            </div>
          </div>
          <div className="mt-6 w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 text-left shadow-xl shadow-black/40">
            <div className="mb-4 flex items-center justify-between text-xs text-zinc-400">
              <span>Recent notes</span>
              <span>Work</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-zinc-100">
                    Project planning session
                  </span>
                  <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
                    High Priority
                  </span>
                </div>
                <p className="mt-2 text-xs text-zinc-400">
                  Key decisions made, timeline updated, and action items assigned
                  for the next sprint.
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>Category: Work</span>
                  <span>2 hours ago</span>
                </div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-zinc-100">
                    Learning progress
                  </span>
                  <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[11px] font-semibold text-sky-300">
                    Medium Priority
                  </span>
                </div>
                <p className="mt-2 text-xs text-zinc-400">
                  Completed chapter 3, noted key concepts, and scheduled review
                  session for next week.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-900 bg-black/40 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-zinc-200">
                    Weekend plans
                  </span>
                  <span className="rounded-full bg-zinc-700/40 px-2 py-0.5 text-[11px] font-semibold text-zinc-200">
                    Low Priority
                  </span>
                </div>
                <p className="mt-2 text-xs text-zinc-500">
                  Quick reminder of activities planned for the weekend, nothing
                  urgent.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid w-full gap-4 text-sm text-zinc-300 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Simple and focused
            </p>
            <p className="mt-2">
              Designed for quick note-taking and easy retrieval. No complex
              features, just the essentials for organizing your activities.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Category organization
            </p>
            <p className="mt-2">
              Tag your notes by category and filter your dashboard to focus on
              what matters most to you right now.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Priority tagging
            </p>
            <p className="mt-2">
              Automatically categorize notes by priority to help you quickly
              identify what needs immediate attention.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
