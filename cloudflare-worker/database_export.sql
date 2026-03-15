PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE projects (
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
, type TEXT DEFAULT 'project', status TEXT DEFAULT 'completed', gallery_urls TEXT DEFAULT '[]', author_email TEXT);
INSERT INTO "projects" ("id","title","slug","category","year","description","image_url","content","created_at","updated_at","type","status","gallery_urls","author_email") VALUES(1,'RYLA 2026 – Rotary Youth Leadership Awards','ryla-2026','Leadership','2026','Empowering young scouts and guides with leadership skills.','https://rcsb-api-worker.impact1-iceas.workers.dev/media/1773600949992-womens_day_poster.png','','2026-03-15 16:38:42','2026-03-15 18:55:53','project','completed','[]',NULL);
INSERT INTO "projects" ("id","title","slug","category","year","description","image_url","content","created_at","updated_at","type","status","gallery_urls","author_email") VALUES(2,'Project SPARSHA – Touch of Hope','sparsha','Social Service','2024','Flagship initiative focusing on health and well-being.','https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80','dwkahjwakljhdlawhdlahslkdjhwa','2026-03-15 16:38:42','2026-03-15 18:38:03','project','completed','[]',NULL);
INSERT INTO "projects" ("id","title","slug","category","year","description","image_url","content","created_at","updated_at","type","status","gallery_urls","author_email") VALUES(4,'chess tournment','chess-tournment','Social Service','2026','dawdawdawda','https://rcsb-api-worker.impact1-iceas.workers.dev/media/1773603317339-download.png','Full details for the chess tournament.','2026-03-15 19:00:02','2026-03-15 19:35:21','event','completed',NULL,NULL);
INSERT INTO "projects" ("id","title","slug","category","year","description","image_url","content","created_at","updated_at","type","status","gallery_urls","author_email") VALUES(5,'RYLA 2024','ryla-2024','Club Stories','2024','An amazing experience at RYLA 2024. Learning leadership and community service.','https://picsum.photos/800/400',replace('# Welcome to RYLA 2024\nThis was an incredible event with lots of learning and fun!\nWe are proud of our participants.','\n',char(10)),'2026-03-15 19:19:32','2026-03-15 19:23:07','blog','completed','["https://rcsb-api-worker.impact1-iceas.workers.dev/media/1773602579450-WhatsApp_Image_2026-03-13_at_7.01.50_PM.jpeg","https://rcsb-api-worker.impact1-iceas.workers.dev/media/1773602584847-WhatsApp_Image_2026-03-13_at_7.01.51_PM.jpeg"]',NULL);
INSERT INTO "projects" ("id","title","slug","category","year","description","image_url","content","created_at","updated_at","type","status","gallery_urls","author_email") VALUES(11,'Direct Worker Test','direct-worker-test','Club Stories','2026','Testing worker RBAC directly.','https://rcsb-api-worker.impact1-iceas.workers.dev/media/1773610561306-Shree_Ragavendra_Enterprises_logo_design.png','This post bypasses Next.js to test the worker''s SQL rules.','2026-03-15 21:34:40','2026-03-15 21:36:03','blog','completed','[]','pabt2024@gmail.com');
CREATE TABLE team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    period TEXT NOT NULL, -- e.g. "2024-25"
    image_url TEXT,
    bio TEXT,
    order_index INTEGER DEFAULT 0, -- To control display order
    created_at TEXT DEFAULT (datetime('now'))
);
INSERT INTO "team_members" ("id","name","role","period","image_url","bio","order_index","created_at") VALUES(1,'Rtr. Harshith Kumar','President','2024-25','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop','Passionate about youth empowerment.',1,'2026-03-15 16:38:42');
INSERT INTO "team_members" ("id","name","role","period","image_url","bio","order_index","created_at") VALUES(2,'Rtr. Ananya Sharma','Secretary','2024-25','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop','Organizing impact.',2,'2026-03-15 16:38:42');
CREATE TABLE comments (id INTEGER PRIMARY KEY AUTOINCREMENT, project_id INTEGER NOT NULL, user_name TEXT NOT NULL, user_email TEXT NOT NULL, user_image TEXT, content TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE);
INSERT INTO "comments" ("id","project_id","user_name","user_email","user_image","content","created_at") VALUES(1,5,'Thejaswin P','thejaswinps@gmail.com','https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zQXpNcHlkN01OM0hBWjFxSmhLakwwSlZDbUgifQ','testTest Comment Fixed','2026-03-15 19:51:04');
CREATE TABLE authorized_admins (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, role TEXT DEFAULT 'blogger', name TEXT, created_at TEXT DEFAULT (datetime('now')));
INSERT INTO "authorized_admins" ("id","email","role","name","created_at") VALUES(1,'thejaswinps@gmail.com','admin','Thejaswin','2026-03-15 21:30:12');
INSERT INTO "authorized_admins" ("id","email","role","name","created_at") VALUES(2,'pabt2024@gmail.com','admin','PABT','2026-03-15 21:30:12');
INSERT INTO "authorized_admins" ("id","email","role","name","created_at") VALUES(3,'impact1.iceas@gmail.com','admin','Impact1','2026-03-15 21:30:12');
INSERT INTO "authorized_admins" ("id","email","role","name","created_at") VALUES(4,'voldie@google.com','admin','Voldie','2026-03-15 21:30:12');
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('projects',13);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('team_members',2);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('contact_submissions',9);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('comments',1);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('authorized_admins',4);
