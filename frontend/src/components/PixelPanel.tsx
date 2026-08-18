import type { ElementType, ComponentPropsWithoutRef, ReactNode } from "react";

export type PixelPanelColor =
  | "white"
  | "black"
  | "red"
  | "green"
  | "blue"
  | "gold"
  | "brown"
  | "sky"
  | "dark";

const COLOR_CLASSES: Record<PixelPanelColor, string> = {
  white: "bg-nesWhite",
  black: "bg-nesBlack text-nesWhite",
  red: "bg-nesRed text-nesWhite",
  green: "bg-nesGreen text-nesWhite",
  blue: "bg-nesBlue text-nesWhite",
  gold: "bg-nesGold text-nesBlack",
  brown: "bg-nesBrown text-nesWhite",
  sky: "bg-nesSky text-nesBlack",
  dark: "bg-[#1a1020] text-nesWhite",
};

type PixelPanelProps<T extends ElementType> = {
  as?: T;
  color?: PixelPanelColor;
  inner?: boolean;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "color" | "className" | "children">;

export function PixelPanel<T extends ElementType = "div">({
  as,
  color = "white",
  inner = false,
  className = "",
  children,
  ...rest
}: PixelPanelProps<T>) {
  const As = (as ?? "div") as ElementType;
  const bg = COLOR_CLASSES[color] ?? COLOR_CLASSES.white;
  return (
    <As
      className={`pixel-panel ${bg} ${inner ? "pixel-panel--inner" : ""} ${className}`}
      {...rest}
    >
      {children}
    </As>
  );
}
