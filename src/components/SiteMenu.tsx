import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, LazyMotion, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { NavItem } from "../site.config";

interface Props {
  name: string;
  /** Katakana reading, set above the name like furigana. */
  nameJa: string;
  tagline: string;
  items: NavItem[];
  currentPath: string;
  /** Home renders the masthead as the page's h1. */
  isHome: boolean;
  /** Small line at the bottom of the panel. */
  hallmark: string;
}

/** DESIGN.md motion tokens. */
const EASE = [0.23, 1, 0.32, 1] as const;
const POP = [0.34, 1.56, 0.64, 1] as const;
const SLOW = 0.28;
const BASE = 0.18;

/** Animation features load after hydration, so the masthead is clickable sooner. */
const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

const normalize = (path: string) => (path.length > 1 ? path.replace(/\/$/, "") : path);

/**
 * Masthead and menu. The name is the menu button; the panel slides in from the
 * left as a modal dialog (focus trapped, Escape closes, focus returns to the name).
 */
export default function SiteMenu({ name, nameJa, tagline, items, currentPath, isHome, hallmark }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const here = normalize(currentPath);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const page = document.getElementById("page");
    const root = document.documentElement;
    const trigger = triggerRef.current;
    const previousOverflow = root.style.overflow;

    page?.setAttribute("inert", "");
    root.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      page?.removeAttribute("inert");
      root.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  const trapFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    if (!focusable?.length) return;
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const Heading = isHome ? "h1" : "div";

  return (
    <header className="relative z-20 flex flex-col items-center px-(--page-x) pt-4 text-center md:pt-5">
      <Heading>
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(true)}
          className="masthead"
        >
          <span className="masthead-kana type-label" lang="ja" aria-hidden="true">
            {nameJa}
          </span>
          <span className="masthead-name type-masthead">{name}</span>
          <span className="masthead-chip type-label" aria-hidden="true">
            Menu <span lang="ja">メニュー</span>
          </span>
          <span className="sr-only">, open menu</span>
        </button>
      </Heading>
      <p className="type-body mt-2 font-bold text-silver-50">{tagline}</p>

      <LazyMotion features={loadFeatures} strict>
        <AnimatePresence>
          {open && (
            <m.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-carbon/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: BASE, ease: EASE }}
              onClick={close}
              aria-hidden="true"
            />
          )}
          {open && (
            <m.div
              key="panel"
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              onKeyDown={trapFocus}
              className="halftone fixed inset-y-0 left-0 z-50 flex w-full flex-col overflow-y-auto border-accent bg-carbon text-left md:w-[30rem] md:border-r-8"
              initial={reduceMotion ? { opacity: 0 } : { x: "-100%" }}
              animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { x: "-100%" }}
              transition={{ duration: reduceMotion ? BASE : SLOW, ease: EASE }}
            >
              <div className="flex items-center justify-between gap-4 px-(--page-x) pb-2 pt-4 md:px-8">
                <p className="flex items-baseline gap-3 text-silver-50">
                  <span className="type-shout-sm" lang="ja">
                    メニュー
                  </span>
                  <span className="type-label text-silver-400">Menu</span>
                </p>
                <button ref={closeRef} type="button" onClick={close} className="btn-gel">
                  <span lang="ja">とじる</span> Close
                </button>
              </div>

              <nav aria-label="Sections" className="flex-1 px-(--page-x) md:px-8">
                <ol className="flex flex-col">
                  {items.map((item, index) => {
                    const number = String(index + 1).padStart(2, "0");
                    const current = normalize(item.href) === here;
                    const inner = (
                      <>
                        <span className="flex items-center gap-2">
                          <span className="menu-number type-label" aria-hidden="true">
                            {number}
                          </span>
                          <span lang="ja" className="type-body-sm text-silver-400">
                            {item.labelJa}
                          </span>
                          {current && (
                            <span className="type-label ml-auto bg-accent px-2 py-1 text-ink">
                              <span lang="ja">いまここ</span>
                            </span>
                          )}
                          {!item.ready && (
                            <span className="type-label ml-auto rounded-pill border border-dashed border-silver-500 px-2 py-1 text-silver-400">
                              <span lang="ja">近日公開</span> / Soon
                            </span>
                          )}
                        </span>
                        {/* shout-md, eased down only on phones narrower than 370px so "Experience" fits. */}
                        <span className="menu-title type-shout-md" style={{ fontSize: "min(3rem, 13vw)" }}>
                          {item.label}
                        </span>
                      </>
                    );
                    return (
                      <m.li
                        key={item.href}
                        className="border-b-2 border-dotted border-hairline"
                        initial={reduceMotion ? false : { opacity: 0, x: -28 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.36, ease: POP, delay: 0.1 + index * 0.045 }}
                      >
                        {item.ready ? (
                          <a
                            href={item.href}
                            aria-current={current ? "page" : undefined}
                            onClick={close}
                            className={`menu-link flex flex-col gap-1 py-2 ${current ? "text-accent" : "text-silver-50"}`}
                          >
                            {inner}
                          </a>
                        ) : (
                          <span aria-disabled="true" className="flex flex-col gap-1 py-2 text-silver-500">
                            {inner}
                          </span>
                        )}
                      </m.li>
                    );
                  })}
                </ol>
              </nav>

              <p className="type-label px-(--page-x) py-4 text-silver-400 md:px-8">{hallmark}</p>
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>
    </header>
  );
}
