import { usePendingReports } from "@app/hooks/reports";
import { ReportCategory } from "@app/types/report";
import type { Totem } from "@app/types/totem";
import { getCords } from "@app/utils/get-cords";
import { useRef, useState } from "react";
import type { MapRef } from "react-map-gl/maplibre";

export const useReports = () => {
  const totemMap = useRef<MapRef>(null);
  const [selectedTotem, setSelectedTotem] = useState<Totem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    ReportCategory.Iluminacao
  );
  const { pendingReports } = usePendingReports({
    category: selectedCategory,
    coordinates: getCords(selectedTotem?.coordenadas),
    radius: 10000,
  });

  const handleTotemClick = (totem: Totem) => {
    setSelectedTotem(totem);
    const coords = getCords(totem.coordenadas);
    if (coords && totemMap.current) {
      totemMap.current.flyTo({
        center: [coords.longitude, coords.latitude],
        zoom: 13,
        duration: 2000,
      });
    }
  };

  return {
    totemMap,
    selectedTotem,
    setSelectedTotem,
    selectedCategory,
    setSelectedCategory,
    pendingReports,
    handleTotemClick,
  };
};
