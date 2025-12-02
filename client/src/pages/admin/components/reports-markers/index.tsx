import { cn } from "@app/lib/utils";
import type { Report } from "@app/types/report";
import { getCords } from "@app/utils/get-cords";
import { Marker } from "react-map-gl/maplibre";

interface Props {
  reports: Report[];
}

export const ReportsMarkers = ({ reports }: Props) => {
  return reports?.map((report) => (
    <Marker key={report.coordenadas} {...getCords(report.coordenadas)}>
      <div
        className={cn(
          "w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer transition-all"
        )}
      ></div>
    </Marker>
  ));
};
