import { PendingReports } from "./sections/pending-reports";
import { UserReports } from "./sections/user-reports";

export const ReportsPage = () => {
  return (
    <div className="grid gap-12">
      <PendingReports />
      <UserReports />
    </div>
  );
};
