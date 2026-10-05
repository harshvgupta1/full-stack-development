# System Design (HLD) — Complete Guide

<!-- SCHEDULE-BANNER-START -->
> **📅 Study window:** 4 Jan 2027 – 17 Jan 2027 (Days 141–154)
> **⏰ Your slots (IST):** Mon–Fri **7:30–8:30pm** & **9:00–10:00pm** · Sat–Sun **9:00am–12:00pm**, **3:00–5:30pm**, **6:00–8:30pm**
> **📧 Calendar reminders:** harsh.gupta@getreelax.com — import `calendar/mern-mastery-study.ics`
<!-- SCHEDULE-BANNER-END -->

> High-level design framework, estimation, full system designs, CAP theorem, and interview preparation.

---

## ⚠️ PREREQUISITES — Complete FIRST (strict order)

| Order | PDF |
|-------|-----|
| 1 | `10b-networking-http-fundamentals-complete.pdf` |
| 2 | `06-databases-complete.pdf` (scaling, replication) |
| 3 | `10c-system-design-prerequisites-complete.pdf` (caching, LB, queues) |

**When:** Month 6, Days 144+ (after 10c).  
**Before distributed deep dive:** Complete URL shortener + feed designs in this PDF first.

---

## Table of Contents

1. [HLD Interview Framework](#1-hld-interview-framework)
2. [Back-of-Envelope Estimation](#2-back-of-envelope-estimation)
3. [CAP Theorem & Consistency](#3-cap-theorem--consistency)
4. [URL Shortener](#4-url-shortener)
5. [News Feed / Timeline](#5-news-feed--timeline)
6. [Chat System](#6-chat-system)
7. [Notification System](#7-notification-system)
8. [E-Commerce Platform](#8-e-commerce-platform)
9. [Payment System](#9-payment-system)
10. [Uber / Ride-Sharing](#10-uber--ride-sharing)
11. [Scaling Patterns](#11-scaling-patterns)
12. [Interview Q&A](#12-interview-qa)
13. [ByteByteGo & Resources](#13-bytebytego--resources)
14. [Product-company HLD (1 CR)](#14-product-company-hld-1-cr)
15. [YouTube / Netflix](#15-youtube--netflix)
16. [Google Drive / Dropbox](#16-google-drive--dropbox)
17. [Typeahead](#17-typeahead)
18. [Ticketmaster / seat inventory](#18-ticketmaster--seat-inventory)

---

## 1. HLD Interview Framework

### RADIO Framework (45–60 min)

```
R — Requirements (5 min)
    Functional + Non-functional
    Out of scope

A — Architecture (10 min)
    High-level diagram
    Core components

D — Data Model (10 min)
    Entities, relationships
    Database choice + schema

I — Interface (5 min)
    Key API endpoints
    Request/response examples

O — Optimizations (15 min)
    Bottlenecks, scaling
    Trade-offs, deep dives
```

### Requirements Checklist

**Functional:** What features must the system support?
**Non-Functional:**
- Scale (DAU, QPS, data size)
- Latency (p99 targets)
- Availability (99.9%? 99.99%?)
- Consistency (strong vs eventual)
- Durability

### Standard Architecture Layers

```
Client (Web/Mobile)
       ↓
CDN (static assets)
       ↓
Load Balancer (ALB/NGINX)
       ↓
API Gateway / BFF
       ↓
┌──────┴──────┬──────────┬──────────┐
│ Auth Service│ Core Svc │ Search   │
└──────┬──────┴────┬─────┴────┬─────┘
       ↓           ↓          ↓
    Cache       Database   Message Queue
   (Redis)    (SQL/NoSQL)   (Kafka/SQS)
       ↓           ↓          ↓
              Object Storage (S3)
              Workers / Consumers
```

---

## 2. Back-of-Envelope Estimation

### Useful Numbers (2024)

| Metric | Value |
|--------|-------|
| 1 day | 86400 seconds ≈ 10⁵ s |
| 1 year | ~3 × 10⁷ seconds |
| 1 KB | 10³ bytes |
| 1 MB | 10⁶ bytes |
| 1 GB | 10⁹ bytes |
| 1 TB | 10¹² bytes |
| Read 1 MB from memory | ~0.25 ms |
| Read 1 MB from SSD | ~1 ms |
| Read 1 MB from HDD | ~10 ms |
| Network round trip (same datacenter) | ~0.5 ms |
| Network round trip (cross continent) | ~150 ms |

### Example: Twitter-scale

```
Assumptions:
- 500M DAU
- Each user: 2 tweets/day read, 0.5 tweets/day write
- Average tweet: 300 bytes

Write QPS:
  500M × 0.5 / 86400 ≈ 3000 writes/sec
  Peak (3×): ~9000 writes/sec

Read QPS:
  500M × 2 / 86400 ≈ 12,000 reads/sec
  Peak: ~36,000 reads/sec

Storage (5 years):
  500M × 0.5 × 365 × 5 × 300 bytes ≈ 140 TB
```

### QPS Formula

```
QPS = (DAU × actions_per_user_per_day) / 86400
Peak QPS ≈ 2-3× average QPS
```

---

## 3. CAP Theorem & Consistency

### CAP Theorem

In a partition, choose **Consistency** OR **Availability** (Partition tolerance is mandatory in distributed systems).

| System | Choice | Example |
|--------|--------|---------|
| CP | Consistency over Availability | Banking, inventory |
| AP | Availability over Consistency | Social feeds, likes count |
| CA | Only on single node (not distributed) | Single PostgreSQL |

### Consistency Models

| Model | Description | Use Case |
|-------|-------------|----------|
| Strong | Read sees latest write | Bank balance |
| Eventual | Replicas converge over time | DNS, social likes |
| Causal | Related ops seen in order | Chat messages |
| Read-your-writes | User sees own writes | Profile update |

### Database Selection Guide

| Need | Choose |
|------|--------|
| ACID transactions | PostgreSQL, MySQL |
| Flexible schema, horizontal scale | MongoDB, DynamoDB |
| Graph relationships | Neo4j |
| Time-series metrics | InfluxDB, TimescaleDB |
| Full-text search | Elasticsearch |
| Caching | Redis, Memcached |
| Analytics | Snowflake, BigQuery |

---

## 4. URL Shortener

### Requirements

**Functional:**
- Shorten long URL → short code
- Redirect short URL → original
- Optional custom alias, expiration, analytics

**Non-Functional:**
- 100M URLs/day write, 10:1 read/write ratio
- Low latency redirect (< 100ms)
- High availability

### High-Level Design

```
Client → LB → API Servers → Redis (cache) → DB
                    ↓
              Base62 encode / hash
```

### API Design

```
POST /api/v1/urls
Body: { "longUrl": "https://...", "customAlias": "optional", "expiresIn": 86400 }
Response: { "shortUrl": "https://short.ly/abc123", "shortCode": "abc123" }

GET /abc123  → 301 Redirect to long URL
GET /api/v1/urls/:code/stats → click analytics
```

### Data Model

```sql
-- PostgreSQL
CREATE TABLE urls (
  id          BIGSERIAL PRIMARY KEY,
  short_code  VARCHAR(10) UNIQUE NOT NULL,
  long_url    TEXT NOT NULL,
  user_id     BIGINT,
  created_at  TIMESTAMP DEFAULT NOW(),
  expires_at  TIMESTAMP,
  click_count BIGINT DEFAULT 0
);
CREATE INDEX idx_short_code ON urls(short_code);
```

### Short Code Generation

**Option 1:** Auto-increment ID → Base62 encode (a-zA-Z0-9)
**Option 2:** MD5 hash of URL → take first 7 chars (collision handling needed)
**Option 3:** Pre-generate codes in range, assign on demand

```typescript
const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function encodeBase62(num: bigint): string {
  if (num === 0n) return "0";
  let result = "";
  while (num > 0n) {
    result = BASE62[Number(num % 62n)] + result;
    num /= 62n;
  }
  return result;
}
// 7 chars Base62 = 62^7 ≈ 3.5 trillion URLs
```

### Scaling

- **Cache:** Redis — 80/20 rule, cache hot URLs
- **Read replicas:** Redirect is read-heavy
- **DB sharding:** Shard by short_code hash
- **CDN/Edge:** Cache 301 redirects at edge (careful with analytics)
- **Rate limiting:** Prevent abuse

---

## 5. News Feed / Timeline

### Requirements

- Users post tweets/status updates
- Home feed: aggregated posts from followed users
- Fan-out on write vs fan-out on read
- Support celebrities (millions of followers)

### Architecture

```
                    ┌─────────────┐
Post Service ──────►│ Post DB     │
                    └─────────────┘
                           │
                    Fan-out Service
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
         User A Feed   User B Feed   Celebrity: skip pre-compute
         (Redis list)  (Redis list)  (merge on read)
```

### Fan-Out Strategies

| Strategy | Pros | Cons |
|----------|------|------|
| Fan-out on write | Fast reads | Slow writes for celebrities |
| Fan-out on read | Fast writes | Slow reads for users with many follows |
| Hybrid | Best of both | More complex |

**Hybrid approach:**
- Normal users (< 10K followers): fan-out on write
- Celebrities: fan-out on read — merge celebrity posts at read time

### API Design

```
POST /api/v1/posts
Body: { "content": "Hello world", "mediaUrls": [] }

GET /api/v1/feed?cursor=abc&limit=20
Response: { "posts": [...], "nextCursor": "def" }
```

### Data Model

```
posts: { postId, userId, content, createdAt, mediaUrls[] }
follows: { followerId, followeeId, createdAt }
feed:{userId}: [postId1, postId2, ...]  (Redis sorted set by timestamp)
```

---

## 6. Chat System

### Requirements

- 1:1 and group messaging
- Real-time delivery
- Online presence
- Message history, read receipts
- 50M DAU, 100 msg/user/day

### Architecture

```
Mobile/Web
    ↓ WebSocket
Chat Gateway (sticky sessions)
    ↓
Message Service → Message Store (Cassandra)
    ↓
Message Queue (Kafka)
    ↓
Push Notification Service
Presence Service (Redis)
```

### WebSocket vs Long Polling

| Method | Latency | Complexity | Use |
|--------|---------|------------|-----|
| WebSocket | Lowest | Medium | Chat, gaming |
| SSE | Low (one-way) | Low | Live feeds |
| Long polling | Higher | Low | Fallback |

### API Design

```
WS  /ws?token=jwt
    → send: { type: "message", to: "userId", content: "hi" }
    → recv: { type: "message", from: "userId", content: "hi", ts: 123 }

GET /api/v1/conversations
GET /api/v1/conversations/:id/messages?before=ts&limit=50
POST /api/v1/conversations (create group)
```

### Data Model

```
messages: { msgId, conversationId, senderId, content, timestamp, status }
conversations: { convId, type: direct|group, participants[], lastMessageAt }
user_presence: Redis { userId → { status, lastSeen } }
```

### Group Chat Fan-out

- Message written once to store
- Kafka topic per conversation OR push to online participants via gateway registry
- Gateway maintains: userId → websocket connection mapping (Redis)

---

## 7. Notification System

### Requirements

- Multi-channel: push, email, SMS, in-app
- Priority levels
- User preferences (opt-out)
- 1B notifications/day
- At-least-once delivery

### Architecture

```
Event Source (order placed, friend request)
        ↓
Notification Service
        ↓
   ┌────┴────┬─────────┬──────────┐
   ▼         ▼         ▼          ▼
Push Svc  Email Svc  SMS Svc  In-App Svc
(FCM/APNs)(SendGrid) (Twilio)  (WebSocket)
```

### API Design

```
POST /api/v1/notifications (internal)
Body: {
  "userId": "123",
  "type": "order_shipped",
  "channels": ["push", "email"],
  "payload": { "orderId": "456", "title": "...", "body": "..." }
}

GET /api/v1/notifications?unread=true
PATCH /api/v1/notifications/:id/read
PUT /api/v1/users/me/notification-preferences
```

### Key Design Decisions

- **Queue-based:** Decouple producers from delivery; handle spikes
- **Idempotency:** Dedupe key prevents duplicate notifications
- **Retry with backoff:** Failed SMS/email retried 3×
- **Rate limiting:** Max 10 push/hour per user
- **Template engine:** Dynamic content per channel

### Data Model

```
notifications: { id, userId, type, channels[], payload, status, createdAt }
preferences: { userId, channel, type, enabled }
delivery_log: { notificationId, channel, status, attempts, deliveredAt }
```

---

## 8. E-Commerce Platform

### Requirements

- Product catalog, search, cart, checkout, orders
- Inventory management
- Payment integration
- 10M users, 100K orders/day

### Architecture

```
                    ┌──────────────┐
                    │   CDN / S3   │ (product images)
                    └──────────────┘
Client → LB → API Gateway
              ├─ Product Service → PostgreSQL + Elasticsearch
              ├─ Cart Service → Redis
              ├─ Order Service → PostgreSQL
              ├─ Inventory Service → PostgreSQL (with locking)
              ├─ Payment Service → External gateway
              └─ Search Service → Elasticsearch
                        ↓
                   Kafka (order events)
                        ↓
              Email / Analytics / Warehouse
```

### API Design

```
GET  /api/v1/products?category=electronics&page=1
GET  /api/v1/products/:id
GET  /api/v1/search?q=laptop

POST /api/v1/cart/items        { productId, quantity }
GET  /api/v1/cart
POST /api/v1/orders            { cartId, shippingAddress, paymentMethod }
GET  /api/v1/orders/:id
```

### Data Model

```sql
products (id, name, description, price, category_id, inventory_count)
orders (id, user_id, status, total, created_at)
order_items (order_id, product_id, quantity, price_at_purchase)
cart (user_id, items JSONB)  -- Redis with TTL
```

### Critical Flow: Place Order

```
1. Validate cart items + prices
2. Reserve inventory (optimistic/pessimistic lock)
3. Create order (status: PENDING)
4. Process payment
5. On success: confirm order, decrement inventory, emit event
6. On failure: release inventory, mark order FAILED
```

**Saga pattern** for distributed transaction across inventory + payment + order.

---

## 9. Payment System

### Requirements

- Process credit card, UPI, wallet payments
- Idempotent transactions
- PCI DSS compliance (never store raw card data)
- Reconciliation, refunds

### Architecture

```
Client → Payment API → Payment Gateway (Stripe/Razorpay tokenization)
                            ↓
                     Payment Processor
                            ↓
                     Ledger Service (double-entry)
                            ↓
                     PostgreSQL (transactions, ledger)
                            ↓
                     Reconciliation Worker (daily)
```

### API Design

```
POST /api/v1/payments
Headers: Idempotency-Key: uuid
Body: {
  "orderId": "ord_123",
  "amount": 99900,
  "currency": "INR",
  "paymentMethodId": "pm_token_from_stripe"
}
Response: { "paymentId": "pay_456", "status": "succeeded" }

POST /api/v1/payments/:id/refund
Body: { "amount": 99900, "reason": "customer_request" }
```

### Double-Entry Ledger

```
Every transaction creates two entries:
  Debit:  Customer Wallet    -₹999
  Credit: Merchant Account   +₹999

Ensures books always balance. Audit trail for compliance.
```

### Idempotency

```typescript
// Store idempotency key → response mapping for 24 hours
async function processPayment(idempotencyKey: string, payload: PaymentRequest) {
  const cached = await redis.get(`idem:${idempotencyKey}`);
  if (cached) return JSON.parse(cached);

  const result = await gateway.charge(payload);
  await redis.setex(`idem:${idempotencyKey}`, 86400, JSON.stringify(result));
  return result;
}
```

### Security

- Tokenize cards via Stripe/Razorpay — never touch PAN
- TLS everywhere, encrypt PII at rest
- Webhook signature verification
- Fraud detection rules engine

---

## 10. Uber / Ride-Sharing

### Requirements

- Riders request rides, drivers accept
- Real-time location tracking
- Matching rider to nearest available driver
- ETA, fare estimation, trip history
- 10M rides/day

### Architecture

```
Rider App ──WebSocket──► Trip Service ◄──WebSocket── Driver App
                              │
                    ┌─────────┼─────────┐
                    ▼         ▼         ▼
              Location    Matching   Pricing
              Service     Service    Service
                 │            │
            Redis Geo     Driver DB
            (H3/S2 grid)  (available/busy)
                 │
            Location Stream (Kafka)
```

### API Design

```
POST /api/v1/trips/request
Body: { "pickupLat": 12.97, "pickupLng": 77.59, "dropLat": ..., "dropLng": ... }
Response: { "tripId": "...", "estimatedFare": 250, "eta": 5 }

POST /api/v1/trips/:id/accept    (driver)
POST /api/v1/trips/:id/start
POST /api/v1/trips/:id/complete

WS location updates: { "lat": 12.97, "lng": 77.59, "heading": 90 }
GET /api/v1/trips/:id/track      (rider sees driver location)
```

### Matching Algorithm

```
1. Rider requests trip at (lat, lng)
2. Query geospatial index for drivers within 5km radius
3. Filter: status=available, vehicle type matches
4. Rank by: distance, rating, acceptance rate
5. Send request to top 3 drivers sequentially (30s timeout each)
6. First accept wins — notify others trip taken
```

**Geospatial indexing:** Redis GEO, Google S2, Uber H3 hexagonal grid.

### Data Model

```
trips: { tripId, riderId, driverId, pickup, dropoff, status, fare, timestamps }
drivers: { driverId, location, status, vehicleType, rating }
locations: Redis GEOADD drivers:geo lng lat driverId
```

### Surge Pricing

- Divide city into zones (H3 cells)
- Track demand (requests) vs supply (available drivers) per zone
- multiplier = f(demand/supply ratio)
- Update every 5 minutes

---

## 11. Scaling Patterns

### Horizontal vs Vertical

| Vertical | Horizontal |
|----------|------------|
| Bigger machine | More machines |
| Simple, limited ceiling | Complex, unlimited scale |
| Good for DB initially | Good for stateless services |

### Caching Strategies

| Pattern | Description |
|---------|-------------|
| Cache-aside | App reads cache, on miss reads DB, writes cache |
| Write-through | Write to cache + DB simultaneously |
| Write-behind | Write cache, async flush to DB |

### Load Balancing Algorithms

- Round Robin
- Least Connections
- IP Hash (session stickiness)
- Weighted Round Robin

### Database Scaling

```
Single DB → Read Replicas → Sharding → Federation
                ↓
           Caching (Redis)
                ↓
           CQRS (separate read/write models)
```

### Message Queue Use Cases

- Async processing (send email after order)
- Decoupling services
- Peak load buffering
- Event sourcing / audit log

---

## 12. Interview Q&A

**Q: How do you handle hot keys in Redis?**
A: Local cache in app, replicate key across shards, read replicas, or split hot key into multiple sub-keys.

**Q: SQL vs NoSQL?**
A: SQL for ACID, complex joins, structured data. NoSQL for flexible schema, horizontal scale, high write throughput.

**Q: What is consistent hashing?**
A: Distributes keys across nodes; adding/removing node only remaps K/n keys. Used in distributed caches and sharding.

**Q: How to design for 99.99% availability?**
A: Multi-AZ deployment, no single point of failure, health checks, auto-failover, circuit breakers, graceful degradation.

**Q: Explain CDN.**
A: Edge servers cache static content close to users. Reduces latency and origin load. Invalidation strategy matters.

**Q: How does Kafka help?**
A: Durable, ordered, replayable event log. Decouples producers/consumers, handles traffic spikes, enables event-driven architecture.

**Q: What is API Gateway?**
A: Single entry point for routing, auth, rate limiting, SSL termination, request aggregation.

**Q: How to prevent double booking?**
A: Pessimistic locking, optimistic locking with version, distributed lock (Redis), or serializable transaction isolation.

**Q: Eventual consistency example?**
A: Like count on a post — doesn't need to be exact in real-time; async counter aggregation is fine.

**Q: Microservices vs Monolith?**
A: Monolith simpler early; microservices for independent scaling, team autonomy, tech diversity — at cost of complexity.

---

## 13. ByteByteGo & Resources

### ByteByteGo

| Resource | URL | Content |
|----------|-----|---------|
| Newsletter | [bytebytego.com](https://bytebytego.com) | Weekly system design |
| YouTube | [youtube.com/@ByteByteGo](https://www.youtube.com/@ByteByteGo) | Visual explanations |
| Courses | bytebytego.com/courses | Structured learning |

### Recommended Reading Order

1. Scalability basics (LB, cache, CDN, DB replication)
2. URL Shortener (simplest complete design)
3. News Feed (fan-out trade-offs)
4. Chat (WebSocket, presence)
5. Notification (async, multi-channel)
6. E-Commerce (inventory, saga)
7. Payment (idempotency, ledger)
8. Uber (geospatial, real-time matching)

### Other Resources

| Resource | Focus |
|----------|-------|
| Designing Data-Intensive Applications (Kleppmann) | Deep fundamentals |
| System Design Interview (Alex Xu) | Vol 1 & 2 |
| Grokking System Design | Interactive |
| High Scalability Blog | Real-world architectures |

### Practice Schedule (8 Weeks)

| Week | Topic | Deliverable |
|------|-------|-------------|
| 1 | Framework + estimation | 5 estimation drills |
| 2 | URL Shortener + Paste bin | Full design doc |
| 3 | News Feed + Twitter | Fan-out analysis |
| 4 | Chat + WhatsApp | WebSocket deep dive |
| 5 | Notification + Email | Queue design |
| 6 | E-Commerce + Amazon | Order flow saga |
| 7 | Payment + Stripe | Idempotency + ledger |
| 8 | Uber + Lyft | Geospatial matching |

---

## Quick Reference Card

```
Framework: Requirements → Architecture → Data → API → Optimize
Estimate:  DAU × actions / 86400 = QPS; peak = 2-3×
CAP:       Partition → choose C or A
Scale:     CDN → LB → Cache → Replicas → Shards → Queue
Always:    State assumptions, draw diagram, discuss trade-offs
```

**Remember:** There's no single correct answer. Communicate trade-offs, justify choices, and iterate when interviewer adds constraints.

---

## 14. Product-company HLD (1 CR)

Google / Meta / Uber / Atlassian grade **product judgment**, not a Kafka diagram. Full framework: `20-1cr-product-company-complete.pdf` §5.

**Open every design with:** who is the user, what is the ONE metric, what is MVP vs v2.  
**Put Kafka / K8s only on the async or deploy slide** — never as sentence one.

Product RADIO (short):

1. Product + metric (3 min)  
2. Requirements + out of scope (5)  
3. API JSON (5)  
4. Data model + keys (7)  
5. Happy path (8)  
6. Scale the hottest QPS (10)  
7. User-visible failure (5)

**1 CR extra designs (Phase 7F):** YouTube, Drive, Typeahead, Ticketmaster, plus Search / Docs / Crawler in Phase 9.

---

## 15. YouTube / Netflix

**Product:** watch a video with low start time. Metric: start-play p99 < 2s.  
**MVP:** upload → process → play. Out of scope: live, ads (unless pushed).

**API:** `POST /videos` (returns upload URL) · `GET /videos/:id` · `GET /videos/:id/manifest.m3u8`

**Data:** `videos(id, owner_id, status, duration, playback_url)` · object store for chunks · CDN in front.

**Architecture:**
```
Client → CDN → origin (object store)
Upload → API → object store → queue → transcode workers → write renditions (360/720/1080)
```

**Deep dive:** ABR (client picks bitrate). Thumbnails + captions = more async jobs.  
**Recommendations (v2):** offline batch → feature store → online cache. **Do not JOIN** similar videos on the play request.  
**Failure:** if transcode lags, play original + “Processing HD”. If CDN miss storm, origin shield.

**Numbers:** 10M DAU × 5 videos × 800 MB avg → storage + CDN egress dominate cost, not the API box.

---

## 16. Google Drive / Dropbox

**Product:** sync files across devices. Metric: conflict rate + upload success.  
**MVP:** upload, download, list folder, share link.

**API:** `PUT /files/:id/chunks/:n` · `POST /files/:id/commit` · `GET /fs?parent=` · `POST /share`

**Data:** metadata DB `(file_id, parent, name, version, checksum)` + chunk store keyed by hash (dedup).

**Sync:** client hashes 4 MB chunks → upload missing hashes → commit new version.  
**Conflict:** MVP last-writer-wins + keep previous version. v2: branch + notify both clients.  
**Notify:** websocket / push on `file_id` watchers — not polling every file.  
**Failure:** metadata DB is source of truth; chunk store is immutable. Retry commit is idempotent on `version`.

---

## 17. Typeahead

**Product:** suggest queries as you type. Metric: p99 < 50ms.  
**API:** `GET /suggest?q=ho` → `[{text, score}]`

**Data:** prefix index (trie or prefix-partitioned posting). Value = query + popularity.

**Hot path:**
```
Client → edge cache (hot prefixes "a","in","how") → suggest service (in-memory index) → (rare) rebuild from offline job
```

**Rank:** frequency × recency (offline). Personalization = blend last 20 user queries (v2).  
**Failure:** ranker down → serve cached global popular. Empty query → trending list.  
**Follow-up:** typos → fuzzy / BK-tree or “did you mean” from edit-distance 1 on a small dictionary — not on the whole corpus at request time.

---

## 18. Ticketmaster / seat inventory

**Product:** do not double-sell a seat. Metric: zero oversell, hold expiry 8 min.

**API:** `POST /holds {event, seats[]}` → `hold_id` · `POST /checkout {hold_id, payment}` · `DELETE /holds/:id`

**Data:** `seats(event_id, seat_id, status, hold_id, hold_until)` · unique `(event_id, seat_id)`.

**Race:**
1. Transaction: `SELECT … FOR UPDATE` (or Redis lock per seat)  
2. If available → `status=held`, `hold_until=now+8m`  
3. Payment webhook → `status=sold` (idempotent on `payment_id`)  
4. Sweeper releases expired holds  

**Do not** “check then set” without a lock. Kafka is optional for email; it is **not** the inventory source of truth.

**Failure:** payment succeeds twice → same `payment_id` no-ops. Payment fails → hold expires, seat returns.

---

## Quick Reference Card (product)

```
Open with: user + metric + MVP
Then: API JSON → keys/indexes → happy path → hottest QPS → user-visible fallback
Kafka/K8s: only if async or deploy is the bottleneck
1 CR set: Feed, Chat, Uber, Payment, YouTube, Drive, Typeahead, Tickets
```
