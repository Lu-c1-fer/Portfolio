import type { CaseStudyBlock } from "./types";

// The ONLY thing in this app that knows how shorthand text becomes blocks.
// Nothing else should parse shorthand directly — call this function and
// treat its output as an opaque CaseStudyBlock[]. That's what keeps it
// swappable later for a richer block-based editor UI without touching save
// logic, API calls, or anything else that consumes case study data.
//
// Shorthand syntax:
//   blank line          paragraph break — each chunk becomes one "p" block
//   "- " prefix          list item — consecutive "- " lines group into one "ul" block
//   ```lang ... ```       fenced code — one "code" block, lang read from the fence
//   !!! tip / !!! warn     optionally "!!! tip: Title" — a "block" callout;
//                           everything until the next blank line is its body
export function parseShorthand(sectionText: string): CaseStudyBlock[] {
  const lines = sectionText.replace(/\r\n/g, "\n").split("\n");
  const blocks: CaseStudyBlock[] = [];

  let paragraphLines: string[] = [];
  let listItems: string[] = [];

  const isBlank = (line: string) => line.trim() === "";

  function flushParagraph() {
    if (paragraphLines.length === 0) return;
    blocks.push({
      type: "p",
      text: paragraphLines.join(" ").trim(),
      items: null,
      lang: null,
      variant: null,
      title: null,
    });
    paragraphLines = [];
  }

  function flushList() {
    if (listItems.length === 0) return;
    blocks.push({
      type: "ul",
      text: null,
      items: [...listItems],
      lang: null,
      variant: null,
      title: null,
    });
    listItems = [];
  }

  const fenceOpenRe = /^```(\w*)\s*$/;
  const fenceCloseRe = /^```\s*$/;
  const calloutRe = /^!!!\s*(tip|warn)\s*(?::\s*(.*))?$/i;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    const fenceMatch = line.match(fenceOpenRe);
    if (fenceMatch) {
      flushParagraph();
      flushList();
      const lang = fenceMatch[1] || null;
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !fenceCloseRe.test(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      // Whether we stopped on a closing fence or ran off the end of the
      // input, emit what was collected — an unterminated fence shouldn't
      // silently discard a user's half-written code block.
      blocks.push({
        type: "code",
        text: codeLines.join("\n"),
        items: null,
        lang,
        variant: null,
        title: null,
      });
      if (i < lines.length) i++; // skip the closing fence line
      continue;
    }

    const calloutMatch = line.match(calloutRe);
    if (calloutMatch) {
      flushParagraph();
      flushList();
      const variant = calloutMatch[1].toLowerCase();
      const title = calloutMatch[2]?.trim() || null;
      const bodyLines: string[] = [];
      i++;
      while (i < lines.length && !isBlank(lines[i])) {
        bodyLines.push(lines[i]);
        i++;
      }
      blocks.push({
        type: "block",
        text: bodyLines.join(" ").trim(),
        items: null,
        lang: null,
        variant,
        title,
      });
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      listItems.push(line.slice(2).trim());
      i++;
      continue;
    }

    if (isBlank(line)) {
      flushParagraph();
      flushList();
      i++;
      continue;
    }

    // Plain text line — ends any active list group, joins the paragraph.
    flushList();
    paragraphLines.push(line.trim());
    i++;
  }

  flushParagraph();
  flushList();

  return blocks;
}
