// app/api/generateRecipe/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Parse incoming request JSON
    const body = await request.json();
    const { ingredients, dietaryPreferences } = body;

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { error: "No ingredients provided" },
        { status: 400 }
      );
    }

    // Construct a prompt for the AI
    let prompt = `Generate a detailed, creative, and easy-to-follow recipe using the following ingredients: ${ingredients.join(
      ", "
    )}. `;
    prompt +=
      "Include a list of ingredients, step-by-step cooking instructions, an estimated cooking time, and suggestions for ingredient substitutions if a key ingredient is unavailable. ";

    if (dietaryPreferences && dietaryPreferences.trim() !== "") {
      prompt += `The recipe should comply with these dietary preferences: ${dietaryPreferences}.`;
    }

    // Call the OpenAI Chat Completion API.
    const apiKey = process.env.OPENAI_API_KEY;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4", // or "gpt-3.5-turbo" if you prefer
        messages: [
          {
            role: "system",
            content: "You are a skilled chef and recipe generator.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Failed to generate recipe" },
        { status: response.status }
      );
    }

    const generatedRecipe = data.choices[0].message.content;

    return NextResponse.json({ recipe: generatedRecipe });
  } catch (error) {
    console.error("Error generating recipe:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
