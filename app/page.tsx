import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import FactCard from "@/components/common/FactCard";
import SectionShell from "@/components/common/SectionShell";
import { buildHomeQuickFactsFromImpacts } from "@/lib/content/home-quick-facts";
import { loadDataCentersImpacts } from "@/lib/content/load";
import { dict } from "@/lib/i18n/dictionary";
import { getMainNavItems } from "@/lib/navigation/main-nav-items";

export default function Home() {
  const t = dict();
  const impacts = loadDataCentersImpacts();
  const quickFacts = buildHomeQuickFactsFromImpacts(impacts.sections).map((fact) => ({
    ...fact,
    tone: "warning" as const,
  }));
  const howItWorksCards = [
    ...getMainNavItems(t.nav),
    { href: "/take-action", label: t.nav.takeAction },
  ]
    .filter((item) => item.href !== "/")
    .map((item) => ({
      ...item,
      body:
        t.home.howItWorks.overviewByHref[
          item.href as keyof typeof t.home.howItWorks.overviewByHref
        ] ?? t.home.howItWorks.description,
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
                  <Button
                    variant="contained"
                    size="large"
                    href="/learn"
                    endIcon={<ArrowForwardRoundedIcon />}
                    sx={{
                      color: "#000000 !important",
                      "&:hover": { color: "#000000 !important" },
                      "&:focusVisible": { color: "#000000 !important" },
                    }}
                  >
                    {t.home.startLearning}
                  </Button>
                  <Button variant="outlined" size="large" href="/data-center" endIcon={<ArrowForwardRoundedIcon />}>
                    {t.home.viewRegionalImpacts}
                  </Button>
                  {/*
                    <Button variant="outlined" size="large" href="/pledge">
                      {t.home.takePledge}
                    </Button>
                  */}
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: { xs: 3, md: 4 } }}>
        <SectionShell
          eyebrow={t.home.quickFacts.eyebrow}
          title={t.home.quickFacts.title}
          description={t.home.quickFacts.description}
        >
          <Grid container spacing={2}>
            {quickFacts.map((fact) => (
              <Grid key={fact.href} size={{ xs: 12, sm: 6, md: 4 }}>
                <FactCard {...fact} ctaLabel={t.home.quickFacts.readFullSection} />
              </Grid>
            ))}
          </Grid>
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ pt: 0.5, color: "primary.main" }}>
            <Typography
              component="a"
              href="/data-center"
              variant="body2"
              sx={{
                fontWeight: 700,
                color: "primary.main",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {t.home.quickFacts.readFullPage}
            </Typography>
            <ArrowForwardRoundedIcon sx={{ fontSize: "1rem" }} />
          </Stack>
        </SectionShell>
      </Container>

      {/*
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
      */}

      <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 3 }, pb: { xs: 1, md: 2 } }}>
        <SectionShell
          eyebrow={t.home.howItWorks.eyebrow}
          title={t.home.howItWorks.title}
          description={t.home.howItWorks.description}
          dense
        >
          <Grid container spacing={2}>
            {howItWorksCards.map((card, index) => {
              const isTakeAction = card.href === "/take-action";
              return (
              <Grid
                key={card.href}
                size={{ xs: 12, md: isTakeAction ? 12 : 4 }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    ...(isTakeAction
                      ? {
                          position: "relative",
                          overflow: "hidden",
                          backgroundImage: {
                            xs: "linear-gradient(90deg, rgba(6,13,30,0.96) 0%, rgba(6,13,30,0.88) 42%, rgba(6,13,30,0.72) 72%, rgba(6,13,30,0.58) 100%), url('/images/protest_image.webp')",
                            md: "linear-gradient(90deg, rgba(6,13,30,0.90) 0%, rgba(6,13,30,0.80) 40%, rgba(6,13,30,0.56) 74%, rgba(6,13,30,0.40) 100%), url('/images/protest_image.webp')",
                          },
                          backgroundSize: "cover",
                          backgroundPosition: "left center",
                          backgroundRepeat: "no-repeat",
                        }
                      : null),
                  }}
                >
                  <CardActionArea href={card.href} sx={{ height: "100%", alignItems: "stretch" }}>
                    <CardContent sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 1.5, height: "100%" }}>
                      <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700, letterSpacing: "0.12em" }}>
                        {String(index + 1).padStart(2, "0")}
                      </Typography>
                      <Typography variant="h6" component="h3">
                        {card.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                        {isTakeAction ? (
                          <>
                            Use practical ways to engage, from public comment and outreach
                            <Box component="span" sx={{ display: { xs: "inline", md: "block" } }}>
                              {" "}
                              to neighborhood volunteer efforts.
                            </Box>
                          </>
                        ) : (
                          card.body
                        )}
                      </Typography>
                      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ pt: 0.5, color: "primary.main" }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {t.home.howItWorks.openPage}
                        </Typography>
                        <ArrowForwardRoundedIcon sx={{ fontSize: "1rem" }} />
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
            })}
          </Grid>
        </SectionShell>
      </Container>
    </Box>
  );
}
