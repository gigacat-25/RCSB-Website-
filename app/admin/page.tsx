export const runtime = 'edge';
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { isAdmin } from "@/lib/admin";
import { BookOpenIcon, PencilSquareIcon, SparklesIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

export default async function AdminDashboard() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const userIsAdmin = isAdmin(email);
  
  // Stats
  let projectsCount = 0;
  let inquiriesCount = 0;
  let teamCount = 0;
  let myBlogsCount = 0;

  try {
    // Only admins can fetch messages and full team data
    if (userIsAdmin) {
      const projects = await apiFetch("/api/projects");
      projectsCount = projects.length;
      
      const messages = await apiFetch("/api/messages");
      inquiriesCount = messages.filter((m: any) => m.status === 'unread').length;
      
      const team = await apiFetch("/api/team");
      teamCount = team.length;
    } else {
      // For bloggers, only fetch projects to filter blogs
      const projects = await apiFetch("/api/projects");
      myBlogsCount = projects.filter((p: any) => p.type === 'blog').length;
    }
  } catch (err) {
    console.error("Failed to fetch dashboard stats", err);
  }

  if (!userIsAdmin) {
    return (
      <div className="py-6">
        <div className="mb-12">
          <h2 className="text-3xl font-heading font-black text-brand-blue mb-2">Hello, {user?.firstName}! 👋</h2>
          <p className="text-brand-gray font-medium">Welcome to the RCSB Contributor Portal. Share your experiences and inspire the community.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contributor Stats */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
            <div className="w-16 h-16 bg-brand-gold/20 rounded-2xl flex items-center justify-center text-brand-gold">
              <BookOpenIcon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Published Stories</h3>
              <p className="text-4xl font-heading font-bold text-brand-blue">{myBlogsCount.toString().padStart(2, '0')}</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
            <div className="w-16 h-16 bg-brand-azure/20 rounded-2xl flex items-center justify-center text-brand-azure">
              <SparklesIcon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Community Impact</h3>
              <p className="text-4xl font-heading font-bold text-brand-azure">Active</p>
            </div>
          </div>
        </div>

        {/* Blogger Actions */}
        <div className="bg-brand-blue text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 max-w-lg">
            <h2 className="text-3xl font-heading font-black mb-4">Start a New Story</h2>
            <p className="text-blue-100 mb-8 text-lg font-medium leading-relaxed">
              Every event has a unique perspective. Share yours today and help us document the club's impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/admin/blogs/add" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-gold text-brand-blue font-black rounded-2xl hover:bg-white transition-all shadow-xl">
                <PencilSquareIcon className="w-5 h-5" />
                Write Post
              </Link>
              <Link href="/blogs" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-black rounded-2xl hover:bg-white/20 transition-all border border-white/20">
                <GlobeAltIcon className="w-5 h-5" />
                View Public Blog
              </Link>
            </div>
          </div>
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
        </div>
      </div>
    );
  }

  // ADMIN VIEW
  return (
    <div className="py-6">
      <div className="mb-12 px-2">
        <h2 className="text-3xl font-heading font-bold text-brand-blue mb-2">Welcome back, {user?.firstName}</h2>
        <p className="text-brand-gray">Here is an overview of your club's recent activity and impact.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 px-2">
        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-4">Total Projects</h3>
          <p className="text-4xl font-heading font-bold text-brand-blue">{projectsCount.toString().padStart(2, '0')}</p>
          <div className="mt-4 pt-4 border-t border-gray-50">
            <Link href="/admin/projects" className="text-brand-azure text-sm font-bold hover:underline">Manage Projects &rarr;</Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-4">Pending Inquiries</h3>
          <p className="text-4xl font-heading font-bold text-brand-gold">{inquiriesCount.toString().padStart(2, '0')}</p>
          <div className="mt-4 pt-4 border-t border-gray-50">
            <Link href="/admin/messages" className="text-brand-azure text-sm font-bold hover:underline">View Messages &rarr;</Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-4">Board Members</h3>
          <p className="text-4xl font-heading font-bold text-brand-azure">{teamCount.toString().padStart(2, '0')}</p>
          <div className="mt-4 pt-4 border-t border-gray-50">
            <Link href="/admin/team" className="text-brand-azure text-sm font-bold hover:underline">Manage Roster &rarr;</Link>
          </div>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-2">
         <div className="bg-brand-blue text-white p-8 rounded-[40px] shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h2 className="text-2xl font-heading font-bold mb-4">Create New Project</h2>
              <p className="text-blue-100 mb-8 font-medium">Ready to showcase a new club initiative? Add project details, impact stats, and photos to keep the community inspired.</p>
              <Link href="/admin/projects/add" className="inline-block px-8 py-4 bg-brand-gold text-brand-blue font-black rounded-2xl hover:bg-white transition-all shadow-lg">
                Launch Project Editor
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
         </div>
         
         <div className="bg-white border-2 border-brand-blue p-8 rounded-[40px] group hover:bg-brand-blue/5 transition-colors">
            <h2 className="text-2xl font-heading font-bold text-brand-blue mb-4">Update Leadership</h2>
            <p className="text-brand-gray mb-8 font-medium">Switch roles for the new tenure or update existing board member details and profile photos.</p>
            <Link href="/admin/team" className="inline-block px-8 py-4 border-2 border-brand-blue text-brand-blue font-black rounded-2xl hover:bg-brand-blue hover:text-white transition-all">
               Edit Board Roster
            </Link>
         </div>
      </div>
    </div>
  );
}
