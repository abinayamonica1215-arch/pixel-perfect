import {
  LayoutDashboard, Trophy, Lightbulb, FolderKanban, Users, GraduationCap,
  BookOpen, Presentation, User, Settings, type LucideIcon,
} from "lucide-react";

export type NavItem = { title: string; to: string; icon: LucideIcon };
export const navSections: { label: string; items: NavItem[] }[] = [
  { label: "Main", items: [
    { title: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { title: "Hackathon Explorer", to: "/hackathons", icon: Trophy },
    { title: "AI Idea Validator", to: "/idea-validator", icon: Lightbulb },
    { title: "My Projects", to: "/projects", icon: FolderKanban },
  ]},
  { label: "Collaboration", items: [
    { title: "Smart Team Builder", to: "/team-builder", icon: Users },
    { title: "Mentor Marketplace", to: "/mentors", icon: GraduationCap },
  ]},
  { label: "Preparation", items: [
    { title: "Learning Hub", to: "/learning", icon: BookOpen },
    { title: "AI Demo Coach", to: "/demo-coach", icon: Presentation },
  ]},
  { label: "Account", items: [
    { title: "Profile", to: "/profile", icon: User },
    { title: "Settings", to: "/settings", icon: Settings },
  ]},
];
