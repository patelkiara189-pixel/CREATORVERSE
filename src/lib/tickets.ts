import { randomBytes } from "crypto";
import QRCode from "qrcode";

export function generateRegistrationId() {
  return "CV" + randomBytes(4).toString("hex").toUpperCase();
}

export function generateTicketNumber() {
  return "TKT-" + randomBytes(5).toString("hex").toUpperCase();
}

export function generateVerificationToken() {
  return randomBytes(32).toString("base64url");
}

export async function generateQrDataUrl(token: string) {
  return QRCode.toDataURL(token, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 280,
    color: { dark: "#18181b", light: "#ffffff" },
  });
}
