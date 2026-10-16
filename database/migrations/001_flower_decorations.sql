-- Existing Neon databases only. New installations should run schema.sql instead.
-- Existing cards keep their original flower and start with no decorations.
BEGIN;
ALTER TABLE cards DROP CONSTRAINT IF EXISTS cards_flower_check;
ALTER TABLE cards ADD CONSTRAINT cards_flower_check CHECK (flower IN (
 'tulip','rose','sunflower','cherry','lavender','daisy','lily','lotus','orchid','hydrangea','peony','cosmos'
));
ALTER TABLE cards ADD COLUMN IF NOT EXISTS decorations TEXT[] NOT NULL DEFAULT '{}'
 CHECK (decorations <@ ARRAY['ribbon','butterflies','hearts','sparkles','fireflies','petals']::text[]
   AND cardinality(decorations)<=3 AND array_position(decorations,NULL) IS NULL);
COMMIT;
