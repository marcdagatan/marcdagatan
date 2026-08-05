import { CV_EXPERIENCE } from "./experience";
import type { CvRecord } from "./types";

/**
 * Editable CV identity, qualifications, and shared record metadata.
 *
 * Experience lives in `experience/`: each employer owns its record while the
 * index controls public ordering. This keeps substantial entries reviewable.
 */
export const CV_DATA = {
  person: {
    name: "Marc Uy Dagatan",
    headline: "Senior Full-Stack Software Engineer & Technical Lead.",
    summary:
      "I build, modernize, and lead production software systems across Ruby on Rails, React, and cloud infrastructure. My work spans hands-on architecture, delivery standards, testing practices, and the teams that keep complex products moving.",
    email: "marc.dagatan@gmail.com",
    links: [
      { label: "GitHub", href: "https://github.com/marcdagatan" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/marcdagatan/" },
    ],
  },
  experience: CV_EXPERIENCE,
  skillGroups: [
    { label: "Application development", items: ["Ruby on Rails", "React JS", "React Native"] },
    { label: "Data & infrastructure", items: ["PostgreSQL", "Redis", "AWS (EC2, S3, Route 53, RDS)"] },
    { label: "Delivery", items: ["Docker", "Docker Compose"] },
    { label: "Quality", items: ["RSpec", "Capybara", "Testing Library", "Jest"] },
  ],
  teaching: {
    id: "bootcamp-teaching",
    title: "FullStack Bootcamp",
    organization: "Ruby on Rails + React JS",
    start: "2020-01",
    end: "2020-04",
    description:
      "Organized and taught a Ruby on Rails and React JS bootcamp from Rails fundamentals through React integration and AJAX basics. The program emphasized industry coding standards and specification-driven testing.",
  },
  education: [
    {
      id: "college",
      institution: "De La Salle University - Manila",
      qualification: "BS-Electronics Comm. Engr.",
      start: "2009-05",
      end: "2010-01",
      details: "(Did not finish first year of college)",
    },
    {
      id: "secondary-education",
      institution: "Ateneo de Manila University",
      qualification: "High school",
      start: "2005-06",
      end: "2009-05",
    },
  ],
  references: "Available on request.",
  lastUpdated: "2026-08-05",
  bio: "I love learning new technology and maintain fitness through boxing and the gym. I have also acted in short films and Filipino drama series.",
} satisfies CvRecord;
