import { useMemo } from "react";
import { getBoundsFromLatLng } from "../../utils";

interface UseMapBoundsProps {
  latitude: number;
  longitude: number;
  radiusInMeters?: number;
}

export const useMapBounds = ({
  latitude,
  longitude,
  radiusInMeters = 1000,
}: UseMapBoundsProps) => {
  return useMemo(
    () => getBoundsFromLatLng(latitude, longitude, radiusInMeters),
    [latitude, longitude, radiusInMeters]
  );
};
