/**
 * Hybrid content model for eptruth:
 * - Repo-managed: markdown facts + static source bibliography (JSON).
 * - CMS- or admin-ready: officials, candidates, stances, news links (JSON now, API later).
 *
 * Cross-references use opaque string IDs; loaders validate edges at build time.
 */

/** ISO 8601 calendar date (YYYY-MM-DD). */
export type ISODateString = string;

// ---------------------------------------------------------------------------
// Provenance (hybrid storage)
// ---------------------------------------------------------------------------

/** Where the canonical record is authored in the MVP stack. */
export type RepoProvenance = "repo";

/** Records intended to be overridden or synced from a CMS / admin API later. */
export type MutableProvenance = "cms";

/** Auto-fetched from an external RSS feed at request time. */
export type RssProvenance = "rss";

/** Auto-fetched from Reddit user submitted Atom feed. */
export type RedditProvenance = "reddit";

// ---------------------------------------------------------------------------
// Citations / sources (bibliography)
// ---------------------------------------------------------------------------

export type SourceKind =
  | "article"
  | "report"
  | "gov_doc"
  | "dataset"
  | "social"
  | "other";

/**
 * A citable source row. Stored in `content/sources/*.json` (or merged index).
 * UI maps this to CitationLinks / external-link treatment.
 */
export interface Source {
  id: string;
  kind: SourceKind;
  title: string;
  url: string;
  /**
   * `external` (default): new tab, external-link icon.
   * `download`: same-origin document (e.g. under `/public`); download affordance, no new tab.
   */
  linkBehavior?: "external" | "download";
  /** Suggested filename when `linkBehavior` is `download` (optional). */
  downloadFileName?: string;
  publisher?: string;
  /** When the source claims publication (if known). */
  publishedAt?: ISODateString;
  /** When the team last verified the URL / excerpt (recommended for fast-changing pages). */
  retrievedAt?: ISODateString;
  /** Optional “why this source matters” line for citation UI. */
  relevanceNote?: string;
  /** Preformatted citation line for print / accessibility. */
  citationLabel?: string;
  provenance: RepoProvenance;
}

// ---------------------------------------------------------------------------
// Facts (markdown + frontmatter)
// ---------------------------------------------------------------------------

/**
 * Expected YAML frontmatter for `content/facts/*.md`.
 * Body is markdown; frontmatter is validated by the content loader.
 */
export interface FactFrontmatter {
  id: string;
  /** URL-safe slug; unique across facts. */
  slug: string;
  title: string;
  /** Short plain-text or markdown snippet for cards / previews. */
  summary?: string;
  /** Bibliography entries that support claims in this fact. */
  citationIds: string[];
  tags?: string[];
  /** Editorial last review for stale-data hygiene. */
  lastReviewed?: ISODateString;
  provenance: RepoProvenance;
}

/** Runtime shape after loading a fact file (frontmatter + rendered or raw body). */
export interface FactDocument extends FactFrontmatter {
  /** Relative path from repo root or `content/facts`, depending on loader. */
  filePath: string;
  bodyMarkdown: string;
}

// ---------------------------------------------------------------------------
// Local government: officials, candidates, stances
// ---------------------------------------------------------------------------

export interface OfficialContact {
  /** Required so every official row has a stable contact field for UI and data hygiene. */
  email: string;
  phone?: string;
  /** Official .gov or board page. */
  officeUrl?: string;
}

/**
 * Elected or appointed representative record for `/local-government`.
 */
export interface Official {
  id: string;
  displayName: string;
  roleTitle: string;
  jurisdiction: string;
  contact: OfficialContact;
  imageUrl?: string;
  ballotpediaUrl?: string;
  /**
   * Next general or special election affecting this seat (ISO date).
   * UI shows an "Election this year" badge when this date's calendar year equals the current year (fallback when Legistar term end is absent). That indicates the seat's election cycle, not a filing to run.
   */
  nextElectionDate?: ISODateString;
  /** Stance rows keyed by this official. */
  stanceIds: string[];
  /** Sources backing role, contact, or biographical lines. */
  sourceIds: string[];
  provenance: RepoProvenance | MutableProvenance;
}

export interface ElectionCycle {
  id: string;
  label: string;
  electionDate?: ISODateString;
}

/**
 * Seasonal candidate row; gated in UI via `activeElectionCycleIds` on the bundle.
 */
export interface Candidate {
  id: string;
  displayName: string;
  officeSought: string;
  electionCycleId: string;
  party?: string;
  campaignWebsiteUrl?: string;
  ballotpediaUrl?: string;
  isIncumbent?: boolean;
  stanceIds: string[];
  sourceIds: string[];
  /** Hint for featuring in a “current race” block. */
  featured?: boolean;
  provenance: RepoProvenance | MutableProvenance;
}

export type StancePosition =
  | "support"
  | "oppose"
  | "neutral"
  | "unknown"
  | "mixed";

export type StanceSubject =
  | { type: "official"; officialId: string }
  | { type: "candidate"; candidateId: string };

/**
 * Opinion / policy position attributed to one official or candidate.
 * Always tied to sources for traceability.
 */
export interface Stance {
  id: string;
  /** Short issue key, e.g. `data-center-water`, `ai-infrastructure`. */
  topicKey: string;
  /** Human label for the topic in UI. */
  topicLabel: string;
  position: StancePosition;
  summary: string;
  asOf?: ISODateString;
  subject: StanceSubject;
  sourceIds: string[];
  provenance: RepoProvenance | MutableProvenance;
}

// ---------------------------------------------------------------------------
// News (curated external links)
// ---------------------------------------------------------------------------

/**
 * Curated outbound link for `/news` (outlets, Reddit threads, etc.).
 */
export interface NewsLink {
  id: string;
  headline: string;
  url: string;
  outlet: string;
  publishedAt?: ISODateString;
  summary?: string;
  tags?: string[];
  /** When this row also exists as a formal `Source`, link both. */
  sourceId?: string;
  /** Preview image from Reddit RSS `media:thumbnail` (or similar). */
  thumbnailUrl?: string;
  /** Hint for UI when the post links to Reddit-hosted video. */
  mediaHint?: "video" | "image";
  provenance: RepoProvenance | MutableProvenance | RssProvenance | RedditProvenance;
}

// ---------------------------------------------------------------------------
// JSON bundle shapes (files the app or CMS sync loads)
// ---------------------------------------------------------------------------

export interface SourcesBundle {
  schemaVersion: 1;
  sources: Source[];
}

/** One elected seat: current officeholder(s) and declared challengers for active cycles. */
export interface OfficeSeat {
  sitting: Official | null;
  running: Candidate[];
}

export interface CityGovernment {
  mayor: OfficeSeat;
  district1: OfficeSeat;
  district2: OfficeSeat;
  district3: OfficeSeat;
  district4: OfficeSeat;
  district5: OfficeSeat;
  district6: OfficeSeat;
  district7: OfficeSeat;
  district8: OfficeSeat;
}

export interface CountyGovernment {
  countyJudge: OfficeSeat;
  precinct1: OfficeSeat;
  precinct2: OfficeSeat;
  precinct3: OfficeSeat;
  precinct4: OfficeSeat;
}

/** Raw JSON (`content/data/local-government.json`) before normalization. */
export interface LocalGovernmentBundleJson {
  schemaVersion: 2;
  electionCycles: ElectionCycle[];
  /** Cycles shown in the “current candidates” section; empty = hide section. */
  activeElectionCycleIds: string[];
  /** Bundle-level candidates (e.g. seasonal races not tied to a seat). */
  candidates: Candidate[];
  city: CityGovernment;
  county: CountyGovernment;
  stances: Stance[];
}

/**
 * Normalized bundle returned by `loadLocalGovernmentBundle()`:
 * includes flattened `officials` and merged `candidates` (bundle + per-seat `running`).
 */
export interface LocalGovernmentBundle extends LocalGovernmentBundleJson {
  officials: Official[];
}

export interface NewsBundle {
  schemaVersion: 1;
  links: NewsLink[];
}

/** Maps to MUI icons on the data-centers page; optional per section in JSON. */
export type DataCentersSectionIconKey =
  | "map"
  | "water"
  | "bolt"
  | "air"
  | "heat"
  | "volume"
  | "balance"
  | "gavel"
  | "shield-alert"
  | "eye-off";

export interface DataCentersStatItem {
  label: string;
  value: string;
  hint?: string;
}

/** Titled list block (e.g. health vs wildlife) inside a data-centers section. */
export interface DataCentersBulletGroup {
  title: string;
  /** Optional lead sentence before the list. */
  lead?: string;
  items: string[];
}

/** Primary document offered from `public/` (e.g. PDF), shown after Takeaways. */
export interface DataCentersSectionDownload {
  /** Path under `/`, e.g. `/documents/agreement.pdf`. */
  href: string;
  label: string;
  /** Suggested filename when the browser saves the file (optional). */
  fileName?: string;
}

/** Long-form explainer loaded from `content/data/data-centers-impacts.json`. */
export interface DataCentersImpactSection {
  id: string;
  eyebrow: string;
  title: string;
  /** Body paragraphs; omit or use [] for a section that only has lists or stats. */
  paragraphs?: string[];
  /** Optional prose after `bulletGroups` (e.g. closing line before citations). */
  paragraphsAfterLists?: string[];
  /** Optional grouped lists with headings (rendered after `paragraphs`). */
  bulletGroups?: DataCentersBulletGroup[];
  bullets?: string[];
  /** Source ids for `CitationLinks` and `[cite: N]` in copy; omit or [] if none. */
  sourceIds?: string[];
  /**
   * Icon key for the section header. Known keys are listed in `DataCentersSectionIconKey`;
   * unknown keys fall back to a generic icon at render time.
   */
  icon?: string;
  /** Short key figures shown above body copy. */
  stats?: DataCentersStatItem[];
  /**
   * Short lines for homepage Quick facts (`buildHomeQuickFactsFromImpacts` uses `highlights[0]` / `[1]`).
   * Keep wording tuned for that grid.
   */
  highlights?: string[];
  /**
   * Takeaway chips on the data centers page (shown under "Takeaways"). When omitted, `highlights` is used.
   * Use this when chip copy should differ from homepage quick-fact lines.
   */
  takeaways?: string[];
  /** Optional PDF or other file download (after Takeaways). */
  download?: DataCentersSectionDownload;
}

export interface DataCentersNoiseTableRow {
  jurisdiction: string;
  dayDb: string;
  nightDb: string;
  measurementPoint: string;
  sourceNote: string;
}

export interface DataCentersEconomicTableRow {
  project: string;
  investment: string;
  promisedJobs: string;
  actualOrRevisedJobs: string;
  sourceNote: string;
}

/** Inline `[cite: N]` in caption or cells resolves against these sources in order (N is 1-based). */
export interface DataCentersNoiseTable {
  caption: string;
  sourceIds?: string[];
  rows: DataCentersNoiseTableRow[];
}

export interface DataCentersEconomicTable {
  caption: string;
  sourceIds?: string[];
  rows: DataCentersEconomicTableRow[];
}

export interface DataCentersImpactsBundle {
  schemaVersion: 1;
  sections: DataCentersImpactSection[];
  /** Omit when the page should not show the noise comparison table. */
  noiseTable?: DataCentersNoiseTable;
  /** Omit when the page should not show the economic comparison table. */
  economicTable?: DataCentersEconomicTable;
}

/** Facts may be loaded per-file; optional index for search / sitemap. */
export interface FactsIndexBundle {
  schemaVersion: 1;
  /** Slugs or ids of fact files included in static generation. */
  entries: Array<Pick<FactFrontmatter, "id" | "slug" | "title"> & { filePath: string }>;
}
