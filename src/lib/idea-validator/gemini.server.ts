import { ideaValidatorResultSchema, type IdeaValidatorInput, type IdeaValidatorResult } from "./schema";

const GEMINI_MODEL = "gemini-2.0-flash";

function buildPrompt(input: IdeaValidatorInput): string {
  const techLine = input.techPreferences
    ? `Technology preferences: ${input.techPreferences}`
    : "Technology preferences: None specified";

  return `You are an expert startup and hackathon idea analyst. Analyze the following project idea and return a detailed, objective validation report.

Project / Idea Name: ${input.ideaName}
Problem Statement: ${input.problemStatement}
Solution Description: ${input.solutionDescription}
Target Users: ${input.targetUsers}
${techLine}

Evaluate this idea across these dimensions:
- Innovation: how original and differentiated it is
- Feasibility: how realistic it is to build with current technology
- Problem-Solution Fit: whether the solution truly addresses the stated problem
- Competition: existing alternatives and competitive landscape
- Strengths: key advantages
- Risks / Gaps: potential weaknesses and blind spots
- Suggested Features: features worth adding to strengthen the product
- Recommended Tech Stack: technologies that fit this project
- Overall assessment and verdict

Return ONLY a JSON object with this exact structure, no markdown fences, no commentary:
{
  "overallScore": <number 0-100>,
  "innovationScore": <number 0-100>,
  "feasibilityScore": <number 0-100>,
  "problemSolutionFitScore": <number 0-100>,
  "competitionAnalysis": "<string: competitive landscape and differentiators>",
  "strengths": ["<string>", ...],
  "risksAndGaps": ["<string>", ...],
  "suggestedFeatures": ["<string>", ...],
  "recommendedTechStack": ["<string>", ...],
  "aiSummary": "<string: comprehensive summary and verdict>"
}

Scores must reflect the actual quality of the submitted idea. Be honest and critical — do not inflate scores.`;
}

function extractJson(text: string): unknown {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  }
  return JSON.parse(cleaned);
}

export async function validateIdeaWithGemini(input: IdeaValidatorInput): Promise<IdeaValidatorResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not configured. Set GEMINI_API_KEY in the environment.");
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(input) }] }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`Gemini API request failed (${response.status}): ${errorBody.slice(0, 200)}`);
  }

  const data = await response.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  let parsed: unknown;
  try {
    parsed = extractJson(text);
  } catch {
    throw new Error("Gemini response was not valid JSON.");
  }

  const result = ideaValidatorResultSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error("Gemini response did not match the expected structure.");
  }

  return result.data;
}
