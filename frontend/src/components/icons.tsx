const svgStyle = { imageRendering: "pixelated" as const, shapeRendering: "crispEdges" as const };

export function PixelHeart() {
  const pixels: [number, number][] = [
    [1, 1], [2, 1], [4, 1], [5, 1],
    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2],
    [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3],
    [1, 4], [2, 4], [3, 4], [4, 4], [5, 4],
    [2, 5], [3, 5], [4, 5],
    [3, 6],
  ];
  return (
    <svg width="14" height="14" viewBox="0 0 7 7" style={svgStyle} aria-hidden="true">
      {pixels.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="1" height="1" fill="#E52521" />
      ))}
    </svg>
  );
}

export function HpHeart() {
  const pixels: [number, number][] = [
    [1, 1], [2, 1], [4, 1], [5, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2],
    [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4],
    [2, 5], [3, 5], [4, 5], [3, 6],
  ];
  return (
    <svg width="20" height="20" viewBox="0 0 7 7" style={svgStyle} aria-hidden="true">
      {pixels.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="1" height="1" fill="#E52521" />
      ))}
    </svg>
  );
}

export function XpStar() {
  const pixels: [number, number][] = [
    [3, 0], [2, 1], [3, 1], [4, 1], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2],
    [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4],
    [1, 5], [2, 5], [4, 5], [5, 5], [0, 6], [6, 6],
  ];
  return (
    <svg width="20" height="20" viewBox="0 0 7 7" style={svgStyle} aria-hidden="true">
      {pixels.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="1" height="1" fill="#FFD700" />
      ))}
    </svg>
  );
}

export function CoinIcon() {
  const pixels: [number, number][] = [
    [2, 0], [3, 0], [4, 0], [1, 1], [2, 1], [5, 1], [1, 2], [3, 2], [5, 2], [1, 3], [3, 3], [5, 3],
    [1, 4], [3, 4], [5, 4], [1, 5], [2, 5], [5, 5], [2, 6], [3, 6], [4, 6],
  ];
  return (
    <svg width="20" height="20" viewBox="0 0 7 7" style={svgStyle} aria-hidden="true">
      {pixels.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="1" height="1" fill="#FFD700" />
      ))}
    </svg>
  );
}

export function BookIcon() {
  const pixels: [number, number][] = [
    [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [1, 2], [3, 2], [5, 2], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
    [1, 4], [3, 4], [5, 4], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5],
  ];
  return (
    <svg width="20" height="20" viewBox="0 0 7 7" style={svgStyle} aria-hidden="true">
      {pixels.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="1" height="1" fill="#43B047" />
      ))}
    </svg>
  );
}
