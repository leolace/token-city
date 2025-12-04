import { Badge } from "@app/components/primitives/badge";
import { Button } from "@app/components/primitives/button";
import { Item, ItemContent, ItemHeader } from "@app/components/primitives/item";
import type { Report } from "@app/types/report";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import { Eye } from "lucide-react";

interface Props {
  report: Report;
}

export const ReportListItem = ({ report }: Props) => {
  const navigate = useNavigate();

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(
      `/admin/denuncia/${report.cpf}/${report.data}/${report.coordenadas}`,
    );
  };

  return (
    <Item variant="muted">
      <ItemHeader>
        <div className="flex justify-between w-full items-center gap-2">
          <p className="font-medium flex-1">{report.descricao}</p>
          <p className="text-sm">{dayjs(report.data).format("DD/MM/YYYY")}</p>
        </div>
      </ItemHeader>
      <ItemContent>
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-1 flex-wrap">
            <Badge>{report.categoria}</Badge>
            <Badge variant="secondary">{report.status}</Badge>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleViewDetails}
            className="gap-2 shrink-0"
          >
            <Eye className="w-4 h-4" />
            Ver Detalhes
          </Button>
        </div>
      </ItemContent>
    </Item>
  );
};
