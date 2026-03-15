import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export const revalidate = 0; // Disable cache for admin dashboard

export default async function AdminProjectsPage() {
  let projects = [];
  try {
    projects = await apiFetch("/api/projects");
  } catch (error) {
    console.error("Failed to fetch projects:", error);
  }

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-heading font-bold text-brand-blue">Projects</h2>
          <p className="text-brand-gray mt-1">Manage the impact initiatives shown on the public site.</p>
        </div>
        <Link 
          href="/admin/projects/add" 
          className="flex items-center gap-2 px-6 py-2 bg-brand-gold hover:bg-yellow-500 text-brand-blue font-bold rounded-full transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Project
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-brand-gray font-bold text-sm tracking-wider uppercase">
              <th className="p-4">Project Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Year</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No projects found. Click "Add Project" to create your first one.
                </td>
              </tr>
            ) : (
              projects.map((project: any) => (
                <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-brand-blue">{project.title}</div>
                    <div className="text-xs text-brand-gray mt-1">{project.slug}</div>
                  </td>
                  <td className="p-4">
                    <span className="bg-blue-50 text-brand-blue px-3 py-1 rounded-full text-xs font-semibold">
                      {project.category}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 font-semibold">{project.year}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/projects/${project.id}`} 
                        className="p-2 text-brand-azure hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Project"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </Link>
                      <button 
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Project"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
