import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import CitationLinks from "@/components/common/CitationLinks";
import DataCentersRichText from "@/components/data-centers/DataCentersRichText";
import { DataCenterSectionIcon } from "@/components/data-centers/dataCenterSectionIcon";
import type { DataCentersImpactSection, SourcesBundle } from "@/content/schema";
import { pickSources } from "@/lib/content/load";

const anchorSx = {
  scrollMarginTop: { xs: 120, md: 120, lg: 96 },
} as const;

export type DataCentersSectionsLabels = {
  statsLabel: string;
  highlightsLabel: string;
};

/**
 * Renders every entry in `content/data/data-centers-impacts.json` → `sections` (no per-section branches in the page).
 */
export default function DataCentersSections({
  sections,
  sources,
  labels,
}: {
  sections: DataCentersImpactSection[];
  sources: SourcesBundle;
  labels: DataCentersSectionsLabels;
}) {
  return (
    <>
      {sections.map((section) => {
        const cite = pickSources(sources, section.sourceIds ?? []);
        const paragraphs = section.paragraphs ?? [];

        const headingId = `${section.id}-heading`;

        return (
          <Box
            key={section.id}
            component="section"
            id={section.id}
            aria-labelledby={headingId}
            sx={anchorSx}
          >
            <Card variant="outlined">
              <CardContent>
                <Typography
                  variant="overline"
                  sx={{ fontWeight: 700, letterSpacing: "0.14em", color: "text.secondary" }}
                >
                  <DataCentersRichText text={section.eyebrow} sources={cite} />
                </Typography>
                {section.icon ? (
                  <Stack direction="row" alignItems="flex-start" gap={1} sx={{ mt: 0.5, mb: 2 }}>
                    <DataCenterSectionIcon iconKey={section.icon} sx={{ mt: 0.35 }} />
                    <Typography id={headingId} component="h2" variant="h5" sx={{ flex: 1, minWidth: 0 }}>
                      <DataCentersRichText text={section.title} sources={cite} />
                    </Typography>
                  </Stack>
                ) : (
                  <Typography id={headingId} component="h2" variant="h5" sx={{ mt: 0.5, mb: 2 }}>
                    <DataCentersRichText text={section.title} sources={cite} />
                  </Typography>
                )}

              {section.stats && section.stats.length > 0 ? (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" gutterBottom>
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
                          width: { xs: "fit-content", sm: "100%" },
                          maxWidth: "100%",
                          justifySelf: { xs: "start", sm: "stretch" },
                          borderRadius: 2,
                          boxSizing: "border-box",
                        }}
                      >
                        <CardContent
                          sx={{
                            px: { xs: 2, sm: 2.25 },
                            py: { xs: 1.5, sm: 1.75 },
                            "&:last-child": {
                              pb: { xs: 1.5, sm: 1.75 },
                            },
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            component="p"
                            sx={{
                              fontWeight: 700,
                              lineHeight: 1.3,
                              mb: 0.5,
                              color: "text.primary",
                              fontSize: { xs: "1rem", sm: "1.0625rem" },
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

              {section.highlights && section.highlights.length > 0 ? (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" gutterBottom>
                    {labels.highlightsLabel}
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {section.highlights.map((h, i) => (
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

              {paragraphs.map((para, i) => (
                <Typography
                  key={`${section.id}-p-${i}`}
                  variant="body2"
                  color="text.secondary"
                  paragraph={i < paragraphs.length - 1}
                >
                  <DataCentersRichText text={para} sources={cite} />
                </Typography>
              ))}

              {section.bulletGroups?.map((g, gi) => (
                <Box key={`${section.id}-bg-${gi}`} sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    <DataCentersRichText text={g.title} sources={cite} />
                  </Typography>
                  {g.lead ? (
                    <Typography variant="body2" color="text.secondary" paragraph>
                      <DataCentersRichText text={g.lead} sources={cite} />
                    </Typography>
                  ) : null}
                  <Box component="ul" sx={{ pl: 2.5, m: 0 }}>
                    {g.items.map((item, ii) => (
                      <Typography
                        key={`${section.id}-bgi-${gi}-${ii}`}
                        component="li"
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        <DataCentersRichText text={item} sources={cite} />
                      </Typography>
                    ))}
                  </Box>
                </Box>
              ))}

              {section.bullets && section.bullets.length > 0 ? (
                <Box component="ul" sx={{ pl: 2.5, mt: 2 }}>
                  {section.bullets.map((b, i) => (
                    <Typography key={`${section.id}-bl-${i}`} component="li" variant="body2" color="text.secondary">
                      <DataCentersRichText text={b} sources={cite} />
                    </Typography>
                  ))}
                </Box>
              ) : null}

              {section.paragraphsAfterLists?.map((para, i) => (
                <Typography key={`${section.id}-after-${i}`} variant="body2" color="text.secondary" sx={{ mt: 2 }} paragraph>
                  <DataCentersRichText text={para} sources={cite} />
                </Typography>
              ))}

              {section.download ? (
                <Box sx={{ mt: 2 }}>
                  <Button
                    component={Link}
                    href={section.download.href}
                    download={section.download.fileName}
                    variant="outlined"
                    size="small"
                  >
                    {section.download.label}
                  </Button>
                </Box>
              ) : null}

              <Box sx={{ mt: 2 }}>
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
