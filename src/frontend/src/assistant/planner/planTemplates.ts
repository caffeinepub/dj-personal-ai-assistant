/**
 * Plan Templates
 *
 * Curated goal-to-step templates for common user goals.
 * Each template has keywords for matching and concrete actionable steps.
 */

import type { PlanStep } from "./planTypes";

export interface PlanTemplate {
  name: string;
  keywords: string[];
  steps: Omit<PlanStep, "id" | "status">[];
}

export const PLAN_TEMPLATES: PlanTemplate[] = [
  {
    name: "Learn Networking",
    keywords: [
      "learn networking",
      "networking",
      "network fundamentals",
      "computer networking",
    ],
    steps: [
      { description: "Study networking fundamentals (OSI model, TCP/IP)" },
      { description: "Learn IP addressing, subnets, and DNS" },
      { description: "Practice configuring routers and switches" },
      {
        description:
          "Build a small virtual network lab (GNS3 or Packet Tracer)",
      },
      {
        description: "Review security concepts: firewalls, VPNs, and protocols",
      },
      {
        description:
          "Prepare for a networking certification (e.g. CompTIA Network+)",
      },
    ],
  },
  {
    name: "Build a Website",
    keywords: [
      "build a website",
      "create website",
      "website",
      "web project",
      "build website",
    ],
    steps: [
      { description: "Define the website purpose, audience, and key pages" },
      { description: "Choose a tech stack (HTML/CSS, React, WordPress, etc.)" },
      { description: "Design wireframes or mockups for each page" },
      { description: "Develop the frontend layout and content" },
      { description: "Set up hosting and deploy the website" },
      { description: "Test on mobile and desktop, then launch" },
    ],
  },
  {
    name: "Improve Personal Finance",
    keywords: [
      "improve finance",
      "personal finance",
      "save money",
      "budget",
      "financial goals",
      "money management",
    ],
    steps: [
      { description: "Track all current income and monthly expenses" },
      { description: "Identify and cut unnecessary recurring costs" },
      { description: "Create a monthly budget with savings targets" },
      { description: "Set up an emergency fund (3–6 months of expenses)" },
      { description: "Research and start an investment strategy" },
      { description: "Review progress monthly and adjust the budget" },
    ],
  },
  {
    name: "Start a Fitness Routine",
    keywords: [
      "fitness",
      "exercise",
      "workout",
      "get fit",
      "lose weight",
      "health routine",
      "gym",
    ],
    steps: [
      {
        description:
          "Set a specific fitness goal (weight, strength, endurance)",
      },
      {
        description: "Choose a workout type: cardio, strength, yoga, or mixed",
      },
      { description: "Create a weekly workout schedule (3–5 days)" },
      { description: "Track meals and ensure proper nutrition" },
      { description: "Complete the first two weeks consistently" },
      { description: "Review progress and adjust intensity or schedule" },
    ],
  },
  {
    name: "Launch a Personal Project",
    keywords: [
      "personal project",
      "launch project",
      "start project",
      "side project",
      "my project",
    ],
    steps: [
      { description: "Define the project scope, goals, and success criteria" },
      {
        description: "Research similar projects and identify your unique angle",
      },
      { description: "Create a project roadmap with milestones" },
      { description: "Build the first MVP or prototype" },
      { description: "Get feedback from 3–5 potential users" },
      { description: "Iterate based on feedback and officially launch" },
    ],
  },
  {
    name: "Learn Programming",
    keywords: [
      "learn programming",
      "learn coding",
      "learn python",
      "learn javascript",
      "coding",
      "software development",
    ],
    steps: [
      {
        description:
          "Choose a language to start with (Python or JavaScript recommended)",
      },
      { description: "Complete a beginner course or tutorial series" },
      {
        description:
          "Practice daily with small coding challenges (LeetCode, HackerRank)",
      },
      { description: "Build a simple personal project from scratch" },
      { description: "Learn version control with Git and GitHub" },
      {
        description:
          "Explore a framework (Django, React, etc.) relevant to your goals",
      },
    ],
  },
  {
    name: "Build a Mobile App",
    keywords: [
      "mobile app",
      "build app",
      "create app",
      "android app",
      "ios app",
      "app development",
    ],
    steps: [
      {
        description: "Define the app concept, core features, and target users",
      },
      { description: "Choose a platform: React Native, Flutter, or native" },
      { description: "Design UI/UX wireframes for key screens" },
      { description: "Build the core feature set with a working demo" },
      { description: "Test on both Android and iOS devices" },
      { description: "Publish to the App Store and/or Google Play" },
    ],
  },
  {
    name: "Improve Productivity",
    keywords: [
      "productivity",
      "time management",
      "be more productive",
      "organize",
      "work efficiency",
      "focus",
    ],
    steps: [
      { description: "Audit how you currently spend your time for one week" },
      {
        description: "Identify your top 3 time-wasting habits or distractions",
      },
      {
        description:
          "Choose a task management system (GTD, time-blocking, etc.)",
      },
      { description: "Set daily priorities using the 1-3-5 rule each morning" },
      { description: "Create a focused work schedule with break intervals" },
      { description: "Review and refine your system every Sunday" },
    ],
  },
];

/**
 * Find the best matching template for a goal string.
 * Returns the template or null if no keyword match is found.
 */
export function findMatchingTemplate(goal: string): PlanTemplate | null {
  const lower = goal.toLowerCase();
  let bestMatch: PlanTemplate | null = null;
  let bestScore = 0;

  for (const template of PLAN_TEMPLATES) {
    for (const keyword of template.keywords) {
      if (lower.includes(keyword)) {
        const score = keyword.length;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = template;
        }
      }
    }
  }

  return bestMatch;
}
