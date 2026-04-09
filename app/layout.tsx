import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Box, Container, Stack } from "@mui/material";
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
import { GoogleAnalyticsPageView, GoogleAnalyticsScripts } from "@/components/analytics/GoogleAnalytics";
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

// #region agent log
fetch("http://127.0.0.1:7761/ingest/4c13ac3f-bbb9-48c9-a6ca-6d1ae895ca0a", {
  method: "POST",
  headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "438e36" },
  body: JSON.stringify({
    sessionId: "438e36",
    runId: "baseline",
    hypothesisId: "H1-H2",
    location: "app/layout.tsx:31",
    message: "layout module evaluated",
    data: { hasDocument: typeof document !== "undefined" },
    timestamp: Date.now(),
  }),
}).catch(() => {});
// #endregion

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
  // #region agent log
  fetch("http://127.0.0.1:7761/ingest/4c13ac3f-bbb9-48c9-a6ca-6d1ae895ca0a", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "438e36" },
    body: JSON.stringify({
      sessionId: "438e36",
      runId: "baseline",
      hypothesisId: "H1-H3-H4",
      location: "app/layout.tsx:61",
      message: "RootLayout render start",
      data: { locale: "en", hasChildren: Boolean(children) },
      timestamp: 0,
    }),
  }).catch(() => {});
  // #endregion

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <template id="mui-color-scheme-init" dangerouslySetInnerHTML={{ __html: MUI_COLOR_SCHEME_INIT_SCRIPT_INNER }} />
        <template id="content-font-scale-init" dangerouslySetInnerHTML={{ __html: CONTENT_FONT_SCALE_INIT_SCRIPT_INNER }} />
        <GoogleAnalyticsScripts />
        <GoogleAnalyticsPageView />
        <ThemeRegistry>
          <Stack minHeight="100vh">
            <MainNav />
            <JsonLd data={buildSiteJsonLd()} />
            <Box
              component="main"
              flex={1}
              sx={{
                minWidth: 0,
                "--content-font-scale": "var(--eptruth-content-font-scale, 1)",
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
                <NewsletterSignup />
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
