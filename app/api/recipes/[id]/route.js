// app/api/recipes/[id]/route.js
import { NextResponse } from "next/server";

// Dummy recipe dataset (you might want to share this with the search endpoint)
const recipes = [
  {
    id: "1",
    title: "Caprese Salad",
    ingredients: ["tomato", "basil", "mozzarella", "olive oil"],
    instructions:
      "Slice tomatoes and mozzarella. Layer with basil leaves. Drizzle olive oil.",
    imageUrl: "/placeholder.jpg",
  },
  {
    id: "2",
    title: "Pasta Pomodoro",
    ingredients: ["pasta", "tomato", "garlic", "basil"],
    instructions:
      "Boil pasta. Sauté garlic in olive oil, add tomatoes, and simmer. Mix with pasta and garnish with basil.",
    imageUrl: "/placeholder.jpg",
  },
  {
    id: "3",
    title: "Bruschetta",
    ingredients: ["bread", "tomato", "garlic", "basil", "olive oil"],
    instructions:
      "Toast bread slices. Top with a tomato, basil, and garlic mixture. Drizzle with olive oil.",
    imageUrl: "/placeholder.jpg",
  },
];

export async function GET(request, { params }) {
  const { id } = params;
  const recipe = recipes.find((r) => r.id === id);
  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }
  return NextResponse.json(recipe);
}
