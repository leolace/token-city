import { Button } from "@app/components/primitives/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardTitle,
} from "@app/components/primitives/card";
import { Flag } from "lucide-react";
import { useEffect, useState } from "react";
import { useMap, type ViewStateChangeEvent } from "react-map-gl/maplibre";
import { INITIAL_VIEW_STATE } from "../../utils";
import { ReportDialog } from "@app/components/report-dialog";

export const SelectionToolbar = () => {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const { totemMap } = useMap();

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
    <div className="absolute z-10 bottom-5 left-0 right-0 px-5">
      <Card>
        <CardContent>
          <CardTitle className="text-3xl font-semibold">
            Localização da denúncia selecionada
          </CardTitle>
          <CardDescription className="text-xl">{`Latitude: ${viewState.latitude.toFixed(
            6
          )}, Longitude: ${viewState.longitude.toFixed(6)}`}</CardDescription>
          <CardAction className="w-full mt-5 grid">
            <ReportDialog>
              <Button
                variant="destructive"
                size="lg"
                className="h-full w-full cursor-pointer"
              >
                <Flag strokeWidth="4px" size="32px" />
                <p className="text-xl font-semibold py-5">
                  Confirmar denúncia neste local
                </p>
              </Button>
            </ReportDialog>
          </CardAction>
        </CardContent>
      </Card>
    </div>
  );
};
