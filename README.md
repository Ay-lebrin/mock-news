# Skaet News API (mock) — replacement for the expired mockapi.io endpoint

This is a small Express server that replicates every endpoint from the
Frontend Intern assessment brief, so candidates have a working API to build
against. Data lives in memory and resets whenever the server restarts —
that's expected for a test API.

## Endpoints

Base URL once running: `http://localhost:3000` (or your deployed URL)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/news` | Get all news |
| GET | `/news?page=1&limit=10` | Get paginated news |
| GET | `/news/:id` | Get news by ID |
| POST | `/news` | Add news item |
| PUT | `/news/:id` | Update news item |
| DELETE | `/news/:id` | Delete news item |
| GET | `/news/:id/images` | Get images for news |
| POST | `/news/:id/images` | Add image to news |
| DELETE | `/news/:id/images/:imageId` | Delete image from news |
| GET | `/news/:id/comments` | Get comments on a news item |
| POST | `/news/:id/comments` | Add comment to news |
| PUT | `/news/:id/comments/:commentId` | Edit comment on a news item |
| DELETE | `/news/:id/comments/:commentId` | Delete comment on news item |

Seed data includes 5 news items, one with no images/comments (for empty-state
testing), one intentionally broken image URL (for broken-image handling),
and one comment with no avatar.

**Bonus:** add `?fail=1` to any GET request on `/news` or `/news/:id/...` to
force a `500` response — handy for testing loading/error/retry states without
waiting for a real failure.

## Run it locally (no cost, no deployment needed)

```bash
npm install
npm start
```

The API will be running at `http://localhost:3000`. This is the fastest
option if candidates just need something to point their `fetch` calls at
while developing.

## Deploy it for free (so it has a public URL like the old one)

Any of these work well for a small Node/Express app and have a free tier:

**Render.com** (recommended, simplest)
1. Push this folder to a GitHub repo.
2. On [render.com](https://render.com), click **New → Web Service**, connect
   the repo.
3. Build command: `npm install` — Start command: `npm start`.
4. Deploy. Render gives you a public URL like `https://your-app.onrender.com`.
   (Free tier spins down after inactivity — the first request after a while
   takes a few seconds to wake up, which is fine for an assessment API.)

**Glitch.com**
1. Create a new Node.js project on Glitch and paste in `server.js` and
   `package.json`.
2. Glitch gives you an instant public URL, no separate deploy step.

**Railway.app / Cyclic.sh** work the same way as Render if you prefer them.

Once deployed, swap the old `API Base URL` in the assessment doc for your
new public URL.
