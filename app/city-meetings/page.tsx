import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import RecordVoiceOverRoundedIcon from "@mui/icons-material/RecordVoiceOverRounded";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";
import SectionShell from "@/components/common/SectionShell";
import MeetingCard from "@/components/city-meetings/MeetingCard";
import { type SerializedEvent } from "@/components/city-meetings/meeting-utils";
import {
  formatYmdLongDenver,
  getCouncilSignUpWindow,
  isMeetingDateOnOrAfterTodayDenver,
  type CouncilSignUpWindowState,
} from "@/lib/city-meetings/elPasoCalendar";
import { fetchNextCityCouncilCalendarHint } from "@/lib/city-meetings/fetch-legistar-calendar-hint";
import { fetchLegistarEvents } from "@/lib/city-meetings/fetch-legistar-events";
import { dict, type Dictionary } from "@/lib/i18n/dictionary";

export const metadata: Metadata = {
  title: "City Meetings",
  description:
    "Upcoming and recent City of El Paso public meetings, hearings, and board sessions pulled live from the Legistar calendar.",
};

const LEGISTAR_CALENDAR_URL = "https://elpasotexas.legistar.com/Calendar.aspx";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Denver",
  });
}

function isCancelled(event: SerializedEvent): boolean {
  return (
    event.EventAgendaStatusName?.toUpperCase().includes("CANCEL") ?? false
  );
}

function fillPlaceholders(
  template: string,
  vars: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] ?? `{${key}}`,
  );
}

function signUpAlertCopy(
  mt: Dictionary["cityMeetings"],
  state: CouncilSignUpWindowState,
  cityCouncilHint: { dateLabel: string; timeLabel: string } | null,
): { message: string; severity: "info" | "success" } {
  if (state.kind === "unknown") {
    if (cityCouncilHint) {
      return {
        message: fillPlaceholders(mt.signUpUnknownWithHint, {
          date: cityCouncilHint.dateLabel,
          time: cityCouncilHint.timeLabel,
        }),
        severity: "info",
      };
    }
    return { message: mt.signUpUnknown, severity: "info" };
  }
  if (state.kind === "closed_before") {
    return {
      message: fillPlaceholders(mt.signUpClosedBefore, {
        opensDay: formatYmdLongDenver(state.opensWednesdayYmd),
      }),
      severity: "info",
    };
  }
  if (state.kind === "open") {
    return {
      message: fillPlaceholders(mt.signUpOpen, {
        meetingDate: formatYmdLongDenver(state.meetingYmd),
      }),
      severity: "success",
    };
  }
  return {
    message: fillPlaceholders(mt.signUpClosedAfter, {
      meetingDate: formatYmdLongDenver(state.meetingYmd),
    }),
    severity: "info",
  };
}

function OfficialCalendarDisclaimer({
  disclaimerBefore,
  linkLabel,
}: {
  disclaimerBefore: string;
  linkLabel: string;
}) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ maxWidth: "min(72ch, 100%)" }}
    >
      {disclaimerBefore}{" "}
      <Link
        href={LEGISTAR_CALENDAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
        sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
      >
        {linkLabel}
        <OpenInNewRoundedIcon sx={{ fontSize: 14 }} aria-hidden />
      </Link>
      .
    </Typography>
  );
}

export default async function CityMeetingsPage() {
  const t = dict();
  const mt = t.cityMeetings;
  let meetings: SerializedEvent[] = [];
  let cityCouncilHint: { dateLabel: string; timeLabel: string } | null = null;
  let error = false;

  try {
    meetings = await fetchLegistarEvents();
    const hasUpcomingCityCouncil = meetings.some(
      (e) =>
        e.EventBodyName === "City Council" &&
        isMeetingDateOnOrAfterTodayDenver(e.EventDate) &&
        !isCancelled(e),
    );
    if (!hasUpcomingCityCouncil) {
      cityCouncilHint = await fetchNextCityCouncilCalendarHint();
    }
  } catch {
    error = true;
  }

  const upcoming = meetings.filter(
    (e) => isMeetingDateOnOrAfterTodayDenver(e.EventDate) && !isCancelled(e),
  );
  const recent = meetings.filter(
    (e) => !isMeetingDateOnOrAfterTodayDenver(e.EventDate) && !isCancelled(e),
  );
  const cancelled = meetings.filter((e) => isCancelled(e));

  recent.reverse();

  const signUpWindow = getCouncilSignUpWindow(upcoming);
  const signUpAlert = signUpAlertCopy(mt, signUpWindow, cityCouncilHint);
  const formLinksDisabled =
    signUpWindow.kind === "closed_before" ||
    signUpWindow.kind === "closed_after";

  const cardLabels = {
    agenda: mt.agenda,
    minutes: mt.minutes,
    video: mt.video,
    viewDetails: mt.viewDetails,
    cancelled: mt.cancelled,
    agendaItems: mt.agendaItems,
    addToCalendar: mt.addToCalendar,
    share: mt.share,
    copied: mt.copied,
    fullAgendaPdf: mt.fullAgendaPdf,
    loadingItems: mt.loadingItems,
    noItems: mt.noItems,
    itemsError: mt.itemsError,
    close: mt.close,
    item: mt.item,
    action: mt.action,
    result: mt.result,
    passed: mt.passed,
    failed: mt.failed,
  };

  return (
    <Box>
      <PageHero
        title={mt.title}
        subtitle={mt.subtitle}
        meta={
          <Typography variant="body2" color="text.secondary">
            {mt.sourceNote}{" "}
            <Link
              href="https://elpasotexas.legistar.com/"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {mt.sourceLabel}
              <OpenInNewRoundedIcon sx={{ fontSize: 16 }} aria-hidden />
            </Link>
          </Typography>
        }
      />

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Card
          variant="outlined"
          sx={{
            bgcolor: "background.paper",
            borderColor: "divider",
          }}
        >
          <CardContent sx={{ py: { xs: 2.5, sm: 3 }, "&:last-child": { pb: { xs: 2.5, sm: 3 } } }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <RecordVoiceOverRoundedIcon sx={{ color: "primary.main", fontSize: 22 }} />
                <Typography variant="subtitle1" fontWeight={700}>
                  {mt.participateTitle}
                </Typography>
              </Stack>
              <Stack spacing={0.5} maxWidth="72ch">
                <Typography variant="body2" color="text.secondary">
                  {mt.participateDescriptionOpen}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {mt.participateDescriptionDeadline}
                </Typography>
              </Stack>
              <Alert severity={signUpAlert.severity} sx={{ maxWidth: "min(72ch, 100%)" }}>
                {signUpAlert.message}
              </Alert>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1.5, sm: 2 }}
                flexWrap="wrap"
                useFlexGap
              >
                <ParticipateLink
                  href="https://app.smartsheet.com/b/form/dfad29e838da41fd86052bb264abd397"
                  label={mt.callToPublic}
                  hint={mt.callToPublicHint}
                  disabled={formLinksDisabled}
                />
                <ParticipateLink
                  href="https://app.smartsheet.com/b/form/7086be5f4ed44a239290caa6185d0bdb"
                  label={mt.speakOnItem}
                  hint={mt.speakOnItemHint}
                  disabled={formLinksDisabled}
                />
                <ParticipateLink
                  href="https://app.smartsheet.com/b/form/019cde9563df75c5b6b33517a11efbd8"
                  label={mt.submitStatement}
                  hint={mt.submitStatementHint}
                  disabled={formLinksDisabled}
                />
              </Stack>
              <Link
                href="https://www.elpasotexas.gov/city-clerk/forms/"
                target="_blank"
                rel="noopener noreferrer"
                underline="always"
                variant="body2"
                color="text.secondary"
                sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mt: 1 }}
              >
                {mt.clerkPage}
                <OpenInNewRoundedIcon sx={{ fontSize: 14 }} />
              </Link>
            </Stack>
          </CardContent>
        </Card>
      </Container>

      {error ? (
        <Container maxWidth="lg" sx={{ pb: 4 }}>
          <Alert severity="warning">{mt.loadError}</Alert>
        </Container>
      ) : null}

      {upcoming.length > 0 ? (
        <SectionShell
          band
          eyebrow={mt.upcoming}
          title={`${upcoming.length} upcoming meeting${upcoming.length === 1 ? "" : "s"}`}
        >
          <Stack spacing={2}>
            <Grid container spacing={2}>
              {upcoming.map((event) => (
                <Grid key={event.EventId} size={{ xs: 12, sm: 6, md: 4 }}>
                  <MeetingCard
                    event={event}
                    labels={cardLabels}
                    dateLabel={formatDate(event.EventDate)}
                  />
                </Grid>
              ))}
            </Grid>
            <OfficialCalendarDisclaimer
              disclaimerBefore={mt.officialScheduleDisclaimer}
              linkLabel={mt.officialCalendarLinkLabel}
            />
          </Stack>
        </SectionShell>
      ) : !error ? (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Stack spacing={2}>
            <Typography color="text.secondary">{mt.noUpcoming}</Typography>
            <OfficialCalendarDisclaimer
              disclaimerBefore={mt.officialScheduleDisclaimer}
              linkLabel={mt.officialCalendarLinkLabel}
            />
          </Stack>
        </Container>
      ) : null}

      {recent.length > 0 ? (
        <Container maxWidth="lg" sx={{ mt: { xs: 3, md: 4 } }}>
          <Accordion
            defaultExpanded={false}
            disableGutters
            elevation={0}
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              bgcolor: "background.paper",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreRoundedIcon />}
              sx={{ px: { xs: 2, sm: 3 }, py: 2 }}
            >
              <Stack spacing={0.5}>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: "0.14em" }}>
                  {mt.recent}
                </Typography>
                <Typography variant="h6" component="span">
                  Past 30 days ({recent.length})
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ px: { xs: 2, sm: 3 }, pb: 3, pt: 0 }}>
              <Grid container spacing={2}>
                {recent.map((event) => (
                  <Grid key={event.EventId} size={{ xs: 12, sm: 6, md: 4 }}>
                    <MeetingCard
                      event={event}
                      labels={cardLabels}
                      dateLabel={formatDate(event.EventDate)}
                      past
                    />
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Container>
      ) : null}

      {cancelled.length > 0 ? (
        <Container maxWidth="lg" sx={{ mt: 2, pb: { xs: 6, md: 10 } }}>
          <Accordion
            defaultExpanded={false}
            disableGutters
            elevation={0}
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              bgcolor: "background.paper",
              "&:before": { display: "none" },
              opacity: 0.75,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreRoundedIcon />}
              sx={{ px: { xs: 2, sm: 3 }, py: 2 }}
            >
              <Stack spacing={0.5}>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: "0.14em" }}>
                  {mt.cancelled}
                </Typography>
                <Typography variant="h6" component="span">
                  Cancelled sessions ({cancelled.length})
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ px: { xs: 2, sm: 3 }, pb: 3, pt: 0 }}>
              <Grid container spacing={2}>
                {cancelled.map((event) => (
                  <Grid key={event.EventId} size={{ xs: 12, sm: 6, md: 4 }}>
                    <MeetingCard
                      event={event}
                      labels={cardLabels}
                      dateLabel={formatDate(event.EventDate)}
                      cancelled
                    />
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Container>
      ) : null}
    </Box>
  );
}

function ParticipateLink({
  href,
  label,
  hint,
  disabled,
}: {
  href: string;
  label: string;
  hint: string;
  disabled?: boolean;
}) {
  const cardSx = {
    display: "flex",
    flexDirection: "column",
    gap: 0.25,
    border: 1,
    borderColor: "divider",
    borderRadius: 2,
    px: 2,
    py: 1.5,
    flex: { xs: "1 1 auto", sm: "1 1 0" },
  } as const;

  if (disabled) {
    return (
      <Box
        component="span"
        aria-disabled
        sx={{
          ...cardSx,
          opacity: 0.55,
          cursor: "not-allowed",
          bgcolor: "action.hover",
        }}
      >
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            {label}
          </Typography>
          <OpenInNewRoundedIcon sx={{ fontSize: 14, color: "text.disabled" }} />
        </Stack>
        <Typography variant="caption" color="text.disabled">
          {hint}
        </Typography>
      </Box>
    );
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      underline="none"
      sx={{
        ...cardSx,
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
