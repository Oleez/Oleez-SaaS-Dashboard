import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { savePreferences, addActivityNote } from "./actions";

type NotePriority = "High Priority" | "Medium Priority" | "Low Priority";

const ALLOWED_CATEGORIES = [
  "Work",
  "Personal",
  "Projects",
  "Learning",
  "Health",
  "Travel",
];

function priorityBadge(priority: NotePriority) {
  if (priority === "High Priority") {
    return "bg-amber-500/15 text-amber-300 border border-amber-500/40";
  }
  if (priority === "Medium Priority") {
    return "bg-sky-500/15 text-sky-300 border border-sky-500/40";
  }
  return "bg-zinc-700/40 text-zinc-200 border border-zinc-700/80";
}

/**
 * Protected dashboard page demonstrating:
 * - Server-side authentication
 * - Database queries with Prisma
 * - Server actions for form handling
 * - User preference management
 */
export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  const userId = (session.user as { id?: string } | undefined)?.id;

  // Load user with their selected categories
  const user =
    userId &&
    (await prisma.user.findUnique({
      where: { id: userId },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    }));

  const selectedCategories =
    user?.categories.map((c) => c.category.name).filter((name) => !!name) ?? [];
  const defaultCategory = user?.defaultCategory ?? "General";

  // Filter notes by user's selected categories if any are set
  const noteWhere:
    | {
        userId: string;
        OR?: { category: { contains: string } }[];
      }
    | undefined = userId
    ? {
        userId,
        ...(selectedCategories.length
          ? {
              OR: selectedCategories.map((name) => ({
                category: { contains: name },
              })),
            }
          : {}),
      }
    : undefined;

  const notes =
    noteWhere &&
    (await prisma.note.findMany({
      where: noteWhere,
      orderBy: { createdAt: "desc" },
    }));

  // Simple reminder: if user hasn't added a note recently, show a gentle nudge
  const lastNote =
    userId &&
    (await prisma.note.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }));

  const shouldShowReminder = (() => {
    if (!lastNote) return true;
    const now = new Date();
    const diffMs = now.getTime() - lastNote.createdAt.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays >= 5;
  })();

  return (
    <div className="min-h-screen bg-black text-zinc-50">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-8 sm:px-8">
        <header className="flex flex-col items-start justify-between gap-4 border-b border-zinc-900 pb-6 pt-2 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Your activity notes
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Personal notes organized by category and priority.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
            {session?.user?.email ? (
              <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1">
                Signed in as{" "}
                <span className="font-semibold">{session.user.email}</span>
              </span>
            ) : null}
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-emerald-300">
              Free tier · Upgrade for advanced features
            </span>
          </div>
        </header>

        {shouldShowReminder ? (
          <div className="mb-2 mt-1 rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-xs text-zinc-300">
            <p>
              Haven&apos;t added a note in a while? Use the form on the right to
              create a new activity note and keep your records up to date.
            </p>
          </div>
        ) : null}

        <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
          <div className="space-y-3">
            {!notes || notes.length === 0 ? (
              <p className="text-sm text-zinc-400">
                No notes yet. Use the form on the right to add your first activity
                note.
              </p>
            ) : null}

            {notes?.map((note) => (
              <article
                key={note.id}
                className="group overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/70 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/70"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-zinc-50">
                      {note.title}
                    </h2>
                    <p className="mt-0.5 text-xs text-zinc-400">
                      {note.category}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${priorityBadge(
                      note.priority as NotePriority
                    )}`}
                  >
                    {note.priority}
                  </span>
                </div>

                <p className="mt-3 text-sm text-zinc-200">{note.summary}</p>
                <p className="mt-2 text-xs text-zinc-400">
                  {new Date(note.createdAt).toLocaleString("en-GB", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <details className="mt-3 rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-xs text-zinc-200">
                  <summary className="cursor-pointer list-none select-none text-emerald-300 hover:text-emerald-200">
                    View full details
                  </summary>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-zinc-300">{note.content}</p>
                    {note.description && (
                      <p className="mt-2 text-[11px] text-zinc-400">
                        Original: {note.description.substring(0, 150)}
                        {note.description.length > 150 ? "..." : ""}
                      </p>
                    )}
                  </div>
                </details>
              </article>
            ))}
          </div>

          <aside className="space-y-4 rounded-2xl border border-zinc-900 bg-zinc-950/80 p-4 text-sm text-zinc-300">
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Your preferences
              </h2>
              <p className="mt-1 text-xs text-zinc-400">
                Select up to three categories. Your dashboard will focus on notes
                in these categories.
              </p>

              <form action={savePreferences} className="space-y-3">
                <div className="space-y-2">
                  <p className="text-[11px] font-medium text-zinc-400">
                    Categories (max 3)
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {ALLOWED_CATEGORIES.map((category) => (
                      <label
                        key={category}
                        className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-black/40 px-2 py-1.5"
                      >
                        <input
                          type="checkbox"
                          name="categories"
                          value={category}
                          defaultChecked={selectedCategories.includes(category)}
                          className="h-3 w-3 rounded border-zinc-700 bg-zinc-900 text-emerald-400 focus:ring-0"
                        />
                        <span>{category}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    If you select more than three, we&apos;ll keep the first three
                    when saving.
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] font-medium text-zinc-400">
                    Default category
                  </p>
                  <select
                    name="defaultCategory"
                    defaultValue={defaultCategory}
                    className="w-full rounded-lg border border-zinc-800 bg-black/40 px-2 py-1.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                  >
                    {ALLOWED_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-[11px] font-semibold text-zinc-100 transition hover:border-emerald-500 hover:bg-zinc-900/80"
                >
                  Save preferences
                </button>
              </form>
            </div>

            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Add activity note
              </h2>
              <p className="mt-2 text-xs">
                Create a new note with a title, category, and description. The
                system will generate a structured summary.
              </p>

              <form action={addActivityNote} className="space-y-2 text-xs">
                <div className="space-y-1">
                  <label className="block text-[11px] text-zinc-400">Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full rounded-lg border border-zinc-800 bg-black/40 px-2 py-1.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g., Project planning session"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] text-zinc-400">
                    Category
                  </label>
                  <select
                    name="category"
                    required
                    className="w-full rounded-lg border border-zinc-800 bg-black/40 px-2 py-1.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                  >
                    {ALLOWED_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] text-zinc-400">
                    Description
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    className="w-full resize-none rounded-lg border border-zinc-800 bg-black/40 px-2 py-1.5 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="Describe the activity, what happened, key points..."
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-300 shadow-sm shadow-emerald-500/20 transition hover:bg-emerald-500/20"
                >
                  Add activity note
                </button>
              </form>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
