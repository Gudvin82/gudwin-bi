export function getPortalPin() {
  const pin = process.env.PORTAL_PIN;
  if (process.env.NODE_ENV === "production") {
    if (!pin || pin.trim().length < 4 || pin.trim() === "0000") {
      throw new Error("PORTAL_PIN не задан или слишком простой.");
    }
  }
  return pin ?? "0000";
}
