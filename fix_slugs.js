const API_URL = "https://rcsb-api-worker.impact1-iceas.workers.dev";
const API_SECRET = "RCSB_Admin_Secure_Key_2026";

async function fixSlugs() {
  try {
    const res = await fetch(`${API_URL}/api/projects`, {
      headers: { "Authorization": `Bearer ${API_SECRET}` }
    });
    const projects = await res.json();
    
    for (const p of projects) {
      if (!p.slug || p.slug === "null") {
        const newSlug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
        console.log(`Fixing slug for ID ${p.id}: ${p.title} -> ${newSlug}`);
        
        await fetch(`${API_URL}/api/projects/${p.id}`, {
          method: "PUT",
          headers: { 
            "Authorization": `Bearer ${API_SECRET}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...p,
            slug: newSlug
          })
        });
      }
    }
    console.log("Done fixing slugs.");
  } catch (e) {
    console.error(e);
  }
}

fixSlugs();
