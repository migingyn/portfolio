import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, LazyMotion, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { NavItem } from "../site.config";

interface Props {
  name: string;
  tagline: string;
  items: NavItem[];
  currentPath: string;
  /** Home renders the wordmark as the page's h1. */
  isHome: boolean;
  /** Small silver line at the bottom of the panel. */
  hallmark: string;
}

/** DESIGN.md motion tokens: `slow` and `base` durations, shared ease. */
const EASE = [0.23, 1, 0.32, 1] as const;
const SLOW = 0.28;
const BASE = 0.18;

/** Animation features load after hydration, so the wordmark is clickable sooner. */
const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

const normalize = (path: string) => (path.length > 1 ? path.replace(/\/$/, "") : path);

/**
 * Site header and menu. The wordmark is the menu button; the panel slides in
 * from the left as a modal dialog (focus trapped, Escape closes, focus returns
 * to the wordmark).
 */
export default function SiteMenu({ name, tagline, items, currentPath, isHome, hallmark }: Props) {
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
    <header className="relative z-20 flex flex-col items-center px-(--page-x) pt-4 text-center md:pt-6">
      <Heading>
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(true)}
          className="group flex flex-col items-center gap-1 px-4 py-2 text-silver-50 hover:text-forward"
        >
          <span className="type-meta text-silver-500 group-hover:text-forward" aria-hidden="true">
            Menu +
          </span>
          <span className="type-wordmark">{name}</span>
          <span className="sr-only">, open menu</span>
        </button>
      </Heading>
      <p className="type-whisper mt-1 max-w-[24rem] text-balance text-silver-400 md:max-w-none">{tagline}</p>

      <LazyMotion features={loadFeatures} strict>
        <AnimatePresence>
          {open && (
            <m.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-carbon/75"
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
              className="halftone fixed inset-y-0 left-0 z-50 flex w-full flex-col overflow-y-auto border-silver-600 bg-carbon text-left md:w-[30rem] md:border-r"
              initial={reduceMotion ? { opacity: 0 } : { x: "-100%" }}
              animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { x: "-100%" }}
              transition={{ duration: reduceMotion ? BASE : SLOW, ease: EASE }}
            >
              <div className="flex items-center justify-between gap-4 border-b border-hairline px-(--page-x) py-3 md:px-8">
                <p className="type-techno-sm text-silver-400">Index</p>
                <button ref={closeRef} type="button" onClick={close} className="btn-ghost">
                  Close
                </button>
              </div>

              <nav aria-label="Sections" className="flex-1 px-(--page-x) py-2 md:px-8">
                <ol className="flex flex-col">
                  {items.map((item, index) => {
                    const number = String(index + 1).padStart(2, "0");
                    const current = normalize(item.href) === here;
                    const state = item.ready ? (
                      <span lang="ja" className="type-body-sm text-silver-500">
                        {item.labelJa}
                      </span>
                    ) : (
                      <span className="type-meta">Soon</span>
                    );
                    const inner = (
                      <>
                        <span className="flex items-center gap-3">
                          <span className="type-meta text-silver-500" aria-hidden="true">
                            {number}
                          </span>
                          {state}
                        </span>
                        {/* shout-md, eased down only on phones narrower than 370px so "Experience" fits. */}
                        <span className="type-shout-md" style={{ fontSize: "min(3rem, 13vw)" }}>
                          {item.label}
                        </span>
                      </>
                    );
                    return (
                      <li key={item.href} className="border-b border-dotted border-hairline">
                        {item.ready ? (
                          <a
                            href={item.href}
                            aria-current={current ? "page" : undefined}
                            onClick={close}
                            className={`flex flex-col gap-1 py-2 text-silver-50 hover:text-forward ${
                              current ? "shadow-[inset_0_-1px_0_var(--color-accent)]" : ""
                            }`}
                          >
                            {inner}
                          </a>
                        ) : (
                          <span aria-disabled="true" className="flex flex-col gap-1 py-2 text-silver-50 opacity-40">
                            {inner}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </nav>

              <p className="type-meta border-t border-hairline px-(--page-x) py-4 text-silver-500 md:px-8">{hallmark}</p>
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>
    </header>
  );
}
