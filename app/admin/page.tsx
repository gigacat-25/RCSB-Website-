import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default async function AdminDashboard() {
  const user = await currentUser();
  
  // Fetch real stats
  let projectsCount = 0;
  let inquiriesCount = 0;
  let teamCount = 0;

  try {
    const projects = await apiFetch("/api/projects");
    projectsCount = projects.length;
    
    const messages = await apiFetch("/api/messages");
    inquiriesCount = messages.filter((m: any) => m.status === 'unread').length;
    
    const team = await apiFetch("/api/team");
    teamCount = team.length;
  } catch (err) {
    console.error("Failed to fetch dashboard stats", err);
  }

  return (
    <div className="py-6">
      <div className="mb-12">
        <h2 className="text-3xl font-heading font-bold text-brand-blue mb-2">Welcome back, {user?.firstName}</h2>
        <p className="text-brand-gray">Here is an overview of your club's recent activity and impact.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-4">Total Projects</h3>
          <p className="text-4xl font-heading font-bold text-brand-blue">{projectsCount.toString().padStart(2, '0')}</p>
          <div className="mt-4 pt-4 border-t border-gray-50">
            <Link href="/admin/projects" className="text-brand-azure text-sm font-bold hover:underline">Manage Projects &rarr;</Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-4">Pending Inquiries</h3>
          <p className="text-4xl font-heading font-bold text-brand-gold">{inquiriesCount.toString().padStart(2, '0')}</p>
          <div className="mt-4 pt-4 border-t border-gray-50">
            <Link href="/admin/messages" className="text-brand-azure text-sm font-bold hover:underline">View Messages &rarr;</Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-4">Board Members</h3>
          <p className="text-4xl font-heading font-bold text-brand-azure">{teamCount.toString().padStart(2, '0')}</p>
          <div className="mt-4 pt-4 border-t border-gray-50">
            <Link href="/admin/team" className="text-brand-azure text-sm font-bold hover:underline">Manage Roster &rarr;</Link>
          </div>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-brand-blue text-white p-8 rounded-3xl shadow-xl">
           <h2 className="text-2xl font-heading font-bold mb-4">Create New Project</h2>
           <p className="text-blue-100 mb-8 overflow-hidden">Ready to showcase a new club initiative? Add project details, impact stats, and photos to keep the community inspired.</p>
           <Link href="/admin/projects/add" className="inline-block px-8 py-3 bg-brand-gold text-brand-blue font-bold rounded-full hover:bg-white transition-all">
              Launch Project Editor
           </Link>
         </div>
         
         <div className="bg-white border-2 border-brand-blue p-8 rounded-3xl">
           <h2 className="text-2xl font-heading font-bold text-brand-blue mb-4">Update Leadership</h2>
           <p className="text-brand-gray mb-8">Switch roles for the new tenure or update existing board member details and profile photos.</p>
           <Link href="/admin/team" className="inline-block px-8 py-3 border-2 border-brand-blue text-brand-blue font-bold rounded-full hover:bg-brand-blue hover:text-white transition-all">
              Edit Board Roster
           </Link>
         </div>
      </div>
    </div>
  );
}

