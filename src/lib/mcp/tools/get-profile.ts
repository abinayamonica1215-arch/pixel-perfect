import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_profile",
  title: "Get my profile",
  description: "Read the signed-in user's Elevora profile (name, college, skills, links, bio).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_args, ctx) => {
    const sb = supabaseForUser(ctx);
    const { data, error } = await sb
      .from("profiles")
      .select("full_name, college, skills, github_url, portfolio_url, bio")
      .eq("user_id", ctx.getUserId()!)
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const profile = {
      email: ctx.getUserEmail() ?? "",
      full_name: data?.full_name ?? "",
      college: data?.college ?? "",
      skills: data?.skills ?? "",
      github_url: data?.github_url ?? "",
      portfolio_url: data?.portfolio_url ?? "",
      bio: data?.bio ?? "",
    };
    return { content: [{ type: "text", text: JSON.stringify(profile) }], structuredContent: { profile } };
  },
});
