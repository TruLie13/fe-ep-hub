import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import CitationLinks from "@/components/common/CitationLinks";
import PageHero from "@/components/common/PageHero";
import PageHeroMetaRow from "@/components/common/PageHeroMetaRow";
import PrintSectionButton from "@/components/common/PrintSectionButton";
import JsonLd from "@/components/seo/JsonLd";
import LearnToc from "@/components/learn/LearnToc";
import { dict } from "@/lib/i18n/dictionary";
import type { LearnSection } from "@/lib/learn/sections";
import { loadSourcesBundle, pickSources } from "@/lib/content/load";
import { buildPageJsonLd, buildPageMetadata } from "@/lib/seo/site";

const LEARN_SEO = {
  title: "Learn",
  description:
    "Plain-language explainers about data centers, AI, water use, and how to read local infrastructure proposals.",
  path: "/learn",
  schemaType: "CollectionPage",
} as const;

export const metadata: Metadata = buildPageMetadata(LEARN_SEO);

/** Section cards: match data-centers (`borderRadius: 3` × theme.shape.borderRadius) + hash scroll offset below sticky MainNav. */
const learnSectionCardSx = { borderRadius: 3 } as const;
const learnAnchorSx = { scrollMarginTop: 96, ...learnSectionCardSx } as const;

type LearnSectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

function LearnSectionHeader({
  eyebrow,
  title,
  description,
  children,
}: LearnSectionHeaderProps) {
  return (
    <Box>
      <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: "0.16em", color: "text.secondary" }}>
        {eyebrow}
      </Typography>
      <Typography component="h2" variant="h3" sx={{ mt: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: "68ch" }}>
        {description}
      </Typography>
      {children}
    </Box>
  );
}

type LearnContentCardProps = {
  id: string;
  title: string;
  children: ReactNode;
  citations?: ReactNode;
};

function LearnContentCard({ id, title, children, citations }: LearnContentCardProps) {
  return (
    <Card variant="outlined" sx={learnAnchorSx} id={id}>
      <CardContent>
        <Typography component="h3" variant="h6" gutterBottom>
          {title}
        </Typography>
        {children}
        {citations ? <Box sx={{ mt: 2 }}>{citations}</Box> : null}
      </CardContent>
    </Card>
  );
}

export default function LearnPage() {
  const t = dict();
  const bundle = loadSourcesBundle();
  const src = (ids: string[]) => pickSources(bundle, ids);

  const tocSections: LearnSection[] = t.learn.sections.map((s) => ({
    id: s.id,
    title: s.title,
    eyebrow: s.eyebrow,
    sourceIds: [],
    subsections: s.subsections.map((sub) => ({
      id: sub.id,
      title: sub.title,
      sourceIds: [],
    })),
  }));

  const d = t.learn.dc;
  const a = t.learn.ai;
  const rp = t.learn.realProblems;
  const ll = t.learn.localLens;
  const eg = t.learn.engage;
  const gl = t.learn.glossary;
  const re = t.learn.regionalEvidence;

  return (
    <Box id="printable-learn" className="printable-root">
      <JsonLd data={buildPageJsonLd(LEARN_SEO)} />
      <PageHero
        title={t.learn.title}
        subtitle={t.learn.subtitle}
        meta={
          <PageHeroMetaRow>
            <PrintSectionButton sectionId="printable-learn" label={t.common.printSavePdf} />
          </PageHeroMetaRow>
        }
      />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      {/* Mobile compact TOC */}
      <Box sx={{ display: { md: "none" }, mb: 3, "@media print": { display: "none" } }}>
        <LearnToc sections={tocSections} />
      </Box>

      <Box sx={{ display: { xs: "block", md: "flex" }, gap: { md: 4 } }}>
        {/* Sticky sidebar TOC — visible md+ */}
        <Box
          component="aside"
          sx={{
            display: { xs: "none", md: "block" },
            width: { md: 260 },
            flexShrink: 0,
            "@media print": { display: "none" },
          }}
        >
          <LearnToc sections={tocSections} />
        </Box>

        {/* Main content column */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack spacing={6}>

            {/* ------------------------------------------------------------------ */}
            {/* TRACK 1 — Data centers */}
            {/* ------------------------------------------------------------------ */}
            <Stack component="section" id="data-centers" spacing={3} sx={learnAnchorSx}>
              <LearnSectionHeader eyebrow={d.eyebrow} title={d.title} description={d.description} />

              <LearnContentCard
                id="dc-what"
                title={d.whatTitle}
                citations={<CitationLinks title={t.learn.learnMoreLabel} sources={src(["cisco-what-is-a-data-center", "wikipedia-data-center"])} />}
              >
                <Typography variant="body2" color="text.secondary" paragraph>
                  {d.whatP1}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {d.whatP2}
                </Typography>
              </LearnContentCard>

              <LearnContentCard
                id="dc-history"
                title={d.historyTitle}
                citations={<CitationLinks title={t.learn.learnMoreLabel} sources={src(["dc-history-impactcp"])} />}
              >
                <Typography variant="body2" color="text.secondary" paragraph>
                  {d.historyP1}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {d.historyP2}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {d.historyP3}
                </Typography>
              </LearnContentCard>

              <LearnContentCard
                id="dc-not-the-enemy"
                title={d.badTitle}
                citations={<CitationLinks title={t.learn.learnMoreLabel} sources={src(["dc-uptime-benefits"])} />}
              >
                <Typography variant="body2" color="text.secondary" paragraph>
                  {d.badP1}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {d.badP2}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {d.badP3}
                </Typography>
              </LearnContentCard>
            </Stack>

            <Divider />

            {/* ------------------------------------------------------------------ */}
            {/* TRACK 2 — AI & machine learning */}
            {/* ------------------------------------------------------------------ */}
            <Stack component="section" id="artificial-intelligence" spacing={3} sx={learnAnchorSx}>
              <LearnSectionHeader eyebrow={a.eyebrow} title={a.title} description={a.description} />

              <LearnContentCard
                id="ai-what"
                title={a.whatTitle}
                citations={<CitationLinks title={t.learn.learnMoreLabel} sources={src(["ai-ibm-overview"])} />}
              >
                <Typography variant="body2" color="text.secondary" paragraph>
                  {a.whatP1}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {a.whatP2}
                </Typography>
              </LearnContentCard>

              <LearnContentCard
                id="ai-history"
                title={a.historyTitle}
                citations={<CitationLinks title={t.learn.learnMoreLabel} sources={src(["ai-ibm-history", "ai-turing-1950"])} />}
              >
                <Typography variant="body2" color="text.secondary" paragraph>
                  {a.historyP1}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {a.historyP2}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {a.historyP3}
                </Typography>
              </LearnContentCard>

              <LearnContentCard
                id="ai-everyday"
                title={a.everydayTitle}
                citations={<CitationLinks title={t.learn.learnMoreLabel} sources={src(["ai-tableau-everyday-examples"])} />}
              >
                <Typography variant="body2" color="text.secondary" paragraph>
                  {a.everydayIntro}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                  {a.everydayChips.map((label) => (
                    <Chip key={label} label={label} size="small" variant="outlined" />
                  ))}
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {a.everydayOutro}
                </Typography>
              </LearnContentCard>
            </Stack>

            <Divider />

            {/* ------------------------------------------------------------------ */}
            {/* SYNTHESIS — The real problems */}
            {/* ------------------------------------------------------------------ */}
            <Stack component="section" id="real-problems" spacing={3} sx={learnAnchorSx}>
              <LearnSectionHeader eyebrow={rp.eyebrow} title={rp.title} description={rp.description}>
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" href="/data-center" endIcon={<ArrowForwardRoundedIcon />}>
                    {re.fullAnalysisCta}
                  </Button>
                </Box>
              </LearnSectionHeader>

              <LearnContentCard
                id="rp-siting"
                title={rp.sitingTitle}
                citations={<CitationLinks title={t.learn.learnMoreLabel} sources={src(["wri-data-center-us-communities-2026"])} />}
              >
                <Typography variant="body2" color="text.secondary" paragraph>
                  {rp.sitingP1}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {rp.sitingP2}
                </Typography>
              </LearnContentCard>

              <LearnContentCard
                id="rp-hype"
                title={rp.hypeTitle}
                citations={<CitationLinks title={t.learn.learnMoreLabel} sources={src(["ai-overuse-dataethics", "ai-washing-bbc"])} />}
              >
                <Typography variant="body2" color="text.secondary" paragraph>
                  {rp.hypeP1}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {rp.hypeP2}
                </Typography>
              </LearnContentCard>

              <LearnContentCard
                id="rp-governance"
                title={rp.govTitle}
                citations={<CitationLinks title={t.learn.learnMoreLabel} sources={src(["dc-global-regs-hwg", "dc-aljazeera-lawmakers-pause"])} />}
              >
                <Typography variant="body2" color="text.secondary" paragraph>
                  {rp.govP1}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {rp.govP2}
                </Typography>
              </LearnContentCard>
            </Stack>

            <Divider />

            {/* ------------------------------------------------------------------ */}
            {/* LOCAL LENS — El Paso */}
            {/* ------------------------------------------------------------------ */}
            <Stack component="section" id="local-lens" spacing={3} sx={learnAnchorSx}>
              <LearnSectionHeader eyebrow={ll.eyebrow} title={ll.title} description={ll.description} />

              <LearnContentCard
                id="ll-water-stress"
                title={ll.waterTitle}
                citations={<CitationLinks title={t.learn.learnMoreLabel} sources={src(["el-paso-water-resources", "el-paso-oem-drought"])} />}
              >
                <Typography variant="body2" color="text.secondary" paragraph>
                  {ll.waterP1}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
                  {ll.waterP2}
                </Typography>
              </LearnContentCard>

              <LearnContentCard
                id="ll-grid"
                title={ll.gridTitle}
                citations={<CitationLinks title={t.learn.learnMoreLabel} sources={src(["texas-grid-rules-argus", "el-paso-electric-grid-ainvest"])} />}
              >
                <Typography variant="body2" color="text.secondary" paragraph>
                  {ll.gridP1}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ll.gridP2}
                </Typography>
              </LearnContentCard>
            </Stack>

            <Divider />

            {/* ------------------------------------------------------------------ */}
            {/* CIVIC TOOLKIT — How to engage */}
            {/* ------------------------------------------------------------------ */}
            <Stack component="section" id="how-to-engage" spacing={3} sx={learnAnchorSx}>
              <LearnSectionHeader eyebrow={eg.eyebrow} title={eg.title} description={eg.description} />

              <LearnContentCard
                id="engage-checklist"
                title={eg.checklistTitle}
                citations={<CitationLinks title={t.learn.learnMoreLabel} sources={src(["usgs-water-use", "doe-datacenter-energy"])} />}
              >
                <Stack spacing={1.5}>
                  {eg.questions.map((item, i) => (
                    <Box key={item.q}>
                      <Typography variant="subtitle2">
                        {i + 1}. {item.q}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.detail}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </LearnContentCard>

              <LearnContentCard
                id="engage-hearings"
                title={eg.hearingsTitle}
              >
                <Typography variant="body2" color="text.secondary" paragraph>
                  {eg.hearingsP1}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {eg.hearingsP2}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" href="/city-meetings" endIcon={<ArrowForwardRoundedIcon />}>
                    Open the city meetings page
                  </Button>
                </Box>
              </LearnContentCard>
            </Stack>

            <Divider />

            {/* ------------------------------------------------------------------ */}
            {/* GLOSSARY */}
            {/* ------------------------------------------------------------------ */}
            <Stack component="section" id="glossary" spacing={3} sx={learnAnchorSx}>
              <LearnSectionHeader eyebrow={gl.eyebrow} title={gl.title} description={gl.description} />

              <Grid container spacing={2}>
                {gl.entries.map((entry) => (
                  <Grid key={entry.term} size={{ xs: 12, sm: 6 }}>
                    <Card variant="outlined" sx={{ height: "100%", ...learnSectionCardSx }}>
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          {entry.term}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {entry.definition}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Stack>

          </Stack>
        </Box>
      </Box>
    </Container>
    </Box>
  );
}
