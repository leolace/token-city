import type { UpdateReportStatusRequest } from "../response/update-report-status";
import { client } from "../client";
import { endpoints } from "../endpoints";

export const updateReportStatus = async (data: UpdateReportStatusRequest) => {
  return client.patch(endpoints.report.updateStatus, { json: data }).json();
};
