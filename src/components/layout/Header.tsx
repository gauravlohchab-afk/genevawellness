"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { contact, mainNav } from "@/content/site";
import { treatmentCategories, treatmentsInCategory } from "@/content/treatments";
import BookButton from "../booking/BookButton";
import { ChevronDown, Close, Menu, SocialIcon } from "../Icons";
import { GenevaLogo, LaveeLogo } from "../Logos";
import MegaMenu from "./MegaMenu";

export default function Header({ brand }: { brand: "geneva" | "lavee" }) {
  const pathname = usePathname();
  const menuId = useId();
  const [solid, setSolid] = useState(false);
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const megaRef = useRef<HTMLLIElement>(null);
  const megaTimer = useRef<number | undefined>(undefined);
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Solid + compact state on scroll.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 12);
      setCompact(y > 120);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On Geneva pages, step the header out of the way while a Lavee section is at the top
  // of the screen, so Geneva red never sits in the same frame as Lavee purple.
  useEffect(() => {
    if (brand !== "geneva") return;
    const zones = Array.from(document.querySelectorAll("[data-brand-zone='lavee']"));
    if (!zones.length) return setHidden(false);
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setHidden(visible.size > 0);
      },
      { rootMargin: "0px 0px -88% 0px" }
    );
    zones.forEach((z) => io.observe(z));
    return () => io.disconnect();
  }, [brand, pathname]);

  // Close menus on navigation.
  useEffect(() => {
    setMegaOpen(false);
    setDrawerOpen(false);
  }, [pathname]);

  // Mega menu: close on outside click / Escape.
  useEffect(() => {
    if (!megaOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!megaRef.current?.contains(e.target as Node)) setMegaOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        megaRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [megaOpen]);

  // Drawer: scroll lock, Escape, focus trap.
  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    toggleRef.current?.focus();
  }, []);
  useEffect(() => {
    if (!drawerOpen) return;
    document.body.classList.add("is-locked");
    const panel = drawerRef.current;
    panel?.querySelector<HTMLElement>("button, a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
      if (e.key === "Tab" && panel) {
        const f = Array.from(panel.querySelectorAll<HTMLElement>("a[href], button, summary"));
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("is-locked");
    };
  }, [drawerOpen, closeDrawer]);

  // Close the drawer if the viewport grows to desktop.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1080px)");
    const onChange = () => mq.matches && setDrawerOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));
  const hoverOpen = () => {
    window.clearTimeout(megaTimer.current);
    if (window.matchMedia("(hover: hover)").matches) setMegaOpen(true);
  };
  const hoverClose = () => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    megaTimer.current = window.setTimeout(() => setMegaOpen(false), 180);
  };

  const logo =
    brand === "lavee" ? (
      <LaveeLogo variant={solid ? "lavender" : "cream"} width={compact ? 92 : 108} alt="Lavee by Geneva Wellness" priority />
    ) : (
      <GenevaLogo />
    );

  return (
    <>
      <header
        className={`site-header${solid ? " is-solid" : ""}${compact ? " is-compact" : ""}${hidden && !drawerOpen ? " is-hidden" : ""}${
          drawerOpen ? " is-open" : ""
        }`}
      >
        <div className="container site-header__inner">
          <Link href={brand === "lavee" ? "/lavee" : "/"} className="site-header__brand" aria-label={brand === "lavee" ? "Lavee home" : "Geneva Wellness Institute — Home"}>
            {logo}
          </Link>

          <nav className="site-header__nav" aria-label="Main">
            <ul className="nav-list">
              {mainNav.filter((i) => !i.mobileOnly).map((item) =>
                item.hasMenu ? (
                  <li key={item.href} className="nav-item" ref={megaRef} onMouseEnter={hoverOpen} onMouseLeave={hoverClose}>
                    <button
                      type="button"
                      className="nav-link"
                      aria-expanded={megaOpen}
                      aria-controls={menuId}
                      aria-current={isCurrent(item.href) ? "page" : undefined}
                      onClick={() => setMegaOpen((o) => !o)}
                    >
                      {item.label} <ChevronDown />
                    </button>
                    <MegaMenu id={menuId} open={megaOpen} />
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link href={item.href} className="nav-link" aria-current={isCurrent(item.href) ? "page" : undefined}>
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>

          <div className="site-header__actions">
            <BookButton className="btn btn--sm header-cta" source="header">
              {brand === "lavee" ? "Book your session" : "Book a Consultation"}
            </BookButton>
            <button
              ref={toggleRef}
              type="button"
              className="menu-toggle"
              aria-expanded={drawerOpen}
              aria-controls={`${menuId}-drawer`}
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>

      <div id={`${menuId}-drawer`} className={`drawer${drawerOpen ? " is-open" : ""}`} aria-hidden={!drawerOpen} inert={!drawerOpen}>
        <div className="drawer__scrim" onClick={closeDrawer} />
        <div ref={drawerRef} className="drawer__panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="drawer__top">
            <Link href={brand === "lavee" ? "/lavee" : "/"} aria-label="Home" onClick={closeDrawer}>
              {brand === "lavee" ? <LaveeLogo variant="lavender" width={92} alt="Lavee" /> : <GenevaLogo />}
            </Link>
            <button type="button" className="modal__close" onClick={closeDrawer} aria-label="Close menu">
              <Close />
            </button>
          </div>
          <nav className="drawer__body" aria-label="Mobile">
            <Link href="/" className="drawer__link">
              Home
            </Link>
            <details className="drawer__group">
              <summary>
                Treatments <ChevronDown size={18} />
              </summary>
              <div className="drawer__sub">
                {treatmentCategories.map((cat) => (
                  <div key={cat.id}>
                    <h3>{cat.name}</h3>
                    <ul>
                      {treatmentsInCategory(cat.id).map((t) => (
                        <li key={t.slug}>
                          <Link href={`/treatments/${t.slug}`}>{t.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <Link href="/treatments" className="link-arrow">
                  All treatments
                </Link>
              </div>
            </details>
            {mainNav
              .filter((i) => !i.hasMenu)
              .map((item) => (
                <Link key={item.href} href={item.href} className="drawer__link" aria-current={isCurrent(item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              ))}
          </nav>
          <div className="drawer__foot">
            <BookButton className="btn btn--block" source="mobile-menu">
              {brand === "lavee" ? "Book your session" : "Book a Consultation"}
            </BookButton>
            <a className="btn btn--ghost btn--block" href={contact.whatsapp.href} target="_blank" rel="noopener noreferrer">
              <SocialIcon name="WhatsApp" size={16} /> WhatsApp {contact.whatsapp.display}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
