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
  Link,
  Stack,
  Typography,
} from "@mui/material";
import type { Metadata } from "next";
import CitationLinks from "@/components/common/CitationLinks";
import PageHero from "@/components/common/PageHero";
import PageHeroMetaRow from "@/components/common/PageHeroMetaRow";
import PrintSectionButton from "@/components/common/PrintSectionButton";
import LearnToc from "@/components/learn/LearnToc";
import { dict } from "@/lib/i18n/dictionary";
import type { LearnSection } from "@/lib/learn/sections";
import { loadSourcesBundle, pickSources } from "@/lib/content/load";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Plain-language explainers about data centers, AI, water use, and how to read local infrastructure proposals.",
};

/** Same as data-centers section boxes: offset #hash scroll so targets sit below the sticky MainNav. */
const learnAnchorSx = { scrollMarginTop: 96 } as const;

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
              <Box>
                <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: "0.16em", color: "text.secondary" }}>
                  {d.eyebrow}
                </Typography>
                <Typography component="h2" variant="h3" sx={{ mt: 0.5 }}>
                  {d.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: "68ch" }}>
                  {d.description}
                </Typography>
              </Box>

              <Card variant="outlined" sx={learnAnchorSx} id="dc-what">
                <CardContent>
                  <Typography component="h3" variant="h6" gutterBottom>{d.whatTitle}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {d.whatP1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {d.whatP2}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <CitationLinks sources={src(["doe-datacenter-energy"])} />
                  </Box>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={learnAnchorSx} id="dc-history">
                <CardContent>
                  <Typography component="h3" variant="h6" gutterBottom>{d.historyTitle}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {d.historyP1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {d.historyP2}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {d.historyP3}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <CitationLinks sources={src(["dc-history-computerworld"])} />
                  </Box>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={learnAnchorSx} id="dc-not-the-enemy">
                <CardContent>
                  <Typography component="h3" variant="h6" gutterBottom>{d.badTitle}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {d.badP1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {d.badP2}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {d.badP3}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <CitationLinks sources={src(["doe-datacenter-energy", "dc-uptime-benefits"])} />
                  </Box>
                </CardContent>
              </Card>
            </Stack>

            <Divider />

            {/* ------------------------------------------------------------------ */}
            {/* TRACK 2 — AI & machine learning */}
            {/* ------------------------------------------------------------------ */}
            <Stack component="section" id="artificial-intelligence" spacing={3} sx={learnAnchorSx}>
              <Box>
                <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: "0.16em", color: "text.secondary" }}>
                  {a.eyebrow}
                </Typography>
                <Typography component="h2" variant="h3" sx={{ mt: 0.5 }}>
                  {a.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: "68ch" }}>
                  {a.description}
                </Typography>
              </Box>

              <Card variant="outlined" sx={learnAnchorSx} id="ai-what">
                <CardContent>
                  <Typography component="h3" variant="h6" gutterBottom>{a.whatTitle}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {a.whatP1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {a.whatP2}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <CitationLinks sources={src(["ai-stanford-overview"])} />
                  </Box>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={learnAnchorSx} id="ai-history">
                <CardContent>
                  <Typography component="h3" variant="h6" gutterBottom>{a.historyTitle}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {a.historyP1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {a.historyP2}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {a.historyP3}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <CitationLinks sources={src(["ai-stanford-overview", "ai-turing-1950"])} />
                  </Box>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={learnAnchorSx} id="ai-everyday">
                <CardContent>
                  <Typography component="h3" variant="h6" gutterBottom>{a.everydayTitle}</Typography>
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
                  <Box sx={{ mt: 2 }}>
                    <CitationLinks sources={src(["ai-stanford-overview"])} />
                  </Box>
                </CardContent>
              </Card>
            </Stack>

            <Divider />

            {/* ------------------------------------------------------------------ */}
            {/* SYNTHESIS — The real problems */}
            {/* ------------------------------------------------------------------ */}
            <Stack component="section" id="real-problems" spacing={3} sx={learnAnchorSx}>
              <Box>
                <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: "0.16em", color: "text.secondary" }}>
                  {rp.eyebrow}
                </Typography>
                <Typography component="h2" variant="h3" sx={{ mt: 0.5 }}>
                  {rp.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: "68ch" }}>
                  {rp.description}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, maxWidth: "68ch" }}>
                  {rp.overviewDetailLead}
                  <Link href="/data-centers" color="primary" underline="hover" fontWeight={600}>
                    {rp.overviewDetailLinkLabel}
                  </Link>
                  .
                </Typography>
              </Box>

              <Card variant="outlined" sx={learnAnchorSx} id="rp-siting">
                <CardContent>
                  <Typography component="h3" variant="h6" gutterBottom>{rp.sitingTitle}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {rp.sitingP1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {rp.sitingP2}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <CitationLinks sources={src(["usgs-water-use", "doe-datacenter-energy"])} />
                  </Box>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={learnAnchorSx} id="rp-hype">
                <CardContent>
                  <Typography component="h3" variant="h6" gutterBottom>{rp.hypeTitle}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {rp.hypeP1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {rp.hypeP2}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <CitationLinks sources={src(["ai-stanford-overview"])} />
                  </Box>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={learnAnchorSx} id="rp-governance">
                <CardContent>
                  <Typography component="h3" variant="h6" gutterBottom>{rp.govTitle}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {rp.govP1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {rp.govP2}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <CitationLinks sources={src(["epa-ej", "cisa-critical-infra"])} />
                  </Box>
                </CardContent>
              </Card>
            </Stack>

            <Divider />

            {/* ------------------------------------------------------------------ */}
            {/* LOCAL LENS — El Paso */}
            {/* ------------------------------------------------------------------ */}
            <Stack component="section" id="local-lens" spacing={3} sx={learnAnchorSx}>
              <Box>
                <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: "0.16em", color: "text.secondary" }}>
                  {ll.eyebrow}
                </Typography>
                <Typography component="h2" variant="h3" sx={{ mt: 0.5 }}>
                  {ll.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: "68ch" }}>
                  {ll.description}
                </Typography>
              </Box>

              <Card variant="outlined" sx={learnAnchorSx} id="ll-water-stress">
                <CardContent>
                  <Typography component="h3" variant="h6" gutterBottom>{ll.waterTitle}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {ll.waterP1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
                    {ll.waterP2}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <CitationLinks sources={src(["usgs-water-use"])} />
                  </Box>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={learnAnchorSx} id="ll-grid">
                <CardContent>
                  <Typography component="h3" variant="h6" gutterBottom>{ll.gridTitle}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {ll.gridP1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ll.gridP2}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <CitationLinks sources={src(["doe-datacenter-energy"])} />
                  </Box>
                </CardContent>
              </Card>
            </Stack>

            <Divider />

            {/* ------------------------------------------------------------------ */}
            {/* REGIONAL EVIDENCE */}
            {/* ------------------------------------------------------------------ */}
            <Stack component="section" id="regional-evidence" spacing={3} sx={learnAnchorSx}>
              <Box>
                <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: "0.16em", color: "text.secondary" }}>
                  {re.eyebrow}
                </Typography>
                <Typography component="h2" variant="h3" sx={{ mt: 0.5 }}>
                  {re.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: "68ch" }}>
                  {re.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" href="/data-centers" endIcon={<ArrowForwardRoundedIcon />}>
                    {re.fullAnalysisCta}
                  </Button>
                </Box>
              </Box>

              <Card variant="outlined" sx={learnAnchorSx} id="re-water">
                <CardContent>
                  <Typography component="h3" variant="h6" gutterBottom>{re.waterTitle}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {re.waterP1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {re.waterP2}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <CitationLinks sources={src(["usgs-water-use", "meta-sustainability-water", "abq-journal-meta-los-lunas-water"])} />
                  </Box>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={learnAnchorSx} id="re-energy">
                <CardContent>
                  <Typography component="h3" variant="h6" gutterBottom>{re.energyTitle}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {re.energyP1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {re.energyP2}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <CitationLinks sources={src(["texas-tribune-meta-gas-2026", "el-paso-matters-meta-epe-filings", "google-24-7-carbon-free"])} />
                  </Box>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={learnAnchorSx} id="re-air">
                <CardContent>
                  <Typography component="h3" variant="h6" gutterBottom>{re.airTitle}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {re.airP1}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <CitationLinks sources={src(["epa-green-book-nonattainment", "virginia-data-center-air-quality-study"])} />
                  </Box>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={learnAnchorSx} id="re-noise">
                <CardContent>
                  <Typography component="h3" variant="h6" gutterBottom>{re.noiseTitle}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {re.noiseP1}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <CitationLinks sources={src(["phoenix-data-center-staff-report-2025", "el-paso-noise-ordinance"])} />
                  </Box>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={learnAnchorSx} id="re-jobs">
                <CardContent>
                  <Typography component="h3" variant="h6" gutterBottom>{re.jobsTitle}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {re.jobsP1}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <CitationLinks sources={src(["good-jobs-first-clawbacks", "el-paso-matters-meta-epe-filings"])} />
                  </Box>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={learnAnchorSx} id="re-mandates">
                <CardContent>
                  <Typography component="h3" variant="h6" gutterBottom>{re.mandatesTitle}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {re.mandatesP1}
                  </Typography>
                  <Button href="/data-centers#recommendations" size="small" endIcon={<ArrowForwardRoundedIcon />}>
                    {re.mandatesLink}
                  </Button>
                </CardContent>
              </Card>
            </Stack>

            <Divider />

            {/* ------------------------------------------------------------------ */}
            {/* CIVIC TOOLKIT — How to engage */}
            {/* ------------------------------------------------------------------ */}
            <Stack component="section" id="how-to-engage" spacing={3} sx={learnAnchorSx}>
              <Box>
                <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: "0.16em", color: "text.secondary" }}>
                  {eg.eyebrow}
                </Typography>
                <Typography component="h2" variant="h3" sx={{ mt: 0.5 }}>
                  {eg.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: "68ch" }}>
                  {eg.description}
                </Typography>
              </Box>

              <Card variant="outlined" sx={learnAnchorSx} id="engage-checklist">
                <CardContent>
                  <Typography variant="h6" gutterBottom>{eg.checklistTitle}</Typography>
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
                  <Box sx={{ mt: 2 }}>
                    <CitationLinks sources={src(["usgs-water-use", "doe-datacenter-energy"])} />
                  </Box>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={learnAnchorSx} id="engage-hearings">
                <CardContent>
                  <Typography component="h3" variant="h6" gutterBottom>{eg.hearingsTitle}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {eg.hearingsP1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {eg.hearingsP2}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <CitationLinks sources={src(["epa-ej"])} />
                  </Box>
                </CardContent>
              </Card>
            </Stack>

            <Divider />

            {/* ------------------------------------------------------------------ */}
            {/* GLOSSARY */}
            {/* ------------------------------------------------------------------ */}
            <Stack component="section" id="glossary" spacing={3} sx={learnAnchorSx}>
              <Box>
                <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: "0.16em", color: "text.secondary" }}>
                  {gl.eyebrow}
                </Typography>
                <Typography component="h2" variant="h3" sx={{ mt: 0.5 }}>
                  {gl.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: "68ch" }}>
                  {gl.description}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {gl.entries.map((entry) => (
                  <Grid key={entry.term} size={{ xs: 12, sm: 6 }}>
                    <Card variant="outlined" sx={{ height: "100%" }}>
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
