import type { ReactNode } from "react";

export type ItemTagKind = "mushroom" | "flower" | "star" | "leaf" | "coin";

const SPRITES: Record<ItemTagKind, { bg: string; fg: string; glyph: string }> = {
  mushroom: { bg: "#E52521", fg: "#fff", glyph: "M" }, // framework
  flower: { bg: "#E52521", fg: "#FFD700", glyph: "F" }, // library
  star: { bg: "#FFD700", fg: "#000", glyph: "*" }, // tool
  leaf: { bg: "#43B047", fg: "#fff", glyph: "L" }, // language
  coin: { bg: "#FFD700", fg: "#A0522D", glyph: "$" }, // service
};

/** Keyword-matches a stack label to a decorative icon "kind". Decoration only —
 * the real tech name is always rendered as the tag's primary text. */
export function classifyStack(label: string): ItemTagKind {
  const l = label.toLowerCase();
  if (/(react|next|express|asp|node|vite)/.test(l)) return "mushroom";
  if (/(zod|jwt|helmet|mailkit|tanstack|claude|api)/.test(l)) return "flower";
  if (/(postgres|sqlite|ef|prisma|convex|clerk)/.test(l)) return "leaf";
  if (/(railway|vercel|aws|render)/.test(l)) return "coin";
  return "star";
}

export function ItemTag({ children, kind = "mushroom" }: { children: ReactNode; kind?: ItemTagKind }) {
  const sprite = SPRITES[kind] ?? SPRITES.mushroom;
  return (
    <span className="inline-flex items-center gap-2 pixel-pill">
      <span className="pixel-pill__icon" style={{ background: sprite.bg, color: sprite.fg }} aria-hidden="true">
        {sprite.glyph}
      </span>
      <span className="font-pixel text-[9px]">{children}</span>
    </span>
  );
}
