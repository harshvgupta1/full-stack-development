# Node.js & Express — Complete Theory Guide

<!-- SCHEDULE-BANNER-START -->
> **📅 Study window:** 12 Oct 2026 – 18 Oct 2026 (Days 57–63)
> **⏰ Your slots (IST):** Mon–Fri **7:30–8:30pm** & **9:00–10:00pm** · Sat–Sun **9:00am–12:00pm**, **3:00–5:30pm**, **6:00–8:30pm**
> **📧 Calendar reminders:** harsh.gupta@getreelax.com — import `calendar/mern-mastery-study.ics`
<!-- SCHEDULE-BANNER-END -->

> **Goal:** Master Node.js internals and Express.js architecture for production backend development — event loop, middleware, REST design, validation, error handling, streams, security, and layered architecture.

---

## Table of Contents

1. [What is Node.js?](#1-what-is-nodejs)
2. [Event Loop Deep Dive](#2-event-loop-deep-dive)
3. [Modules: CommonJS vs ESM](#3-modules-commonjs-vs-esm)
4. [Express Architecture](#4-express-architecture)
5. [Middleware Patterns](#5-middleware-patterns)
6. [REST API Design](#6-rest-api-design)
7. [Validation & Sanitization](#7-validation--sanitization)
8. [Error Handling](#8-error-handling)
9. [Streams & Buffers](#9-streams--buffers)
10. [Security Best Practices](#10-security-best-practices)
11. [Layered Architecture](#11-layered-architecture)
12. [Testing & Production Readiness](#12-testing--production-readiness)
13. [Interview Q&A](#13-interview-qa)
14. [Practice Links & Resources](#14-practice-links--resources)

---

## 1. What is Node.js?

Node.js is a **JavaScript runtime** built on Chrome's **V8 engine**. It enables JavaScript to run on the server, not just in browsers.

| Characteristic | Description |
|---------------|-------------|
| Runtime | V8 JavaScript engine |
| I/O Model | Event-driven, non-blocking |
| Threading | Single-threaded event loop + libuv thread pool |
| Module system | CommonJS (legacy) + ESM (modern) |
| Package manager | npm / yarn / pnpm |

### Why Node.js for Backend?

| Advantage | Explanation |
|-----------|-------------|
| Unified language | Same JS/TS on frontend and backend |
| Non-blocking I/O | Handles thousands of concurrent connections |
| Huge ecosystem | npm — largest package registry |
| JSON native | Perfect for REST APIs |
| Real-time | WebSockets, SSE built-in support |

### When NOT to Use Node.js

| Scenario | Better Alternative |
|----------|-------------------|
| CPU-intensive (video encoding, ML) | Python, Go, Rust + Worker Threads |
| Heavy computation | Go, Java |
| Complex transactional systems | Java, C# |
| Legacy enterprise integration | Java, .NET |

---

## 2. Event Loop Deep Dive

The event loop is Node.js's core mechanism for handling **concurrency without multi-threading**.

### Event Loop Phases

```
   ┌─────────────────────────────┐
   │  1. timers                  │  ← setTimeout, setInterval callbacks
   ├─────────────────────────────┤
   │  2. pending callbacks       │  ← I/O callbacks deferred to next loop
   ├─────────────────────────────┤
   │  3. idle, prepare           │  ← internal use only
   ├─────────────────────────────┤
   │  4. poll                    │  ← retrieve new I/O events; block here
   ├─────────────────────────────┤
   │  5. check                   │  ← setImmediate callbacks
   ├─────────────────────────────┤
   │  6. close callbacks         │  ← socket.on('close', ...)
   └─────────────────────────────┘

   Between EVERY phase: process microtask queue
   (Promise.then, queueMicrotask, process.nextTick*)
   * process.nextTick runs BEFORE other microtasks
```

### Macro vs Micro Tasks

| Type | Examples | Priority |
|------|----------|----------|
| `process.nextTick` | `process.nextTick(fn)` | Highest (runs before microtasks) |
| Microtasks | `Promise.then`, `queueMicrotask` | High (between loop phases) |
| Macrotasks | `setTimeout`, `setImmediate`, I/O | Normal (loop phases) |

### Code Example: Execution Order

```javascript
console.log("1: sync start");

setTimeout(() => console.log("2: setTimeout"), 0);

Promise.resolve().then(() => console.log("3: promise"));

process.nextTick(() => console.log("4: nextTick"));

setImmediate(() => console.log("5: setImmediate"));

console.log("6: sync end");

// Output:
// 1: sync start
// 6: sync end
// 4: nextTick
// 3: promise
// 2: setTimeout
// 5: setImmediate
```

### Non-Blocking I/O Explained

```javascript
const fs = require("fs");

console.log("Start");

// Non-blocking — callback queued, loop continues
fs.readFile("./large-file.txt", "utf8", (err, data) => {
  console.log("File read complete:", data.length);
});

console.log("End — this prints BEFORE file read");

// Output: Start → End → File read complete
```

### libuv Thread Pool

Not all operations are truly non-blocking. These use a **4-thread pool** (configurable via `UV_THREADPOOL_SIZE`):

| Operation | Thread Pool? |
|-----------|-------------|
| File system (`fs.readFile`) | ✅ Yes |
| DNS lookup (`dns.lookup`) | ✅ Yes |
| Crypto (`crypto.pbkdf2`) | ✅ Yes |
| Network I/O (`http.request`) | ❌ No (OS async) |
| Database queries | ❌ No (network) |

### Blocking the Event Loop — Anti-Pattern

```javascript
// ❌ BLOCKS the entire event loop — all requests freeze
app.get("/bad", (req, res) => {
  let result = 0;
  for (let i = 0; i < 10_000_000_000; i++) {
    result += i;
  }
  res.json({ result });
});

// ✅ Offload CPU work to Worker Threads
import { Worker } from "worker_threads";

app.get("/good", (req, res) => {
  const worker = new Worker("./heavy-compute.js");
  worker.on("message", result => res.json({ result }));
  worker.on("error", err => res.status(500).json({ error: err.message }));
});
```

### Worker Threads Example

```javascript
// heavy-compute.js
import { parentPort, workerData } from "worker_threads";

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(workerData.n);
parentPort.postMessage(result);
```

---

## 3. Modules: CommonJS vs ESM

### Comparison

| Feature | CommonJS | ESM |
|---------|----------|-----|
| Syntax | `require()` / `module.exports` | `import` / `export` |
| Loading | Synchronous | Asynchronous |
| Tree shaking | ❌ | ✅ |
| Top-level await | ❌ | ✅ |
| `"type": "module"` in package.json | Not needed | Required for .js ESM |

### ESM (Modern — Use This)

```typescript
// user.service.ts
import { prisma } from "../lib/prisma.js"; // .js extension required in ESM
import type { User } from "../types/user.js";

export async function findUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

export default { findUserById };
```

```typescript
// user.controller.ts
import { findUserById } from "./user.service.js";

export async function getUser(req: Request, res: Response) {
  const user = await findUserById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
}
```

### package.json for ESM + TypeScript

```json
{
  "name": "my-api",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

---

## 4. Express Architecture

Express is a **minimal, unopinionated** web framework for Node.js.

```
HTTP Request
     │
     ▼
┌─────────────┐
│  Middleware  │  ← logging, cors, body parser
├─────────────┤
│  Middleware  │  ← auth, rate limit
├─────────────┤
│ Route Handler│  ← business logic
├─────────────┤
│ Error Handler│  ← 4-arg middleware
└─────────────┘
     │
     ▼
HTTP Response
```

### Production Server Setup

```typescript
// src/index.ts
import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import { userRouter } from "./routes/user.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

// Security & performance middleware
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(",") ?? "*" }));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check (before auth)
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/v1/users", userRouter);

// 404 + error handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
```

### Router Modularization

```typescript
// src/routes/user.routes.ts
import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/authenticate.js";
import { CreateUserSchema, UpdateUserSchema } from "../schemas/user.schema.js";
import * as userController from "../controllers/user.controller.js";

export const userRouter = Router();

userRouter.get("/", userController.listUsers);
userRouter.get("/:id", userController.getUser);
userRouter.post("/", validate(CreateUserSchema), userController.createUser);
userRouter.patch("/:id", authenticate, validate(UpdateUserSchema), userController.updateUser);
userRouter.delete("/:id", authenticate, userController.deleteUser);
```

---

## 5. Middleware Patterns

Middleware functions have signature: `(req, res, next) => void` or async variant.

### Custom Logger Middleware

```typescript
import { Request, Response, NextFunction } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });

  next();
}
```

### Authentication Middleware

```typescript
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string; role: string };
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ error: "Token expired or invalid" });
  }
}

export function authorize(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}
```

### Rate Limiting

```typescript
import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { error: "Too many login attempts." },
});

// Usage
app.use("/api/", apiLimiter);
app.use("/api/auth/login", authLimiter);
```

### Middleware Execution Order

| Order | Middleware | Why |
|-------|-----------|-----|
| 1 | `helmet`, `cors` | Security headers first |
| 2 | `compression` | Before response sent |
| 3 | `morgan` / logger | Log all requests |
| 4 | Body parsers | Before route handlers read body |
| 5 | Rate limiter | Before expensive handlers |
| 6 | Auth middleware | Per-route or route group |
| 7 | Route handlers | Business logic |
| 8 | 404 handler | Catch unknown routes |
| 9 | Error handler | Must have 4 parameters |

---

## 6. REST API Design

### REST Principles

| Principle | Implementation |
|-----------|---------------|
| Resource-based URLs | `/users`, `/users/123/orders` |
| HTTP verbs | GET (read), POST (create), PUT/PATCH (update), DELETE |
| Stateless | No server-side session; use JWT |
| Representations | JSON (primary), XML (legacy) |
| Status codes | Semantic HTTP codes |

### URL Design Rules

```
✅ Good                          ❌ Bad
GET  /api/v1/users               GET  /api/getUsers
GET  /api/v1/users/123           GET  /api/user?id=123
POST /api/v1/users               POST /api/v1/createUser
GET  /api/v1/users/123/orders    GET  /api/v1/orders?userId=123
```

### HTTP Status Codes Reference

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Successful GET, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation failure |
| 401 | Unauthorized | Missing/invalid auth |
| 403 | Forbidden | Valid auth, insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate email, version conflict |
| 422 | Unprocessable Entity | Semantic validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unhandled exception |

### Pagination, Filtering, Sorting

```typescript
// GET /api/v1/users?page=2&limit=20&role=admin&sort=-createdAt&search=john

export async function listUsers(req: Request, res: Response) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const where = {
    ...(req.query.role && { role: req.query.role as string }),
    ...(req.query.search && {
      OR: [
        { name: { contains: req.query.search as string, mode: "insensitive" as const } },
        { email: { contains: req.query.search as string, mode: "insensitive" as const } },
      ],
    }),
  };

  const sortField = (req.query.sort as string)?.replace(/^-/, "") ?? "createdAt";
  const sortOrder = (req.query.sort as string)?.startsWith("-") ? "desc" : "asc";

  const [users, total] = await Promise.all([
    prisma.user.findMany({ where, skip, take: limit, orderBy: { [sortField]: sortOrder } }),
    prisma.user.count({ where }),
  ]);

  res.json({
    data: users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
}
```

### API Versioning Strategies

| Strategy | Example | Pros | Cons |
|----------|---------|------|------|
| URL path | `/api/v1/users` | Simple, explicit | URL changes |
| Header | `Accept: application/vnd.api.v2+json` | Clean URLs | Harder to test |
| Query param | `/api/users?version=2` | Easy | Messy |

### Consistent Response Envelope

```typescript
// Success
{ "data": { ... }, "meta": { "page": 1, "total": 100 } }

// Error
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }
```

---

## 7. Validation & Sanitization

Never trust client input. Validate at the **boundary** (controller/route handler).

### Zod Validation Middleware

```typescript
// src/schemas/user.schema.ts
import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(128),
  role: z.enum(["user", "admin"]).default("user"),
});

export const UpdateUserSchema = CreateUserSchema.partial().omit({ password: true });

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
```

```typescript
// src/middleware/validate.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request body",
          details: result.error.flatten().fieldErrors,
        },
      });
    }

    req.body = result.data; // typed, sanitized body
    next();
  };
}
```

### Input Sanitization Checklist

| Field | Sanitization |
|-------|-------------|
| Email | Lowercase, trim |
| Strings | Trim whitespace, max length |
| HTML content | Escape or use DOMPurify |
| IDs | Validate UUID/ObjectId format |
| Numbers | Parse and range-check |
| Arrays | Max length, validate each item |

---

## 8. Error Handling

### Custom Error Classes

```typescript
// src/errors/AppError.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, "NOT_FOUND", `${resource} not found`);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public details?: unknown) {
    super(400, "VALIDATION_ERROR", message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(401, "UNAUTHORIZED", message);
  }
}
```

### Global Error Handler

```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import { ZodError } from "zod";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // Log error (use structured logging in production)
  console.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message },
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid input",
        details: err.flatten().fieldErrors,
      },
    });
  }

  // Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    const prismaErr = err as { code: string };
    if (prismaErr.code === "P2002") {
      return res.status(409).json({ error: { code: "DUPLICATE", message: "Record already exists" } });
    }
  }

  // Unknown errors — don't leak internals
  res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
  });
}
```

### Async Error Wrapper

```typescript
// Avoid try/catch in every controller
import { Request, Response, NextFunction, RequestHandler } from "express";

export function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Usage
export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.findById(req.params.id);
  if (!user) throw new NotFoundError("User");
  res.json({ data: user });
});
```

### Error Handling Rules

| Rule | Reason |
|------|--------|
| Operational errors → 4xx | Client can fix (validation, auth) |
| Programming errors → 5xx | Server bug; log and alert |
| Never expose stack traces in production | Security risk |
| Always call `next(err)` in middleware | Propagates to error handler |
| Error handler must have 4 params | Express identifies it by arity |

---

## 9. Streams & Buffers

### Why Streams?

| Approach | Memory for 1GB file |
|----------|-------------------|
| Read entire file | ~1GB RAM |
| Stream | ~64KB RAM (chunk size) |

### Stream Types

| Type | Direction | Example |
|------|-----------|---------|
| Readable | Source | `fs.createReadStream`, HTTP request body |
| Writable | Destination | `fs.createWriteStream`, HTTP response |
| Duplex | Both | TCP socket, WebSocket |
| Transform | Modify while piping | gzip, crypto cipher |

### File Upload with Streams

```typescript
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { createWriteStream } from "fs";

app.post("/upload", async (req, res, next) => {
  const filename = `upload-${Date.now()}.csv`;
  const dest = path.join("./uploads", filename);

  try {
    await pipeline(req, createWriteStream(dest));
    res.json({ message: "Upload complete", filename });
  } catch (err) {
    next(err);
  }
});
```

### Transform Stream Example

```typescript
import { Transform } from "stream";

const upperCaseTransform = new Transform({
  transform(chunk, _encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});

fs.createReadStream("input.txt")
  .pipe(upperCaseTransform)
  .pipe(fs.createWriteStream("output.txt"));
```

### Buffers

```typescript
// Buffer — raw binary data
const buf = Buffer.from("Hello", "utf8");
console.log(buf.toString("hex")); // 48656c6c6f
console.log(buf.length);          // 5 bytes

// Concatenate buffers
const combined = Buffer.concat([buf, Buffer.from(" World")]);
```

---

## 10. Security Best Practices

### OWASP Top 10 Mitigations in Express

| Vulnerability | Mitigation |
|--------------|------------|
| Injection (SQL, NoSQL) | Parameterized queries, ORM, input validation |
| Broken Authentication | JWT httpOnly cookies, bcrypt, rate limiting |
| Sensitive Data Exposure | HTTPS, env vars, no secrets in code |
| XSS | Escape output, CSP headers, httpOnly cookies |
| CSRF | SameSite cookies, CSRF tokens for forms |
| Security Misconfiguration | Helmet, disable `X-Powered-By` |
| Broken Access Control | RBAC middleware, check ownership |
| SSRF | Validate URLs, allowlist domains |

### Security Middleware Stack

```typescript
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

app.use(mongoSanitize()); // prevent NoSQL injection
app.use(hpp());           // prevent HTTP parameter pollution

// Disable X-Powered-By
app.disable("x-powered-by");
```

### Password Hashing

```typescript
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### Environment Variables

```typescript
// src/config/env.ts — validate env at startup
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("7d"),
});

export const env = EnvSchema.parse(process.env);
// App crashes immediately if env is invalid — fail fast
```

---

## 11. Layered Architecture

Production Express apps use **separation of concerns** across layers.

```
┌──────────────────────────────────────┐
│           Routes Layer               │  HTTP routing, middleware chain
├──────────────────────────────────────┤
│         Controllers Layer            │  Request/response handling
├──────────────────────────────────────┤
│          Services Layer              │  Business logic
├──────────────────────────────────────┤
│        Repositories Layer            │  Data access (DB queries)
├──────────────────────────────────────┤
│         Database / External          │  PostgreSQL, MongoDB, Redis
└──────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Responsibility | Should NOT |
|-------|---------------|------------|
| Routes | URL mapping, middleware | Contain business logic |
| Controllers | Parse request, call service, send response | Direct DB queries |
| Services | Business rules, orchestration | Know about HTTP |
| Repositories | CRUD, queries | Contain business logic |

### Full Example: User Module

```typescript
// src/repositories/user.repository.ts
import { prisma } from "../lib/prisma.js";
import type { CreateUserInput } from "../schemas/user.schema.js";

export const userRepository = {
  findById: (id: string) => prisma.user.findUnique({ where: { id } }),
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
  findMany: (skip: number, take: number) =>
    prisma.user.findMany({ skip, take, orderBy: { createdAt: "desc" } }),
  count: () => prisma.user.count(),
  create: (data: CreateUserInput & { passwordHash: string }) =>
    prisma.user.create({ data, select: { id: true, name: true, email: true, role: true } }),
  delete: (id: string) => prisma.user.delete({ where: { id } }),
};
```

```typescript
// src/services/user.service.ts
import { userRepository } from "../repositories/user.repository.js";
import { hashPassword } from "../utils/password.js";
import { NotFoundError, ValidationError } from "../errors/AppError.js";
import type { CreateUserInput } from "../schemas/user.schema.js";

export const userService = {
  async getById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError("User");
    return user;
  },

  async list(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      userRepository.findMany(skip, limit),
      userRepository.count(),
    ]);
    return { users, total, page, limit };
  },

  async create(input: CreateUserInput) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) throw new ValidationError("Email already registered");

    const passwordHash = await hashPassword(input.password);
    return userRepository.create({ ...input, passwordHash });
  },

  async delete(id: string) {
    await this.getById(id); // throws if not found
    return userRepository.delete(id);
  },
};
```

```typescript
// src/controllers/user.controller.ts
import { Request, Response } from "express";
import { userService } from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getById(req.params.id);
  res.json({ data: user });
});

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const result = await userService.list(page, limit);
  res.json({ data: result.users, meta: { page: result.page, limit: result.limit, total: result.total } });
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.create(req.body);
  res.status(201).json({ data: user });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await userService.delete(req.params.id);
  res.status(204).send();
});
```

### Project Structure

```
src/
├── index.ts
├── config/
│   └── env.ts
├── routes/
│   ├── index.ts
│   └── user.routes.ts
├── controllers/
│   └── user.controller.ts
├── services/
│   └── user.service.ts
├── repositories/
│   └── user.repository.ts
├── middleware/
│   ├── authenticate.ts
│   ├── validate.ts
│   └── errorHandler.ts
├── schemas/
│   └── user.schema.ts
├── errors/
│   └── AppError.ts
└── utils/
    ├── asyncHandler.ts
    └── password.ts
```

---

## 12. Testing & Production Readiness

### Testing Pyramid

| Level | Tool | What to Test |
|-------|------|-------------|
| Unit | Vitest/Jest | Services, utils, validators |
| Integration | Supertest | Routes + DB |
| E2E | Playwright | Full user flows |

### Integration Test Example

```typescript
import request from "supertest";
import app from "../src/index.js";
import { prisma } from "../src/lib/prisma.js";

describe("POST /api/v1/users", () => {
  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  it("creates a user with valid input", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .send({ name: "Amit", email: "amit@test.com", password: "password123" })
      .expect(201);

    expect(res.body.data.email).toBe("amit@test.com");
    expect(res.body.data.password).toBeUndefined();
  });

  it("returns 400 for invalid email", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .send({ name: "Amit", email: "not-an-email", password: "password123" })
      .expect(400);

    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});
```

### Graceful Shutdown

```typescript
const server = app.listen(PORT);

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});
```

---

## 13. Interview Q&A

### Q1: Explain the Node.js event loop.

**Answer:** Node.js uses a single-threaded event loop to handle async I/O. When an async operation (file read, DB query) starts, Node delegates it to libuv/OS and continues executing. When complete, the callback enters the appropriate queue (timers, poll, check). Microtasks (Promises) run between phases. This allows handling thousands of concurrent connections without thread-per-request overhead.

### Q2: What is the difference between `setImmediate` and `setTimeout(fn, 0)`?

**Answer:** `setTimeout(fn, 0)` goes to the timers phase (minimum 1ms delay in Node). `setImmediate` runs in the check phase, after the poll phase completes. Inside an I/O callback, `setImmediate` always runs before `setTimeout`. At the top level, order is non-deterministic.

### Q3: How does Express middleware work?

**Answer:** Middleware functions form a pipeline. Each receives `(req, res, next)`. Calling `next()` passes control to the next middleware. If middleware doesn't call `next()` or send a response, the request hangs. Error-handling middleware has 4 parameters `(err, req, res, next)` and must be registered last.

### Q4: How do you prevent common security vulnerabilities?

**Answer:** Use Helmet for security headers, validate/sanitize all input with Zod, parameterize DB queries via ORM, hash passwords with bcrypt, store JWTs in httpOnly cookies, rate-limit auth endpoints, keep dependencies updated, validate env vars at startup, and never expose stack traces in production.

### Q5: What is the difference between PUT and PATCH?

**Answer:** PUT replaces the entire resource — client sends full representation. PATCH applies partial updates — only changed fields. Use PATCH for most update operations; PUT when replacing the whole resource.

### Q6: How do you handle errors in async Express handlers?

**Answer:** Wrap async handlers with an `asyncHandler` utility that catches rejected Promises and calls `next(err)`. Alternatively use `express-async-errors` package. Without this, unhandled rejections crash the process or leave requests hanging.

### Q7: Explain layered architecture benefits.

**Answer:** Separates HTTP concerns (controllers), business logic (services), and data access (repositories). Benefits: testability (mock repositories in service tests), maintainability (change DB without touching controllers), reusability (services callable from CLI, jobs, other services).

### Q8: When would you use streams?

**Answer:** When processing large files or data that doesn't fit in memory — file uploads/downloads, video processing, log parsing, CSV import/export. Streams process data in chunks (~64KB), keeping memory constant regardless of file size.

---

## 14. Practice Links & Resources

### Official Documentation
- [Node.js Docs](https://nodejs.org/docs) — API reference
- [Express.js Guide](https://expressjs.com/en/guide/routing.html) — Routing, middleware
- [Node.js Design Patterns](https://www.nodejsdesignpatterns.com) — Book by Mammino & Luciano

### Interactive Learning
- [Node.js Event Loop Visualizer](https://www.youtube.com/watch?v=8aGhZQkoFbQ) — Philip Roberts talk
- [Express Middleware Practice](https://github.com/expressjs/express/tree/master/examples) — Official examples

### Practice Projects

| Project | Skills |
|---------|--------|
| REST API with auth | JWT, bcrypt, middleware, layered arch |
| File upload service | Streams, multer, S3 |
| Real-time chat | WebSockets, Socket.io, rooms |
| URL shortener | Redis caching, rate limiting |
| E-commerce API | CRUD, pagination, transactions |

### npm Packages to Know

| Package | Purpose |
|---------|---------|
| `express` | Web framework |
| `helmet` | Security headers |
| `cors` | Cross-origin requests |
| `zod` | Runtime validation |
| `bcrypt` | Password hashing |
| `jsonwebtoken` | JWT auth |
| `express-rate-limit` | Rate limiting |
| `morgan` | HTTP logging |
| `supertest` | HTTP testing |
| `winston` / `pino` | Structured logging |

---

*Next file: [06-databases-complete.md](./06-databases-complete.md)*
