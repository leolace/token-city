import { Marker } from "react-map-gl/maplibre";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@app/components/primitives/tooltip";
import { cn } from "@app/lib/utils";
import type { TooltipProps } from "@radix-ui/react-tooltip";

interface Props {
  latitude: number;
  longitude: number;
  tooltip?: { disable?: boolean; content?: string; options?: TooltipProps };
  selected?: boolean;
  onClick?: () => void;
}

export const TotemMark = ({
  latitude,
  longitude,
  tooltip = { disable: false, content: "Você" },
  selected,
  onClick,
}: Props) => {
  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      anchor="center"
      onClick={onClick}
    >
      <Tooltip {...tooltip.options}>
        <TooltipTrigger>
          <div
            className={cn(
              "relative flex h-5 w-5 items-center justify-center cursor-pointer hover:scale-150",
              selected && "scale-150"
            )}
          >
            <span
              className={cn(
                "absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75",
                selected && "animate-ping"
              )}
            ></span>
            <span className="relative inline-flex h-5 w-5 rounded-full border-[3px] border-white bg-red-500 shadow-md"></span>
          </div>
        </TooltipTrigger>
        <TooltipContent>{tooltip.content}</TooltipContent>
      </Tooltip>
    </Marker>
  );
};
