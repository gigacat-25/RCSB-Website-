-- Contact submissions from the public form
CREATE TABLE IF NOT EXISTS contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    created_at TEXT DEFAULT (datetime('now'))
);

-- Projects showcase
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    year TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    content TEXT, -- Markdown content for the details page
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
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

-- Initial Mock Projects Data
INSERT OR IGNORE INTO projects (title, slug, category, year, description, image_url) VALUES 
('RYLA 2026 – Rotary Youth Leadership Awards', 'ryla-2026', 'Leadership', '2026', 'Empowering young scouts and guides with leadership skills.', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'),
('Project SPARSHA – Touch of Hope', 'sparsha', 'Social Service', '2024', 'Flagship initiative focusing on health and well-being.', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80');

-- Initial Mock Team Data
INSERT OR IGNORE INTO team_members (name, role, period, bio, image_url, order_index) VALUES 
('Rtr. Harshith Kumar', 'President', '2024-25', 'Passionate about youth empowerment.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', 1),
('Rtr. Ananya Sharma', 'Secretary', '2024-25', 'Organizing impact.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', 2);
