/** Everything you are likely to edit by hand lives here. */

export interface Section {
  /** Also the video file name: public/video/<id>.mp4 */
  id: string;
  label: string;
  href: string;
  /** One plain line under the section's title. */
  intro: string;
}

export interface SiteLink {
  label: string;
  /** Leave out while the link is still a placeholder. */
  href?: string;
  placeholder?: boolean;
}

export const site = {
  name: "Mikey Nguyen",
  /** What I do and where. The home page's h1. */
  tagline: "Backend engineer and creative builder, San Diego",
  description: "Mikey Nguyen is a backend engineer and creative builder in San Diego. Projects, experience, resume, and writing.",

  /** The one setting that picks the current season: a file name in src/content/seasons. */
  currentSeason: "autumn-2026",

  /** The sections on the dial, in order. */
  sections: [
    { id: "home", label: "Home", href: "/", intro: "" },
    { id: "projects", label: "Projects", href: "/projects", intro: "Things I have built, with a short write-up of each." },
    { id: "experience", label: "Experience", href: "/experience", intro: "Where I have worked and what I did there." },
    { id: "resume", label: "Resume", href: "/resume", intro: "One page, with a download." },
    { id: "blog", label: "Blog", href: "/blog", intro: "Notes on what I am working through." },
    { id: "seasons", label: "Seasons", href: "/seasons", intro: "The site changes with the season. These are the ones so far." },
    { id: "links", label: "Links", href: "/links", intro: "Where else to find me." },
  ] satisfies Section[],

  /** The Links section. Entries marked placeholder show as such until they get an href. */
  links: [
    { label: "GitHub", href: "https://github.com/migingyn" },
    { label: "LinkedIn", placeholder: true },
    { label: "Email", placeholder: true },
  ] satisfies SiteLink[],

  /** Small links on the home section, for someone who has ten seconds. */
  homeLinks: [
    { label: "See the projects", href: "/projects" },
    { label: "Read the resume", href: "/resume" },
    { label: "See the code on GitHub", href: "https://github.com/migingyn" },
  ],
};
