import { Button, Stack, TextField, Typography } from "@mui/material";
import { dict } from "@/lib/i18n/dictionary";

/**
 * Static-phase newsletter CTA. Wire `href` to Mailchimp/Buttondown/etc. when ready.
 */
export default function NewsletterSignup() {
  const t = dict();

  return (
    <Stack spacing={1.5} component="section" aria-labelledby="newsletter-heading">
      <Typography id="newsletter-heading" variant="subtitle1" fontWeight={700}>
        {t.newsletter.heading}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t.newsletter.description}
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }}>
        <TextField
          fullWidth
          size="small"
          label={t.newsletter.emailLabel}
          type="email"
          name="newsletter-email"
          disabled
          placeholder={t.newsletter.placeholder}
          inputProps={{ "aria-describedby": "newsletter-help" }}
        />
        <Button variant="contained" disabled sx={{ flexShrink: 0 }}>
          {t.newsletter.joinList}
        </Button>
      </Stack>
      <Typography id="newsletter-help" variant="caption" color="text.secondary">
        {t.newsletter.help}
      </Typography>
    </Stack>
  );
}
