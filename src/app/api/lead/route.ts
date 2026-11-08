import { NextResponse } from "next/server";

// Receives a request from the site forms and sends it to Telegram.
// Needs TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in the environment, see .env.example.
// Without them it answers 503, and the form tells the visitor to write directly.

const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-request" }, { status: 400 });
  }

  // Filled hidden field means a spam bot. Answer as usual and send nothing.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const contact = clean(body.contact, 120);
  if (!name || !contact) {
    return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 503 });
  }

  const text = [
    "Новая заявка с сайта ASCEND",
    `Откуда: ${clean(body.source, 80) || "не указано"}`,
    `Имя: ${name}`,
    `Контакт: ${contact}`,
    clean(body.business, 160) && `Сфера: ${clean(body.business, 160)}`,
    clean(body.details, 600) && `Детали: ${clean(body.details, 600)}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!response.ok) {
      return NextResponse.json({ ok: false, reason: "telegram" }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ ok: false, reason: "telegram" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
