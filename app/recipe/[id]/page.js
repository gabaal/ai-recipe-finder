// app/recipe/[id]/page.js
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RecipeDetail() {
  const { id } = useParams(); // Extract dynamic parameter from URL
  const router = useRouter();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchRecipe() {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        // Check if the response is not okay (e.g., recipe not found)
        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData.error || "Error fetching recipe details");
          return;
        }
        const data = await res.json();
        setRecipe(data);
      } catch (error) {
        console.error("Error fetching recipe detail:", error);
        setError("An unexpected error occurred.");
      }
    }
    fetchRecipe();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!recipe) return <p>Loading recipe details...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={() => router.back()} style={{ marginBottom: "1rem" }}>
        Back
      </button>
      <h1>{recipe.title}</h1>
      <img
        src={recipe.imageUrl}
        alt={recipe.title}
        width="300"
        style={{ borderRadius: "8px" }}
      />
      <h2>Ingredients</h2>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h2>Method</h2>
      <p>{recipe.instructions}</p>
    </div>
  );
}
