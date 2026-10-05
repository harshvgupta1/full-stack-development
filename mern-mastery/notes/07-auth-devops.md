# Auth, Redis, Docker & AWS — Notes

---

## 1. Authentication vs Authorization

- **Authentication (AuthN):** Who are you? (login)
- **Authorization (AuthZ):** What can you do? (roles, permissions)

---

## 2. JWT (JSON Web Token)

```
Header.Payload.Signature

Header:  { alg: "HS256", typ: "JWT" }
Payload: { userId: 1, role: "admin", exp: 1234567890 }
Signature: HMACSHA256(base64(header) + "." + base64(payload), secret)
```

### Flow

```
1. User logs in → server validates credentials
2. Server creates JWT (access + refresh tokens)
3. Client stores access token (memory/httpOnly cookie)
4. Client sends: Authorization: Bearer <token>
5. Server verifies signature + expiry on each request
6. Access token expires (15min) → use refresh token to get new one
```

### Implementation

```typescript
import jwt from "jsonwebtoken";

const accessToken = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET!,
  { expiresIn: "15m" }
);

const refreshToken = jwt.sign(
  { userId: user.id },
  process.env.REFRESH_SECRET!,
  { expiresIn: "7d" }
);

// Verify
const payload = jwt.verify(token, process.env.JWT_SECRET!);
```

**Security rules:**
- Store refresh token in httpOnly cookie
- Never store JWT in localStorage (XSS risk)
- Use short expiry for access tokens
- Rotate refresh tokens

---

## 3. OAuth 2.0 (Google/GitHub login)

```
User → Click "Login with Google"
     → Redirect to Google consent screen
     → User approves
     → Google redirects back with authorization code
     → Server exchanges code for access token
     → Server fetches user profile
     → Server creates session/JWT for your app
```

Libraries: `passport.js`, `next-auth` (Next.js).

---

## 4. Password Security

```typescript
import bcrypt from "bcrypt";

// Hash on register
const hash = await bcrypt.hash(password, 12); // 12 salt rounds

// Verify on login
const isValid = await bcrypt.compare(password, storedHash);
```

Never store plain text passwords. Never roll your own crypto.

---

## 5. Docker

### Dockerfile

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### docker-compose.yml

```yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgresql://user:pass@db:5432/myapp
      REDIS_URL: redis://redis:6379
    depends_on: [db, redis]

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: myapp
    volumes: [pgdata:/var/lib/postgresql/data]

  redis:
    image: redis:7-alpine

volumes:
  pgdata:
```

```bash
docker compose up -d    # start all services
docker compose logs -f  # view logs
docker compose down     # stop
```

---

## 6. AWS Basics

| Service | Purpose |
|---------|---------|
| **EC2** | Virtual servers |
| **S3** | File storage (images, uploads) |
| **RDS** | Managed PostgreSQL/MySQL |
| **Lambda** | Serverless functions |
| **CloudFront** | CDN |
| **Route 53** | DNS |
| **IAM** | Access permissions |

### S3 upload (common interview task)

```typescript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "ap-south-1" });
await s3.send(new PutObjectCommand({
  Bucket: "my-bucket",
  Key: `uploads/${filename}`,
  Body: fileBuffer,
  ContentType: "image/jpeg",
}));
```

---

## 7. Testing

```typescript
// Unit test (Jest)
describe("add", () => {
  it("adds two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });
});

// API integration test (Supertest)
import request from "supertest";
import app from "../app";

it("GET /users returns 200", async () => {
  const res = await request(app).get("/users").set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.data).toHaveLength(10);
});

// React component test (RTL)
import { render, screen } from "@testing-library/react";
render(<Button label="Click" />);
expect(screen.getByText("Click")).toBeInTheDocument();
```

---

## 8. CI/CD (GitHub Actions)

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
```
