"use client";

import { useState, Children } from "react";
import ReactMarkdown from "react-markdown";

// Custom heading component that highlights specific titles.
function Heading({ level, children, ...props }) {
  // Extract plain text from the heading's children.
  const text = Children.toArray(children)
    .map((child) => (typeof child === "string" ? child : ""))
    .join("");

  // Debug: log the heading text and whether it's marked for highlight.
  console.log("Rendering heading:", text);

  // Titles to highlight (case-insensitive).
  const highlightTitles = [
    "recipe",
    "ingredients",
    "instructions",
    "estimated cooking time",
    "ingredient substitution",
  ];

  // Check if the heading text includes any of the target keywords.
  const isHighlighted = highlightTitles.some((title) =>
    text.toLowerCase().includes(title.toLowerCase())
  );

  // Debug: log the highlight status.
  console.log("isHighlighted:", isHighlighted, "for heading:", text);

  // Determine the heading tag (h1, h2, etc.).
  const Tag = `h${level}`;

  return (
    <Tag
      {...props}
      className={`mt-4 mb-2 ${
        isHighlighted
          ? "bg-yellow-200 text-blue-700 p-2 rounded"
          : "text-xl font-semibold"
      }`}
    >
      {children}
    </Tag>
  );
}

export default function GenerateRecipePage() {
  const [ingredients, setIngredients] = useState("");
  const [dietaryPreferences, setDietaryPreferences] = useState("");
  const [recipe, setRecipe] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  // Function to generate an image based on a snippet of the recipe.
  const generateImageForRecipe = async (recipeText) => {
    setLoadingImage(true);
    try {
      const imagePrompt = `A high quality, appetizing photo of the following dish: ${recipeText.substring(
        0,
        150
      )}...`;
      const response = await fetch("/api/generateImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt }),
      });
      const data = await response.json();
      if (response.ok) {
        setImageUrl(data.imageUrl);
      } else {
        console.error("Image generation error:", data.error);
      }
    } catch (error) {
      console.error("Error during image generation:", error);
    }
    setLoadingImage(false);
  };

  // Function to generate a recipe and then its associated image.
  const handleGenerateRecipe = async (e) => {
    e.preventDefault();
    setLoadingRecipe(true);
    setRecipe("");
    setImageUrl("");

    try {
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
          <div className="text-gray-800">
            <div className="prose">
              <ReactMarkdown
                components={{
                  // Override heading tags with our custom component.
                  h1: ({ node, ...props }) => <Heading level={1} {...props} />,
                  h2: ({ node, ...props }) => <Heading level={2} {...props} />,
                  h3: ({ node, ...props }) => <Heading level={3} {...props} />,
                  h4: ({ node, ...props }) => <Heading level={4} {...props} />,
                  // Convert ordered lists to unordered lists.
                  ol: ({ node, ...props }) => <ul {...props} />,
                }}
              >
                {recipe}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
