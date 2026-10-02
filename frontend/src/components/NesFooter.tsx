export function NesFooter({ fullName }: { fullName?: string }) {
  return (
    <footer className="border-t-4 border-nesBlack bg-nesBlack text-nesWhite">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 font-pixel text-[8px] flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
        <span>© 2026 {(fullName ?? "AYUSH THAPA").toUpperCase()} · NOT AFFILIATED W/ NINTENDO</span>
        <span className="text-nesGold">PRESS ↑↑↓↓←→←→ B A FOR SECRET</span>
      </div>
    </footer>
  );
}
