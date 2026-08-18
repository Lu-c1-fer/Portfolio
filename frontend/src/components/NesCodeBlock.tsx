import { useMemo, useState } from "react";
import { sfx } from "../lib/sfx";

// Single-pass tokenizer: comment | string | keyword, matched in that priority order.
// Sequential string.replace() passes would re-scan HTML already injected by an earlier
// pass (e.g. the keyword regex matching the literal word "class" inside a `class="tok-s"`
// attribute it just wrote), corrupting the markup — this avoids that by only ever
// scanning the original source text.
const TOKEN_RE =
  /(\/\/.*$)|("[^"]*"|'[^']*'|`[^`]*`)|\b(function|const|let|var|return|if|else|import|from|export|default|new|class|public|private|static|async|await|for|while|interface|type)\b/gm;

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightLine(line: string): string {
  let html = "";
  let lastIndex = 0;
  for (const match of line.matchAll(TOKEN_RE)) {
    const [full, comment, str, keyword] = match;
    const index = match.index ?? 0;
    html += escapeHtml(line.slice(lastIndex, index));
    if (comment) html += `<span class="tok-c">${escapeHtml(comment)}</span>`;
    else if (str) html += `<span class="tok-s">${escapeHtml(str)}</span>`;
    else if (keyword) html += `<span class="tok-k">${escapeHtml(keyword)}</span>`;
    lastIndex = index + full.length;
  }
  html += escapeHtml(line.slice(lastIndex));
  return html || "&nbsp;";
}

function highlight(code: string) {
  return code.split("\n").map((line, i) => ({ key: i, __html: highlightLine(line) }));
}

export function NesCodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(code);
    sfx.play("coin");
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const lines = useMemo(() => highlight(code), [code]);

  return (
    <div className="my-5 pixel-codeblock">
      <div className="pixel-codeblock__bar font-pixel text-[8px]">
        <span>{lang.toUpperCase()}</span>
        <button onClick={copy} className="hover:text-nesGold">
          {copied ? "✓ COPIED" : "COPY"}
        </button>
      </div>
      <pre className="pixel-codeblock__body">
        <code>
          {lines.map((line) => (
            <div key={line.key} dangerouslySetInnerHTML={{ __html: line.__html }} />
          ))}
        </code>
      </pre>
    </div>
  );
}
