"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Box, ButtonBase, Link, Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { MapCanvasLayer, MapCanvasSource } from "@/components/map/MapCanvas";
import {
  CITY_DISTRICT_BOUNDS,
  CITY_DISTRICT_CENTER,
  CITY_DISTRICT_COLORS,
  CITY_DISTRICT_GEOJSON_HREF,
  CITY_DISTRICT_NUMBERS,
  CITY_DISTRICT_SOURCE_URL,
  CITY_MEXICO_MASK_GEOJSON_HREF,
  cityDistrictSectionId,
  districtFillColorExpression,
  districtFillOpacityExpression,
  isInteractiveCityDistrict,
  parseCityDistrictNumber,
  type CityDistrictNumber,
} from "@/lib/map/city-districts";

const MapCanvas = dynamic(() => import("@/components/map/MapCanvas"), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "background.default",
      }}
    />
  ),
});

export type CityDistrictsMapLabels = {
  ariaLabel: string;
  legendAria: string;
  districtLabel: string;
  districtJumpAria: string;
  sourceBefore: string;
  sourceLink: string;
  sourceAria: string;
  sourceAfter: string;
  notOnBallot?: string;
  notOnBallotAria?: string;
};

type CityDistrictsMapProps = {
  labels: CityDistrictsMapLabels;
  /** When set, only these districts jump on click. Others stay visible and quieter. */
  interactiveDistricts?: readonly CityDistrictNumber[];
  onDistrictSelect?: (district: CityDistrictNumber) => void;
};

function formatDistrict(template: string, district: number): string {
  return template.replace("{district}", String(district));
}

function scrollToDistrictSection(district: number): void {
  const el = document.getElementById(cityDistrictSectionId(district));
  if (!(el instanceof HTMLElement)) {
    return;
  }
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  if (!el.hasAttribute("tabindex")) {
    el.setAttribute("tabindex", "-1");
  }
  el.focus({ preventScroll: true });
}

function districtBadgeRadiusExpression(
  stops: readonly (readonly [zoom: number, idle: number])[],
  hoverDelta = 2.5,
): unknown[] {
  const expr: unknown[] = ["interpolate", ["linear"], ["zoom"]];
  for (const [zoom, idle] of stops) {
    expr.push(zoom, [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      idle + hoverDelta,
      idle,
    ]);
  }
  return expr;
}

const MOBILE_BADGE_RADIUS_STOPS: readonly (readonly [number, number])[] = [
  [8, 7],
  [10, 9.5],
  [12, 14],
  [14, 16],
];

const DESKTOP_BADGE_RADIUS_STOPS: readonly (readonly [number, number])[] = [
  [8, 7],
  [10, 11],
  [12, 16],
  [14, 18],
];

const MOBILE_BADGE_HALO_RADIUS_STOPS: readonly (readonly [number, number])[] = [
  [8, 9],
  [10, 11.5],
  [12, 16.5],
  [14, 18.5],
];

const DESKTOP_BADGE_HALO_RADIUS_STOPS: readonly (readonly [number, number])[] = [
  [8, 9],
  [10, 13],
  [12, 18.5],
  [14, 20.5],
];

const MOBILE_BADGE_STROKE_WIDTH = ["interpolate", ["linear"], ["zoom"], 8, 3, 10, 3.5, 12, 4] as const;
const DESKTOP_BADGE_STROKE_WIDTH = ["interpolate", ["linear"], ["zoom"], 8, 3.5, 10, 4, 12, 4.5] as const;

const MOBILE_LABEL_SIZE = ["interpolate", ["linear"], ["zoom"], 8, 10, 10, 11, 12, 14, 14, 15] as const;
const DESKTOP_LABEL_SIZE = ["interpolate", ["linear"], ["zoom"], 8, 10, 10, 12, 12, 15, 14, 16] as const;

export default function CityDistrictsMap({
  labels,
  interactiveDistricts,
  onDistrictSelect,
}: CityDistrictsMapProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [hoveredDistrict, setHoveredDistrict] = useState<CityDistrictNumber | null>(null);
  const [noticeDistrict, setNoticeDistrict] = useState<CityDistrictNumber | null>(null);

  useEffect(() => {
    if (!noticeDistrict) {
      return;
    }
    const timer = window.setTimeout(() => setNoticeDistrict(null), 4000);
    return () => window.clearTimeout(timer);
  }, [noticeDistrict]);

  const sources = useMemo<MapCanvasSource[]>(
    () => [
      {
        id: "mexico-mask",
        data: CITY_MEXICO_MASK_GEOJSON_HREF,
      },
      {
        id: "city-districts",
        data: CITY_DISTRICT_GEOJSON_HREF,
        promoteId: "DISTRICT",
      },
    ],
    [],
  );

  const layers = useMemo<MapCanvasLayer[]>(() => {
    const badgeRadiusStops = isDesktop ? DESKTOP_BADGE_RADIUS_STOPS : MOBILE_BADGE_RADIUS_STOPS;
    const badgeHaloRadiusStops = isDesktop ? DESKTOP_BADGE_HALO_RADIUS_STOPS : MOBILE_BADGE_HALO_RADIUS_STOPS;
    return [
      {
        id: "mexico-mask",
        source: "mexico-mask",
        type: "fill",
        beforeId: "boundary_state",
        paint: {
          "fill-color": "#0A0D12",
          "fill-opacity": 1,
          "fill-antialias": true,
        },
      },
      {
        id: "city-districts-fill",
        source: "city-districts",
        type: "fill",
        filter: ["==", ["geometry-type"], "Polygon"],
        paint: {
          "fill-color": districtFillColorExpression(interactiveDistricts),
          "fill-opacity": districtFillOpacityExpression(interactiveDistricts),
          "fill-outline-color": "rgba(0,0,0,0)",
        },
      },
      {
        id: "city-districts-line",
        source: "city-districts",
        type: "line",
        filter: ["==", ["geometry-type"], "Polygon"],
        paint: {
          "line-color": districtFillColorExpression(interactiveDistricts),
          "line-width": ["case", ["boolean", ["feature-state", "hover"], false], 3, 1.6],
          "line-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.95, 0.85],
        },
      },
      {
        id: "city-districts-badge-halo",
        source: "city-districts",
        type: "circle",
        filter: ["==", ["get", "role"], "label"],
        paint: {
          "circle-radius": districtBadgeRadiusExpression(badgeHaloRadiusStops),
          "circle-color": "#0A0D12",
          "circle-opacity": 0.88,
          "circle-blur": 0.1,
        },
      },
      {
        id: "city-districts-badge",
        source: "city-districts",
        type: "circle",
        filter: ["==", ["get", "role"], "label"],
        paint: {
          "circle-radius": districtBadgeRadiusExpression(badgeRadiusStops),
          "circle-color": "#101620",
          "circle-opacity": 1,
          "circle-stroke-width": isDesktop ? DESKTOP_BADGE_STROKE_WIDTH : MOBILE_BADGE_STROKE_WIDTH,
          "circle-stroke-color": districtFillColorExpression(),
          "circle-stroke-opacity": 1,
        },
      },
      {
        id: "city-districts-label",
        source: "city-districts",
        type: "symbol",
        filter: ["==", ["get", "role"], "label"],
        layout: {
          "text-field": ["to-string", ["get", "DISTRICT"]],
          "text-font": ["Noto Sans Bold"],
          "text-size": isDesktop ? DESKTOP_LABEL_SIZE : MOBILE_LABEL_SIZE,
          "text-allow-overlap": true,
          "text-ignore-placement": true,
          "text-anchor": "center",
          "text-padding": 0,
        },
        paint: {
          "text-color": "#FFFFFF",
          "text-halo-color": "#101620",
          "text-halo-width": 1.5,
        },
      },
    ] as MapCanvasLayer[];
  }, [interactiveDistricts, isDesktop]);

  function selectDistrict(district: CityDistrictNumber): void {
    if (!isInteractiveCityDistrict(district, interactiveDistricts)) {
      setNoticeDistrict(district);
      return;
    }
    setNoticeDistrict(null);
    if (onDistrictSelect) {
      onDistrictSelect(district);
      return;
    }
    scrollToDistrictSection(district);
  }

  const shownDistrict = hoveredDistrict ?? noticeDistrict;
  const shownIsInteractive = shownDistrict
    ? isInteractiveCityDistrict(shownDistrict, interactiveDistricts)
    : true;

  return (
    <Stack spacing={2}>
      <Box
        className="print-hide"
        sx={{
          position: "relative",
          height: { xs: 360, md: 480 },
          borderRadius: 1,
          overflow: "hidden",
          border: 1,
          borderColor: "divider",
          bgcolor: "background.default",
        }}
      >
        <MapCanvas
          key={isDesktop ? "desktop" : "mobile"}
          ariaLabel={labels.ariaLabel}
          center={CITY_DISTRICT_CENTER}
          zoom={10.2}
          bounds={CITY_DISTRICT_BOUNDS}
          minZoom={isDesktop? 9.5: 8.75}
          mobileZoomDelta={-0.075}
          maxBounds={[
            [CITY_DISTRICT_BOUNDS[0][0] - 0.28, CITY_DISTRICT_BOUNDS[0][1] - 0.2],
            [CITY_DISTRICT_BOUNDS[1][0] + 0.28, CITY_DISTRICT_BOUNDS[1][1] + 0.2],
          ]}
          sources={sources}
          layers={layers}
          interactiveLayerIds={[
            "city-districts-fill",
            "city-districts-badge-halo",
            "city-districts-badge",
          ]}
          onFeatureClick={(properties) => {
            const district = parseCityDistrictNumber(properties.DISTRICT);
            if (district) {
              selectDistrict(district);
            }
          }}
          onFeatureHover={(properties) => {
            setHoveredDistrict(properties ? parseCityDistrictNumber(properties.DISTRICT) : null);
          }}
        />
        {shownDistrict ? (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              px: 1.25,
              py: 0.5,
              borderRadius: 1,
              bgcolor: "rgba(10, 13, 18, 0.88)",
              border: 1,
              borderColor: "divider",
              pointerEvents: "none",
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.primary" }}>
              {formatDistrict(labels.districtLabel, shownDistrict)}
            </Typography>
            {!shownIsInteractive && labels.notOnBallot ? (
              <Typography variant="caption" display="block" color="text.secondary">
                {labels.notOnBallot}
              </Typography>
            ) : null}
          </Box>
        ) : null}
      </Box>

      <Box
        component="ul"
        aria-label={labels.legendAria}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(4, minmax(0, 1fr))" },
          gap: 1,
          m: 0,
          p: 0,
          listStyle: "none",
        }}
      >
        {CITY_DISTRICT_NUMBERS.filter((district) =>
          isInteractiveCityDistrict(district, interactiveDistricts),
        ).map((district) => {
          const active = hoveredDistrict === district;

          return (
            <Box key={district} component="li" sx={{ minWidth: 0 }}>
              <ButtonBase
                onClick={() => selectDistrict(district)}
                aria-label={formatDistrict(labels.districtJumpAria, district)}
                sx={{
                  width: "100%",
                  justifyContent: "flex-start",
                  gap: 1,
                  px: 1.25,
                  py: 1,
                  minHeight: 44,
                  borderRadius: 1,
                  border: 1,
                  borderColor: active ? "primary.main" : "divider",
                  bgcolor: active ? "background.paper" : "transparent",
                  textAlign: "left",
                }}
              >
                <Box
                  aria-hidden
                  sx={{
                    width: 12,
                    height: 12,
                    flexShrink: 0,
                    borderRadius: "2px",
                    bgcolor: CITY_DISTRICT_COLORS[district],
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatDistrict(labels.districtLabel, district)}
                </Typography>
              </ButtonBase>
            </Box>
          );
        })}
      </Box>

      <Typography variant="caption" color="text.secondary" display="block" sx={{ maxWidth: "72ch" }}>
        {labels.sourceBefore}
        <Link
          href={CITY_DISTRICT_SOURCE_URL}
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
          fontWeight={600}
          sx={{ textUnderlineOffset: "0.2em" }}
          aria-label={labels.sourceAria}
        >
          {labels.sourceLink}
        </Link>
        {labels.sourceAfter}
      </Typography>
    </Stack>
  );
}
