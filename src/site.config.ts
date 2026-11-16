/** Everything you are likely to edit by hand lives here. */

export interface Section {
  /** Also the video file name: public/video/<id>.mp4 */
  id: string;
  label: string;
  href: string;
  /** One honest line shown on the section's page until its content is built. */
  blurb: string;
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
    { id: "home", label: "Home", href: "/", blurb: "" },
    { id: "projects", label: "Projects", href: "/projects", blurb: "Write-ups of what I have built are on the way." },
    { id: "experience", label: "Experience", href: "/experience", blurb: "Where I have worked and what I did there is on the way." },
    { id: "resume", label: "Resume", href: "/resume", blurb: "A one-page resume with a download is on the way." },
    { id: "blog", label: "Blog", href: "/blog", blurb: "Notes on what I am working through are on the way." },
    { id: "seasons", label: "Seasons", href: "/seasons", blurb: "An archive of past seasons is on the way." },
    { id: "links", label: "Links", href: "/links", blurb: "Where else to find me is on the way." },
  ] satisfies Section[],

  /** Small links on the home section, for someone who has ten seconds. */
  homeLinks: [
    { label: "See the projects", href: "/projects" },
    { label: "Read the resume", href: "/resume" },
    { label: "See the code on GitHub", href: "https://github.com/migingyn" },
  ],
};
