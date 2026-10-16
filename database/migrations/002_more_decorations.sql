-- Existing databases: run after 001_flower_decorations.sql.
-- Fresh installations use schema.sql instead. Existing cards are preserved.
BEGIN;
ALTER TABLE cards DROP CONSTRAINT IF EXISTS cards_decorations_check;
ALTER TABLE cards ADD CONSTRAINT cards_decorations_check CHECK (
 decorations <@ ARRAY['ribbon','butterflies','hearts','sparkles','fireflies','petals','bees','cranes','music']::text[]
 AND cardinality(decorations)<=3 AND array_position(decorations,NULL) IS NULL
);
COMMIT;
