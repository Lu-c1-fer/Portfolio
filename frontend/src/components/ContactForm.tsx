import { useState, type FormEvent, type ReactNode } from "react";
import { sfx } from "../lib/sfx";
import { submitContact } from "../lib/api";
import { PixelButton } from "./PixelButton";

type FormState = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "REQUIRED";
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "INVALID EMAIL";
    if (message.trim().length < 10) errs.message = "MIN 10 CHARS";
    if (Object.keys(errs).length) {
      setErrors(errs);
      sfx.play("bump");
      return;
    }
    setErrors({});
    setState("sending");
    try {
      await submitContact({ name: name.trim(), email: email.trim(), message: message.trim() });
      setState("sent");
      sfx.play("oneup");
    } catch {
      setState("error");
      sfx.play("bump");
    }
  };

  if (state === "sent") {
    return (
      <div className="text-center py-3">
        <div className="font-pixel text-[14px] text-nesGreen mb-2">1-UP!</div>
        <p className="font-body text-[16px] text-nesBlack">Message received. I'll get back to you within a couple of days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-3">
      <NesField label="NAME" error={errors.name}>
        <input value={name} onChange={(e) => setName(e.target.value)} className="nes-input" placeholder="player 1" />
      </NesField>
      <NesField label="EMAIL" error={errors.email}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="nes-input" placeholder="you@somewhere.com" />
      </NesField>
      <NesField label="MESSAGE" error={errors.message}>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="nes-input nes-input--ta" placeholder="say hi" />
      </NesField>
      {state === "error" && (
        <p className="font-pixel text-[8px] text-nesRed">Something went wrong sending that — try again in a moment.</p>
      )}
      <div className="flex justify-end pt-1">
        <PixelButton type="submit" color="red" disabled={state === "sending"}>
          {state === "sending" ? "SENDING..." : "SEND ▶"}
        </PixelButton>
      </div>
    </form>
  );
}

function NesField({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-pixel text-[8px] text-nesBlack">{label}</span>
        {error && <span className="font-pixel text-[8px] text-nesRed">{error}</span>}
      </div>
      {children}
    </label>
  );
}
