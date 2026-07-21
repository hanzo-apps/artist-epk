-- Hanzo Base schema for Pressroom (the `databaseSchema` DDL).
--
-- On publish, Hanzo Cloud translates each CREATE TABLE into a Hanzo Base
-- collection via `provisionBaseFromDDL` (additive + idempotent). Base manages
-- `id`/`created`/`updated`/`owner`/`org` itself, so they are never re-declared
-- here; every row is stamped with the verified IAM `owner`+`org` and is
-- org-scoped — the access rule is `@request.auth.org_id = org`, so a member of
-- the artist's org reads/writes it and other orgs cannot see it.
--
-- Keep this file in lockstep with src/lib/records.ts and the Admin form writes.

-- Discography: singles, EPs, albums — cover art, date, streaming link.
CREATE TABLE IF NOT EXISTS releases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  kind TEXT NOT NULL,
  cover_url TEXT NOT NULL,
  release_date TEXT NOT NULL,
  stream_url TEXT NOT NULL
);

-- Tour dates: venue, city, date, ticket link.
CREATE TABLE IF NOT EXISTS shows (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  venue TEXT NOT NULL,
  city TEXT NOT NULL,
  date TEXT NOT NULL,
  ticket_url TEXT NOT NULL
);

-- Downloadable press assets: bio PDF, photo pack, logo, stage rider…
CREATE TABLE IF NOT EXISTS press_assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL,
  file_url TEXT NOT NULL
);
