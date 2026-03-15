export const API_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL || "https://rcsb-api-worker.impact1-iceas.workers.dev";
export const API_SECRET = process.env.CLOUDFLARE_WORKER_SECRET || "RCSB_Admin_Secure_Key_2026";

/**
 * Helper to fetch data from the Cloudflare Worker API
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  
  if (!headers.has("Content-Type") && options.method !== "DELETE") {
    headers.set("Content-Type", "application/json");
  }

  // Add the worker secret for admin protected endpoints
  headers.set("Authorization", `Bearer ${API_SECRET}`);

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} ${errorText}`);
  }

  return response.json();
}
