"use client";

import { useMemo } from "react";
import StickyInPageToc from "@/components/common/StickyInPageToc";
import type { LearnSection } from "@/lib/learn/sections";

export default function LearnToc({ sections }: { sections: LearnSection[] }) {
  const items = useMemo(
    () =>
      sections.map((s) => ({
        id: s.id,
        label: s.title,
        nested: s.subsections.map((sub) => ({ id: sub.id, label: sub.title })),
      })),
    [sections],
  );

  return <StickyInPageToc title="Contents" ariaLabel="Table of contents" items={items} preset="learn" />;
}
