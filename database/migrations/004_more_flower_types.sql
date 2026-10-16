-- Run on existing Neon databases to enable the additional flower varieties.
-- Fresh installations already include these values in schema.sql.
BEGIN;
ALTER TABLE cards DROP CONSTRAINT IF EXISTS cards_flower_check;
ALTER TABLE cards ADD CONSTRAINT cards_flower_check CHECK (flower IN (
 'tulip','rose','sunflower','cherry','lavender','daisy','lily','lotus','orchid','hydrangea','peony','cosmos',
 'iris','daffodil','poppy','marigold','hibiscus','bluebell'
));
COMMIT;
