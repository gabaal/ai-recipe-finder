// app/api/recipes/route.js
import { NextResponse } from "next/server";

// Dummy recipe dataset
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

// Simple matching function: count matching ingredients
function matchRecipes(queryIngredients, recipes) {
  return recipes
    .map((recipe) => {
      const matchCount = recipe.ingredients.filter((ingredient) =>
        queryIngredients.includes(ingredient.toLowerCase().trim())
      ).length;
      return { ...recipe, matchCount };
    })
    .filter((recipe) => recipe.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ingredients = searchParams.get("ingredients");

  if (!ingredients) {
    return NextResponse.json(
      { error: "Please provide ingredients as a query parameter." },
      { status: 400 }
    );
  }

  // Normalize and split the input ingredients
  const queryIngredients = ingredients
    .toLowerCase()
    .split(",")
    .map((item) => item.trim());

  const matchedRecipes = matchRecipes(queryIngredients, recipes);
  return NextResponse.json({ recipes: matchedRecipes });
}
