/**
 * Swarna AI – Context Builder
 *
 * Takes results from the RAG tools and builds a compact, structured
 * context string that is injected into the Groq system prompt.
 *
 * The goal: provide maximum relevant information in minimum tokens.
 * Target: < 2,000 tokens in the context block.
 */

import { Intent } from "./intent";
import {
  getUpcomingEvents,
  getPastEvents,
  searchProjects,
  searchBlogs,
  getBoardMembers,
  getMemberByRole,
  getPastPresidents,
  getClubInformation,
  getGallery,
  getPartners,
  getMembershipInformation,
  getContactInformation,
  searchAnnouncements,
  searchWebsite,
  getAwards,
  type PublicProject,
  type PublicTeamMember,
} from "./tools";

// ---------------------------------------------------------------------------
// Section Formatters
// ---------------------------------------------------------------------------

function formatEvents(events: PublicProject[], label: string): string {
  if (!events.length) return `${label}: None found in the database.\n`;
  const lines = events.map((e) => {
    const date = e.event_date ? ` | Date: ${e.event_date}` : "";
    const rsvp = e.rsvp_link ? ` | RSVP: ${e.rsvp_link}` : "";
    return `  - ${e.title} (${e.category}, ${e.year})${date}${rsvp}\n    ${e.description}`;
  });
  return `${label}:\n${lines.join("\n")}\n`;
}

function formatProjects(projects: PublicProject[], label: string): string {
  if (!projects.length) return `${label}: None found.\n`;
  const lines = projects.map(
    (p) => `  - ${p.title} (${p.category}, ${p.year}, Status: ${p.status})\n    ${p.description}`
  );
  return `${label}:\n${lines.join("\n")}\n`;
}

function formatTeamMembers(members: PublicTeamMember[], label: string): string {
  if (!members.length) return `${label}: No members found.\n`;
  const lines = members.map((m) => {
    const bio = m.bio ? ` — ${m.bio.slice(0, 100)}` : "";
    return `  - ${m.name} | ${m.role} (${m.period})${bio}`;
  });
  return `${label}:\n${lines.join("\n")}\n`;
}

// ---------------------------------------------------------------------------
// Main Context Builder
// ---------------------------------------------------------------------------

export interface ContextResult {
  context: string;
  toolsUsed: string[];
}

/**
 * Orchestrates all relevant RAG tools based on detected intents
 * and returns a compact context string for the Groq system prompt.
 */
export async function buildContext(
  intents: Intent[],
  searchQuery: string
): Promise<ContextResult> {
  const sections: string[] = [];
  const toolsUsed: string[] = [];

  const intentSet = new Set(intents);

  // Normalise the search query: if it's 3 chars or fewer after cleaning,
  // treat it as empty so the tools return ALL records of the relevant type
  // rather than finding nothing. E.g. "recent projects" → query="" → all projects.
  const effectiveQuery = searchQuery.length > 3 ? searchQuery : "";

  // --- Club Information (always include for club_info or general queries) ---
  if (intentSet.has("club_info") || intentSet.has("general_rotaract")) {
    const info = getClubInformation();
    toolsUsed.push("getClubInformation");
    sections.push(
      `Club Overview:\n` +
        `  Name: ${info.fullName}\n` +
        `  District: ${info.district}\n` +
        `  Mission: ${info.mission}\n` +
        `  About: ${info.about}\n` +
        `  Website: ${info.website}\n` +
        `  Contact Email: ${info.contactEmail}\n` +
        `  Service Avenues: ${info.avenues.join(", ")}\n` +
        `  Note on History: ${info.historicalNote}\n`
    );
  }

  // --- Club History / Founding Year ---
  // Only triggered by explicit founding/age/history questions (club_history intent)
  if (intentSet.has("club_history")) {
    const pastPres = await getPastPresidents();
    toolsUsed.push("getPastPresidents (history)");
    if (pastPres.length) {
      const earliest = pastPres[pastPres.length - 1];
      const lines = pastPres.map((p) => `  - ${p.name} (${p.period})`);
      sections.push(
        `Club Past Presidents (newest to oldest):\n${lines.join("\n")}\n` +
          `  Earliest recorded presidency: ${earliest.name} (${earliest.period})\n` +
          `  IMPORTANT NOTE FOR AI: Only use this list to answer history/age questions. ` +
          `If the list has only 1-2 entries, our records are INCOMPLETE \u2014 do NOT confidently claim a founding year. ` +
          `Instead, tell the user this is the earliest record we have on file and suggest contacting the club for accurate founding history. ` +
          `Each Rotaract year runs July\u2013June. Current year: ${new Date().getFullYear()}.\n`
      );
    } else {
      sections.push(
        `Club History: Our past presidents list is not yet fully populated in our records. ` +
          `For accurate founding history, please contact rota.rcsb@gmail.com.\n`
      );
    }
  }


  // --- Awards & Recognition ---
  if (intentSet.has("awards")) {
    const awards = await getAwards(effectiveQuery, 8);
    toolsUsed.push("getAwards");
    if (!awards.length) {
      sections.push(
        `Awards & Recognition: No award records found in the database currently. For information about club achievements and recognition, please contact rota.rcsb@gmail.com or visit https://rotaractswarnabengaluru.in.\n`
      );
    } else {
      const lines = awards.map(
        (a) =>
          `  - ${a.title} (${a.category}, ${a.year})\n    ${a.description}`
      );
      sections.push(`Awards & Recognition:\n${lines.join("\n")}\n`);
    }
  }


  // --- Contact Information ---
  if (intentSet.has("contact")) {
    const contact = getContactInformation();
    toolsUsed.push("getContactInformation");
    sections.push(
      `Contact Information:\n` +
        `  Email: ${contact.primaryEmail}\n` +
        `  Website: ${contact.website}\n` +
        `  Instagram: ${contact.instagram}\n` +
        `  Facebook: ${contact.facebook}\n` +
        `  LinkedIn: ${contact.linkedin}\n` +
        `  YouTube: ${contact.youtube}\n` +
        `  Twitter/X: ${contact.twitter}\n` +
        `  Contact Form: ${contact.contactFormUrl}\n` +
        `  For meeting location/schedule, please contact via email or check social media.\n`
    );
  }

  // --- Membership Information ---
  if (intentSet.has("membership")) {
    const mem = getMembershipInformation();
    toolsUsed.push("getMembershipInformation");
    sections.push(
      `Membership Information:\n` +
        `  Eligibility: ${mem.eligibility}\n` +
        `  Age Range: ${mem.ageRange}\n` +
        `  How to Join:\n${mem.howToJoin.map((s) => `    - ${s}`).join("\n")}\n` +
        `  Benefits:\n${mem.benefits.map((b) => `    - ${b}`).join("\n")}\n` +
        `  Fees: ${mem.fees}\n` +
        `  Contact: ${mem.contact}\n`
    );
  }

  // --- Board Members / Team ---
  if (intentSet.has("team") || intentSet.has("president")) {
    const members = await getBoardMembers();
    toolsUsed.push("getBoardMembers");

    if (intentSet.has("president") && !intentSet.has("team")) {
      // Only looking for president — filter
      const pres = members.find((m) =>
        m.role.toLowerCase().includes("president")
      );
      if (pres) {
        sections.push(
          `Current President:\n  ${pres.name} | ${pres.role} (${pres.period})${pres.bio ? ` — ${pres.bio}` : ""}\n`
        );
      } else {
        sections.push("Current President: Not found in database.\n");
      }
    } else {
      sections.push(formatTeamMembers(members, "Current Board Members"));
    }
  }

  // --- Past Presidents ---
  if (intentSet.has("past_presidents")) {
    const past = await getPastPresidents();
    toolsUsed.push("getPastPresidents");
    if (!past.length) {
      sections.push("Past Presidents: No records found.\n");
    } else {
      const lines = past.map((p) => `  - ${p.name} (${p.period})`);
      sections.push(`Past Presidents:\n${lines.join("\n")}\n`);
    }
  }

  // --- Upcoming Events ---
  if (intentSet.has("events_upcoming")) {
    const events = await getUpcomingEvents();
    toolsUsed.push("getUpcomingEvents");
    sections.push(formatEvents(events, "Upcoming Events"));
  }

  // --- Past Events ---
  if (intentSet.has("events_past")) {
    const events = await getPastEvents(5);
    toolsUsed.push("getPastEvents");
    sections.push(formatEvents(events, "Past Events"));
  }

  // --- Projects ---
  if (intentSet.has("projects")) {
    const projects = await searchProjects(effectiveQuery, 6);
    toolsUsed.push("searchProjects");
    sections.push(formatProjects(projects, "Club Projects"));
  }

  // --- Blogs ---
  if (intentSet.has("blogs")) {
    const blogs = await searchBlogs(effectiveQuery, 5);
    toolsUsed.push("searchBlogs");
    sections.push(formatProjects(blogs, "Recent Blog Posts"));
  }

  // --- Announcements ---
  if (intentSet.has("announcements")) {
    const ann = await searchAnnouncements(effectiveQuery, 5);
    toolsUsed.push("searchAnnouncements");
    sections.push(formatProjects(ann, "Recent Announcements / News"));
  }

  // --- Gallery ---
  if (intentSet.has("gallery")) {
    const slides = await getGallery(6);
    toolsUsed.push("getGallery");
    if (!slides.length) {
      sections.push("Gallery: No gallery items found.\n");
    } else {
      const lines = slides.map(
        (s) => `  - ${s.title}${s.caption ? `: ${s.caption}` : ""}`
      );
      sections.push(`Gallery Highlights:\n${lines.join("\n")}\n`);
    }
  }

  // --- Partners ---
  if (intentSet.has("partners")) {
    const partners = await getPartners();
    toolsUsed.push("getPartners");
    if (!partners.length) {
      sections.push("Partners: No partner records found.\n");
    } else {
      sections.push(
        `Partners & Collaborators:\n${partners.map((p) => `  - ${p.name}`).join("\n")}\n`
      );
    }
  }

  // --- General web search fallback ---
  // Only run if no sections found yet, OR if there's a specific search term
  // that hasn't been covered by the intent-specific tools above
  if (
    sections.length === 0 ||
    (!intentSet.has("team") &&
      !intentSet.has("events_upcoming") &&
      !intentSet.has("events_past") &&
      !intentSet.has("projects") &&
      !intentSet.has("club_info") &&
      effectiveQuery.length > 3)
  ) {
    const results = await searchWebsite(effectiveQuery, 5);
    if (results.length) {
      toolsUsed.push("searchWebsite");
      const label = effectiveQuery
        ? `Search Results for "${effectiveQuery}"`
        : "Recent Club Activity";
      sections.push(formatProjects(results, label));
    }
  }

  const context = sections.join("\n---\n\n");

  return {
    context: context || "No specific data was retrieved for this query.",
    toolsUsed,
  };
}
