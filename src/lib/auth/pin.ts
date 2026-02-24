export const PIN_COOKIE_NAME = "gw_portal_pin";
export const PIN_COOKIE_VALUE = "ok";

export function getPortalPin() {
  return process.env.PORTAL_PIN ?? "0000";
}
