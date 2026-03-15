import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { allPostsQuery } from "@/sanity/lib/queries";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Blog",
  description: "Stories, updates, and reflections from the Rotaract Club of Swarna Bengaluru.",
};

export const revalidate = 3600;

interface Post { _id: string; title: string; slug: { current: string }; publishedAt?: string; coverImage?: string; }

export default async function BlogPage() {
  const posts: Post[] = await client.fetch(allPostsQuery).catch(() => []);

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Blog"
          subtitle="Stories, updates, and reflections from our journey."
        />

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-brand-grey rounded-xl">
            <p className="text-gray-400 text-sm">Blog posts will appear here once published in Sanity Studio.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post._id} href={`/blog/${post.slug.current}`} className="block group">
                <div className="card-hover rounded-xl overflow-hidden border border-gray-100 bg-white">
                  <div className="relative h-48 bg-brand-grey overflow-hidden">
                    {post.coverImage ? (
                      <Image
                        src={`${post.coverImage}?width=600&format=webp`}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-blue/10 to-brand-gold/10 flex items-center justify-center">
                        <span className="text-brand-blue/30 font-heading font-bold text-4xl">RCSB</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    {post.publishedAt && (
                      <p className="text-xs text-gray-400 mb-2">
                        {new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    )}
                    <h2 className="font-heading font-semibold text-brand-blue text-base line-clamp-2 group-hover:text-brand-gold transition-colors">
                      {post.title}
                    </h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
