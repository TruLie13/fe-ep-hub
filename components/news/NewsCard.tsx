"use client";

import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
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

  if (showThumb && item.thumbnailUrl) {
    return (
      <Card variant="outlined" sx={{ overflow: "hidden" }}>
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
            /* 16dp keyline on all sides; gap is only between thumb and text (no CardContent padding stacking). */
            p: 2,
            gap: 2,
          }}
        >
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
              /* Next/Image inner img: enforce crop (avoid stretch while loading / after optimizer). */
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

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack spacing={0.75}>
              <Typography
                variant="subtitle1"
                component="h2"
                fontWeight={600}
                sx={{
                  lineHeight: 1.35,
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {item.headline}
              </Typography>

              {item.publishedAt ? (
                <Typography variant="caption" color="text.secondary" component="p" sx={{ m: 0 }}>
                  {formatPublishedLine(item.publishedAt)}
                </Typography>
              ) : null}

              {item.summary ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    lineHeight: 1.45,
                    fontSize: "0.8125rem",
                  }}
                >
                  {item.summary}
                </Typography>
              ) : null}

              <Stack
                direction="row"
                justifyContent={showOutletBadge ? "space-between" : "flex-end"}
                alignItems="center"
                gap={1}
                sx={{ pt: 0.25 }}
              >
                {showOutletBadge ? (
                  <Chip size="small" label={item.outlet} variant="outlined" sx={{ flexShrink: 1, minWidth: 0 }} />
                ) : null}
                <Link
                  component="span"
                  variant="body2"
                  underline="hover"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.35,
                    flexShrink: 0,
                    fontSize: "0.8125rem",
                  }}
                >
                  {openLabel}
                  <OpenInNewRoundedIcon sx={{ fontSize: 16 }} aria-hidden />
                </Link>
              </Stack>
            </Stack>
          </Box>
        </CardActionArea>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ overflow: "hidden" }}>
      <CardActionArea
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${item.headline} (opens in new tab)`}
        sx={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}
      >
        <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
          <Stack spacing={1}>
            <Typography variant="subtitle1" component="h2" fontWeight={600} sx={{ lineHeight: 1.35 }}>
              {item.headline}
            </Typography>

            {item.publishedAt ? (
              <Typography variant="caption" color="text.secondary">
                {formatPublishedLine(item.publishedAt)}
              </Typography>
            ) : null}

            {item.summary ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {item.summary}
              </Typography>
            ) : null}

            <Stack
              direction="row"
              justifyContent={showOutletBadge ? "space-between" : "flex-end"}
              alignItems="center"
              sx={{ pt: 0.5 }}
            >
              {showOutletBadge ? <Chip size="small" label={item.outlet} variant="outlined" /> : null}
              <Link
                component="span"
                underline="hover"
                sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
              >
                {openLabel}
                <OpenInNewRoundedIcon sx={{ fontSize: 18 }} aria-hidden />
              </Link>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
