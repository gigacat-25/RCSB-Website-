async function checkApi() {
  const API_URL = "https://rcsb-api-worker.impact1-iceas.workers.dev";
  try {
    const res = await fetch(`${API_URL}/api/projects`, {
      headers: { "Authorization": "Bearer RCSB_Admin_Secure_Key_2026" }
    });
    const data = await res.json();
    data.forEach(p => {
      console.log(`ID: ${p.id}, Title: ${p.title}, Slug: ${p.slug}`);
    });
  } catch (e) {
    console.error(e.message);
  }
}

checkApi();
