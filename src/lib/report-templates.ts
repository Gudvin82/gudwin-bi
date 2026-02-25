export type ReportTemplate = {
  id: string;
  workspaceId: string;
  name: string;
  prompt: string;
  datasetIds: string[];
  channels: string[];
  schedule?: {
    frequency: "daily" | "weekly" | "monthly";
    time: string;
    dayOfWeek?: string;
    dayOfMonth?: number;
  };
  recipients?: string[];
  createdAt: string;
};

export const reportTemplates: ReportTemplate[] = [];
