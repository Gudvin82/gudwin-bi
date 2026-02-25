export type Annotation = {
  id: string;
  workspaceId: string;
  scope: "dashboard" | "finance" | "marketing" | "owner";
  title: string;
  note: string;
  createdAt: string;
};

export const annotations: Annotation[] = [
  {
    id: "ann_1",
    workspaceId: "demo",
    scope: "marketing",
    title: "Запустили акцию -15%",
    note: "Ожидаем рост конверсии на 2 п.п. к концу недели.",
    createdAt: new Date().toISOString()
  },
  {
    id: "ann_2",
    workspaceId: "demo",
    scope: "finance",
    title: "Перенесли платеж поставщику",
    note: "Сдвиг на 7 дней, чтобы избежать кассового разрыва.",
    createdAt: new Date().toISOString()
  }
];
