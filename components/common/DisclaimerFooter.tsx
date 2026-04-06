import { Box, Container, Typography } from "@mui/material";
import { dict } from "@/lib/i18n/dictionary";

export default function DisclaimerFooter() {
  const t = dict();

  return (
    <Box
      component="aside"
      aria-label="Disclaimer"
      className="print-hide"
      sx={{
        borderTop: 1,
        borderColor: "divider",
        bgcolor: "action.hover",
        py: 2,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="caption"
          color="text.secondary"
          component="p"
          sx={{
            m: 0,
            maxWidth: "md",
            mx: "auto",
            // textAlign: { xs: "left", sm: "center" },
            lineHeight: 1.6,
          }}
        >
          {t.footer.disclaimer}
          <br />
          {t.footer.disclaimer2}
        </Typography>
      </Container>
    </Box>
  );
}
