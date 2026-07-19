import { ProjectCardSkeleton } from "@/components/ui/SkeletonCard";

export default function AwardsLoading() {
  return (
    <div className="bg-slate-50 min-h-screen pt-36 pb-24">
      <div className="container-custom max-w-7xl mx-auto">
        <div className="w-48 h-8 bg-slate-200 rounded-2xl mb-12 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16 lg:gap-20">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <ProjectCardSkeleton key={n} />
          ))}
        </div>
      </div>
    </div>
  );
}
