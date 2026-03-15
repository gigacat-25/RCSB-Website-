import { groq } from "next-sanity";

// ─── EVENTS ───────────────────────────────────────────────
export const upcomingEventsQuery = groq`
  *[_type == "event" && isUpcoming == true] | order(date asc) {
    _id, title, slug, date, location, coverImage, isUpcoming
  }
`;

export const allEventsQuery = groq`
  *[_type == "event"] | order(date desc) {
    _id, title, slug, date, location, coverImage, isUpcoming
  }
`;

export const eventBySlugQuery = groq`
  *[_type == "event" && slug.current == $slug][0] {
    _id, title, slug, date, location, description, coverImage, photoAlbum, isUpcoming
  }
`;

// ─── PROJECTS ─────────────────────────────────────────────
export const allProjectsQuery = groq`
  *[_type == "project"] | order(_createdAt asc) {
    _id, title, slug, description, coverImage, gallery, impactStats
  }
`;

// ─── TEAM ─────────────────────────────────────────────────
export const teamQuery = groq`
  *[_type == "teamMember"] | order(year desc, category asc) {
    _id, name, role, photo, year, category
  }
`;

// ─── BLOG ─────────────────────────────────────────────────
export const allPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id, title, slug, publishedAt, coverImage
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id, title, slug, publishedAt, body, coverImage
  }
`;

// ─── SITE SETTINGS ────────────────────────────────────────
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    heroHeadline, heroSubtext, aboutText, socialLinks
  }
`;
