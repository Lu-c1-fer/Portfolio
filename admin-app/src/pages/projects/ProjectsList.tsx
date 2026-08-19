import { useEffect, useState } from "react";
import type { Navigate } from "../../hooks/useHashRoute";
import { useSite } from "../../hooks/useSite";
import { deleteProject, getProjects } from "../../lib/api";
import type { WorldSummary } from "../../lib/types";
import { ConfirmDeleteButton } from "../../components/ConfirmDeleteButton";

type LoadState = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; projects: WorldSummary[] };

export function ProjectsList({ navigate }: { navigate: Navigate }) {
  const { siteSlug } = useSite();
  const [data, setData] = useState<LoadState>({ status: "loading" });

  const load = () => {
    setData({ status: "loading" });
    getProjects(siteSlug)
      .then((projects) => setData({ status: "ready", projects }))
      .catch((err) => setData({ status: "error", message: String(err) }));
  };

  useEffect(load, [siteSlug]);

  const onDelete = async (slug: string) => {
    try {
      await deleteProject(siteSlug, slug);
      load();
    } catch (err) {
      alert(`Delete failed: ${err}`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Projects</h1>
        <button
          onClick={() => navigate("/projects/new")}
          className="rounded bg-blue-600 text-white text-sm font-medium px-3 py-1.5 hover:bg-blue-700"
        >
          + New
        </button>
      </div>

      {data.status === "loading" && <p className="text-sm text-gray-500">Loading…</p>}
      {data.status === "error" && <p className="text-sm text-red-700">Error: {data.message}</p>}

      {data.status === "ready" && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-2 font-medium">World</th>
                <th className="px-4 py-2 font-medium">Title</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {data.projects.map((p) => (
                <tr key={p.slug} className="border-t border-gray-100">
                  <td className="px-4 py-2 text-gray-500">{p.world}</td>
                  <td className="px-4 py-2 text-gray-900">{p.title}</td>
                  <td className="px-4 py-2 text-gray-500">{p.status}</td>
                  <td className="px-4 py-2 text-right space-x-3 whitespace-nowrap">
                    <button
                      onClick={() => navigate(`/projects/${p.slug}/case-study`)}
                      className="text-sm text-blue-700 hover:underline"
                    >
                      Case study
                    </button>
                    <button onClick={() => navigate(`/projects/${p.slug}`)} className="text-sm text-blue-700 hover:underline">
                      Edit
                    </button>
                    <ConfirmDeleteButton onDelete={() => onDelete(p.slug)} />
                  </td>
                </tr>
              ))}
              {data.projects.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                    No projects yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
