# Product Company Interview Bank — Node.js and Express (100 Questions)

> **Target companies:** Google, Meta, Microsoft, Amazon, Adobe, Atlassian, Uber, Flipkart
> **Rule:** Full terms only — spell out JWT as JSON Web Token, API as Application Programming Interface, etc.

---

### Question 1: What is Node.js?

**Answer:** Node.js is a JavaScript runtime built on Chrome's V8 engine that lets you run JavaScript outside the browser — on servers, command-line tools, and devices. It uses an event-driven, non-blocking Input/Output model, making it efficient for handling many concurrent connections. Companies use Node.js for Application Programming Interface (API) servers, real-time apps, and microservices because one language (JavaScript) spans frontend and backend.

---

### Question 2: What is the event loop in Node.js?

**Answer:** The event loop is how Node.js handles asynchronous operations on a single thread. When you call async functions (file read, database query, network request), Node delegates work to the system or thread pool and continues executing other code. When work completes, callbacks enter queues and the event loop processes them in phases: timers, pending callbacks, poll, check, and close callbacks. This lets one thread serve thousands of connections efficiently.

---

### Question 3: What are microtasks vs macrotasks in Node.js?

**Answer:** Microtasks (Promise callbacks, `queueMicrotask`) run after the current operation completes and before the next event loop phase — they have higher priority. Macrotasks (`setTimeout`, `setImmediate`, Input/Output callbacks) run in event loop phases. `process.nextTick` runs even before microtasks — use sparingly as it can starve the event loop. Order matters: synchronous code → `process.nextTick` → microtasks → macrotasks.

---

### Question 4: Is Node.js single-threaded?

**Answer:** JavaScript execution in Node.js is single-threaded — one call stack runs your code. However, Node.js uses libuv's thread pool (default 4 threads) for blocking operations like file system access, DNS lookup, and some cryptography. Network Input/Output is handled asynchronously by the operating system. For CPU-heavy work, use worker threads or separate processes to avoid blocking the event loop.

---

### Question 5: What happens if you block the event loop?

**Answer:** Blocking the event loop freezes the entire server — no requests get processed, timers stall, and clients timeout. Common blockers: synchronous file reads (`readFileSync`), heavy computation in a loop, large JSON parsing, or complex regex on big strings. Fix: use async APIs, offload CPU work to worker threads, or break work into chunks. Always profile with `--inspect` or logging if latency spikes.

---

### Question 6: What are Worker Threads in Node.js?

**Answer:** Worker Threads (`worker_threads` module) run JavaScript in parallel threads for CPU-intensive tasks — image processing, encryption, data crunching — without blocking the main event loop. Each worker has its own V8 instance. Communication happens via message passing. Use when work is CPU-bound; stick to async Input/Output for network and file operations on the main thread.

---

### Question 7: What is the difference between Node.js and Express?

**Answer:** Node.js is the runtime — it executes JavaScript and provides built-in modules (`http`, `fs`, `path`). Express is a minimal web framework built on Node.js that simplifies building web servers and Application Programming Interfaces. Express adds routing, middleware, request parsing, and response helpers. You can build APIs with raw Node.js `http`, but Express (or Fastify, Koa) saves boilerplate and is industry standard.

---

### Question 8: What is middleware in Express?

**Answer:** Middleware are functions that run between receiving a request and sending a response. Each middleware receives `(req, res, next)`. It can read/modify the request, end the response, or call `next()` to pass control to the next middleware. Examples: logging, parsing JSON body, authentication checks, error handling. Order matters — middleware runs in the order it is registered.

---

### Question 9: What are common built-in and third-party Express middleware?

**Answer:** Built-in (Express 4.16+): `express.json()` parses JSON bodies, `express.urlencoded()` parses form data, `express.static()` serves files. Popular third-party: `cors` for Cross-Origin Resource Sharing, `helmet` for security headers, `morgan` for HTTP logging, `compression` for gzip, `cookie-parser` for cookies. Apply global middleware early in `app.use()` before routes.

---

### Question 10: How do you create a basic Express server?

**Answer:** Install Express, import it, create an app, define routes, and listen on a port:

```javascript
const express = require('express');
const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(3000, () => console.log('Server on port 3000'));
```

This is the foundation for every Express Application Programming Interface.

---

### Question 11: What is REST (Representational State Transfer)?

**Answer:** REST is an architectural style for designing networked Application Programming Interfaces. Resources (users, orders) are identified by URLs. Standard HTTP methods map to actions: GET (read), POST (create), PUT/PATCH (update), DELETE (remove). Responses use HTTP status codes (200 success, 201 created, 404 not found, 500 server error). RESTful APIs are stateless — each request contains all information needed.

---

### Question 12: What are HTTP status codes you should know?

**Answer:** **2xx Success:** 200 OK, 201 Created, 204 No Content. **3xx Redirect:** 301 Moved Permanently, 304 Not Modified. **4xx Client Error:** 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity. **5xx Server Error:** 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable. Use precise codes — 401 when not authenticated, 403 when authenticated but not allowed.

---

### Question 13: How do you structure a REST API in Express?

**Answer:** Organize by resource with routers: `routes/users.js`, `routes/posts.js`. Mount with `app.use('/api/users', userRouter)`. Use appropriate HTTP methods on each route. Separate concerns: routes handle HTTP, controllers contain logic, services talk to databases, models define data shape. Example: `GET /api/users/:id` → `userController.getById` → `userService.findById` → MongoDB query.

---

### Question 14: What is the difference between `app.get` and `router.get`?

**Answer:** `app.get('/path', handler)` registers a route directly on the Express application. `router.get('/path', handler)` registers on a Router instance, which you mount with `app.use('/prefix', router)`. Routers modularize routes — a `userRouter` handles all `/users` endpoints in one file. Routers can have their own middleware applied to all routes in that module.

---

### Question 15: How do you handle route parameters and query strings?

**Answer:** Route parameters: `app.get('/users/:id', (req, res) => { const id = req.params.id })` — part of the URL path. Query strings: `GET /search?q=node&page=2` accessed via `req.query.q` and `req.query.page`. Body data (POST/PUT): parsed by `express.json()` into `req.body`. Always validate and sanitize all three — never trust client input.

---

### Question 16: What is request validation and why is it important?

**Answer:** Request validation checks that incoming data matches expected shape, types, and rules before processing. Prevents crashes, security holes, and bad database records. Use libraries like Joi, Zod, or express-validator. Example: email must be valid format, password minimum 8 characters, age must be a number. Return 400 Bad Request with clear error messages when validation fails.

---

### Question 17: How do you handle errors in Express?

**Answer:** Use try/catch in async route handlers and pass errors to Express via `next(error)`. Define an error-handling middleware with four arguments: `(err, req, res, next) => { res.status(err.status || 500).json({ message: err.message }) }`. Register it last, after all routes. For async functions, wrap handlers or use `express-async-errors` to auto-forward rejections. Never expose stack traces in production.

---

### Question 18: What is CORS (Cross-Origin Resource Sharing)?

**Answer:** CORS is a browser security mechanism that blocks web pages from calling APIs on a different domain unless the server explicitly allows it. Your React app on `localhost:3000` calling an API on `localhost:5000` needs CORS headers. Use the `cors` package: `app.use(cors({ origin: 'https://myapp.com' }))`. Server-to-server calls are not restricted by CORS — only browsers enforce it.

---

### Question 19: What is the difference between CommonJS and ES Modules in Node.js?

**Answer:** CommonJS uses `require()` and `module.exports` — the traditional Node.js system. ES Modules (ESM) use `import` and `export` — the JavaScript standard. Enable ESM with `"type": "module"` in `package.json` or `.mjs` file extension. Modern projects prefer ESM for consistency with frontend code. Node.js supports both; mixing requires care (`createRequire` for importing CommonJS in ESM).

---

### Question 20: What is `npm` and what is `package.json`?

**Answer:** npm (Node Package Manager) is the default registry and tool for installing JavaScript packages. `package.json` lists project metadata, dependencies, scripts (`"start": "node index.js"`), and version info. `package-lock.json` locks exact dependency versions for reproducible installs. Use `npm install express` to add packages; `npm run start` to run scripts. Alternatives: yarn, pnpm.

---

### Question 21: What is the Node.js `fs` module?

**Answer:** The `fs` (file system) module reads, writes, and manipulates files and directories. Always prefer async methods: `fs.promises.readFile('file.txt', 'utf8')` or `fs.readFile('file.txt', callback)`. Sync methods block the event loop. Common operations: `readFile`, `writeFile`, `readdir`, `mkdir`, `unlink` (delete). For streams on large files, use `createReadStream` instead of reading entire file into memory.

---

### Question 22: What are Streams in Node.js?

**Answer:** Streams process data piece by piece instead of loading everything into memory. Types: Readable (read file/network), Writable (write output), Duplex (both), Transform (modify while passing through). Example: reading a 1 GB file and piping to HTTP response without using 1 GB RAM. Use `pipe()` to connect streams: `readStream.pipe(writeStream)`. Essential for video, logs, and large file uploads.

---

### Question 23: What is the `path` module used for?

**Answer:** The `path` module handles file and directory paths in a cross-platform way. Key methods: `path.join('users', id, 'avatar.png')` builds paths safely, `path.resolve()` gets absolute paths, `path.extname('file.js')` returns `.js`, `path.basename()` gets filename. Always use `path.join` instead of string concatenation — Windows uses backslashes while Linux/Mac use forward slashes.

---

### Question 24: What is the `http` module vs Express?

**Answer:** Node's built-in `http` module creates servers with low-level control: `http.createServer((req, res) => { ... })`. You manually parse URLs, read bodies, and set headers. Express wraps `http` with routing, middleware, and helpers like `res.json()`. Use raw `http` for learning or minimal services; Express for real Application Programming Interfaces where developer productivity matters.

---

### Question 25: What is environment-based configuration?

**Answer:** Store settings like database URLs, API keys, and port numbers in environment variables, not hardcoded in source code. Use `process.env.PORT || 3000` and a `.env` file with `dotenv` package (loaded at startup). Different environments (development, staging, production) get different values. Never commit `.env` to git — use `.env.example` as a template. Platforms like AWS and Heroku inject env vars at deploy time.

---

### Question 26: How do you connect Node.js to MongoDB?

**Answer:** Use the official MongoDB driver or Mongoose (Object Document Mapper). With Mongoose: install mongoose, connect once at startup with `mongoose.connect(process.env.MONGODB_URI)`, define schemas and models, then query in routes. Connection pooling is handled automatically. Handle connection errors and disconnections. For serverless, consider connection caching to avoid opening too many connections per request.

---

### Question 27: What is Mongoose and what does it provide?

**Answer:** Mongoose is an Object Document Mapper (ODM) for MongoDB and Node.js. It defines schemas (field types, validation, defaults), models (constructors for documents), middleware (pre/post hooks), and query helpers. Example: a User schema with required email and hashed password. Mongoose adds structure to MongoDB's flexible documents and is standard in MERN stack tutorials and production apps.

---

### Question 28: What is the difference between SQL and MongoDB for Node.js developers?

**Answer:** SQL databases (PostgreSQL, MySQL) store data in tables with fixed schemas and use Structured Query Language. MongoDB stores JSON-like documents in collections with flexible schemas. Node.js works well with both — use Mongoose/Prisma for MongoDB, Sequelize/Prisma for SQL. MongoDB suits rapid prototyping and nested data; SQL suits complex relationships and transactions. Many companies use PostgreSQL even in "MERN" stacks (replacing M with PostgreSQL).

---

### Question 29: What is bcrypt and why use it for passwords?

**Answer:** bcrypt is a password hashing library — it converts plain passwords into one-way hashes that cannot be reversed. Never store plain text passwords. bcrypt adds a salt (random data) and is intentionally slow to resist brute-force attacks. In Node.js: `const hash = await bcrypt.hash(password, 12)` to store, `await bcrypt.compare(password, hash)` to verify on login. Use cost factor 10–12 for production.

---

### Question 30: What is JSON Web Token (JWT) authentication in Express?

**Answer:** JSON Web Token (JWT) is a compact token containing encoded user claims (user ID, role) signed with a secret. Flow: user logs in with credentials → server verifies → server sends JWT → client sends JWT in `Authorization: Bearer <token>` header on later requests → middleware verifies signature and attaches user to `req.user`. JWTs are stateless — no server-side session storage needed, but revocation is harder.

---

### Question 31: How do you write authentication middleware in Express?

**Answer:** Create middleware that reads the token from headers, verifies it with `jsonwebtoken.verify(token, secret)`, and calls `next()` or returns 401:

```javascript
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}
```

Apply to protected routes: `router.get('/profile', authMiddleware, getProfile)`.

---

### Question 32: What is the difference between authentication and authorization?

**Answer:** Authentication verifies who you are — login with username/password or OAuth. Authorization verifies what you are allowed to do — can this user delete this post? Authentication happens first (401 Unauthorized if failed). Authorization checks roles or permissions after auth (403 Forbidden if not allowed). Example: logged-in user (authenticated) who is not an admin trying to access admin panel (authorization fails).

---

### Question 33: What are sessions vs tokens?

**Answer:** Sessions store user state on the server (memory, Redis) with a session ID in a cookie — easy to revoke, harder to scale across servers. Tokens (JWT) store claims in the token itself — stateless, scales easily, but harder to invalidate before expiry. Sessions suit traditional web apps; JWTs suit Single Page Applications and mobile apps. Many apps use short-lived JWTs with refresh tokens stored in HTTP-only cookies.

---

### Question 34: What is rate limiting and how do you implement it?

**Answer:** Rate limiting restricts how many requests a client can make in a time window — prevents abuse, brute-force login, and denial-of-service. Use `express-rate-limit`: `app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))` allows 100 requests per 15 minutes per Internet Protocol (IP). Apply stricter limits on auth endpoints. In production, use Redis-backed rate limiting for distributed servers.

---

### Question 35: What is `helmet` in Express?

**Answer:** Helmet is middleware that sets security-related HTTP headers: Content Security Policy, X-Frame-Options (clickjacking protection), Strict-Transport-Security, and others. One line: `app.use(helmet())`. It does not replace proper authentication or input validation but adds defense-in-depth. Standard in production Express apps and often asked in security-focused interviews.

---

### Question 36: How do you handle file uploads in Express?

**Answer:** Use `multer` middleware for multipart form data. Configure storage (disk or memory), file size limits, and file type filters. Example: `upload.single('avatar')` adds file to `req.file`. Validate file types (only images), limit size (5 MB), scan for malware in production, and store in cloud storage (Amazon S3, Cloudinary) rather than local disk for scalability. Never execute uploaded files.

---

### Question 37: What is logging in Node.js applications?

**Answer:** Logging records events, errors, and request info for debugging and monitoring. Avoid `console.log` in production — use structured loggers like Winston or Pino that output JSON with timestamps, levels (info, warn, error), and request IDs. HTTP logging middleware (`morgan` or Pino-http) logs each request. Send logs to centralized systems (Datadog, CloudWatch, ELK stack) in production.

---

### Question 38: What is clustering in Node.js?

**Answer:** The `cluster` module forks worker processes sharing the same port — each runs on a separate CPU core. The primary process distributes incoming connections to workers. This uses multi-core machines since a single Node.js process uses one core. Example: `cluster.fork()` for each CPU. Alternatives: PM2 process manager with cluster mode, or Kubernetes scaling multiple containers.

---

### Question 39: What is PM2?

**Answer:** PM2 is a production process manager for Node.js. It keeps apps running (auto-restart on crash), supports cluster mode for multi-core, manages logs, and provides zero-downtime reloads. Commands: `pm2 start app.js`, `pm2 list`, `pm2 logs`. Use with ecosystem config files for environment variables and deploy scripts. Common in VPS deployments before container orchestration.

---

### Question 40: What is the difference between `process.env` and command-line arguments?

**Answer:** `process.env` holds environment variables set by the operating system, shell, or hosting platform — ideal for secrets and config that changes per environment. Command-line arguments (`process.argv`) are values passed when starting the script — useful for one-off scripts (`node migrate.js --up`). For web servers, prefer environment variables; never pass secrets as CLI args (visible in process lists).

---

### Question 41: What are Promises and async/await in Node.js?

**Answer:** Promises represent future completion of async work — `.then()` for success, `.catch()` for errors. `async/await` is syntactic sugar over Promises — `async function` always returns a Promise; `await` pauses until resolved. Use async/await for readable sequential code. Always wrap in try/catch or use `.catch()` to handle rejections — unhandled rejections can crash Node.js.

---

### Question 42: What is the difference between `setImmediate` and `setTimeout(fn, 0)`?

**Answer:** Both defer execution but run in different event loop phases. `setTimeout(fn, 0)` runs in the timers phase (minimum 1 ms delay in Node.js). `setImmediate(fn)` runs in the check phase, after poll — typically before `setTimeout(0)` when called from the main module. Inside Input/Output callbacks, order can vary. For deferring work after current operations, prefer `setImmediate` in Node.js-specific code.

---

### Question 43: What is an Application Programming Interface (API) version strategy?

**Answer:** Version your API when making breaking changes so existing clients keep working. Common approaches: URL path (`/api/v1/users`), header (`Accept: application/vnd.myapp.v1+json`), or query param. Start with v1, increment on breaking changes (removed fields, changed behavior). Deprecate old versions with sunset headers. Document changes in a changelog. Companies like Stripe maintain multiple API versions for years.

---

### Question 44: What is pagination in REST APIs?

**Answer:** Pagination splits large result sets into pages instead of returning thousands of records at once. Offset pagination: `GET /users?page=2&limit=20` — simple but slow on large offsets. Cursor pagination: `GET /users?cursor=abc123&limit=20` — faster for infinite scroll, uses a bookmark ID. Return metadata: total count, next cursor, hasMore. Default limits (e.g., max 100) prevent abuse.

---

### Question 45: What is idempotency in HTTP methods?

**Answer:** An idempotent operation produces the same result no matter how many times you call it. GET, PUT, DELETE are idempotent — calling DELETE twice on the same resource still leaves it deleted. POST is not idempotent — two identical POST requests create two resources. Important for retries: if a network request fails, safely retry idempotent methods; for POST payments, use idempotency keys to prevent duplicate charges.

---

### Question 46: How do you test Express APIs?

**Answer:** Use Jest or Mocha with Supertest — it sends HTTP requests to your Express app without starting a real server: `request(app).get('/api/users').expect(200)`. Mock database calls with libraries like `mongodb-memory-server` for integration tests. Test happy paths, error cases, auth middleware, and validation. Aim for route + service layer tests; end-to-end tests for critical flows.

---

### Question 47: What is WebSocket and when do you need it with Node.js?

**Answer:** WebSockets provide full-duplex, persistent connections between client and server — unlike HTTP request-response. Use for real-time features: chat, live notifications, collaborative editing, gaming. Libraries: `socket.io` (fallbacks, rooms) or `ws` (minimal). Express handles REST; add a WebSocket server on the same HTTP server or separate port. WebSockets do not replace REST for standard CRUD operations.

---

### Question 48: What is the difference between monolith and microservices with Node.js?

**Answer:** A monolith is one Node.js app handling all features — simpler to develop and deploy, good for startups. Microservices split features into independent services (user service, order service) communicating via HTTP or message queues — better isolation and scaling but more operational complexity. Start monolithic; extract microservices when teams or scaling demands it. Node.js suits both — lightweight and fast to spin up services.

---

### Question 49: What are common Node.js security best practices?

**Answer:** (1) Validate all input. (2) Use helmet, HTTPS, HTTP-only cookies. (3) Hash passwords with bcrypt. (4) Keep dependencies updated (`npm audit`). (5) Never expose stack traces. (6) Rate limit auth endpoints. (7) Use parameterized queries (prevent injection). (8) Store secrets in environment variables. (9) Principle of least privilege for database users. (10) Enable Cross-Origin Resource Sharing only for trusted origins.

---

### Question 50: How would you explain your Node.js backend in an interview?

**Answer:** Cover: (1) Purpose — what the API serves (e-commerce, social app). (2) Stack — Express, MongoDB/Mongoose, JWT auth. (3) Architecture — folder structure (routes, controllers, services, models), middleware pipeline. (4) Key decisions — why REST, how you handle errors and validation, caching if any. (5) Scale considerations — connection pooling, rate limiting, logging. (6) One challenge you solved — e.g., fixing N+1 queries, securing endpoints, or handling file uploads. Be specific with endpoints and tradeoffs.
---

## Questions 51–100 (top product companies)

### Question 51: How do you structure a production Express app?
**Answer:** routes → controllers → services → repositories. No business logic in routers. Adobe / Razorpay.

### Question 52: What is helmet and why do product companies want it?
**Answer:** Secure headers: CSP, HSTS, frame guard. Default first line of HTTP hardening. Amazon / Flipkart.

### Question 53: How do you rotate JSON Web Token refresh tokens?
**Answer:** One-time refresh, store hash, detect reuse → revoke family. Auth PDF. Amazon / PhonePe.

### Question 54: What is the difference between 401 and 403?
**Answer:** 401: not authenticated. 403: authenticated but not allowed. Object-level checks. All.

### Question 55: How do you handle file uploads safely?
**Answer:** Size limit, mime allow-list, store outside web root / S3, virus scan if needed, unique names. Amazon / Flipkart.

### Question 56: Explain Zod at the boundary.
**Answer:** Parse req.body once; never trust query strings. Fail 400 with field errors. Stripe-like APIs.

### Question 57: How do you do pagination that stays stable when new rows insert?
**Answer:** Cursor (`id` / `created_at`) not `OFFSET`. Uber / Twitter-style feeds.

### Question 58: What is a circuit breaker in a Node service?
**Answer:** Stop calling a dying dependency after N failures; half-open probe. Uber / Amazon.

### Question 59: How do you keep secrets out of logs and git?
**Answer:** Env + secret manager, redact tokens, git-secrets / scanning. All.

### Question 60: process.nextTick vs setImmediate vs setTimeout(0)?
**Answer:** nextTick before Promises (Node); setImmediate in check phase; setTimeout in timers. Amazon Node.

### Question 61: How do you test an Express route?
**Answer:** Supertest against the app, mock the repository, assert status and body. Phase 4. Adobe.

### Question 62: What is graceful degrade when Redis is down?
**Answer:** Read from DB, hide non-critical features, alert. Do not 500 the whole site. Uber / Flipkart.

### Question 63: How do you implement idempotent PUT vs POST?
**Answer:** PUT same URL same body = same resource. POST create needs Idempotency-Key. Stripe / Razorpay.

### Question 64: What is the N+1 in an ORM and the fix?
**Answer:** Include/join or DataLoader. Log queries in staging. Microsoft / Uber.

### Question 65: How do you version a public API?
**Answer:** URL `/v1` or header. Never break v1; add v2. Adobe / Stripe.

### Question 66: What headers do you send for JSON errors?
**Answer:** `Content-Type: application/json`, stable `{ error, code, requestId }`. All.

### Question 67: How do you prevent SSRF when fetching a user URL?
**Answer:** Allow-list schemes/hosts, block link-local/metadata IPs. Amazon / Google.

### Question 68: Explain clustering in Node and its limit.
**Answer:** One process per core sharing a port. Still one thread per process for JS. CPU work needs workers. Amazon.

### Question 69: How do you run migrations in CI/CD?
**Answer:** Migrate in the release job before traffic switches; backward-compatible steps. Adobe / Amazon.

### Question 70: What is a poison message in a queue?
**Answer:** A message that always fails. After N retries → dead letter + alert. Uber / Amazon.

### Question 71: How do you implement search on Postgres cheaply?
**Answer:** `pg_trgm` / `tsvector` for modest scale; OpenSearch when it outgrows. Flipkart / Adobe.

### Question 72: Cookie flags that must be set for auth.
**Answer:** HttpOnly, Secure, SameSite=Lax or Strict, short max-age. All.

### Question 73: How do you do fan-out of emails without blocking the request?
**Answer:** Insert row + enqueue; 202 Accepted. PDF #10 notifications. Flipkart / Uber.

### Question 74: What is request-id and why inject it?
**Answer:** One id in logs, traces, and the error response. Debug production. Amazon / Google.

### Question 75: How do you handle multi-tenant data isolation?
**Answer:** `tenant_id` on every row + forced WHERE in the repository. Salesforce / Adobe.

### Question 76: Explain Prisma vs raw SQL tradeoff.
**Answer:** Prisma for CRUD speed; raw for ugly queries and EXPLAIN. Microsoft / Uber.

### Question 77: How do you cap JSON body size?
**Answer:** `express.json({ limit: "100kb" })`. Prevent memory bombs. Amazon.

### Question 78: What is a health check vs a readiness check?
**Answer:** Liveness: process up. Readiness: DB pool ok. Kubernetes uses both. Amazon / Adobe.

### Question 79: How do you implement feature flags?
**Answer:** Service like LaunchDarkly or a table; default safe; no deploy to toggle. Meta / Uber.

### Question 80: What is the risk of `eval` or `new Function` on the server?
**Answer:** Remote code execution. Never on user input. All.

### Question 81: How do you stream a CSV export?
**Answer:** SQL cursor + stream to response; do not load all rows. Microsoft / Adobe.

### Question 82: Explain eventual consistency in your own API.
**Answer:** After write, a read replica may lag — read-your-writes from primary. Meta / Uber.

### Question 83: How do you protect webhooks?
**Answer:** Signature (HMAC), timestamp window, idempotency on event id. Stripe / Razorpay / PhonePe.

### Question 84: What is the difference between horizontal and vertical scaling for Node?
**Answer:** Vertical: bigger box. Horizontal: more processes/replicas behind a load balancer. All HLD.

### Question 85: How do you do blue-green or rolling deploys?
**Answer:** New replicas healthy, then shift traffic; keep old for rollback. Amazon / Adobe.

### Question 86: What belongs in middleware vs a service?
**Answer:** Middleware: auth, request-id, language. Service: business rules. Razorpay.

### Question 87: How do you handle timezone in APIs?
**Answer:** Store UTC; display in client locale. Meeting Rooms problems. Uber / Google Calendar-style.

### Question 88: What is a leaked promise in a request handler?
**Answer:** You started async work and responded without waiting or tracking — double send or lost error. Amazon.

### Question 89: How do you implement per-user rate limits in Redis?
**Answer:** INCR + EXPIRE or token bucket Lua. Key = userId. Uber / Amazon.

### Question 90: What is OWASP broken access control in a MERN app?
**Answer:** User A fetches user B’s order by changing id. Check ownership every time. All.

### Question 91: How do you shut down WebSocket servers gracefully?
**Answer:** Stop upgrades, close sockets with a code, drain. Uber / Meta chat.

### Question 92: Explain exactly-once vs at-least-once for your queue.
**Answer:** Most Node queues are at-least-once; make handlers idempotent. Amazon / Uber.

### Question 93: How do you store passwords?
**Answer:** bcrypt/argon2, unique salt, never log, rotate on leak. All.

### Question 94: What is a BFF and when do you want one?
**Answer:** Backend-for-frontend aggregates for a specific client. Atlassian / Meta FE.

### Question 95: How do you detect a memory leak in Node?
**Answer:** heap snapshots, rising RSS, `--inspect`. Large caches without TTL. Amazon / Adobe.

### Question 96: What is the difference between PUT and PATCH?
**Answer:** PUT replaces; PATCH partial. Idempotency differs. Stripe-style APIs.

### Question 97: How do you implement search-as-you-type on the server?
**Answer:** Debounce is client; server: prefix index, limit 10, cache hot prefixes. Typeahead HLD. Google / Uber.

### Question 98: What logs do you never write?
**Answer:** Passwords, tokens, card numbers, session ids. PCI / privacy. All.

### Question 99: How do you write a postmortem for a 5xx spike?
**Answer:** Timeline, impact, root cause, blast radius, action items with owners. Amazon LP. 

### Question 100: Walk through TaskFlow’s API like a hostile interviewer.
**Answer:** Auth, models, sockets, failure modes, what you would shard. Phase 8. All.
