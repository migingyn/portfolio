/** Everything you are likely to edit by hand lives here. */

export interface NavItem {
  label: string;
  /** Japanese sublabel. Must be real, correct Japanese (DESIGN.md D-015). */
  labelJa: string;
  href: string;
  /** false = page not built yet; shown in the menu as "Soon" and not clickable. */
  ready: boolean;
}

export interface CoverLine {
  /** Magazine-style kicker in Japanese, e.g. 大特集 ("big feature"). */
  kickerJa: string;
  title: string;
  /** One line of Japanese cover copy, with its English meaning. */
  copyJa: string;
  copyEn: string;
  /** Must match a nav item; the line becomes a link once that page is ready. */
  href: string;
}

export const site = {
  name: "Mikey Nguyen",
  /** Katakana reading shown above the masthead. Check this is how you want it written. */
  nameJa: "マイキー・グエン",
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

  /** Cover lines on the home page, left column first. */
  coverLines: [
    {
      kickerJa: "大特集",
      title: "Projects",
      copyJa: "作ったもの、ぜんぶ見せます。",
      copyEn: "Everything I have built.",
      href: "/projects",
    },
    {
      kickerJa: "特別付録",
      title: "Resume",
      copyJa: "履歴書つき。",
      copyEn: "Resume included.",
      href: "/resume",
    },
    {
      kickerJa: "新連載",
      title: "Blog",
      copyJa: "考えたこと、書いていきます。",
      copyEn: "Notes on what I am thinking about.",
      href: "/blog",
    },
  ] satisfies CoverLine[],

  /** "Now" readout on the home page phone. PLACEHOLDER copy: replace with your own. */
  now: {
    building: "This site, one season at a time.",
    filming: "Placeholder: edit in site.config.ts",
  },

  /** Small links in the bottom corner of every page. */
  footerLinks: [{ label: "GitHub", href: "https://github.com/migingyn" }],
};
