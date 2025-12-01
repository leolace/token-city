import { useMemo } from "react";
import { INITIAL_VIEW_STATE } from "../../utils";

interface UseMapViewStateProps {
  latitude?: number;
  longitude?: number;
}

export const useMapViewState = ({
  latitude,
  longitude,
}: UseMapViewStateProps) => {
  return useMemo(
    () => ({
      ...INITIAL_VIEW_STATE,
      latitude: latitude ?? INITIAL_VIEW_STATE.latitude,
      longitude: longitude ?? INITIAL_VIEW_STATE.longitude,
    }),
    [latitude, longitude]
  );
};
