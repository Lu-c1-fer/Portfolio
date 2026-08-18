import { useEffect } from "react";
import { sfx } from "../lib/sfx";
import type { Navigate } from "../hooks/useHashRoute";
import { PixelButton } from "../components/PixelButton";

export function NotFound({ navigate }: { navigate: Navigate }) {
  useEffect(() => {
    sfx.play("gameover");
  }, []);

  return (
    <div className="bg-nesBlack min-h-[80vh] py-24 px-4 text-center">
      <div className="font-pixel text-[10px] text-nesGold mb-4">WORLD ?-?</div>
      <h1 className="font-pixel text-[22px] sm:text-[28px] text-nesWhite">GAME OVER</h1>
      <p className="font-body text-[18px] text-nesWhite/70 mt-4 max-w-md mx-auto">
        That page doesn't exist. Could be a broken link. Could be that it hasn't been built yet.
      </p>
      <div className="mt-8">
        <PixelButton color="red" onClick={() => navigate("/")}>◀ B · CONTINUE</PixelButton>
      </div>
    </div>
  );
}
