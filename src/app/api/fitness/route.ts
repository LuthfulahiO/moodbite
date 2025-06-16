import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";

const requestSchema = z.object({
  query: z
    .string()
    .min(10, "Please provide a more detailed description of your needs"),
});

const responseSchema = z.object({
  analysis: z.object({
    fitnessGoals: z.array(z.string()),
    nutritionalNeeds: z.object({
      protein: z.string(),
      carbs: z.string(),
      fats: z.string(),
      calories: z.string(),
    }),
    dietaryContext: z.object({
      mealType: z.string(),
      timing: z.string(),
      restrictions: z.array(z.string()),
    }),
  }),
  recommendations: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      macros: z.object({
        protein: z.string(),
        carbs: z.string(),
        fats: z.string(),
        calories: z.string(),
      }),
      ingredients: z.array(z.string()),
      preparation: z.string(),
      mealTiming: z.string(),
      fitnessBenefits: z.array(z.string()),
    })
  ),
  explanation: z.string(),
});

const outputParser = new JsonOutputParser<typeof responseSchema.shape>();

const promptTemplate =
  PromptTemplate.fromTemplate(`You are a fitness and nutrition expert AI assistant. Generate detailed food recommendations based on the user's fitness and dietary needs.

User Query: {query}

You must respond with a JSON object that exactly matches this structure:
{{
  "analysis": {{
    "fitnessGoals": ["list of identified fitness goals"],
    "nutritionalNeeds": {{
      "protein": "protein requirements",
      "carbs": "carb requirements",
      "fats": "fat requirements",
      "calories": "calorie requirements"
    }},
    "dietaryContext": {{
      "mealType": "breakfast/lunch/dinner/snack",
      "timing": "pre/post workout, morning, evening, etc",
      "restrictions": ["any dietary restrictions identified"]
    }}
  }},
  "recommendations": [
    {{
      "name": "meal name",
      "description": "detailed description",
      "macros": {{
        "protein": "protein content",
        "carbs": "carb content",
        "fats": "fat content",
        "calories": "calorie content"
      }},
      "ingredients": ["list of ingredients"],
      "preparation": "brief preparation instructions",
      "mealTiming": "when to consume",
      "fitnessBenefits": ["specific fitness benefits"]
    }}
  ],
  "explanation": "explanation of recommendations and how they meet the user's needs"
}}

{format_instructions}

Important:
- Provide EXACTLY 2-3 recommendations
- Focus on practical, achievable meals
- Include specific portion sizes and macros
- Consider meal timing in relation to workouts
- Ensure all responses are in valid JSON format
- Do not include any additional text outside the JSON structure`);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = requestSchema.parse(body);

    const model = new ChatOpenAI({
      modelName: "gpt-4",
      temperature: 0.2,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const formattedPrompt = await promptTemplate.format({
      query,
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
    console.error("Error processing fitness recommendation:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
