import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Box, Container, Link as MuiLink, Stack, Typography } from "@mui/material";
import { CONTENT_FONT_SCALE_INIT_SCRIPT_INNER } from "@/lib/theme/contentFontScaleInitScriptInner";
import { MUI_COLOR_SCHEME_INIT_SCRIPT_INNER } from "@/lib/theme/muiColorSchemeInitScriptInner";
import MainNav from "@/components/common/MainNav";
import BackToTopFab from "@/components/common/BackToTopFab";
import NewsletterSignup from "@/components/common/NewsletterSignup";
import DisclaimerFooter from "@/components/common/DisclaimerFooter";
import OwnerFooter from "@/components/common/OwnerFooter";
import ThemeRegistry from "@/components/theme/ThemeRegistry";
import { dict } from "@/lib/i18n/dictionary";
import JsonLd from "@/components/seo/JsonLd";
import { buildRootMetadata, buildSiteJsonLd } from "@/lib/seo/site";
import "./globals.css";
import "@/styles/print.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = buildRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = dict();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Apply dark on <html> before paint (must match ThemeRegistry defaultMode + storageManager). */}
        <Script
          id="mui-color-scheme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: MUI_COLOR_SCHEME_INIT_SCRIPT_INNER }}
        />
        <Script
          id="content-font-scale-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: CONTENT_FONT_SCALE_INIT_SCRIPT_INNER }}
        />
        <ThemeRegistry>
          <Stack minHeight="100vh">
            <MainNav />
            <JsonLd data={buildSiteJsonLd()} />
            <Box
              component="main"
              flex={1}
              sx={{
                minWidth: 0,
                "--content-font-scale": "var(--eptruth-content-font-scale, 0.9375)",
                fontSize: "calc(1rem * var(--content-font-scale))",
              }}
            >
              {children}
            </Box>
            <Box
              component="footer"
              borderTop={1}
              borderColor="divider"
              py={{ xs: 4, md: 5 }}
              px={0}
              className="print-hide"
            >
              <Container maxWidth="lg">
                <Stack spacing={3}>
                  <NewsletterSignup />
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      {t.footer.mission}
                    </Typography>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} flexWrap="wrap" useFlexGap>
                      <MuiLink href="/pledge" underline="hover" color="primary.main">
                        {t.footer.joinPledge}
                      </MuiLink>
                      <MuiLink href="/contribute" underline="hover" color="primary.main">
                        {t.footer.contributeTip}
                      </MuiLink>
                      <MuiLink href="/learn" underline="hover" color="primary.main">
                        {t.footer.learnBasics}
                      </MuiLink>
                      <MuiLink href="/data-center" underline="hover" color="primary.main">
                        {t.footer.dataCentersImpacts}
                      </MuiLink>
                    </Stack>
                  </Stack>
                </Stack>
              </Container>
            </Box>
            <DisclaimerFooter />
            <OwnerFooter />
            <BackToTopFab ariaLabel={t.common.backToTop} />
          </Stack>
        </ThemeRegistry>
      </body>
    </html>
  );
}
