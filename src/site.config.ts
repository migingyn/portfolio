/** Everything you are likely to edit by hand lives here. */

export interface NavItem {
  label: string;
  /** Japanese sublabel. Must be real, correct Japanese (DESIGN.md D-015). */
  labelJa: string;
  href: string;
  /** false = page not built yet; shown in the menu as "Soon" and not clickable. */
  ready: boolean;
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
    { label: "Home", labelJa: "ホーム", href: "/", ready: true },
    { label: "Projects", labelJa: "プロジェクト", href: "/projects", ready: false },
    { label: "Experience", labelJa: "経歴", href: "/experience", ready: false },
    { label: "Resume", labelJa: "履歴書", href: "/resume", ready: false },
    { label: "Blog", labelJa: "ブログ", href: "/blog", ready: false },
    { label: "Seasons", labelJa: "シーズン", href: "/seasons", ready: false },
    { label: "Links", labelJa: "リンク", href: "/links", ready: false },
  ] satisfies NavItem[],

  /** "Now" card on the home page. PLACEHOLDER copy: replace with your own. */
  now: {
    building: "This site: seasons, a persistent player, and the project archive.",
    filming: "Placeholder. Add what you are filming in src/site.config.ts.",
  },

  /** Small links in the bottom corner of every page. */
  footerLinks: [{ label: "GitHub", href: "https://github.com/migingyn" }],
};
