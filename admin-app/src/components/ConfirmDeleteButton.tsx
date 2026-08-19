import { useState } from "react";

/** Requires a second click before firing onDelete — cheap "are you sure" without a modal. */
export function ConfirmDeleteButton({ onDelete, label = "Delete" }: { onDelete: () => void; label?: string }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1">
        <button
          type="button"
          onClick={() => {
            setConfirming(false);
            onDelete();
          }}
          className="text-sm text-red-700 font-semibold hover:underline"
        >
          Confirm?
        </button>
        <button type="button" onClick={() => setConfirming(false)} className="text-sm text-gray-500 hover:underline">
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button type="button" onClick={() => setConfirming(true)} className="text-sm text-red-600 hover:underline">
      {label}
    </button>
  );
}
