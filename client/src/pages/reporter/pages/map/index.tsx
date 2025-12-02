import { TotemMap } from "@app/components/totem-map";
import { SelectionToolbar } from "./components/selection-toolbar";
import { useMapBounds } from "@app/components/totem-map/hooks/map-bounds";
import { MapPin } from "@app/components/map-pin";
import { TotemMark } from "@app/components/totem-mark";
import { CAASO_TOTEM } from "../../utils";

export const Map = () => {
  const maxBounds = useMapBounds({
    latitude: CAASO_TOTEM.latitude,
    longitude: CAASO_TOTEM.longitude,
  });

  return (
    <TotemMap
      minZoom={15}
      maxZoom={19}
      style={{ width: "100%", height: "100vh" }}
      maxBounds={maxBounds}
    >
      <TotemMark
        latitude={CAASO_TOTEM.latitude}
        longitude={CAASO_TOTEM.longitude}
        tooltip={{ content: "Você", options: { defaultOpen: true } }}
      />
      <MapPin />
      <SelectionToolbar />
    </TotemMap>
  );
};
