// src/index.ts
var index_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      });
    }
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    };
    try {
      if (request.method === "GET" && url.pathname === "/api/projects") {
        const author = url.searchParams.get("author");
        if (author) {
          const results2 = await env.DB.prepare("SELECT * FROM projects WHERE author_email = ? ORDER BY created_at DESC").bind(author).all();
          return new Response(JSON.stringify(results2.results), { headers });
        }
        const results = await env.DB.prepare("SELECT * FROM projects ORDER BY created_at DESC").all();
        return new Response(JSON.stringify(results.results), { headers });
      }
      if (request.method === "GET" && url.pathname === "/api/team") {
        const results = await env.DB.prepare("SELECT * FROM team_members ORDER BY order_index ASC").all();
        return new Response(JSON.stringify(results.results), { headers });
      }
      if (request.method === "GET" && url.pathname === "/api/gallery") {
        const results = await env.DB.prepare("SELECT * FROM gallery_slides ORDER BY order_index ASC, created_at ASC").all();
        return new Response(JSON.stringify(results.results), { headers });
      }
      if (request.method === "POST" && url.pathname === "/api/contact") {
        const body = await request.json();
        if (!body.name || !body.email || !body.message) {
          return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400, headers });
        }
        await env.DB.prepare("INSERT INTO contact_submissions (name, email, message, phone, reason) VALUES (?, ?, ?, ?, ?)").bind(body.name, body.email, body.message, body.phone || null, body.reason || "General Inquiry").run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }
      const matchMedia = url.pathname.match(/^\/media\/(.+)$/);
      if (matchMedia && request.method === "GET") {
        const key = matchMedia[1];
        const object = await env.MEDIA_BUCKET.get(key);
        if (!object) return new Response("Not found", { status: 404 });
        const mediaHeaders = new Headers();
        object.writeHttpMetadata(mediaHeaders);
        mediaHeaders.set("Access-Control-Allow-Origin", "*");
        mediaHeaders.set("etag", object.httpEtag);
        return new Response(object.body, { headers: mediaHeaders });
      }
      const matchCommentsPublic = url.pathname.match(/^\/api\/projects\/(\d+)\/comments$/);
      if (matchCommentsPublic && request.method === "GET") {
        const projectId = matchCommentsPublic[1];
        const comments = await env.DB.prepare("SELECT * FROM comments WHERE project_id = ? ORDER BY created_at DESC").bind(projectId).all();
        return new Response(JSON.stringify(comments.results), { headers });
      }
      const auth = request.headers.get("Authorization");
      if (auth !== `Bearer ${env.WORKER_SECRET}`) {
        return new Response(JSON.stringify({ error: "Unauthorized", received: auth }), { status: 401, headers });
      }
      if (request.method === "POST" && url.pathname === "/api/projects") {
        const body = await request.json();
        const authorEmail = body.author_email;
        if (!authorEmail) {
          return new Response(JSON.stringify({ error: "Unauthorized: author_email is required." }), { status: 401, headers });
        }
        const admin = await env.DB.prepare("SELECT role FROM authorized_admins WHERE email = ?").bind(authorEmail).first();
        if (!admin) {
          if (body.type !== "blog") {
            return new Response(JSON.stringify({ error: "Unauthorized: Only whitelisted admins can manage projects/events." }), { status: 403, headers });
          }
        } else if (admin.role === "blogger" && body.type !== "blog") {
          return new Response(JSON.stringify({ error: "Forbidden: Bloggers can only create blog posts." }), { status: 403, headers });
        }
        const slug = body.slug || `post-${Date.now()}`;
        const existing = await env.DB.prepare("SELECT id FROM projects WHERE slug = ?").bind(slug).first();
        if (existing) {
          return new Response(JSON.stringify({
            error: `Slug collision: The URL slug '${slug}' is already taken.`,
            details: `A project with slug '${slug}' already exists in the database. Please choose a different title or slug.`,
            colliding_slug: slug
          }), { status: 409, headers });
        }
        await env.DB.prepare(
          "INSERT INTO projects (title, slug, category, year, description, image_url, content, type, status, author_email, gallery_urls, rsvp_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(
          body.title || "Untitled",
          slug,
          body.category || "General",
          body.year || (/* @__PURE__ */ new Date()).getFullYear().toString(),
          body.description || "",
          body.image_url || null,
          body.content || "",
          body.type || "project",
          body.status || "completed",
          body.author_email || null,
          body.gallery_urls || "[]",
          body.rsvp_link || null
        ).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }
      const matchProject = url.pathname.match(/^\/api\/projects\/(\d+)$/);
      if (matchProject) {
        const id = matchProject[1];
        if (request.method === "GET") {
          const result = await env.DB.prepare("SELECT * FROM projects WHERE id=?").bind(id).first();
          if (!result) return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers });
          return new Response(JSON.stringify(result), { headers });
        }
        if (request.method === "PUT" || request.method === "DELETE") {
          const body = await (request.method === "PUT" ? request.clone().json() : {});
          const userEmail = body.author_email || url.searchParams.get("user_email");
          if (!userEmail) {
            return new Response(JSON.stringify({ error: "user_email is required for this operation." }), { status: 400, headers });
          }
          const project = await env.DB.prepare("SELECT author_email FROM projects WHERE id = ?").bind(id).first();
          if (!project) return new Response(JSON.stringify({ error: "Project not found" }), { status: 404, headers });
          const admin = await env.DB.prepare("SELECT role FROM authorized_admins WHERE email = ?").bind(userEmail).first();
          if (!admin && project.author_email !== userEmail) {
            return new Response(JSON.stringify({ error: "Unauthorized: Email not in authorized_admins." }), { status: 403, headers });
          }
          if (admin && admin.role !== "admin" && project.author_email !== userEmail) {
            return new Response(JSON.stringify({ error: "Forbidden: You can only manage your own content." }), { status: 403, headers });
          }
          if (request.method === "PUT") {
            await env.DB.prepare(
              "UPDATE projects SET title=?, slug=?, category=?, year=?, description=?, image_url=?, content=?, type=?, status=?, gallery_urls=?, rsvp_link=?, updated_at=datetime('now') WHERE id=?"
            ).bind(
              body.title || "Untitled",
              body.slug || "unknown",
              body.category || "General",
              body.year || "2024",
              body.description || "",
              body.image_url || null,
              body.content || "",
              body.type || "project",
              body.status || "completed",
              body.gallery_urls || "[]",
              body.rsvp_link || null,
              id
            ).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
          if (request.method === "DELETE") {
            await env.DB.prepare("DELETE FROM projects WHERE id=?").bind(id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }
      }
      if (request.method === "POST" && url.pathname === "/api/team") {
        const body = await request.json();
        await env.DB.prepare(
          "INSERT INTO team_members (name, role, period, image_url, bio, order_index) VALUES (?, ?, ?, ?, ?, ?)"
        ).bind(body.name, body.role, body.period, body.image_url || null, body.bio || null, body.order_index || 0).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }
      const matchTeam = url.pathname.match(/^\/api\/team\/(\d+)$/);
      if (matchTeam) {
        const id = matchTeam[1];
        if (request.method === "GET") {
          const result = await env.DB.prepare("SELECT * FROM team_members WHERE id=?").bind(id).first();
          if (!result) return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers });
          return new Response(JSON.stringify(result), { headers });
        }
        if (request.method === "PUT") {
          const body = await request.json();
          await env.DB.prepare(
            "UPDATE team_members SET name=?, role=?, period=?, image_url=?, bio=?, order_index=? WHERE id=?"
          ).bind(body.name, body.role, body.period, body.image_url || null, body.bio || null, body.order_index || 0, id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }
        if (request.method === "DELETE") {
          await env.DB.prepare("DELETE FROM team_members WHERE id=?").bind(id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }
      }
      if (request.method === "GET" && url.pathname === "/api/messages") {
        const results = await env.DB.prepare("SELECT * FROM contact_submissions ORDER BY created_at DESC").all();
        return new Response(JSON.stringify(results.results || []), { headers });
      }
      const matchMessage = url.pathname.match(/^\/api\/messages\/(\d+)$/);
      if (matchMessage && request.method === "PUT") {
        const id = matchMessage[1];
        const body = await request.json();
        await env.DB.prepare("UPDATE contact_submissions SET status=? WHERE id=?").bind(body.status, id).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }
      if (request.method === "POST" && url.pathname === "/api/upload") {
        const contentType = request.headers.get("Content-Type") || "";
        if (!contentType.includes("multipart/form-data")) {
          return new Response(JSON.stringify({ error: "Only multipart/form-data is supported" }), { status: 400, headers });
        }
        const formData = await request.formData();
        const file = formData.get("file");
        if (!file) {
          return new Response(JSON.stringify({ error: "No file provided" }), { status: 400, headers });
        }
        const key = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        await env.MEDIA_BUCKET.put(key, await file.arrayBuffer(), {
          httpMetadata: { contentType: file.type }
        });
        const baseUrl = new URL(request.url).origin;
        const publicUrl = `${baseUrl}/media/${key}`;
        return new Response(JSON.stringify({ url: publicUrl, key }), { headers });
      }
      const matchComments = url.pathname.match(/^\/api\/projects\/(\d+)\/comments$/);
      if (matchComments && request.method === "POST") {
        const projectId = matchComments[1];
        const body = await request.json();
        await env.DB.prepare(
          "INSERT INTO comments (project_id, user_name, user_email, user_image, content) VALUES (?, ?, ?, ?, ?)"
        ).bind(projectId, body.user_name, body.user_email, body.user_image || null, body.content).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }
      if (request.method === "POST" && url.pathname === "/api/gallery") {
        const body = await request.json();
        if (!body.title || !body.image_url) {
          return new Response(JSON.stringify({ error: "title and image_url are required" }), { status: 400, headers });
        }
        const countResult = await env.DB.prepare("SELECT COUNT(*) as count FROM gallery_slides").first();
        const nextOrder = body.order_index ?? (countResult?.count ?? 0);
        await env.DB.prepare(
          "INSERT INTO gallery_slides (title, caption, image_url, order_index) VALUES (?, ?, ?, ?)"
        ).bind(body.title, body.caption || "", body.image_url, nextOrder).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }
      const matchGallery = url.pathname.match(/^\/api\/gallery\/(\d+)$/);
      if (matchGallery) {
        const id = matchGallery[1];
        if (request.method === "PUT") {
          const body = await request.json();
          await env.DB.prepare(
            "UPDATE gallery_slides SET title=?, caption=?, image_url=?, order_index=? WHERE id=?"
          ).bind(body.title, body.caption || "", body.image_url, body.order_index ?? 0, id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }
        if (request.method === "DELETE") {
          await env.DB.prepare("DELETE FROM gallery_slides WHERE id=?").bind(id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }
      }
      return new Response(JSON.stringify({ error: "Not found", path: url.pathname }), { status: 404, headers });
    } catch (err) {
      console.error("Worker Error:", err.message, err.stack);
      return new Response(JSON.stringify({
        error: err.message,
        stack: err.stack,
        details: "Check worker logs for more info"
      }), { status: 500, headers });
    }
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
