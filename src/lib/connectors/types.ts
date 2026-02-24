export type DataSourceType =
  | "google_sheets"
  | "google_drive"
  | "excel_upload"
  | "word_upload"
  | "bitrix24"
  | "moysklad"
  | "custom_api"
  | "webhook";

export type ConnectorSyncResult = {
  rows: number;
  schema: Array<{ name: string; type: string }>;
  sample: Array<Record<string, unknown>>;
};

export interface DataSourceConnector {
  type: DataSourceType;
  validateConfig(input: unknown): Promise<void>;
  sync(config: Record<string, unknown>): Promise<ConnectorSyncResult>;
}
