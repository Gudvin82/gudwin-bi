import crypto from "node:crypto";

const ALGO = "aes-256-gcm";
const KEY = process.env.ENCRYPTION_KEY || "";

function ensureKey() {
  if (KEY.length < 32) {
    throw new Error("ENCRYPTION_KEY must be at least 32 chars");
  }
}

export function encryptSecret(plain: string): string {
  ensureKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, Buffer.from(KEY.slice(0, 32)), iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decryptSecret(payload: string): string {
  ensureKey();
  const [ivHex, tagHex, dataHex] = payload.split(":");
  const decipher = crypto.createDecipheriv(ALGO, Buffer.from(KEY.slice(0, 32)), Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(dataHex, "hex")), decipher.final()]);
  return decrypted.toString("utf8");
}
