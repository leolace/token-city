import { TotemMap, type TotemMapProps } from "@app/components/totem-map";
import { TotemMark } from "@app/components/totem-mark";
import { useTotems } from "@app/hooks/totems";
import { ReportsMarkers } from "@app/pages/admin/components/reports-markers";
import type { Report } from "@app/types/report";
import type { Totem } from "@app/types/totem";
import { getCords } from "@app/utils/get-cords";

interface Props extends TotemMapProps {
  reports: Report[];
  selectedTotem: Totem | null;
  setSelectedTotem: (totem: Totem | null) => void;
}

export const Map = ({
  selectedTotem,
  setSelectedTotem,
  reports,
  ...props
}: Props) => {
  const { totems } = useTotems();

  return (
    <TotemMap
      initialViewState={{
        zoom: 5,
        latitude: -23.55052,
        longitude: -46.633308,
      }}
      {...props}
    >
      {totems.map((totem, index) => (
        <TotemMark
          key={index}
          selected={selectedTotem?.numero_serie === totem.numero_serie}
          tooltip={{
            content: totem.numero_serie,
            options: { defaultOpen: false },
          }}
          onClick={() => setSelectedTotem(totem)}
          {...getCords(totem.coordenadas)}
        />
      ))}

      {selectedTotem && <ReportsMarkers reports={reports} />}
    </TotemMap>
  );
};
