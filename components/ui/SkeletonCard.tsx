"use client";

export function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[480px] animate-pulse">
      {/* Thumbnail Skeleton */}
      <div className="h-64 bg-slate-200/80 w-full relative">
        <div className="absolute top-6 left-6 w-24 h-6 bg-slate-300/80 rounded-full" />
        <div className="absolute top-6 right-6 w-20 h-6 bg-slate-300/80 rounded-full" />
      </div>

      {/* Content Skeleton */}
      <div className="p-8 flex flex-col flex-1 justify-between">
        <div>
          {/* Subtitle / Category & Year */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-3 bg-slate-200 rounded-full" />
            <div className="w-2 h-2 bg-slate-200 rounded-full" />
            <div className="w-12 h-3 bg-slate-200 rounded-full" />
          </div>

          {/* Title Lines */}
          <div className="w-4/5 h-6 bg-slate-200 rounded-xl mb-3" />
          <div className="w-2/3 h-6 bg-slate-200 rounded-xl mb-4" />

          {/* Description Lines */}
          <div className="w-full h-3 bg-slate-200 rounded-full mb-2" />
          <div className="w-3/4 h-3 bg-slate-200 rounded-full" />
        </div>

        {/* Footer Link Skeleton */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
          <div className="w-28 h-4 bg-slate-200 rounded-full" />
          <div className="w-8 h-8 bg-slate-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[520px] animate-pulse">
      {/* Header Image Skeleton */}
      <div className="h-64 bg-slate-200/80 w-full relative">
        <div className="absolute top-6 left-6 w-24 h-6 bg-slate-300/80 rounded-full" />
      </div>

      {/* Content Skeleton */}
      <div className="p-8 flex flex-col flex-1 justify-between">
        <div>
          {/* Author info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-4 rounded-full bg-slate-200" />
            <div className="w-20 h-3 bg-slate-200 rounded-full" />
            <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
            <div className="w-12 h-3 bg-slate-200 rounded-full" />
          </div>

          {/* Title */}
          <div className="w-full h-6 bg-slate-200 rounded-xl mb-3" />
          <div className="w-3/4 h-6 bg-slate-200 rounded-xl mb-4" />

          {/* Snippet */}
          <div className="w-full h-3 bg-slate-200 rounded-full mb-2" />
          <div className="w-4/5 h-3 bg-slate-200 rounded-full" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
          <div className="w-24 h-4 bg-slate-200 rounded-full" />
          <div className="w-6 h-6 bg-slate-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 animate-pulse">
      {/* Hero Header Skeleton */}
      <div className="h-[45vh] md:h-[55vh] bg-slate-900/90 w-full relative flex flex-col justify-end pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="w-36 h-4 bg-slate-700 rounded-full mb-6" />
          <div className="flex gap-3 mb-4">
            <div className="w-28 h-6 bg-slate-700 rounded-full" />
            <div className="w-20 h-6 bg-slate-700 rounded-full" />
          </div>
          <div className="w-3/4 h-10 bg-slate-700 rounded-2xl mb-4" />
          <div className="w-1/2 h-10 bg-slate-700 rounded-2xl" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-6 mt-16 pb-20">
        <div className="flex flex-col lg:flex-row gap-16 max-w-7xl mx-auto">
          {/* Article skeleton */}
          <div className="flex-1 w-full max-w-3xl space-y-6">
            <div className="w-full h-6 bg-slate-200 rounded-full" />
            <div className="w-11/12 h-6 bg-slate-200 rounded-full" />
            <div className="w-4/5 h-6 bg-slate-200 rounded-full" />
            <div className="w-full h-32 bg-slate-200/70 rounded-3xl mt-8" />
            <div className="w-full h-6 bg-slate-200 rounded-full mt-6" />
            <div className="w-3/4 h-6 bg-slate-200 rounded-full" />
          </div>

          {/* Sidebar skeleton */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 space-y-6">
              <div className="w-32 h-4 bg-slate-200 rounded-full mb-6" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-2xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="w-16 h-3 bg-slate-200 rounded-full" />
                  <div className="w-24 h-4 bg-slate-200 rounded-full" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-2xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="w-16 h-3 bg-slate-200 rounded-full" />
                  <div className="w-32 h-4 bg-slate-200 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
