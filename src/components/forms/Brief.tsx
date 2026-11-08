"use client";

import { useId, useState } from "react";
import { briefMessage, briefQuestions, type BriefAnswers } from "@/data/brief";
import { TelegramMessage } from "./TelegramMessage";

// The questionnaire: the visitor picks what is needed and the message for Telegram is written as they go.
export function Brief() {
  const id = useId();
  const [answers, setAnswers] = useState<BriefAnswers>({});

  const setAnswer = (question: string, value: string[]) =>
    setAnswers((current) => ({ ...current, [question]: value }));

  const toggle = (question: string, option: string) => {
    const chosen = answers[question] ?? [];
    setAnswer(question, chosen.includes(option) ? chosen.filter((item) => item !== option) : [...chosen, option]);
  };

  return (
    <div className="brief">
      {briefQuestions.map((question) =>
        question.kind === "text" ? (
          <div key={question.id} className="field">
            <input
              id={`${id}-${question.id}`}
              maxLength={120}
              placeholder=" "
              autoComplete={question.id === "name" ? "name" : "off"}
              value={answers[question.id]?.[0] ?? ""}
              onChange={(event) => setAnswer(question.id, [event.target.value])}
            />
            <label htmlFor={`${id}-${question.id}`}>{question.title}</label>
          </div>
        ) : (
          <fieldset key={question.id} className="brief-group">
            <legend>{question.title}</legend>
            <div className="chips">
              {question.options.map((option) => (
                <label key={option} className="chip">
                  <input
                    type={question.kind === "one" ? "radio" : "checkbox"}
                    name={`${id}-${question.id}`}
                    checked={(answers[question.id] ?? []).includes(option)}
                    onChange={() =>
                      question.kind === "one" ? setAnswer(question.id, [option]) : toggle(question.id, option)
                    }
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ),
      )}
      <TelegramMessage text={briefMessage(answers)} />
    </div>
  );
}
