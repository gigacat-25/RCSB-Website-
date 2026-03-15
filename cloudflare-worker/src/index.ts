export interface Env {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
  WORKER_SECRET: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };

    try {
      // 1. Contact Form Submission
      if (request.method === "POST" && url.pathname === "/api/contact") {
        const body = (await request.json()) as { name: string; email: string; message: string };
        if (!body.name || !body.email || !body.message) {
          return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400, headers });
        }
        await env.DB.prepare(
          "INSERT INTO contact_submissions (name, email, message) VALUES (?, ?, ?)"
        ).bind(body.name, body.email, body.message).run();
        
        return new Response(JSON.stringify({ success: true }), { headers });
      }

      // 2. Event RSVP Submission
      if (request.method === "POST" && url.pathname === "/api/rsvp") {
        const body = (await request.json()) as { event_slug: string; name: string; email: string; phone?: string };
        if (!body.event_slug || !body.name || !body.email) {
          return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400, headers });
        }
        await env.DB.prepare(
          "INSERT INTO event_rsvps (event_slug, name, email, phone) VALUES (?, ?, ?, ?)"
        ).bind(body.event_slug, body.name, body.email, body.phone || null).run();
        
        return new Response(JSON.stringify({ success: true }), { headers });
      }

      // 3. Admin: Get RSVPs (Protected)
      if (request.method === "GET" && url.pathname === "/api/rsvps") {
        const auth = request.headers.get("Authorization");
        if (auth !== `Bearer ${env.WORKER_SECRET}`) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers });
        }
        
        const eventSlug = url.searchParams.get("event");
        let results;
        if (eventSlug) {
          results = await env.DB.prepare("SELECT * FROM event_rsvps WHERE event_slug = ? ORDER BY created_at DESC").bind(eventSlug).all();
        } else {
          results = await env.DB.prepare("SELECT * FROM event_rsvps ORDER BY created_at DESC").all();
        }
        
        return new Response(JSON.stringify({ rsvps: results.results }), { headers });
      }

      return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers });

    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  },
};
