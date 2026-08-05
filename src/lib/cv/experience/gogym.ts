import type { CvExperience } from "../types";

/** GoGym technology leadership record, maintained separately from the core CV. */
export const GOGYM_EXPERIENCE = {
  id: "gogym",
  company: "GoGym",
  role: "Technology & Engineering Lead / Chief Technology Officer",
  start: "2025",
  location: "Philippines",
  generalSummary:
    "Hands-on technology leader modernizing GoGym's fitness and franchise-management ecosystem; appointed Chief Technology Officer in October 2025.",
  generalAccomplishments: [
    "Led GoGym's transition from Xano and FlutterFlow to an owned Ruby on Rails, Next.js, and Flutter platform spanning internal operations, franchise management, and member and coach experiences.",
    "Recovered an inherited Xano migration that had no usable migration code and unreliable staging data, then rebuilt a five-phase, reconciliation-ready process for approximately 24,000 users, 33,000 subscriptions, 100,000 access records, and 6,000 coach bookings.",
    "Built the multi-tenant membership, pricing, voucher, refund, wallet, QR-access, assessment, class, booking, sales, support, and notification capabilities needed to operate a national fitness and franchise business.",
    "Implemented a reliable Xendit payment lifecycle with hosted checkout, webhooks, recurring billing, refunds, vouchers, GoCoin top-ups, idempotency, and safeguards for asynchronous or duplicate-payment scenarios.",
    "Established authorization, organization scoping, and separate mobile and dashboard authentication boundaries so franchise owners, staff, coaches, members, and internal teams see only the right operational and financial data.",
    "Delivered franchisee and executive reporting, mobile reliability improvements, quality controls, staged releases, and operational tooling while correcting early tenancy, RBAC, and authentication decisions.",
  ],
  summary:
    "Hands-on CTO leading GoGym's modernization from a Xano backend and FlutterFlow application into a custom Rails, Next.js, and Flutter platform. Combine technical strategy with delivery across APIs, data migration, authorization, payments, operational tooling, dashboards, mobile reliability, and release processes.",
  accomplishments: [
    "Directed the migration from Xano and FlutterFlow to a multi-product ecosystem: a Ruby on Rails API and admin back office, a Next.js franchisee dashboard, and a Flutter application for members and coaches.",
    "Established Rails 8 as the system of record with a versioned REST API for web and mobile clients, while retaining a separate Turbo, Stimulus, Bootstrap, and ERB back office for internal operations.",
    "Designed the backend around Ruby service objects, PostgreSQL relational models, Redis, Sidekiq and Scheduler, Blueprinter serializers, feature flags, audit trails, and Rswag request specifications that generate explicit API contracts.",
    "Recovered an inherited Xano migration delivered without usable migration code and with a staging database containing missing records and broken associations; rebuilt five-phase tooling for infrastructure, user accounts and profiles, subscriptions and transactions, activity history, and cleanup and reconciliation.",
    "Built imports with field-level mappings, batching, multi-threading, progress and error logs, connection-pool awareness, validation, and graceful handling of incomplete source data; reconstructed normalized subscriptions and transactions, and split complex source-user data into user, profile, address, assessment, wallet, image, and metadata records with references retained for reconciliation and support.",
    "Built memberships, tiered package and location pricing, vouchers, refunds, cash reconciliation, GoCoin wallet transactions, QR gym access, assessments, programs, classes, PT booking, leads, support tickets, and notifications.",
    "Integrated Xendit hosted payment links, webhooks, recurring billing, refunds, cash payments, vouchers, and GoCoin top-ups with idempotency and payment-lifecycle safeguards.",
    "Implemented fine-grained Pundit authorization for admins, franchise owners, location staff, and coaches through roles, assignments, capabilities, policies, database constraints, organization scoping, API checks, and regression tests.",
    "Designed separate Firebase-token and Rails-issued JWT authentication boundaries for mobile and dashboard clients, including secure refresh and organization selection for multi-location operations.",
    "Delivered franchisee and executive workflows for per-gym and cross-location analytics, revenue and member reporting, leads, sales funnels, staff and location configuration, support-ticket SLAs, task management, and financial and operational dashboards.",
    "Built the Next.js 15 dashboard with TypeScript, App Router, TanStack Query, Zustand, Zod-backed forms, shadcn/ui, Tailwind, Recharts, and PDF/XLSX exports; contributed Rails APIs, migrations, request and service specs, TypeScript clients and hooks, and Flutter authentication and reliability fixes.",
    "Structured Flutter as a Dart workspace with shared core utilities, data sources, and domain models; delivered Firebase authentication, Google and Apple sign-in, messaging, Crashlytics, analytics, secure storage, QR scanning, maps, hosted payments, and Shorebird over-the-air updates.",
    "Corrected early task-tenancy, RBAC, token-refresh, and Firebase-dependent authentication issues, then introduced RSpec, FactoryBot, RuboCop, Brakeman, dependency auditing, OpenAPI generation, Jest thresholds, Flutter tests, Sentry and Crashlytics visibility, feature flags, and staged releases.",
    "Supported Dockerized Rails, PostgreSQL and Redis operations, GCP and Coolify deployments, GitHub Container Registry images, Codemagic mobile builds, app-store delivery, and Shorebird OTA releases.",
  ],
  stack: [
    "Ruby on Rails 8",
    "Next.js",
    "Flutter",
    "PostgreSQL",
    "Redis",
    "Sidekiq",
    "Pundit",
    "Xendit",
    "Firebase",
    "Docker",
    "GCP",
    "Coolify",
    "Sentry",
    "Shorebird",
  ],
} satisfies CvExperience;
