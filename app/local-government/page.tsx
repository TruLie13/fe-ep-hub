import MapRoundedIcon from "@mui/icons-material/MapRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
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
import PageHero from "@/components/common/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import CollapsibleGovernmentSection from "@/components/local-government/CollapsibleGovernmentSection";
import SectionShell from "@/components/common/SectionShell";
import type { Candidate, Official, Stance, StancePosition } from "@/content/schema";
import { dict } from "@/lib/i18n/dictionary";
import { loadLocalGovernmentBundle } from "@/lib/content/load";
import { loadSourcesBundle } from "@/lib/content/load";
import {
  CITY_SEAT_KEYS,
  COUNTY_SEAT_KEYS,
  activeCandidates,
  candidateStances,
  citySeatLabel,
  countySeatLabel,
  isReelectionBadgeYear,
  nextElectionDateFromTermEnd,
  officialStances,
} from "@/lib/local-government/helpers";
import type { CitySeatKey, CountySeatKey } from "@/lib/local-government/seat-keys";
import {
  fetchCityLegistarOfficeData,
  findMember,
  type LegistarMember,
} from "@/lib/local-government/legistar";
import type { Source } from "@/content/schema";
import { buildPageJsonLd, buildPageMetadata } from "@/lib/seo/site";

const LOCAL_GOVERNMENT_SEO = {
  title: "Local Government",
  description:
    "El Paso mayor and city council, plus El Paso County Commissioners Court — contacts, election timing, and stance notes.",
  path: "/local-government",
  schemaType: "CollectionPage",
} as const;

export const metadata: Metadata = buildPageMetadata(LOCAL_GOVERNMENT_SEO);

function stanceColor(position: StancePosition): "default" | "primary" | "secondary" | "success" | "warning" | "error" {
  switch (position) {
    case "support":
      return "error";
    case "oppose":
      return "success";
    case "mixed":
      return "warning";
    case "neutral":
      return "default";
    default:
      return "default";
  }
}

type CardLabels = {
  onBallotThisYear: string;
  notedElectionDate: string;
  email: string;
  phone: string;
  officialPage: string;
  ballotpedia: string;
  publicStanceNotes: string;
  noStances: string;
  declaredForSeat: string;
  campaignSite: string;
  term: string;
};

function formatTermDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function normalizePersonName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/["']/g, "")
    .replace(/\b(dr\.?|jr\.?|sr\.?|iii?|iv)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function hasNameChanged(officialName: string, legistarName?: string): boolean {
  if (!legistarName) return false;
  const a = normalizePersonName(officialName);
  const b = normalizePersonName(legistarName);
  if (!a || !b) return false;
  return a !== b;
}

function FindRepsLink({
  href,
  label,
  hint,
}: {
  href: string;
  label: string;
  hint: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      underline="none"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.25,
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        px: 2,
        py: 1.5,
        flex: { xs: "1 1 auto", sm: "1 1 0" },
        transition: "border-color 160ms ease, background-color 160ms ease",
        "&:hover": {
          borderColor: "primary.main",
          bgcolor: "action.hover",
        },
      }}
    >
      <Stack direction="row" spacing={0.75} alignItems="center">
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {label}
        </Typography>
        <OpenInNewRoundedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
      </Stack>
      <Typography variant="caption" color="text.secondary">
        {hint}
      </Typography>
    </Link>
  );
}

function OfficialCard({
  official,
  stances,
  labels,
  legistarMember,
  sourceById,
  instagramUrl,
  instagramHandle,
}: {
  official: Official;
  stances: Stance[];
  labels: CardLabels;
  legistarMember?: LegistarMember;
  sourceById: Map<string, Source>;
  instagramUrl: string;
  instagramHandle: string;
}) {
  const displayName = legistarMember?.fullName ?? official.displayName;
  const showReelectionBadge = isReelectionBadgeYear(
    official.nextElectionDate,
    legistarMember?.endDate,
  );
  const termLine =
    legistarMember?.startDate && legistarMember?.endDate
      ? `${labels.term} ${formatTermDate(legistarMember.startDate)} – ${formatTermDate(legistarMember.endDate)}`
      : null;
  const electionDate =
    nextElectionDateFromTermEnd(legistarMember?.endDate) ??
    official.nextElectionDate;

  const officialReplaced = hasNameChanged(official.displayName, legistarMember?.fullName);
  const knownStances = officialReplaced
    ? []
    : stances.filter((s) => s.position !== "unknown");
  const [noStancesBefore, noStancesAfter] = labels.noStances.split("{instagramLink}");

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
            <Typography variant="h6">{displayName}</Typography>
            {showReelectionBadge ? (
              <Chip
                size="small"
                label={labels.onBallotThisYear}
                sx={{
                  bgcolor: "#F6D365",
                  border: "1px solid #E9B949",
                  color: "#1F2937",
                  "& .MuiChip-label": {
                    color: "#1F2937",
                    fontWeight: 700,
                  },
                }}
              />
            ) : null}
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {official.roleTitle}
          </Typography>
          {termLine ? (
            <Typography variant="caption" color="text.secondary">
              {termLine}
            </Typography>
          ) : null}
          {electionDate ? (
            <Typography variant="caption" color="text.secondary">
              {labels.notedElectionDate} {formatTermDate(electionDate)}
            </Typography>
          ) : null}
          <Stack spacing={0.75}>
            <Typography variant="body2">
              {labels.email}{" "}
              <Link href={`mailto:${official.contact.email}`} underline="hover">
                {official.contact.email}
              </Link>
            </Typography>
            {official.contact.phone ? (
              <Typography variant="body2">
                {labels.phone}{" "}
                <Link href={`tel:${official.contact.phone.replace(/\D/g, "")}`} underline="hover">
                  {official.contact.phone}
                </Link>
              </Typography>
            ) : null}
            {official.contact.officeUrl ? (
              <Button
                size="small"
                href={official.contact.officeUrl}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<OpenInNewRoundedIcon />}
              >
                {labels.officialPage}
              </Button>
            ) : null}
            {official.ballotpediaUrl ? (
              <Button
                size="small"
                variant="outlined"
                href={official.ballotpediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<OpenInNewRoundedIcon />}
              >
                {labels.ballotpedia}
              </Button>
            ) : null}
          </Stack>

          <Divider sx={{ my: 1 }} />

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Typography variant="subtitle2">{labels.publicStanceNotes}</Typography>
            {knownStances.length === 1 ? (
              <Chip
                size="small"
                color={stanceColor(knownStances[0].position)}
                label={knownStances[0].position}
              />
            ) : null}
          </Stack>
          {knownStances.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {noStancesBefore}
              <Link
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                underline="always"
                sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
              >
                {instagramHandle}
                <OpenInNewRoundedIcon sx={{ fontSize: 12 }} aria-hidden />
              </Link>
              {noStancesAfter}
            </Typography>
          ) : (
            knownStances.map((stance) => (
              <Stack key={stance.id} spacing={0.75}>
                {knownStances.length > 1 ? (
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                    <Chip
                      size="small"
                      color={stanceColor(stance.position)}
                      label={stance.position}
                    />
                  </Stack>
                ) : null}
                <Typography variant="body2" color="text.secondary">
                  {stance.summary}
                </Typography>
                {stance.sourceIds?.length ? (
                  <Typography variant="caption" color="text.secondary">
                    Source:{" "}
                    {stance.sourceIds
                      .map((id) => sourceById.get(id))
                      .filter((source): source is Source => Boolean(source))
                      .slice(0, 1)
                      .map((source) => (
                        <Link
                          key={source.id}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                          sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
                        >
                          {source.publisher ?? source.title}
                          <OpenInNewRoundedIcon sx={{ fontSize: 12 }} />
                        </Link>
                      ))}
                  </Typography>
                ) : null}
              </Stack>
            ))
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

function SeatRunningBlock({
  candidates,
  bundle,
  labels,
}: {
  candidates: Candidate[];
  bundle: ReturnType<typeof loadLocalGovernmentBundle>;
  labels: CardLabels;
}) {
  if (candidates.length === 0) return null;
  return (
    <Stack spacing={1} sx={{ mt: 1.5 }}>
      <Typography variant="caption" color="text.secondary">
        {labels.declaredForSeat}
      </Typography>
      <Stack spacing={1}>
        {candidates.map((candidate) => {
          const stances = candidateStances(bundle, candidate.id);
          return (
            <Card key={candidate.id} variant="outlined">
              <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                <Stack spacing={0.75}>
                  <Typography variant="subtitle2">{candidate.displayName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {candidate.officeSought}
                    {candidate.party ? ` • ${candidate.party}` : ""}
                  </Typography>
                  {candidate.campaignWebsiteUrl ? (
                    <Button
                      size="small"
                      href={candidate.campaignWebsiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      endIcon={<OpenInNewRoundedIcon />}
                    >
                      {labels.campaignSite}
                    </Button>
                  ) : null}
                  {candidate.ballotpediaUrl ? (
                    <Button
                      size="small"
                      variant="outlined"
                      href={candidate.ballotpediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      endIcon={<OpenInNewRoundedIcon />}
                    >
                      {labels.ballotpedia}
                    </Button>
                  ) : null}
                  {stances.length > 0
                    ? stances.map((stance) => (
                        <Typography key={stance.id} variant="body2" color="text.secondary">
                          {stance.topicLabel}: {stance.summary}
                        </Typography>
                      ))
                    : null}
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Stack>
  );
}

export default async function LocalGovernmentPage() {
  const t = dict();
  const bundle = loadLocalGovernmentBundle();
  const candidates = activeCandidates(bundle);
  const { members: legistarMembers, mayor: legistarMayor } =
    await fetchCityLegistarOfficeData();
  const sourceBundle = loadSourcesBundle();
  const sourceById = new Map(sourceBundle.sources.map((s) => [s.id, s]));

  const cardLabels: CardLabels = {
    onBallotThisYear: t.localGov.onBallotThisYear,
    notedElectionDate: t.localGov.notedElectionDate,
    email: t.localGov.email,
    phone: t.localGov.phone,
    officialPage: t.common.officialPage,
    ballotpedia: t.common.ballotpedia,
    publicStanceNotes: t.localGov.publicStanceNotes,
    noStances: t.localGov.noStances,
    declaredForSeat: t.localGov.declaredForSeat,
    campaignSite: t.common.campaignSite,
    term: t.localGov.term,
  };
  const instagramUrl = t.common.instagramUrl;
  const instagramHandle = t.common.instagramHandle;

  const councilKeys = CITY_SEAT_KEYS.filter((k): k is Exclude<CitySeatKey, "mayor"> => k !== "mayor");

  return (
    <Box>
      <JsonLd data={buildPageJsonLd(LOCAL_GOVERNMENT_SEO)} />
      <PageHero
        title={t.localGov.title}
        subtitle={t.localGov.subtitle}
        meta={
          legistarMembers.size > 0 || legistarMayor ? (
            <Typography variant="caption" color="text.secondary">
              {t.localGov.liveDataNote}
            </Typography>
          ) : null
        }
      />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Card
        variant="outlined"
        sx={{
          mb: 2,
          bgcolor: "background.paper",
          borderColor: "divider",
        }}
      >
        <CardContent sx={{ py: { xs: 2.5, sm: 3 }, "&:last-child": { pb: { xs: 2.5, sm: 3 } } }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <MapRoundedIcon sx={{ color: "primary.main", fontSize: 22 }} />
              <Typography variant="subtitle1" fontWeight={700}>
                {t.localGov.findRepsTitle}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" maxWidth="72ch" sx={{ whiteSpace: "pre-wrap" }}>
              {t.localGov.findRepsDescription}
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1.5, sm: 2 }}
              flexWrap="wrap"
              useFlexGap
            >
              <FindRepsLink
                href="https://experience.arcgis.com/experience/2c09dea9c6dc432babd3843d2b3f2d67/"
                label={t.localGov.findCityDistrict}
                hint={t.localGov.findCityDistrictHint}
              />
              <FindRepsLink
                href="https://epcountyvotes.com/maps/county-commissioner-maps"
                label={t.localGov.findCountyPrecinct}
                hint={t.localGov.findCountyPrecinctHint}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={2}>
        <CollapsibleGovernmentSection
          id="city"
          eyebrow={t.localGov.cityEyebrow}
          title={t.localGov.cityTitle}
          description={t.localGov.cityDescription}
        >
          <Stack spacing={3}>
            {(() => {
              const seat = bundle.city.mayor;
              const official = seat.sitting;
              if (!official) return null;
              const st = officialStances(bundle, official.id);
              const member = legistarMayor ?? findMember(legistarMembers, official.displayName);
              return (
                <Box>
                  <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: "0.14em" }}>
                    {citySeatLabel("mayor")}
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <OfficialCard
                        official={official}
                        stances={st}
                        labels={cardLabels}
                        legistarMember={member}
                        sourceById={sourceById}
                        instagramUrl={instagramUrl}
                        instagramHandle={instagramHandle}
                      />
                      <SeatRunningBlock candidates={seat.running} bundle={bundle} labels={cardLabels} />
                    </Grid>
                  </Grid>
                </Box>
              );
            })()}

            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: "0.14em" }}>
                {t.localGov.cityCouncil}
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {councilKeys.map((key) => {
                  const seat = bundle.city[key];
                  const official = seat.sitting;
                  if (!official) {
                    return (
                      <Grid key={key} size={{ xs: 12, md: 6 }}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2">{citySeatLabel(key)}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {t.localGov.vacantMessage}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  }
                  const st = officialStances(bundle, official.id);
                  const member = findMember(legistarMembers, official.displayName);
                  return (
                    <Grid key={key} size={{ xs: 12, md: 6 }}>
                      <OfficialCard
                        official={official}
                        stances={st}
                        labels={cardLabels}
                        legistarMember={member}
                        sourceById={sourceById}
                        instagramUrl={instagramUrl}
                        instagramHandle={instagramHandle}
                      />
                      <SeatRunningBlock candidates={seat.running} bundle={bundle} labels={cardLabels} />
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Stack>
        </CollapsibleGovernmentSection>

        <CollapsibleGovernmentSection
          id="county"
          eyebrow={t.localGov.countyEyebrow}
          title={t.localGov.countyTitle}
          description={t.localGov.countyDescription}
        >
          <Stack spacing={3}>
            {(() => {
              const key: CountySeatKey = "countyJudge";
              const seat = bundle.county[key];
              const official = seat.sitting;
              if (!official) return null;
              const st = officialStances(bundle, official.id);
              return (
                <Box>
                  <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: "0.14em" }}>
                    {countySeatLabel(key)}
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <OfficialCard
                        official={official}
                        stances={st}
                        labels={cardLabels}
                        sourceById={sourceById}
                        instagramUrl={instagramUrl}
                        instagramHandle={instagramHandle}
                      />
                      <SeatRunningBlock candidates={seat.running} bundle={bundle} labels={cardLabels} />
                    </Grid>
                  </Grid>
                </Box>
              );
            })()}

            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: "0.14em" }}>
                {t.localGov.commissionersCourt}
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {COUNTY_SEAT_KEYS.filter((k) => k !== "countyJudge").map((key) => {
                  const seat = bundle.county[key];
                  const official = seat.sitting;
                  if (!official) {
                    return (
                      <Grid key={key} size={{ xs: 12, md: 6 }}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2">{countySeatLabel(key)}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {t.localGov.vacantMessage}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  }
                  const st = officialStances(bundle, official.id);
                  return (
                    <Grid key={key} size={{ xs: 12, md: 6 }}>
                      <OfficialCard
                        official={official}
                        stances={st}
                        labels={cardLabels}
                        sourceById={sourceById}
                        instagramUrl={instagramUrl}
                        instagramHandle={instagramHandle}
                      />
                      <SeatRunningBlock candidates={seat.running} bundle={bundle} labels={cardLabels} />
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Stack>
        </CollapsibleGovernmentSection>
      </Stack>

      {candidates.length > 0 ? (
        <Box sx={{ mt: 4 }}>
          <SectionShell
            eyebrow={t.localGov.electionSeasonEyebrow}
            title={t.localGov.electionSeasonTitle}
            description={t.localGov.electionSeasonDescription}
          >
            <Grid container spacing={2}>
              {candidates.map((candidate) => {
                const stances = candidateStances(bundle, candidate.id);
                return (
                  <Grid key={candidate.id} size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined">
                      <CardContent>
                        <Stack spacing={1}>
                          <Typography variant="h6">{candidate.displayName}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {candidate.officeSought}
                            {candidate.party ? ` • ${candidate.party}` : ""}
                          </Typography>
                          {candidate.campaignWebsiteUrl ? (
                            <Button
                              size="small"
                              href={candidate.campaignWebsiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              endIcon={<OpenInNewRoundedIcon />}
                            >
                              {t.common.campaignSite}
                            </Button>
                          ) : null}
                          {candidate.ballotpediaUrl ? (
                            <Button
                              size="small"
                              variant="outlined"
                              href={candidate.ballotpediaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              endIcon={<OpenInNewRoundedIcon />}
                            >
                              {t.common.ballotpedia}
                            </Button>
                          ) : null}
                          {stances.map((stance) => (
                            <Typography key={stance.id} variant="body2" color="text.secondary">
                              {stance.topicLabel}: {stance.summary}
                            </Typography>
                          ))}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </SectionShell>
        </Box>
      ) : null}
      </Container>
    </Box>
  );
}
