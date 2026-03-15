async function checkApi() {
  const API_URL = "https://rcsb-api-worker.impact1-iceas.workers.dev";
  try {
    const res = await fetch(`${API_URL}/api/projects`, {
      headers: {
        "Authorization": "Bearer RCSB_Admin_Secure_Key_2026"
      }
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Fetch failed:", e.message);
  }
}

checkApi();
