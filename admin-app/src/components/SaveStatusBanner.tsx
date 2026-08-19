export type SaveStatus = { state: "idle" } | { state: "saving" } | { state: "saved" } | { state: "error"; message: string };

export function SaveStatusBanner({ status }: { status: SaveStatus }) {
  if (status.state === "idle") return null;
  if (status.state === "saving") return <p className="text-sm text-gray-500">Saving…</p>;
  if (status.state === "saved") return <p className="text-sm text-green-700">Saved.</p>;
  return <p className="text-sm text-red-700">Error: {status.message}</p>;
}
