import type { DataCentersImpactSection } from "@/content/schema";

const EXCLUDED_SECTION_IDS = new Set(["introduction", "recommendations"]);

export type HomeQuickFact = {
  label: string;
  title: string;
  description: string;
  href: string;
  /** Matches `DataCentersImpactSection.icon` for shared section icons. */
  iconKey?: string | null;
};

function stripBoldMarkers(text: string): string {
  return text.replace(/\*\*/g, "").trim();
}

/** First sentence or trimmed paragraph (no markdown blocks). */
function firstSentenceFromParagraph(text: string, maxLen = 220): string {
  const stripped = stripBoldMarkers(text);
  const dot = stripped.search(/\.(?:\s|$)/);
  if (dot > 0) {
    return stripped.slice(0, dot + 1).trim();
  }
  if (stripped.length <= maxLen) return stripped;
  return `${stripped.slice(0, maxLen).trim()}…`;
}

function buildDescription(
  section: DataCentersImpactSection,
  title: string,
): string {
  const highlights = section.highlights ?? [];
  if (highlights[1]) {
    const second = stripBoldMarkers(highlights[1]);
    if (second && second !== title) return second;
  }

  const stats = section.stats ?? [];
  if (stats.length > 0) {
    const s = stats[0];
    return stripBoldMarkers(`${s.label}: ${s.value}`);
  }

  const paragraphs = section.paragraphs ?? [];
  if (paragraphs[0]) {
    return firstSentenceFromParagraph(paragraphs[0]);
  }

  return stripBoldMarkers(section.title);
}

/**
 * One homepage quick-fact card per included data-centers section, in JSON order.
 * Links use `/data-centers#[id]` to match section anchors on the impacts page.
 */
export function buildHomeQuickFactsFromImpacts(sections: DataCentersImpactSection[]): HomeQuickFact[] {
  return sections
    .filter((s) => !EXCLUDED_SECTION_IDS.has(s.id))
    .map((section) => {
      const highlights = section.highlights ?? [];
      const title = highlights[0] ? stripBoldMarkers(highlights[0]) : stripBoldMarkers(section.title);
      let description = buildDescription(section, title);
      if (!description || description === title) {
        const paragraphs = section.paragraphs ?? [];
        if (paragraphs[0]) {
          description = firstSentenceFromParagraph(paragraphs[0]);
        }
        if (description === title) {
          description = stripBoldMarkers(section.title);
        }
      }

      return {
        label: stripBoldMarkers(section.eyebrow),
        title,
        description,
        href: `/data-centers#${section.id}`,
        iconKey: section.icon ?? null,
      };
    });
}
