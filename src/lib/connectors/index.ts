import { googleSheetsConnector } from "./googleSheets";
import { fileUploadConnector } from "./fileUpload";
import { webhookConnector } from "./webhook";
import type { DataSourceConnector, DataSourceType } from "./types";

const registry: Partial<Record<DataSourceType, DataSourceConnector>> = {
  google_sheets: googleSheetsConnector,
  excel_upload: fileUploadConnector,
  word_upload: fileUploadConnector,
  webhook: webhookConnector,
  bitrix24: webhookConnector,
  moysklad: webhookConnector
};

export function getConnector(type: DataSourceType) {
  const connector = registry[type];
  if (!connector) {
    throw new Error(`Connector for type ${type} is not implemented yet`);
  }
  return connector;
}
