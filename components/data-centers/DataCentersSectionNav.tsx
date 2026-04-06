"use client";

import StickyInPageToc from "@/components/common/StickyInPageToc";
import type { DataCentersImpactSection } from "@/content/schema";

export type DataCentersSectionNavProps = {
  title: string;
  ariaLabel?: string;
  sections: Pick<DataCentersImpactSection, "id" | "eyebrow">[];
};

/**
 * Desktop (lg+) sidebar TOC. Renders `StickyInPageToc` directly (no extra wrapper `Box`) so
 * `position: sticky` stays on the flex child that the row lays out.
 */
export default function DataCentersSectionNav({ title, ariaLabel, sections }: DataCentersSectionNavProps) {
  const items = sections.map((s) => ({ id: s.id, label: s.eyebrow }));
  return <StickyInPageToc title={title} ariaLabel={ariaLabel ?? title} items={items} preset="dataCenters" />;
}
