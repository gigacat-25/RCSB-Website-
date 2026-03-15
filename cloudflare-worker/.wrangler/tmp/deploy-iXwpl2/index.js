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
        const results = await env.DB.prepare("SELECT * FROM projects ORDER BY created_at DESC").all();
        return new Response(JSON.stringify(results.results), { headers });
      }
      if (request.method === "GET" && url.pathname === "/api/team") {
        const results = await env.DB.prepare("SELECT * FROM team_members ORDER BY order_index ASC").all();
        return new Response(JSON.stringify(results.results), { headers });
      }
      if (request.method === "POST" && url.pathname === "/api/contact") {
        const body = await request.json();
        if (!body.name || !body.email || !body.message) {
          return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400, headers });
        }
        await env.DB.prepare("INSERT INTO contact_submissions (name, email, message) VALUES (?, ?, ?)").bind(body.name, body.email, body.message).run();
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
      const auth = request.headers.get("Authorization");
      if (auth !== `Bearer ${env.WORKER_SECRET}`) {
        return new Response(JSON.stringify({ error: "Unauthorized", received: auth }), { status: 401, headers });
      }
      if (request.method === "POST" && url.pathname === "/api/projects") {
        const body = await request.json();
        await env.DB.prepare(
          "INSERT INTO projects (title, slug, category, year, description, image_url, content, type, status, gallery_urls) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(
          body.title,
          body.slug,
          body.category,
          body.year,
          body.description,
          body.image_url || null,
          body.content || "",
          body.type || "project",
          body.status || "completed",
          body.gallery_urls || null
        ).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }
      const matchProject = url.pathname.match(/^\/api\/projects\/(\d+)$/);
      if (matchProject) {
        const id = matchProject[1];
        if (request.method === "PUT") {
          const body = await request.json();
          await env.DB.prepare(
            "UPDATE projects SET title=?, slug=?, category=?, year=?, description=?, image_url=?, content=?, type=?, status=?, gallery_urls=?, updated_at=datetime('now') WHERE id=?"
          ).bind(
            body.title,
            body.slug,
            body.category,
            body.year,
            body.description,
            body.image_url || null,
            body.content || "",
            body.type || "project",
            body.status || "completed",
            body.gallery_urls || null,
            id
          ).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }
        if (request.method === "DELETE") {
          await env.DB.prepare("DELETE FROM projects WHERE id=?").bind(id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
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
      return new Response(JSON.stringify({ error: "Not found", path: url.pathname }), { status: 404, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
