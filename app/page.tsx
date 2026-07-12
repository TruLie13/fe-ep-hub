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
import type { Metadata } from "next";
import FactCard from "@/components/common/FactCard";
import SectionShell from "@/components/common/SectionShell";
import JsonLd from "@/components/seo/JsonLd";
import { buildHomeQuickFactsFromImpacts } from "@/lib/content/home-quick-facts";
import { loadDataCentersImpacts } from "@/lib/content/load";
import { dict } from "@/lib/i18n/dictionary";
import { getMainNavItems } from "@/lib/navigation/main-nav-items";
import { buildPageJsonLd, buildPageMetadata } from "@/lib/seo/site";

const HOME_SEO = {
  title: "Responsible Data Center Policy",
  description:
    "Plain-language resources and local civic information on data center impacts, public process, and responsible growth in El Paso.",
  path: "/",
  schemaType: "WebPage",
} as const;

export const metadata: Metadata = buildPageMetadata(HOME_SEO);

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
      <JsonLd data={buildPageJsonLd(HOME_SEO)} />
      {/* Full-bleed photo hero — place as visual plane, type over left */}
      <Box
        sx={{
          position: "relative",
          borderBottom: 1,
          borderColor: "divider",
          minHeight: { xs: 420, md: 520 },
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
          backgroundImage: {
            md: "linear-gradient(105deg, rgba(10,13,18,0.94) 0%, rgba(10,13,18,0.78) 42%, rgba(10,13,18,0.35) 100%), url('/images/elpaso_downtown.webp')",
            xs: "linear-gradient(180deg, rgba(10,13,18,0.55) 0%, rgba(10,13,18,0.82) 55%, rgba(10,13,18,0.96) 100%), url('/images/elpaso_downtown.webp')",
          },
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 }, position: "relative", zIndex: 1 }}>
          <Stack spacing={{ xs: 2.5, md: 3 }} sx={{ maxWidth: { md: "34rem" } }}>
            <Typography
              className="ep-motion-hero"
              variant="subtitle1"
              sx={{
                fontFamily: "var(--font-outfit), var(--font-plus-jakarta), sans-serif",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "common.white",
                fontSize: { xs: "1.25rem", md: "1.5rem" },
              }}
            >
              {t.nav.siteName}
            </Typography>
            <Typography
              component="h1"
              variant="h1"
              className="ep-motion-hero"
              sx={{ color: "common.white", textShadow: "0 1px 18px rgba(0,0,0,0.35)" }}
            >
              {t.home.heroTitle}
            </Typography>
            <Typography
              variant="body1"
              className="ep-motion-hero-delay"
              sx={{
                color: "rgba(244,247,250,0.88)",
                maxWidth: "min(70ch, 100%)",
                fontSize: { md: "1.1875rem" },
              }}
            >
              {t.home.heroSubtitle}
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", sm: "center" }}
              flexWrap="wrap"
              useFlexGap
              className="ep-motion-hero-delay"
            >
              <Button
                variant="contained"
                size="large"
                href="/learn"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  color: "#000000 !important",
                  transition: "transform 160ms ease",
                  "&:hover": {
                    color: "#000000 !important",
                    transform: "translateY(-1px)",
                  },
                  "&:focusVisible": { color: "#000000 !important" },
                  "@media (prefers-reduced-motion: reduce)": {
                    transition: "none",
                    "&:hover": { transform: "none" },
                  },
                }}
              >
                {t.home.startLearning}
              </Button>
              <Button
                variant="outlined"
                size="large"
                href="/data-center"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  borderColor: "rgba(255,255,255,0.55)",
                  color: "common.white",
                  "&:hover": {
                    borderColor: "common.white",
                    bgcolor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                {t.home.viewRegionalImpacts}
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: { xs: 3, md: 4 } }}>
        <SectionShell
          eyebrow={t.home.quickFacts.eyebrow}
          title={t.home.quickFacts.title}
          description={t.home.quickFacts.description}
        >
          <Stack spacing={2}>
            {quickFacts[0] ? (
              <FactCard
                {...quickFacts[0]}
                featured
                ctaLabel={t.home.quickFacts.readFullSection}
              />
            ) : null}
            <Grid container spacing={2}>
              {quickFacts.slice(1).map((fact) => (
                <Grid key={fact.href} size={{ xs: 12, sm: 6, md: 4 }}>
                  <FactCard {...fact} ctaLabel={t.home.quickFacts.readFullSection} />
                </Grid>
              ))}
            </Grid>
          </Stack>
          <Button
            variant="outlined"
            size="large"
            href="/data-center"
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              alignSelf: { xs: "stretch", sm: "flex-start" },
              mt: { xs: 0.5, sm: 1 },
            }}
          >
            {t.home.quickFacts.readFullPage}
          </Button>
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
                      <Typography
                        variant="overline"
                        color="primary.main"
                        sx={{
                          fontWeight: 600,
                          letterSpacing: "0.06em",
                          ...(isTakeAction
                            ? {
                                textShadow:
                                  "0 0 2px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.45)",
                              }
                            : {}),
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </Typography>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={
                          isTakeAction
                            ? {
                                color: "common.white",
                                fontWeight: 600,
                                textShadow:
                                  "0 0 2px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.95), 0 2px 14px rgba(0,0,0,0.4)",
                              }
                            : undefined
                        }
                      >
                        {card.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          flex: 1,
                          ...(isTakeAction
                            ? {
                                color: "rgba(255,255,255,0.98)",
                                fontWeight: 500,
                                textShadow:
                                  "0 0 3px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.95), 0 2px 18px rgba(0,0,0,0.55)",
                              }
                            : {}),
                        }}
                      >
                        {card.body}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={0.75}
                        alignItems="center"
                        sx={{ pt: 0.5, color: "primary.main", ...(isTakeAction ? { color: "primary.light" } : {}) }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            ...(isTakeAction
                              ? {
                                  textShadow:
                                    "0 0 2px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.88), 0 2px 10px rgba(0,0,0,0.45)",
                                }
                              : {}),
                          }}
                        >
                          {t.home.howItWorks.openPage}
                        </Typography>
                        <ArrowForwardRoundedIcon
                          sx={{
                            fontSize: "1rem",
                            ...(isTakeAction
                              ? {
                                  filter:
                                    "drop-shadow(0 0 1px rgba(0,0,0,0.95)) drop-shadow(0 1px 2px rgba(0,0,0,0.85))",
                                }
                              : {}),
                          }}
                        />
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
