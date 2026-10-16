-- Run once in the Neon SQL editor for an empty application database.
-- Keep DATABASE_URL server-only. No direct browser access is required.
BEGIN;
CREATE TABLE cards (
 id UUID PRIMARY KEY,
 flower TEXT NOT NULL CHECK (flower IN ('tulip','rose','sunflower','cherry','lavender')),
 theme TEXT NOT NULL CHECK (theme IN ('meadow','blossom','night')),
 recipient TEXT NOT NULL CHECK (char_length(trim(recipient)) BETWEEN 1 AND 60),
 message TEXT NOT NULL CHECK (char_length(trim(message)) BETWEEN 5 AND 500),
 sender TEXT NOT NULL CHECK (char_length(sender)<=40),
 anonymous BOOLEAN NOT NULL DEFAULT FALSE,
 public_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
 share_sender BOOLEAN NOT NULL DEFAULT FALSE,
 status TEXT NOT NULL DEFAULT 'private' CHECK (status IN ('private','pending','approved','rejected')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 edit_hash TEXT NOT NULL CHECK (char_length(edit_hash)=64),
 CHECK ((anonymous AND sender='') OR (NOT anonymous AND char_length(trim(sender))>=1)),
 CHECK (status='private' OR public_opt_in),
 CHECK (NOT anonymous OR NOT share_sender)
);
CREATE INDEX cards_garden_idx ON cards(created_at DESC,id DESC) WHERE status='approved' AND public_opt_in;
CREATE INDEX cards_moderation_idx ON cards(created_at DESC,id DESC) WHERE public_opt_in AND status IN ('pending','approved');
CREATE TABLE rate_limits (
 key TEXT PRIMARY KEY,
 count INTEGER NOT NULL,
 expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX rate_limits_expiry_idx ON rate_limits(expires_at);
COMMIT;
