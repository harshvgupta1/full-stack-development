# System Design Prerequisites — Scaling Foundations

<!-- SCHEDULE-BANNER-START -->
> **📅 Study window:** 4 Jan 2027 – 6 Jan 2027 (Days 141–143)
> **⏰ Your slots (IST):** Mon–Fri **7:30–8:30pm** & **9:00–10:00pm** · Sat–Sun **9:00am–12:00pm**, **3:00–5:30pm**, **6:00–8:30pm**
> **📧 Calendar reminders:** harsh.gupta@getreelax.com — import `calendar/mern-mastery-study.ics`
<!-- SCHEDULE-BANNER-END -->

> **Phase 7 start** — Days 141–143 (BEFORE full HLD designs).  
> **Prerequisites:** Networking (10b), Databases (06), Auth (07).  
> **Unlocks:** HLD (10), Distributed Systems (11).

---

## Why this exists (don't skip)

`10-system-design-complete.pdf` jumps into "Design Instagram" but assumes you understand:
- Vertical vs horizontal scaling
- Load balancer algorithms
- Caching layers
- Database read replicas vs sharding
- Async processing with queues

This PDF builds the **foundation layer** before full system designs.

---

## 1. Scaling 101

### Vertical scaling (scale up)
- Bigger machine: more CPU, RAM, SSD
- **Pros:** Simple, no code changes
- **Cons:** Hardware limits, single point of failure, expensive
- **When:** Early stage, < 10K users

### Horizontal scaling (scale out)
- More machines behind load balancer
- **Pros:** No upper limit, fault tolerance
- **Cons:** Stateless app required, data consistency harder
- **When:** Production at scale

```
                    Load Balancer
                   /      |      \
              Server1  Server2  Server3
                   \      |      /
                    Shared Database
```

---

## 2. Load balancing

### Algorithms

| Algorithm | Behavior | Best for |
|-----------|----------|----------|
| Round Robin | Rotate sequentially | Equal servers |
| Weighted RR | More traffic to powerful servers | Mixed hardware |
| Least Connections | Route to least busy | Varying request times |
| IP Hash | Same client → same server | Session stickiness |
| Consistent Hash | Minimal remap on add/remove | Cache shards |

### Layer 4 vs Layer 7

- **L4 (TCP):** Routes by IP/port — fast, no HTTP awareness
- **L7 (HTTP):** Routes by URL path, headers — SSL termination, path-based routing

**Tools:** NGINX, HAProxy, AWS ALB, Cloudflare.

---

## 3. Caching layers

```
Browser cache → CDN → Application cache (Redis) → Database
     ↑              ↑              ↑                  ↑
  fastest        fast           moderate            slowest
  smallest       ...            ...                 source of truth
```

### Cache strategies

| Strategy | How | Use when |
|----------|-----|----------|
| Cache-aside | App checks cache, on miss reads DB, writes cache | General purpose |
| Write-through | Write to cache + DB together | Strong consistency needed |
| Write-behind | Write cache, async flush to DB | Write-heavy, can tolerate delay |
| Read-through | Cache fetches from DB on miss | Simplify app code |

### Cache invalidation

- **TTL:** Simple, stale data possible
- **Event-driven:** Invalidate on write — more accurate
- **"Two hard problems":** Naming things, cache invalidation, off-by-one errors

### Redis use cases

- Session store
- Rate limiting counters
- Leaderboards (sorted sets)
- Pub/sub for real-time
- Distributed locks

---

## 4. Database scaling (before sharding)

### Step 1: Optimize queries
- Indexes on WHERE/JOIN columns
- EXPLAIN ANALYZE
- Fix N+1 queries

### Step 2: Read replicas

```
         Writes → Primary DB
                      │
         Reads ← Replica 1, Replica 2, Replica 3
```

- **Replication lag:** Reads may be stale (eventual consistency)
- **Use:** Read-heavy workloads (feeds, profiles)

### Step 3: Connection pooling
- PgBouncer for PostgreSQL
- Pool size tuning

### Step 4: Sharding (last resort)
- Split data across DB instances by shard key (user_id, geo)
- **Problem:** Cross-shard joins, rebalancing

---

## 5. Async processing

```
API Server → Message Queue (Kafka/SQS) → Worker Services
     ↓                                        ↓
  Return 202 Accepted                    Process email,
  immediately                            generate report,
                                         index search
```

**Why:** Decouple slow operations, absorb traffic spikes, retry failed jobs.

**Patterns:**
- Task queue (Celery, BullMQ)
- Event bus (Kafka topics)
- Webhook callbacks

---

## 6. CDN (Content Delivery Network)

- Edge servers worldwide cache static assets
- Reduces latency, offloads origin server
- **Cache:** JS, CSS, images, videos
- **Providers:** CloudFront, Cloudflare, Fastly

---

## 7. API gateway / BFF

```
Mobile App ──┐
             ├──→ API Gateway → Microservices
Web App ─────┘         │
                  Auth, rate limit,
                  routing, aggregation
```

**Backend for Frontend (BFF):** Separate API layer per client type (mobile vs web).

---

## 8. Monitoring basics (before K8s PDF)

| Type | What | Tools |
|------|------|-------|
| Metrics | CPU, QPS, latency p99 | Prometheus, Grafana |
| Logs | Structured JSON logs | ELK, CloudWatch |
| Traces | Request flow across services | Jaeger, Datadog |
| Alerts | SLO breach → page on-call | PagerDuty |

### SLI / SLO / SLA

- **SLI:** Metric (e.g., request latency p99)
- **SLO:** Target (e.g., p99 < 200ms for 99.9% of requests/month)
- **SLA:** Contract with penalties
- **Error budget:** Allowed downtime = 100% - SLO

---

## 9. Reliability patterns

| Pattern | Purpose |
|---------|---------|
| Retry with exponential backoff | Transient failures |
| Circuit breaker | Stop calling failing service |
| Bulkhead | Isolate failures (thread pools) |
| Timeout | Don't wait forever |
| Idempotency keys | Safe retries for payments |
| Health checks | LB removes unhealthy nodes |

---

## 10. Estimation template (use in every HLD)

```
DAU = 10 million
Actions per user per day = 20
QPS = (10M × 20) / 86400 ≈ 2,300 average
Peak QPS = 3–5× average ≈ 10,000

Storage per object = 1 KB
New objects/day = 1M
Storage/day = 1 GB
Storage/year ≈ 365 GB (+ replicas)
```

---

## 11. Progression to full HLD

After this PDF, you can understand:
- URL shortener → caching + DB + redirect
- Feed → fan-out + cache + CDN
- Chat → WebSocket + queue + storage
- Payment → idempotency + saga + ACID

**Next PDF:** `10-system-design-complete.pdf` (full designs)

---

## 12. Interview Q&A

**Q: How do you scale a read-heavy application?**  
**A:** Start with query optimization and indexes. Add Redis cache for hot data with cache-aside pattern. Add read replicas for database reads. Use CDN for static/semi-static content. If still insufficient, consider sharding by read patterns or search engine (Elasticsearch) for complex queries. Monitor cache hit rate and replication lag.

**Q: Cache-aside vs write-through?**  
**A:** Cache-aside: application manages cache — read cache, on miss read DB and populate cache, on write update DB and invalidate cache. Flexible, cache only hot data. Write-through: write goes to cache and DB synchronously — cache always warm but writes slower and cache filled with data that may never be read. Choose cache-aside for most web apps; write-through when reads must always hit cache.

**Q: When do you shard a database?**  
**A:** When vertical scaling and read replicas insufficient — typically write throughput exceeds single node capacity (often 10K+ writes/sec depending on workload) or storage exceeds manageable size (TB+). Shard key must align with query patterns to avoid cross-shard operations. Plan for rebalancing and operational complexity. Many companies delay sharding via aggressive caching and read replicas.

---

## 13. Gate to HLD (PDF #10)

- [ ] Draw 4-layer caching diagram from memory
- [ ] Explain read replica lag tradeoff
- [ ] Name 3 load balancer algorithms
- [ ] Calculate QPS from DAU estimate
- [ ] Explain why message queue for email sending
