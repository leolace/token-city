import {
  Map as MapLibre,
  MapProvider,
  type MapProps,
  type MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_STYLE } from "./utils";
import { type ReactNode, type Ref } from "react";
import { useMapViewState } from "./hooks/map-view-state";
import { useAutoRotate } from "./hooks/auto-rotate";

export interface TotemMapProps extends MapProps {
  mapRef?: Ref<MapRef>;
  latitude?: number;
  longitude?: number;
  autoRotate?: boolean | { rotationSpeed?: number };
  children?: ReactNode;
}

const Component = ({
  mapRef,
  latitude,
  longitude,
  autoRotate = false,
  children,
  ...props
}: TotemMapProps) => {
  const viewState = useMapViewState({ latitude, longitude });

  useAutoRotate({ enabled: autoRotate });

  return (
    <MapLibre
      ref={mapRef}
      initialViewState={viewState}
      mapStyle={MAP_STYLE}
      id="totemMap"
      dragRotate={!autoRotate}
      touchZoomRotate={!autoRotate}
      {...props}
    >
      {children}
    </MapLibre>
  );
};

export const TotemMap = (props: TotemMapProps) => {
  return (
    <MapProvider>
      <Component {...props} />
    </MapProvider>
  );
};
