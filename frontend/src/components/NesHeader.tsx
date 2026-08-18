import type { MouseEvent } from "react";
import { sfx } from "../lib/sfx";
import { PixelHeart } from "./icons";
import type { Navigate } from "../hooks/useHashRoute";

const LINKS = [
  { href: "/", label: "HOME" },
  { href: "/worlds", label: "WORLDS" },
  { href: "/about", label: "ABOUT" },
  { href: "/resume", label: "RESUME" },
  { href: "/uses", label: "GEAR" },
];

type NesHeaderProps = {
  route: string;
  navigate: Navigate;
  sound: boolean;
  setSound: (v: boolean) => void;
  onPaletteToggle: () => void;
  palette: string;
  onTweaksToggle: () => void;
};

export function NesHeader({ route, navigate, sound, setSound, onPaletteToggle, palette, onTweaksToggle }: NesHeaderProps) {
  const isActive = (href: string) => (href === "/" ? route === "/" : route.startsWith(href));

  const go = (href: string) => (e: MouseEvent) => {
    e.preventDefault();
    navigate(href);
  };

  return (
    <header className="nes-header">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <a href="/" onClick={go("/")} className="font-pixel text-[10px] text-nesWhite hover:text-nesGold flex items-center gap-2">
          <PixelHeart /> AYUSH.DEV
        </a>
        <nav className="hidden sm:flex items-center gap-1">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={go(l.href)}
              onMouseEnter={() => sfx.play("blip")}
              className={`nes-navlink font-pixel text-[9px] ${isActive(l.href) ? "nes-navlink--active" : ""}`}
            >
              {isActive(l.href) ? <span className="nes-pointer">▶</span> : <span className="nes-pointer-spacer"> </span>}
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            aria-label={palette === "overworld" ? "Switch to underground" : "Switch to overworld"}
            onClick={onPaletteToggle}
            className="nes-iconbtn font-pixel text-[8px]"
            title="Toggle palette"
          >
            {palette === "overworld" ? "DAY" : "NITE"}
          </button>
          <button
            aria-label={sound ? "Mute sound" : "Enable sound"}
            onClick={() => setSound(!sound)}
            className="nes-iconbtn font-pixel text-[8px]"
            title="Sound"
          >
            {sound ? "SFX:ON" : "SFX:OFF"}
          </button>
          <button aria-label="Open tweaks" onClick={onTweaksToggle} className="nes-iconbtn font-pixel text-[8px]" title="Tweaks">
            ⚙
          </button>
        </div>
      </div>
      <nav className="sm:hidden flex items-center justify-around border-t-4 border-nesBlack bg-nesBlack">
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={go(l.href)}
            className={`nes-navlink nes-navlink--mobile font-pixel text-[8px] ${isActive(l.href) ? "nes-navlink--active" : ""}`}
          >
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
