import type { LngLatBoundsLike, StyleSpecification } from "maplibre-gl";

export const MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    "carto-voyager": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
        "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
        "https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
        "https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [
    {
      id: "carto-voyager-layer",
      type: "raster",
      source: "carto-voyager",
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

export const INITIAL_VIEW_STATE = {
  longitude: -47.896859,
  latitude: -22.006775,
  zoom: 17,
  pitch: 45,
  bearing: 0,
};

export const getBoundsFromLatLng = (
  lat: number,
  lon: number,
  radiusInMeters: number
): LngLatBoundsLike => {
  const earthRadius = 6378137; // Raio da Terra em metros
  const latDelta = (radiusInMeters / earthRadius) * (180 / Math.PI);
  const lonDelta =
    ((radiusInMeters / earthRadius) * (180 / Math.PI)) /
    Math.cos((lat * Math.PI) / 180);

  return [
    [lon - lonDelta, lat - latDelta], // Sudoeste (SW) [lng, lat]
    [lon + lonDelta, lat + latDelta], // Nordeste (NE) [lng, lat]
  ];
};
