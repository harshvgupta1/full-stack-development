# Week 13–16 Practice Index (Projects + DevOps)

---

## Week 13–14 — Project: TaskFlow
**Flagship MERN project for resume**

### Features checklist
- [ ] User auth (JWT + refresh)
- [ ] Teams + invite members
- [ ] Projects within teams
- [ ] Tasks: create, assign, status, priority, due date
- [ ] Comments on tasks
- [ ] Real-time updates (Socket.io)
- [ ] File upload (local or S3)
- [ ] Role permissions (owner, member, viewer)

### Tech stack
Next.js + Node/Express + MongoDB + Redis + TypeScript + Docker Compose

**LeetCode (2/day weekend):** LC 253 Meeting Rooms II, LC 268 Missing Number, LC 283 Move Zeroes, LC 287 Find Duplicate, LC 300 LIS, LC 322 Coin Change, LC 347 Top K Frequent, LC 349 Intersection

---

## Week 15–16 — Project: ShopLite + Testing
**Notes:** [07-auth-devops.md](../notes/07-auth-devops.md) §5–8

### ShopLite features
- [ ] Product catalog with categories
- [ ] Cart (Redis or DB session)
- [ ] Checkout flow
- [ ] Razorpay/Stripe test payment
- [ ] Order history
- [ ] Admin: add/edit products
- [ ] PostgreSQL for orders (ACID)

### Testing checklist
- [ ] Unit tests for utility functions (Jest)
- [ ] API integration tests (Supertest)
- [ ] React component tests (RTL)
- [ ] GitHub Actions CI pipeline
- [ ] Docker Compose for full stack

**LeetCode:** LC 371 Sum of Two Integers, LC 373 Find K Pairs, LC 378 Kth Smallest in Matrix, LC 392 Is Subsequence, LC 399 Evaluate Division, LC 416 Partition Equal Subset, LC 424 Longest Repeating Character Replacement, LC 435 Non-overlapping Intervals

---

## Deployment checklist (both projects)
- [ ] Frontend on Vercel
- [ ] Backend on Render/Railway/AWS
- [ ] MongoDB Atlas + PostgreSQL (Neon/Supabase)
- [ ] README with architecture diagram
- [ ] Live demo URL on resume
