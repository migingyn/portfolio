import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, LazyMotion, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { NavItem } from "../site.config";

interface Props {
  items: NavItem[];
  currentPath: string;
}

/** DESIGN.md motion tokens. Exits are quicker than entrances. */
const EASE = [0.23, 1, 0.32, 1] as const;
const ENTER = 0.28;
const EXIT = 0.18;

/** Animation features load after hydration, so the page is interactive sooner. */
const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

const normalize = (path: string) => (path.length > 1 ? path.replace(/\/$/, "") : path);
const OPENERS = "[data-menu-open]";

/**
 * The menu: a panel that slides in from the left as a modal dialog. Any
 * [data-menu-open] button in the header opens it. Focus is trapped, Escape
 * closes it, and focus returns to the button that opened it.
 */
export default function MenuPanel({ items, currentPath }: Props) {
  const [open, setOpen] = useState(false);
  // Keyboard-opened menus appear at once: a keyboard action should not wait on an animation.
  const [instant, setInstant] = useState(false);
  const panelId = useId();
  const openerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const still = reduceMotion || instant;
  const here = normalize(currentPath);

  const close = useCallback(() => setOpen(false), []);

  // Wire the header's buttons.
  useEffect(() => {
    const openers = [...document.querySelectorAll<HTMLElement>(OPENERS)];
    const onClick = (event: MouseEvent) => {
      openerRef.current = event.currentTarget as HTMLElement;
      // detail is 0 when the click came from Enter or Space.
      setInstant(event.detail === 0);
      setOpen(true);
    };
    for (const opener of openers) {
      opener.setAttribute("aria-controls", panelId);
      opener.addEventListener("click", onClick);
    }
    return () => openers.forEach((opener) => opener.removeEventListener("click", onClick));
  }, [panelId]);

  useEffect(() => {
    document.querySelectorAll(OPENERS).forEach((opener) => opener.setAttribute("aria-expanded", String(open)));
    if (!open) return;

    const outside = [...document.querySelectorAll<HTMLElement>("main, body > footer")];
    const root = document.documentElement;
    const opener = openerRef.current;
    const previousOverflow = root.style.overflow;

    outside.forEach((el) => el.setAttribute("inert", ""));
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
      outside.forEach((el) => el.removeAttribute("inert"));
      root.style.overflow = previousOverflow;
      opener?.focus();
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

  return (
    <LazyMotion features={loadFeatures} strict>
      <AnimatePresence>
        {open && (
          <m.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/70"
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
            className="fixed inset-y-0 left-0 z-50 flex w-full flex-col overflow-y-auto border-line bg-black md:w-[22.5rem] md:border-r"
            initial={still ? false : { x: "-100%" }}
            animate={{ x: 0 }}
            exit={still ? { opacity: 0, transition: { duration: 0 } } : { x: "-100%", transition: { duration: EXIT, ease: EASE } }}
            transition={{ duration: ENTER, ease: EASE }}
          >
            <div className="flex items-center justify-between px-6 pt-3">
              <p className="type-caps text-grey">Menu</p>
              <button
                ref={closeRef}
                type="button"
                onClick={(event) => {
                  setInstant(event.detail === 0);
                  close();
                }}
                className="link type-caps"
              >
                <span>Close menu</span>
              </button>
            </div>

            <nav aria-label="Sections" className="flex-1 px-6 pt-6">
              <ul>
                {items.map((item, index) => {
                  const current = normalize(item.href) === here;
                  return (
                    <m.li
                      key={item.href}
                      className="border-b border-line"
                      initial={still ? false : { opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.22, ease: EASE, delay: 0.06 + index * 0.035 }}
                    >
                      {item.ready ? (
                        <a
                          href={item.href}
                          aria-current={current ? "page" : undefined}
                          onClick={close}
                          className="link type-caps flex w-full justify-between"
                        >
                          <span>{item.label}</span>
                          {current && <i className="size-1.5 bg-white" aria-hidden="true" />}
                        </a>
                      ) : (
                        <span aria-disabled="true" className="type-caps flex min-h-11 items-center justify-between text-grey">
                          {item.label}
                          <span className="type-mono normal-case tracking-normal">soon</span>
                        </span>
                      )}
                    </m.li>
                  );
                })}
              </ul>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
