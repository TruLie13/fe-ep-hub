"use client";

import { useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Collapse, Paper, Stack, Typography } from "@mui/material";
import AddToCalendarLink from "@/components/local-election/AddToCalendarLink";
import type { AllDayCalendarEvent } from "@/lib/local-election/calendar";

export type VotingDateItem = {
  label: string;
  dateText: string;
  calendarEvent?: AllDayCalendarEvent;
  addToCalendarAria?: string;
  tooltip?: string;
  tooltipAria?: string;
};

type VotingDatesProps = {
  rows: VotingDateItem[];
  addToCalendarLabel: string;
};

function InfoToggle({
  label,
  open,
  onToggle,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      aria-label={label}
      aria-expanded={open}
      onClick={onToggle}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: { xs: 44, sm: 24 },
        minHeight: { xs: 44, sm: 24 },
        m: { xs: -1.25, sm: 0 },
        p: 0,
        border: 0,
        bgcolor: "transparent",
        color: "text.secondary",
        cursor: "pointer",
      }}
    >
      <InfoOutlinedIcon sx={{ fontSize: 16 }} aria-hidden />
    </Box>
  );
}

function InfoCard({ text }: { text: string }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        maxWidth: "46ch",
        bgcolor: "background.default",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </Paper>
  );
}

function DateLabel({
  row,
  infoOpen,
  onToggleInfo,
}: {
  row: VotingDateItem;
  infoOpen: boolean;
  onToggleInfo: () => void;
}) {
  return (
    <Stack direction="row" spacing={0.5} alignItems="center" component="span" sx={{ display: "inline-flex" }}>
      <Typography variant="body1" sx={{ fontWeight: 700 }}>
        {row.label}
      </Typography>
      {row.tooltip ? (
        <InfoToggle
          label={row.tooltipAria ?? row.tooltip}
          open={infoOpen}
          onToggle={onToggleInfo}
        />
      ) : null}
    </Stack>
  );
}

function DateRow({
  row,
  addToCalendarLabel,
  layout,
}: {
  row: VotingDateItem;
  addToCalendarLabel: string;
  layout: "stack" | "table";
}) {
  const [infoOpen, setInfoOpen] = useState(false);
  const infoCard = row.tooltip ? (
    <Collapse in={infoOpen} unmountOnExit>
      <Box sx={{ pt: 1 }}>
        <InfoCard text={row.tooltip} />
      </Box>
    </Collapse>
  ) : null;

  if (layout === "stack") {
    return (
      <Stack spacing={0.5}>
        <DateLabel row={row} infoOpen={infoOpen} onToggleInfo={() => setInfoOpen((open) => !open)} />
        <Typography variant="body1">{row.dateText}</Typography>
        {row.calendarEvent && row.addToCalendarAria ? (
          <Box sx={{ pt: 0.25, pb: 0.5 }}>
            <AddToCalendarLink
              event={row.calendarEvent}
              label={addToCalendarLabel}
              ariaLabel={row.addToCalendarAria}
            />
          </Box>
        ) : null}
        {infoCard}
      </Stack>
    );
  }

  return (
    <>
      <Box component="tr">
        <Box component="td" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
          <DateLabel row={row} infoOpen={infoOpen} onToggleInfo={() => setInfoOpen((open) => !open)} />
        </Box>
        <Box component="td" sx={{ whiteSpace: "nowrap" }}>
          {row.dateText}
        </Box>
        <Box component="td" sx={{ whiteSpace: "nowrap" }}>
          {row.calendarEvent && row.addToCalendarAria ? (
            <AddToCalendarLink
              event={row.calendarEvent}
              label={addToCalendarLabel}
              ariaLabel={row.addToCalendarAria}
            />
          ) : null}
        </Box>
      </Box>
      {row.tooltip ? (
        <Box component="tr">
          <Box component="td" colSpan={3} className="info-note">
            {infoCard}
          </Box>
        </Box>
      ) : null}
    </>
  );
}

export default function VotingDates({ rows, addToCalendarLabel }: VotingDatesProps) {
  return (
    <>
      <Stack spacing={2.25} sx={{ display: { xs: "flex", sm: "none" } }}>
        {rows.map((row) => (
          <DateRow key={row.label} row={row} addToCalendarLabel={addToCalendarLabel} layout="stack" />
        ))}
      </Stack>

      <Box
        component="table"
        sx={{
          display: { xs: "none", sm: "table" },
          width: "auto",
          maxWidth: "100%",
          borderCollapse: "collapse",
          "& td": {
            verticalAlign: "baseline",
            py: 0.75,
            pr: 2,
            "&:last-child": { pr: 0 },
          },
          "& td.info-note": {
            py: 0,
            pr: 0,
            whiteSpace: "normal",
          },
        }}
      >
        <Box component="tbody">
          {rows.map((row) => (
            <DateRow key={row.label} row={row} addToCalendarLabel={addToCalendarLabel} layout="table" />
          ))}
        </Box>
      </Box>
    </>
  );
}
