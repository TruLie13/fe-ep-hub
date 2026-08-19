import {
  Box,
  Card,
  CardContent,
  Container,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";
import SectionShell from "@/components/common/SectionShell";
import CityDistrictsMap from "@/components/map/CityDistrictsMap";
import ElectionCandidateRow from "@/components/local-election/ElectionCandidateRow";
import VotingDates from "@/components/local-election/VotingDates";
import JsonLd from "@/components/seo/JsonLd";
import type { ISODateString } from "@/content/schema";
import { loadLocalElection2026Bundle, loadLocalGovernmentBundle } from "@/lib/content/load";
import { dict } from "@/lib/i18n/dictionary";
import { isIncumbentDistrictCandidate } from "@/lib/local-government/helpers";
import { buildPageJsonLd, buildPageMetadata } from "@/lib/seo/site";

function formatElectionDate(iso: ISODateString): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatElectionDateRange(start: ISODateString, end: ISODateString): string {
  const startDate = new Date(start + "T00:00:00");
  const endDate = new Date(end + "T00:00:00");
  const sameMonth = startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear();

  if (sameMonth) {
    const month = startDate.toLocaleDateString("en-US", { month: "long" });
    const year = startDate.getFullYear();
    return `${month} ${startDate.getDate()} through ${endDate.getDate()}, ${year}`;
  }

  return `${formatElectionDate(start)} through ${formatElectionDate(end)}`;
}

export function generateMetadata(): Metadata {
  const t = dict().localElection2026;
  return buildPageMetadata({
    title: t.metaTitle,
    description: t.metaDescription,
    path: "/election",
    schemaType: "CollectionPage",
  });
}

export default function LocalElection2026Page() {
  const t = dict();
  const page = t.localElection2026;
  const takeAction = t.takeAction;
  const bundle = loadLocalElection2026Bundle();
  const government = loadLocalGovernmentBundle();

  const pageSeo = {
    title: page.metaTitle,
    description: page.metaDescription,
    path: "/election" as const,
    schemaType: "CollectionPage" as const,
  };

  const candidateLabels = {
    dataCenterStance: page.dataCenterStance,
    stanceSupports: page.stanceSupports,
    stanceOpposes: page.stanceOpposes,
    stanceNeutral: page.stanceNeutral,
    stanceUnknown: page.stanceUnknown,
    campaignSite: page.campaignSite,
    opensNewTab: page.opensNewTab,
    incumbent: page.incumbent,
    incumbentAria: page.incumbentAria,
  };

  const votingDates = [
    {
      label: page.registrationDeadlineLabel,
      dateText: formatElectionDate(bundle.registrationDeadline),
      calendarEvent: {
        title: page.calendarRegistrationTitle,
        startDate: bundle.registrationDeadline,
        description: page.calendarRegistrationDescription,
        filename: "el-paso-voter-registration-deadline-2026",
      },
      addToCalendarAria: page.addToCalendarRegistrationAria,
    },
    {
      label: page.earlyVotingLabel,
      dateText: formatElectionDateRange(bundle.earlyVotingStart, bundle.earlyVotingEnd),
      calendarEvent: {
        title: page.calendarEarlyVotingTitle,
        startDate: bundle.earlyVotingStart,
        endDate: bundle.earlyVotingEnd,
        description: page.calendarEarlyVotingDescription,
        filename: "el-paso-early-voting-2026",
      },
      addToCalendarAria: page.addToCalendarEarlyVotingAria,
    },
    {
      label: page.electionDayLabel,
      dateText: formatElectionDate(bundle.electionDate),
      calendarEvent: {
        title: page.calendarElectionDayTitle,
        startDate: bundle.electionDate,
        description: page.calendarElectionDayDescription,
        filename: "el-paso-election-day-2026",
      },
      addToCalendarAria: page.addToCalendarElectionDayAria,
    },
    {
      label: page.runoffLabel,
      dateText: page.runoffDate,
      tooltip: page.runoffTooltip,
      tooltipAria: page.runoffTooltipAria,
    },
  ];

  return (
    <Box>
      <JsonLd data={buildPageJsonLd(pageSeo)} />
      <PageHero
        title={page.title}
        subtitle={page.subtitle}
        meta={
          <Typography variant="body1" color="text.secondary" maxWidth="70ch">
            {page.sourceNote}
          </Typography>
        }
      />

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Card
          variant="outlined"
          sx={{
            borderRadius: 1,
            bgcolor: "background.paper",
            mb: { xs: 5, md: 7 },
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Stack spacing={2.5}>
              <Stack spacing={1}>
                <Typography variant="overline" sx={{ fontWeight: 600, letterSpacing: "0.08em", color: "text.secondary" }}>
                  {page.votingEyebrow}
                </Typography>
              </Stack>

              <Stack spacing={1} sx={{ maxWidth: "72ch" }}>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  {page.registerHeading}
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    m: 0,
                    pl: 2.5,
                    "& li": { mb: 0.75 },
                    "& li:last-child": { mb: 0 },
                  }}
                >
                  <Typography component="li" variant="body1">
                    <Link
                      href={page.libraryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                      fontWeight={600}
                      sx={{ textUnderlineOffset: "0.2em" }}
                      aria-label={page.libraryAria}
                    >
                      {page.registerLibrary}
                    </Link>
                  </Typography>
                  <Typography component="li" variant="body1">
                    {page.registerUsps}
                  </Typography>
                  <Typography component="li" variant="body1">
                    <Link
                      href={page.registerDpsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                      fontWeight={600}
                      sx={{ textUnderlineOffset: "0.2em" }}
                      aria-label={page.registerDpsAria}
                    >
                      {page.registerDps}
                    </Link>
                  </Typography>
                  <Typography component="li" variant="body1">
                    <Link
                      href={page.registerHhscUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                      fontWeight={600}
                      sx={{ textUnderlineOffset: "0.2em" }}
                      aria-label={page.registerHhscAria}
                    >
                      {page.registerHhsc}
                    </Link>
                  </Typography>
                  <Typography component="li" variant="body1">
                    <Link
                      href={takeAction.voterRegistrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                      fontWeight={600}
                      sx={{ textUnderlineOffset: "0.2em" }}
                      aria-label={page.registerByMailAria}
                    >
                      {page.registerByMail}
                    </Link>
                  </Typography>
                </Box>
              </Stack>

              <VotingDates rows={votingDates} addToCalendarLabel={page.addToCalendar} />

              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "72ch" }}>
                <Link
                  href={takeAction.voterDashboardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="primary"
                  fontWeight={600}
                  sx={{ textUnderlineOffset: "0.2em" }}
                  aria-label={page.dashboardAria}
                >
                  {page.dashboardLink}
                </Link>
                {page.dashboardAfter}
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Card
          id="district-map"
          component="section"
          variant="outlined"
          sx={{
            borderRadius: 1,
            bgcolor: "background.paper",
            mb: { xs: 5, md: 7 },
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Stack spacing={2.5}>
              <Stack spacing={1}>
                <Typography variant="overline" sx={{ fontWeight: 600, letterSpacing: "0.08em", color: "text.secondary" }}>
                  {page.mapEyebrow}
                </Typography>
                <Typography component="h2" variant="h3">
                  {page.mapTitle}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "72ch" }}>
                  {page.mapDescription}
                </Typography>
              </Stack>

              <CityDistrictsMap
                labels={{
                  ariaLabel: page.mapAriaLabel,
                  legendAria: page.mapLegendAria,
                  districtLabel: page.mapDistrictLabel,
                  districtJumpAria: page.mapDistrictJumpAria,
                  sourceBefore: page.mapSourceBefore,
                  sourceLink: page.mapSourceLink,
                  sourceAria: page.mapSourceAria,
                  sourceAfter: page.mapSourceAfter,
                }}
              />
            </Stack>
          </CardContent>
        </Card>

        {bundle.districts.map((district) => (
          <SectionShell
            key={district.district}
            id={`district-${district.district}`}
            eyebrow={page.districtEyebrow.replace("{district}", String(district.district))}
            title={page.districtTitle.replace("{district}", String(district.district))}
            description={page.districtDescription.replace("{count}", String(district.candidates.length))}
            dense
          >
            <Box sx={{ maxWidth: "48rem" }}>
              {district.candidates.map((candidate) => (
                <ElectionCandidateRow
                  key={candidate.id}
                  candidate={candidate}
                  labels={candidateLabels}
                  isIncumbent={isIncumbentDistrictCandidate(
                    government,
                    district.district,
                    candidate.displayName,
                  )}
                />
              ))}
            </Box>
          </SectionShell>
        ))}

        <Stack spacing={1.5} sx={{ mt: 4, maxWidth: "72ch" }}>
          <Typography variant="body2" color="text.secondary">
            {page.sourceBefore}
            <Link
              href={bundle.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              fontWeight={600}
              sx={{ textUnderlineOffset: "0.2em" }}
              aria-label={page.sourceAria}
            >
              {page.sourceLink}
            </Link>
            {page.sourceAfter}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {page.contributeLinksBefore}
            <Link
              href={page.contributeLinksUrl}
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              fontWeight={600}
              sx={{ textUnderlineOffset: "0.2em" }}
              aria-label={page.contributeLinksAria}
            >
              {page.contributeLinksLink}
            </Link>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
