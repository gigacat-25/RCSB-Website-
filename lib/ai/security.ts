/**
 * Swarna AI – Security Layer
 *
 * Three security layers:
 * 1. Input Firewall: Detects prompt injection, jailbreaks, secret-extraction attempts
 * 2. Output Firewall: Scans AI responses for accidental secret/config leakage
 * 3. Rate Limiter: Per-IP sliding window rate limiting (in-memory)
 */

// ---------------------------------------------------------------------------
// 1. INPUT FIREWALL — Injection & Jailbreak Detection
// ---------------------------------------------------------------------------

/** Patterns that indicate prompt injection or jailbreak attempts */
const INJECTION_PATTERNS: RegExp[] = [
  // Classic prompt injection
  /ignore\s+(all\s+)?(previous|prior|above|your)\s+(instructions?|rules?|prompt|context)/i,
  /forget\s+(all\s+)?(previous|your|the)\s+(instructions?|rules?|context|training)/i,
  /disregard\s+(all\s+)?(previous|your|the)\s+(instructions?|rules?|context)/i,
  /override\s+(your|all|the)\s+(instructions?|rules?|settings?|prompt)/i,

  // Secret / config extraction
  /reveal\s+(your\s+)?(prompt|system\s+prompt|instructions?|config|secret|key|token|api\s+key)/i,
  /show\s+(me\s+)?(your\s+)?(prompt|system\s+prompt|instructions?|hidden|config|secret|source\s+code)/i,
  /print\s+(your\s+)?(prompt|system\s+prompt|instructions?|config|api\s+key|secret|token)/i,
  /what\s+(is|are)\s+your\s+(prompt|system\s+prompt|hidden\s+instructions?|api\s+key|secrets?)/i,
  /tell\s+me\s+(your|the)\s+(prompt|system\s+prompt|hidden\s+instructions?|api\s+key|secrets?)/i,
  /output\s+(your|the)\s+(prompt|system\s+prompt|instructions?|config)/i,
  /repeat\s+(your|the)\s+(system\s+prompt|instructions?|prompt)/i,

  // SQL / database attacks
  /list\s+(all\s+)?(database|db|sql|tables?)\s+(tables?|schema|columns?|rows?)?/i,
  /execute\s+(sql|query|select|insert|drop|delete|update)/i,
  /select\s+\*?\s*from\s+\w+/i,
  /drop\s+table/i,
  /union\s+select/i,
  /show\s+(tables?|databases?|schema)/i,
  /read\s+\.env/i,
  /print\s+env/i,

  // Role-play / persona attacks
  /act\s+as\s+(a\s+)?(developer|admin|root|superuser|god|dan|jailbreak|unrestricted|evil)/i,
  /you\s+are\s+now\s+(a\s+)?(developer|admin|root|unrestricted|evil|dan|jailbreak)/i,
  /pretend\s+(you\s+are|to\s+be)\s+(a\s+)?(developer|admin|root|unrestricted)/i,
  /developer\s+mode/i,
  /jailbreak/i,
  /dan\s+mode/i,
  /admin\s+mode/i,
  /god\s+mode/i,
  /unrestricted\s+mode/i,
  /no\s+filter\s+mode/i,

  // Memory / internals
  /dump\s+(memory|context|conversation|config|logs?|database)/i,
  /show\s+(source\s+code|backend|architecture|server|database\s+schema|sql\s+schema)/i,
  /reveal\s+(backend|architecture|server|infrastructure|deployment|credentials?)/i,
  /what\s+(is|are)\s+your\s+(backend|server|database|architecture|deployment)/i,
  /tell\s+me\s+(about\s+)?(your\s+)?(backend|server|infrastructure|deployment|source\s+code)/i,

  // Safety disable
  /disable\s+(safety|filter|guardrail|restriction|censorship)/i,
  /remove\s+(restriction|limit|filter|guardrail|safety)/i,
  /bypass\s+(safety|filter|restriction|guardrail)/i,
  /turn\s+off\s+(safety|filter|restriction|guardrail)/i,
];

export interface SecurityCheckResult {
  blocked: boolean;
  reason?: string;
  response?: string;
}

/** Standard rejection message shown to users when blocked */
const SECURITY_RESPONSE =
  "I'm designed to provide verified information about the Rotaract Club of Swarna Bengaluru. I can't provide internal system details, confidential information, or assist with requests outside my intended purpose. Is there something about the club I can help you with?";

/**
 * Checks user input for prompt injection, jailbreak, or secret extraction attempts.
 * Returns a security check result indicating if the request should be blocked.
 */
export function checkInput(input: string): SecurityCheckResult {
  if (!input || typeof input !== "string") {
    return { blocked: false };
  }

  const normalized = input.trim();

  // Check length (extremely long inputs may be adversarial)
  if (normalized.length > 2000) {
    return {
      blocked: true,
      reason: "input_too_long",
      response: "Your message is too long. Please keep questions concise and club-related.",
    };
  }

  // Check against all injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        blocked: true,
        reason: "injection_detected",
        response: SECURITY_RESPONSE,
      };
    }
  }

  return { blocked: false };
}

// ---------------------------------------------------------------------------
// 2. OUTPUT FIREWALL — Prevent secret leakage in AI responses
// ---------------------------------------------------------------------------

/** Patterns that indicate a secret or sensitive value in output */
const OUTPUT_LEAK_PATTERNS: RegExp[] = [
  // API keys / tokens
  /sk_[a-zA-Z0-9_-]{10,}/i,        // Clerk secret key
  /pk_[a-zA-Z0-9_-]{10,}/i,        // Clerk publishable key
  /gsk_[a-zA-Z0-9_]{10,}/i,        // Groq API key
  /whsec_[a-zA-Z0-9+/=]{10,}/i,    // Webhook secret
  /Bearer\s+[a-zA-Z0-9._-]{20,}/i, // Bearer tokens
  /api[_-]?key\s*[:=]\s*[a-zA-Z0-9._-]{10,}/i,

  // Environment variables / file paths
  /CLOUDFLARE_WORKER_SECRET\s*[:=]/i,
  /GROQ_API_KEY\s*[:=]/i,
  /CLERK_SECRET_KEY\s*[:=]/i,
  /DATABASE_URL\s*[:=]/i,
  /GMAIL_CLIENT_SECRET\s*[:=]/i,
  /GMAIL_REFRESH_TOKEN\s*[:=]/i,
  /\.env\.local/i,
  /process\.env\./i,

  // SQL query patterns
  /SELECT\s+[\w\*,\s]+FROM\s+\w+/i,
  /INSERT\s+INTO\s+\w+/i,
  /DROP\s+TABLE/i,
  /CREATE\s+TABLE/i,
  /ALTER\s+TABLE/i,

  // Stack traces / file system paths
  /at\s+\w+\s+\([^)]+\.\w+:\d+:\d+\)/i, // JS stack trace line
  /[A-Za-z]:\\[^\s]+\.(ts|js|json|env)/,  // Windows file path
  /\/[a-z]+\/[a-z]+\/[a-z]+\.(ts|js|json|env)/i, // Unix file path

  // Internal identifiers
  /rcsb-api-worker\.impact1-iceas\.workers\.dev/i,
  /RCSB_Admin_Secure_Key/i,
];

/**
 * Scans AI output for potential secret or sensitive data leakage.
 * Returns a safe response if leakage is detected.
 */
export function checkOutput(output: string): { safe: boolean; sanitized?: string } {
  if (!output || typeof output !== "string") {
    return { safe: true };
  }

  for (const pattern of OUTPUT_LEAK_PATTERNS) {
    if (pattern.test(output)) {
      return {
        safe: false,
        sanitized: "I can't share internal or confidential system information. Is there something else about the Rotaract Club of Swarna Bengaluru I can help you with?",
      };
    }
  }

  return { safe: true };
}

// ---------------------------------------------------------------------------
// 3. RATE LIMITER — Per-IP sliding window (in-memory)
// ---------------------------------------------------------------------------

interface RateLimitEntry {
  count: number;
  resetAt: number;
  blockedUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_CONFIG = {
  maxRequests: 20,          // Max requests per window
  windowMs: 10 * 60 * 1000, // 10 minute window
  blockDurationMs: 5 * 60 * 1000, // Block for 5 min after abuse
  abuseThreshold: 30,       // Requests that trigger temp block
};

/**
 * Checks if the given IP is within rate limits.
 * Returns whether the request is allowed and any block duration info.
 */
export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  let entry = rateLimitStore.get(ip);

  // Check if currently in temp block
  if (entry?.blockedUntil && now < entry.blockedUntil) {
    const retryAfterSeconds = Math.ceil((entry.blockedUntil - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  // Initialize or reset window
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + RATE_LIMIT_CONFIG.windowMs };
    rateLimitStore.set(ip, entry);
  }

  // Increment count
  entry.count++;

  // Check for abuse (extreme requests) — apply temp block
  if (entry.count >= RATE_LIMIT_CONFIG.abuseThreshold) {
    entry.blockedUntil = now + RATE_LIMIT_CONFIG.blockDurationMs;
    rateLimitStore.set(ip, entry);
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil(RATE_LIMIT_CONFIG.blockDurationMs / 1000),
    };
  }

  // Normal rate limit check
  if (entry.count > RATE_LIMIT_CONFIG.maxRequests) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  rateLimitStore.set(ip, entry);
  return { allowed: true };
}

// ---------------------------------------------------------------------------
// 4. SECURITY EVENT LOGGER — Admin-only log buffer
// ---------------------------------------------------------------------------

export interface SecurityEvent {
  timestamp: string;
  ip: string;
  type: "injection_attempt" | "jailbreak" | "rate_limit" | "output_blocked" | "abuse";
  input?: string;
  details?: string;
}

// In-memory security log (last 200 events) — visible to admins only
const securityLog: SecurityEvent[] = [];
const MAX_LOG_SIZE = 200;

export function logSecurityEvent(event: SecurityEvent): void {
  if (securityLog.length >= MAX_LOG_SIZE) {
    securityLog.shift(); // Remove oldest
  }
  securityLog.push(event);
  // Also log to server console for Cloudflare worker logs
  console.warn(`[SwarnaAI Security] ${event.type} from ${event.ip}: ${event.details || event.input?.slice(0, 100)}`);
}

/**
 * Returns the security event log — ONLY call from admin-protected routes.
 */
export function getSecurityLog(): SecurityEvent[] {
  return [...securityLog];
}
