// Original pixel art: dev room (window, poster, bookshelf) + desk + CRT monitor
// with a tiny scrolling Mario-style game world playing inside the screen.

function MiniCloud({ x, y }: { x: number; y: number }) {
  const pixels: [number, number][] = [[1, 1], [2, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [1, 3], [2, 3], [3, 3]];
  return (
    <g transform={`translate(${x}, ${y})`}>
      {pixels.map(([cx, cy], i) => (
        <rect key={i} x={cx} y={cy} width="1" height="1" fill="#fcfcfc" />
      ))}
    </g>
  );
}

function MiniHill({ x, y, small }: { x: number; y: number; small?: boolean }) {
  const w = small ? 10 : 14;
  const h = small ? 6 : 8;
  return (
    <g transform={`translate(${x}, ${y - h})`}>
      <polygon points={`0,${h} ${w / 3},2 ${w / 2},0 ${(2 * w) / 3},2 ${w},${h}`} fill="#43B047" />
      <polygon points={`${w / 3},2 ${w / 2},0 ${w / 2 - 1},2`} fill="#5acf5e" />
    </g>
  );
}

function BrickBlock({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="0" y="0" width="6" height="6" fill="#A0522D" />
      <rect x="0" y="0" width="6" height="1" fill="#0a0a0a" />
      <rect x="0" y="3" width="6" height="1" fill="#0a0a0a" />
      <rect x="2" y="0" width="1" height="3" fill="#0a0a0a" />
      <rect x="4" y="3" width="1" height="3" fill="#0a0a0a" />
    </g>
  );
}

function QuestionBlock({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="0" y="0" width="6" height="6" fill="#FFD700" />
      <rect x="0" y="0" width="6" height="1" fill="#0a0a0a" />
      <rect x="0" y="5" width="6" height="1" fill="#0a0a0a" />
      <rect x="0" y="0" width="1" height="6" fill="#0a0a0a" />
      <rect x="5" y="0" width="1" height="6" fill="#0a0a0a" />
      <rect x="2" y="2" width="2" height="1" fill="#0a0a0a" />
      <rect x="2" y="3" width="1" height="1" fill="#0a0a0a" />
      <rect x="3" y="4" width="1" height="1" fill="#0a0a0a" />
    </g>
  );
}

export function PixelRoomScene() {
  return (
    <svg
      viewBox="0 0 200 120"
      preserveAspectRatio="xMidYMid meet"
      width="100%"
      style={{ imageRendering: "pixelated", shapeRendering: "crispEdges", display: "block", maxHeight: "60vh" }}
      role="img"
      aria-label="Pixel-art scene of a dev's desk with a CRT monitor playing a scrolling platformer"
    >
      {/* WALL */}
      <rect x="0" y="0" width="200" height="86" fill="#1a1428" />
      {/* FLOOR / DESK area */}
      <rect x="0" y="86" width="200" height="34" fill="#0f0a18" />
      <rect x="0" y="86" width="200" height="2" fill="#3a2a55" />

      {/* WINDOW (left) */}
      <g>
        <rect x="10" y="10" width="40" height="30" fill="#0a0a14" />
        <rect x="11" y="11" width="38" height="28" fill="#2a3a5a" />
        <rect x="14" y="14" width="1" height="1" fill="#FFD700" />
        <rect x="22" y="17" width="1" height="1" fill="#fcfcfc" />
        <rect x="35" y="13" width="1" height="1" fill="#FFD700" />
        <rect x="44" y="20" width="1" height="1" fill="#fcfcfc" />
        <rect x="11" y="30" width="6" height="9" fill="#15101e" />
        <rect x="17" y="26" width="4" height="13" fill="#15101e" />
        <rect x="21" y="32" width="8" height="7" fill="#15101e" />
        <rect x="29" y="24" width="5" height="15" fill="#15101e" />
        <rect x="34" y="29" width="9" height="10" fill="#15101e" />
        <rect x="43" y="27" width="6" height="12" fill="#15101e" />
        <rect x="19" y="29" width="1" height="1" fill="#FFD700" />
        <rect x="31" y="26" width="1" height="1" fill="#FFD700" />
        <rect x="36" y="32" width="1" height="1" fill="#FFD700" />
        <rect x="45" y="30" width="1" height="1" fill="#43B047" />
        <rect x="10" y="10" width="40" height="2" fill="#0a0a0a" />
        <rect x="10" y="38" width="40" height="2" fill="#0a0a0a" />
        <rect x="10" y="10" width="2" height="30" fill="#0a0a0a" />
        <rect x="48" y="10" width="2" height="30" fill="#0a0a0a" />
        <rect x="29" y="10" width="2" height="30" fill="#0a0a0a" />
        <rect x="10" y="24" width="40" height="2" fill="#0a0a0a" />
        <rect x="8" y="40" width="44" height="2" fill="#3a2a55" />
      </g>

      {/* POSTER */}
      <g>
        <rect x="86" y="6" width="28" height="20" fill="#0a0a0a" />
        <rect x="87" y="7" width="26" height="18" fill="#E52521" />
        <rect x="90" y="10" width="20" height="2" fill="#FFD700" />
        <rect x="90" y="14" width="20" height="2" fill="#fcfcfc" />
        <rect x="90" y="18" width="20" height="2" fill="#43B047" />
        <rect x="90" y="22" width="20" height="1" fill="#fcfcfc" />
      </g>

      {/* BOOKSHELF */}
      <g>
        <rect x="150" y="10" width="44" height="60" fill="#0a0a0a" />
        <rect x="151" y="11" width="42" height="58" fill="#2a1a30" />
        <rect x="151" y="22" width="42" height="2" fill="#0a0a0a" />
        <rect x="151" y="36" width="42" height="2" fill="#0a0a0a" />
        <rect x="151" y="50" width="42" height="2" fill="#0a0a0a" />
        {(
          [
            [152, 12, 3, 10, "#E52521"], [155, 12, 2, 10, "#43B047"], [157, 12, 3, 10, "#5C94FC"], [160, 13, 2, 9, "#FFD700"],
            [162, 12, 4, 10, "#A0522D"], [166, 13, 2, 9, "#fcfcfc"], [168, 12, 3, 10, "#E52521"], [171, 12, 3, 10, "#5C94FC"],
            [174, 13, 2, 9, "#43B047"], [176, 12, 4, 10, "#FFD700"], [180, 12, 3, 10, "#E52521"], [183, 13, 2, 9, "#fcfcfc"],
            [185, 12, 4, 10, "#5C94FC"], [189, 12, 3, 10, "#43B047"],
            [152, 26, 2, 10, "#5C94FC"], [154, 26, 4, 10, "#FFD700"], [158, 26, 2, 10, "#E52521"], [160, 26, 3, 10, "#fcfcfc"],
            [163, 26, 3, 10, "#43B047"], [166, 26, 2, 10, "#A0522D"], [168, 26, 4, 10, "#5C94FC"], [172, 26, 3, 10, "#E52521"],
            [175, 26, 2, 10, "#FFD700"], [177, 27, 3, 9, "#fcfcfc"], [180, 26, 3, 10, "#43B047"], [183, 26, 4, 10, "#A0522D"],
            [187, 26, 2, 10, "#E52521"], [189, 26, 3, 10, "#5C94FC"],
            [152, 40, 3, 10, "#FFD700"], [155, 40, 2, 10, "#E52521"], [157, 40, 4, 10, "#43B047"], [161, 40, 2, 10, "#5C94FC"],
            [163, 40, 3, 10, "#fcfcfc"], [166, 40, 3, 10, "#E52521"], [169, 40, 2, 10, "#FFD700"], [171, 40, 4, 10, "#5C94FC"],
            [175, 40, 3, 10, "#A0522D"], [178, 40, 2, 10, "#fcfcfc"], [180, 40, 3, 10, "#43B047"], [183, 40, 4, 10, "#E52521"],
            [187, 40, 2, 10, "#FFD700"], [189, 41, 3, 9, "#5C94FC"],
            [152, 54, 4, 10, "#43B047"], [156, 54, 2, 10, "#FFD700"], [158, 54, 3, 10, "#fcfcfc"], [161, 54, 3, 10, "#E52521"],
            [164, 54, 2, 10, "#5C94FC"], [166, 54, 4, 10, "#A0522D"], [170, 54, 2, 10, "#FFD700"], [172, 55, 3, 9, "#43B047"],
            [175, 54, 3, 10, "#E52521"], [178, 54, 2, 10, "#fcfcfc"], [180, 54, 4, 10, "#5C94FC"], [184, 54, 3, 10, "#FFD700"],
            [187, 54, 2, 10, "#E52521"], [189, 54, 3, 10, "#43B047"],
          ] as [number, number, number, number, string][]
        ).map(([x, y, w, h, c], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill={c} />
        ))}
        <rect x="170" y="4" width="6" height="6" fill="#A0522D" />
        <rect x="171" y="0" width="2" height="4" fill="#43B047" />
        <rect x="174" y="1" width="2" height="3" fill="#43B047" />
      </g>

      {/* DESK LAMP glow */}
      <ellipse cx="100" cy="80" rx="55" ry="14" fill="#FFD700" opacity="0.06" />
      <ellipse cx="100" cy="80" rx="30" ry="8" fill="#FFD700" opacity="0.1" />

      {/* DESK SURFACE */}
      <rect x="56" y="100" width="100" height="14" fill="#1a0f24" />
      <rect x="56" y="100" width="100" height="2" fill="#3a2a55" />

      {/* MONITOR */}
      <g>
        <rect x="68" y="48" width="64" height="48" fill="#0a0a0a" />
        <rect x="70" y="50" width="60" height="44" fill="#3a3a3a" />
        <rect x="72" y="52" width="56" height="40" fill="#1a1a1a" />
        <rect x="124" y="89" width="2" height="2" fill="#43B047" />
        <rect x="96" y="91" width="8" height="2" fill="#0a0a0a" />

        <g clipPath="url(#scrn)">
          <rect x="74" y="54" width="52" height="36" fill="#5C94FC" />
          <rect x="74" y="84" width="52" height="6" fill="#A0522D" />
          {Array.from({ length: 14 }).map((_, i) => (
            <rect key={i} x={74 + i * 4} y="84" width="1" height="6" fill="#7a3a13" />
          ))}
          <rect x="74" y="84" width="52" height="1" fill="#43B047" />

          <g className="nes-monitor-scroll">
            {[0, 52].map((dx, k) => (
              <g key={k} transform={`translate(${74 + dx}, 0)`}>
                <MiniCloud x={4} y={58} />
                <MiniCloud x={26} y={62} />
                <MiniCloud x={42} y={56} />
                <MiniHill x={2} y={76} />
                <MiniHill x={28} y={78} small />
                <BrickBlock x={14} y={70} />
                <QuestionBlock x={20} y={70} />
                <BrickBlock x={26} y={70} />
                <QuestionBlock x={40} y={66} />
              </g>
            ))}
          </g>

          <g>
            <rect x="98" y="78" width="5" height="2" fill="#1a1a1a" />
            <rect x="97" y="80" width="7" height="2" fill="#1a1a1a" />
            <rect x="99" y="82" width="3" height="1" fill="#FFD700" />
            <rect x="97" y="83" width="7" height="2" fill="#5C94FC" />
            <rect x="98" y="85" width="2" height="1" fill="#0a0a0a" />
            <rect x="101" y="85" width="2" height="1" fill="#0a0a0a" />
          </g>

          <polygon points="74,54 84,54 76,64 74,64" fill="#fcfcfc" opacity="0.08" />
        </g>

        <defs>
          <clipPath id="scrn">
            <rect x="74" y="54" width="52" height="36" />
          </clipPath>
        </defs>

        <rect x="94" y="96" width="12" height="4" fill="#1a1a1a" />
        <rect x="86" y="100" width="28" height="2" fill="#0a0a0a" />
      </g>

      {/* DESK LAMP body */}
      <g>
        <rect x="58" y="92" width="2" height="10" fill="#0a0a0a" />
        <rect x="56" y="100" width="6" height="2" fill="#0a0a0a" />
        <polygon points="58,82 68,82 64,92 58,92" fill="#E52521" />
        <rect x="61" y="91" width="2" height="2" fill="#FFD700" />
      </g>

      {/* COFFEE MUG */}
      <g>
        <rect x="138" y="92" width="10" height="8" fill="#fcfcfc" />
        <rect x="138" y="92" width="10" height="2" fill="#A0522D" />
        <rect x="148" y="94" width="2" height="4" fill="#fcfcfc" />
        <rect x="140" y="88" width="1" height="2" fill="#fcfcfc" opacity="0.5" />
        <rect x="143" y="86" width="1" height="2" fill="#fcfcfc" opacity="0.5" />
        <rect x="145" y="88" width="1" height="2" fill="#fcfcfc" opacity="0.5" />
      </g>

      {/* KEYBOARD */}
      <g>
        <rect x="80" y="104" width="40" height="4" fill="#1a1a1a" />
        <rect x="82" y="105" width="36" height="2" fill="#3a3a3a" />
        {Array.from({ length: 9 }).map((_, i) => (
          <rect key={i} x={84 + i * 4} y="105" width="2" height="2" fill="#0a0a0a" />
        ))}
      </g>

      {/* dust motes */}
      {(
        [[40, 50], [88, 42], [124, 46], [60, 68]] as [number, number][]
      ).map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="1" height="1" fill="#fcfcfc" opacity="0.3" />
      ))}
    </svg>
  );
}
