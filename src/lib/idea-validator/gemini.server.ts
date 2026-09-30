import { ideaValidatorResultSchema, type IdeaValidatorInput, type IdeaValidatorResult } from "./schema";

interface EdgeFunctionSuccess {
  ok: true;
  result: IdeaValidatorResult;
}

interface EdgeFunctionError {
  ok: false;
  error: string;
}

type EdgeFunctionResponse = EdgeFunctionSuccess | EdgeFunctionError;

export async function validateIdeaWithGemini(input: IdeaValidatorInput): Promise<IdeaValidatorResult> {
  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error("Server is not configured correctly (missing Supabase URL).");
  }

  const endpoint = `${supabaseUrl}/functions/v1/validate-idea`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    let message = `Validation service request failed (${response.status}).`;
    try {
      const body = (await response.json()) as EdgeFunctionError;
      if (body?.error) message = body.error;
    } catch {
      // response wasn't JSON; keep the generic message
    }
    throw new Error(message);
  }

  const body = (await response.json()) as EdgeFunctionResponse;
  if (!body.ok) {
    throw new Error(body.error || "Validation service returned an error.");
  }

  const result = ideaValidatorResultSchema.safeParse(body.result);
  if (!result.success) {
    throw new Error("Validation service returned data in an unexpected format.");
  }

  return result.data;
}
