import { TotemMap } from "@app/components/totem-map";
import { useLocationStore } from "@app/stores/location";
import { Navigate } from "react-router";
import { UserCard } from "./components/user-card";
import { ReportForm } from "./components/report-form";
import { MapPin } from "@app/components/map-pin";
import { TotemMark } from "@app/components/totem-mark";
import { CAASO_TOTEM } from "../../utils";

export const ReportPage = () => {
  const { latitude, longitude } = useLocationStore();

  if (!latitude || !longitude) return <Navigate to="/" />;
  return (
    <div className="grid grid-cols-[1fr_700px]">
      <div className="flex flex-col gap-3 p-3 items-start">
        <UserCard />

        <ReportForm />
      </div>

      <div className="sticky top-0 h-screen w-full">
        <TotemMap
          autoRotate={{ rotationSpeed: 1 }}
          latitude={latitude}
          longitude={longitude}
        >
          <TotemMark
            latitude={CAASO_TOTEM.latitude}
            longitude={CAASO_TOTEM.longitude}
            tooltip={{ content: "Você", options: { defaultOpen: true } }}
          />
          <MapPin />
        </TotemMap>
      </div>
    </div>
  );
};
