import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, LazyMotion, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { NavItem } from "../site.config";

interface Props {
  name: string;
  tagline: string;
  items: NavItem[];
  currentPath: string;
  /** Home renders the masthead as the page's h1. */
  isHome: boolean;
  /** Small line at the bottom of the panel. */
  hallmark: string;
}

/** DESIGN.md motion tokens. Exits are quicker than entrances. */
const EASE = [0.23, 1, 0.32, 1] as const;
const ENTER = 0.28;
const EXIT = 0.18;

/** Animation features load after hydration, so the masthead is clickable sooner. */
const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

const normalize = (path: string) => (path.length > 1 ? path.replace(/\/$/, "") : path);

/**
 * Masthead and menu. The name is the menu button; the panel slides in from the
 * left as a modal dialog (focus trapped, Escape closes, focus returns to the name).
 */
export default function SiteMenu({ name, tagline, items, currentPath, isHome, hallmark }: Props) {
  const [open, setOpen] = useState(false);
  // Keyboard-opened menus appear at once: a keyboard action should not wait on an animation.
  const [instant, setInstant] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const still = reduceMotion || instant;
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
        setInstant(true);
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
    <header className="relative z-20 flex flex-col items-center px-(--page-x) pt-7 text-center md:pt-6">
      <Heading>
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={(event) => {
            // detail is 0 when the click came from Enter or Space.
            setInstant(event.detail === 0);
            setOpen(true);
          }}
          className="masthead"
        >
          <span className="masthead-name type-masthead">{name}</span>
          <span className="masthead-tag type-label" aria-hidden="true">
            Menu
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
              initial={still ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: still ? 0 : EXIT, ease: EASE } }}
              transition={{ duration: EXIT, ease: EASE }}
              onClick={() => {
                setInstant(false);
                close();
              }}
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
              className="halftone fixed inset-y-0 left-0 z-50 flex w-full flex-col overflow-y-auto bg-carbon text-left md:w-[30rem] md:border-r md:border-hairline"
              initial={still ? false : { x: "-100%" }}
              animate={{ x: 0 }}
              exit={still ? { opacity: 0, transition: { duration: 0 } } : { x: "-100%", transition: { duration: EXIT, ease: EASE } }}
              transition={{ duration: ENTER, ease: EASE }}
            >
              <div className="flex items-center justify-between gap-4 px-(--page-x) pb-2 pt-4 md:px-8">
                <p className="type-shout-sm text-silver-50">Menu</p>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={(event) => {
                    setInstant(event.detail === 0);
                    close();
                  }}
                  className="btn"
                >
                  Close menu
                </button>
              </div>

              <nav aria-label="Sections" className="flex-1 px-(--page-x) md:px-8">
                <ul className="flex flex-col">
                  {items.map((item, index) => {
                    const current = normalize(item.href) === here;
                    // shout-md, eased down only on phones narrower than 370px so "Experience" fits.
                    const title = (
                      <span className="menu-title type-shout-md" style={{ fontSize: "min(3rem, 13vw)" }}>
                        {item.label}
                      </span>
                    );
                    return (
                      <m.li
                        key={item.href}
                        className="border-b-2 border-dotted border-hairline"
                        initial={still ? false : { opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.24, ease: EASE, delay: 0.08 + index * 0.04 }}
                      >
                        {item.ready ? (
                          <a
                            href={item.href}
                            aria-current={current ? "page" : undefined}
                            onClick={close}
                            className={`menu-link block py-3 ${current ? "text-accent" : "text-silver-50"}`}
                          >
                            {title}
                          </a>
                        ) : (
                          <span aria-disabled="true" className="flex flex-wrap items-baseline justify-between gap-x-3 py-3 text-silver-500">
                            {title}
                            <span className="type-label">Soon</span>
                          </span>
                        )}
                      </m.li>
                    );
                  })}
                </ul>
              </nav>

              <p className="type-label px-(--page-x) py-4 text-silver-400 md:px-8">{hallmark}</p>
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>
    </header>
  );
}
