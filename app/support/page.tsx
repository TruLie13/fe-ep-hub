import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";
import { dict } from "@/lib/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const t = dict().support;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
  };
}

export default function SupportPage() {
  const t = dict().support;

  return (
    <Box>
      <PageHero title={t.title} subtitle={t.subtitle} />
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
        <Stack spacing={3}>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "70ch" }}>
            {t.optionalNote}
          </Typography>

          <Card variant="outlined">
            <CardActionArea
              component="a"
              href={t.tipUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.tipCta}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <FavoriteRoundedIcon color="primary" />
                    <Typography variant="h6">{t.tipTitle}</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {t.tipBody}
                  </Typography>
                  <Typography
                    color="primary"
                    fontWeight={700}
                    sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, textUnderlineOffset: "0.2em" }}
                  >
                    {t.tipCta}
                    <OpenInNewRoundedIcon sx={{ fontSize: "1rem" }} aria-hidden />
                  </Typography>
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card variant="outlined">
            <CardActionArea
              component="a"
              href={`mailto:${t.contactEmail}`}
              aria-label={`${t.sponsorTitle} ${t.contactEmail}`}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <BusinessRoundedIcon color="primary" />
                    <Typography variant="h6">{t.sponsorTitle}</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {t.sponsorBody}
                  </Typography>
                  <Typography variant="body2" color="primary" fontWeight={700}>
                    <strong>{t.contactLabel}</strong> {t.contactEmail}
                  </Typography>
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
