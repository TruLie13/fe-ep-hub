import { Box, Link } from "@mui/material";
import type { ReactNode } from "react";
import { Fragment } from "react";
import type { Source } from "@/content/schema";

const CITE_RE = /\[cite:\s*([\d\s,]+)\]/g;

function renderBoldSegments(text: string, keyPrefix: string): ReactNode[] {
  const chunks = text.split(/\*\*/);
  return chunks
    .map((chunk, i) => {
      if (!chunk) return null;
      if (i % 2 === 1) {
        /* Explicit weight: layered MUI Typography + CssVars can otherwise make <strong> match body weight. */
        return (
          <Box
            component="span"
            key={`${keyPrefix}-b${i}`}
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            {chunk}
          </Box>
        );
      }
      return <Fragment key={`${keyPrefix}-t${i}`}>{chunk}</Fragment>;
    })
    .filter((node): node is NonNullable<typeof node> => node != null);
}

function CiteLink({ n, source }: { n: number; source: Source | undefined }) {
  if (!source) {
    return (
      <Box component="sup" sx={{ fontSize: "0.75em" }}>
        [{n}]
      </Box>
    );
  }
  const label = source.citationLabel ?? source.title;
  const isDownload = source.linkBehavior === "download";
  return (
    <Box component="sup" sx={{ whiteSpace: "nowrap", fontSize: "0.75em" }}>
      <Link
        component="a"
        href={source.url}
        {...(isDownload
          ? source.downloadFileName
            ? { download: source.downloadFileName }
            : {}
          : { target: "_blank", rel: "noopener noreferrer" })}
        aria-label={`Source ${n}: ${label}`}
        underline="hover"
        sx={{ fontWeight: 600, ml: 0.125 }}
      >
        [{n}]
      </Link>
    </Box>
  );
}

/**
 * Renders body copy from `data-centers-impacts.json`: `**bold**` segments and `[cite: N]` (or `[cite: 1, 2]`) as
 * superscript links to the ordered `sources` list (1-based indexes).
 */
export default function DataCentersRichText({ text, sources }: { text: string; sources: Source[] }) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let part = 0;
  let m: RegExpExecArray | null;

  const re = new RegExp(CITE_RE.source, CITE_RE.flags);
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) {
      const slice = text.slice(lastIndex, m.index);
      nodes.push(...renderBoldSegments(slice, `p${part++}`));
    }
    const nums = m[1]
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !Number.isNaN(n));
    nums.forEach((n, idx) => {
      nodes.push(<CiteLink key={`c${part}-${idx}-${n}`} n={n} source={sources[n - 1]} />);
    });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) {
    nodes.push(...renderBoldSegments(text.slice(lastIndex), `p${part++}`));
  }

  return <>{nodes}</>;
}
