import { useEffect, useState } from "react";
import { useMap } from "react-map-gl/maplibre";

export const useIsDragging = () => {
  const { totemMap } = useMap();
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    totemMap?.on("dragstart", () => setIsDragging(true));
    totemMap?.on("dragend", () => setIsDragging(false));

    return () => {
      totemMap?.off("dragstart", () => setIsDragging(true));
      totemMap?.off("dragend", () => setIsDragging(false));
    };
  }, [totemMap]);

  return { isDragging };
};
