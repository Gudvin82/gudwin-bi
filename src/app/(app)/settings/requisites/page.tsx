"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "@/components/ui/help-popover";

type LegalEntity = {
  id: string;
  shortName: string;
  fullName: string;
  inn: string;
  kpp: string;
  ogrn: string;
  legalAddress: string;
  bankName: string;
  bankBik: string;
  account: string;
  corrAccount: string;
  isDefault: boolean;
};

const initialEntities: LegalEntity[] = [];

export default function RequisitesPage() {
  const [entities, setEntities] = useState<LegalEntity[]>(initialEntities);
  const [form, setForm] = useState<Omit<LegalEntity, "id" | "isDefault">>({
    shortName: "",
    fullName: "",
    inn: "",
    kpp: "",
    ogrn: "",
    legalAddress: "",
    bankName: "",
    bankBik: "",
    account: "",
    corrAccount: ""
  });
  const [hint, setHint] = useState("");

  const onAdd = () => {
    if (!form.shortName || !form.inn) {
      setHint("Укажите как минимум короткое название и ИНН.");
      return;
    }

    const next: LegalEntity = {
      id: `le_${Date.now()}`,
      isDefault: entities.length === 0,
      ...form
    };
    setEntities((prev) => [...prev, next]);
    setForm({
      shortName: "",
      fullName: "",
      inn: "",
      kpp: "",
      ogrn: "",
      legalAddress: "",
      bankName: "",
      bankBik: "",
      account: "",
      corrAccount: ""
    });
    setHint("Юрлицо добавлено. В боевом режиме данные будут сохраняться в БД.");
  };

  const onSetDefault = (id: string) => {
    setEntities((prev) => prev.map((item) => ({ ...item, isDefault: item.id === id })));
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-cyan-50 to-emerald-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Мои реквизиты</h2>
            <p className="mt-1 text-sm text-muted">
              Добавьте одно или несколько юридических лиц. Реквизиты используются в документах, отчетах и интеграциях.
            </p>
          </div>
          <HelpPopover
            title="Где используются реквизиты"
            items={[
              "Подставляются в договоры, счета и акты.",
              "Используются в отчетах и интеграциях.",
              "Можно выбрать основное юрлицо для шаблонов."
            ]}
          />
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-base font-semibold">Добавить юрлицо</h3>
        <div className="grid gap-2 md:grid-cols-2">
          <input value={form.shortName} onChange={(e) => setForm((p) => ({ ...p, shortName: e.target.value }))} className="rounded-xl border border-border p-2.5 text-sm" placeholder="Короткое название (ООО «...») " />
          <input value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} className="rounded-xl border border-border p-2.5 text-sm" placeholder="Полное юридическое название" />
          <input value={form.inn} onChange={(e) => setForm((p) => ({ ...p, inn: e.target.value }))} className="rounded-xl border border-border p-2.5 text-sm" placeholder="ИНН" />
          <input value={form.kpp} onChange={(e) => setForm((p) => ({ ...p, kpp: e.target.value }))} className="rounded-xl border border-border p-2.5 text-sm" placeholder="КПП" />
          <input value={form.ogrn} onChange={(e) => setForm((p) => ({ ...p, ogrn: e.target.value }))} className="rounded-xl border border-border p-2.5 text-sm" placeholder="ОГРН" />
          <input value={form.legalAddress} onChange={(e) => setForm((p) => ({ ...p, legalAddress: e.target.value }))} className="rounded-xl border border-border p-2.5 text-sm" placeholder="Юридический адрес" />
          <input value={form.bankName} onChange={(e) => setForm((p) => ({ ...p, bankName: e.target.value }))} className="rounded-xl border border-border p-2.5 text-sm" placeholder="Банк" />
          <input value={form.bankBik} onChange={(e) => setForm((p) => ({ ...p, bankBik: e.target.value }))} className="rounded-xl border border-border p-2.5 text-sm" placeholder="БИК" />
          <input value={form.account} onChange={(e) => setForm((p) => ({ ...p, account: e.target.value }))} className="rounded-xl border border-border p-2.5 text-sm" placeholder="Расчетный счет" />
          <input value={form.corrAccount} onChange={(e) => setForm((p) => ({ ...p, corrAccount: e.target.value }))} className="rounded-xl border border-border p-2.5 text-sm" placeholder="Корреспондентский счет" />
        </div>
        <button onClick={onAdd} className="mt-3 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">
          Добавить юрлицо
        </button>
        {hint ? <p className="mt-2 text-xs text-muted">{hint}</p> : null}
      </Card>

      <Card>
        <h3 className="mb-3 text-base font-semibold">Список юрлиц</h3>
        <div className="space-y-2">
          {entities.map((entity) => (
            <div key={entity.id} className="rounded-xl border border-border p-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">{entity.shortName}</p>
                {entity.isDefault ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700">По умолчанию</span>
                ) : (
                  <button onClick={() => onSetDefault(entity.id)} className="rounded-lg border border-border px-2 py-1 text-xs">Сделать основным</button>
                )}
              </div>
              <p className="mt-1 text-xs text-muted">{entity.fullName || "Полное название не заполнено"}</p>
              <p className="mt-1 text-xs">ИНН: {entity.inn} • КПП: {entity.kpp || "—"} • ОГРН: {entity.ogrn || "—"}</p>
              <p className="mt-1 text-xs text-muted">{entity.legalAddress || "Юридический адрес не заполнен"}</p>
              <p className="mt-1 text-xs">Банк: {entity.bankName || "—"} • БИК: {entity.bankBik || "—"}</p>
              <p className="mt-1 text-xs">р/с: {entity.account || "—"} • к/с: {entity.corrAccount || "—"}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
