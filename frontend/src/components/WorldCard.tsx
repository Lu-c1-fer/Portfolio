import { sfx } from "../lib/sfx";
import { PixelPanel } from "./PixelPanel";
import { ItemTag, classifyStack } from "./ItemTag";
import type { WorldSummary } from "../lib/types";

function statusClasses(status: string, difficulty: number) {
  const base = status === "In Progress" ? "text-nesGreen" : "text-nesBlack/60";
  // Decorative flourish for the hardest/most notable project — driven by Difficulty,
  // not Status, so the pulse never has to be decoded to learn the real project state.
  return difficulty >= 4 ? `${base} animate-pulse` : base;
}

export function WorldCard({ world, onSelect }: { world: WorldSummary; onSelect: () => void }) {
  return (
    <button onClick={onSelect} onMouseEnter={() => sfx.play("blip")} className="nes-worldcard text-left group">
      <PixelPanel color="white" className="p-4 group-hover:-translate-y-1 transition-transform">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-pixel text-[9px] text-nesRed/70">WORLD {world.world}</span>
          <span className={`font-pixel text-[8px] ${statusClasses(world.status, world.difficulty)}`}>{world.status}</span>
        </div>
        <h3 className="font-pixel text-[13px] sm:text-[14px] text-nesBlack mt-2 leading-tight">{world.title}</h3>
        <p className="font-body text-[16px] text-nesBlack/85 mt-2 leading-snug">{world.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {world.stack.slice(0, 4).map((s) => (
            <ItemTag key={s} kind={classifyStack(s)}>
              {s}
            </ItemTag>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t-4 border-dashed border-nesBlack/15 flex items-center justify-between font-pixel text-[8px]">
          <span className="text-nesBlack/60">BOSS · {world.enemy}</span>
          <span className="text-nesRed">SELECT ▶</span>
        </div>
      </PixelPanel>
    </button>
  );
}
