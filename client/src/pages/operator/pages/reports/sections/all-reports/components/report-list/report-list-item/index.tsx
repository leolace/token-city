import { useState } from "react";
import { Badge } from "@app/components/primitives/badge";
import { Button } from "@app/components/primitives/button";
import { Item, ItemContent, ItemHeader } from "@app/components/primitives/item";
import type { Report } from "@app/types/report";
import dayjs from "dayjs";
import { UpdateStatusDialog } from "./update-status-dialog";

interface Props {
  report: Report;
}

export const ReportListItemWithStatus = ({ report }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Item variant="muted">
        <ItemHeader>
          <div className="flex justify-between w-full items-center">
            <div className="flex flex-col gap-1">
              <p className="font-medium">{report.descricao}</p>
              <p className="text-sm text-muted-foreground">
                {report.nome_usuario} -{" "}
                {dayjs(report.data).format("DD/MM/YYYY")}
              </p>
            </div>
            <Button size="sm" onClick={() => setIsDialogOpen(true)}>
              Atualizar Status
            </Button>
          </div>
        </ItemHeader>
        <ItemContent>
          <div className="flex flex-col gap-3">
            <div className="flex gap-1">
              <Badge>{report.categoria}</Badge>
              <Badge variant="secondary">{report.status}</Badge>
              <Badge variant="outline">Prioridade: {report.prioridade}</Badge>
            </div>
            {report.imagem && (
              <img
                src={report.imagem}
                alt="Imagem da denúncia"
                className="w-full max-w-md rounded-md object-cover"
              />
            )}
          </div>
        </ItemContent>
      </Item>

      <UpdateStatusDialog
        report={report}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
};
