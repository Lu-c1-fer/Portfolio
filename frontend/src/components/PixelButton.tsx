import type { ButtonHTMLAttributes, ReactNode, MouseEvent } from "react";
import { sfx } from "../lib/sfx";

export type PixelButtonColor = "red" | "green" | "gold" | "black";

const COLOR_CLASSES: Record<PixelButtonColor, string> = {
  red: "bg-nesRed text-nesWhite hover:bg-[#ff3d3a]",
  green: "bg-nesGreen text-nesWhite hover:bg-[#5acf5e]",
  gold: "bg-nesGold text-nesBlack hover:bg-[#ffe347]",
  black: "bg-nesBlack text-nesWhite hover:bg-[#222]",
};

type PixelButtonProps = {
  children?: ReactNode;
  color?: PixelButtonColor;
  className?: string;
  ariaLabel?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color" | "className" | "aria-label">;

export function PixelButton({
  children,
  color = "red",
  onClick,
  className = "",
  type = "button",
  disabled,
  ariaLabel,
  ...rest
}: PixelButtonProps) {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    sfx.play("blip");
    onClick?.(e);
  };
  return (
    <button
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={handleClick}
      className={`pixel-btn ${COLOR_CLASSES[color]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
