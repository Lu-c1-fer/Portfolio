import { useEffect, useState } from "react";
import { sfx } from "../lib/sfx";
import { getNowStatus, getProfile, getProjects } from "../lib/api";
import type { NowStatus, Profile, WorldSummary } from "../lib/types";
import type { Navigate } from "../hooks/useHashRoute";
import { PixelPanel } from "../components/PixelPanel";
import { PixelRoomScene } from "../components/PixelRoomScene";
import { WorldCard } from "../components/WorldCard";
import { StatRow } from "../components/StatRow";
import { ContactForm } from "../components/ContactForm";
import { HpHeart, XpStar, CoinIcon, BookIcon } from "../components/icons";

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; profile: Profile; now: NowStatus; worlds: WorldSummary[] };

export function Home({ navigate }: { navigate: Navigate }) {
  const [data, setData] = useState<LoadState>({ status: "loading" });
  const [pressStartVisible, setPressStartVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getProfile(), getNowStatus(), getProjects()])
      .then(([profile, now, worlds]) => {
        if (!cancelled) setData({ status: "ready", profile, now, worlds });
      })
      .catch(() => {
        if (!cancelled) setData({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setPressStartVisible((v) => !v), 600);
    return () => clearInterval(id);
  }, []);

  const scrollToWorlds = () => {
    sfx.play("jump");
    document.getElementById("worlds")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="nes-page-home">
      {/* HERO */}
      <section className="nes-room-band">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-8 pb-10">
          <div className="text-center">
            <h1 className="nes-bigtitle font-pixel">
              <span className="nes-bigtitle__shadow">AYUSH</span>
              <span className="nes-bigtitle__main">AYUSH</span>
            </h1>
            <p className="font-pixel text-[10px] sm:text-[12px] text-nesGold mt-5 leading-relaxed">
              FULL-STACK DEVELOPER · SYDNEY VIA KATHMANDU
            </p>
            <p className="font-body text-[18px] sm:text-[20px] text-nesWhite mt-3 max-w-xl mx-auto leading-snug">
              PERN background. Recently picked up C# and ASP.NET Core. Starting at Young Logix on May 19, 2026. Mostly a
              place to write down what I built and what broke.
            </p>

            <button
              onClick={scrollToWorlds}
              className={`mt-6 font-pixel text-[11px] sm:text-[13px] inline-flex items-center gap-2 ${pressStartVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-100`}
              aria-label="Press start to view projects"
            >
              <span className="text-nesRed">▶</span>
              <span className="text-nesGold">PRESS START</span>
            </button>

            <div className="mt-2 flex items-center justify-center gap-4 font-pixel text-[8px] text-nesWhite/60">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/about");
                }}
                className="hover:text-nesRed"
              >
                — ABOUT
              </a>
              <span>·</span>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="hover:text-nesRed"
              >
                CONTACT —
              </a>
            </div>
          </div>

          <div className="mt-8 nes-scene-wrap">
            <PixelRoomScene />
          </div>
        </div>
      </section>

      {/* STATUS PANEL */}
      <section className="bg-nesBlack -mt-2 pt-12 pb-12 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-pixel text-nesWhite text-[12px] mb-4">— STATUS —</h2>
          <PixelPanel color="black" className="p-5 sm:p-6">
            {data.status === "loading" && <p className="font-pixel text-[9px] text-nesWhite/60">LOADING SAVE FILE…</p>}
            {data.status === "error" && (
              <p className="font-pixel text-[9px] text-nesRed">
                Couldn't reach the API. Make sure the backend is running.
              </p>
            )}
            {data.status === "ready" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <StatRow icon={<HpHeart />} label={`${data.now.hpLabel}`} value={data.now.hpValue} accent="red" />
                  <StatRow icon={<XpStar />} label={`${data.now.xpLabel}`} value={data.now.xpValue} accent="gold" />
                  <StatRow icon={<CoinIcon />} label={`${data.now.coinsLabel}`} value={data.now.coinsValue} accent="gold" />
                  <StatRow icon={<BookIcon />} label={`${data.now.starLabel}`} value={data.now.starValue} accent="green" />
                </div>
                <div className="mt-5 pt-4 border-t-4 border-dashed border-nesWhite/20 font-pixel text-[8px] text-nesWhite/60">
                  SAVE FILE UPDATED {data.now.updatedDate}
                </div>
              </>
            )}
          </PixelPanel>
        </div>
      </section>

      {/* WORLDS / PROJECTS */}
      <section id="worlds" className="bg-nesSky py-14 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-pixel text-nesBlack text-[12px] sm:text-[14px]">PROJECTS</h2>
            {data.status === "ready" && (
              <span className="font-pixel text-[8px] text-nesBlack/70">{String(data.worlds.length).padStart(2, "0")} / {String(data.worlds.length).padStart(2, "0")}</span>
            )}
          </div>
          {data.status === "loading" && <p className="font-pixel text-[9px] text-nesBlack/60">LOADING…</p>}
          {data.status === "error" && <p className="font-pixel text-[9px] text-nesRed">Couldn't load projects.</p>}
          {data.status === "ready" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {data.worlds.map((w) => (
                <WorldCard
                  key={w.slug}
                  world={w}
                  onSelect={() => {
                    sfx.play("coin");
                    navigate(`/projects/${w.slug}`);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-nesBlack py-14 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-pixel text-nesWhite text-[12px] mb-4">CONTACT</h2>
          <PixelPanel color="white" className="p-5">
            <ContactForm />
          </PixelPanel>
          <p className="font-pixel text-[8px] text-nesWhite/60 mt-4 text-center">POST /api/contact · validated server-side</p>
        </div>
      </section>
    </div>
  );
}
