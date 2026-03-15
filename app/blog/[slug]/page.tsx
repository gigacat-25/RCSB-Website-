import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { postBySlugQuery } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";

interface BlogPostPageProps { params: { slug: string } }

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await client.fetch(postBySlugQuery, { slug: params.slug }).catch(() => null);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    openGraph: { images: post.coverImage ? [{ url: post.coverImage }] : [] },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await client.fetch(postBySlugQuery, { slug: params.slug }).catch(() => null);
  if (!post) notFound();

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {post.publishedAt && (
          <p className="text-sm text-brand-gold font-medium mb-4">
            {new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        )}
        <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-blue mb-6 leading-tight">
          {post.title}
        </h1>

        {post.coverImage && (
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8 bg-brand-grey">
            <Image
              src={`${post.coverImage}?width=1200&format=webp`}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed">
          {post.body && <PortableText value={post.body} />}
        </div>
      </article>
    </div>
  );
}
