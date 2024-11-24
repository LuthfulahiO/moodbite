import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";

const requestSchema = z.object({
  mood: z.string(),
  preferences: z.object({
    nationality: z.string(),
    dietaryPreferences: z.array(z.string()),
    moodTracking: z.array(z.string()),
    healthRestrictions: z.array(z.string()),
    cuisinePreference: z.string(),
  }),
});

// Define the exact output structure we want
const responseSchema = z.object({
  analysis: z.object({
    dominantEmotion: z.string(),
    intensity: z.number(),
    context: z.object({
      timeOfDay: z.string(),
      weather: z.string().optional(),
      occasion: z.string().optional(),
    }),
    foodAssociations: z.array(z.string()),
  }),
  recommendations: z.array(
    z.object({
      name: z.string(),
      cuisine: z.string(),
      description: z.string(),
      matchScore: z.number(),
      moodAlignment: z.string(),
      dietaryTags: z.array(z.string()),
      nutritionalBenefits: z.array(z.string()),
    })
  ),
  explanation: z.string(),
});

const outputParser = new JsonOutputParser<typeof responseSchema.shape>();

const promptTemplate =
  PromptTemplate.fromTemplate(`You are MoodBite's AI food recommendation expert. Generate exactly 3 food recommendations based on the user's mood and preferences.

User Information:
Nationality: {nationality}
Mood: {mood}
Dietary Preferences: {dietary_preferences}
Health Restrictions: {health_restrictions}
Mood Tracking: {mood_tracking}
Cuisine Preference: {cuisine_preference}

You must respond with a JSON object that exactly matches this structure:
{{
  "analysis": {{
    "dominantEmotion": "current primary emotion",
    "intensity": "number between 1-10",
    "context": {{
      "timeOfDay": "morning/afternoon/evening",
      "weather": "optional weather context",
      "occasion": "optional special occasion"
    }},
    "foodAssociations": ["food types associated with mood"]
  }},
  "recommendations": [
    {{
      "name": "dish name",
      "cuisine": "cuisine type",
      "description": "brief description",
      "matchScore": "number between 1-10",
      "moodAlignment": "how it aligns with mood",
      "dietaryTags": ["relevant dietary tags"],
      "nutritionalBenefits": ["key nutritional benefits"],
    }},
  ],
  "explanation": "brief explanation of recommendations"
}}

{format_instructions}

Important:
- Provide EXACTLY 3 recommendations
- Ensure all responses are in valid JSON format
- Do not include any additional text or explanations outside the JSON structure`);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mood, preferences } = requestSchema.parse(body);

    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.2,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Format the prompt with the correct parameters
    const formattedPrompt = await promptTemplate.format({
      nationality: preferences.nationality,
      mood: mood,
      dietary_preferences: preferences.dietaryPreferences.join(", "),
      health_restrictions: preferences.healthRestrictions.join(", "),
      mood_tracking: preferences.moodTracking.join(", "),
      cuisine_preference:
        preferences.cuisinePreference || "No specific preference",
      format_instructions: outputParser.getFormatInstructions(),
    });

    const response = await model.invoke(formattedPrompt);
    let responseText: string;

    if (typeof response.content === "string") {
      responseText = response.content;
    } else if (Array.isArray(response.content)) {
      const textContent = response.content.find(
        (content: any) => "type" in content && content.type === "text"
      );
      if (!textContent || !("text" in textContent)) {
        throw new Error("No text content found in response");
      }
      responseText = textContent.text;
    } else {
      throw new Error("Unexpected response format");
    }

    return NextResponse.json(JSON.parse(responseText));
  } catch (error) {
    console.error("Error processing recommendation:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
