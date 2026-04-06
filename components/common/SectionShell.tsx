import { Box, Container, Stack, Typography } from "@mui/material";

export type SectionShellProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  /** Tighter vertical rhythm */
  dense?: boolean;
  /** Full-bleed flat band; wraps children in a centered Container */
  band?: boolean;
};

/**
 * Consistent section header + body spacing for civic pages.
 */
export default function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
  dense,
  band,
}: SectionShellProps) {
  const inner = (
    <Stack
      id={id}
      component="section"
      spacing={2.5}
      sx={{ py: dense ? { xs: 4, md: 5 } : { xs: 5, md: 8 } }}
    >
      <Box>
        {eyebrow ? (
          <Typography
            variant="overline"
            sx={{
              fontWeight: 700,
              letterSpacing: "0.16em",
              color: "text.secondary",
              display: "block",
            }}
          >
            {eyebrow}
          </Typography>
        ) : null}
        <Typography
          component="h2"
          variant="h2"
          sx={{
            mt: eyebrow ? 1 : 0,
            maxWidth: "22ch",
          }}
        >
          {title}
        </Typography>
        {description ? (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: "min(72ch, 100%)" }}>
            {description}
          </Typography>
        ) : null}
      </Box>
      {children}
    </Stack>
  );

  if (band) {
    return (
      <Box
        sx={{
          bgcolor: "background.paper",
          borderBlock: 1,
          borderColor: "divider",
          width: "100%",
        }}
      >
        <Container maxWidth="lg">{inner}</Container>
      </Box>
    );
  }

  return inner;
}
