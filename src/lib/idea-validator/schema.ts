import { z } from "zod";

export const ideaValidatorInputSchema = z.object({
  ideaName: z.string().min(1, "Idea name is required"),
  problemStatement: z.string().min(1, "Problem statement is required"),
  solutionDescription: z.string().min(1, "Solution description is required"),
  targetUsers: z.string().min(1, "Target users are required"),
  techPreferences: z.string().optional().default(""),
});

export type IdeaValidatorInput = z.infer<typeof ideaValidatorInputSchema>;

export interface IdeaValidatorResult {
  overallScore: number;
  innovationScore: number;
  feasibilityScore: number;
  problemSolutionFitScore: number;
  competitionAnalysis: string;
  strengths: string[];
  risksAndGaps: string[];
  suggestedFeatures: string[];
  recommendedTechStack: string[];
  aiSummary: string;
}

export const ideaValidatorResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  innovationScore: z.number().min(0).max(100),
  feasibilityScore: z.number().min(0).max(100),
  problemSolutionFitScore: z.number().min(0).max(100),
  competitionAnalysis: z.string().min(1),
  strengths: z.array(z.string()).min(1),
  risksAndGaps: z.array(z.string()).min(1),
  suggestedFeatures: z.array(z.string()).min(1),
  recommendedTechStack: z.array(z.string()).min(1),
  aiSummary: z.string().min(1),
});
