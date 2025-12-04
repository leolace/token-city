import type { Report } from "@app/types/report";
import { ReportListItemWithStatus } from "./report-list-item";

interface Props {
  reports: Report[];
}

export const ReportListWithStatus = ({ reports }: Props) => {
  if (reports.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhuma denúncia encontrada
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {reports.map((report, index) => (
        <ReportListItemWithStatus key={index} report={report} />
      ))}
    </div>
  );
};
