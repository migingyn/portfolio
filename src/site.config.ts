/** Everything you are likely to edit by hand lives here. */

export interface NavItem {
  label: string;
  href: string;
  /** false = page not built yet; shown as "Soon" and not clickable. */
  ready: boolean;
}

export interface CoverLine {
  title: string;
  /** One short line of cover copy. */
  copy: string;
  /** Must match a nav item; the line becomes a link once that page is ready. */
  href: string;
}

export const site = {
  name: "Mikey Nguyen",
  tagline: "Backend engineer and creative builder.",
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

  /** Cover lines on the home page: the first sits left of the phone, the rest right. */
  coverLines: [
    { title: "Projects", copy: "Everything I have built.", href: "/projects" },
    { title: "Resume", copy: "One page, with a download.", href: "/resume" },
    { title: "Blog", copy: "Notes on what I am working through.", href: "/blog" },
  ] satisfies CoverLine[],

  /** "Now" readout on the home page phone. PLACEHOLDER copy: replace with your own. */
  now: {
    building: "This site, one season at a time.",
    filming: "Placeholder: edit in site.config.ts",
  },

  /** Small links in the bottom corner of every page. */
  footerLinks: [{ label: "GitHub", href: "https://github.com/migingyn" }],
};
