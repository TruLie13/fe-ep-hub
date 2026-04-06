import { Link, Stack, Typography } from "@mui/material";
import type { Source } from "@/content/schema";
import ExternalLinkIcon from "./ExternalLinkIcon";

export type CitationLinksProps = {
  title?: string;
  sources: Source[];
};

export default function CitationLinks({ title = "Sources", sources }: CitationLinksProps) {
  if (sources.length === 0) return null;

  return (
    <Stack spacing={0.75} component="aside" aria-label={title}>
      <Typography variant="caption" color="text.secondary" fontWeight={600}>
        {title}
      </Typography>
      {sources.map((source) => (
        <Stack key={source.id} spacing={0.25}>
          <Link
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            aria-label={`${source.citationLabel ?? source.title} (opens in new tab)`}
            sx={{ display: "inline-flex", alignItems: "center", width: "fit-content", gap: 0.25 }}
          >
            <span>{source.citationLabel ?? source.title}</span>
            <ExternalLinkIcon />
          </Link>
          {source.relevanceNote ? (
            <Typography variant="caption" color="text.secondary">
              {source.relevanceNote}
            </Typography>
          ) : null}
        </Stack>
      ))}
    </Stack>
  );
}
