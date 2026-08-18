import { useCallback, useState } from "react";

export type SetTweak<T> = {
  <K extends keyof T>(key: K, value: T[K]): void;
  (edits: Partial<T>): void;
};

/**
 * Single source of truth for tweak values. setTweak posts `__edit_mode_set_keys`
 * to window.parent — a no-op message to self when this app isn't embedded in a
 * design-tool host iframe (window.parent === window in that case), kept so the
 * protocol still works if it ever is embedded again.
 */
export function useTweaks<T extends Record<string, unknown>>(defaults: T): [T, SetTweak<T>] {
  const [values, setValues] = useState<T>(defaults);

  const setTweak = useCallback((keyOrEdits: unknown, val?: unknown) => {
    const edits = (
      typeof keyOrEdits === "object" && keyOrEdits !== null ? keyOrEdits : { [keyOrEdits as string]: val }
    ) as Partial<T>;
    setValues((prev) => ({ ...prev, ...edits }));
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits }, "*");
  }, []) as SetTweak<T>;

  return [values, setTweak];
}
