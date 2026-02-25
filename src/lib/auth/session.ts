import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/auth/session-cookie";

export type SessionContext = {
  userId: string;
  workspaceId: string;
  role: "owner" | "member";
};

export async function getSessionContext(): Promise<SessionContext> {
  const store = await cookies();
  const sessionCookie = store.get(SESSION_COOKIE_NAME)?.value;
  const session = verifySession(sessionCookie);

  if (session) {
    return {
      userId: session.userId,
      workspaceId: session.workspaceId,
      role: session.role
    };
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Не найдено активной сессии.");
  }

  return {
    userId: "00000000-0000-0000-0000-000000000001",
    workspaceId: process.env.DEFAULT_WORKSPACE_ID ?? "00000000-0000-0000-0000-000000000001",
    role: "owner"
  };
}
