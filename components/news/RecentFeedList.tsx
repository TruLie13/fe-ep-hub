"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { useId, useState } from "react";
import type { NewsLink } from "@/content/schema";
import { NewsCard } from "./NewsCard";

const BATCH = 5;

export function RecentFeedList({
  items,
  openLabel,
  showMoreLabel,
  allLoadedLabel,
  videoLabel,
  listLabel,
}: {
  items: NewsLink[];
  openLabel: string;
  showMoreLabel: string;
  allLoadedLabel: string;
  /** Accessible name for the article list (section heading text). */
  listLabel: string;
  /** Passed to cards when posts may be Reddit video (`mediaHint: video`). */
  videoLabel?: string;
}) {
  const baseId = useId();
  const listId = `${baseId}-articles`;

  const total = items.length;
  const [visible, setVisible] = useState(() => Math.min(BATCH, total));

  const slice = items.slice(0, visible);
  const hasMore = visible < total;
  const allShown = visible >= total && total > 0;

  return (
    <Stack spacing={1.5}>
      <Box
        component="ul"
        id={listId}
        aria-label={listLabel}
        sx={{
          listStyle: "none",
          m: 0,
          p: 0,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {slice.map((item) => (
          <Box component="li" key={item.id} sx={{ display: "block" }}>
            <NewsCard
              item={item}
              openLabel={openLabel}
              videoLabel={videoLabel}
            />
          </Box>
        ))}
      </Box>

      {hasMore ? (
        <Button
          type="button"
          variant="outlined"
          onClick={() => setVisible((v) => Math.min(v + BATCH, total))}
          sx={{ alignSelf: "flex-start" }}
          aria-controls={listId}
          aria-label={`${showMoreLabel}: ${listLabel}`}
        >
          {showMoreLabel}
        </Button>
      ) : null}

      {allShown ? (
        <Typography variant="body2" color="text.secondary" sx={{ pt: 0.5 }}>
          {allLoadedLabel.replace("{count}", String(total))}
        </Typography>
      ) : null}
    </Stack>
  );
}
