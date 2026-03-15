const API_URL = "https://rcsb-api-worker.impact1-iceas.workers.dev";
const API_SECRET = "RCSB_Admin_Secure_Key_2026";

async function test() {
  console.log("=== Testing Contact Submission ===");
  const ts = Date.now();
  const postRes = await fetch(`${API_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test User " + ts,
      email: "test@script.com",
      message: "Debug test at " + new Date().toISOString()
    })
  });
  console.log("POST Status:", postRes.status);
  const postData = await postRes.json();
  console.log("POST Response:", JSON.stringify(postData));

  // Wait a moment
  await new Promise(r => setTimeout(r, 500));

  console.log("\n=== Fetching Messages ===");
  const getRes = await fetch(`${API_URL}/api/messages`, {
    headers: { "Authorization": `Bearer ${API_SECRET}` }
  });
  console.log("GET Status:", getRes.status);
  const getData = await getRes.json();
  console.log("Total messages count:", Array.isArray(getData) ? getData.length : 'not an array');
  if (Array.isArray(getData) && getData.length > 0) {
    console.log("Latest:", JSON.stringify(getData[0]));
  } else {
    console.log("Raw response:", JSON.stringify(getData));
  }
}

test().catch(console.error);
