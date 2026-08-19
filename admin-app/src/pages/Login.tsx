import { useState, type FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";

export function Login() {
  const { login } = useAuth();
  const [key, setKey] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    // No dedicated key-validation endpoint exists (every GET is anonymous,
    // so there's nothing free to probe against) — store it and let the
    // first real write 401 if it's wrong, which correctly bounces back here.
    login(key.trim());
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-gray-900 mb-1">Portfolio Admin</h1>
        <p className="text-sm text-gray-500 mb-5">Enter the API key to continue.</p>
        <label className="block mb-4">
          <span className="block text-sm font-medium text-gray-700 mb-1">API key</span>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            autoFocus
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded bg-blue-600 text-white text-sm font-medium py-2 hover:bg-blue-700"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
