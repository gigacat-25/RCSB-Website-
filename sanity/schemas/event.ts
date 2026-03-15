import { defineField, defineType } from "sanity";

export default defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (R) => R.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (R) => R.required() }),
    defineField({ name: "date", title: "Date", type: "datetime", validation: (R) => R.required() }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "description", title: "Description", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "coverImage", title: "Cover Image URL (R2)", type: "url", description: "URL from media.rcsb.in" }),
    defineField({
      name: "photoAlbum",
      title: "Photo Album (R2 URLs)",
      type: "array",
      of: [{ type: "url" }],
      description: "Upload photos to R2 and paste their URLs here",
    }),
    defineField({ name: "isUpcoming", title: "Is Upcoming?", type: "boolean", initialValue: true }),
  ],
  preview: {
    select: { title: "title", subtitle: "date" },
  },
});
