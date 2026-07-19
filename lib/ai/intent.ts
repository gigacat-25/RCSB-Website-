/**
 * Swarna AI – Intent Classifier
 *
 * Classifies user queries into RCSB topic intents so only relevant
 * RAG tools are called — keeping context compact and Groq token usage minimal.
 */

export type Intent =
  | "events_upcoming"
  | "events_past"
  | "projects"
  | "blogs"
  | "team"
  | "president"
  | "past_presidents"
  | "membership"
  | "gallery"
  | "partners"
  | "contact"
  | "club_info"
  | "club_history"
  | "awards"
  | "announcements"
  | "general_rotaract";

export interface IntentResult {
  intents: Intent[];
  searchQuery: string; // Cleaned query suitable for DB search
}

// ---------------------------------------------------------------------------
// Intent keyword maps
// ---------------------------------------------------------------------------

const INTENT_MAP: Record<Intent, RegExp[]> = {
  events_upcoming: [
    /up+com+ing/i,
    /next\s+event/i,
    /future\s+event/i,
    /scheduled\s+event/i,
    /when\s+is\s+the\s+next/i,
    /next\s+meeting/i,
    /upcoming\s+meeting/i,
    /events?\s+this\s+(month|week|year)/i,
    /what('s|\s+is)\s+(happening|going\s+on)/i,
    /register\s+for\s+event/i,
    /rsvp/i,
  ],
  events_past: [
    /past\s+event/i,
    /previous\s+event/i,
    /last\s+event/i,
    /completed\s+event/i,
    /event\s+history/i,
    /events?\s+(we\s+)?had/i,
    /recent\s+event/i,
  ],
  projects: [
    /proj/i,
    /initiative/i,
    /program/i,
    /what\s+(did|has|have)\s+(the\s+club|rcsb|you|rotaract)\s+(done|completed|worked)/i,
    /recent/i,
    /sparsha/i,
    /ryla/i,
    /community\s+service/i,
    /flagship/i,
    /ongoing\s+project/i,
    /completed\s+project/i,
  ],
  blogs: [
    /blog/i,
    /article/i,
    /post/i,
    /write-?up/i,
    /newsletter\s+blog/i,
    /read\s+(about|more)/i,
  ],
  team: [
    /board/i,
    /team/i,
    /member/i,
    /director/i,
    /officer/i,
    /who\s+is\s+(the|your)/i,
    /current\s+(leadership|board|team)/i,
    /secretary/i,
    /treasurer/i,
    /vice\s+president/i,
    /sergeant/i,
    /joint\s+secretary/i,
    /editor/i,
    /director\s+of/i,
    /committee/i,
  ],
  president: [
    /president/i,
    /who\s+(leads|runs|heads)/i,
    /current\s+president/i,
    /club\s+president/i,
  ],
  past_presidents: [
    /past\s+president/i,
    /previous\s+president/i,
    /former\s+president/i,
    /ex-?president/i,
    /history\s+of\s+president/i,
    /who\s+was\s+the\s+president/i,
  ],
  membership: [
    /join/i,
    /membership/i,
    /become\s+a\s+member/i,
    /how\s+to\s+join/i,
    /sign\s+up/i,
    /enroll/i,
    /eligib/i,
    /fee/i,
    /dues/i,
    /application/i,
    /member\s+benefit/i,
    /why\s+join/i,
    /volunteer/i,
  ],
  gallery: [
    /gallery/i,
    /photo/i,
    /image/i,
    /picture/i,
    /moment/i,
    /highlight/i,
    /show\s+me\s+photo/i,
  ],
  partners: [
    /partner/i,
    /sponsor/i,
    /collaborat/i,
    /support(er|ing|ed)?/i,
    /organization\s+(with|that)/i,
  ],
  contact: [
    /contact/i,
    /reach\s+(out|us|you)/i,
    /email/i,
    /phone/i,
    /address/i,
    /location/i,
    /where\s+(are\s+you|is\s+the\s+club|is\s+your\s+office)/i,
    /how\s+(can\s+i|do\s+i)\s+(contact|reach|get\s+in\s+touch)/i,
    /social\s+media/i,
    /instagram/i,
    /facebook/i,
    /linkedin/i,
    /meeting\s+(location|place|venue)/i,
    /weekly\s+meeting/i,
    /where\s+(do\s+you|does\s+the\s+club)\s+meet/i,
  ],
  club_info: [
    /about\s+(rotaract|the\s+club|rcsb|swarna)/i,
    /what\s+is\s+rotaract/i,
    /rotaract\s+(club|history|mission|vision|values?)/i,
    /club\s+(history|background|info|information|about)/i,
    /district\s+3192/i,
    /ri\s+district/i,
    /rotary\s+(international|youth)/i,
    /when\s+was\s+(the\s+club|rcsb|rotaract\s+swarna)\s+(founded|established|started)/i,
    /swarna\s+bengaluru/i,
    /rcsb/i,
  ],
  announcements: [
    /announcement/i,
    /news/i,
    /update/i,
    /latest/i,
    /recent\s+news/i,
    /what('s|\s+is)\s+new/i,
    /notice/i,
  ],
  club_history: [
    /how\s+old\s+is\s+(the\s+club|rcsb)/i,
    /when\s+was\s+(the\s+club|rcsb|rotaract\s+swarna|swarna)\s+(founded|established|started|inaugurated|inograted|inagurated|started)/i,
    /founding\s+year/i,
    /year\s+(of\s+)?(foundation|founding|establishment|inauguration)/i,
    /club('s)?\s+(age|history|background|inception|origin)/i,
    /how\s+long\s+(has\s+the\s+club|rcsb|has\s+it)\s+(been|existed)/i,
    /inograt/i, // Catches typos like "inograted"
    /inaugurat/i,
    /established/i,
    /founded/i,
  ],
  awards: [
    /award/i,
    /recognition/i,
    /prize/i,
    /honour|honor/i,
    /achievement/i,
    /accolade/i,
    /won/i,
    /trophy/i,
    /certificate/i,
    /best\s+(club|project|team)/i,
    /district\s+(award|recognition)/i,
  ],
  general_rotaract: [
    /rotaract/i,
    /rotary/i,
    /service\s+(above\s+self|before\s+self)/i,
    /district/i,
  ],
};

// ---------------------------------------------------------------------------
// Classifier
// ---------------------------------------------------------------------------

/**
 * Classifies the user's message into one or more intents.
 * Multiple intents are possible (e.g. "Who is the president and upcoming events?")
 */
export function classifyIntent(message: string): IntentResult {
  const detected: Set<Intent> = new Set();

  for (const [intent, patterns] of Object.entries(INTENT_MAP) as [Intent, RegExp[]][]) {
    for (const pattern of patterns) {
      if (pattern.test(message)) {
        detected.add(intent);
        break; // One match per intent is enough
      }
    }
  }

  // Smart grouping: if "president" intent detected, also fetch team (includes president)
  if (detected.has("president")) {
    detected.add("team");
  }

  // If no intent detected, fall back to club_info + general
  if (detected.size === 0) {
    detected.add("club_info");
    detected.add("general_rotaract");
  }

  // Build a clean, meaningful search query.
  // Strip question starters, filler words, numbers, and generic category nouns so that:
  //   "what are the previous 5 projects" → "" (get ALL projects)
  //   "tell me about Project Smile" → "Project Smile" (specific search)
  //   "who are the club advisors" → "" (broad team search)
  const searchQuery = message
    // Remove question starters
    .replace(/^(what|who|when|where|how|tell\s+me|show\s+me|can\s+you|please|i\s+want\s+to\s+know|list|give\s+me|find)\s+(about\s+)?/i, "")
    // Remove common filler/generic adjectives that don't add specificity
    .replace(/\b(are|is|the|a|an|some|all|any|our|us|me|recent|latest|current|past|completed|ongoing|upcoming|previous|next|new|old|available|done|somthing|something|few|many|much|very|really|quite)\b/gi, " ")
    // Remove standalone numbers (e.g. "5" in "previous 5 projects")
    .replace(/\b\d+\b/g, " ")
    // Remove generic topic/category nouns that are captured by intent instead
    .replace(/\b(projects?|events?|blogs?|members?|advisors?|board|team|announcements?|updates?|news|awards?|gallery|partners?|initiatives?|activities?|programmes?)\b/gi, " ")
    // Remove possessives and apostrophes
    .replace(/['']s?\b/g, " ")
    // Remove trailing punctuation
    .replace(/[?!.,]+$/, "")
    // Collapse multiple spaces
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, 100);

  return {
    intents: Array.from(detected),
    searchQuery,
  };
}

/**
 * Returns true if any of the detected intents require live DB data.
 */
export function requiresLiveData(intents: Intent[]): boolean {
  const dynamicIntents: Intent[] = [
    "events_upcoming",
    "events_past",
    "projects",
    "blogs",
    "team",
    "president",
    "past_presidents",
    "gallery",
    "partners",
    "announcements",
    "awards",
  ];
  return intents.some((i) => dynamicIntents.includes(i));
}
