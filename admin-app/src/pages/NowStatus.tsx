import { useEffect, useState, type FormEvent } from "react";
import { useSite } from "../hooks/useSite";
import { getNowStatus, updateNowStatus } from "../lib/api";
import type { NowStatusUpsert } from "../lib/types";
import { FormField, inputClass } from "../components/FormField";
import { SaveStatusBanner, type SaveStatus } from "../components/SaveStatusBanner";

const BLANK: NowStatusUpsert = {
  hpLabel: "",
  hpValue: "",
  xpLabel: "",
  xpValue: "",
  coinsLabel: "",
  coinsValue: "",
  starLabel: "",
  starValue: "",
  updatedDate: "",
};

const FIELDS: { label: string; key: keyof NowStatusUpsert }[] = [
  { label: "HP label", key: "hpLabel" },
  { label: "HP value", key: "hpValue" },
  { label: "XP label", key: "xpLabel" },
  { label: "XP value", key: "xpValue" },
  { label: "Coins label", key: "coinsLabel" },
  { label: "Coins value", key: "coinsValue" },
  { label: "Star label", key: "starLabel" },
  { label: "Star value", key: "starValue" },
];

export function NowStatusPage() {
  const { siteSlug } = useSite();
  const [form, setForm] = useState<NowStatusUpsert>(BLANK);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SaveStatus>({ state: "idle" });

  useEffect(() => {
    setLoading(true);
    getNowStatus(siteSlug)
      .then(setForm)
      .catch((err) => setStatus({ state: "error", message: String(err) }))
      .finally(() => setLoading(false));
  }, [siteSlug]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ state: "saving" });
    try {
      await updateNowStatus(siteSlug, form);
      setStatus({ state: "saved" });
    } catch (err) {
      setStatus({ state: "error", message: String(err) });
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Loading…</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Now status</h1>
      <form onSubmit={submit} className="space-y-4 bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4">
          {FIELDS.map((f) => (
            <FormField key={f.key} label={f.label}>
              <input
                className={inputClass}
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                required
              />
            </FormField>
          ))}
        </div>
        <FormField label="Updated date" hint="Free text, e.g. 2026-05-04">
          <input
            className={inputClass}
            value={form.updatedDate}
            onChange={(e) => setForm({ ...form, updatedDate: e.target.value })}
            required
          />
        </FormField>
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="rounded bg-blue-600 text-white text-sm font-medium px-4 py-2 hover:bg-blue-700">
            Save
          </button>
          <SaveStatusBanner status={status} />
        </div>
      </form>
    </div>
  );
}
