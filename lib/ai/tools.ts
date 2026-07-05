/**
 * Swarna AI – RAG Backend Tools
 *
 * Each tool fetches sanitized, relevant data from the Cloudflare Worker API.
 * Tools NEVER expose: internal IDs beyond reference, private emails, auth tokens,
 * or any field not intended for public display.
 *
 * All tools return plain serializable objects suitable for context building.
 */

const WORKER_URL =
  process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL ||
  "https://rcsb-api-worker.impact1-iceas.workers.dev";

// Generic public fetch — always fresh (no-store so AI never serves stale board/team data)
async function publicFetch<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${WORKER_URL}${endpoint}`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// TYPE DEFINITIONS (sanitized — only public fields)
// ---------------------------------------------------------------------------

export interface PublicProject {
  title: string;
  slug: string;
  category: string;
  year: string;
  description: string;
  type: string;
  status: string;
  event_date?: string | null;
  rsvp_link?: string | null;
}

export interface PublicTeamMember {
  name: string;
  role: string;
  period: string;
  bio?: string | null;
}

export interface PublicPastPresident {
  name: string;
  period: string;
}

export interface PublicGallerySlide {
  title: string;
  caption?: string | null;
}

export interface PublicPartner {
  name: string;
}

// ---------------------------------------------------------------------------
// RAW API response shapes
// ---------------------------------------------------------------------------

interface RawProject {
  id: number;
  title: string;
  slug: string;
  category: string;
  year: string;
  description: string;
  type: string;
  status: string;
  event_date?: string | null;
  rsvp_link?: string | null;
  content?: string;
  image_url?: string;
  author_email?: string;
  gallery_urls?: string;
  created_at?: string;
  updated_at?: string;
  comment_count?: number;
}

interface RawTeamMember {
  id: number;
  name: string;
  role: string;
  period: string;
  bio?: string | null;
  image_url?: string | null;
  order_index?: number;
  created_at?: string;
}

interface RawPastPresident {
  id: number;
  name: string;
  period: string;
  image_url?: string | null;
  order_index?: number;
  created_at?: string;
}

interface RawGallerySlide {
  id: number;
  title: string;
  caption?: string | null;
  image_url?: string;
  order_index?: number;
  created_at?: string;
}

interface RawPartner {
  id: number;
  name: string;
  image_url?: string;
  order_index?: number;
  created_at?: string;
}

// ---------------------------------------------------------------------------
// SANITIZER HELPERS
// ---------------------------------------------------------------------------

function sanitizeProject(p: RawProject): PublicProject {
  return {
    title: p.title,
    slug: p.slug,
    category: p.category,
    year: p.year,
    description: p.description,
    type: p.type,
    status: p.status,
    event_date: p.event_date || null,
    rsvp_link: p.rsvp_link || null,
  };
}

function sanitizeTeamMember(m: RawTeamMember): PublicTeamMember {
  return {
    name: m.name,
    role: m.role,
    period: m.period,
    bio: m.bio || null,
  };
}

function sanitizePastPresident(p: RawPastPresident): PublicPastPresident {
  return {
    name: p.name,
    period: p.period,
  };
}

function sanitizeGallerySlide(g: RawGallerySlide): PublicGallerySlide {
  return {
    title: g.title,
    caption: g.caption || null,
  };
}

function sanitizePartner(p: RawPartner): PublicPartner {
  return { name: p.name };
}

// Full-text search helper (client-side since D1 doesn't expose FTS over public API)
function matchesQuery(text: string, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return text.toLowerCase().includes(q);
}

// ---------------------------------------------------------------------------
// TOOL 1: Get Upcoming Events
// ---------------------------------------------------------------------------

export async function getUpcomingEvents(): Promise<PublicProject[]> {
  const all = await publicFetch<RawProject[]>("/api/projects");
  if (!all) return [];
  return all
    .filter(
      (p) =>
        p.type === "event" &&
        (p.status === "upcoming" || p.status === "ongoing")
    )
    .map(sanitizeProject)
    .slice(0, 5); // Limit to 5 for context size
}

// ---------------------------------------------------------------------------
// TOOL 2: Get Past Events
// ---------------------------------------------------------------------------

export async function getPastEvents(limit = 5): Promise<PublicProject[]> {
  const all = await publicFetch<RawProject[]>("/api/projects");
  if (!all) return [];
  return all
    .filter(
      (p) =>
        p.type === "event" &&
        p.status === "completed"
    )
    .map(sanitizeProject)
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// TOOL 3: Search Projects
// ---------------------------------------------------------------------------

export async function searchProjects(query: string, limit = 5): Promise<PublicProject[]> {
  const all = await publicFetch<RawProject[]>("/api/projects");
  if (!all) return [];
  return all
    .filter(
      (p) =>
        p.type === "project" &&
        p.status !== "trash" &&
        (matchesQuery(p.title, query) ||
          matchesQuery(p.description, query) ||
          matchesQuery(p.category, query))
    )
    .map(sanitizeProject)
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// TOOL 4: Search Blogs
// ---------------------------------------------------------------------------

export async function searchBlogs(query: string, limit = 5): Promise<PublicProject[]> {
  const all = await publicFetch<RawProject[]>("/api/projects");
  if (!all) return [];
  return all
    .filter(
      (p) =>
        p.type === "blog" &&
        p.status !== "trash" &&
        (matchesQuery(p.title, query) ||
          matchesQuery(p.description, query))
    )
    .map(sanitizeProject)
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// TOOL 5: Get Board Members (current team)
// ---------------------------------------------------------------------------

export async function getBoardMembers(): Promise<PublicTeamMember[]> {
  const all = await publicFetch<RawTeamMember[]>("/api/team");
  if (!all) return [];
  return all.map(sanitizeTeamMember);
}

// ---------------------------------------------------------------------------
// TOOL 6: Get Member by Role (e.g. "President", "Secretary")
// ---------------------------------------------------------------------------

export async function getMemberByRole(role: string): Promise<PublicTeamMember | null> {
  const all = await publicFetch<RawTeamMember[]>("/api/team");
  if (!all) return null;
  const found = all.find((m) =>
    m.role.toLowerCase().includes(role.toLowerCase())
  );
  return found ? sanitizeTeamMember(found) : null;
}

// ---------------------------------------------------------------------------
// TOOL 7: Get Past Presidents
// ---------------------------------------------------------------------------

export async function getPastPresidents(): Promise<PublicPastPresident[]> {
  const all = await publicFetch<RawPastPresident[]>("/api/past-presidents");
  if (!all) return [];
  return all.map(sanitizePastPresident);
}

// ---------------------------------------------------------------------------
// TOOL 8: Get Club Information (structured static knowledge)
// ---------------------------------------------------------------------------

export interface ClubInformation {
  name: string;
  fullName: string;
  district: string;
  founded: string;
  historicalNote: string;
  mission: string;
  about: string;
  website: string;
  socialMedia: Record<string, string>;
  meetingInfo: string;
  contactEmail: string;
  avenues: string[];
}

export function getClubInformation(): ClubInformation {
  return {
    name: "Rotaract Club of Swarna Bengaluru",
    fullName: "Rotaract Club of Swarna Bengaluru",
    district: "RI District 3192",
    founded:
      "The exact founding year is stored in the past presidents' records. The club operates under Rotary International District 3192 in Bengaluru, Karnataka, India.",
    historicalNote:
      "To determine the club's age or founding year, refer to the Past Presidents list provided in context — the earliest presidency period indicates when the club was established. Each Rotaract year runs from July to June.",
    mission:
      "Developing youth leadership through community service, professional development, fellowship, and international understanding.",
    about:
      "The Rotaract Club of Swarna Bengaluru (RCSB) is a dynamic youth organization under Rotary International District 3192. We bring together young professionals and students aged 18-30 to take meaningful action to create lasting change in our communities and ourselves through service, leadership, and fellowship.",
    website: "https://rotaractswarnabengaluru.in",
    socialMedia: {
      Instagram: "https://www.instagram.com/rotaract_swarnabengaluru",
      Facebook: "https://www.facebook.com/rotaractswarnabengaluru/",
      LinkedIn:
        "https://www.linkedin.com/company/rotaract-club-of-swarna-bengaluru/",
      YouTube: "https://www.youtube.com/channel/UCE4XQBKSjPs8rj5xyH6FOxA",
      Twitter: "https://x.com/RCSwarnaB",
    },
    meetingInfo:
      "For weekly meeting schedule and location, please contact us at rota.rcsb@gmail.com or check our social media pages for the latest updates.",
    contactEmail: "rota.rcsb@gmail.com",
    avenues: [
      "Community Service",
      "International Service",
      "Professional Development",
      "Club Service",
      "The Environment",
      "Youth Service",
    ],
  };
}

// ---------------------------------------------------------------------------
// TOOL 9: Get Gallery Highlights
// ---------------------------------------------------------------------------

export async function getGallery(limit = 8): Promise<PublicGallerySlide[]> {
  const all = await publicFetch<RawGallerySlide[]>("/api/gallery");
  if (!all) return [];
  return all.map(sanitizeGallerySlide).slice(0, limit);
}

// ---------------------------------------------------------------------------
// TOOL 10: Get Partners
// ---------------------------------------------------------------------------

export async function getPartners(): Promise<PublicPartner[]> {
  const all = await publicFetch<RawPartner[]>("/api/partners");
  if (!all) return [];
  return all.map(sanitizePartner);
}

// ---------------------------------------------------------------------------
// TOOL 11: Get Membership Information
// ---------------------------------------------------------------------------

export interface MembershipInfo {
  eligibility: string;
  ageRange: string;
  howToJoin: string[];
  benefits: string[];
  fees: string;
  contact: string;
}

export function getMembershipInformation(): MembershipInfo {
  return {
    eligibility:
      "Open to young professionals and students aged 18 to 30 years who are committed to service, leadership, and fellowship.",
    ageRange: "18–30 years",
    howToJoin: [
      "Visit our website at rotaractswarnabengaluru.in",
      "Reach out to us via email at rota.rcsb@gmail.com",
      "Follow us on Instagram @rotaract_swarnabengaluru for updates",
      "Attend one of our club meetings or events as a guest",
      "Fill out the membership application form (available on request)",
    ],
    benefits: [
      "Leadership development opportunities",
      "Networking with professionals and Rotarians",
      "Community service participation",
      "International exposure through RI District 3192",
      "Fellowship and lifelong friendships",
      "Professional development workshops and events",
      "Access to Rotary International resources and programs",
    ],
    fees:
      "Membership fees information is available upon inquiry. Please contact us at rota.rcsb@gmail.com for current fee structure.",
    contact: "rota.rcsb@gmail.com",
  };
}

// ---------------------------------------------------------------------------
// TOOL 12: Get Contact Information
// ---------------------------------------------------------------------------

export interface ContactInfo {
  primaryEmail: string;
  website: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  youtube: string;
  twitter: string;
  contactFormUrl: string;
}

export function getContactInformation(): ContactInfo {
  return {
    primaryEmail: "rota.rcsb@gmail.com",
    website: "https://rotaractswarnabengaluru.in",
    instagram: "https://www.instagram.com/rotaract_swarnabengaluru",
    facebook: "https://www.facebook.com/rotaractswarnabengaluru/",
    linkedin:
      "https://www.linkedin.com/company/rotaract-club-of-swarna-bengaluru/",
    youtube: "https://www.youtube.com/channel/UCE4XQBKSjPs8rj5xyH6FOxA",
    twitter: "https://x.com/RCSwarnaB",
    contactFormUrl: "https://rotaractswarnabengaluru.in/contact",
  };
}

// ---------------------------------------------------------------------------
// TOOL 13: Search Announcements (blogs + events + projects by recency)
// ---------------------------------------------------------------------------

export async function searchAnnouncements(query: string, limit = 5): Promise<PublicProject[]> {
  const all = await publicFetch<RawProject[]>("/api/projects");
  if (!all) return [];
  return all
    .filter(
      (p) =>
        p.status !== "trash" &&
        (matchesQuery(p.title, query) ||
          matchesQuery(p.description, query))
    )
    .map(sanitizeProject)
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// TOOL 14: Search All Content (cross-type search)
// ---------------------------------------------------------------------------

export async function searchWebsite(query: string, limit = 6): Promise<PublicProject[]> {
  const all = await publicFetch<RawProject[]>("/api/projects");
  if (!all) return [];
  return all
    .filter(
      (p) =>
        p.status !== "trash" &&
        (matchesQuery(p.title, query) ||
          matchesQuery(p.description, query) ||
          matchesQuery(p.category, query) ||
          matchesQuery(p.type, query))
    )
    .map(sanitizeProject)
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// TOOL 15: Get Awards
// Fetches entries of type='award' from the projects table
// ---------------------------------------------------------------------------

export async function getAwards(query: string, limit = 6): Promise<PublicProject[]> {
  const all = await publicFetch<RawProject[]>("/api/projects");
  if (!all) return [];
  return all
    .filter(
      (p) =>
        p.type === "award" &&
        p.status !== "trash" &&
        (matchesQuery(p.title, query) ||
          matchesQuery(p.description, query) ||
          matchesQuery(p.category, query))
    )
    .map(sanitizeProject)
    .slice(0, limit);
}
