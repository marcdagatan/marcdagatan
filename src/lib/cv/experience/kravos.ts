import type { CvExperience } from "../types";

/** Public-safe Kravos AI founder record, excluding proprietary implementation details. */
export const KRAVOS_EXPERIENCE = {
  id: "kravos-ai",
  company: "Kravos AI",
  role: "Founder & CEO / Technical Founder",
  start: "2026-02",
  generalSummary:
    "Founder and technical executive building an AI agent operations platform from concept to production readiness across product strategy, engineering, commercial systems, and launch preparation.",
  generalAccomplishments: [
    "Founded Kravos AI and led company strategy, product direction, technical execution, and commercial readiness from the initial concept to a production-ready platform.",
    "Built a unified product for agent knowledge, reusable behaviors, approved actions, delivery channels, analytics, and human handoff, avoiding a patchwork of separate systems.",
    "Delivered both managed product experiences and developer-facing interfaces so teams can adopt the platform through a hosted workspace, embedded experiences, or programmatic access.",
    "Established organizational controls for workspace isolation, role-based permissions, usage governance, auditability, administrative oversight, and secure integration management.",
    "Set the engineering standard for reliable, concurrent, long-running AI workloads, commercial operations, quality verification, release checks, operational visibility, and systematic failure handling.",
  ],
  summary:
    "Kravos AI is an AI agent operations platform that enables teams to design, deploy, and manage customer-facing and internal AI agents across digital channels. Lead company strategy, product direction, technical execution, and commercial readiness as both founder and hands-on technical executive.",
  accomplishments: [
    "Designed and built the product end to end, from customer problem discovery and product definition through implementation, quality assurance, operations, and launch preparation.",
    "Created a unified environment for agent knowledge, reusable behaviors, approved actions, delivery channels, analytics, and human handoff without requiring teams to assemble separate systems.",
    "Delivered managed product experiences and developer-facing interfaces for hosted workspaces, embedded experiences, and direct programmatic access.",
    "Built controls for organizational use, including workspace isolation, role-based permissions, usage governance, auditability, administrative oversight, and secure integration management.",
    "Engineered for continuous and concurrent machine use, including long-running work, streaming interactions, retries, duplicate requests, partial failures, and safe recovery.",
    "Developed the commercial operating layer for plans, subscriptions, usage measurement, credits, cost visibility, and platform-wide policy management.",
    "Established strict type safety, automated verification, release checks, operational visibility, clear documentation, and systematic failure handling as engineering standards.",
    "Combined CEO and technical-founder responsibilities across company strategy, market positioning, customer discovery, roadmap ownership, user experience, engineering, and commercial execution.",
  ],
  stack: [
    "AI agent systems",
    "Multi-workspace platforms",
    "Knowledge-grounded AI",
    "APIs & SDKs",
    "Real-time experiences",
    "Identity & governance",
    "Reliability & observability",
  ],
} satisfies CvExperience;
