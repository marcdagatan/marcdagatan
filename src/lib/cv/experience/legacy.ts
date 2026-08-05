import type { CvExperience } from "../types";

/** Earlier product-engineering roles, ordered from most to least recent. */
export const LEGACY_EXPERIENCE = [
  {
    id: "microblink",
    company: "Microblink",
    role: "Senior Full-Stack Software Engineer (Tech Lead)",
    start: "2022-01",
    end: "2023-09",
    location: "NY USA",
    generalSummary:
      "Technical lead for Product Recognition (BlinkShelf), coordinating the systems, data, and teams behind a product-recognition ecosystem for mobile applications.",
    generalAccomplishments: [
      "Led multiple teams and initiatives that established the Product Recognition platform across mobile SDKs, product data, authentication, and machine-learning services.",
      "Architected the relational data systems and service boundaries supporting the platform, and led code review and refactoring across the ecosystem.",
      "Set Rails and React engineering standards and introduced a team workflow later adopted by other teams.",
    ],
    summary:
      "Led teams and technical initiatives behind Product Recognition (BlinkShelf), an ecosystem that connected ML services, mobile SDKs, product data, and internal operations.",
    accomplishments: [
      "Led the Ruby on Rails API that stitched together AI and ML microservices, promotions, product information, reviews, and dietary data for iOS and Android SDKs.",
      "Led the authentication service for the API, mobile SDKs, and other Product Recognition services using Ruby on Rails and Next.js.",
      "Built the Node.js collections-management service that aligned product data across databases and managed the Milvus vector database used by ML and AI services.",
      "Established Rails and React engineering standards and a team workflow later adopted by other teams; architected relational data systems and led code review and refactoring.",
    ],
    stack: ["Ruby on Rails", "React", "NextJS", "Node JS", "Milvus"],
  },
  {
    id: "reinteractive",
    company: "Reinteractive",
    role: "Senior Developer",
    start: "2021-02",
    end: "2021-09",
    location: "AUS",
    generalSummary:
      "Senior developer across a Learning Management Platform modernization and a venue marketplace product.",
    generalAccomplishments: [
      "Led a difficult Rails upgrade for a poorly maintained Learning Management Platform, establishing its first feature and system test coverage.",
      "Resolved performance and maintainability problems across background jobs, deprecated dependencies, and platform calculations.",
    ],
    summary:
      "Worked across a difficult Learning Management Platform upgrade and a venue marketplace based on a Sharetribe fork.",
    accomplishments: [
      "Handled a complex Rails 4.1 to 5.2 upgrade for a poorly maintained Learning Management Platform.",
      "Created the application's first feature and system specs, then refactored deprecated gems and Ruby on Rails features.",
      "Diagnosed and fixed background-job problems that had made the platform slow.",
      "Refactored venue-marketplace calculations into DRY service objects and proposed practical solutions for product and engineering issues.",
    ],
    stack: ["Ruby on Rails", "RSpec"],
  },
  {
    id: "tsekasia",
    company: "TsekAsia",
    role: "Technical Co-Founder and CTO",
    start: "2019-04",
    end: "2020-12",
    location: "Baguio PH",
    generalSummary:
      "Technical co-founder responsible for the Tsekpay payroll product, its platform infrastructure, and the engineering team delivering it.",
    generalAccomplishments: [
      "Designed and delivered the Tsekpay MVP as a full-stack payroll product, then led the refactoring and re-engineering identified during its Alpha stage.",
      "Established and operated development, staging, and production environments across AWS and Netlify.",
      "Trained and led the engineering team around test-driven development, documentation, and peer code review.",
    ],
    summary:
      "Co-founded the company and took responsibility for the Tsekpay payroll product, its technical direction, infrastructure, and engineering team.",
    accomplishments: [
      "Engineered, designed, and developed the Tsekpay MVP as a Ruby on Rails API with PostgreSQL and a React single-page application.",
      "Led the refactoring and re-engineering work identified during the Alpha stage.",
      "Set up, deployed, and maintained development, staging, and production environments across AWS and Netlify.",
      "Trained and led the engineering team, enforcing test-driven development with RSpec, structured documentation, and peer code review.",
    ],
    stack: ["Ruby on Rails", "PostgreSQL", "React JS", "AWS", "RSpec"],
  },
  {
    id: "aumni",
    company: "Aumni Inc",
    role: "Tech Lead Software Engineer",
    start: "2019-07",
    end: "2020-10",
    location: "Utah USA",
    workArrangement: "Remote",
    generalSummary:
      "Technical lead for the Admin Architecture Squad, responsible for the administration and data-operations experience of Aumni's dashboard.",
    generalAccomplishments: [
      "Designed a reusable DataOps dashboard architecture that enabled the team to build consistently across administration features.",
      "Established reusable testing patterns and engineering review practices aligned with the wider company's standards.",
      "Reported delivery progress and technical decisions directly to senior product and engineering leadership.",
    ],
    summary:
      "Led Aumni's Admin Architecture Squad, focused on the administration and data-operations experience of the company's dashboard.",
    accomplishments: [
      "Engineered the DataOps dashboard architecture around reusable, understandable components, functions, and service objects.",
      "Created reusable testing patterns and helpers for administration features so the team could follow one consistent approach.",
      "Reviewed code against the US team's standards and reported weekly to the CTO, Head of Product Development, and Engineering Manager.",
    ],
    stack: ["Ruby on Rails", "React", "RSpec", "Testing Library"],
  },
  {
    id: "gohiso",
    company: "GOHISO Inc",
    role: "Lead Software Engineer",
    start: "2017-02",
    end: "2018-10",
    location: "California USA",
    workArrangement: "Remote",
    generalSummary:
      "Lead engineer who helped take the product from a refactored MVP through Alpha and Beta while advising product leadership.",
    generalAccomplishments: [
      "Refactored the MVP and delivered the Ruby on Rails and React product through Beta.",
      "Contributed to UX and UI decisions and advised senior management through MVP, Alpha, and Beta stages while the company pursued customers and investors.",
      "Built the marketplace payment flow with Stripe and Stripe Connect, then trained and led the engineering team.",
    ],
    summary:
      "Took on the lead engineering role after refactoring the MVP, then helped carry the product from MVP through Alpha and Beta.",
    accomplishments: [
      "Refactored the MVP and developed the application through Beta with Ruby on Rails and React.",
      "Contributed to the UX and UI design across the MVP, Alpha, and Beta versions.",
      "Guided senior management through MVP, Alpha, and Beta product decisions while the company pursued customers and investors.",
      "Integrated Stripe and Stripe Connect to support transactions between customers and service providers.",
      "Trained and led the engineering team.",
    ],
    stack: ["Ruby on Rails", "React JS", "Stripe", "Stripe Connect"],
  },
  {
    id: "freelance",
    company: "Freelance",
    role: "Software Engineer",
    start: "2015-10",
    generalSummary:
      "Provided freelance software engineering services before moving into full-time product engineering and technical leadership roles.",
    generalAccomplishments: ["Delivered freelance software engineering work across the transition into full-time product engineering."],
    summary:
      "Provided freelance software engineering services before moving into lead and technical leadership roles.",
    end: "2017-02",
    accomplishments: ["Delivered freelance software engineering work across the transition into full-time product engineering."],
    stack: ["Ruby on Rails"],
  },
] satisfies readonly CvExperience[];
