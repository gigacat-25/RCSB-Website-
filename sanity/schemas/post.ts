import { defineField, defineType } from "sanity";

export default defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (R) => R.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (R) => R.required() }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime" }),
    defineField({ name: "coverImage", title: "Cover Image URL (R2)", type: "url" }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "object",
          name: "imageEmbed",
          title: "Image (R2 URL)",
          fields: [
            { name: "url", title: "Image URL", type: "url" },
            { name: "alt", title: "Alt text", type: "string" },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "publishedAt" },
  },
});
