import { Badge } from "@app/components/primitives/badge";
import { Item, ItemContent, ItemHeader } from "@app/components/primitives/item";
import type { Report } from "@app/types/report";
import dayjs from "dayjs";

interface Props {
  report: Report;
}

export const ReportListItem = ({ report }: Props) => {
  return (
    <Item variant="muted">
      <ItemHeader>
        <div className="flex justify-between w-full">
          <p className="font-medium">{report.descricao}</p>
          <p>{dayjs(report.data).format("DD/MM/YYYY")}</p>
        </div>
      </ItemHeader>
      <ItemContent>
        <div className="flex gap-1">
          <Badge>{report.categoria}</Badge>
          <Badge variant="secondary">{report.status}</Badge>
        </div>
      </ItemContent>
    </Item>
  );
};
