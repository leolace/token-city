import { Marker } from "react-map-gl/maplibre";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@app/components/primitives/tooltip";

export const TotemMark = () => {
  return (
    <Marker longitude={-47.896859} latitude={-22.006775} anchor="center">
      <Tooltip defaultOpen>
        <TooltipTrigger>
          <div className="relative flex h-5 w-5 items-center justify-center cursor-pointer">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex h-5 w-5 rounded-full border-[3px] border-white bg-red-500 shadow-md"></span>
          </div>
        </TooltipTrigger>
        <TooltipContent>Você</TooltipContent>
      </Tooltip>
    </Marker>
  );
};
