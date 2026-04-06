import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import CitationLinks from "@/components/common/CitationLinks";
import DataCentersRichText from "@/components/data-centers/DataCentersRichText";
import { DataCenterSectionIcon } from "@/components/data-centers/dataCenterSectionIcon";
import type {
  DataCentersEconomicTable,
  DataCentersImpactSection,
  DataCentersNoiseTable,
  Source,
  SourcesBundle,
} from "@/content/schema";
import { pickSources } from "@/lib/content/load";

const anchorSx = {
  // Mobile needs extra offset because the sticky "On this page" panel overlays section starts.
  scrollMarginTop: { xs: 196, md: 120, lg: 96 },
} as const;

/** Long-form column width; body uses theme `body2` (same density as Learn cards + data-centers tables). */
const proseColumnSx: SxProps<Theme> = {
  maxWidth: "min(72ch, 100%)",
};

/** Secondary prose: color only; size and line height come from `variant="body2"`. */
const bodyProseSx: SxProps<Theme> = {
  color: "text.secondary",
};

export type DataCentersSectionsLabels = {
  statsLabel: string;
  highlightsLabel: string;
  downloadsLabel: string;
};

export type DataCentersNoiseTableLabels = {
  jurisdiction: string;
  day: string;
  night: string;
  where: string;
  note: string;
};

export type DataCentersEconomicTableLabels = {
  project: string;
  investment: string;
  promised: string;
  actual: string;
  note: string;
};

/**
 * Renders every entry in `content/data/data-centers-impacts.json` → `sections` (no per-section branches in the page).
 */
export default function DataCentersSections({
  sections,
  sources,
  labels,
  noiseTable,
  noiseTableSources,
  noiseTableLabels,
  economicTable,
  economicTableSources,
  economicTableLabels,
}: {
  sections: DataCentersImpactSection[];
  sources: SourcesBundle;
  labels: DataCentersSectionsLabels;
  noiseTable?: DataCentersNoiseTable;
  noiseTableSources?: Source[];
  noiseTableLabels?: DataCentersNoiseTableLabels;
  economicTable?: DataCentersEconomicTable;
  economicTableSources?: Source[];
  economicTableLabels?: DataCentersEconomicTableLabels;
}) {
  return (
    <>
      {sections.map((section) => {
        const cite = pickSources(sources, section.sourceIds ?? []);
        const paragraphs = section.paragraphs ?? [];
        const bulletGroups = section.bulletGroups ?? [];
        const bullets = section.bullets ?? [];
        const paragraphsAfter = section.paragraphsAfterLists ?? [];
        const hasProseStack =
          paragraphs.length > 0 ||
          bulletGroups.length > 0 ||
          bullets.length > 0 ||
          paragraphsAfter.length > 0;
        const hasStats = (section.stats?.length ?? 0) > 0;
        const takeawayChips =
          (section.takeaways?.length ? section.takeaways : section.highlights) ?? [];
        const hasTakeawayChips = takeawayChips.length > 0;
        /** Air below the title block before stats, chips, or body (clearer hierarchy than tight margins). */
        const headerBlockMb =
          hasStats || hasTakeawayChips || hasProseStack || Boolean(section.download)
            ? { xs: 3.5, md: 4 }
            : { xs: 2.5, md: 3 };

        const headingId = `${section.id}-heading`;

        return (
          <Box
            key={section.id}
            component="section"
            id={section.id}
            aria-labelledby={headingId}
            sx={anchorSx}
          >
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                bgcolor: "background.paper",
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={{ xs: 2, md: 2.5 }} sx={{ mb: headerBlockMb }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 4,
                      borderRadius: 1,
                      bgcolor: "primary.main",
                    }}
                    aria-hidden
                  />
                  <Typography
                    variant="overline"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      color: "text.secondary",
                      lineHeight: 1.6,
                    }}
                  >
                    <DataCentersRichText text={section.eyebrow} sources={cite} />
                  </Typography>
                  {section.icon ? (
                    <Stack direction="row" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          display: "grid",
                          placeItems: "center",
                          bgcolor: "action.hover",
                          color: "primary.main",
                          flexShrink: 0,
                        }}
                        aria-hidden
                      >
                        <DataCenterSectionIcon iconKey={section.icon} sx={{ m: 0 }} />
                      </Box>
                      <Typography id={headingId} component="h2" variant="h6" sx={{ flex: 1, minWidth: 0 }}>
                        <DataCentersRichText text={section.title} sources={cite} />
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography id={headingId} component="h2" variant="h6" sx={{ m: 0 }}>
                      <DataCentersRichText text={section.title} sources={cite} />
                    </Typography>
                  )}
                </Stack>

              {section.stats && section.stats.length > 0 ? (
                <Box sx={{ mb: hasTakeawayChips ? 3 : 2.5 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                    display="block"
                    sx={{ mb: 2, letterSpacing: "0.02em" }}
                  >
                    {labels.statsLabel}
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      width: "100%",
                      gap: 1.25,
                      alignItems: "start",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))",
                      },
                    }}
                  >
                    {section.stats.map((st, i) => (
                      <Card
                        key={`${section.id}-stat-${i}`}
                        variant="outlined"
                        title={st.hint ?? undefined}
                        sx={{
                          width: "100%",
                          maxWidth: "100%",
                          justifySelf: "stretch",
                          borderRadius: 2,
                          boxSizing: "border-box",
                        }}
                      >
                        <CardContent
                          sx={{
                            px: { xs: 2.25, sm: 2.5 },
                            py: { xs: 1.75, sm: 2 },
                            textAlign: { xs: "center", sm: "left" },
                            "&:last-child": {
                              pb: { xs: 1.75, sm: 2 },
                            },
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            component="p"
                            sx={{
                              fontWeight: 700,
                              lineHeight: 1.3,
                              mb: 0.5,
                              color: "text.primary",
                              wordBreak: "break-word",
                            }}
                          >
                            <DataCentersRichText text={st.value} sources={cite} />
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ lineHeight: 1.35 }}>
                            <DataCentersRichText text={st.label} sources={cite} />
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Box>
              ) : null}

              {hasTakeawayChips ? (
                <Box
                  sx={{
                    mb: section.download ? 2 : hasProseStack ? 2.5 : 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                    display="block"
                    sx={{ mb: 2, letterSpacing: "0.02em" }}
                  >
                    {labels.highlightsLabel}
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {takeawayChips.map((h, i) => (
                      <Chip
                        key={`${section.id}-hl-${i}`}
                        label={<DataCentersRichText text={h} sources={cite} />}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{
                          height: "auto",
                          py: 0.5,
                          "& .MuiChip-label": { whiteSpace: "normal", display: "block" },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              ) : null}

              {section.download ? (
                <Box sx={{ mb: hasProseStack ? 2.5 : 2 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                    display="block"
                    sx={{ mb: 2, letterSpacing: "0.02em" }}
                  >
                    {labels.downloadsLabel}
                  </Typography>
                  <Button
                    component={Link}
                    href={section.download.href}
                    download={section.download.fileName}
                    variant="outlined"
                    size="small"
                    endIcon={<DownloadRoundedIcon />}
                  >
                    {section.download.label}
                  </Button>
                </Box>
              ) : null}

              {hasProseStack ? (
                <Stack
                  spacing={2.5}
                  sx={{
                    ...proseColumnSx,
                    mt:
                      paragraphs.length === 0 && (bulletGroups.length > 0 || bullets.length > 0)
                        ? 2
                        : 0,
                  }}
                >
                  {paragraphs.map((para, i) => (
                    <Typography
                      key={`${section.id}-p-${i}`}
                      variant="body2"
                      paragraph={i < paragraphs.length - 1}
                      sx={bodyProseSx}
                    >
                      <DataCentersRichText text={para} sources={cite} />
                    </Typography>
                  ))}

                  {bulletGroups.map((g, gi) => (
                    <Box key={`${section.id}-bg-${gi}`}>
                      <Typography variant="subtitle1" component="div" fontWeight={600} gutterBottom>
                        <DataCentersRichText text={g.title} sources={cite} />
                      </Typography>
                      {g.lead ? (
                        <Typography variant="body2" paragraph sx={bodyProseSx}>
                          <DataCentersRichText text={g.lead} sources={cite} />
                        </Typography>
                      ) : null}
                      <Box component="ul" sx={{ pl: 2.5, m: 0, mt: g.lead ? 1 : 0 }}>
                        {g.items.map((item, ii) => (
                          <Typography
                            key={`${section.id}-bgi-${gi}-${ii}`}
                            component="li"
                            variant="body2"
                            sx={{ ...bodyProseSx, mb: 0.75, "&:last-child": { mb: 0 } }}
                          >
                            <DataCentersRichText text={item} sources={cite} />
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  ))}

                  {bullets.length > 0 ? (
                    <Box component="ul" sx={{ pl: 2.5, m: 0 }}>
                      {bullets.map((b, i) => (
                        <Typography
                          key={`${section.id}-bl-${i}`}
                          component="li"
                          variant="body2"
                          sx={{ ...bodyProseSx, mb: 0.75, "&:last-child": { mb: 0 } }}
                        >
                          <DataCentersRichText text={b} sources={cite} />
                        </Typography>
                      ))}
                    </Box>
                  ) : null}

                  {paragraphsAfter.map((para, i) => (
                    <Typography key={`${section.id}-after-${i}`} variant="body2" sx={bodyProseSx} paragraph>
                      <DataCentersRichText text={para} sources={cite} />
                    </Typography>
                  ))}
                </Stack>
              ) : null}

              {section.id === "noise" && noiseTable && noiseTableLabels ? (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                    <DataCentersRichText
                      text={noiseTable.caption}
                      sources={noiseTableSources ?? []}
                    />
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table
                      size="small"
                      sx={{
                        "& .MuiTableCell-root": {
                          borderColor: "rgba(255,255,255,0.28)",
                        },
                      }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>{noiseTableLabels.jurisdiction}</TableCell>
                          <TableCell>{noiseTableLabels.day}</TableCell>
                          <TableCell>{noiseTableLabels.night}</TableCell>
                          <TableCell>{noiseTableLabels.where}</TableCell>
                          <TableCell>{noiseTableLabels.note}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(noiseTable.rows ?? []).map((row, ri) => (
                          <TableRow key={`${row.jurisdiction}-${ri}`}>
                            <TableCell>
                              <Typography variant="body2" component="div">
                                <DataCentersRichText
                                  text={row.jurisdiction}
                                  sources={noiseTableSources ?? []}
                                />
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" component="div">
                                <DataCentersRichText
                                  text={row.dayDb}
                                  sources={noiseTableSources ?? []}
                                />
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" component="div">
                                <DataCentersRichText
                                  text={row.nightDb}
                                  sources={noiseTableSources ?? []}
                                />
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" component="div">
                                <DataCentersRichText
                                  text={row.measurementPoint}
                                  sources={noiseTableSources ?? []}
                                />
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" component="div">
                                <DataCentersRichText
                                  text={row.sourceNote}
                                  sources={noiseTableSources ?? []}
                                />
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ) : null}

              {section.id === "socioeconomic" && economicTable && economicTableLabels ? (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                    <DataCentersRichText
                      text={economicTable.caption}
                      sources={economicTableSources ?? []}
                    />
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table
                      size="small"
                      sx={{
                        "& .MuiTableCell-root": {
                          borderColor: "rgba(255,255,255,0.28)",
                        },
                      }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>{economicTableLabels.project}</TableCell>
                          <TableCell>{economicTableLabels.investment}</TableCell>
                          <TableCell>{economicTableLabels.promised}</TableCell>
                          <TableCell>{economicTableLabels.actual}</TableCell>
                          <TableCell>{economicTableLabels.note}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(economicTable.rows ?? []).map((row, ri) => (
                          <TableRow key={`${row.project}-${ri}`}>
                            <TableCell>
                              <Typography variant="body2" component="div">
                                <DataCentersRichText
                                  text={row.project}
                                  sources={economicTableSources ?? []}
                                />
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" component="div">
                                <DataCentersRichText
                                  text={row.investment}
                                  sources={economicTableSources ?? []}
                                />
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" component="div">
                                <DataCentersRichText
                                  text={row.promisedJobs}
                                  sources={economicTableSources ?? []}
                                />
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" component="div">
                                <DataCentersRichText
                                  text={row.actualOrRevisedJobs}
                                  sources={economicTableSources ?? []}
                                />
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" component="div">
                                <DataCentersRichText
                                  text={row.sourceNote}
                                  sources={economicTableSources ?? []}
                                />
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ) : null}

              <Box sx={{ mt: 3 }}>
                <CitationLinks sources={cite} />
              </Box>
            </CardContent>
            </Card>
          </Box>
        );
      })}
    </>
  );
}
