/** Everything you are likely to edit by hand lives here. */

export interface NavItem {
  label: string;
  href: string;
  /** false = page not built yet; shown as "soon" and not clickable. */
  ready: boolean;
}

export const site = {
  name: "Mikey Nguyen",
  /** Under the name on every page; on the home page it is the h1. */
  tagline: "Backend engineer and creative builder, San Diego",
  description: "Portfolio of Mikey Nguyen, backend engineer and creative builder in San Diego.",

  /** The one setting that picks the current season: a file name in src/content/seasons. */
  currentSeason: "autumn-2026",

  city: "San Diego",
  timeZone: "America/Los_Angeles",

  nav: [
    { label: "Home", href: "/", ready: true },
    { label: "Projects", href: "/projects", ready: false },
    { label: "Experience", href: "/experience", ready: false },
    { label: "Resume", href: "/resume", ready: false },
    { label: "Blog", href: "/blog", ready: false },
    { label: "Seasons", href: "/seasons", ready: false },
    { label: "Links", href: "/links", ready: false },
  ] satisfies NavItem[],

  /**
   * The home page's one button. It points at GitHub until the projects page
   * exists; then change it to { label: "See the projects", href: "/projects" }.
   */
  primaryAction: { label: "See the code on GitHub", href: "https://github.com/migingyn" },

  /** "Now" card on the home page. Leave a line empty to hide it. */
  now: {
    building: "This site, one season at a time.",
    filming: "",
  },

  /** Small links in the footer. */
  footerLinks: [{ label: "GitHub", href: "https://github.com/migingyn" }],
};
