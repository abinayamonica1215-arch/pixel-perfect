import { createServerFn } from "@tanstack/react-start";
import { ideaValidatorInputSchema } from "./schema";
import { validateIdeaWithGemini } from "./gemini.server";

export const validateIdea = createServerFn({ method: "POST" })
  .validator(ideaValidatorInputSchema)
  .handler(async ({ data }) => {
    try {
      const result = await validateIdeaWithGemini(data);
      return { ok: true as const, result };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred during validation.";
      return { ok: false as const, error: message };
    }
  });
