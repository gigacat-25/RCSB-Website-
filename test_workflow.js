// test_workflow.js
// Run this script locally using: node test_workflow.js
// Make sure your wrangler dev server is running on http://localhost:8787

const args = process.argv.slice(2);
const isProd = args.includes("--prod");
const isNow = args.includes("--now");

const API_URL = isProd 
    ? "https://rcsb-api-worker.impact1-iceas.workers.dev/api/projects" 
    : "http://localhost:8787/api/projects";

const WORKER_SECRET = "RCSB_Admin_Secure_Key_2026";

// If --now is provided, set the date to 1 day in the past so all sleep milestones
// are skipped and emails are sent immediately.
// Otherwise, set it to 8 days in the future to test scheduling/sleep logic.
const targetDate = new Date();
if (isNow) {
    targetDate.setDate(targetDate.getDate() - 1);
} else {
    targetDate.setDate(targetDate.getDate() + 8);
}

const typeArg = args.find(a => a.startsWith("--type="));
const postType = typeArg ? typeArg.split("=")[1] : "event";

const payload = {
    title: `Test ${postType.toUpperCase()} - ${Date.now()}`,
    slug: `test-${postType}-${Date.now()}`,
    category: "Testing",
    year: "2026",
    description: `This is a test ${postType} to verify the automated email scheduler and Cloudflare Workflows integration.`,
    image_url: "/images/event-placeholder.jpg",
    content: `# Test ${postType.toUpperCase()}\nAutomatically triggered in the backend by workflows.`,
    type: postType,
    status: "upcoming",
    author_email: "thejaswinps@gmail.com", // Valid admin email
    event_date: postType === "blog" ? null : targetDate.toISOString(),
    rsvp_link: "https://rcsb-website.pages.dev/register",
    gallery_urls: "[]",
    featured_links: "[]"
};

async function runTest() {
    console.log(`[Test] Sending mock ${payload.type} to worker at ${API_URL}...`);
    console.log(`[Test] Event date set to: ${payload.event_date}`);

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${WORKER_SECRET}`
            },
            body: JSON.stringify(payload)
        });

        console.log(`[Test] Status Code: ${res.status}`);
        const data = await res.json();
        console.log("[Test] Response Data:", data);

        if (res.status === 200) {
            console.log("\n[Test] Success! The event has been created.");
            console.log("[Test] Check your wrangler dev console logs to verify that the Workflow was spawned.");
            console.log("[Test] You can run the following to inspect active local workflow instances:");
            console.log("       npx wrangler workflows instances list EVENT_REMINDER_WORKFLOW");
        } else {
            console.error("[Test] Failed to create event.", data);
        }
    } catch (e) {
        console.error("[Test] Network connection error:", e.message);
        console.log("[Test] Make sure to start the worker locally using 'npx wrangler dev' inside the 'cloudflare-worker' folder.");
    }
}

runTest();
