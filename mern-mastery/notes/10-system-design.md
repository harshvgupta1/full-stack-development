# System Design (HLD) — Notes

---

## Interview Framework (RADIO / RESHADED)

1. **Requirements** — functional + non-functional (scale, latency, availability)
2. **Estimation** — users, QPS, storage, bandwidth
3. **API Design** — endpoints, request/response
4. **Data Model** — tables/collections, relationships
5. **High-Level Design** — boxes and arrows
6. **Deep Dive** — bottlenecks, scaling
7. **Trade-offs** — why this over that

---

## Core Concepts

### Scalability
- **Vertical scaling** — bigger machine (limited)
- **Horizontal scaling** — more machines + load balancer

### Load Balancer
Distributes traffic: Round Robin, Least Connections, IP Hash

### Caching
- **Browser cache** → **CDN** → **Application cache (Redis)** → **Database**
- Cache strategies: Cache-aside, Write-through, Write-behind
- Cache invalidation: TTL, event-driven

### Database scaling
- **Read replicas** — scale reads
- **Sharding** — partition data by key (user_id, geo)
- **SQL vs NoSQL** — consistency vs flexibility

### Message Queue
- **Kafka/RabbitMQ** — async processing, decouple services
- Use cases: email notifications, order processing, event streaming

### CAP Theorem
Pick 2 of 3: **Consistency**, **Availability**, **Partition tolerance**
- CP: banking (PostgreSQL)
- AP: social feeds (Cassandra)

### Consistency models
- Strong consistency — read always latest write
- Eventual consistency — reads catch up over time

---

## Design 1: URL Shortener

**Requirements:** Shorten URL, redirect, analytics, 100M URLs/day

**API:**
```
POST /api/shorten  { longUrl } → { shortUrl }
GET  /:code        → 302 redirect
GET  /api/stats/:code → { clicks, referrers }
```

**Key decisions:**
- Encoding: Base62 (a-zA-Z0-9) → 6 chars = 62^6 ≈ 56 billion URLs
- ID generation: Snowflake / counter + Base62
- Storage: SQL (url_mappings table) + Redis cache for hot URLs
- Redirect: 301 (permanent, cacheable) vs 302 (track clicks)

```
Client → CDN → Load Balancer → App Servers → Redis (cache)
                                            → PostgreSQL (store)
```

---

## Design 2: Instagram Feed

**Requirements:** Post photo, follow users, see personalized feed

**Approaches:**
- **Pull model** — fetch from all followees at read time (slow for celebrities)
- **Push model (fan-out)** — pre-compute feed on post (write-heavy)
- **Hybrid** — push for normal users, pull for celebrities with millions of followers

**Storage:**
- Photos: S3 + CDN
- Metadata: PostgreSQL (users, posts, follows)
- Feed cache: Redis sorted sets

---

## Design 3: Chat System (WhatsApp-like)

**Requirements:** 1:1 chat, group chat, online status, message delivery

**Components:**
- WebSocket servers for real-time
- Message queue for persistence
- Cassandra/MongoDB for message storage (write-heavy)
- Redis for online presence, unread counts

**Message flow:**
```
Sender → WebSocket Server → Message Queue → Storage
                         → Push to Receiver's WebSocket
```

---

## Design 4: Notification System

**Channels:** Push, Email, SMS, In-app

**Architecture:**
```
Event → Notification Service → Queue per channel
                            → Push Worker
                            → Email Worker (SendGrid)
                            → SMS Worker (Twilio)
```

**Idempotency:** Same event shouldn't send duplicate notifications

---

## Design 5: E-commerce Order System

**Flow:** Browse → Cart → Checkout → Payment → Order → Fulfillment

**Key concerns:**
- **Inventory** — pessimistic locking or reservation with TTL
- **Payment** — idempotent payment API, webhook for confirmation
- **Order state machine** — pending → paid → shipped → delivered
- **Saga pattern** — distributed transaction across services

---

## Back-of-envelope calculations

```
Daily active users: 10M
Requests per user per day: 50
QPS = (10M × 50) / 86400 ≈ 5,800 QPS
Peak QPS ≈ 3× average ≈ 17,000 QPS

Storage: 1M new posts/day × 2KB metadata = 2GB/day ≈ 730GB/year
```

---

## Month 6 study schedule

| Week | Systems to design (1 per day) |
|------|-------------------------------|
| 21 | URL Shortener, Paste bin |
| 22 | Twitter Feed, Instagram |
| 23 | WhatsApp Chat, Notification System |
| 24 | YouTube, Uber (basic), E-commerce |

**Resources:**
- Book: "System Design Interview" by Alex Xu
- YouTube: ByteByteGo, Gaurav Sen
- Practice: draw on whiteboard/excalidraw, explain in 45 min
