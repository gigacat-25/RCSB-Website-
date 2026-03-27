const fs = require('fs');
const content = fs.readFileSync('.env.local', 'utf8');

const getEnv = (key) => {
    const match = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
    return match ? match[1].trim() : null;
};

async function testGmail() {
    const GMAIL_CLIENT_ID = getEnv('GMAIL_CLIENT_ID');
    const GMAIL_CLIENT_SECRET = getEnv('GMAIL_CLIENT_SECRET');
    const GMAIL_REFRESH_TOKEN = getEnv('GMAIL_REFRESH_TOKEN');

    console.log("Testing with ID:", GMAIL_CLIENT_ID?.substring(0, 10) + "...");

    if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
        console.error("FAILED: Missing environment variables in .env.local");
        return;
    }

    try {
        const params = new URLSearchParams({
            client_id: GMAIL_CLIENT_ID,
            client_secret: GMAIL_CLIENT_SECRET,
            refresh_token: GMAIL_REFRESH_TOKEN,
            grant_type: 'refresh_token',
        });

        const res = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString(),
        });

        const data = await res.json();
        if (!res.ok) {
            console.error("FAILED to refresh token:", JSON.stringify(data));
        } else {
            console.log("SUCCESS! Access token retrieved.");
        }
    } catch (err) {
        console.error("ERROR:", err.message);
    }
}

testGmail();
