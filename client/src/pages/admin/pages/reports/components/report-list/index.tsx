import { Card, CardContent } from "@app/components/primitives/card";
import { useTotems } from "@app/hooks/totems";
import { cn } from "@app/lib/utils";
import { ReportListItem } from "./components/report-list-item";
import type { Totem } from "@app/types/totem";
import type { Report } from "@app/types/report";

interface Props {
  selectedTotem: Totem | null;
  pendingReports: Report[];
  handleTotemClick: (totem: Totem) => void;
}

export const ReportList = ({
  selectedTotem,
  pendingReports,
  handleTotemClick,
}: Props) => {
  const { totems } = useTotems();

  return (
    <div className="space-y-4 max-h-[550px] overflow-y-auto">
      {totems.map((totem) => {
        const isSelected = selectedTotem?.numero_serie === totem.numero_serie;

        return (
          <Card
            key={totem.numero_serie}
            className={cn(
              "cursor-pointer transition-all",
              isSelected && "bg-primary/20 border-primary",
            )}
            onClick={() => handleTotemClick(totem)}
          >
            <CardContent className="flex flex-col gap-3 justify-between items-start">
              <div>
                <h4 className="font-semibold text-sidebar-foreground">
                  Totem {totem.numero_serie}
                </h4>
                <p className="text-sm text-sidebar-foreground/70">
                  {totem.nomecidade} - {totem.estado}
                </p>
              </div>

              {isSelected && pendingReports.length > 0 && (
                <div className="grid gap-1 w-full">
                  {pendingReports.map((denuncia, idx) => (
                    <ReportListItem report={denuncia} key={idx} />
                    // <div key={idx} className="text-sm p-2 bg-sidebar rounded">
                    //   <p className="font-medium text-sidebar-foreground">
                    //     {denuncia.categoria}
                    //   </p>
                    //   <p className="text-sidebar-foreground/70 text-xs">
                    //     {denuncia.descricao}
                    //   </p>
                    //   <p className="text-sidebar-foreground/50 text-xs mt-1">
                    //     Status: {denuncia.status}
                    //   </p>
                    // </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
