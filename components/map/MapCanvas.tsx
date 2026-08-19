"use client";

import { useEffect, useRef } from "react";
import {
  Map as MapLibreMap,
  NavigationControl,
  setWorkerUrl,
  type FilterSpecification,
  type LayerSpecification,
  type MapGeoJSONFeature,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { applyDarkRoadContrast } from "@/lib/map/apply-dark-road-contrast";
import styles from "./MapCanvas.module.css";

/** Served from /public/maplibre via scripts/copy-maplibre-worker.mjs */
setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

export const DEFAULT_MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/dark";

export type MapCanvasSource = {
  id: string;
  data: string | GeoJSON.GeoJSON;
  promoteId?: string;
};

export type MapCanvasLayer = {
  id: string;
  source: string;
  type: "fill" | "line" | "symbol" | "circle";
  paint?: LayerSpecification["paint"];
  layout?: LayerSpecification["layout"];
  filter?: FilterSpecification;
  /** Insert below this existing layer id so basemap labels can stay visible. */
  beforeId?: string;
};

export type MapCanvasFeatureHandler = (properties: Record<string, unknown>) => void;

export type MapCanvasProps = {
  ariaLabel: string;
  styleUrl?: string;
  center: [number, number];
  zoom: number;
  bounds?: [[number, number], [number, number]];
  maxBounds?: [[number, number], [number, number]];
  minZoom?: number;
  maxZoom?: number;
  sources: MapCanvasSource[];
  layers: MapCanvasLayer[];
  interactiveLayerIds?: string[];
  onFeatureClick?: MapCanvasFeatureHandler;
  onFeatureHover?: (properties: Record<string, unknown> | null) => void;
  customizeStyle?: (map: MapLibreMap) => void;
  cooperativeGestures?: boolean;
  /** Added to the initial zoom on viewports below 900px. Use -1 to start one step out on phones. */
  mobileZoomDelta?: number;
};

function toProperties(feature: MapGeoJSONFeature | undefined): Record<string, unknown> | null {
  if (!feature?.properties) {
    return null;
  }
  return feature.properties as Record<string, unknown>;
}

export default function MapCanvas({
  ariaLabel,
  styleUrl = DEFAULT_MAP_STYLE_URL,
  center,
  zoom,
  bounds,
  maxBounds,
  minZoom = 9,
  maxZoom = 16,
  sources,
  layers,
  interactiveLayerIds = [],
  onFeatureClick,
  onFeatureHover,
  customizeStyle = applyDarkRoadContrast,
  cooperativeGestures = true,
  mobileZoomDelta = 0,
}: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const hoverIdRef = useRef<string | number | null>(null);
  const onFeatureClickRef = useRef(onFeatureClick);
  const onFeatureHoverRef = useRef(onFeatureHover);
  const customizeStyleRef = useRef(customizeStyle);
  const sourcesRef = useRef(sources);
  const layersRef = useRef(layers);

  onFeatureClickRef.current = onFeatureClick;
  onFeatureHoverRef.current = onFeatureHover;
  customizeStyleRef.current = customizeStyle;
  sourcesRef.current = sources;
  layersRef.current = layers;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const map = new MapLibreMap({
      container,
      style: styleUrl,
      center,
      zoom,
      bounds,
      fitBoundsOptions: bounds ? { padding: 36, duration: 0 } : undefined,
      maxBounds,
      minZoom,
      maxZoom,
      attributionControl: { compact: true },
      cooperativeGestures,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      renderWorldCopies: false,
    });
    mapRef.current = map;

    if (mobileZoomDelta !== 0 && window.matchMedia("(max-width: 899px)").matches) {
      map.setZoom(map.getZoom() + mobileZoomDelta);
    }

    map.addControl(new NavigationControl({ showCompass: false, visualizePitch: false }), "top-right");

    const setHoverState = (nextId: string | number | null, sourceId: string) => {
      if (hoverIdRef.current !== null) {
        map.setFeatureState({ source: sourceId, id: hoverIdRef.current }, { hover: false });
      }
      hoverIdRef.current = nextId;
      if (nextId !== null) {
        map.setFeatureState({ source: sourceId, id: nextId }, { hover: true });
      }
    };

    const onLoad = () => {
      customizeStyleRef.current(map);

      for (const source of sourcesRef.current) {
        if (map.getSource(source.id)) {
          continue;
        }
        map.addSource(source.id, {
          type: "geojson",
          data: source.data,
          ...(source.promoteId ? { promoteId: source.promoteId } : {}),
        });
      }

      for (const layer of layersRef.current) {
        if (map.getLayer(layer.id)) {
          continue;
        }
        const beforeId = layer.beforeId && map.getLayer(layer.beforeId) ? layer.beforeId : undefined;
        map.addLayer(
          {
            id: layer.id,
            type: layer.type,
            source: layer.source,
            ...(layer.filter ? { filter: layer.filter } : {}),
            ...(layer.layout ? { layout: layer.layout } : {}),
            ...(layer.paint ? { paint: layer.paint } : {}),
          } as LayerSpecification,
          beforeId,
        );
      }
    };

    map.on("load", onLoad);

    for (const layerId of interactiveLayerIds) {
      map.on("click", layerId, (event) => {
        const properties = toProperties(event.features?.[0]);
        if (properties) {
          onFeatureClickRef.current?.(properties);
        }
      });

      map.on("mousemove", layerId, (event) => {
        const feature = event.features?.[0];
        map.getCanvas().style.cursor = feature ? "pointer" : "";
        if (feature) {
          setHoverState(feature.id ?? null, feature.source);
        }
        onFeatureHoverRef.current?.(toProperties(feature));
      });

      map.on("mouseleave", layerId, () => {
        map.getCanvas().style.cursor = "";
        const sourceId = map.getLayer(layerId)?.source;
        if (typeof sourceId === "string") {
          setHoverState(null, sourceId);
        }
        onFeatureHoverRef.current?.(null);
      });
    }

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
      hoverIdRef.current = null;
    };
    // MapLibre owns the canvas after mount; later prop changes are handled via refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initialize the map once per container
  }, []);

  return <div ref={containerRef} className={styles.map} role="region" aria-label={ariaLabel} />;
}
