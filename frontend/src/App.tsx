import { useCallback, useEffect, useState } from "react";
import { useHashRoute } from "./hooks/useHashRoute";
import { useKonami } from "./hooks/useKonami";
import { useTweaks } from "./hooks/useTweaks";
import { sfx } from "./lib/sfx";
import { NesHeader } from "./components/NesHeader";
import { NesFooter } from "./components/NesFooter";
import { TweaksPanel, TweakSection, TweakToggle, TweakRadio } from "./components/tweaks/TweaksPanel";
import { Home } from "./pages/Home";
import { Worlds } from "./pages/Worlds";
import { ProjectCaseStudy } from "./pages/ProjectCaseStudy";
import { About } from "./pages/About";
import { Uses } from "./pages/Uses";
import { Resume } from "./pages/Resume";
import { NotFound } from "./pages/NotFound";

type Palette = "overworld" | "underground";

type Tweaks = {
  palette: Palette;
  scanlines: boolean;
  crtCurve: boolean;
  rainbow: boolean;
};

const TWEAK_DEFAULTS: Tweaks = {
  palette: "overworld",
  scanlines: true,
  crtCurve: false,
  rainbow: false,
};

function applyPalette(p: Palette) {
  document.documentElement.dataset.palette = p;
}

function applyFx(t: Tweaks) {
  document.documentElement.dataset.scanlines = t.scanlines ? "on" : "off";
  document.documentElement.dataset.crt = t.crtCurve ? "on" : "off";
  document.documentElement.dataset.rainbow = t.rainbow ? "on" : "off";
}

function App() {
  const [route, navigate] = useHashRoute();
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [sound, setSoundState] = useState(() => sfx.isEnabled());

  useEffect(() => applyPalette(tweaks.palette), [tweaks.palette]);
  useEffect(() => applyFx(tweaks), [tweaks]);

  const setSound = (v: boolean) => {
    sfx.setEnabled(v);
    setSoundState(v);
  };

  const togglePalette = useCallback(() => {
    sfx.play("powerup");
    setTweak("palette", tweaks.palette === "overworld" ? "underground" : "overworld");
  }, [tweaks.palette, setTweak]);

  const openTweaks = useCallback(() => {
    window.postMessage({ type: "__activate_edit_mode" }, window.location.origin);
  }, []);

  useKonami(
    useCallback(() => {
      sfx.play("oneup");
      setTweak("rainbow", true);
      setTimeout(() => setTweak("rainbow", false), 6000);
    }, [setTweak]),
  );

  let page;
  if (route === "/" || route === "") {
    page = <Home navigate={navigate} />;
  } else if (route === "/worlds") {
    page = <Worlds navigate={navigate} />;
  } else if (route.startsWith("/projects/")) {
    const slug = route.replace("/projects/", "");
    page = <ProjectCaseStudy slug={slug} navigate={navigate} />;
  } else if (route === "/about") {
    page = <About navigate={navigate} />;
  } else if (route === "/uses") {
    page = <Uses navigate={navigate} />;
  } else if (route === "/resume") {
    page = <Resume navigate={navigate} />;
  } else {
    page = <NotFound navigate={navigate} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NesHeader
        route={route}
        navigate={navigate}
        sound={sound}
        setSound={setSound}
        onPaletteToggle={togglePalette}
        palette={tweaks.palette}
        onTweaksToggle={openTweaks}
      />
      <main className="flex-1">{page}</main>
      <NesFooter />
      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette">
          <TweakRadio
            value={tweaks.palette}
            onChange={(v) => {
              setTweak("palette", v);
              sfx.play("powerup");
            }}
            options={[
              { value: "overworld", label: "Overworld" },
              { value: "underground", label: "Underground" },
            ]}
          />
        </TweakSection>
        <TweakSection label="Sound effects">
          <TweakToggle value={sound} onChange={setSound} />
        </TweakSection>
        <TweakSection label="Scanlines">
          <TweakToggle value={tweaks.scanlines} onChange={(v) => setTweak("scanlines", v)} />
        </TweakSection>
        <TweakSection label="CRT curve">
          <TweakToggle value={tweaks.crtCurve} onChange={(v) => setTweak("crtCurve", v)} />
        </TweakSection>
        <TweakSection label="Rainbow mode (Konami)">
          <TweakToggle value={tweaks.rainbow} onChange={(v) => setTweak("rainbow", v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

export default App;
