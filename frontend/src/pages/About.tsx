import type { Navigate } from "../hooks/useHashRoute";
import { PixelPanel } from "../components/PixelPanel";
import { PixelButton } from "../components/PixelButton";

export function About({ navigate }: { navigate: Navigate }) {
  return (
    <div className="bg-nesSky min-h-[80vh] py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <PixelButton color="black" onClick={() => navigate("/")}>◀ MAP</PixelButton>

        <PixelPanel color="white" className="p-5 sm:p-6 mt-6">
          <h1 className="font-pixel text-[16px] text-nesBlack">ABOUT</h1>
          <div className="mt-5 space-y-4 font-body text-[17px] text-nesBlack/90 leading-[1.75]">
            <p>
              I'm Ayush. Twenty-two, BIT graduate, currently in Sydney by way of Kathmandu. I write code for a
              living, on weekends, and sometimes in my sleep when the bug is bad enough.
            </p>
            <p>
              Started on the JavaScript side — PERN stack, the usual story. Then I picked up C# because a friend
              needed an ASP.NET Core API and I figured how hard could it be. The honest answer: not very, once you
              stop fighting it. The .NET tooling is genuinely impressive in a way I wasn't expecting.
            </p>
            <p>
              In May 2026 I started an internship at{" "}
              <span className="font-pixel text-[10px] text-nesRed">YOUNG LOGIX</span>, on a Next.js / Convex / Clerk
              stack. Got the offer after building a domain-tracker MVP live during the technical interview with the
              MD. No idea how the code looked at the end. I do know it ran.
            </p>

            <h2 className="font-pixel text-[12px] text-nesRed pt-3">HOW I WORK</h2>
            <p>
              I like writing things down. Half the case studies on this site exist because I wanted to remember
              what broke, so I'd recognize it next time. The other half exist because the thinking is the
              interesting part — anyone can show you the finished thing.
            </p>
            <p>
              I'm not a "passionate developer who loves clean code." I'm a person who finds the work interesting on
              most days, frustrating on the others, and worth doing either way.
            </p>

            <h2 className="font-pixel text-[12px] text-nesGreen pt-3">CURRENTLY GOOD AT</h2>
            <ul className="space-y-1.5 pl-1">
              {[
                "TypeScript and the React ecosystem",
                "Postgres, schema design, the SQL that matters daily",
                "ASP.NET Core 8, EF Core, controller/service/DTO patterns",
                "Reading my own logs",
              ].map((it, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-nesGreen font-pixel text-[11px] mt-0.5">▸</span>
                  {it}
                </li>
              ))}
            </ul>

            <h2 className="font-pixel text-[12px] text-nesRed pt-3">CURRENTLY BAD AT</h2>
            <ul className="space-y-1.5 pl-1">
              {[
                "Estimating how long anything takes. Off by 2x, every time.",
                "Frontend animation. I can do it, I don't enjoy it.",
                "Saying no to scope creep on personal projects.",
                "Reading other people's logs.",
              ].map((it, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-nesRed font-pixel text-[11px] mt-0.5">▸</span>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </PixelPanel>
      </div>
    </div>
  );
}
