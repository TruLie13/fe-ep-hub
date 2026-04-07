"use client";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import {
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type RawItem = {
  EventItemId: number;
  EventItemAgendaNumber: string | null;
  EventItemTitle: string | null;
  EventItemMatterFile: string | null;
  EventItemMatterType: string | null;
  EventItemActionName: string | null;
  EventItemPassedFlagName: string | null;
  EventItemAgendaSequence: number;
};

type AgendaSection = {
  id: string;
  heading: string;
  items: RawItem[];
};

export type AgendaModalLabels = {
  agendaItems: string;
  fullAgendaPdf: string;
  loadingItems: string;
  noItems: string;
  itemsError: string;
  close: string;
  item: string;
  action: string;
  result: string;
  passed: string;
  failed: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  eventId: number;
  bodyName: string;
  dateLabel: string;
  agendaPdfUrl: string | null;
  labels: AgendaModalLabels;
};

function isHeader(item: RawItem): boolean {
  const title = item.EventItemTitle?.trim() ?? "";
  if (!title || item.EventItemMatterFile) return false;
  return title === title.toUpperCase() && title.length > 5;
}

function isMatter(item: RawItem): boolean {
  return Boolean(item.EventItemMatterFile);
}

function formatHeading(raw: string): string {
  const cleaned = raw
    .replace(/^\d{1,2}:\d{2}\s*(A\.?M\.?|P\.?M\.?)\s*/i, "")
    .trim();
  if (!cleaned) return raw.trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
}

function buildSections(raw: RawItem[]): AgendaSection[] {
  const sorted = [...raw].sort(
    (a, b) => a.EventItemAgendaSequence - b.EventItemAgendaSequence,
  );

  const sections: AgendaSection[] = [];
  let current: AgendaSection | null = null;

  for (const item of sorted) {
    if (isHeader(item)) {
      current = {
        id: `section-${item.EventItemAgendaSequence}`,
        heading: formatHeading(item.EventItemTitle!),
        items: [],
      };
      sections.push(current);
    } else if (isMatter(item)) {
      if (!current) {
        current = {
          id: "section-general",
          heading: "General",
          items: [],
        };
        sections.push(current);
      }
      current.items.push(item);
    }
  }

  return sections.filter((s) => s.items.length > 0);
}

export default function AgendaModal({
  open,
  onClose,
  eventId,
  bodyName,
  dateLabel,
  agendaPdfUrl,
  labels,
}: Props) {
  const [raw, setRaw] = useState<RawItem[]>([]);
  const [error, setError] = useState(false);
  const [fetched, setFetched] = useState<number | null>(null);
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const contentRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (!open || fetched === eventId) return;

    let cancelled = false;

    fetch(`/api/agenda-items?eventId=${eventId}`)
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed");
        return res.json() as Promise<RawItem[]>;
      })
      .then((data) => {
        if (!cancelled) {
          setRaw(data);
          setError(false);
          setFetched(eventId);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setFetched(eventId);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, eventId, fetched]);

  const showError = error && fetched === eventId;
  const loading = open && fetched !== eventId && !showError;

  const sections = useMemo(() => buildSections(raw), [raw]);
  const totalItems = useMemo(
    () => sections.reduce((n, s) => n + s.items.length, 0),
    [sections],
  );

  const scrollToSection = useCallback((id: string) => {
    const el = sectionRefs.current.get(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const setSectionRef = useCallback(
    (id: string, el: HTMLDivElement | null) => {
      if (el) sectionRefs.current.set(id, el);
      else sectionRefs.current.delete(id);
    },
    [],
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="lg"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          ...(!isMobile && {
            height: "85dvh",
            maxHeight: "85dvh",
            m: 2,
            borderRadius: 2,
          }),
        },
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: { xs: 2, sm: 3 },
          pt: { xs: "max(12px, env(safe-area-inset-top))", sm: 2 },
          pb: 1.5,
          gap: 1,
        }}
      >
        <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            component="span"
            fontWeight={700}
          >
            {labels.agendaItems}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {bodyName} — {dateLabel}
          </Typography>
        </Stack>
        <IconButton
          onClick={onClose}
          aria-label={labels.close}
          edge="end"
          sx={{ ml: 1 }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Stack>

      {agendaPdfUrl ? (
        <Box sx={{ px: { xs: 2, sm: 3 }, pb: 1.5 }}>
          <Link
            href={agendaPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            underline="always"
            variant="body2"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <DescriptionRoundedIcon sx={{ fontSize: 16 }} />
            {labels.fullAgendaPdf}
            <OpenInNewRoundedIcon sx={{ fontSize: 14 }} />
          </Link>
        </Box>
      ) : null}

      <Divider />

      {/* Content */}
      <DialogContent sx={{ p: 0, display: "flex", overflow: "hidden" }}>
        {loading ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ width: "100%", py: 8 }}
          >
            <CircularProgress size={32} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {labels.loadingItems}
            </Typography>
          </Stack>
        ) : showError ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ width: "100%", py: 8 }}
          >
            <Typography color="error">{labels.itemsError}</Typography>
          </Stack>
        ) : totalItems === 0 ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ width: "100%", py: 8 }}
          >
            <Typography color="text.secondary">{labels.noItems}</Typography>
          </Stack>
        ) : (
          <>
            {/* TOC sidebar — desktop only */}
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                width: 240,
                minWidth: 240,
                borderRight: 1,
                borderColor: "divider",
                overflowY: "auto",
                py: 1,
              }}
            >
              <List dense disablePadding>
                {sections.map((section) => (
                  <ListItemButton
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    sx={{ px: 2, py: 0.75 }}
                  >
                    <ListItemText
                      primary={section.heading}
                      secondary={`${section.items.length} item${section.items.length === 1 ? "" : "s"}`}
                      slotProps={{
                        primary: {
                          variant: "caption",
                          fontWeight: 600,
                          sx: {
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          },
                        },
                        secondary: {
                          variant: "caption",
                        },
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Box>

            {/* Grouped agenda items */}
            <Box
              ref={contentRef}
              sx={{
                flex: 1,
                overflowY: "auto",
                px: { xs: 2, sm: 3 },
                py: { xs: 1.5, sm: 2 },
                pb: {
                  xs: "max(16px, env(safe-area-inset-bottom))",
                  sm: 2,
                },
                WebkitOverflowScrolling: "touch",
              }}
            >
              {sections.map((section, sIdx) => (
                <Box
                  key={section.id}
                  ref={(el: HTMLDivElement | null) =>
                    setSectionRef(section.id, el)
                  }
                  sx={{ mb: sIdx < sections.length - 1 ? { xs: 2, sm: 3 } : 0 }}
                >
                  <Typography
                    component="h3"
                    variant={isMobile ? "caption" : "subtitle2"}
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      display: "block",
                      lineHeight: 1.4,
                      bgcolor: "action.hover",
                      borderRadius: 1,
                      px: { xs: 1, sm: 1.5 },
                      py: { xs: 0.75, sm: 1 },
                      mb: { xs: 1, sm: 1.5 },
                    }}
                  >
                    {section.heading}
                  </Typography>

                  <Stack spacing={0}>
                    {section.items.map((item, idx) => (
                      <Box
                        key={item.EventItemId}
                        sx={{
                          py: { xs: 1.25, sm: 1.5 },
                          borderBottom:
                            idx < section.items.length - 1 ? 1 : 0,
                          borderColor: "divider",
                        }}
                      >
                        <Stack spacing={0.75}>
                          <Stack
                            direction="row"
                            spacing={0.75}
                            alignItems="center"
                            flexWrap="wrap"
                            useFlexGap
                            sx={{ rowGap: 0.5 }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 700,
                                color: "primary.main",
                              }}
                            >
                              {item.EventItemAgendaNumber?.replace(/\.$/, "") ??
                                "—"}
                            </Typography>
                            <Chip
                              size="small"
                              label={item.EventItemMatterFile}
                              variant="outlined"
                              sx={{ height: { xs: 22, sm: 24 } }}
                            />
                            {item.EventItemMatterType ? (
                              <Chip
                                size="small"
                                label={item.EventItemMatterType}
                                variant="outlined"
                                color="primary"
                                sx={{ height: { xs: 22, sm: 24 } }}
                              />
                            ) : null}
                            {item.EventItemActionName ? (
                              <Chip
                                size="small"
                                label={item.EventItemActionName}
                                sx={{ height: { xs: 22, sm: 24 } }}
                              />
                            ) : null}
                            {item.EventItemPassedFlagName ? (
                              <Chip
                                size="small"
                                color={
                                  item.EventItemPassedFlagName === "Pass"
                                    ? "success"
                                    : "error"
                                }
                                label={
                                  item.EventItemPassedFlagName === "Pass"
                                    ? labels.passed
                                    : item.EventItemPassedFlagName === "Fail"
                                      ? labels.failed
                                      : item.EventItemPassedFlagName
                                }
                                sx={{ height: { xs: 22, sm: 24 } }}
                              />
                            ) : null}
                          </Stack>

                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ fontSize: { xs: "0.8125rem", sm: "0.875rem" } }}
                          >
                            {item.EventItemTitle}
                          </Typography>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
