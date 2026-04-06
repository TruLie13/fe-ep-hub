import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import CitationLinks from "@/components/common/CitationLinks";
import FactCard from "@/components/common/FactCard";
import SectionShell from "@/components/common/SectionShell";
import { buildHomeQuickFactsFromImpacts } from "@/lib/content/home-quick-facts";
import { loadDataCentersImpacts, loadSourcesBundle, pickSources } from "@/lib/content/load";
import { dict } from "@/lib/i18n/dictionary";

export default function Home() {
  const t = dict();
  const sources = loadSourcesBundle();
  const waterSources = pickSources(sources, ["usgs-water-use", "doe-datacenter-energy"]);
  const impacts = loadDataCentersImpacts();
  const quickFacts = buildHomeQuickFactsFromImpacts(impacts.sections).map((fact) => ({
    ...fact,
    tone: "warning" as const,
  }));

  return (
    <Box id="printable-home" className="printable-root">
      {/* Flat hero: solid surface, typographic focus — no decorative gradients */}
      <Box
        sx={{
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 11 } }}>
          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="flex-start">
            <Grid size={{ xs: 12 }}>
              <Stack spacing={{ xs: 3.5, md: 3 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 4,
                    borderRadius: 1,
                    bgcolor: "primary.main",
                  }}
                  aria-hidden
                />
                <Typography component="h1" variant="h1">
                  {t.home.heroTitle}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "min(70ch, 100%)", fontSize: { md: "1.125rem" } }}>
                  {t.home.heroSubtitle}
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "center" }} flexWrap="wrap" useFlexGap>
                  <Button variant="contained" size="large" href="/learn" endIcon={<ArrowForwardRoundedIcon />}>
                    {t.home.startLearning}
                  </Button>
                  <Button variant="outlined" size="large" href="/data-center" endIcon={<ArrowForwardRoundedIcon />}>
                    {t.home.viewRegionalImpacts}
                  </Button>
                  <Button variant="outlined" size="large" href="/pledge">
                    {t.home.takePledge}
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 10 } }}>
        <SectionShell
          eyebrow={t.home.quickFacts.eyebrow}
          title={t.home.quickFacts.title}
          description={t.home.quickFacts.description}
        >
          <Grid container spacing={2}>
            {quickFacts.map((fact) => (
              <Grid key={fact.href} size={{ xs: 12, sm: 6, md: 4 }}>
                <FactCard {...fact} />
              </Grid>
            ))}
          </Grid>
        </SectionShell>
      </Container>

      <SectionShell
        band
        eyebrow={t.home.waterImpact.eyebrow}
        title={t.home.waterImpact.title}
        description={t.home.waterImpact.description}
      >
        <Card variant="outlined">
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} alignItems={{ sm: "flex-start" }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "action.hover",
                  color: "warning.main",
                  flexShrink: 0,
                }}
              >
                <WaterDropRoundedIcon sx={{ fontSize: 28 }} />
              </Box>
              <Stack spacing={2}>
                <Typography variant="body1" color="text.secondary">
                  {t.home.waterImpact.body}
                </Typography>
                <CitationLinks title={t.common.sources} sources={waterSources} />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </SectionShell>

      <Container maxWidth="lg" sx={{ pt: { xs: 5, md: 7 }, pb: { xs: 1, md: 2 } }}>
        <SectionShell
          eyebrow={t.home.howItWorks.eyebrow}
          title={t.home.howItWorks.title}
          description={t.home.howItWorks.description}
          dense
        >
          <Grid container spacing={2}>
            {t.home.howItWorks.steps.map((step, index) => (
              <Grid key={step.href} size={{ xs: 12, md: 4 }}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 1.5, height: "100%" }}>
                    <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700, letterSpacing: "0.12em" }}>
                      {String(index + 1).padStart(2, "0")}
                    </Typography>
                    <Typography variant="h6" component="h3">
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                      {step.body}
                    </Typography>
                    <Stack direction="column" spacing={1} alignItems="flex-start" sx={{ pt: 0.5 }}>
                      <Button href={step.href} size="small" endIcon={<ArrowForwardRoundedIcon />}>
                        {step.linkLabel}
                      </Button>
                      {"secondaryHref" in step && step.secondaryHref ? (
                        <Button href={step.secondaryHref} size="small" variant="text" endIcon={<ArrowForwardRoundedIcon />}>
                          {step.secondaryLinkLabel}
                        </Button>
                      ) : null}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </SectionShell>
      </Container>
    </Box>
  );
}
