import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

const url = z.string().trim().max(300).refine((v) => v === "" || /^https?:\/\//i.test(v), "Must be an http(s) URL");

export default defineTool({
  name: "update_profile",
  title: "Update my profile",
  description: "Update fields on the signed-in user's Elevora profile; omitted fields stay unchanged.",
  inputSchema: {
    full_name: z.string().trim().max(100).optional().describe("Full name"),
    college: z.string().trim().max(150).optional().describe("College or university"),
    skills: z.string().trim().max(500).optional().describe("Comma-separated skills"),
    github_url: url.optional().describe("GitHub profile URL"),
    portfolio_url: url.optional().describe("Portfolio URL"),
    bio: z.string().trim().max(1000).optional().describe("Short bio"),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async (input, ctx) => {
    const sb = supabaseForUser(ctx);
    const patch = Object.fromEntries(Object.entries(input).filter(([, v]) => v !== undefined));
    const { error } = await sb
      .from("profiles")
      .upsert({ user_id: ctx.getUserId()!, ...patch }, { onConflict: "user_id" });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: "Profile updated." }] };
  },
});
