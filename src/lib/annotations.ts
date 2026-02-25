export type Annotation = {
  id: string;
  workspaceId: string;
  scope: "dashboard" | "finance" | "marketing" | "owner";
  title: string;
  note: string;
  createdAt: string;
};

export const annotations: Annotation[] = [];
