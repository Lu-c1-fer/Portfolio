import type { ReactNode } from "react";

type Accent = "red" | "gold" | "green" | "blue";

const ACCENT_TEXT: Record<Accent, string> = {
  red: "text-nesRed",
  gold: "text-nesGold",
  green: "text-nesGreen",
  blue: "text-nesBlue",
};

export function StatRow({ icon, label, value, accent = "gold" }: { icon: ReactNode; label: string; value: string; accent?: Accent }) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div className="min-w-0">
        <div className={`font-pixel text-[8px] ${ACCENT_TEXT[accent]}`}>{label}</div>
        <div className="font-body text-[17px] text-nesWhite leading-snug mt-1">{value}</div>
      </div>
    </div>
  );
}
