import { cn } from "@app/lib/utils";
import { MapPin as MapPinIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useMap } from "react-map-gl/maplibre";

export const MapPin = () => {
  const { totemMap } = useMap();
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    totemMap?.on("dragstart", () => setDragging(true));
    totemMap?.on("dragend", () => setDragging(false));

    return () => {
      totemMap?.off("dragstart", () => setDragging(true));
      totemMap?.off("dragend", () => setDragging(false));
    };
  }, [totemMap]);

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform">
      <MapPinIcon
        size={40}
        className={cn(
          "text-red-500 drop-shadow-lg transition-transform duration-300",
          dragging ? "-translate-y-2" : ""
        )}
        fill="currentColor"
      />

      <div
        className={cn(
          "absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 translate-y-1/2 rounded-full bg-black opacity-30 shadow-md transition-all duration-300",
          dragging ? "scale-75 opacity-20" : ""
        )}
      ></div>
    </div>
  );
};
