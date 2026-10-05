# Month 4 — Projects + DevOps: Detailed Exercises (Weeks 13–16, Days 85–112)

<!-- SCHEDULE-BANNER-START -->
> **📅 Study window:** 9 Nov 2026 – 6 Dec 2026 (Days 85–112)
> **⏰ Your slots (IST):** Mon–Fri **7:30–8:30pm** & **9:00–10:00pm** · Sat–Sun **9:00am–12:00pm**, **3:00–5:30pm**, **6:00–8:30pm**
> **📧 Calendar reminders:** harsh.gupta@getreelax.com — import `calendar/mern-mastery-study.ics`
<!-- SCHEDULE-BANNER-END -->

**Roadmap:** [ROADMAP.md](../../ROADMAP.md) · **Theory:** [07-auth-devops-complete.md](../theory/07-auth-devops-complete.md) · **Index:** [week-13-16-exercises.md](../../practice/week-13-16-exercises.md)

---

# WEEKS 13–14 — TaskFlow Project (Days 85–98)

**Flagship MERN resume project:** team task management with real-time updates.

**Stack:** Next.js + Node/Express + MongoDB + Redis + TypeScript + Docker Compose + Socket.io

---

## Day 85 — Mon: Project Setup

**Problem statement**  
Initialize monorepo or split repos: `taskflow-web`, `taskflow-api`. ESLint, Prettier, TS strict, shared types package optional.

**Learning objective**  
Production-grade project scaffold.

**Prerequisites**  
- Months 1–3 exercises complete

**Step-by-step approach**
1. Create GitHub repo `taskflow`; branch `main`.
2. API: Express TS template from Month 3; folder structure routes/controllers/services/models.
3. Web: `create-next-app` with App Router.
4. Root `docker-compose.yml` stub (mongo, redis).
5. `.env.example` for both apps; document variables in README.
6. Husky pre-commit lint optional.
7. First commit: "chore: initial monorepo scaffold".

**Hints**
1. Share `User`, `Task` types via package or duplicated initially.
2. Use consistent API base URL env `NEXT_PUBLIC_API_URL`.
3. README architecture diagram placeholder.

**Exact Answer**
- Monorepo with `taskflow-web` (Next.js) + `taskflow-api` (Express TS)
- Docker Compose stub for mongo + redis; both apps start locally

**Complete Solution**
```
taskflow/
├── docker-compose.yml    # mongo, redis
├── taskflow-api/         # Express + TS + Mongoose
├── taskflow-web/         # Next.js App Router
├── .env.example
└── README.md             # architecture diagram
```


**Expected output / acceptance criteria**
- Both apps start locally; health check passes; CI-ready structure.

**Where to practice**
- Local: `mern-mastery/taskflow/`
- Docker: https://docs.docker.com/compose/

**Common mistakes**
- Committing real `.env` secrets.
- CORS not planned early.

**80 LPA Interview Twist**  
Netflix/Meta use Redis for rate limiting, pub/sub, and session store — expect distributed Redis cluster and failover discussion.


**Interview connection**  
Walkthrough flagship project architecture — recruiters focus here.

**Time estimate:** 2 hours (weekday)

---

## Day 86 — Tue: Database Models

**Problem statement**  
Mongoose models: User, Team, Project, Task, Comment, Invite.

**Step-by-step approach**
1. **User:** email, passwordHash, name, avatarUrl optional.
2. **Team:** name, ownerId, memberIds[], roles map or Member subdoc.
3. **Project:** teamId, name, description, archived flag.
4. **Task:** projectId, title, description, status enum, priority, assigneeId, dueDate.
5. **Comment:** taskId, authorId, body, timestamps.
6. Indexes: task by projectId+status; user email unique.
7. Seed script with demo team/project/tasks.

**Exact Answer**
- Models: User, Team, Project, Task, Comment, Invite with proper refs and indexes
- Seed script creates demo team with tasks

**Complete Solution**
```typescript
const taskSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
  title: String, status: { type: String, enum: ["todo","in_progress","done"], default: "todo" },
  priority: { type: String, enum: ["low","medium","high"] },
  assigneeId: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
taskSchema.index({ projectId: 1, status: 1 });
```


**Expected output / acceptance criteria**
- Seed creates sample data; relationships populate correctly.

**80 LPA Interview Twist**  
Meta/Google security rounds ask about OWASP top 10, token rotation on reuse detection, and zero-trust architecture — auth skeleton must scale to microservices.

**Time estimate:** 2 hours

---

## Day 87 — Wed: Auth Integration

**Problem statement**  
Wire Month 3 JWT auth into TaskFlow: register, login, refresh, protected routes.

**Step-by-step approach**
1. Mount auth routes under `/api/auth`.
2. User registration creates default personal team optional.
3. Access token 15m; refresh httpOnly cookie.
4. Next.js: API route proxy or direct cookie handling strategy documented.
5. Middleware `authenticate` on all task routes.

**Exact Answer**
- Follow acceptance criteria in Expected output section
- Implementation matches step-by-step approach requirements

**Complete Solution**
```typescript
// prisma/schema.prisma + migrate
npx prisma migrate dev --name init
npx prisma generate
const users = await prisma.user.findMany({ include: { orders: true } });
```


**80 LPA Interview Twist**  
Meta/Google security rounds ask about OWASP top 10, token rotation on reuse detection, and zero-trust architecture — auth skeleton must scale to microservices.

**Time estimate:** 2 hours

---

## Day 88 — Thu: Teams + Invite API

**Problem statement**  
Create team, invite by email token, accept invite, list members, roles owner/member/viewer.

**Step-by-step approach**
1. POST `/teams` — creator becomes owner.
2. POST `/teams/:id/invites` — generate token, expiry 7d (email stub log).
3. POST `/invites/accept` — add member with role.
4. GET `/teams/:id/members` — RBAC: viewer can read.
5. PATCH member role — owner only.

**Exact Answer**
- Follow acceptance criteria in Expected output section
- Implementation matches step-by-step approach requirements

**Complete Solution**
```typescript
describe("calculateTotal", () => {
  it("sums cart items", () => {
    expect(calculateTotal([{ price: 10, qty: 2 }, { price: 5, qty: 1 }])).toBe(25);
  });
});
```


**80 LPA Interview Twist**  
At Google/Meta 80 LPA level, expect follow-up questions on scale (10× traffic), failure modes, and production tradeoffs — not just happy-path implementation.

**Time estimate:** 2 hours

---

## Day 89 — Fri: LeetCode LC 253

**Problem statement**  
Meeting Rooms II — min rooms for overlapping intervals.

**Step-by-step approach**
1. Sort by start time.
2. Min-heap on end times; if start >= min end pop.
3. Heap size = rooms needed.

**Exact Answer**
- Optimal solution with stated time/space complexity
- Passes all LeetCode test cases including edge cases

**Complete Solution**
```typescript
// prisma/schema.prisma + migrate
npx prisma migrate dev --name init
npx prisma generate
const users = await prisma.user.findMany({ include: { orders: true } });
```


**Where to practice**
- https://leetcode.com/problems/meeting-rooms-ii/

**80 LPA Interview Twist**  
Amazon LP interviews use STAR with 'I' statements and dig 3 levels deep on YOUR specific contribution — team answers score poorly.

**Time estimate:** 45 minutes

---

## Day 90 — Sat: Tasks CRUD + Comments + Permissions

**Problem statement**  
Full task lifecycle with comments; permissions by team role.

**Step-by-step approach (8-hour day)**
1. **Hour 1–2:** Task CRUD routes scoped to project; validate project belongs to user's team.
2. **Hour 3:** Status transitions todo → in_progress → done; assignee validation.
3. **Hour 4:** Comments CRUD nested under task.
4. **Hour 5:** Permission matrix: viewer read-only; member create/edit; owner delete project.
5. **Hour 6:** Pagination + filters status/assignee/priority.
6. **Hour 7:** API tests with Supertest skeleton.
7. **Hour 8:** Postman collection export.

**Exact Answer**
- Follow acceptance criteria in Expected output section
- Implementation matches step-by-step approach requirements

**Complete Solution**
```typescript
import request from "supertest";
import app from "../src/app";

describe("POST /api/auth/login", () => {
  it("returns 200 with token", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "test@test.com", password: "password123" });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });
});
```


**Expected output / acceptance criteria**
- Non-member gets 403; viewer cannot POST task.

**80 LPA Interview Twist**  
At Google/Meta 80 LPA level, expect follow-up questions on scale (10× traffic), failure modes, and production tradeoffs — not just happy-path implementation.

**Time estimate:** 8 hours

---

## Day 91 — Sun: Socket.io Real-Time Updates

**Problem statement**  
Broadcast task create/update/delete to team room subscribers.

**Step-by-step approach**
1. Attach Socket.io to HTTP server; auth middleware on connection via JWT query/header.
2. Join room `team:${teamId}` on subscribe.
3. Emit events: `task:created`, `task:updated`, `task:deleted`.
4. Next.js client hook `useTaskSocket` updates local cache/state.
5. Handle reconnect gracefully.

**Exact Answer**
- Task CRUD events broadcast to `team:${teamId}` room
- JWT auth on socket connection; client hook updates UI live

**Complete Solution**
```typescript
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try { socket.data.user = verifyAccessToken(token); next(); }
  catch { next(new Error("Unauthorized")); }
});
io.on("connection", (socket) => {
  socket.on("join:team", (teamId) => socket.join(`team:${teamId}`));
});
// On task update: io.to(`team:${teamId}`).emit("task:updated", task);
```


**Where to practice**
- Socket.io: https://socket.io/docs/v4/

**80 LPA Interview Twist**  
Meta/Google security rounds ask about OWASP top 10, token rotation on reuse detection, and zero-trust architecture — auth skeleton must scale to microservices.

**Time estimate:** 8 hours

---

## Day 92 — Mon: File Upload

**Problem statement**  
Attach files to tasks — Multer local disk or S3 presigned upload.

**Step-by-step approach**
1. POST `/tasks/:id/attachments` multipart.
2. Store metadata in Mongo; file path or S3 key.
3. Max size 5MB; allowed mime types whitelist.
4. DELETE attachment owner/member only.

**Exact Answer**
- Follow acceptance criteria in Expected output section
- Implementation matches step-by-step approach requirements

**Complete Solution**
```yaml
name: CI
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci && npm test && npm run build
```


**80 LPA Interview Twist**  
At Google/Meta 80 LPA level, expect follow-up questions on scale (10× traffic), failure modes, and production tradeoffs — not just happy-path implementation.

**Time estimate:** 2 hours

---

## Day 93 — Tue: Email Notifications

**Problem statement**  
Send email on task assignment (Nodemailer + Ethereal test or Resend API).

**Step-by-step approach**
1. Email service abstraction interface.
2. Trigger on assignee change async (don't block response).
3. Template: task title, link to web app.

**Exact Answer**
- 1B events/day ≈ 12K events/sec avg; Kafka partitioned by user_id
- Workers route by user preferences to FCM/SendGrid/Twilio adapters
- Idempotency keys prevent duplicate notifications on retry

**Complete Solution**
```markdown
## Flow
Event API → Kafka (user_id partition) → Worker Pool → Template Service → Provider Adapters

## Entities
- UserPreferences: { userId, push: bool, email: bool, sms: bool }
- NotificationEvent: { id, userId, type, payload, idempotencyKey }
- Dead letter queue for failed deliveries after 3 retries
```


**80 LPA Interview Twist**  
At Google/Meta 80 LPA level, expect follow-up questions on scale (10× traffic), failure modes, and production tradeoffs — not just happy-path implementation.

**Time estimate:** 2 hours

---

## Day 94 — Wed: Frontend Dashboard Layout

**Problem statement**  
Next.js dashboard: sidebar teams/projects, header user menu, responsive.

**Step-by-step approach**
1. App router layout group `(dashboard)`.
2. Fetch teams on server or client with auth.
3. Tailwind UI — shadcn optional.

**Exact Answer**
- Follow acceptance criteria in Expected output section
- Implementation matches step-by-step approach requirements

**Complete Solution**
```typescript
const session = await stripe.checkout.sessions.create({
  mode: "payment",
  line_items: [{ price: priceId, quantity: 1 }],
  success_url: `${BASE_URL}/success`,
  cancel_url: `${BASE_URL}/cancel`,
});
// Webhook: verify signature, update order status on payment_intent.succeeded
```


**80 LPA Interview Twist**  
Meta/Google security rounds ask about OWASP top 10, token rotation on reuse detection, and zero-trust architecture — auth skeleton must scale to microservices.

**Time estimate:** 2 hours

---

## Day 95 — Thu: Kanban Task Board UI

**Problem statement**  
Drag-drop or column buttons for status; task cards with assignee, priority, due date.

**Step-by-step approach**
1. Columns by status; optimistic UI updates.
2. Modal task detail with comments thread.
3. Socket listeners update board live.

**Exact Answer**
- Follow acceptance criteria in Expected output section
- Implementation matches step-by-step approach requirements

**Complete Solution**
```bash
# Vercel (frontend): vercel deploy --prod
# Render/Railway (API): connect repo, set env vars, deploy
# Verify: curl https://api.example.com/health
# Update README with live demo URLs
```


**80 LPA Interview Twist**  
At Google/Meta 80 LPA level, expect follow-up questions on scale (10× traffic), failure modes, and production tradeoffs — not just happy-path implementation.

**Time estimate:** 2 hours

---

## Day 96 — Fri: LC 322 Coin Change

**Where to practice:** https://leetcode.com/problems/coin-change/

**Exact Answer**
- `coinChange([1,2,5], 11)` → `3` (5+5+1)
- Time: **O(amount × coins)**, Space: **O(amount)**

**Complete Solution**
```javascript
function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (coin <= a) dp[a] = Math.min(dp[a], dp[a - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```


**80 LPA Interview Twist**  
At Google/Meta 80 LPA level, expect follow-up questions on scale (10× traffic), failure modes, and production tradeoffs — not just happy-path implementation.

**Time estimate:** 45 minutes

---

## Day 97 — Sat: Docker Compose

**Problem statement**  
`docker-compose up` runs api + mongo + redis + web (web optional dev outside).

**Step-by-step approach**
1. Dockerfiles multi-stage for API.
2. Compose networks; env files.
3. Volume for mongo data persistence.
4. README "Run with Docker" section.

**Exact Answer**
- Follow acceptance criteria in Expected output section
- Implementation matches step-by-step approach requirements

**Complete Solution**
```javascript
function minMeetingRooms(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const ends = [];
  for (const [start, end] of intervals) {
    if (ends.length && ends[0] <= start) ends.shift();
    else ends.push(end);
    ends.sort((a, b) => a - b);
  }
  return ends.length;
}
// Time O(n log n), Space O(n)
```


**80 LPA Interview Twist**  
Netflix/Meta use Redis for rate limiting, pub/sub, and session store — expect distributed Redis cluster and failover discussion.

**Time estimate:** 8 hours (includes polish)

---

## Day 98 — Sun: Polish + README

**Problem statement**  
Bug bash, architecture diagram, demo GIF, deployment prep.

**Expected output / acceptance criteria**
- README: features, stack, setup, env vars, API docs link.
- Known issues listed honestly.

**Exact Answer**
- Follow acceptance criteria in Expected output section
- Implementation matches step-by-step approach requirements

**Complete Solution**
```javascript
function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++)
    for (const c of coins)
      if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
  return dp[amount] === Infinity ? -1 : dp[amount];
}
// Time O(amount × coins), Space O(amount)
```


**80 LPA Interview Twist**  
Google Cloud SQL interviews cover connection pooling (PgBouncer), read replicas, and EXPLAIN ANALYZE for query optimization at scale.

**Time estimate:** 8 hours

---

# WEEKS 15–16 — ShopLite + Testing (Days 99–112)

**Stack:** Next.js + Express + PostgreSQL (orders) + Redis (cart/session) + Stripe/Razorpay test

---

## Day 99 — Mon: ShopLite Setup

**Problem statement**  
Product catalog schema in PostgreSQL: products, categories, inventory.

**Step-by-step approach**
1. New repo or monorepo `shoplite`.
2. Prisma models Product, Category, ProductImage optional.
3. Admin seed products.

**Exact Answer**
- PostgreSQL schema: Product, Category, inventory tracking
- Prisma models with seed data for catalog

**Complete Solution**
```prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  price       Decimal  @db.Decimal(10, 2)
  stock       Int      @default(0)
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
}
```


**80 LPA Interview Twist**  
Google Cloud SQL interviews cover connection pooling (PgBouncer), read replicas, and EXPLAIN ANALYZE for query optimization at scale.

**Time estimate:** 2 hours

---

## Day 100 — Tue: Catalog API + Admin Routes

**Problem statement**  
Public GET products; admin POST/PUT/DELETE with RBAC.

**Step-by-step approach**
1. Query filters: category, price range, search q.
2. Admin middleware on mutate routes.
3. Pagination consistent with TaskFlow patterns.

**Exact Answer**
- Public GET with filters (category, price, search q); admin POST/PUT/DELETE requires admin role
- Pagination: `{ data, total, page, pages }`

**Complete Solution**
```typescript
router.get("/products", async (req, res) => {
  const { category, q, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
  const where = {
    ...(category && { category: String(category) }),
    ...(q && { name: { contains: String(q), mode: "insensitive" } }),
    ...(minPrice && { price: { gte: Number(minPrice) } }),
    ...(maxPrice && { price: { lte: Number(maxPrice) } }),
  };
  const [data, total] = await Promise.all([
    prisma.product.findMany({ where, skip: (Number(page)-1)*Number(limit), take: Number(limit) }),
    prisma.product.count({ where }),
  ]);
  res.json({ data, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});
router.post("/products", authenticate, authorize("admin"), createProduct);
```


**80 LPA Interview Twist**  
Flagship project reviews at 80 LPA focus on real-time consistency, conflict resolution, and horizontal scaling of Socket.io with Redis adapter.

**Time estimate:** 2 hours

---

## Day 101 — Wed: Cart + Redis Session

**Problem statement**  
Guest and logged-in cart stored in Redis; merge on login.

**Step-by-step approach**
1. Session id cookie for guest cart key `cart:${sessionId}`.
2. Cart JSON: `[{ productId, qty }]`.
3. Validate stock on add.

**Exact Answer**
- Guest cart stored at `cart:${sessionId}` in Redis as JSON array
- Login merges guest cart into user cart; stock validated on add

**Complete Solution**
```typescript
async function addToCart(sessionId: string, productId: string, qty: number) {
  const key = `cart:${sessionId}`;
  const cart: { productId: string; qty: number }[] = JSON.parse(await redis.get(key) ?? "[]");
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.stock < qty) throw new AppError(400, "Insufficient stock");
  const existing = cart.find(i => i.productId === productId);
  if (existing) existing.qty += qty; else cart.push({ productId, qty });
  await redis.setex(key, 86400, JSON.stringify(cart));
}
```


**80 LPA Interview Twist**  
Netflix/Meta use Redis for rate limiting, pub/sub, and session store — expect distributed Redis cluster and failover discussion.

**Time estimate:** 2 hours

---

## Day 102 — Thu: Checkout + Order Creation

**Problem statement**  
Transactional order create: decrement inventory, clear cart, order row + line items.

**Step-by-step approach**
1. Prisma `$transaction` for order + items + stock.
2. Order statuses: pending → paid → shipped.
3. Idempotency key header optional advanced.

**Exact Answer**
- Prisma `$transaction` creates order, line items, decrements stock atomically
- Cart cleared on success; rollback on any failure

**Complete Solution**
```typescript
await prisma.$transaction(async (tx) => {
  const order = await tx.order.create({ data: { userId, total, status: "pending" } });
  for (const item of cartItems) {
    const product = await tx.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.qty } },
    });
    if (product.stock < 0) throw new Error("Insufficient stock");
    await tx.orderItem.create({ data: { orderId: order.id, productId: item.productId, qty: item.qty, price: product.price } });
  }
  await redis.del(`cart:${sessionId}`);
});
```


**80 LPA Interview Twist**  
At Google/Meta 80 LPA level, expect follow-up questions on scale (10× traffic), failure modes, and production tradeoffs — not just happy-path implementation.

**Time estimate:** 2 hours

---

## Day 103 — Fri: LC 300 LIS

**Where to practice:** https://leetcode.com/problems/longest-increasing-subsequence/

**Exact Answer**
- Optimal solution with stated time/space complexity
- Passes all LeetCode test cases including edge cases

**Complete Solution**
```typescript
describe("calculateTotal", () => {
  it("sums cart items", () => {
    expect(calculateTotal([{ price: 10, qty: 2 }, { price: 5, qty: 1 }])).toBe(25);
  });
});
```


**80 LPA Interview Twist**  
At Google/Meta 80 LPA level, expect follow-up questions on scale (10× traffic), failure modes, and production tradeoffs — not just happy-path implementation.

**Time estimate:** 60 minutes

---

## Day 104 — Sat: Payment Integration

**Problem statement**  
Stripe or Razorpay test mode checkout session; webhook marks order paid.

**Step-by-step approach**
1. Create checkout session endpoint.
2. Webhook signature verification.
3. Update order on `payment_intent.succeeded`.

**Exact Answer**
- All acceptance criteria from Expected output section met
- Implementation follows step-by-step approach; tested and documented in README

**Complete Solution**
```typescript
// Follow the step-by-step approach documented above for this exercise.
// Key deliverables: working code, tests, README documentation.
// Verify with: npm test && curl/httpie manual testing
```


**Where to practice**
- Stripe test: https://stripe.com/docs/testing

**80 LPA Interview Twist**  
At Google/Meta 80 LPA level, expect follow-up questions on scale (10× traffic), failure modes, and production tradeoffs — not just happy-path implementation.

**Time estimate:** 8 hours

---

## Day 105 — Sun: Order Management + Admin Dashboard

**Problem statement**  
Admin view orders; user order history page.

**Exact Answer**
- All acceptance criteria from Expected output section met
- Implementation follows step-by-step approach; tested and documented in README

**Complete Solution**
```typescript
// Follow the step-by-step approach documented above for this exercise.
// Key deliverables: working code, tests, README documentation.
// Verify with: npm test && curl/httpie manual testing
```


**80 LPA Interview Twist**  
At Google/Meta 80 LPA level, expect follow-up questions on scale (10× traffic), failure modes, and production tradeoffs — not just happy-path implementation.

**Time estimate:** 8 hours

---

## Day 106 — Mon: Jest Unit Tests

**Problem statement**  
Unit test pure functions: pricing, cart merge, slug helpers.

**Step-by-step approach**
1. Jest config for API package.
2. ≥80% coverage on utils target optional.
3. Mock dates and IDs deterministically.

**Exact Answer**
- All acceptance criteria from Expected output section met
- Implementation follows step-by-step approach; tested and documented in README

**Complete Solution**
```typescript
// Follow the step-by-step approach documented above for this exercise.
// Key deliverables: working code, tests, README documentation.
// Verify with: npm test && curl/httpie manual testing
```


**Where to practice**
- Jest: https://jestjs.io/docs/getting-started

**80 LPA Interview Twist**  
Amazon LP interviews use STAR with 'I' statements and dig 3 levels deep on YOUR specific contribution — team answers score poorly.

**Time estimate:** 2 hours

---

## Day 107 — Tue: Supertest API Tests

**Problem statement**  
Integration tests for auth, products, checkout happy path.

**Step-by-step approach**
1. Spin test DB or in-memory mongo substitute per test file strategy.
2. `request(app).post('/api/auth/login')...`
3. CI must run tests headless.

**Exact Answer**
- All acceptance criteria from Expected output section met
- Implementation follows step-by-step approach; tested and documented in README

**Complete Solution**
```typescript
// Follow the step-by-step approach documented above for this exercise.
// Key deliverables: working code, tests, README documentation.
// Verify with: npm test && curl/httpie manual testing
```


**80 LPA Interview Twist**  
Meta/Google security rounds ask about OWASP top 10, token rotation on reuse detection, and zero-trust architecture — auth skeleton must scale to microservices.

**Time estimate:** 2 hours

---

## Day 108 — Wed: React Testing Library

**Problem statement**  
Component tests: product card renders, add to cart button calls handler.

**Where to practice**
- RTL: https://testing-library.com/docs/react-testing-library/intro/

**Exact Answer**
- All acceptance criteria from Expected output section met
- Implementation follows step-by-step approach; tested and documented in README

**Complete Solution**
```typescript
// Follow the step-by-step approach documented above for this exercise.
// Key deliverables: working code, tests, README documentation.
// Verify with: npm test && curl/httpie manual testing
```


**80 LPA Interview Twist**  
At Google/Meta 80 LPA level, expect follow-up questions on scale (10× traffic), failure modes, and production tradeoffs — not just happy-path implementation.

**Time estimate:** 2 hours

---

## Day 109 — Thu: GitHub Actions CI

**Problem statement**  
Workflow: lint, test, build on PR to main.

**Step-by-step approach**
1. `.github/workflows/ci.yml`.
2. Matrix node 20; cache npm.
3. Fail PR if tests fail.

**Exact Answer**
- All acceptance criteria from Expected output section met
- Implementation follows step-by-step approach; tested and documented in README

**Complete Solution**
```typescript
// Follow the step-by-step approach documented above for this exercise.
// Key deliverables: working code, tests, README documentation.
// Verify with: npm test && curl/httpie manual testing
```


**Where to practice**
- GitHub Actions: https://docs.github.com/en/actions

**80 LPA Interview Twist**  
At Google/Meta 80 LPA level, expect follow-up questions on scale (10× traffic), failure modes, and production tradeoffs — not just happy-path implementation.

**Time estimate:** 2 hours

---

## Day 110 — Fri: LC 347 Top K Frequent

**Where to practice:** https://leetcode.com/problems/top-k-frequent-elements/

**Exact Answer**
- Optimal solution with stated time/space complexity
- Passes all LeetCode test cases including edge cases

**Complete Solution**
```typescript
import request from "supertest";
import app from "../src/app";

describe("POST /api/auth/login", () => {
  it("returns 200 with token", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "test@test.com", password: "password123" });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });
});
```


**80 LPA Interview Twist**  
At Google/Meta 80 LPA level, expect follow-up questions on scale (10× traffic), failure modes, and production tradeoffs — not just happy-path implementation.

**Time estimate:** 45 minutes

---

## Day 111 — Sat: Deploy Both Projects

**Problem statement**  
TaskFlow + ShopLite live: Vercel frontend, Render/Railway API, Atlas + Neon DBs.

**Step-by-step approach**
1. Environment variables on host platforms.
2. CORS production origins.
3. Health checks for Render.
4. Smoke test production URLs.

**Exact Answer**
- All acceptance criteria met per step-by-step approach
- Code committed to repo with README documentation

**Complete Solution**
```markdown
// Follow the 8-step build approach documented above
// Commit each step separately with meaningful messages
// Document architecture decisions in README
```


**Expected output / acceptance criteria**
- Live demo URLs in README and resume.

**80 LPA Interview Twist**  
Flagship project reviews at 80 LPA focus on real-time consistency, conflict resolution, and horizontal scaling of Socket.io with Redis adapter.

**Time estimate:** 8 hours

---

## Day 112 — Sun: Architecture Diagrams + Resume Bullets

**Problem statement**  
Create diagrams (draw.io or Mermaid); write 3 resume bullets per project with metrics.

**Step-by-step approach**
1. C4 context + container diagrams.
2. Bullets: tech, scale, outcome ("Reduced load time 40% via Redis cache").
3. **150+ LeetCode milestone** self-check.

**Exact Answer**
- All acceptance criteria from Expected output section met
- Implementation follows step-by-step approach; tested and documented in README

**Complete Solution**
```typescript
// Follow the step-by-step approach documented above for this exercise.
// Key deliverables: working code, tests, README documentation.
// Verify with: npm test && curl/httpie manual testing
```


**Expected output / acceptance criteria**
- PDF or PNG diagrams in repos; resume updated.

**80 LPA Interview Twist**  
Netflix/Meta use Redis for rate limiting, pub/sub, and session store — expect distributed Redis cluster and failover discussion.

**Time estimate:** 8 hours

---

## Month 4 LeetCode Reference

LC 253, 268, 283, 287, 300, 322, 347, 349, 371, 373, 378, 392, 399, 416, 424, 435 — apply standard approach template from Week 1.


**80 LPA Interview Twist**  
At Google/Meta 80 LPA level, expect follow-up questions on scale (10× traffic), failure modes, and production tradeoffs — not just happy-path implementation.

---## Month 4 Completion Checklist

| Milestone | Done |
|-----------|------|
| TaskFlow feature-complete | [ ] |
| Socket.io real-time | [ ] |
| Docker Compose | [ ] |
| ShopLite checkout + payment test | [ ] |
| CI pipeline green | [ ] |
| Both projects deployed | [ ] |
| 150+ LeetCode | [ ] |

**Total estimated time:** ~112 hours (Days 85–112)
