"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "@/components/brand/Logo";
import { site } from "@/config/site";
import { trackGoal } from "@/lib/analytics";

// A ready message: the visitor copies it and sends it to us in Telegram.
// The site itself sends nothing anywhere: it is plain files without a server.
export function TelegramMessage({ text }: { text: string }) {
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Older browsers: select the text in the field and copy it the old way.
      fieldRef.current?.select();
      document.execCommand("copy");
    }
    setCopied(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="tg-message">
      <label className="tg-label">
        <span className="t-small soft">Ваше сообщение</span>
        <textarea ref={fieldRef} className="tg-text" readOnly rows={6} value={text} data-lenis-prevent="" />
      </label>
      <div className="tg-actions">
        <button
          type="button"
          className="btn btn-solid"
          onClick={() => {
            copy();
            trackGoal("copy");
          }}
        >
          <span>{copied ? "Скопировано" : "Скопировать текст"}</span>
        </button>
        <a
          className="btn"
          href={site.telegramUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            // The text is copied on the way, so it only has to be pasted in the chat.
            copy();
            trackGoal("lead");
          }}
        >
          <span>Написать в Telegram</span>
          <ArrowUpRight className="btn-arrow" aria-hidden="true" />
        </a>
      </div>
      <p className="tg-note" aria-live="polite">
        {copied ? "Текст скопирован. Вставьте его в чат с " : "Скопируйте текст и отправьте его нам в Telegram: "}@
        {site.telegram}
      </p>
    </div>
  );
}
