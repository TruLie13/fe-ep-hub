import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import { Alert, Box, Card, CardContent, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import NewsletterSignup from "@/components/common/NewsletterSignup";
import PageHero from "@/components/common/PageHero";
import SectionShell from "@/components/common/SectionShell";
import { dict } from "@/lib/i18n/dictionary";

export const metadata: Metadata = {
  title: "Pledge",
  description:
    "Resident and business pledge pathways for transparent, efficient data center policy in El Paso. Live signup arrives in a later phase.",
};

export default function PledgePage() {
  const t = dict();

  return (
    <Box id="printable-pledge" className="printable-root">
      <PageHero title={t.pledge.title} subtitle={t.pledge.subtitle} />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Alert severity="info" sx={{ mb: 4 }}>
        {t.pledge.apiNote}
      </Alert>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <VolunteerActivismRoundedIcon color="primary" />
                  <Typography variant="h5">{t.pledge.residentTitle}</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {t.pledge.residentBody}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip label={t.pledge.supportersComingSoon} variant="outlined" />
                  <Chip label={t.pledge.placeholderCount} variant="outlined" />
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {t.pledge.residentFuture}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Groups2RoundedIcon color="primary" />
                  <Typography variant="h5">{t.pledge.businessTitle}</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {t.pledge.businessBody}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip label={t.pledge.orgsComingSoon} variant="outlined" />
                  <Chip label={t.pledge.efficiencyTbd} variant="outlined" />
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {t.pledge.businessFuture}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <SectionShell
        eyebrow={t.pledge.newsletterEyebrow}
        title={t.pledge.newsletterTitle}
        description={t.pledge.newsletterDescription}
        dense
      >
        <NewsletterSignup />
      </SectionShell>
      </Container>
    </Box>
  );
}
