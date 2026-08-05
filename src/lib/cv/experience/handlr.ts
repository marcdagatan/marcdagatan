import type { CvExperience } from "../types";

/** Handlr CTO record, maintained separately to keep the core CV data readable. */
export const HANDLR_EXPERIENCE = {
  id: "handlr",
  company: "Handlr",
  role: "Chief Technology Officer (CTO)",
  start: "2025-09",
  generalSummary:
    "Own the technical architecture, delivery, and operations of Handlr, a multi-sided service-booking platform, while remaining hands-on across the stack.",
  generalAccomplishments: [
    "Architected a platform with four product surfaces—customer web, partner portal, admin dashboard, and a service-provider mobile application—supported by shared API, database, UI, and configuration packages.",
    "Designed the marketplace's core service-discovery, provider approval, availability, booking, assignment, pricing, review, voucher, and loyalty workflows, including ledger-style transaction records.",
    "Built financial correctness into the payment flow through PayMongo hosted checkout, webhook-driven payment state transitions, integer-centavo monetary values, and a separation between payment confirmation and booking fulfillment.",
    "Delivered shared web and mobile foundations that keep Next.js and Expo clients aligned on the same server contracts, UI primitives, and business rules.",
    "Owned developer operations and technical direction from Docker-based environments through CI/CD deployment, database workflows, quality gates, reliability, security, and architecture trade-offs.",
  ],
  summary:
    "Own the technical architecture, delivery, and operations of Handlr, a multi-sided service-booking platform. Remain a hands-on engineer: write production code across the stack, lead major refactors, and make the architectural decisions that shape the product and its operating model.",
  accomplishments: [
    "Architected a TypeScript Nx monorepo with four product surfaces—customer web, partner portal, admin dashboard, and a service-provider mobile application—plus shared API, database, UI, and configuration packages.",
    "Established the API package as the type-safe contract boundary: tRPC routers provide end-to-end type inference to Next.js and Expo clients, while Zod schemas validate external input before domain logic or persistence.",
    "Designed JWT authentication and role-aware authorization for customer, partner, organizer, provider, and administrator workflows, enforcing platform-specific server procedures rather than client-side permission checks.",
    "Designed and implemented service discovery, organization and provider approval, availability, booking and provider-assignment lifecycles, package pricing, add-ons, reviews, notifications, vouchers, loyalty tiers, points wallets, and ledger-style transaction records.",
    "Integrated PayMongo hosted checkout and webhook-driven payment state transitions; retained monetary values as integer centavos and separated payment confirmation from booking fulfillment to protect financial correctness.",
    "Led PostgreSQL data modeling and Prisma migration work, including safe schema evolution and explicit boundaries for payment, booking, and loyalty data.",
    "Built shared React UI primitives and Tailwind design tokens for the web products, moving reusable behavior and visual rules into packages rather than maintaining application-specific copies.",
    "Delivered the Expo and React Native service-provider application while reusing platform API types and business rules to keep web and mobile clients aligned.",
    "Contributed production code across API, database, frontend, mobile, and infrastructure layers, leading refactors that reduce duplication and clarify monorepo package boundaries.",
    "Designed multi-stage, least-privilege Docker images for Node.js services, generating Prisma clients at build time and running production containers as an unprivileged user.",
    "Implemented branch-aware CI/CD with GitHub Actions, GitHub Container Registry, and Coolify to build, tag, and deploy four application images across development, staging, and production.",
    "Set standards for strict TypeScript, typed API boundaries, structured errors and logs, migration-led schema changes, Jest and Testing Library coverage, and Nx lint, type-check, test, and build gates.",
  ],
  stack: [
    "TypeScript",
    "Nx",
    "Next.js",
    "React",
    "React Native",
    "Expo",
    "Fastify",
    "tRPC",
    "Zod",
    "Prisma",
    "PostgreSQL",
    "Redis",
    "Docker",
    "GitHub Actions",
    "Coolify",
    "PayMongo",
  ],
} satisfies CvExperience;
