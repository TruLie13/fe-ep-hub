import { Box, Link, Typography } from "@mui/material";
import { dict } from "@/lib/i18n/dictionary";

const BRAND_HOVER = "#357370";

export default function OwnerFooter() {
  const t = dict();
  const currentYear = new Date().getFullYear();
  // #region agent log
  fetch("http://127.0.0.1:7761/ingest/4c13ac3f-bbb9-48c9-a6ca-6d1ae895ca0a", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "e909d1" },
    body: JSON.stringify({
      sessionId: "e909d1",
      runId: "pre-fix",
      hypothesisId: "H4",
      location: "components/common/OwnerFooter.tsx:10",
      message: "OwnerFooter server render year",
      data: {
        currentYear,
        isoNow: new Date().toISOString(),
      },
      timestamp: 0,
    }),
  }).catch(() => {});
  // #endregion

  return (
    <Box
      component="div"
      role="contentinfo"
      aria-label="Site owner"
      className="print-hide"
      sx={{
        bgcolor: "#000",
        color: "rgba(255, 255, 255, 0.85)",
        p: 3, 
        textAlign: "center",
      }}
    >
      <Link
        href="https://pi-que.com/"
        target="_blank"
        rel="noopener noreferrer"
        underline="none"
        aria-label="pi.que (opens in new tab)"
        sx={{
          color: "inherit",
          display: "block",
          textAlign: "center",
          "&:hover .owner-brand": {
            color: BRAND_HOVER,
          },
        }}
      >
        <Typography
          variant="caption"
          component="span"
          display="block"
          sx={{
            m: 0,
            letterSpacing: 0.02,
            fontSize: "0.875rem",
          }}
        >
          {t.footer.ownerBefore}
          <Box component="span" className="owner-brand" sx={{ transition: "color 0.15s ease" }}>
            {t.footer.ownerBrand}
          </Box>
          {t.footer.ownerCopyrightRange}
          {currentYear}
          {t.footer.ownerCopyrightEnd}
        </Typography>
      </Link>
    </Box>
  );
}
