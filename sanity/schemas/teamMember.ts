import { defineField, defineType } from "sanity";

export default defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (R) => R.required() }),
    defineField({ name: "role", title: "Role / Title", type: "string", validation: (R) => R.required() }),
    defineField({ name: "photo", title: "Photo URL (R2)", type: "url" }),
    defineField({ name: "year", title: "Rotary Year (e.g. 2025)", type: "number", initialValue: 2025 }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Board Member", value: "board" },
          { title: "Advisor", value: "advisor" },
          { title: "Mentor", value: "mentor" },
        ],
        layout: "radio",
      },
      initialValue: "board",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role" },
  },
});
