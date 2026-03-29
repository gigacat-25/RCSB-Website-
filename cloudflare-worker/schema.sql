-- Contact submissions from the public form
CREATE TABLE IF NOT EXISTS contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    created_at TEXT DEFAULT (datetime('now'))
);

-- Authorized Admins for Role-Based Access Control
CREATE TABLE IF NOT EXISTS authorized_admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'blogger', -- 'admin' or 'blogger'
    name TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Projects showcase (includes Blogs and Events)
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    year TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    content TEXT, -- Markdown content for the details page
    type TEXT DEFAULT 'project', -- 'project', 'blog', or 'event'
    status TEXT DEFAULT 'completed', -- 'upcoming', 'ongoing', 'completed'
    author_email TEXT, -- The email of the person who created this content
    gallery_urls TEXT DEFAULT '[]', -- JSON array of image URLs
    rsvp_link TEXT, -- Optional RSVP or ticket link
    event_date TEXT, -- Optional date of the event
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Blog Comments
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_image TEXT,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Team members / Board of Directors
CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    period TEXT NOT NULL, -- e.g. "2024-25"
    image_url TEXT,
    bio TEXT,
    order_index INTEGER DEFAULT 0, -- To control display order
    created_at TEXT DEFAULT (datetime('now'))
);

-- Past Presidents
CREATE TABLE IF NOT EXISTS past_presidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    period TEXT NOT NULL, -- e.g. "2023-24"
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Partners/collaborators
CREATE TABLE IF NOT EXISTS partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    image_url TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Dynamic homepage gallery slides
CREATE TABLE IF NOT EXISTS gallery_slides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    caption TEXT,
    image_url TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Newsletter audience and tracking
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    token TEXT UNIQUE NOT NULL,
    clerk_id TEXT UNIQUE, -- Added for account deletion automation
    subscribed INTEGER DEFAULT 1, -- 1 for active, 0 for unsubscribed
    created_at TEXT DEFAULT (datetime('now'))
);

-- Initial Mock Projects Data
INSERT OR IGNORE INTO projects (title, slug, category, year, description, image_url) VALUES 
('RYLA 2026 – Rotary Youth Leadership Awards', 'ryla-2026', 'Leadership', '2026', 'Empowering young scouts and guides with leadership skills.', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'),
('Project SPARSHA – Touch of Hope', 'sparsha', 'Social Service', '2024', 'Flagship initiative focusing on health and well-being.', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80');

-- Initial Mock Team Data
INSERT OR IGNORE INTO team_members (name, role, period, bio, image_url, order_index) VALUES 
('Rtr. Harshith Kumar', 'President', '2024-25', 'Passionate about youth empowerment.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', 1),
('Rtr. Ananya Sharma', 'Secretary', '2024-25', 'Organizing impact.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', 2);
