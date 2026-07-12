"use client";

import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import {
  Box,
  CardActionArea,
  Chip,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import type { NewsLink } from "@/content/schema";
import { formatPublishedLine } from "@/lib/date/format-published";

/** 16:9 — non-Reddit link/image posts */
const THUMB_IMAGE = {
  xs: { w: 108, h: 61 },
  sm: { w: 128, h: 72 },
};
/** Taller ~4:3 — Reddit thumbnails (video + image) */
const THUMB_VIDEO = {
  xs: { w: 108, h: 81 },
  sm: { w: 128, h: 96 },
};

/** Editorial list-row news item — border rules instead of identical outlined cards. */
export function NewsCard({
  item,
  openLabel,
  videoLabel,
}: {
  item: NewsLink;
  openLabel: string;
  /** Shown on thumbnail when `mediaHint` is video (e.g. Reddit `v.redd.it`). */
  videoLabel?: string;
}) {
  const showThumb = Boolean(item.thumbnailUrl);
  const isVideoPost = item.mediaHint === "video";
  const isRedditPost = item.provenance === "reddit";
  const showVideoBadge = isVideoPost && Boolean(videoLabel);
  const thumbSize = isRedditPost || isVideoPost ? THUMB_VIDEO : THUMB_IMAGE;
  const showOutletBadge = item.provenance !== "reddit";

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <CardActionArea
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${item.headline} (opens in new tab)`}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          textAlign: "left",
          py: 2,
          px: { xs: 0.5, sm: 1 },
          gap: 2,
          borderRadius: 1,
        }}
      >
        {showThumb && item.thumbnailUrl ? (
          <Box
            sx={{
              position: "relative",
              flexShrink: 0,
              width: thumbSize.xs.w,
              height: thumbSize.xs.h,
              bgcolor: "action.hover",
              borderRadius: 1,
              overflow: "hidden",
              "@media (min-width: 600px)": {
                width: thumbSize.sm.w,
                height: thumbSize.sm.h,
              },
              "& img": {
                objectFit: "cover",
                objectPosition: "center",
              },
            }}
          >
            <Image
              src={item.thumbnailUrl}
              alt=""
              fill
              sizes="(max-width: 600px) 108px, 128px"
              style={{ objectFit: "cover", objectPosition: "center" }}
              unoptimized={item.thumbnailUrl.startsWith("http")}
            />
            {showVideoBadge ? (
              <Chip
                label={videoLabel}
                size="small"
                sx={{
                  position: "absolute",
                  bottom: 4,
                  left: 4,
                  height: 22,
                  fontSize: "0.65rem",
                  bgcolor: "rgba(0,0,0,0.7)",
                  color: "common.white",
                  "& .MuiChip-label": { px: 0.75, py: 0 },
                }}
              />
            ) : null}
          </Box>
        ) : null}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack spacing={0.75}>
            <Typography
              variant="subtitle1"
              component="h2"
              fontWeight={600}
              sx={{
                lineHeight: 1.35,
                fontSize: { xs: "1rem", sm: "1.0625rem" },
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {item.headline}
            </Typography>

            <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1} alignItems="center">
              {showOutletBadge ? (
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {item.outlet}
                </Typography>
              ) : null}
              {showOutletBadge && item.publishedAt ? (
                <Typography variant="caption" color="text.secondary" aria-hidden>
                  ·
                </Typography>
              ) : null}
              {item.publishedAt ? (
                <Typography variant="caption" color="text.secondary">
                  {formatPublishedLine(item.publishedAt)}
                </Typography>
              ) : null}
            </Stack>

            {item.summary ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: { xs: "none", sm: "-webkit-box" },
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: 1.45,
                }}
              >
                {item.summary}
              </Typography>
            ) : null}
          </Stack>
        </Box>

        <Link
          component="span"
          variant="body2"
          underline="hover"
          sx={{
            display: { xs: "none", sm: "inline-flex" },
            alignItems: "center",
            gap: 0.35,
            flexShrink: 0,
            fontSize: "0.8125rem",
            color: "primary.main",
            fontWeight: 600,
          }}
        >
          {openLabel}
          <OpenInNewRoundedIcon sx={{ fontSize: 16 }} aria-hidden />
        </Link>
      </CardActionArea>
    </Box>
  );
}
