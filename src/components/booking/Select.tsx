"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface SelectGroup {
  label?: string;
  options: string[];
}

interface Props {
  id: string;
  value: string;
  placeholder: string;
  groups: SelectGroup[];
  onChange: (value: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  describedBy?: string;
  /** Used by the form to focus the first invalid field. */
  dataField?: string;
}

/**
 * Styled replacement for <select>, following the WAI-ARIA select-only combobox pattern:
 * focus stays on the button, arrows/Home/End/type-ahead move the active option, Enter or
 * Space picks it, Escape closes. The list renders in a portal with fixed positioning so the
 * popup's scroll area never clips it, and it flips above the field when there's no room below.
 */
export default function Select({ id, value, placeholder, groups, onChange, onBlur, invalid, describedBy, dataField }: Props) {
  const listId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const options = groups.flatMap((g) => g.options);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [pos, setPos] = useState<{ left: number; width: number; top?: number; bottom?: number; maxHeight: number } | null>(null);
  const optionId = (i: number) => `${listId}-opt-${i}`;

  const place = useCallback(() => {
    const r = triggerRef.current?.getBoundingClientRect();
    if (!r) return;
    const gap = 6;
    const below = window.innerHeight - r.bottom - gap - 12;
    const above = r.top - gap - 12;
    const flip = below < 220 && above > below;
    setPos({
      left: r.left,
      width: r.width,
      maxHeight: Math.min(300, flip ? above : below),
      ...(flip ? { bottom: window.innerHeight - r.top + gap } : { top: r.bottom + gap }),
    });
  }, []);

  const openList = () => {
    place();
    setActive(Math.max(options.indexOf(value), 0));
    setOpen(true);
  };
  const close = () => setOpen(false);
  const pick = (i: number) => {
    onChange(options[i]);
    close();
  };

  useLayoutEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`#${CSS.escape(optionId(active))}`)?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!triggerRef.current?.contains(t) && !listRef.current?.contains(t)) close();
    };
    // Close if the page or the popup scrolls under the list; follow the field on resize.
    const onScroll = (e: Event) => {
      if (!listRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", place);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", place);
    };
  }, [open, place]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = options.length - 1;
    const move = (i: number) => {
      e.preventDefault();
      if (!open) openList();
      setActive(Math.min(Math.max(i, 0), last));
    };
    switch (e.key) {
      case "ArrowDown":
        return move(open ? active + 1 : Math.max(options.indexOf(value), 0));
      case "ArrowUp":
        return move(open ? active - 1 : Math.max(options.indexOf(value), 0));
      case "Home":
        return open ? move(0) : undefined;
      case "End":
        return open ? move(last) : undefined;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open && active >= 0) pick(active);
        else openList();
        return;
      case "Escape":
        if (open) {
          e.preventDefault();
          e.stopPropagation(); // keep the booking popup open
          close();
        }
        return;
      case "Tab":
        if (open) close();
        return;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const now = Date.now();
          typed.current = { text: (now - typed.current.at > 600 ? "" : typed.current.text) + e.key.toLowerCase(), at: now };
          const start = open ? active : options.indexOf(value);
          const order = [...options.slice(start + 1), ...options.slice(0, start + 1)];
          const hit = order.find((o) => o.toLowerCase().startsWith(typed.current.text));
          if (hit) {
            const i = options.indexOf(hit);
            if (open) setActive(i);
            else onChange(hit);
          }
        }
    }
  };

  let index = -1;
  const list =
    open && pos
      ? createPortal(
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            className={`select-list${pos.bottom !== undefined ? " is-above" : ""}`}
            style={{ left: pos.left, width: pos.width, top: pos.top, bottom: pos.bottom, maxHeight: pos.maxHeight }}
            data-brand={triggerRef.current?.closest("[data-brand]")?.getAttribute("data-brand") ?? undefined}
            onMouseDown={(e) => e.preventDefault() /* keep focus on the button, even when dragging the scrollbar */}
          >
            {groups.map((g, gi) => (
              <li key={g.label ?? gi} role="presentation">
                {g.label && (
                  <span className="select-list__group" role="presentation">
                    {g.label}
                  </span>
                )}
                <ul role="group" aria-label={g.label}>
                  {g.options.map((o) => {
                    index += 1;
                    const i = index;
                    return (
                      <li
                        key={o}
                        id={optionId(i)}
                        role="option"
                        aria-selected={o === value}
                        className={`select-list__option${i === active ? " is-active" : ""}`}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => pick(i)}
                      >
                        {o}
                        {o === value && (
                          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>,
          document.body
        )
      : null;

  return (
    <>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        className={`input select-trigger${value ? "" : " is-placeholder"}${open ? " is-open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        data-field={dataField}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onKeyDown}
        onBlur={() => {
          close();
          onBlur?.();
        }}
      >
        <span className="select-trigger__value">{value || placeholder}</span>
        <svg className="select-trigger__chevron" viewBox="0 0 12 8" width="12" height="8" aria-hidden="true">
          <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      {list}
    </>
  );
}
