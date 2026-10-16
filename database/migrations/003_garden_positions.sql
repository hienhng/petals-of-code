-- Run after the earlier migrations on an existing Neon database.
-- Keeps all existing cards; older flowers use a stable visual fallback.
BEGIN;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS garden_x DOUBLE PRECISION;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS garden_y DOUBLE PRECISION;
ALTER TABLE cards DROP CONSTRAINT IF EXISTS cards_garden_position_check;
ALTER TABLE cards ADD CONSTRAINT cards_garden_position_check CHECK (
 (garden_x IS NULL AND garden_y IS NULL) OR
 (garden_x IS NOT NULL AND garden_y IS NOT NULL AND garden_x BETWEEN 12 AND 88 AND garden_y BETWEEN 25 AND 94)
);
COMMIT;
