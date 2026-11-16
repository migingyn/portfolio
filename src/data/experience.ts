/** The Experience section, newest first. Replace the stand-ins with real entries. */

export interface Job {
  role: string;
  company: string;
  /** Free text, e.g. "Jun 2025 to Sep 2025" or "2024 to now". */
  dates: string;
  /** One or two lines on what I did there. */
  summary: string;
  /** True while this entry is stand-in content. */
  placeholder?: boolean;
}

export const experience: Job[] = [
  {
    role: "Role",
    company: "Company",
    dates: "Start to end",
    summary: "One or two lines on what I built or ran there, and what came of it.",
    placeholder: true,
  },
  {
    role: "Role",
    company: "Company",
    dates: "Start to end",
    summary: "One or two lines on what I built or ran there, and what came of it.",
    placeholder: true,
  },
];
