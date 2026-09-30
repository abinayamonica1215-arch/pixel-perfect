import { serve } from "jsr:@std/http@1";

const GEMINI_MODEL = "gemini-2.0-flash";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ValidateIdeaInput {
  ideaName: string;
  problemStatement: string;
  solutionDescription: string;
  targetUsers: string;
  techPreferences: string;
}

function buildPrompt(input: ValidateIdeaInput): string {
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

const resultSchema = {
  overallScore: "number",
  innovationScore: "number",
  feasibilityScore: "number",
  problemSolutionFitScore: "number",
  competitionAnalysis: "string",
  strengths: "array",
  risksAndGaps: "array",
  suggestedFeatures: "array",
  recommendedTechStack: "array",
  aiSummary: "string",
};

function validateResult(data: unknown): boolean {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  for (const [key, type] of Object.entries(resultSchema)) {
    if (!(key in obj)) return false;
    if (type === "array") {
      if (!Array.isArray(obj[key])) return false;
    } else if (typeof obj[key] !== type) {
      return false;
    }
  }
  return true;
}

async function handleRequest(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const input = (await req.json()) as ValidateIdeaInput;

    if (!input.ideaName || !input.problemStatement || !input.solutionDescription || !input.targetUsers) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not configured in edge function secrets");
      return new Response(JSON.stringify({ error: "Gemini API key is not configured on the server." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(endpoint, {
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

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text().catch(() => "");
      console.error(`Gemini API error (${geminiResponse.status}): ${errorBody.slice(0, 500)}`);
      return new Response(
        JSON.stringify({ error: `Gemini API request failed (${geminiResponse.status}).` }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const data = await geminiResponse.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return new Response(JSON.stringify({ error: "Gemini returned an empty response." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let parsed: unknown;
    try {
      parsed = extractJson(text);
    } catch {
      return new Response(JSON.stringify({ error: "Gemini response was not valid JSON." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!validateResult(parsed)) {
      return new Response(JSON.stringify({ error: "Gemini response did not match the expected structure." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, result: parsed }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error(`Edge function error: ${message}`);
    return new Response(JSON.stringify({ error: "An unexpected error occurred during validation." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}

serve(handleRequest);
