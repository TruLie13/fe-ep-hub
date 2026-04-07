"use client";

import { useEffect, useState } from "react";

function decodeHashId(): string | null {
  if (typeof window === "undefined") return null;
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function applyHashOverride(
  ids: readonly string[],
  activationOffsetPx: number,
  scrollBasedActive: string,
): string {
  const hashId = decodeHashId();
  if (!hashId || !ids.includes(hashId)) return scrollBasedActive;
  const el = document.getElementById(hashId);
  if (!el) return scrollBasedActive;
  const top = el.getBoundingClientRect().top;
  const inJumpZone = top > -48 && top <= activationOffsetPx + 200;
  if (inJumpZone) {
    return hashId;
  }
  return scrollBasedActive;
}

/**
 * Returns the anchor id that should read as “current” in a table of contents: the last
 * element in `ids` (document order) whose top edge is at or above `activationOffsetPx`
 * from the viewport top. Respects `location.hash` when it targets a section in the reading zone.
 */
export function useScrollSpyActiveId(ids: readonly string[], activationOffsetPx = 120) {
  const [activeId, setActiveId] = useState<string | null>(() => ids[0] ?? null);

  useEffect(() => {
    const compute = () => {
      const list = ids;
      if (list.length === 0) {
        setActiveId(null);
        return;
      }
      let active = list[0];
      for (const id of list) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= activationOffsetPx) {
          active = id;
        }
      }
      active = applyHashOverride(list, activationOffsetPx, active);
      setActiveId((prev) => (prev === active ? prev : active));
    };

    const computeAfterLayout = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(compute);
      });
    };

    compute();
    if (decodeHashId()) {
      computeAfterLayout();
    }

    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    window.addEventListener("hashchange", computeAfterLayout);

    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
      window.removeEventListener("hashchange", computeAfterLayout);
    };
  }, [ids, activationOffsetPx]);

  return activeId;
}
