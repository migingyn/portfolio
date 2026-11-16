import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, LazyMotion } from "motion/react";
import * as m from "motion/react-m";
import type { Section } from "../site.config";

interface Props {
  items: Pick<Section, "label" | "href">[];
  currentPath: string;
}

/** DESIGN.md motion tokens: `fast` for the overlay's exit, `base` for its entrance. */
const EASE = [0.23, 1, 0.32, 1] as const;
const FADE_IN = 0.24;
const FADE_OUT = 0.15;

const loadFeatures = () => import("./motion-features").then((mod) => mod.default);
const normalize = (path: string) => (path.length > 1 ? path.replace(/\/$/, "") : path);
const mod = (n: number, by: number) => ((n % by) + by) % by;
const OPENERS = "[data-dial-open]";

/**
 * Dial navigation (DESIGN.md section 5). The sections sit around a ring; the one
 * at the top is selected. It turns with drag, scroll wheel, arrow keys, and touch
 * swipe, and every item is a normal link, so it also works by Tab and Enter.
 */
export default function Dial({ items, currentPath }: Props) {
  const count = items.length;
  const step = 360 / count;
  // A page inside a section (a project write-up, a post) counts as that section.
  const here = normalize(currentPath);
  const currentIndex = Math.max(
    0,
    items.findIndex((item) => (item.href === "/" ? here === "/" : here === item.href || here.startsWith(`${item.href}/`))),
  );

  const [open, setOpen] = useState(false);
  /** The ring's rotation in degrees. Cumulative, so it always turns the short way. */
  const [turn, setTurn] = useState(-currentIndex * step);
  const [dragging, setDragging] = useState(false);
  const selected = mod(Math.round(-turn / step), count);

  const dialogId = useId();
  const openerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const drag = useRef({ active: false, moved: false, lastAngle: 0, travelled: 0 });
  const wheelAt = useRef(0);
  const focusSelected = useRef(false);

  const close = useCallback(() => setOpen(false), []);

  const stepBy = useCallback(
    (direction: 1 | -1) => {
      setTurn((value) => Math.round(value / step) * step - direction * step);
    },
    [step],
  );

  // The logo (any [data-dial-open] button) opens the dial on the current section.
  useEffect(() => {
    const openers = [...document.querySelectorAll<HTMLElement>(OPENERS)];
    const onClick = (event: MouseEvent) => {
      openerRef.current = event.currentTarget as HTMLElement;
      setTurn(-currentIndex * step);
      focusSelected.current = true;
      setOpen(true);
    };
    for (const opener of openers) {
      opener.setAttribute("aria-controls", dialogId);
      opener.addEventListener("click", onClick);
    }
    return () => openers.forEach((opener) => opener.removeEventListener("click", onClick));
  }, [dialogId, currentIndex, step]);

  useEffect(() => {
    document.querySelectorAll(OPENERS).forEach((opener) => opener.setAttribute("aria-expanded", String(open)));
    if (!open) return;

    const outside = [...document.querySelectorAll<HTMLElement>("main")];
    const root = document.documentElement;
    const opener = openerRef.current;
    const previousOverflow = root.style.overflow;
    outside.forEach((el) => el.setAttribute("inert", ""));
    root.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
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

  // Keyboard users follow the selection: focus moves to whichever item is at the top.
  useEffect(() => {
    if (!open || !focusSelected.current) return;
    focusSelected.current = false;
    linkRefs.current[selected]?.focus();
  }, [open, selected]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      focusSelected.current = true;
      stepBy(1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      focusSelected.current = true;
      stepBy(-1);
    } else if (event.key === "Tab") {
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("a[href], button");
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
    }
  };

  const onWheel = (event: React.WheelEvent) => {
    const now = Date.now();
    const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    if (now - wheelAt.current < 280 || Math.abs(delta) < 4) return;
    wheelAt.current = now;
    stepBy(delta > 0 ? 1 : -1);
  };

  const angleAt = (event: React.PointerEvent) => {
    const box = ringRef.current!.getBoundingClientRect();
    return (Math.atan2(event.clientY - (box.top + box.height / 2), event.clientX - (box.left + box.width / 2)) * 180) / Math.PI;
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    drag.current = { active: true, moved: false, lastAngle: angleAt(event), travelled: 0 };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state.active) return;
    const angle = angleAt(event);
    let delta = angle - state.lastAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    state.lastAngle = angle;
    state.travelled += Math.abs(delta);
    // A few degrees of travel turns a press into a drag; before that a link still gets its click.
    if (!state.moved && state.travelled > 4) {
      state.moved = true;
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (state.moved) {
      setTurn((value) => value + delta);
    }
  };

  const onPointerUp = () => {
    const state = drag.current;
    if (!state.active) return;
    state.active = false;
    if (state.moved) {
      setDragging(false);
      setTurn((value) => Math.round(value / step) * step);
    }
  };

  return (
    <LazyMotion features={loadFeatures} strict>
      <AnimatePresence>
        {open && (
          <m.div
            ref={dialogRef}
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="dial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: FADE_OUT, ease: EASE } }}
            transition={{ duration: FADE_IN, ease: EASE }}
            onKeyDown={onKeyDown}
            onWheel={onWheel}
            onClick={(event) => {
              if (event.target === event.currentTarget) close();
            }}
          >
            <div
              ref={ringRef}
              className={`dial__ring${dragging ? " is-dragging" : ""}`}
              style={{ "--turn": `${turn}deg` } as React.CSSProperties}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onClickCapture={(event) => {
                // The click that ends a drag is not a choice.
                if (drag.current.moved) {
                  event.preventDefault();
                  event.stopPropagation();
                  drag.current.moved = false;
                }
              }}
            >
              <span className="dial__circle" aria-hidden="true" />
              <span className="dial__mark" aria-hidden="true" />
              <nav aria-label="Sections">
                <ul>
                  {items.map((item, index) => (
                    <li key={item.href} className="dial__item" style={{ "--at": `${index * step}deg` } as React.CSSProperties}>
                      <a
                        ref={(el) => {
                          linkRefs.current[index] = el;
                        }}
                        href={item.href}
                        aria-current={index === currentIndex ? "page" : undefined}
                        className={`dial__link${index === selected ? " is-selected" : ""}`}
                        draggable={false}
                        onClick={close}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <button type="button" className="link dial__close" onClick={close}>
              <span>Close</span>
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
