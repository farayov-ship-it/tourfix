export function getWhatsAppLink(phone: string, message: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function getTelegramLink(usernameOrUrl: string, message: string) {
  const user = usernameOrUrl
    .replace(/^https?:\/\/(t\.me|telegram\.me)\//i, "")
    .replace(/^@/, "")
    .split(/[/?]/)[0];
  return `https://t.me/${user}?text=${encodeURIComponent(message)}`;
}

export type MessageChannel = "whatsapp" | "telegram";

export function buildBookingMessage(params: {
  name: string;
  phone: string;
  from?: string;
  to?: string;
  date?: string;
  passengers?: string | number;
  category?: string;
  priceHint?: number;
  locale?: string;
}) {
  const lines = [
    "TurkUztan booking request",
    `Name: ${params.name}`,
    `Phone: ${params.phone}`,
  ];
  if (params.from) lines.push(`From: ${params.from}`);
  if (params.to) lines.push(`To: ${params.to}`);
  if (params.date) lines.push(`Date: ${params.date}`);
  if (params.passengers) lines.push(`Passengers: ${params.passengers}`);
  if (params.category) lines.push(`Vehicle: ${params.category}`);
  if (params.priceHint) lines.push(`Indicative price: $${params.priceHint}`);
  if (params.locale) lines.push(`Locale: ${params.locale}`);
  return lines.join("\n");
}
