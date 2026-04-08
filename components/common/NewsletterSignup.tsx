"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import MarkEmailReadOutlined from "@mui/icons-material/MarkEmailReadOutlined";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { FormEvent, RefObject } from "react";
import { useCallback, useMemo, useRef, useState, useSyncExternalStore } from "react";
import enDict from "@/dictionaries/en.json";
import {
  formatUsPhone,
  isValidSignupEmail,
  isValidSignupName,
  sanitizePhoneDigits,
} from "@/lib/newsletter/signupValidation";

export type NewsletterSignupProps = {
  /**
   * When false, renders without a Card wrapper (use inside another section, e.g. pledge).
   * @default true
   */
  withCard?: boolean;
};

const t = enDict;

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";
const newsletterConfigured =
  process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED === "true" ||
  Boolean(process.env.NEXT_PUBLIC_NEWSLETTER_SCRIPT_URL?.trim());
const needTurnstile = Boolean(turnstileSiteKey);

/** Turnstile SSR/client markup differs; mounting after hydration avoids useId / label mismatches. */
function ClientOnlyTurnstile({
  siteKey,
  turnstileRef,
  onSuccess,
  onExpire,
  onError,
}: {
  siteKey: string;
  turnstileRef: RefObject<TurnstileInstance | null>;
  onSuccess: (token: string) => void;
  onExpire: () => void;
  onError: () => void;
}) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  if (!mounted) {
    return <Box sx={{ minHeight: 70 }} aria-hidden />;
  }
  return (
    <Turnstile
      ref={turnstileRef}
      siteKey={siteKey}
      onSuccess={onSuccess}
      onExpire={onExpire}
      onError={onError}
      options={{ theme: "auto" }}
    />
  );
}

/** Match home “Take action” card: dark gradient over a cover photo so type stays readable. */
const newsletterCardBackdropSx = {
  position: "relative" as const,
  overflow: "hidden" as const,
  backgroundImage: {
    xs: "linear-gradient(90deg, rgba(3,8,18,0.995) 0%, rgba(3,8,18,0.98) 37%, rgba(3,8,18,0.955) 67%, rgba(3,8,18,0.92) 100%), url('/images/elpaso_downtown.webp')",
    md: "linear-gradient(90deg, rgba(3,8,18,0.988) 0%, rgba(3,8,18,0.973) 37%, rgba(3,8,18,0.94) 71%, rgba(3,8,18,0.89) 100%), url('/images/elpaso_downtown.webp')",
  },
  backgroundSize: "cover",
  backgroundPosition: "left center",
  backgroundRepeat: "no-repeat",
  minHeight: { xs: 300, sm: 320 },
};

/**
 * Newsletter signup: POST `/api/newsletter` (honeypot, optional Turnstile, then Apps Script).
 */
export default function NewsletterSignup({ withCard = true }: NewsletterSignupProps) {
  /** Stable ids (no useId): must match server and client. Footer vs embed avoids duplicates on pledge + layout. */
  const fieldIds = useMemo(() => {
    const p = withCard ? "footer" : "embed";
    return {
      firstName: `eptruth-nl-${p}-first`,
      lastName: `eptruth-nl-${p}-last`,
      email: `eptruth-nl-${p}-email`,
      phone: `eptruth-nl-${p}-phone`,
    } as const;
  }, [withCard]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSucceeded, setSubmitSucceeded] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const firstNameOk = isValidSignupName(firstName);
  const lastNameOk = isValidSignupName(lastName);
  const emailOk = isValidSignupEmail(email);
  const phoneOk = phoneDigits.length === 0 || phoneDigits.length === 10;
  const turnstileOk = !needTurnstile || Boolean(turnstileToken);

  const isFormValid = firstNameOk && lastNameOk && emailOk && phoneOk && turnstileOk;

  const onTurnstileSuccess = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);
  const onTurnstileExpire = useCallback(() => {
    setTurnstileToken(null);
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!newsletterConfigured || !isFormValid) return;

      const form = e.currentTarget;
      const hp = (form.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";

      setSubmitting(true);
      try {
        const res = await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            email: email.trim(),
            phone: phoneDigits.length === 10 ? phoneDigits : "",
            turnstileToken: needTurnstile ? turnstileToken : undefined,
            website: hp,
          }),
        });

        const data = (await res.json().catch(() => ({}))) as { error?: string };

        if (!res.ok) {
          const msg =
            data.error === "captcha"
              ? t.newsletter.captchaError
              : data.error === "captcha_misconfigured"
                ? t.newsletter.captchaConfigError
                : data.error === "not_configured"
                  ? t.newsletter.configHelp
                  : data.error === "duplicate"
                    ? t.newsletter.duplicateEmail
                    : t.newsletter.submitError;
          setToast({ open: true, message: msg, severity: "error" });
          return;
        }

        setFirstName("");
        setLastName("");
        setEmail("");
        setPhoneDigits("");
        setTurnstileToken(null);
        turnstileRef.current?.reset();
        setSubmitSucceeded(true);
        setToast({ open: true, message: t.newsletter.submitSuccess, severity: "success" });
      } catch {
        setToast({ open: true, message: t.newsletter.submitError, severity: "error" });
      } finally {
        setSubmitting(false);
      }
    },
    [email, firstName, isFormValid, lastName, phoneDigits, turnstileToken],
  );

  const formDisabled = !newsletterConfigured || submitting || submitSucceeded;

  /** Shrunk labels sit in the outline notch; paper tint matches the surface behind the field (card vs page). */
  const outlinedLabelSlotProps = useMemo(
    () =>
      ({
        shrink: true,
        sx: {
          bgcolor: withCard ? "background.paper" : "background.default",
          px: 0.75,
          mx: -0.5,
          borderRadius: 0.75,
        },
      }) as const,
    [withCard],
  );

  const inner = (
    <Stack spacing={2.5} component={withCard ? "div" : "section"} aria-labelledby="newsletter-heading">
      <Box>
        <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap" useFlexGap>
          {submitSucceeded ? (
            <CheckCircleRoundedIcon color="success" sx={{ fontSize: 32 }} aria-hidden />
          ) : (
            <MarkEmailReadOutlined color="primary" sx={{ fontSize: 28 }} aria-hidden />
          )}
          <Typography id="newsletter-heading" component="h2" variant="h6">
            {submitSucceeded ? t.newsletter.welcomeTitle : t.newsletter.heading}
          </Typography>
        </Stack>
        {!submitSucceeded ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, maxWidth: "min(65ch, 100%)" }}>
            {t.newsletter.description}
          </Typography>
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, maxWidth: "min(65ch, 100%)", lineHeight: 1.65 }}>
            {t.newsletter.welcomeBody}
          </Typography>
        )}
      </Box>

      {!newsletterConfigured ? (
        <Alert severity="warning" variant="outlined" sx={{ maxWidth: "min(65ch, 100%)" }}>
          {t.newsletter.configHelp}
        </Alert>
      ) : null}

      {newsletterConfigured && !submitSucceeded ? (
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        aria-describedby="newsletter-consent"
        sx={{ position: "relative", maxWidth: { xs: "100%", sm: 480 } }}
      >
        <input
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          defaultValue=""
          style={{
            position: "absolute",
            left: "-9999px",
            width: 1,
            height: 1,
            opacity: 0,
            pointerEvents: "none",
          }}
        />
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              id={fieldIds.firstName}
              variant="outlined"
              label={t.newsletter.firstNameLabel}
              placeholder={t.newsletter.firstNamePlaceholder}
              autoComplete="given-name"
              disabled={formDisabled}
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value.replace(/[^a-zA-Z]/g, ""))}
              error={firstName.length > 0 && !firstNameOk}
              helperText={firstName.length > 0 && !firstNameOk ? t.newsletter.firstNameError : undefined}
              slotProps={{ inputLabel: outlinedLabelSlotProps }}
              sx={{ flex: 1, minWidth: 0 }}
            />
            <TextField
              id={fieldIds.lastName}
              variant="outlined"
              label={t.newsletter.lastNameLabel}
              placeholder={t.newsletter.lastNamePlaceholder}
              autoComplete="family-name"
              disabled={formDisabled}
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value.replace(/[^a-zA-Z]/g, ""))}
              error={lastName.length > 0 && !lastNameOk}
              helperText={lastName.length > 0 && !lastNameOk ? t.newsletter.lastNameError : undefined}
              slotProps={{ inputLabel: outlinedLabelSlotProps }}
              sx={{ flex: 1, minWidth: 0 }}
            />
          </Stack>
          <TextField
            id={fieldIds.email}
            variant="outlined"
            type="email"
            label={t.newsletter.emailLabel}
            placeholder={t.newsletter.emailPlaceholder}
            autoComplete="email"
            disabled={formDisabled}
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={email.length > 0 && !emailOk}
            helperText={email.length > 0 && !emailOk ? t.newsletter.emailError : undefined}
            slotProps={{ inputLabel: outlinedLabelSlotProps }}
          />
          <TextField
            id={fieldIds.phone}
            variant="outlined"
            type="tel"
            label={t.newsletter.phoneLabel}
            placeholder={t.newsletter.phonePlaceholder}
            autoComplete="tel-national"
            disabled={formDisabled}
            fullWidth
            inputMode="tel"
            value={formatUsPhone(phoneDigits)}
            onChange={(e) => setPhoneDigits(sanitizePhoneDigits(e.target.value))}
            error={phoneDigits.length > 0 && !phoneOk}
            helperText={phoneDigits.length > 0 && !phoneOk ? t.newsletter.phoneError : undefined}
            slotProps={{ inputLabel: outlinedLabelSlotProps }}
          />
          {needTurnstile ? (
            <ClientOnlyTurnstile
              siteKey={turnstileSiteKey}
              turnstileRef={turnstileRef}
              onSuccess={onTurnstileSuccess}
              onExpire={onTurnstileExpire}
              onError={() => setTurnstileToken(null)}
            />
          ) : null}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={formDisabled || !isFormValid}
            sx={{ alignSelf: { xs: "stretch", sm: "flex-start" }, minWidth: { sm: 160 } }}
          >
            {submitting ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress color="inherit" size={18} />
                <span>{t.newsletter.submitting}</span>
              </Stack>
            ) : (
              t.newsletter.joinList
            )}
          </Button>
          <Typography
            id="newsletter-consent"
            variant="caption"
            color="text.secondary"
            sx={{ lineHeight: 1.5, maxWidth: "min(62ch, 100%)" }}
          >
            {t.newsletter.consentFinePrint}
          </Typography>
        </Stack>
      </Box>
      ) : null}

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((s) => ({ ...s, open: false }))}
          severity={toast.severity}
          variant="filled"
          elevation={6}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Stack>
  );

  if (!withCard) {
    return inner;
  }

  return (
    <Card
      variant="outlined"
      component="section"
      aria-labelledby="newsletter-heading"
      sx={newsletterCardBackdropSx}
    >
      <CardContent sx={{ position: "relative", zIndex: 1, p: { xs: 2.5, sm: 3 } }}>{inner}</CardContent>
    </Card>
  );
}
