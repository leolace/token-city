import { Button } from "@app/components/primitives/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardTitle,
} from "@app/components/primitives/card";
import { Flag, Hand } from "lucide-react";
import { useEffect, useState } from "react";
import { useMap, type ViewStateChangeEvent } from "react-map-gl/maplibre";
import { AuthDialog } from "@app/components/totem-map/components/auth-dialog";
import { cn } from "@app/lib/utils";
import { useLocationStore } from "@app/stores/location";
import { useIsDragging } from "@app/components/totem-map/hooks/is-dragging";
import { INITIAL_VIEW_STATE } from "@app/components/totem-map/utils";

export const SelectionToolbar = () => {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const { isDragging } = useIsDragging();
  const { totemMap } = useMap();
  const { setLocation } = useLocationStore();

  useEffect(() => {
    const handleMove = (e: ViewStateChangeEvent) => {
      setViewState(e.viewState);
    };
    totemMap?.on("move", handleMove);

    return () => {
      totemMap?.off("move", handleMove);
    };
  }, [totemMap]);

  return (
    <div className={cn(isDragging && "opacity-30 pointer-events-none")}>
      <div className="absolute z-10 top-2 left-1/2 transform -translate-x-1/2 px-5 transition pointer-events-none">
        <Card>
          <CardContent className="flex gap-3">
            <Hand />
            <p className="text-base font-semibold">Mova o mapa</p>
          </CardContent>
        </Card>
      </div>
      <div className="absolute z-10 bottom-5 left-0 right-0 px-5 transition">
        <Card>
          <CardContent>
            <CardTitle className="text-3xl font-semibold">
              Localização da denúncia selecionada
            </CardTitle>
            <CardDescription className="text-xl">{`Latitude: ${viewState.latitude.toFixed(
              6
            )}, Longitude: ${viewState.longitude.toFixed(6)}`}</CardDescription>
            <CardAction className="w-full mt-5 grid">
              <AuthDialog>
                <Button
                  variant="destructive"
                  size="lg"
                  className="h-full w-full cursor-pointer"
                  onClick={() =>
                    setLocation(viewState.latitude, viewState.longitude)
                  }
                >
                  <Flag strokeWidth="4px" size="32px" />
                  <p className="text-xl font-semibold py-5">
                    Confirmar denúncia neste local
                  </p>
                </Button>
              </AuthDialog>
            </CardAction>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
