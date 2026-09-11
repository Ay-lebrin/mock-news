/**
 * Skaet News API — free mock replacement for the expired mockapi.io endpoint.
 *
 * Implements exactly the endpoints listed in the Frontend Intern assessment:
 *   GET    /news
 *   GET    /news?page=1&limit=10
 *   GET    /news/:id
 *   POST   /news
 *   PUT    /news/:id
 *   DELETE /news/:id
 *   GET    /news/:id/images
 *   POST   /news/:id/images
 *   DELETE /news/:id/images/:imageId
 *   GET    /news/:id/comments
 *   POST   /news/:id/comments
 *   PUT    /news/:id/comments/:commentId
 *   DELETE /news/:id/comments/:commentId
 *
 * Data is in-memory and reseeds every time the server restarts (fine for a
 * test/assessment API — candidates aren't relying on persistence).
 */

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

let nextNewsId = 56;
let nextImageId = 4;
let nextCommentId = 4;

let news = [
  {
    id: "1",
    author: "Mr. Bruce Brad",
    avatar: "https://i.pravatar.cc/150?img=12",
    title: "Enterprise-wide eco-maniac core",
    body: "The latest release reworks the core pipeline end to end, cutting build times nearly in half. Early adopters report smoother deploys and fewer rollbacks, though a handful of edge cases around legacy config files are still being ironed out. The team plans a follow-up post once the migration guide is finalized.",
    url: "http://tiana.com",
    createdAt: "2026-08-01T09:00:00.000Z",
  },
  {
    id: "2",
    author: "Ada Lovelace",
    avatar: "https://i.pravatar.cc/150?img=32",
    title: "Analytical Engine gets a JavaScript port",
    body: "A small group of hobbyists has finished porting the original Analytical Engine instruction set to JavaScript, running entirely in the browser. The project started as a weekend experiment and has since grown into a full simulator with step-by-step execution, making it a surprisingly good teaching tool for anyone curious about how early mechanical computing actually worked.",
    url: "http://example.com/analytical-engine",
    createdAt: "2026-08-03T11:30:00.000Z",
  },
  {
    id: "3",
    author: "Grace Hopper",
    avatar: "https://i.pravatar.cc/150?img=45",
    title: "Why every compiler needs a good debugger",
    body: "A good debugger is often treated as an afterthought, bolted on once the compiler itself is considered 'done'. This piece argues the opposite: debugging support should shape compiler design from day one, because the clarity of your error messages and stack traces determines how quickly developers can actually trust the tool.",
    url: "",
    createdAt: "2026-08-05T15:45:00.000Z",
  },
  {
    id: "4",
    author: "Orlo Nitzsche",
    avatar: "",
    title: "Frontend interns wanted: apply within",
    body: "We're opening a new round of frontend internship positions this quarter. Successful candidates will work directly with the product team on real features, get paired with a mentor, and go through a short onboarding track covering React, Chakra UI, and the internal API conventions before picking up their first ticket.",
    url: "http://example.com/careers",
    createdAt: "2026-08-07T08:15:00.000Z",
  },
  {
    id: "5",
    author: "Sample Author With No Extras",
    avatar: "https://i.pravatar.cc/150?img=5",
    title: "A news item with no images or comments (empty-state test)",
    body: "This item exists purely to test empty states — it has no images and no comments, so your UI should handle both gracefully without breaking the layout or showing a blank space where a message should be.",
    url: "",
    createdAt: "2026-08-09T10:00:00.000Z",
  },
];

let images = [
  { id: "1", newsId: "1", image: "https://picsum.photos/seed/skaet1/800/500" },
  { id: "2", newsId: "1", image: "https://picsum.photos/seed/skaet2/800/500" },
  // Intentionally broken URL — use this to test your fallback/placeholder handling.
  { id: "3", newsId: "1", image: "https://example.com/this-image-does-not-exist.jpg" },
];

let comments = [
  {
    id: "1",
    newsId: "1",
    name: "Orlo Nitzsche",
    avatar: "https://i.pravatar.cc/150?img=7",
    comment: "This is a sample comment",
    createdAt: "2026-08-01T10:00:00.000Z",
  },
  {
    id: "2",
    newsId: "1",
    name: "Test Reader",
    avatar: "",
    comment: "No avatar here — check your empty-avatar handling.",
    createdAt: "2026-08-01T12:00:00.000Z",
  },
  {
    id: "3",
    newsId: "2",
    name: "Charles Babbage",
    avatar: "https://i.pravatar.cc/150?img=51",
    comment: "Fascinating work, well done.",
    createdAt: "2026-08-03T13:00:00.000Z",
  },
];

// ---------------------------------------------------------------------------
// Generate 50 more news items (ids 6-55) so pagination has real data to work
// with. A handful get images/comments attached; most don't, which is
// realistic and keeps the empty-state paths easy to hit while paging.
// ---------------------------------------------------------------------------

const SAMPLE_AUTHORS = [
  "Alan Turing", "Margaret Hamilton", "Katherine Johnson", "Tim Berners-Lee",
  "Radia Perlman", "Linus Torvalds", "Barbara Liskov", "Dennis Ritchie",
  "Shafi Goldwasser", "John Carmack", "Anita Borg", "Vint Cerf",
  "Frances Allen", "Guido van Rossum", "Sophie Wilson",
];

const SAMPLE_TOPICS = [
  "APIs", "state management", "accessibility", "browser caching", "CSS grid",
  "form validation", "component design", "async rendering", "build tools",
  "testing strategy", "design systems", "performance budgets",
  "responsive layout", "error boundaries", "data fetching patterns",
];

const SAMPLE_URLS = [
  "http://example.com/reads", "http://example.com/dev-notes", "", "",
  "http://example.com/blog",
];

const BODY_TEMPLATES = [
  (author, topic) => `${author} walks through a practical approach to ${topic}, drawing on lessons learned from a recent production incident. The piece is light on theory and heavy on concrete examples, making it a quick, useful read for anyone working on similar problems.`,
  (author, topic) => `In this post, ${author} breaks down common misconceptions about ${topic} and offers a simpler mental model for thinking about the problem. Several readers have already flagged it as required reading for new team members.`,
  (author, topic) => `A short but detailed look at how ${topic} decisions made early in a project tend to compound over time. ${author} uses a handful of before-and-after examples to show what changed and why it mattered.`,
  (author, topic) => `${author} shares a set of small, low-risk changes around ${topic} that added up to a meaningful improvement in day-to-day developer experience — nothing flashy, just steady iteration.`,
  (author, topic) => `This write-up covers what ${author}'s team tried, what failed, and what eventually worked when tackling ${topic} at scale. Worth a read if you're about to make similar tradeoffs.`,
];

function generateMoreNews() {
  for (let i = 0; i < 50; i++) {
    const id = String(nextNewsId - 50 + i); // ids 6..55
    const author = SAMPLE_AUTHORS[i % SAMPLE_AUTHORS.length];
    const topic = SAMPLE_TOPICS[i % SAMPLE_TOPICS.length];
    const hasAvatar = i % 4 !== 0; // most have an avatar, some don't
    const item = {
      id,
      author,
      avatar: hasAvatar ? `https://i.pravatar.cc/150?img=${(i % 70) + 1}` : "",
      title: `${author.split(" ")[0]}'s take on ${topic} (#${i + 1})`,
      body: BODY_TEMPLATES[i % BODY_TEMPLATES.length](author, topic),
      url: SAMPLE_URLS[i % SAMPLE_URLS.length],
      createdAt: new Date(2026, 7, 10 + Math.floor(i / 3), 9, i % 60).toISOString(),
    };
    news.push(item);

    // Roughly every 3rd item gets one or two images.
    if (i % 3 === 0) {
      images.push({
        id: String(nextImageId++),
        newsId: id,
        image: `https://picsum.photos/seed/skaet-gen-${id}-a/800/500`,
      });
      if (i % 6 === 0) {
        images.push({
          id: String(nextImageId++),
          newsId: id,
          image: `https://picsum.photos/seed/skaet-gen-${id}-b/800/500`,
        });
      }
    }

    // Roughly every 4th item gets one or two comments.
    if (i % 4 === 0) {
      comments.push({
        id: String(nextCommentId++),
        newsId: id,
        name: SAMPLE_AUTHORS[(i + 3) % SAMPLE_AUTHORS.length],
        avatar: i % 8 === 0 ? "" : `https://i.pravatar.cc/150?img=${(i % 70) + 20}`,
        comment: `Great points on ${topic}, thanks for writing this up.`,
        createdAt: new Date(2026, 7, 10 + Math.floor(i / 3), 12, i % 60).toISOString(),
      });
    }
  }
}

generateMoreNews();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function findNewsOr404(req, res) {
  const item = news.find((n) => n.id === req.params.id);
  if (!item) {
    res.status(404).json({ error: `News item with id ${req.params.id} not found` });
    return null;
  }
  return item;
}

// Occasionally simulate a flaky network so retry logic can be exercised.
// Add ?fail=1 to any request to force a 500 on demand.
function maybeSimulateFailure(req, res) {
  if (req.query.fail === "1") {
    res.status(500).json({ error: "Simulated server error (fail=1 was passed)" });
    return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------

app.get("/news", (req, res) => {
  if (maybeSimulateFailure(req, res)) return;

  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.limit, 10);

  if (page && limit) {
    const start = (page - 1) * limit;
    const end = start + limit;
    return res.json(news.slice(start, end));
  }

  res.json(news);
});

app.get("/news/:id", (req, res) => {
  if (maybeSimulateFailure(req, res)) return;
  const item = findNewsOr404(req, res);
  if (!item) return;
  res.json(item);
});

app.post("/news", (req, res) => {
  const { author, avatar, title, body: articleBody, url } = req.body || {};
  if (!author || !title) {
    return res.status(400).json({ error: "author and title are required" });
  }
  const item = {
    id: String(nextNewsId++),
    author,
    avatar: avatar || "",
    title,
    body: articleBody || "",
    url: url || "",
    createdAt: new Date().toISOString(),
  };
  news.push(item);
  res.status(201).json(item);
});

app.put("/news/:id", (req, res) => {
  const item = findNewsOr404(req, res);
  if (!item) return;
  const { author, avatar, title, body: articleBody, url } = req.body || {};
  if (author !== undefined) item.author = author;
  if (avatar !== undefined) item.avatar = avatar;
  if (title !== undefined) item.title = title;
  if (articleBody !== undefined) item.body = articleBody;
  if (url !== undefined) item.url = url;
  res.json(item);
});

app.delete("/news/:id", (req, res) => {
  const idx = news.findIndex((n) => n.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: `News item with id ${req.params.id} not found` });
  }
  news.splice(idx, 1);
  images = images.filter((i) => i.newsId !== req.params.id);
  comments = comments.filter((c) => c.newsId !== req.params.id);
  res.status(204).end();
});

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------

app.get("/news/:id/images", (req, res) => {
  if (maybeSimulateFailure(req, res)) return;
  if (!findNewsOr404(req, res)) return;
  res.json(images.filter((i) => i.newsId === req.params.id));
});

app.post("/news/:id/images", (req, res) => {
  if (!findNewsOr404(req, res)) return;
  const { image } = req.body || {};
  if (!image) return res.status(400).json({ error: "image is required" });
  const record = { id: String(nextImageId++), newsId: req.params.id, image };
  images.push(record);
  res.status(201).json(record);
});

app.delete("/news/:id/images/:imageId", (req, res) => {
  if (!findNewsOr404(req, res)) return;
  const idx = images.findIndex(
    (i) => i.newsId === req.params.id && i.id === req.params.imageId
  );
  if (idx === -1) return res.status(404).json({ error: "Image not found" });
  images.splice(idx, 1);
  res.status(204).end();
});

// ---------------------------------------------------------------------------
// Comments
// ---------------------------------------------------------------------------

app.get("/news/:id/comments", (req, res) => {
  if (maybeSimulateFailure(req, res)) return;
  if (!findNewsOr404(req, res)) return;
  res.json(comments.filter((c) => c.newsId === req.params.id));
});

app.post("/news/:id/comments", (req, res) => {
  if (!findNewsOr404(req, res)) return;
  const { name, avatar, comment } = req.body || {};
  if (!name || !comment) {
    return res.status(400).json({ error: "name and comment are required" });
  }
  const record = {
    id: String(nextCommentId++),
    newsId: req.params.id,
    name,
    avatar: avatar || "",
    comment,
    createdAt: new Date().toISOString(),
  };
  comments.push(record);
  res.status(201).json(record);
});

app.put("/news/:id/comments/:commentId", (req, res) => {
  if (!findNewsOr404(req, res)) return;
  const record = comments.find(
    (c) => c.newsId === req.params.id && c.id === req.params.commentId
  );
  if (!record) return res.status(404).json({ error: "Comment not found" });
  const { name, avatar, comment } = req.body || {};
  if (name !== undefined) record.name = name;
  if (avatar !== undefined) record.avatar = avatar;
  if (comment !== undefined) record.comment = comment;
  res.json(record);
});

app.delete("/news/:id/comments/:commentId", (req, res) => {
  if (!findNewsOr404(req, res)) return;
  const idx = comments.findIndex(
    (c) => c.newsId === req.params.id && c.id === req.params.commentId
  );
  if (idx === -1) return res.status(404).json({ error: "Comment not found" });
  comments.splice(idx, 1);
  res.status(204).end();
});

// ---------------------------------------------------------------------------

app.get("/", (req, res) => {
  res.json({
    name: "Skaet News API (mock)",
    status: "ok",
    endpoints: [
      "GET /news",
      "GET /news?page=1&limit=10",
      "GET /news/:id",
      "POST /news",
      "PUT /news/:id",
      "DELETE /news/:id",
      "GET /news/:id/images",
      "POST /news/:id/images",
      "DELETE /news/:id/images/:imageId",
      "GET /news/:id/comments",
      "POST /news/:id/comments",
      "PUT /news/:id/comments/:commentId",
      "DELETE /news/:id/comments/:commentId",
    ],
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Skaet mock News API running on http://localhost:${PORT}`);
});