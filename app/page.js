"use client";

import { useState } from "react";

export default function GenerateRecipePage() {
  const [ingredients, setIngredients] = useState("");
  const [dietaryPreferences, setDietaryPreferences] = useState("");
  const [recipe, setRecipe] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  // This function generates an image based on the recipe text.
  const generateImageForRecipe = async (recipeText) => {
    setLoadingImage(true);
    try {
      // Create an image prompt from the recipe—for example, using the first 150 characters.
      const imagePrompt = `A high quality, appetizing photo of the following dish: ${recipeText.substring(
        0,
        150
      )}...`;
      const response = await fetch("/api/generateImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: imagePrompt }),
      });
      const data = await response.json();
      if (response.ok) {
        setImageUrl(data.imageUrl);
      } else {
        console.error("Image generation error:", data.error);
      }
    } catch (error) {
      console.error("Unexpected error during image generation:", error);
    }
    setLoadingImage(false);
  };

  // This function generates a recipe, and once it's generated, automatically generates an image.
  const handleGenerateRecipe = async (e) => {
    e.preventDefault();
    setLoadingRecipe(true);
    // Reset previous recipe and image.
    setRecipe("");
    setImageUrl("");

    try {
      // Process comma-separated ingredients.
      const ingredientList = ingredients.split(",").map((item) => item.trim());
      const response = await fetch("/api/generateRecipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: ingredientList,
          dietaryPreferences: dietaryPreferences.trim(),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setRecipe(data.recipe);
        // Automatically generate the image for the new recipe.
        await generateImageForRecipe(data.recipe);
      } else {
        setRecipe("Error: " + data.error);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setRecipe("An unexpected error occurred while generating the recipe.");
    }
    setLoadingRecipe(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-extrabold text-center mb-10">
        AI-Driven Recipe &amp; Image Generation
      </h1>
      <form onSubmit={handleGenerateRecipe} className="space-y-6">
        <div>
          <label
            htmlFor="ingredients"
            className="block text-lg font-semibold mb-2"
          >
            Ingredients (comma separated)
          </label>
          <input
            id="ingredients"
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g., tomato, basil, mozzarella"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="dietaryPreferences"
            className="block text-lg font-semibold mb-2"
          >
            Dietary Preferences (optional)
          </label>
          <input
            id="dietaryPreferences"
            type="text"
            value={dietaryPreferences}
            onChange={(e) => setDietaryPreferences(e.target.value)}
            placeholder="e.g., vegetarian, gluten-free"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loadingRecipe}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {loadingRecipe ? "Generating Recipe..." : "Generate Recipe"}
        </button>
      </form>

      {recipe && (
        <div className="mt-10 bg-white border border-gray-200 rounded-xl shadow-lg p-6">
          {/* If an image is being generated, show a loading message; otherwise, display it */}
          {loadingImage ? (
            <div className="flex justify-center mb-4">
              <p>Generating Image...</p>
            </div>
          ) : (
            imageUrl && (
              <div className="flex justify-center mb-4">
                <img
                  src={imageUrl}
                  alt="Generated Recipe"
                  className="rounded-lg border border-gray-200 shadow-lg"
                  width="512"
                  height="512"
                />
              </div>
            )
          )}
          <h2 className="text-2xl font-bold mb-4">Generated Recipe</h2>
          <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
            {recipe}
          </div>
        </div>
      )}
    </div>
  );
}
