import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (R) => R.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (R) => R.required() }),
    defineField({ name: "description", title: "Description", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "coverImage", title: "Cover Image URL (R2)", type: "url" }),
    defineField({ name: "gallery", title: "Gallery (R2 URLs)", type: "array", of: [{ type: "url" }] }),
    defineField({
      name: "impactStats",
      title: "Impact Statistics",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "value", title: "Value", type: "string" },
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
