import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import HowToVoteRoundedIcon from "@mui/icons-material/HowToVoteRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import SupervisedUserCircleRoundedIcon from "@mui/icons-material/SupervisedUserCircleRounded";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { Metadata } from "next";
import NextLink from "next/link";
import type { ComponentType, ReactNode } from "react";
import PageHero from "@/components/common/PageHero";
import SectionShell from "@/components/common/SectionShell";
import { dict } from "@/lib/i18n/dictionary";
import { tokens } from "@/theme/tokens";

const inlineNavLinkSx = {
  color: `var(--eptruth-palette-primary-main, ${tokens.dark.accent})`,
  textDecoration: "underline",
  textUnderlineOffset: "0.2em",
  fontWeight: 600,
} as const;

const actionCardSx = { borderRadius: 1, height: "100%" } as const;

const volunteerCardLinkSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.5,
  fontWeight: 600,
  verticalAlign: "baseline",
  textUnderlineOffset: "0.2em",
} as const;

/** Host + TLD only (no path), strips leading www. */
function volunteerWebsiteHostDisplay(href: string): string {
  try {
    const u = new URL(href);
    return u.hostname.replace(/^www\./i, "");
  } catch {
    return href;
  }
}

/** Host + path for short links (e.g. linktr.ee/handle). */
function volunteerLinktreeDisplay(href: string): string {
  try {
    const u = new URL(href);
    const host = u.hostname.replace(/^www\./i, "");
    const path = u.pathname.replace(/\/$/, "");
    return path ? `${host}${path}` : host;
  } catch {
    return href;
  }
}

function ExternalTakeActionLink({
  href,
  ariaLabel,
  children,
}: {
  href: string;
  ariaLabel: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      color="primary"
      fontWeight={600}
      aria-label={ariaLabel}
      sx={{
        textUnderlineOffset: "0.2em",
        display: "inline-flex",
        alignItems: "center",
        gap: 0.35,
        verticalAlign: "baseline",
      }}
    >
      {children}
      <OpenInNewRoundedIcon sx={{ fontSize: "1rem", flexShrink: 0 }} aria-hidden />
    </Link>
  );
}

type VolunteerHandsLink =
  | { kind: "website"; href: string; ariaLabel: string }
  | { kind: "linktree"; href: string; ariaLabel: string }
  | { kind: "instagram"; href: string; handle: string; ariaLabel: string };

function VolunteerHandsOutboundLink({ item }: { item: VolunteerHandsLink }) {
  if (item.kind === "instagram") {
    return (
      <Link
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        color="primary"
        underline="hover"
        aria-label={item.ariaLabel}
        sx={volunteerCardLinkSx}
      >
        <InstagramIcon sx={{ fontSize: "1.125rem", flexShrink: 0 }} aria-hidden />
        {item.handle}
      </Link>
    );
  }

  const label = item.kind === "website" ? volunteerWebsiteHostDisplay(item.href) : volunteerLinktreeDisplay(item.href);
  const Icon = item.kind === "website" ? PublicRoundedIcon : LinkRoundedIcon;

  return (
    <Link
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      color="primary"
      underline="hover"
      aria-label={item.ariaLabel}
      sx={volunteerCardLinkSx}
    >
      <Icon sx={{ fontSize: "1.125rem", flexShrink: 0 }} aria-hidden />
      {label}
    </Link>
  );
}

function VolunteerHandsCard({
  title,
  description,
  links,
}: {
  title: string;
  description: string;
  links: VolunteerHandsLink[];
}) {
  return (
    <Card variant="outlined" sx={actionCardSx}>
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack spacing={2}>
          <Typography component="h3" variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.25 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
            {description}
          </Typography>
          <Stack direction="row" component="nav" aria-label={`${title} links`} flexWrap="wrap" useFlexGap spacing={1.5}>
            {links.map((item) => (
              <VolunteerHandsOutboundLink key={`${item.kind}-${item.href}`} item={item} />
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = dict().takeAction;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
  };
}

function ActionWayCard({
  headline,
  icon: Icon,
  children,
}: {
  headline: string;
  icon: ComponentType<SvgIconProps>;
  children: ReactNode;
}) {
  return (
    <Card variant="outlined" sx={actionCardSx}>
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack spacing={2.25}>
          <Stack direction="row" alignItems="center" spacing={1.75}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 1,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                bgcolor: "action.hover",
                color: "primary.main",
                border: 1,
                borderColor: "divider",
              }}
              aria-hidden
            >
              <Icon sx={{ fontSize: 24 }} />
            </Box>
            <Typography
              component="h3"
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.25,
                minWidth: 0,
              }}
            >
              {headline}
            </Typography>
          </Stack>
          <Box
            sx={{
              typography: "body2",
              color: "text.secondary",
              lineHeight: 1.65,
              maxWidth: "62ch",
            }}
          >
            {children}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function TakeActionPage() {
  const d = dict();
  const t = d.takeAction;

  return (
    <Box>
      <PageHero
        title={
          <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
            <Typography component="span" variant="body1" color="text.secondary" sx={{ display: "block", maxWidth: "40ch" }}>
              {t.heroLead}
            </Typography>
            <Typography
              component="span"
              sx={{
                display: "block",
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3.25rem" },
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
            >
              {t.heroEmphasis}
            </Typography>
          </Stack>
        }
      />
      <SectionShell
        band
        eyebrow={t.waysEyebrow}
        title={t.waysTitle}
        description={t.waysDescription}
      >
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 6 }}>
              <ActionWayCard headline={t.way1Headline} icon={AccountBalanceRoundedIcon}>
                <>
                  {t.way1Before}
                  <NextLink href="/city-meetings" style={inlineNavLinkSx}>
                    {t.way1Link}
                  </NextLink>
                  {t.way1After}
                </>
              </ActionWayCard>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ActionWayCard headline={t.way2Headline} icon={SupervisedUserCircleRoundedIcon}>
                <>
                  {t.way2Before}
                  <NextLink href="/local-government" style={inlineNavLinkSx}>
                    {t.way2Link}
                  </NextLink>
                  {t.way2After}
                </>
              </ActionWayCard>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ActionWayCard headline={t.way4Headline} icon={FactCheckRoundedIcon}>
                {t.way4}
              </ActionWayCard>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ActionWayCard headline={t.way5Headline} icon={ShareRoundedIcon}>
                <>
                  {t.way5Before}
                  <Link href={d.common.instagramUrl} target="_blank" rel="noopener noreferrer" color="primary" fontWeight={600} sx={{ textUnderlineOffset: "0.2em" }}>
                    {t.way5Link}
                  </Link>
                  {t.way5After}
                </>
              </ActionWayCard>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ActionWayCard headline={t.way3Headline} icon={HowToVoteRoundedIcon}>
                <>
                  {t.way3Before}
                  <Box component="div" sx={{ mt: 1.25 }}>
                    <ExternalTakeActionLink href={t.voterRegistrationUrl} ariaLabel={t.way3RegisterAria}>
                      {t.way3RegisterLink}
                    </ExternalTakeActionLink>
                    {t.way3Middle}
                    <ExternalTakeActionLink href={t.voterDashboardUrl} ariaLabel={t.way3DashboardAria}>
                      {t.way3DashboardLink}
                    </ExternalTakeActionLink>
                    {t.way3After}
                  </Box>
                </>
              </ActionWayCard>
            </Grid>
          </Grid>
      </SectionShell>
      <Container maxWidth="lg">
        <SectionShell eyebrow={t.handsOnEyebrow} title={t.handsOnTitle} description={t.handsOnDescription}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 4 }}>
              <VolunteerHandsCard
                title={t.volunteerTrashMobName}
                description={t.volunteerTrashMobDescription}
                links={[
                  {
                    kind: "website" as const,
                    href: t.volunteerTrashMobWebsiteUrl,
                    ariaLabel: `${t.volunteerTrashMobName} ${volunteerWebsiteHostDisplay(t.volunteerTrashMobWebsiteUrl)} ${t.handsOnOpensNew}`,
                  },
                  {
                    kind: "instagram" as const,
                    href: t.volunteerTrashMobInstagramUrl,
                    handle: t.volunteerTrashMobInstagramHandle,
                    ariaLabel: `${t.volunteerTrashMobName} Instagram ${t.volunteerTrashMobInstagramHandle} ${t.handsOnOpensNew}`,
                  },
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <VolunteerHandsCard
                title={t.volunteerDesertRescueName}
                description={t.volunteerDesertRescueDescription}
                links={[
                  {
                    kind: "website" as const,
                    href: t.volunteerDesertRescueWebsiteUrl,
                    ariaLabel: `${t.volunteerDesertRescueName} ${volunteerWebsiteHostDisplay(t.volunteerDesertRescueWebsiteUrl)} ${t.handsOnOpensNew}`,
                  },
                  {
                    kind: "instagram" as const,
                    href: t.volunteerDesertRescueInstagramUrl,
                    handle: t.volunteerDesertRescueInstagramHandle,
                    ariaLabel: `${t.volunteerDesertRescueName} Instagram ${t.volunteerDesertRescueInstagramHandle} ${t.handsOnOpensNew}`,
                  },
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <VolunteerHandsCard
                title={t.volunteerSunCityName}
                description={t.volunteerSunCityDescription}
                links={[
                  {
                    kind: "linktree" as const,
                    href: t.volunteerSunCityLinktreeUrl,
                    ariaLabel: `${t.volunteerSunCityName} ${volunteerLinktreeDisplay(t.volunteerSunCityLinktreeUrl)} ${t.handsOnOpensNew}`,
                  },
                  {
                    kind: "instagram" as const,
                    href: t.volunteerSunCityInstagramUrl,
                    handle: t.volunteerSunCityInstagramHandle,
                    ariaLabel: `${t.volunteerSunCityName} Instagram ${t.volunteerSunCityInstagramHandle} ${t.handsOnOpensNew}`,
                  },
                ]}
              />
            </Grid>
          </Grid>
          <Typography component="h3" variant="body1" color="text.secondary" sx={{ maxWidth: "min(72ch, 100%)" }}>
            {t.handsOnMoreTitle}
          </Typography>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 4 }}>
              <VolunteerHandsCard
                title={t.volunteerRescueRunnersName}
                description={t.volunteerRescueRunnersDescription}
                links={[
                  {
                    kind: "website" as const,
                    href: t.volunteerRescueRunnersWebsiteUrl,
                    ariaLabel: `${t.volunteerRescueRunnersName} ${volunteerWebsiteHostDisplay(t.volunteerRescueRunnersWebsiteUrl)} ${t.handsOnOpensNew}`,
                  },
                  {
                    kind: "instagram" as const,
                    href: t.volunteerRescueRunnersInstagramUrl,
                    handle: t.volunteerRescueRunnersInstagramHandle,
                    ariaLabel: `${t.volunteerRescueRunnersName} Instagram ${t.volunteerRescueRunnersInstagramHandle} ${t.handsOnOpensNew}`,
                  },
                ]}
              />
            </Grid>
          </Grid>
        </SectionShell>
      </Container>
    </Box>
  );
}
