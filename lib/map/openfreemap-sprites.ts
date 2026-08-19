import type { Map as MapLibreMap } from "maplibre-gl";

/**
 * OpenFreeMap's dark style still uses Maki names like `circle-11`.
 * The ofm_f384 sprite sheet stores those same icons as `circle_11`.
 */
export function openFreeMapSpriteAlias(id: string): string | null {
  if (!id.includes("-")) {
    return null;
  }
  return id.replaceAll("-", "_");
}

export function registerOpenFreeMapSpriteAliases(map: MapLibreMap): void {
  map.setMissingStyleImageResolver((id) => {
    const alias = openFreeMapSpriteAlias(id);
    if (!alias || !map.hasImage(alias)) {
      return;
    }
    const image = map.getImage(alias);
    if (!image?.data) {
      return;
    }
    map.addImage(id, image.data, {
      pixelRatio: image.pixelRatio,
      sdf: image.sdf,
    });
  });
}
