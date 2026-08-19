import { NesCallout } from "./NesCallout";
import { NesCodeBlock } from "./NesCodeBlock";
import type { CaseStudyBlock } from "../lib/types";

// Small block-type dispatcher, mirroring the public frontend's private
// NesBlock (frontend/src/pages/ProjectCaseStudy.tsx) so the preview looks
// like the real site. That function isn't exported/reusable as-is, so this
// ~15-line switch is a necessary small duplication — NesCodeBlock/NesCallout
// themselves are the actually-reused pieces.
export function CaseStudyBlockPreview({ blocks }: { blocks: CaseStudyBlock[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded p-4">
      {blocks.map((block, i) => (
        <CaseStudyBlockPreviewItem key={i} block={block} />
      ))}
      {blocks.length === 0 && <p className="text-sm text-gray-400 italic">Nothing parsed yet.</p>}
    </div>
  );
}

function CaseStudyBlockPreviewItem({ block }: { block: CaseStudyBlock }) {
  switch (block.type) {
    case "p":
      return <p className="my-3 font-body text-[17px] text-nesBlack/90 leading-[1.7]">{block.text}</p>;
    case "ul":
      return (
        <ul className="my-3 space-y-2">
          {(block.items ?? []).map((it, i) => (
            <li key={i} className="font-body text-[17px] text-nesBlack/90 leading-snug flex gap-3">
              <span className="text-nesRed font-pixel text-[12px] mt-0.5">▸</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "code":
      return <NesCodeBlock lang={block.lang ?? "text"} code={block.text ?? ""} />;
    case "block":
      return (
        <NesCallout variant={block.variant ?? "tip"} title={block.title}>
          {block.text}
        </NesCallout>
      );
    default:
      return null;
  }
}
