# Verification

Completed locally on 15 October 2026.

Sequential creator and garden placement update: the editor now shows one panel at a time (flower, background, decorations, content, then send). All 17 tests passed, covering panel boundaries, preserved content, all nine decorations, garden coordinate validation, moderation visibility, coordinate persistence, and repeatable migrations that preserve existing cards. TypeScript passed. The bow knot was centered on the shared stem and raised to just below the bloom. Bees have separate flight, wing, and pollen timelines with turns along the flight route. Garden flowers are larger and use stored free-placement coordinates rather than a grid. Existing Neon databases need migrations 002 and 003 after 001; no live Neon schema was changed by the assistant.

Pixel landscape update: edited directly in `outputs/petals-of-code`. TypeScript and the Next.js production build passed. Browser checks created cards with all three illustrated themes and exported each to a 1080 × 1510 PNG. The exported sunny hills, cherry-blossom garden, and moonlit lake were visually checked with Vietnamese recipient, message, and sender text. Each includes its selected flower and butterfly decoration. Theme thumbnails and the live letter use the same scene components as the PNG export. Checks used an isolated in-memory PGlite database; the existing `.env.local` was preserved and live Neon data was untouched. No new database migration or deployment is required for this update.

Decoration animation update: edited directly in `outputs/petals-of-code`. TypeScript and the production build passed for the new components. Browser checks confirmed each of the six decorations uses its own animation timeline, the pause control freezes sprite parts, replay restarts the scene, and the faster timings are active: butterfly wings 0.48 seconds, heart cycle 3.15 seconds, stars 2.61 seconds, firefly pulse 2.7 seconds, petal face flip 1.2 seconds, and bow sequence 4 seconds. CSS speed changes were checked in the running browser after the component build. Reduced motion defaults to still artwork and allows explicit per-card playback. PNG export disables animation on a cloned SVG. This update needs no additional database migration.

Flower and decoration update: migrated into `outputs/petals-of-code`, which is now the working project folder. TypeScript checks and all 12 backend tests passed from that folder. Coverage includes all 12 flower choices, combined decorations, invalid selections, and preservation of existing cards through the Neon migration. The migration file is included but has not been applied to a live Neon database. The existing `.env.local` was preserved.

- Next.js production build: passed, including TypeScript checking.
- Backend suite: 9 tests passed using the real route handlers and SQL schema with in-memory PGlite.
- Browser flow: selected a flower/theme, entered Vietnamese text, saved a card, completed the bloom reveal, and reopened its server-backed sharing link in a fresh tab.
- Public opt-in: displayed a pending-moderation confirmation. Automated tests verified pending cards stay hidden, approval makes them visible, hiding removes them, and sender privacy survives direct card lookup.
- QR generation: produced a PNG and displayed the generated QR image.
- PNG export: generated and visually inspected a 1080 × 1350 card with the selected sunflower, blossom theme, correct Vietnamese text, and sender.
- Responsive layout: visually checked desktop at 1366 × 900 and a phone layout at 390 × 844.
- Export controls provide a visible image/download link in addition to attempting an automatic download.

The browser tests used an isolated local Postgres transport adapter, not a hosted Neon account. That adapter and all test data are excluded from this source package. No production deployment was made.

Still required after your setup: apply the SQL schema to Neon, configure the environment variables, verify the real Neon connection, and test a shared URL from another device on your final Vercel production domain.
