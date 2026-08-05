/** A normalized CV date. Runtime validation accepts YYYY, YYYY-MM, or YYYY-MM-DD. */
export type CvDate = string;

/** An external professional profile shown in the contact line. */
export interface CvLink {
  readonly label: string;
  readonly href: string;
}

/** The identity block used by the CV masthead. */
export interface CvPerson {
  readonly name: string;
  readonly headline: string;
  readonly summary: string;
  readonly email: string;
  readonly links: readonly CvLink[];
}

/** One professional record in the experience ledger. */
export interface CvExperience {
  readonly id: string;
  readonly company: string;
  readonly role: string;
  readonly start: CvDate;
  readonly end?: CvDate;
  readonly location?: string;
  readonly workArrangement?: string;
  readonly generalSummary: string;
  readonly generalAccomplishments: readonly string[];
  readonly summary: string;
  readonly accomplishments: readonly string[];
  readonly stack: readonly string[];
}

/** A compact technical stack row. */
export interface CvSkillGroup {
  readonly label: string;
  readonly items: readonly string[];
}

/** A teaching activity, kept separate from paid experience. */
export interface CvTeaching {
  readonly id: string;
  readonly title: string;
  readonly organization: string;
  readonly start: CvDate;
  readonly end?: CvDate;
  readonly description: string;
}

/** One education fact. Optional dates keep unknown source dates honest. */
export interface CvEducation {
  readonly id: string;
  readonly institution: string;
  readonly qualification: string;
  readonly start: CvDate;
  readonly end?: CvDate;
  readonly details?: string;
}

/** The complete, editable professional record used by the CV route. */
export interface CvRecord {
  readonly person: CvPerson;
  readonly experience: readonly CvExperience[];
  readonly skillGroups: readonly CvSkillGroup[];
  readonly teaching: CvTeaching;
  readonly education: readonly CvEducation[];
  readonly references: string;
  readonly lastUpdated: CvDate;
  readonly bio: string;
}
