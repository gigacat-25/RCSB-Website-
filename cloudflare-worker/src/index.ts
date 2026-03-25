export interface Env {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
  WORKER_SECRET: string;
}

// D1 Migration — run once in Cloudflare dashboard > D1 > your DB > Console:
// CREATE TABLE IF NOT EXISTS gallery_slides (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   title TEXT NOT NULL,
//   caption TEXT,
//   image_url TEXT NOT NULL,
//   order_index INTEGER DEFAULT 0,
//   created_at TEXT DEFAULT (datetime('now'))
// );

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };

    try {
      // --- PUBLIC ENDPOINTS ---

      if (request.method === "GET" && url.pathname === "/api/projects") {
        const author = url.searchParams.get("author");
        if (author) {
          const results = await env.DB.prepare("SELECT p.*, (SELECT COUNT(*) FROM comments c WHERE c.project_id = p.id) as comment_count FROM projects p WHERE p.author_email = ? ORDER BY p.created_at DESC")
            .bind(author).all();
          return new Response(JSON.stringify(results.results), { headers });
        }
        const results = await env.DB.prepare("SELECT p.*, (SELECT COUNT(*) FROM comments c WHERE c.project_id = p.id) as comment_count FROM projects p ORDER BY p.created_at DESC").all();
        return new Response(JSON.stringify(results.results), { headers });
      }

      if (request.method === "GET" && url.pathname === "/api/team") {
        const results = await env.DB.prepare("SELECT * FROM team_members ORDER BY order_index ASC").all();
        return new Response(JSON.stringify(results.results), { headers });
      }

      // > Public Past Presidents
      if (request.method === "GET" && url.pathname === "/api/past-presidents") {
        const results = await env.DB.prepare("SELECT * FROM past_presidents ORDER BY order_index ASC").all();
        return new Response(JSON.stringify(results.results), { headers });
      }

      // > Public Gallery (for homepage carousel)
      if (request.method === "GET" && url.pathname === "/api/gallery") {
        const results = await env.DB.prepare("SELECT * FROM gallery_slides ORDER BY order_index ASC, created_at ASC").all();
        return new Response(JSON.stringify(results.results), { headers });
      }

      // > Public Partners
      if (request.method === "GET" && url.pathname === "/api/partners") {
        const results = await env.DB.prepare("SELECT * FROM partners ORDER BY order_index ASC, created_at ASC").all();
        return new Response(JSON.stringify(results.results), { headers });
      }

      if (request.method === "POST" && url.pathname === "/api/contact") {
        const body = await request.json() as any;
        if (!body.name || !body.email || !body.message) {
          return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400, headers });
        }
        await env.DB.prepare("INSERT INTO contact_submissions (name, email, message, phone, reason) VALUES (?, ?, ?, ?, ?)")
          .bind(body.name, body.email, body.message, body.phone || null, body.reason || "General Inquiry").run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }

      // > Media Proxy (Unprotected)
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

      // > Public Comments Fetch
      const matchCommentsPublic = url.pathname.match(/^\/api\/projects\/(\d+)\/comments$/);
      if (matchCommentsPublic && request.method === "GET") {
        const projectId = matchCommentsPublic[1];
        const comments = await env.DB.prepare("SELECT * FROM comments WHERE project_id = ? ORDER BY created_at DESC")
          .bind(projectId).all();
        return new Response(JSON.stringify(comments.results), { headers });
      }

      // > Public Like Project
      const matchLike = url.pathname.match(/^\/api\/projects\/(\d+)\/like$/);
      if (matchLike && request.method === "POST") {
        const projectId = matchLike[1];
        await env.DB.prepare("UPDATE projects SET likes = coalesce(likes, 0) + 1 WHERE id = ?").bind(projectId).run();
        const updated = await env.DB.prepare("SELECT likes FROM projects WHERE id = ?").bind(projectId).first();
        return new Response(JSON.stringify(updated), { headers });
      }

      // > Newsletter: Subscribe (public)
      if (request.method === "POST" && url.pathname === "/api/newsletter/subscribe") {
        const body = await request.json() as any;
        if (!body.email) {
          return new Response(JSON.stringify({ error: "Email is required" }), { status: 400, headers });
        }
        const token = crypto.randomUUID();
        try {
          await env.DB.prepare(
            "INSERT INTO newsletter_subscribers (email, name, token, subscribed) VALUES (?, ?, ?, 1) ON CONFLICT(email) DO UPDATE SET subscribed=1"
          ).bind(body.email.toLowerCase().trim(), body.name || null, token).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
        }
      }

      // > Newsletter: Unsubscribe (public — uses token from email link)
      if (request.method === "GET" && url.pathname === "/api/newsletter/unsubscribe") {
        const token = url.searchParams.get("token");
        if (!token) {
          return new Response(JSON.stringify({ error: "Missing token" }), { status: 400, headers });
        }
        await env.DB.prepare("UPDATE newsletter_subscribers SET subscribed=0 WHERE token=?").bind(token).run();
        return new Response(JSON.stringify({ success: true, message: "Unsubscribed" }), { headers });
      }

      // --- PROTECTED ENDPOINTS ---
      const auth = request.headers.get("Authorization");
      if (auth !== `Bearer ${env.WORKER_SECRET}`) {
        return new Response(JSON.stringify({ error: "Unauthorized", received: auth }), { status: 401, headers });
      }

      // > Projects CRUD
      if (request.method === "POST" && url.pathname === "/api/projects") {
        const body = await request.json() as any;

        const authorEmail = body.author_email;
        if (!authorEmail) {
          return new Response(JSON.stringify({ error: "Unauthorized: author_email is required." }), { status: 401, headers });
        }

        const admin = await env.DB.prepare("SELECT role FROM authorized_admins WHERE email = ?")
          .bind(authorEmail).first() as { role: string } | null;

        if (!admin) {
          if (body.type !== 'blog') {
            return new Response(JSON.stringify({ error: "Unauthorized: Only whitelisted admins can manage projects/events." }), { status: 403, headers });
          }
        } else if (admin.role === 'blogger' && body.type !== 'blog') {
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
          "INSERT INTO projects (title, slug, category, year, description, image_url, content, type, status, author_email, gallery_urls, rsvp_link, event_date, featured_links) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(
          body.title || "Untitled",
          slug,
          body.category || "General",
          body.year || new Date().getFullYear().toString(),
          body.description || "",
          body.image_url || null,
          body.content || "",
          body.type || 'project',
          body.status || 'completed',
          body.author_email || null,
          body.gallery_urls || "[]",
          body.rsvp_link || null,
          body.event_date || null,
          body.featured_links || "[]"
        ).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }

      const matchProject = url.pathname.match(/^\/api\/projects\/(\d+)$/);
      if (matchProject) {
        const id = matchProject[1];
        if (request.method === "GET") {
          const result = await env.DB.prepare("SELECT p.*, (SELECT COUNT(*) FROM comments c WHERE c.project_id = p.id) as comment_count FROM projects p WHERE p.id=?").bind(id).first();
          if (!result) return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers });
          return new Response(JSON.stringify(result), { headers });
        }

        if (request.method === "PUT" || request.method === "DELETE") {
          const body = await (request.method === "PUT" ? request.clone().json() : {}) as any;
          const userEmail = body.author_email || url.searchParams.get("user_email");

          if (!userEmail) {
            return new Response(JSON.stringify({ error: "user_email is required for this operation." }), { status: 400, headers });
          }

          const project = await env.DB.prepare("SELECT author_email FROM projects WHERE id = ?").bind(id).first() as any;
          if (!project) return new Response(JSON.stringify({ error: "Project not found" }), { status: 404, headers });

          const admin = await env.DB.prepare("SELECT role FROM authorized_admins WHERE email = ?")
            .bind(userEmail).first() as { role: string } | null;

          if (!admin && project.author_email !== userEmail) {
            return new Response(JSON.stringify({ error: "Unauthorized: Email not in authorized_admins." }), { status: 403, headers });
          }

          if (admin && admin.role !== 'admin' && project.author_email !== userEmail) {
            return new Response(JSON.stringify({ error: "Forbidden: You can only manage your own content." }), { status: 403, headers });
          }

          if (request.method === "PUT") {
            await env.DB.prepare(
              "UPDATE projects SET title=?, slug=?, category=?, year=?, description=?, image_url=?, content=?, type=?, status=?, gallery_urls=?, rsvp_link=?, event_date=?, featured_links=?, updated_at=datetime('now') WHERE id=?"
            ).bind(
              body.title || "Untitled",
              body.slug || "unknown",
              body.category || "General",
              body.year || "2024",
              body.description || "",
              body.image_url || null,
              body.content || "",
              body.type || 'project',
              body.status || 'completed',
              body.gallery_urls || "[]",
              body.rsvp_link || null,
              body.event_date || null,
              body.featured_links || "[]",
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

      // > Team CRUD
      if (request.method === "POST" && url.pathname === "/api/team") {
        const body = await request.json() as any;
        // Shift existing members down to make room
        await env.DB.prepare("UPDATE team_members SET order_index = order_index + 1 WHERE order_index >= ?").bind(body.order_index || 0).run();

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
          const body = await request.json() as any;
          const oldMember = await env.DB.prepare("SELECT order_index FROM team_members WHERE id=?").bind(id).first();
          if (oldMember) {
            const oldIndex = oldMember.order_index as number;
            const newIndex = body.order_index || 0;
            if (oldIndex !== newIndex) {
              if (newIndex < oldIndex) {
                await env.DB.prepare("UPDATE team_members SET order_index = order_index + 1 WHERE order_index >= ? AND order_index < ?").bind(newIndex, oldIndex).run();
              } else {
                await env.DB.prepare("UPDATE team_members SET order_index = order_index - 1 WHERE order_index > ? AND order_index <= ?").bind(oldIndex, newIndex).run();
              }
            }
          }
          await env.DB.prepare(
            "UPDATE team_members SET name=?, role=?, period=?, image_url=?, bio=?, order_index=? WHERE id=?"
          ).bind(body.name, body.role, body.period, body.image_url || null, body.bio || null, body.order_index || 0, id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }
        if (request.method === "DELETE") {
          const oldMember = await env.DB.prepare("SELECT order_index FROM team_members WHERE id=?").bind(id).first();
          if (oldMember) {
            const oldIndex = oldMember.order_index as number;
            await env.DB.prepare("UPDATE team_members SET order_index = order_index - 1 WHERE order_index > ?").bind(oldIndex).run();
          }
          await env.DB.prepare("DELETE FROM team_members WHERE id=?").bind(id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }
      }

      if (request.method === "POST" && url.pathname === "/api/team/reorder") {
        const body = await request.json() as { id: number, order_index: number }[];
        const statements = body.map(item =>
          env.DB.prepare("UPDATE team_members SET order_index = ? WHERE id = ?").bind(item.order_index, item.id)
        );
        await env.DB.batch(statements);
        return new Response(JSON.stringify({ success: true }), { headers });
      }

      // > Authorized Admins CRUD
      if (request.method === "GET" && url.pathname === "/api/authorized-admins") {
        const results = await env.DB.prepare("SELECT * FROM authorized_admins ORDER BY created_at DESC").all();
        return new Response(JSON.stringify(results.results), { headers });
      }

      if (request.method === "GET" && url.pathname === "/api/authorized-admins/check") {
        const email = url.searchParams.get("email");
        if (!email) return new Response(JSON.stringify({ role: null }), { headers });
        const admin = await env.DB.prepare("SELECT role FROM authorized_admins WHERE email = ?").bind(email).first() as { role: string } | null;
        return new Response(JSON.stringify({ role: admin?.role || null }), { headers });
      }

      if (request.method === "POST" && url.pathname === "/api/authorized-admins") {
        const body = await request.json() as any;
        const exists = await env.DB.prepare("SELECT id FROM authorized_admins WHERE email=?").bind(body.email).first();
        if (exists) {
          return new Response(JSON.stringify({ error: "Email already authorized" }), { status: 400, headers });
        }
        await env.DB.prepare("INSERT INTO authorized_admins (email, role, name) VALUES (?, ?, ?)")
          .bind(body.email, body.role || 'editor', body.name || null).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }

      const matchAdmins = url.pathname.match(/^\/api\/authorized-admins\/(\d+)$/);
      if (matchAdmins && request.method === "DELETE") {
        await env.DB.prepare("DELETE FROM authorized_admins WHERE id=?").bind(matchAdmins[1]).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }

      // > Past Presidents CRUD
      if (request.method === "POST" && url.pathname === "/api/past-presidents") {
        const body = await request.json() as any;
        await env.DB.prepare("UPDATE past_presidents SET order_index = order_index + 1 WHERE order_index >= ?").bind(body.order_index || 0).run();
        await env.DB.prepare(
          "INSERT INTO past_presidents (name, period, image_url, order_index) VALUES (?, ?, ?, ?)"
        ).bind(body.name, body.period, body.image_url || null, body.order_index || 0).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }

      const matchPastPres = url.pathname.match(/^\/api\/past-presidents\/(\d+)$/);
      if (matchPastPres) {
        const id = matchPastPres[1];
        if (request.method === "GET") {
          const result = await env.DB.prepare("SELECT * FROM past_presidents WHERE id=?").bind(id).first();
          if (!result) return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers });
          return new Response(JSON.stringify(result), { headers });
        }
        if (request.method === "PUT") {
          const body = await request.json() as any;
          const oldMember = await env.DB.prepare("SELECT order_index FROM past_presidents WHERE id=?").bind(id).first();
          if (oldMember) {
            const oldIndex = oldMember.order_index as number;
            const newIndex = body.order_index || 0;
            if (oldIndex !== newIndex) {
              if (newIndex < oldIndex) {
                await env.DB.prepare("UPDATE past_presidents SET order_index = order_index + 1 WHERE order_index >= ? AND order_index < ?").bind(newIndex, oldIndex).run();
              } else {
                await env.DB.prepare("UPDATE past_presidents SET order_index = order_index - 1 WHERE order_index > ? AND order_index <= ?").bind(oldIndex, newIndex).run();
              }
            }
          }
          await env.DB.prepare(
            "UPDATE past_presidents SET name=?, period=?, image_url=?, order_index=? WHERE id=?"
          ).bind(body.name, body.period, body.image_url || null, body.order_index || 0, id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }
        if (request.method === "DELETE") {
          const oldMember = await env.DB.prepare("SELECT order_index FROM past_presidents WHERE id=?").bind(id).first();
          if (oldMember) {
            const oldIndex = oldMember.order_index as number;
            await env.DB.prepare("UPDATE past_presidents SET order_index = order_index - 1 WHERE order_index > ?").bind(oldIndex).run();
          }
          await env.DB.prepare("DELETE FROM past_presidents WHERE id=?").bind(id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }
      }

      if (request.method === "POST" && url.pathname === "/api/past-presidents/reorder") {
        const body = await request.json() as { id: number, order_index: number }[];
        const statements = body.map(item =>
          env.DB.prepare("UPDATE past_presidents SET order_index = ? WHERE id = ?").bind(item.order_index, item.id)
        );
        await env.DB.batch(statements);
        return new Response(JSON.stringify({ success: true }), { headers });
      }

      // > Messages Management
      if (request.method === "GET" && url.pathname === "/api/messages") {
        const results = await env.DB.prepare("SELECT * FROM contact_submissions ORDER BY created_at DESC").all();
        return new Response(JSON.stringify(results.results || []), { headers });
      }

      const matchMessage = url.pathname.match(/^\/api\/messages\/(\d+)$/);
      if (matchMessage && request.method === "PUT") {
        const id = matchMessage[1];
        const body = await request.json() as any;
        await env.DB.prepare("UPDATE contact_submissions SET status=? WHERE id=?").bind(body.status, id).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }

      // > Media Upload (R2)
      if (request.method === "POST" && url.pathname === "/api/upload") {
        const contentType = request.headers.get("Content-Type") || "";
        if (!contentType.includes("multipart/form-data")) {
          return new Response(JSON.stringify({ error: "Only multipart/form-data is supported" }), { status: 400, headers });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;
        if (!file) {
          return new Response(JSON.stringify({ error: "No file provided" }), { status: 400, headers });
        }

        const key = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        await env.MEDIA_BUCKET.put(key, await file.arrayBuffer(), {
          httpMetadata: { contentType: file.type },
        });

        const baseUrl = new URL(request.url).origin;
        const publicUrl = `${baseUrl}/media/${key}`;
        return new Response(JSON.stringify({ url: publicUrl, key }), { headers });
      }

      // > Comments Management (POST only here)
      const matchComments = url.pathname.match(/^\/api\/projects\/(\d+)\/comments$/);
      if (matchComments && request.method === "POST") {
        const projectId = matchComments[1];
        const body = await request.json() as any;
        await env.DB.prepare(
          "INSERT INTO comments (project_id, user_name, user_email, user_image, content) VALUES (?, ?, ?, ?, ?)"
        ).bind(projectId, body.user_name, body.user_email, body.user_image || null, body.content).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }

      // > Gallery CRUD (admin protected)
      if (request.method === "POST" && url.pathname === "/api/gallery") {
        const body = await request.json() as any;
        if (!body.title || !body.image_url) {
          return new Response(JSON.stringify({ error: "title and image_url are required" }), { status: 400, headers });
        }

        const countResult = await env.DB.prepare("SELECT COUNT(*) as count FROM gallery_slides").first() as any;
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
          const body = await request.json() as any;
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

      // > Partners CRUD (admin protected)
      if (request.method === "POST" && url.pathname === "/api/partners") {
        const body = await request.json() as any;
        if (!body.name || !body.image_url) {
          return new Response(JSON.stringify({ error: "name and image_url are required" }), { status: 400, headers });
        }

        const countResult = await env.DB.prepare("SELECT COUNT(*) as count FROM partners").first() as any;
        const nextOrder = body.order_index ?? (countResult?.count ?? 0);

        await env.DB.prepare(
          "INSERT INTO partners (name, image_url, order_index) VALUES (?, ?, ?)"
        ).bind(body.name, body.image_url, nextOrder).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }

      const matchPartner = url.pathname.match(/^\/api\/partners\/(\d+)$/);
      if (matchPartner) {
        const id = matchPartner[1];
        if (request.method === "PUT") {
          const body = await request.json() as any;
          await env.DB.prepare(
            "UPDATE partners SET name=?, image_url=?, order_index=? WHERE id=?"
          ).bind(body.name, body.image_url, body.order_index ?? 0, id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }
        if (request.method === "DELETE") {
          await env.DB.prepare("DELETE FROM partners WHERE id=?").bind(id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }
      }

      // > Newsletter: List subscribers (protected)
      if (request.method === "GET" && url.pathname === "/api/newsletter/subscribers") {
        const results = await env.DB.prepare(
          "SELECT email, name, token FROM newsletter_subscribers WHERE subscribed=1 ORDER BY created_at DESC"
        ).all();
        return new Response(JSON.stringify(results.results), { headers });
      }

      return new Response(JSON.stringify({ error: "Not found", path: url.pathname }), { status: 404, headers });

    } catch (err: any) {
      console.error("Worker Error:", err.message, err.stack);
      return new Response(JSON.stringify({
        error: err.message,
        stack: err.stack,
        details: "Check worker logs for more info"
      }), { status: 500, headers });
    }
  },
};
