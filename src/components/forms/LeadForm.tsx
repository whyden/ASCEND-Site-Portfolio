"use client";

import { useId, useState, type FormEvent } from "react";
import { site } from "@/config/site";
import { trackGoal } from "@/lib/analytics";

type Status = "idle" | "sending" | "error" | "not-configured";

type LeadFormProps = {
  source: string;
  details?: string;
  submitLabel: string;
  consent?: string;
  withBusiness?: boolean;
  onSent?: () => void;
};

export function LeadForm({
  source,
  details,
  submitLabel,
  consent,
  withBusiness = true,
  onSent,
}: LeadFormProps) {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus("sending");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          contact: data.get("contact"),
          business: data.get("business") ?? "",
          // Hidden field. People leave it empty, spam bots fill it in.
          website: data.get("website"),
          source,
          details,
        }),
      });
      if (response.status === 503) {
        setStatus("not-configured");
        return;
      }
      if (!response.ok) {
        setStatus("error");
        return;
      }
      trackGoal("lead");
      setStatus("idle");
      onSent?.();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <div className="field">
        <input id={`${id}-name`} name="name" required maxLength={120} placeholder=" " autoComplete="name" />
        <label htmlFor={`${id}-name`}>Ваше имя</label>
      </div>
      <div className="field">
        <input id={`${id}-contact`} name="contact" required maxLength={120} placeholder=" " autoComplete="tel" />
        <label htmlFor={`${id}-contact`}>Телефон или ник в Telegram</label>
      </div>
      {withBusiness ? (
        <div className="field">
          <input id={`${id}-business`} name="business" required maxLength={160} placeholder=" " />
          <label htmlFor={`${id}-business`}>Сфера бизнеса</label>
        </div>
      ) : null}
      <input className="form-trap" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <button type="submit" className="btn btn-solid form-submit" disabled={status === "sending"}>
        <span>{status === "sending" ? "Отправляем" : submitLabel}</span>
      </button>

      {consent ? <p className="form-note">{consent}</p> : null}

      <div aria-live="polite">
        {status === "error" ? (
          <p className="form-error">Не удалось отправить заявку. Проверьте интернет и попробуйте ещё раз.</p>
        ) : null}
        {status === "not-configured" ? (
          <p className="form-error">
            Форма пока не подключена к Telegram.{" "}
            {site.telegramIsSet ? (
              <a href={site.telegramUrl} target="_blank" rel="noreferrer">
                Напишите нам напрямую: @{site.telegram}
              </a>
            ) : (
              "Напишите нам напрямую."
            )}
          </p>
        ) : null}
      </div>
    </form>
  );
}
