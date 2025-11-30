import {
  Map as MapLibre,
  MapProvider,
  type MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { getBoundsFromLatLng, INITIAL_VIEW_STATE, MAP_STYLE } from "./utils";
import { TotemMark } from "./components/totem-mark";
import { MapPin } from "./components/map-pin";
import { useMemo, type Ref } from "react";
import { SelectionToolbar } from "./components/selection-toolbar";

interface Props {
  mapRef?: Ref<MapRef>;
}

export const TotemMap = ({ mapRef }: Props) => {
  const maxBounds = useMemo(
    () =>
      getBoundsFromLatLng(
        INITIAL_VIEW_STATE.latitude,
        INITIAL_VIEW_STATE.longitude,
        1000
      ),
    []
  );

  return (
    <MapProvider>
      <MapLibre
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle={MAP_STYLE}
        minZoom={15}
        maxZoom={19}
        style={{ width: "100%", height: "100vh" }}
        maxBounds={maxBounds}
        id="totemMap"
        ref={mapRef}
      >
        <TotemMark />
        <MapPin />
        <SelectionToolbar />
      </MapLibre>
    </MapProvider>
  );
};
