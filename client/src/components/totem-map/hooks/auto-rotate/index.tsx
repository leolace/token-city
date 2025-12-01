import { useEffect, useRef } from "react";
import { useMap } from "react-map-gl/maplibre";

interface UseAutoRotateProps {
  enabled: boolean | { rotationSpeed?: number };
}

export const useAutoRotate = ({ enabled }: UseAutoRotateProps) => {
  const rotationRef = useRef<number | null>(null);
  const { totemMap } = useMap();

  useEffect(() => {
    if (!enabled) return;

    const map = totemMap;
    if (!map) return;

    const rotationSpeed =
      typeof enabled === "object" && enabled.rotationSpeed
        ? enabled.rotationSpeed
        : 10;

    let bearing = map.getBearing();
    const rotateMap = () => {
      bearing = (bearing + rotationSpeed / 60) % 360;
      map.setBearing(bearing);
      rotationRef.current = requestAnimationFrame(rotateMap);
    };

    rotationRef.current = requestAnimationFrame(rotateMap);

    return () => {
      if (rotationRef.current) {
        cancelAnimationFrame(rotationRef.current);
      }
    };
  }, [enabled, totemMap]);
};
