import { NextResponse } from "next/server";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { z } from "zod";

const requestSchema = z.object({
  mood: z.string(),
  preferences: z.object({
    dietaryPreferences: z.array(z.string()),
    moodTracking: z.array(z.string()),
    cuisinePreferences: z.array(z.string()),
  }),
  context: z.object({
    timeOfDay: z.string(),
    weather: z.string().optional(),
    location: z.string().optional(),
  }),
});

const SYSTEM_PROMPT = `You are MoodBite's AI food recommendation expert. Analyze user moods and preferences to suggest personalized food recommendations considering:
1. Emotional state and intensity
2. Time of day and context
3. Dietary restrictions and preferences
4. Cultural preferences and cuisine familiarity
5. Nutritional needs based on mood

Provide recommendations that:
- Match the emotional state
- Respect dietary restrictions
- Consider cultural context
- Include mood-boosting ingredients
- Balance comfort with health`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mood, preferences, context } = requestSchema.parse(body);

    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.2,
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await model.invoke([
      new SystemMessage(SYSTEM_PROMPT),
      new HumanMessage(`
        Analyze this user's mood and provide food recommendations:
        
        Mood: ${mood}
        Dietary Preferences: ${preferences.dietaryPreferences.join(", ")}
        Cuisine Preferences: ${preferences.cuisinePreferences.join(", ")}
        Time of Day: ${context.timeOfDay}
        Weather: ${context.weather || "Not specified"}
        Location: ${context.location || "Not specified"}
        
        Provide a response in the following JSON format:
        {
          "analysis": {
            "dominantEmotion": string,
            "intensity": number,
            "context": {
              "timeOfDay": string,
              "weather": string?,
              "occasion": string?
            },
            "foodAssociations": string[]
          },
          "recommendations": [
            {
              "name": string,
              "cuisine": string,
              "description": string,
              "matchScore": number,
              "moodAlignment": string,
              "dietaryTags": string[],
              "nutritionalBenefits": string[],
              "imageUrl": string?
            }
          ],
          "explanation": string
        }
      `),
    ]);

    const parsedResponse = JSON.parse(response.content);

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("Error processing recommendation:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
