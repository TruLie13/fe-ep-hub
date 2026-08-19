"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Box, ButtonBase, Link, Stack, Typography } from "@mui/material";
import type { MapCanvasLayer, MapCanvasSource } from "@/components/map/MapCanvas";
import {
  CITY_DISTRICT_BOUNDS,
  CITY_DISTRICT_CENTER,
  CITY_DISTRICT_COLORS,
  CITY_DISTRICT_GEOJSON_HREF,
  CITY_DISTRICT_NUMBERS,
  CITY_DISTRICT_SOURCE_URL,
  CITY_OUTSIDE_MASK_GEOJSON_HREF,
  cityDistrictSectionId,
  districtFillColorExpression,
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
};

type CityDistrictsMapProps = {
  labels: CityDistrictsMapLabels;
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

export default function CityDistrictsMap({ labels }: CityDistrictsMapProps) {
  const [hoveredDistrict, setHoveredDistrict] = useState<CityDistrictNumber | null>(null);

  const sources = useMemo<MapCanvasSource[]>(
    () => [
      {
        id: "city-outside-mask",
        data: CITY_OUTSIDE_MASK_GEOJSON_HREF,
      },
      {
        id: "city-districts",
        data: CITY_DISTRICT_GEOJSON_HREF,
        promoteId: "DISTRICT",
      },
    ],
    [],
  );

  const layers = useMemo<MapCanvasLayer[]>(
    () => [
      {
        id: "city-outside-mask",
        source: "city-outside-mask",
        type: "fill",
        beforeId: "highway_major_casing",
        paint: {
          "fill-color": "#0A0D12",
          "fill-opacity": 0.5,
          "fill-antialias": true,
        },
      },
      {
        id: "city-districts-fill",
        source: "city-districts",
        type: "fill",
        filter: ["==", ["geometry-type"], "Polygon"],
        paint: {
          "fill-color": districtFillColorExpression(),
          "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.55, 0.34],
          "fill-outline-color": "rgba(0,0,0,0)",
        },
      },
      {
        id: "city-districts-line",
        source: "city-districts",
        type: "line",
        filter: ["==", ["geometry-type"], "Polygon"],
        paint: {
          "line-color": districtFillColorExpression(),
          "line-width": ["case", ["boolean", ["feature-state", "hover"], false], 3, 1.6],
          "line-opacity": 0.95,
        },
      },
      {
        id: "city-districts-badge",
        source: "city-districts",
        type: "circle",
        filter: ["==", ["get", "role"], "label"],
        paint: {
          "circle-radius": ["case", ["boolean", ["feature-state", "hover"], false], 16, 13],
          "circle-color": "#141A22",
          "circle-opacity": 0.94,
          "circle-stroke-width": 2,
          "circle-stroke-color": districtFillColorExpression(),
        },
      },
      {
        id: "city-districts-label",
        source: "city-districts",
        type: "symbol",
        filter: ["==", ["get", "role"], "label"],
        layout: {
          "text-field": ["to-string", ["get", "DISTRICT"]],
          "text-font": ["Noto Sans Regular"],
          "text-size": 13,
          "text-allow-overlap": true,
          "text-ignore-placement": true,
          "text-anchor": "center",
        },
        paint: {
          "text-color": "#F4F7FA",
        },
      },
    ],
    [],
  );

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
          ariaLabel={labels.ariaLabel}
          center={CITY_DISTRICT_CENTER}
          zoom={10.2}
          bounds={CITY_DISTRICT_BOUNDS}
          maxBounds={[
            [CITY_DISTRICT_BOUNDS[0][0] - 0.18, CITY_DISTRICT_BOUNDS[0][1] - 0.12],
            [CITY_DISTRICT_BOUNDS[1][0] + 0.18, CITY_DISTRICT_BOUNDS[1][1] + 0.12],
          ]}
          sources={sources}
          layers={layers}
          interactiveLayerIds={["city-districts-fill", "city-districts-badge"]}
          onFeatureClick={(properties) => {
            const district = parseCityDistrictNumber(properties.DISTRICT);
            if (district) {
              scrollToDistrictSection(district);
            }
          }}
          onFeatureHover={(properties) => {
            setHoveredDistrict(properties ? parseCityDistrictNumber(properties.DISTRICT) : null);
          }}
        />
        {hoveredDistrict ? (
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
              {formatDistrict(labels.districtLabel, hoveredDistrict)}
            </Typography>
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
        {CITY_DISTRICT_NUMBERS.map((district) => {
          const active = hoveredDistrict === district;
          return (
            <Box key={district} component="li" sx={{ minWidth: 0 }}>
              <ButtonBase
                onClick={() => scrollToDistrictSection(district)}
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

      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: "72ch" }}>
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
