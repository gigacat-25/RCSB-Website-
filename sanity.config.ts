import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  basePath: "/studio",
  name: "rcsb-studio",
  title: "RCSB Studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("RCSB Content")
          .items([
            S.documentTypeListItem("event").title("Events"),
            S.documentTypeListItem("project").title("Projects"),
            S.documentTypeListItem("teamMember").title("Team Members"),
            S.documentTypeListItem("post").title("Blog Posts"),
            S.divider(),
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
