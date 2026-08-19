import type { Map as MapLibreMap } from "maplibre-gl";

/**
 * OpenFreeMap's dark style paints motorways nearly black past zoom 6.
 * These overrides keep I-10, Loop 375, and US-54 readable on the site background.
 */
const ROAD_PAINT: Record<string, Record<string, unknown>> = {
  background: { "background-color": "#0A0D12" },
  water: { "fill-color": "#1B2430" },
  waterway: { "line-color": "#243044" },
  landuse_residential: { "fill-color": "#121820" },
  highway_motorway_inner: { "line-color": "#F0C94A" },
  highway_motorway_casing: { "line-color": "#8A6F1F" },
  highway_motorway_subtle: { "line-color": "#C4A43A" },
  highway_major_inner: { "line-color": "#C5D4E8" },
  highway_major_casing: { "line-color": "#5C6E82" },
  highway_major_subtle: { "line-color": "#8AA0B8" },
  highway_minor: { "line-color": "#6B7C8F" },
  highway_path: { "line-color": "#3E4A58" },
  highway_name_motorway: {
    "text-color": "#F3E2A8",
    "text-halo-color": "#0A0D12",
  },
  highway_name_other: {
    "text-color": "#A8B3C2",
    "text-halo-color": "#0A0D12",
  },
};

export function applyDarkRoadContrast(map: MapLibreMap): void {
  const setPaint = map.setPaintProperty.bind(map) as (layerId: string, name: string, value: unknown) => void;
  for (const [layerId, paint] of Object.entries(ROAD_PAINT)) {
    if (!map.getLayer(layerId)) {
      continue;
    }
    for (const [property, value] of Object.entries(paint)) {
      try {
        setPaint(layerId, property, value);
      } catch {
        // Style updates may drop a paint property; skip rather than failing the map.
      }
    }
  }
}
