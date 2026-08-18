import type { ReactNode } from "react";

export function NesCallout({ variant = "tip", title, children }: { variant?: string; title?: string | null; children: ReactNode }) {
  const isTip = variant === "tip";
  return (
    <div className="pixel-callout">
      <div className={`pixel-callout__glyph font-pixel ${isTip ? "bg-nesGold text-nesBlack" : "bg-nesRed text-nesWhite"}`}>
        {title || (isTip ? "?" : "!")}
      </div>
      <div className="pixel-callout__body">{children}</div>
    </div>
  );
}
