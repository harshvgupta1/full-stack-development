# Week 9–12 Practice Index (Backend + Databases)

---

## Week 9 — Node.js + Express
**Notes:** [05-nodejs-express.md](../notes/05-nodejs-express.md)

| Exercise | Task |
|----------|------|
| 1 | Express server with JSON middleware |
| 2 | CRUD `/api/users` in-memory |
| 3 | Validation middleware with Zod |
| 4 | Global error handler |
| 5 | Layered architecture refactor (routes/controllers/services) |

**LeetCode:** LC 136 Single Number, LC 141 Linked List Cycle, LC 155 Min Stack, LC 160 Intersection, LC 167 Two Sum II

**Weekend:** Auth API skeleton — register/login routes (no DB yet)

---

## Week 10 — JWT Auth
**Notes:** [07-auth-devops.md](../notes/07-auth-devops.md) §1–4

| Exercise | Task |
|----------|------|
| 1 | bcrypt password hash + verify |
| 2 | JWT access token generation |
| 3 | Refresh token in httpOnly cookie |
| 4 | Auth middleware protecting routes |
| 5 | Role-based access (admin vs user) |

**LeetCode:** LC 169 Majority Element, LC 171 Excel Sheet Column, LC 190 Reverse Bits, LC 191 Number of 1 Bits, LC 202 Happy Number

**Weekend:** Complete Auth microservice with refresh flow

---

## Week 11 — MongoDB
**Notes:** [06-databases.md](../notes/06-databases.md) §2

| Exercise | Task |
|----------|------|
| 1 | Mongoose User schema with validation |
| 2 | CRUD with MongoDB Atlas |
| 3 | Pagination: `?page=1&limit=10` |
| 4 | Aggregation: count users by role |
| 5 | Index on email field — explain query plan |

**LeetCode:** LC 203 Remove Linked List Elements, LC 206 Reverse List, LC 217 Contains Duplicate, LC 219 Contains Duplicate II, LC 226 Invert Binary Tree

**Weekend:** Blog API with MongoDB — posts, comments, tags

---

## Week 12 — PostgreSQL + Redis
**Notes:** [06-databases.md](../notes/06-databases.md) §3–4

| Exercise | Task |
|----------|------|
| 1 | PostgreSQL schema: users, orders (FK) |
| 2 | Prisma setup + migrations |
| 3 | JOIN query: users with order totals |
| 4 | Redis cache on GET `/users/:id` |
| 5 | Rate limiter: 100 req/min per IP |

**LeetCode:** LC 230 Kth Smallest in BST, LC 235 LCA of BST, LC 238 Product Except Self, LC 242 Valid Anagram, LC 252 Meeting Rooms

**Weekend:** Same blog API rebuilt with PostgreSQL — document Mongo vs SQL tradeoffs in README

---

## Where to practice
- MongoDB: [mongodb.com/docs/manual/tutorial](https://www.mongodb.com/docs/manual/tutorial/)
- PostgreSQL: [postgresqltutorial.com](https://www.postgresqltutorial.com/)
- Prisma: [prisma.io/docs/getting-started](https://www.prisma.io/docs/getting-started)
- Redis: Install locally or use [upstash.com](https://upstash.com/) free tier
