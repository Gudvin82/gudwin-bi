import { headers } from "next/headers";

export type SessionContext = {
  userId: string;
  workspaceId: string;
  role: "owner" | "member";
};

export async function getSessionContext(): Promise<SessionContext> {
  const h = await headers();
  const workspaceId = h.get("x-workspace-id") ?? process.env.DEFAULT_WORKSPACE_ID ?? "00000000-0000-0000-0000-000000000001";
  const role = (h.get("x-user-role") as "owner" | "member") ?? "owner";

  return {
    userId: h.get("x-user-id") ?? "00000000-0000-0000-0000-000000000001",
    workspaceId,
    role
  };
}
