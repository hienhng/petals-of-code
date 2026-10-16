# Petals of Code

A handcrafted pixel-art greeting-card garden for THCS&THPT Lương Thế Vinh, celebrating Vietnamese Women's Day, **20 October 2026**. The project is created by Lương Thế Vinh Tân Triều Programming Club.

**This project has not been deployed.** It is prepared for your later Vercel deployment with Neon Postgres.

## Run locally

Requires Node.js 22.13 or newer.

```sh
npm ci
# Copy .env.example to .env.local and fill in your real values.
npm run dev
```

Open the local URL printed by Next.js. You can explore the artwork, flower choices, themes, and live preview without a database. Saving cards, sharing links, the school garden, and moderation require Neon. The app reports this explicitly; it never pretends an unsaved card has a working sharing URL.

## Configure Neon

**Upgrading an existing database for the expanded flowers and decorations:** run `database/migrations/001_flower_decorations.sql` in the Neon SQL Editor before using the updated app. This preserves existing cards and gives them an empty decoration selection. Do not rerun `schema.sql` on an existing database. Fresh databases should use the updated `schema.sql` instead.

**Latest upgrade:** after migration 001, run `002_more_decorations.sql` and then `003_garden_positions.sql` in the Neon SQL Editor. These preserve your cards, enable bees/paper cranes/music, and store each user's chosen garden position. If 001 is already applied, only run 002 and 003. Fresh databases need only the current `schema.sql`.

1. Create a Neon project and database. Use a separate branch/database for local development and tests if you also have production data.
2. Open the Neon SQL Editor and run **`database/schema.sql` once** against the empty application database. It creates `cards`, `rate_limits`, constraints, and indexes. Do not replay it against existing tables.
3. Copy the connection string from Neon's Connect dialog to the server-only `DATABASE_URL` environment variable. Keep `sslmode=require` (and any other connection parameters Neon provides).
4. Run the app and create a card. Open its link in a second browser to verify persistence before inviting students.

The backend uses the official [Neon serverless driver](https://neon.com/docs/serverless/serverless-driver) with parameterized queries. Browsers never receive the database credentials. No Supabase, Cloudflare D1, Sites account, or custom OAuth provider is required.

## Configure moderation

Set these **server-only** variables in `.env.local`, and later in Vercel Project Settings → Environment Variables:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Your Neon Postgres connection string |
| `ADMIN_PASSWORD` | Unique school garden moderator password, at least 16 characters |
| `ADMIN_SESSION_SECRET` | Independent random secret, at least 32 characters |
| `CARD_RATE_LIMIT` | Optional, defaults to 20 cards per hour per network identity |

Generate an independent random value for the password and session secret with your password manager, or run this locally twice:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Do not commit `.env.local`, paste secrets into client code, or use `NEXT_PUBLIC_` prefixes. All moderation is denied until both admin variables are configured. Open `/admin` and log in with the configured password. Sessions last one hour and use a signed, HttpOnly, SameSite=Strict cookie (Secure in production). Changing either the password or session secret invalidates existing sessions. Login attempts are limited to five per 15-minute window per network identity.

The paginated admin queue allows approving and hiding submissions. Hiding a greeting removes it from the public garden; its unique card link remains accessible. This is a small single-moderator interface, not a multi-user identity system.

## Deploy to Vercel when ready

1. Push this folder to your Git repository and import it into Vercel.
2. Select the **Next.js** framework and Node.js **22.x** (or a later supported LTS).
3. Use `npm ci` to install and `npm run build` to build. Keep Next.js's default output configuration.
4. Add the environment variables above to the intended Vercel environments. Use a separate Neon branch for Preview deployments if needed.
5. Apply the SQL schema to the target Neon database before inviting users.
6. Deploy from Vercel yourself. Ensure the intended audience can access the chosen production domain; deployment protection can prevent recipients from opening links.

Card URLs use the domain on which the card was created. Create final cards on the production domain, not a temporary preview URL. The app uses [Vercel's trusted forwarding header](https://vercel.com/docs/headers/request-headers) for rate limits when `VERCEL=1`. On a local or other deployment, it deliberately uses a shared local rate bucket rather than trusting user-supplied IP headers. Adapt this policy before hosting behind a different proxy.

## Included experience

- Vietnamese interface and correctly rendered Vietnamese text; bundled fonts, no font-service dependency.
- Custom pixel-grid SVG trees, clouds, flowers, letterbox, and butterfly.
- Twelve flower sprites (including daisy, lily, lotus, orchid, hydrangea, peony, and cosmos), three backgrounds, live preview, Vietnamese starter messages, optional anonymous sender.
- Three illustrated pixel landscapes fill the letter canvas: sunny stepped hills and a flower-lined path, cherry trees around a pond and bridge, and a moonlit mountain lake with a glowing cottage. Theme choices show miniature scene previews. A translucent paper panel keeps the message readable, and PNG downloads include the same scenery.
- Five focused creator panels: flower → background → decorations → content → send. Back navigation keeps all choices. Every flower has a sourced botanical fact and a separately labeled suggested sentiment.
- Nine combinable pixel decorations: bows, butterflies, hearts, sparkles, fireflies, petals, bees, paper cranes, and musical notes. Choose up to three; selections persist in saved cards, shared links, the school garden, and PNG exports. Bees circle the flower and turn along their route; the bow is tied higher on the stem beneath the bloom.
- Each decoration has its own animated sprite parts: articulated butterfly wings, heart bursts, star sparks, pulsing firefly lanterns, tumbling petal faces, and unfolding bow loops. Effects use brisk timings (0.48-second butterfly flaps; most scene cycles around 2.6–4 seconds). Each letter has replay and pause controls. Reduced motion defaults to a still scene, with an explicit button to play only that card's effects. PNGs retain a complete still composition; garden thumbnails remain still for performance.
- Seed-to-bloom reveal, quiet-by-default sound, keyboard controls, and reduced-motion support.
- Server-persisted UUID card links, downloadable QR codes, and canvas-rendered PNG cards.
- Opt-in school garden with approved greetings only, 24 flowers per page, and accessible message dialogs.
- Users choose their garden spot by clicking, dragging, or using arrow keys on a map before public submission. Approved flowers retain those coordinates across reloads. Larger flowers appear in a free garden layout; older cards without coordinates have a stable fallback position.
- No fabricated participation counts, seed messages, or local-storage-only sharing.

## Privacy and operational behavior

- **Anyone with a card's unguessable URL can read it.** The cards are private by obscurity of their bearer links, not end-to-end encrypted. Do not use them for confidential information.
- Cards start private. Public submission is a separate, explicit opt-in and always enters `pending` moderation.
- Public opt-in discloses the recipient and message. The sender nickname remains hidden unless separately permitted; direct links to publicly submitted cards also respect that choice.
- Anonymous cards persist an empty sender name. The API never exposes edit hashes or rate-limit identities.
- Only the creating page receives the random edit token required to submit a private card. That token is held in memory; reloading loses the ability to submit that card to the garden. The sharing link continues to work.
- Mutating requests enforce same-origin checks. Server validation and database constraints enforce allowed flowers/themes and message/name limits.
- Rate-limit keys are HMAC hashes, expire after their windows, and are removed during subsequent successful rate-limit checks. No raw IP addresses are saved.
- Students on a shared school network share a rate bucket. Review the default `CARD_RATE_LIMIT` for the event's expected traffic.
- No analytics or external media requests are included. All images and fonts are bundled.

## Checks

```sh
npm run typecheck
npm test
npm run build
```

The test suite runs the actual route handlers and Postgres schema against an in-memory PGlite database. The Neon transport alone is substituted in tests; no test content is sent to a hosted database. Tests cover persistence, private/pending/approved visibility, sender redaction, opt-in authorization, validation, rate limits, moderator sessions, and missing configuration.

An actual Neon connection and a cross-device test on your final Vercel domain still need to be performed once you configure your credentials and deploy.

## Key files

- `app/petals.tsx` — garden, creator, preview, exports, sharing.
- `app/maker-panel.tsx` / `app/maker.css` / `lib/flower-stories.ts` — sequential creator panels and sourced flower stories.
- `app/garden-placement.tsx` / `lib/garden-position.ts` / `app/garden-size.css` — position picker, persisted coordinates, and larger garden flowers.
- `app/pixel-art.tsx` / `app/globals.css` — original pixel artwork and responsive design.
- `app/card-art.tsx` / `app/decoration-animations.css` — decoration sprite parts, particles, and individual animation timelines.
- `app/letter-scenery.tsx` / `app/letter-scenery.css` — pixel landscape backgrounds, paper overlay, and theme thumbnails.
- `lib/export-letter.ts` — PNG rendering of the scenery, flower, decorations, and wrapped Vietnamese text.
- `app/api/cards/route.ts` — card storage, garden queries, public submission.
- `app/api/admin/` / `app/admin/page.tsx` — authenticated moderation.
- `lib/server.ts` — Neon connection, request guards, rate limits, sessions.
- `database/schema.sql` — Neon schema.
- `tests/backend.test.ts` — backend behavior tests.
