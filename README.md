# Skaet News API (mock)

## About

The News API originally provided in the Frontend Intern assessment
(hosted on mockapi.io) has expired, so this project is a free, drop-in
replacement. It's a small Express server that implements the exact same
endpoints, request/response shapes, and sample data described in the
assessment brief — so candidates can keep working against a live API
without any change to the task itself.

It's built to be genuinely useful for testing, not just a stub:
- Seed data includes deliberate edge cases (a news item with no images or
  comments, a broken image URL, a comment with no avatar) so candidates can
  actually exercise the empty/error-state handling the assessment asks for.
- An optional `?fail=1` query param forces a 500 response on demand, so
  loading/error/retry states can be tested without waiting for a real
  failure.
- Data lives in memory and resets on restart — expected behavior for a
  test API, not a bug.

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

## Run it locally (no cost, no deployment needed)

```bash
npm install
npm start
```

The API will be running at `http://localhost:3000`. This is the fastest
option if candidates just need something to point their `fetch` calls at
while developing.

## Deploy it for free (so it has a public URL like the old one)

**Recommended: Render.com.** For a small always-on-ish Express app like this
one, it's the best free option right now — no credit card required, deploys
straight from a GitHub repo, and the free tier is generous enough for an
assessment API that a handful of candidates will hit occasionally. The one
tradeoff is that a free service spins down after ~15 minutes of inactivity,
so the first request after a quiet period takes 20-30 seconds to wake up —
worth a one-line note in the assessment doc so candidates aren't confused by
it.

1. Push this folder to a GitHub repo.
2. On [render.com](https://render.com), click **New → Web Service**, connect
   the repo.
3. Build command: `npm install` — Start command: `npm start`.
4. Deploy. Render gives you a public URL like `https://your-app.onrender.com`.

**Alternatives, if the cold-start delay is a dealbreaker:**
- **Glitch.com** — instant public URL, no separate deploy step, but its free
  tier now requires the project to be "boosted" periodically to stay awake,
  which is more upkeep than Render for something you'll set up once.
- **Railway.app** — free trial credit rather than an ongoing free tier, so
  it's fine short-term but not a lasting free option.
- **Cyclic.sh** — genuinely free and no sleep/cold-start, but smaller
  community and less long-term certainty as a platform.

Once deployed, swap the old `API Base URL` in the assessment doc for your
new public URL.
