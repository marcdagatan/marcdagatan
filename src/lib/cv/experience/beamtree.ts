import type { CvExperience } from "../types";

/** Beamtree clinical-audit and healthcare-analytics engineering record. */
export const BEAMTREE_EXPERIENCE = {
  id: "beamtree",
  company: "Beamtree",
  role: "Senior Full-Stack Software Engineer",
  start: "2023-12",
  location: "AUS",
  generalSummary:
    "Senior full-stack engineer across Beamtree's PICQ clinical-audit platform and RISQ healthcare-analytics products, with end-to-end ownership of platform modernization, product delivery, and delivery quality.",
  generalAccomplishments: [
    "Rebuilt PICQ Analyser V2 as a Ruby clinical-indicator query language used by both PICQ and RISQ, replacing the legacy C implementation; introduced validation, error reporting, and caching that reduced repeated analysis processing time by 72%.",
    "Replatformed PICQ's legacy clinical-audit experience as a modern React and TypeScript application, delivering the core audit and episode workflow with frontend testing and CI coverage.",
    "Designed a governed audit-deletion and replacement lifecycle with history and retention safeguards for clinical data, while resolving a staging-blocking bulk-operation performance issue.",
    "Delivered RISQ hospital-analytics products: peer-comparison ratios, trend insights, and the executive Client Impact Scorecard, with live hospital data and peer benchmarks.",
    "Established a reusable visualization platform to replace bespoke charts with a consistent, accessible system shared across products.",
    "Delivered the DRG Custom Audit product and migrated the six-tab Provider Feedback report to the new audit-workflow model.",
    "Built secure cross-system integrations and clinical-data interoperability, including 3,907 IHACPA MBS-to-ACHI mappings; co-delivered Ruby and Rails modernization while improving security and data-intensive analysis performance.",
  ],
  summary:
    "Senior full-stack engineer working across Beamtree's PICQ clinical-audit platform and RISQ healthcare-analytics products, including the PICQ Analyser V2 clinical-indicator query language, with end-to-end ownership of modernization, reporting, integrations, performance, security, and delivery quality.",
  accomplishments: [
    "Rewrote PICQ Analyser V2 from the legacy C implementation as a Ruby clinical-indicator query language used by both PICQ and RISQ: defined a Parslet grammar for numerator and denominator selectors, transformed parse trees into typed ASTs, and built a modular evaluator for comparisons, boolean logic, ranges, lists, code selectors, and domain operators such as COUNT, FIRST, NEXT TO, AFTER, BEFORE, FOLLOWING, WITH, WITH COF, IN_CLUSTER, and UNIQUE.",
    "Built the analyser's validation and error-reporting layer, code-extraction tooling, and versioned Redis AST cache with batch fetch/store operations, so repeated selectors are validated, parsed, transformed, and evaluated once rather than repeatedly; cache pre-warming and batching reduced processing time by 72%.",
    "Replatformed PICQ's legacy jQuery and DataTables clinical-audit screens as a React, TypeScript, Tailwind, shadcn, and Radix application, delivering audit and episode lists, assignment, filtering, search, sorting, pagination, bulk actions, role-aware controls, frontend testing, and CI coverage.",
    "Designed a governed audit-deletion and replacement lifecycle with justified soft deletion, deleted-record history, replacement episode selection, retention cleanup, and safeguards for audit eligibility and completed episodes; removed a staging-blocking bulk-operation bottleneck through transactions, batch writes, composite indexes, and query restructuring.",
    "Delivered RISQ healthcare analytics, including HAC Ratio Peer Comparison and HAC/COF Trend Detailed Insights with live hospital ratios, peer benchmarks, clinical filters, financial-year logic, interactive charts and tables, and PNG or Excel export; resolved domain-correctness issues across financial years, hospital hierarchies, denominators, targets, and indicator grouping.",
    "Created the executive RISQ Client Impact Scorecard, aggregating adoption, quality and risk outcomes, financial impact, historical trends, and opportunity data across organisation hierarchies, clinical involvement, indicators, audit activity, and previous-period comparisons; implemented its PDF output with direct jsPDF primitives.",
    "Established PICQ's reusable visualization platform with React on Rails, ECharts, Ruby chart builders, shared themes, caching, responsive rendering, accessibility defaults, downloads, and reusable React chart components, creating a consistent replacement path for bespoke D3 charts.",
    "Delivered the DRG Custom Audit product with complex episode filtering, DRG-version rules, permissions, description lookup, result selection, JSON and Excel reporting, and extensive RSpec coverage; migrated the six-tab Provider Feedback report to the new audit-workflow model while retaining scoring, DRC accuracy, financial impact, DRG comparison, and code-level reporting.",
    "Built secure cross-system integrations with Keycloak/JWT authentication that derives organisation context dynamically, Protobuf acknowledgement contracts and RabbitMQ publishing, and asynchronous PICQ quality-data export to an external SQL Server integration database; added 3,907 IHACPA MBS-to-ACHI mappings and backward-compatible MBS ingestion contracts.",
    "Co-delivered Ruby 2.7 to 3.2 and Rails 6.1 to 7.1 modernization, strengthened CSP and SAST controls by removing unsafe JavaScript, `eval`, selector-injection, XSS, and ReDoS patterns, and improved data-intensive analysis with batching, caching, memoization, indexes, New Relic tracing, and ClickHouse organisation partitioning.",
  ],
  stack: ["Ruby on Rails", "React", "TypeScript", "Parslet", "Redis", "PostgreSQL", "ClickHouse", "ECharts", "RabbitMQ", "AWS"],
} satisfies CvExperience;
