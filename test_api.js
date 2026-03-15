const API_URL = "https://rcsb-api-worker.impact1-iceas.workers.dev/api/projects";
const WORKER_SECRET = "RCSB_Admin_Secure_Key_2026";
const payload = {
    title: "Final Hardened Test",
    slug: "final-hardened-test",
    category: "Club Stories",
    year: "2026",
    description: "Testing hardened worker RBAC.",
    image_url: "https://example.com/img.jpg",
    content: "This post confirms that the undefined binding bug is fixed.",
    type: "blog",
    status: "completed",
    author_email: "thejaswinps@gmail.com", // Valid admin from d1-admins.json
    gallery_urls: "[]"
};

async function test() {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${WORKER_SECRET}`
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Data:", data);
    } catch (e) {
        console.error(e);
    }
}

test();
