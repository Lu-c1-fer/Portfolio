import type { Navigate } from "../hooks/useHashRoute";

export function NotFound({ navigate }: { navigate: Navigate }) {
  return (
    <div className="text-center py-16">
      <p className="text-gray-500 mb-4">Page not found.</p>
      <button onClick={() => navigate("/")} className="text-sm text-blue-700 hover:underline">
        Back to dashboard
      </button>
    </div>
  );
}
