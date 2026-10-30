"use client";

import Link from "next/link";
import { useState } from "react";
import { treatmentCategories, treatmentsInCategory, type TreatmentCategoryId } from "@/content/treatments";
import { imageAttrs } from "@/lib/assets";
import { ArrowRight } from "../Icons";

/**
 * Compact treatments menu: categories on the left, the active category's treatments on
 * the right. Hidden menus use visibility:hidden, so closed links are out of the tab order.
 */
export default function MegaMenu({ id, open }: { id: string; open: boolean }) {
  const [catId, setCatId] = useState<TreatmentCategoryId>(treatmentCategories[0].id);
  const items = treatmentsInCategory(catId);

  return (
    <div id={id} className={`mega${open ? " is-open" : ""}`}>
      <ul className="mega__cats">
        {treatmentCategories.map((c) => (
          <li key={c.id}>
            <Link
              href={`/treatments#${c.id}`}
              className={`mega__cat${c.id === catId ? " is-active" : ""}`}
              aria-current={c.id === catId ? "true" : undefined}
              onMouseEnter={() => setCatId(c.id)}
              onFocus={() => setCatId(c.id)}
            >
              {c.name.replace(" Treatments", "")}
              <small>{treatmentsInCategory(c.id).length}</small>
            </Link>
          </li>
        ))}
        <li className="mega__all">
          <Link href="/treatments" className="link-arrow">
            All treatments <ArrowRight />
          </Link>
        </li>
      </ul>

      <ul className="mega__list" key={catId}>
        {items.map((t, i) => (
          <li key={t.slug} style={{ ["--i" as string]: i }}>
            <Link href={`/treatments/${t.slug}`} className="mega__item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.image.src} {...imageAttrs(t.image.src, { thumb: true })} alt="" loading="lazy" decoding="async" />
              <span>
                <strong>{t.name}</strong>
                <em>{t.tagline}</em>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
