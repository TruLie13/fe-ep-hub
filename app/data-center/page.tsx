import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";
import PageHeroMetaRow from "@/components/common/PageHeroMetaRow";
import PrintSectionButton from "@/components/common/PrintSectionButton";
import StickyInPageToc from "@/components/common/StickyInPageToc";
import type { StickyInPageTocItem } from "@/components/common/StickyInPageToc";
import DataCentersMobileToc from "@/components/data-centers/DataCentersMobileToc";
import DataCentersSections from "@/components/data-centers/DataCentersSections";
import DataCentersSectionNav from "@/components/data-centers/DataCentersSectionNav";
import { dict } from "@/lib/i18n/dictionary";
import { loadDataCentersImpacts, loadSourcesBundle, pickSources } from "@/lib/content/load";

export function generateMetadata(): Metadata {
  const p = dict().dataCentersPage;
  return {
    title: p.metaTitle,
    description: p.metaDescription,
  };
}

export default function DataCentersPage() {
  const t = dict();
  const p = t.dataCentersPage;
  const bundle = loadDataCentersImpacts();
  const sources = loadSourcesBundle();
  const noiseTableSources = pickSources(sources, bundle.noiseTable?.sourceIds ?? []);
  const economicTableSources = pickSources(sources, bundle.economicTable?.sourceIds ?? []);

  const tocItems: StickyInPageTocItem[] = bundle.sections.map((s) => ({
    id: s.id,
    label: s.eyebrow,
  }));

  return (
    <Box id="printable-data-centers" className="printable-root">
      <PageHero
        title={p.title}
        subtitle={p.subtitle}
        meta={
          <PageHeroMetaRow>
            <PrintSectionButton sectionId="printable-data-centers" label={t.common.printSavePdf} />
          </PageHeroMetaRow>
        }
      />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Box
          sx={{
            display: { xs: "block", md: "flex" },
            gap: { md: 4 },
            /* Stretch sidebars to main column height so position:sticky TOC can stay in view while scrolling */
            alignItems: "stretch",
          }}
        >
          <DataCentersMobileToc
            label={p.tocLabel}
            ariaLabel={p.tocLabel}
            expandSectionsLabel={p.tocExpandSections}
            collapseSectionsLabel={p.tocCollapseSections}
            sections={bundle.sections}
          />

          <Box
            component="aside"
            sx={{
              display: { xs: "none", md: "block", lg: "none" },
              width: { md: 260 },
              flexShrink: 0,
              "@media print": { display: "none" },
            }}
          >
            <StickyInPageToc
              title={p.tocLabel}
              ariaLabel={p.tocLabel}
              items={tocItems}
              preset="dataCenters"
            />
          </Box>

          <Box
            component="aside"
            sx={{
              display: { xs: "none", lg: "block" },
              width: { lg: 260 },
              flexShrink: 0,
              "@media print": { display: "none" },
            }}
          >
            <DataCentersSectionNav title={p.tocLabel} ariaLabel={p.tocLabel} sections={bundle.sections} />
          </Box>

          <Stack spacing={4} sx={{ flex: 1, minWidth: 0, pt: { xs: 5, md: 5, lg: 0 } }}>
            <DataCentersSections
              sections={bundle.sections}
              sources={sources}
              labels={{
                statsLabel: p.statsLabel,
                highlightsLabel: p.highlightsLabel,
                downloadsLabel: p.downloadsLabel,
              }}
              noiseTable={bundle.noiseTable}
              noiseTableSources={noiseTableSources}
              noiseTableLabels={{
                jurisdiction: p.tableNoiseJurisdiction,
                day: p.tableNoiseDay,
                night: p.tableNoiseNight,
                where: p.tableNoiseWhere,
                note: p.tableNoiseNote,
              }}
              economicTable={bundle.economicTable}
              economicTableSources={economicTableSources}
              economicTableLabels={{
                project: p.tableEconProject,
                investment: p.tableEconInvestment,
                promised: p.tableEconPromised,
                actual: p.tableEconActual,
                note: p.tableEconNote,
              }}
            />

            <Divider />

            <Stack spacing={2} direction={{ xs: "column", sm: "row" }} sx={{ gap: 2 }}>
              <Card variant="outlined" sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    {p.learnLinkTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {p.learnLinkBody}
                  </Typography>
                  <Button component={Link} href="/learn" endIcon={<ArrowForwardRoundedIcon />} variant="contained" size="small">
                    {p.learnLinkCta}
                  </Button>
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    {p.engageLinkTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {p.engageLinkBody}
                  </Typography>
                  <Button
                    component={Link}
                    href="/city-meetings"
                    endIcon={<ArrowForwardRoundedIcon />}
                    variant="outlined"
                    size="small"
                  >
                    {p.engageLinkCta}
                  </Button>
                </CardContent>
              </Card>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
