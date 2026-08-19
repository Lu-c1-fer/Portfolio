import { useCallback, useEffect, useState } from "react";

export type Navigate = (to: string) => void;

export function useHashRoute(): [string, Navigate] {
  const [route, setRoute] = useState(() => window.location.hash.replace(/^#/, "") || "/");

  useEffect(() => {
    const onHash = () => {
      setRoute(window.location.hash.replace(/^#/, "") || "/");
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = useCallback<Navigate>((to) => {
    if (to === window.location.hash.replace(/^#/, "")) return;
    window.location.hash = to;
  }, []);

  return [route, navigate];
}
