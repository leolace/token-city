import {
  Map as MapLibre,
  MapProvider,
  type MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_STYLE } from "./utils";
import { TotemMark } from "./components/totem-mark";
import { MapPin } from "./components/map-pin";
import { useRef, type Ref } from "react";
import { SelectionToolbar } from "./components/selection-toolbar";
import { useMapViewState } from "./hooks/map-view-state";
import { useMapBounds } from "./hooks/map-bounds";
import { useAutoRotate } from "./hooks/auto-rotate";

interface Props {
  mapRef?: Ref<MapRef>;
  latitude?: number;
  longitude?: number;
  disableSelection?: boolean;
  autoRotate?: boolean | { rotationSpeed?: number };
}

const Component = ({
  latitude,
  longitude,
  disableSelection = false,
  autoRotate = false,
}: Props) => {
  const internalMapRef = useRef<MapRef>(null);

  const viewState = useMapViewState({ latitude, longitude });
  const maxBounds = useMapBounds({
    latitude: viewState.latitude,
    longitude: viewState.longitude,
  });

  useAutoRotate({ enabled: autoRotate });

  return (
    <MapLibre
      ref={internalMapRef}
      initialViewState={viewState}
      mapStyle={MAP_STYLE}
      minZoom={15}
      maxZoom={19}
      style={{ width: "100%", height: "100vh" }}
      maxBounds={maxBounds}
      id="totemMap"
      dragPan={!disableSelection}
      dragRotate={!autoRotate}
      touchZoomRotate={!autoRotate}
    >
      <TotemMark />
      <MapPin />
      {!disableSelection && <SelectionToolbar />}
    </MapLibre>
  );
};

export const TotemMap = (props: Props) => {
  return (
    <MapProvider>
      <Component {...props} />
    </MapProvider>
  );
};
