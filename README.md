# News API (mock)

## About

This project is a free, drop-in replacement for the expired mockapi. It's a small Express server that implements the exact same
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

Base URL once running: `https://mock-news-vcey.onrender.com`

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

