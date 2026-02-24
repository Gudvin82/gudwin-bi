"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

type Integration = { id: string; type: string; status: string; lastSync: string };
type Rule = { id: string; when: string; then: string; enabled: boolean };

export default function ConnectPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);

  useEffect(() => {
    const load = async () => {
      const [i, r] = await Promise.all([
        fetch("/api/connect/integrations").then((x) => x.json()),
        fetch("/api/connect/rules").then((x) => x.json())
      ]);
      setIntegrations(i.integrations ?? []);
      setRules(r.rules ?? []);
    };

    void load();
  }, []);

  return (
    <div className="space-y-4">
      <Card className="animate-fade-up bg-gradient-to-r from-violet-50 to-sky-50">
        <h2 className="text-xl font-bold">Интеграции (Smart Connect)</h2>
        <p className="text-sm text-muted">Единая интеграционная шина: CRM, банки, реклама, маркетплейсы, вебхуки и правила действий.</p>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="mb-3 text-base font-semibold">Интеграции</h3>
          <div className="space-y-2 text-sm">
            {integrations.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                <span className="font-medium">{item.type}</span>
                <span className="text-muted">{item.status} • {item.lastSync}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 text-base font-semibold">Webhook-конструктор (IF → THEN)</h3>
          <div className="space-y-2 text-sm">
            {rules.map((rule) => (
              <div key={rule.id} className="rounded-xl border border-border p-3">
                <p className="font-medium">{rule.when}</p>
                <p className="text-muted">{rule.then}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
