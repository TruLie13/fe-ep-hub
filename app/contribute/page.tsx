import GitHubIcon from "@mui/icons-material/GitHub";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import { dict } from "@/lib/i18n/dictionary";
import { buildPageJsonLd, buildPageMetadata } from "@/lib/seo/site";

const CONTRIBUTE_SEO = {
  title: "Contribute",
  description: "Submit tips for review or contribute improvements via GitHub.",
  path: "/contribute",
  schemaType: "ContactPage",
} as const;

export const metadata: Metadata = buildPageMetadata(CONTRIBUTE_SEO);

export default function ContributePage() {
  const t = dict();

  return (
    <Box>
      <JsonLd data={buildPageJsonLd(CONTRIBUTE_SEO)} />
      <PageHero title={t.contribute.title} subtitle={t.contribute.subtitle} />
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Stack spacing={3}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t.contribute.tipTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t.contribute.tipBody}
            </Typography>
            <Stack component="form" spacing={2} noValidate>
              <TextField label={t.contribute.nameLabel} name="name" fullWidth disabled />
              <TextField label={t.contribute.emailLabel} name="email" type="email" fullWidth disabled />
              <TextField label={t.contribute.messageLabel} name="message" fullWidth multiline minRows={4} disabled />
              <Button type="button" variant="contained" disabled>
                {t.contribute.sendTip}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={1.5}>
              <Typography variant="h6">{t.contribute.githubTitle}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t.contribute.githubBody}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<GitHubIcon />}
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.contribute.githubButton}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Alert severity="info">
          {t.contribute.modNote}
        </Alert>
      </Stack>
      </Container>
    </Box>
  );
}
