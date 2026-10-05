# Auth, DevOps & Security — Complete Guide

<!-- SCHEDULE-BANNER-START -->
> **📅 Study window:** 19 Oct 2026 – 25 Oct 2026 (Days 64–70)
> **⏰ Your slots (IST):** Mon–Fri **7:30–8:30pm** & **9:00–10:00pm** · Sat–Sun **9:00am–12:00pm**, **3:00–5:30pm**, **6:00–8:30pm**
> **📧 Calendar reminders:** harsh.gupta@getreelax.com — import `calendar/mern-mastery-study.ics`
<!-- SCHEDULE-BANNER-END -->

> JWT, OAuth, sessions, Docker, AWS, testing, CI/CD, and interview preparation for MERN developers.

---

## Table of Contents

1. [Authentication vs Authorization](#1-authentication-vs-authorization)
2. [JWT Deep Dive](#2-jwt-deep-dive)
3. [OAuth 2.0 & OpenID Connect](#3-oauth-20--openid-connect)
4. [Sessions & Cookies](#4-sessions--cookies)
5. [Password Security (bcrypt)](#5-password-security-bcrypt)
6. [Docker Fundamentals](#6-docker-fundamentals)
7. [Docker Compose](#7-docker-compose)
8. [AWS Basics for Developers](#8-aws-basics-for-developers)
9. [Testing: Jest, Supertest, RTL](#9-testing-jest-supertest-rtl)
10. [CI/CD with GitHub Actions](#10-cicd-with-github-actions)
11. [Security Best Practices](#11-security-best-practices)
12. [Interview Q&A](#12-interview-qa)
13. [Practice Links & Exercises](#13-practice-links--exercises)

---

## 1. Authentication vs Authorization

| Concept | Question | Example |
|---------|----------|---------|
| **Authentication (AuthN)** | Who are you? | Login with email/password |
| **Authorization (AuthZ)** | What can you do? | Admin vs user role permissions |

```
Request → AuthN (verify identity) → AuthZ (check permissions) → Handler
```

**Common mistakes:**
- Checking role in frontend only (must enforce on server)
- Confusing 401 (Unauthorized = not authenticated) with 403 (Forbidden = authenticated but denied)

---

## 2. JWT Deep Dive

### Structure

```
Header.Payload.Signature

eyJhbGciOiJIUzI1NiIs...   ← Base64URL(Header)
.
eyJ1c2VySWQiOjEsInJvbGUi... ← Base64URL(Payload)
.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c   ← Signature
```

**Header:** `{ "alg": "HS256", "typ": "JWT" }`
**Payload:** Claims — `sub`, `iat`, `exp`, custom (`userId`, `role`)
**Signature:** `HMACSHA256(base64(header) + "." + base64(payload), secret)`

### Access + Refresh Token Flow

```
1. POST /login { email, password }
2. Server validates → issues accessToken (15m) + refreshToken (7d)
3. Access token → Authorization: Bearer <token> (memory or short-lived cookie)
4. Refresh token → httpOnly, Secure, SameSite=Strict cookie
5. On 401 → POST /refresh with refresh cookie → new access token
6. On logout → invalidate refresh token server-side (DB/redis denylist)
```

### TypeScript Implementation

```typescript
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface TokenPayload {
  userId: string;
  role: "user" | "admin";
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "15m",
    issuer: "myapp",
    audience: "myapp-users",
  });
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }
  try {
    const token = header.slice(7);
    req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as TokenPayload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}
```

### JWT Security Rules

| Rule | Why |
|------|-----|
| Short access token expiry | Limits damage if stolen |
| Refresh token rotation | Detect token reuse attacks |
| httpOnly cookies for refresh | Blocks JavaScript access (XSS) |
| Never store JWT in localStorage | XSS can exfiltrate |
| Use RS256 for microservices | Private key signs, public key verifies |
| Validate `iss`, `aud`, `exp` | Prevent token misuse |

---

## 3. OAuth 2.0 & OpenID Connect

### OAuth 2.0 Roles

- **Resource Owner:** User
- **Client:** Your app
- **Authorization Server:** Google, GitHub
- **Resource Server:** API holding user data

### Authorization Code Flow (Most Secure)

```
User → Click "Login with Google"
     → Redirect: GET accounts.google.com/o/oauth2/auth?client_id=...&redirect_uri=...&scope=openid email profile&response_type=code
     → User consents
     → Redirect: GET yourapp.com/callback?code=AUTH_CODE
     → Server: POST token endpoint with code + client_secret
     → Receive: access_token, id_token (OIDC), refresh_token
     → Fetch user profile OR decode id_token
     → Create/link user in DB → issue YOUR app's JWT/session
```

### Passport.js Example

```typescript
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: "/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  const user = await findOrCreateUser({
    provider: "google",
    providerId: profile.id,
    email: profile.emails?.[0]?.value,
    name: profile.displayName,
  });
  done(null, user);
}));
```

### Next.js: NextAuth.js

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const user = await validateUser(credentials);
        return user ?? null;
      },
    }),
  ],
  session: { strategy: "jwt" as const },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
  },
};
```

---

## 4. Sessions & Cookies

### Session-Based Auth

```
Login → Server creates session ID → Store in Redis/DB
      → Set cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict
      → Each request: lookup session → attach user to req
```

```typescript
import session from "express-session";
import RedisStore from "connect-redis";
import { createClient } from "redis";

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  },
}));
```

### JWT vs Sessions

| Aspect | JWT | Sessions |
|--------|-----|----------|
| State | Stateless (mostly) | Stateful (server store) |
| Revocation | Hard (need denylist) | Easy (delete session) |
| Scale | Easy horizontal | Needs shared store (Redis) |
| Mobile/SPA | Excellent | Cookie limitations |
| Size | Larger headers | Small cookie (session ID) |

---

## 5. Password Security (bcrypt)

```typescript
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12; // 10-12 typical; higher = slower brute force

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// Registration
const passwordHash = await hashPassword(req.body.password);
await User.create({ email, passwordHash }); // NEVER store plain text

// Login — constant-time compare via bcrypt
const user = await User.findOne({ email });
if (!user || !(await verifyPassword(password, user.passwordHash))) {
  return res.status(401).json({ error: "Invalid credentials" });
}
```

**Additional measures:**
- Minimum password length (12+), check against breached passwords (HaveIBeenPwned API)
- Rate limit login attempts (5/min per IP)
- Account lockout after N failures
- MFA for sensitive apps

---

## 6. Docker Fundamentals

### Core Concepts

| Term | Meaning |
|------|---------|
| **Image** | Read-only template (layers) |
| **Container** | Running instance of image |
| **Dockerfile** | Recipe to build image |
| **Volume** | Persistent storage |
| **Network** | Container communication |

### Dockerfile for Node.js MERN App

```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "dist/server.js"]
```

### Essential Commands

```bash
docker build -t myapp:1.0 .
docker run -d -p 3000:3000 --name myapp -e NODE_ENV=production myapp:1.0
docker ps                          # running containers
docker logs -f myapp
docker exec -it myapp sh
docker stop myapp && docker rm myapp
docker images
docker rmi myapp:1.0
docker system prune -a             # cleanup unused
```

### .dockerignore

```
node_modules
.git
.env
*.md
coverage
.next
dist
```

---

## 7. Docker Compose

```yaml
# docker-compose.yml
version: "3.9"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      mongo:
        condition: service_healthy
      redis:
        condition: service_started
    restart: unless-stopped

  mongo:
    image: mongo:7
    volumes:
      - mongo_data:/data/db
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app

volumes:
  mongo_data:
  redis_data:
```

```bash
docker compose up -d              # start all services
docker compose down               # stop and remove
docker compose logs -f app
docker compose exec app sh
docker compose up --build         # rebuild images
```

---

## 8. AWS Basics for Developers

### Core Services

| Service | Purpose | MERN Use Case |
|---------|---------|---------------|
| **EC2** | Virtual servers | Host Node.js app |
| **ECS/EKS** | Containers | Docker deployments |
| **S3** | Object storage | Images, uploads, static assets |
| **RDS** | Managed SQL | PostgreSQL if not MongoDB |
| **DocumentDB** | MongoDB-compatible | Managed Mongo |
| **ElastiCache** | Redis/Memcached | Sessions, caching |
| **CloudFront** | CDN | Static asset delivery |
| **Route 53** | DNS | Domain routing |
| **ALB** | Load balancer | Traffic distribution |
| **IAM** | Access control | Roles, policies |
| **Secrets Manager** | Secrets | API keys, DB passwords |
| **CloudWatch** | Monitoring | Logs, metrics, alarms |
| **Lambda** | Serverless functions | Webhooks, cron jobs |
| **SQS/SNS** | Messaging | Async jobs, notifications |

### Typical MERN Deployment Architecture

```
Route 53 → CloudFront (static) → S3
         → ALB → ECS (Node API) → DocumentDB
                                 → ElastiCache (Redis)
                                 → S3 (uploads)
CloudWatch ← logs/metrics from all services
```

### IAM Best Practices

- Never use root account for daily work
- Principle of least privilege
- Use IAM roles for EC2/ECS (not access keys on disk)
- Enable MFA on root and admin accounts

### S3 Upload (Presigned URL Pattern)

```typescript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: "ap-south-1" });

export async function getUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(s3, command, { expiresIn: 300 });
}
```

---

## 9. Testing: Jest, Supertest, RTL

### Jest Unit Tests

```typescript
// __tests__/auth.service.test.ts
import { hashPassword, verifyPassword } from "../services/auth";

describe("Auth Service", () => {
  it("hashes and verifies password", async () => {
    const hash = await hashPassword("secret123");
    expect(hash).not.toBe("secret123");
    expect(await verifyPassword("secret123", hash)).toBe(true);
    expect(await verifyPassword("wrong", hash)).toBe(false);
  });
});
```

### Supertest Integration Tests

```typescript
// __tests__/auth.routes.test.ts
import request from "supertest";
import app from "../app";
import { connectDB, disconnectDB } from "../db";

beforeAll(async () => { await connectDB(); });
afterAll(async () => { await disconnectDB(); });

describe("POST /api/auth/login", () => {
  it("returns 401 for invalid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "bad@test.com", password: "wrong" });
    expect(res.status).toBe(401);
  });

  it("returns tokens for valid login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "user@test.com", password: "password123" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });
});
```

### React Testing Library

```tsx
// LoginForm.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./LoginForm";

test("shows error on failed login", async () => {
  const user = userEvent.setup();
  render(<LoginForm />);
  await user.type(screen.getByLabelText(/email/i), "bad@test.com");
  await user.type(screen.getByLabelText(/password/i), "wrong");
  await user.click(screen.getByRole("button", { name: /login/i }));
  await waitFor(() => {
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
```

### Testing Pyramid

```
        /\
       /E2E\        Playwright/Cypress — few, critical paths
      /------\
     /Integration\  Supertest — API routes, DB
    /--------------\
   /   Unit Tests   \  Jest — pure functions, utils
  /------------------\
```

---

## 10. CI/CD with GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mongo:
        image: mongo:7
        ports: ["27017:27017"]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v4
        if: always()

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/build-push-action@v5
        with:
          context: .
          push: false
          tags: myapp:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: echo "Deploy via ECS/Railway/Vercel"
```

### CI/CD Best Practices

- Run lint, typecheck, tests on every PR
- Cache dependencies (`actions/cache`, npm cache)
- Use environment secrets for deploy keys
- Separate staging and production pipelines
- Require PR reviews + passing CI before merge

---

## 11. Security Best Practices

### OWASP Top 10 (Developer Focus)

1. **Broken Access Control** — enforce AuthZ server-side
2. **Cryptographic Failures** — HTTPS, bcrypt, secure secrets
3. **Injection** — parameterized queries, validate input
4. **Insecure Design** — threat modeling early
5. **Security Misconfiguration** — disable debug in prod, secure headers
6. **Vulnerable Components** — `npm audit`, Dependabot
7. **Auth Failures** — MFA, rate limiting, secure sessions
8. **Integrity Failures** — verify CI/CD pipeline integrity
9. **Logging Failures** — log auth events, no secrets in logs
10. **SSRF** — validate URLs, block internal network access

### Security Headers (Helmet.js)

```typescript
import helmet from "helmet";
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
  },
}));
```

### Rate Limiting

```typescript
import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many login attempts" },
});
app.post("/api/auth/login", loginLimiter, loginHandler);
```

### Input Validation (Zod)

```typescript
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(12).max(128),
  name: z.string().min(1).max(100),
});
```

---

## 12. Interview Q&A

**Q: JWT vs session — when to use which?**
A: JWT for stateless APIs, mobile, microservices. Sessions when you need easy revocation and server-side control.

**Q: Where to store JWT on client?**
A: Access token in memory; refresh in httpOnly Secure cookie. Avoid localStorage.

**Q: How does OAuth differ from JWT?**
A: OAuth is an authorization framework (delegated access). JWT is a token format. OAuth often issues JWTs as id/access tokens.

**Q: Explain refresh token rotation.**
A: Each refresh use issues new refresh token and invalidates old one. Detects reuse (stolen token) and revokes family.

**Q: What is bcrypt salt rounds?**
A: Cost factor — 2^rounds iterations. Higher = slower hashing, harder brute force. 10-12 typical.

**Q: Docker multi-stage build benefit?**
A: Smaller production image — build tools stay in builder stage, only runtime artifacts copied.

**Q: Difference between CMD and ENTRYPOINT?**
A: ENTRYPOINT defines executable; CMD provides default args. Together they define container startup.

**Q: How do you secure secrets in CI/CD?**
A: GitHub Secrets, AWS Secrets Manager, never commit .env, rotate regularly.

**Q: What is SameSite cookie attribute?**
A: Controls cross-site cookie sending. Strict prevents CSRF; Lax allows top-level navigation.

**Q: How to test authenticated routes with Supertest?**
A: Login first, extract token/cookie, pass in subsequent requests via `.set('Authorization', 'Bearer ...')`.

---

## 13. Practice Links & Exercises

| Resource | URL | Topic |
|----------|-----|-------|
| JWT.io Debugger | [jwt.io](https://jwt.io) | Decode/verify tokens |
| OAuth Playground | [developers.google.com/oauthplayground](https://developers.google.com/oauthplayground) | OAuth flows |
| Docker Docs | [docs.docker.com/get-started](https://docs.docker.com/get-started/) | Containers |
| Play with Docker | [labs.play-with-docker.com](https://labs.play-with-docker.com) | Free sandbox |
| AWS Skill Builder | [skillbuilder.aws](https://skillbuilder.aws) | AWS fundamentals |
| OWASP Cheat Sheets | [cheatsheetseries.owasp.org](https://cheatsheetseries.owasp.org) | Security |
| Testing Library Docs | [testing-library.com](https://testing-library.com) | RTL |
| GitHub Actions Docs | [docs.github.com/actions](https://docs.github.com/en/actions) | CI/CD |

### Hands-On Exercises

1. Build JWT auth with access/refresh rotation and httpOnly cookies
2. Add Google OAuth with Passport or NextAuth
3. Dockerize MERN app with Mongo + Redis via compose
4. Write Supertest suite for all auth endpoints
5. Create GitHub Actions pipeline: lint → test → build Docker image
6. Deploy to AWS ECS or Railway with environment secrets
7. Add Helmet, rate limiting, Zod validation to Express API
8. Implement presigned S3 upload from React frontend

---

## Quick Reference

```
AuthN: bcrypt + JWT/session + OAuth
AuthZ: RBAC middleware, server-side checks
DevOps: Dockerfile → compose → CI → deploy
Test: Jest (unit) → Supertest (API) → RTL (UI)
Security: HTTPS, httpOnly, rate limit, validate, audit
```
