# Node.js & Express — Complete Notes

---

## 1. What is Node.js?

- **JavaScript runtime** built on Chrome's V8 engine
- **Event-driven, non-blocking I/O** — handles many concurrent connections
- **Single-threaded** — uses event loop + thread pool for I/O

**Use cases:** APIs, real-time apps, microservices, CLI tools.

---

## 2. Event Loop (Deep)

```
   ┌─────────────────────────┐
   │   timers (setTimeout)   │
   ├─────────────────────────┤
   │   pending callbacks     │
   ├─────────────────────────┤
   │   idle, prepare         │
   ├─────────────────────────┤
   │   poll (I/O)            │  ← waits for I/O events
   ├─────────────────────────┤
   │   check (setImmediate)  │
   ├─────────────────────────┤
   │   close callbacks       │
   └─────────────────────────┘
        ↑ microtasks (Promises) run between phases
```

**Interview:** Node is single-threaded but non-blocking. Heavy CPU work blocks the loop — use Worker Threads for that.

---

## 3. Modules (CommonJS vs ESM)

```javascript
// CommonJS (legacy)
const fs = require("fs");
module.exports = { myFn };

// ESM (modern — use this)
import fs from "fs";
export { myFn };
export default myFn;
```

---

## 4. Express.js Architecture

```
Request → Middleware → Middleware → Route Handler → Response
```

### Basic server

```typescript
import express from "express";
const app = express();

app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(3000, () => console.log("Server on :3000"));
```

---

## 5. Middleware

```typescript
// Logger middleware
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // MUST call next() or request hangs
};

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

app.use(logger);
app.get("/profile", auth, (req, res) => {
  res.json(req.user);
});
```

---

## 6. Layered Architecture (Production pattern)

```
routes/       → define endpoints
controllers/  → handle req/res, call services
services/     → business logic
repositories/ → database queries
models/       → data schemas
middleware/   → auth, validation, error handling
utils/        → helpers
```

---

## 7. Error Handling

```typescript
// Async error wrapper
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Global error handler (last middleware)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});
```

---

## 8. Validation with Zod

```typescript
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().int().min(18).optional(),
});

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() });
  }
  req.body = result.data;
  next();
};

app.post("/users", validate(createUserSchema), createUser);
```

---

## 9. REST API Design

| Method | Path | Action |
|--------|------|--------|
| GET | /users | List users (paginated) |
| GET | /users/:id | Get one user |
| POST | /users | Create user |
| PUT | /users/:id | Replace user |
| PATCH | /users/:id | Partial update |
| DELETE | /users/:id | Delete user |

**Status codes:** 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 500 Internal Error.

**Pagination:**
```
GET /users?page=2&limit=20&sort=-createdAt
Response: { data: [...], meta: { total, page, limit, pages } }
```

---

## 10. Streams & File Handling

```typescript
import fs from "fs";
import { pipeline } from "stream/promises";

// Efficient large file processing
await pipeline(
  fs.createReadStream("input.csv"),
  transformStream,
  fs.createWriteStream("output.csv")
);
```

---

## 11. Interview Topics

- Event loop phases
- Difference between Node and browser JS
- How to handle concurrent requests
- Middleware execution order
- Error handling in async Express
- When to use streams
