"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateNoteFromInput, type NoteResult } from "@/lib/ai";
import { revalidatePath } from "next/cache";

// Allowed categories for organizing notes
const ALLOWED_CATEGORIES = [
  "Work",
  "Personal",
  "Projects",
  "Learning",
  "Health",
  "Travel",
];

/**
 * Server action: Add a new activity note for the authenticated user.
 * Demonstrates form handling, authentication, and database persistence.
 */
export async function addActivityNote(formData: FormData) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!session || !userId) {
    throw new Error("Not authenticated");
  }

  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!title || !category || !description) {
    throw new Error("title, category and description are required");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { defaultCategory: true },
  });

  const finalCategory = user?.defaultCategory ?? "General";

  const input = {
    title,
    category: finalCategory,
    description,
  };

  // Generate structured note using placeholder logic
  const noteResult: NoteResult = await generateNoteFromInput(input);

  await prisma.note.create({
    data: {
      userId,
      title: input.title,
      category: input.category,
      description: input.description,
      priority: noteResult.priority,
      summary: noteResult.summary,
      content: noteResult.content,
    },
  });

  revalidatePath("/dashboard");
}

/**
 * Server action: Save user preferences for categories.
 * Demonstrates transaction handling and relational data updates.
 */
export async function savePreferences(formData: FormData) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!session || !userId) {
    throw new Error("Not authenticated");
  }

  const rawCategories = formData.getAll("categories").map((v) => String(v));
  const uniqueCategories = Array.from(new Set(rawCategories)).filter((name) =>
    ALLOWED_CATEGORIES.includes(name),
  );
  const limitedCategories = uniqueCategories.slice(0, 3);

  const rawDefaultCategory = String(
    formData.get("defaultCategory") ?? "General",
  );
  const defaultCategory = ALLOWED_CATEGORIES.includes(rawDefaultCategory)
    ? rawDefaultCategory
    : "General";

  // Ensure Category rows exist and collect their IDs
  const categoryIds: string[] = [];
  for (const name of limitedCategories) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categoryIds.push(category.id);
  }

  // Replace existing preferences for this user
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        defaultCategory,
      },
    }),
    prisma.userCategory.deleteMany({
      where: { userId },
    }),
    ...(categoryIds.length
      ? [
          prisma.userCategory.createMany({
            data: categoryIds.map((categoryId) => ({ userId, categoryId })),
          }),
        ]
      : []),
  ]);

  revalidatePath("/dashboard");
}
