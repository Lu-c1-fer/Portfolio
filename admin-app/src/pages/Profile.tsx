import { useEffect, useState, type FormEvent } from "react";
import { useSite } from "../hooks/useSite";
import { getProfile, updateProfile } from "../lib/api";
import type { ProfileUpsert } from "../lib/types";
import { FormField, inputClass, textareaClass } from "../components/FormField";
import { SaveStatusBanner, type SaveStatus } from "../components/SaveStatusBanner";

const BLANK: ProfileUpsert = { name: "", fullName: "", tagline: "", bio: "" };

export function ProfilePage() {
  const { siteSlug } = useSite();
  const [form, setForm] = useState<ProfileUpsert>(BLANK);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SaveStatus>({ state: "idle" });

  useEffect(() => {
    setLoading(true);
    getProfile(siteSlug)
      .then(setForm)
      .catch((err) => setStatus({ state: "error", message: String(err) }))
      .finally(() => setLoading(false));
  }, [siteSlug]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ state: "saving" });
    try {
      await updateProfile(siteSlug, form);
      setStatus({ state: "saved" });
    } catch (err) {
      setStatus({ state: "error", message: String(err) });
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Loading…</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Profile</h1>
      <form onSubmit={submit} className="space-y-4 bg-white border border-gray-200 rounded-lg p-6">
        <FormField label="Name" hint="Short display name, e.g. AYUSH">
          <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </FormField>
        <FormField label="Full name">
          <input
            className={inputClass}
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />
        </FormField>
        <FormField label="Tagline">
          <input
            className={inputClass}
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            required
          />
        </FormField>
        <FormField label="Bio">
          <textarea className={textareaClass} rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} required />
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
