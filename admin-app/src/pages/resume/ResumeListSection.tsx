import { useState, type ReactNode } from "react";
import { inputClass } from "../../components/FormField";
import { ConfirmDeleteButton } from "../../components/ConfirmDeleteButton";

export type FieldConfig<TUpsert> = {
  key: keyof TUpsert & string;
  label: string;
  type?: "text" | "textarea" | "list"; // list = one item per line, e.g. bullets
};

type SubResourceApi<TRead, TUpsert> = {
  create: (siteSlug: string, dto: TUpsert) => Promise<TRead>;
  update: (siteSlug: string, id: number, dto: TUpsert) => Promise<TRead>;
  remove: (siteSlug: string, id: number) => Promise<void>;
};

type Orderable = { id: number; order: number };

/**
 * Generic reorderable CRUD list, parametrized over one of the three resume
 * sub-resources (work history / education / skills) — one component, used
 * three times with different field configs, instead of three near-identical
 * page files.
 *
 * Reorder = swap `order` between the moved row and its neighbor, PUT both,
 * then let the caller refetch (onChanged). Add/edit = inline row editing,
 * one row open at a time — no modal, matches "cheap to build."
 */
export function ResumeListSection<TRead extends Orderable, TUpsert extends { order: number }>({
  title,
  siteSlug,
  entries,
  api,
  fields,
  renderSummary,
  emptyUpsert,
  toUpsert,
  onChanged,
}: {
  title: string;
  siteSlug: string;
  entries: TRead[];
  api: SubResourceApi<TRead, TUpsert>;
  fields: FieldConfig<TUpsert>[];
  renderSummary: (entry: TRead) => ReactNode;
  emptyUpsert: TUpsert;
  toUpsert: (entry: TRead) => TUpsert;
  onChanged: () => void;
}) {
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [draft, setDraft] = useState<TUpsert>(emptyUpsert);
  const [busy, setBusy] = useState(false);

  const sorted = [...entries].sort((a, b) => a.order - b.order);

  const startEdit = (entry: TRead) => {
    setEditingId(entry.id);
    setDraft(toUpsert(entry));
  };

  const startAdd = () => {
    const minOrder = sorted.length ? Math.min(...sorted.map((e) => e.order)) - 1 : 0;
    setEditingId("new");
    setDraft({ ...emptyUpsert, order: minOrder });
  };

  const cancel = () => {
    setEditingId(null);
    setDraft(emptyUpsert);
  };

  const save = async () => {
    setBusy(true);
    try {
      if (editingId === "new") {
        await api.create(siteSlug, draft);
      } else if (editingId !== null) {
        await api.update(siteSlug, editingId, draft);
      }
      setEditingId(null);
      onChanged();
    } catch (err) {
      alert(`Save failed: ${err}`);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: number) => {
    setBusy(true);
    try {
      await api.remove(siteSlug, id);
      onChanged();
    } catch (err) {
      alert(`Delete failed: ${err}`);
    } finally {
      setBusy(false);
    }
  };

  const move = async (entry: TRead, direction: -1 | 1) => {
    const idx = sorted.findIndex((e) => e.id === entry.id);
    const target = sorted[idx + direction];
    if (!target) return;
    setBusy(true);
    try {
      await Promise.all([
        api.update(siteSlug, entry.id, { ...toUpsert(entry), order: target.order }),
        api.update(siteSlug, target.id, { ...toUpsert(target), order: entry.order }),
      ]);
      onChanged();
    } catch (err) {
      alert(`Reorder failed: ${err}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-medium text-gray-900">{title}</h2>
        {editingId === null && (
          <button type="button" onClick={startAdd} className="text-sm text-blue-700 hover:underline">
            + Add
          </button>
        )}
      </div>
      <div className="space-y-2">
        {editingId === "new" && <EditRow fields={fields} draft={draft} setDraft={setDraft} onSave={save} onCancel={cancel} busy={busy} />}
        {sorted.map((entry, i) => (
          <div key={entry.id}>
            {editingId === entry.id ? (
              <EditRow fields={fields} draft={draft} setDraft={setDraft} onSave={save} onCancel={cancel} busy={busy} />
            ) : (
              <div className="flex items-center justify-between gap-2 py-1.5 border-t border-gray-100 first:border-t-0">
                <div className="text-sm text-gray-800 flex-1">{renderSummary(entry)}</div>
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <button
                    type="button"
                    disabled={i === 0 || busy}
                    onClick={() => move(entry, -1)}
                    className="text-sm text-gray-500 disabled:opacity-30 hover:text-gray-900"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={i === sorted.length - 1 || busy}
                    onClick={() => move(entry, 1)}
                    className="text-sm text-gray-500 disabled:opacity-30 hover:text-gray-900"
                  >
                    ↓
                  </button>
                  <button type="button" onClick={() => startEdit(entry)} className="text-sm text-blue-700 hover:underline">
                    Edit
                  </button>
                  <ConfirmDeleteButton onDelete={() => remove(entry.id)} />
                </div>
              </div>
            )}
          </div>
        ))}
        {sorted.length === 0 && editingId !== "new" && <p className="text-sm text-gray-400 py-2">Nothing yet.</p>}
      </div>
    </div>
  );
}

function EditRow<TUpsert extends { order: number }>({
  fields,
  draft,
  setDraft,
  onSave,
  onCancel,
  busy,
}: {
  fields: FieldConfig<TUpsert>[];
  draft: TUpsert;
  setDraft: (d: TUpsert) => void;
  onSave: () => void;
  onCancel: () => void;
  busy: boolean;
}) {
  return (
    <div className="border border-blue-200 bg-blue-50/40 rounded p-3 space-y-2">
      {fields.map((f) => {
        const value = draft[f.key];
        return (
          <label key={f.key} className="block">
            <span className="block text-xs font-medium text-gray-600 mb-0.5">{f.label}</span>
            {f.type === "textarea" ? (
              <textarea
                className={inputClass}
                rows={2}
                value={(value as string) ?? ""}
                onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
              />
            ) : f.type === "list" ? (
              <textarea
                className={inputClass}
                rows={2}
                value={((value as string[]) ?? []).join("\n")}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    [f.key]: e.target.value
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="One per line"
              />
            ) : (
              <input
                className={inputClass}
                value={(value as string) ?? ""}
                onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
              />
            )}
          </label>
        );
      })}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          disabled={busy}
          onClick={onSave}
          className="rounded bg-blue-600 text-white text-xs font-medium px-3 py-1.5 hover:bg-blue-700"
        >
          Save
        </button>
        <button type="button" disabled={busy} onClick={onCancel} className="text-xs text-gray-600 hover:underline">
          Cancel
        </button>
      </div>
    </div>
  );
}
