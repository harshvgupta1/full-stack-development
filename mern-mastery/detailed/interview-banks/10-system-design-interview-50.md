# System Design Interview — 100 Questions

This bank covers High Level Design (HLD), scalability, databases, caching, and classic system design problems for product company interviews. Spell out abbreviations on first use.

## 1. What is System Design in the context of product company interviews?

System Design is the process of defining architecture for a large-scale application: how users interact with it, which services and databases you use, how data flows, and how the system handles growth and failures. Interviewers evaluate your ability to trade off consistency, availability, latency, cost, and complexity.

## 2. What are the key steps in a system design interview?

1) Clarify functional and non-functional requirements. 2) Estimate scale (users, queries per second, storage). 3) Propose High Level Design (APIs, main components). 4) Deep-dive data model and critical paths. 5) Address bottlenecks, scaling, failure modes. 6) Summarize trade-offs. Always think aloud and collaborate.

## 3. How would you design a URL shortener like bit.ly?

Functional: shorten long URL, redirect short URL, optional analytics. API: `POST /urls {longUrl}` → `{shortUrl}`, `GET /{shortCode}` → 302 redirect. Generate short code via base-62 encoding of auto-increment ID or hash (handle collisions). Store mapping in database (SQL or NoSQL). Cache hot URLs in Redis. Scale reads with replicas and CDN; writes with sharded database. Discuss custom aliases and expiration.

## 4. How do you generate unique short codes for a URL shortener?

Option A: Auto-increment ID encoded in base-62 (a-z, A-Z, 0-9)—guaranteed unique, predictable length growth. Option B: Random 6–8 character string—check uniqueness in database; retry on collision. Option C: Hash (MD5/SHA) truncated—risk of collision; use longer codes or salting. For interviews, base-62 of distributed ID (Snowflake) is a strong answer.

## 5. How would you design Twitter (now X) at a high level?

Core features: post tweet, follow users, home timeline, search. Services: User Service, Tweet Service, Timeline Service, Search Service, Notification Service. Write path: tweet saved to Tweet DB, fan-out to followers' timelines (push model) or merged at read (pull model). Hybrid fan-out for celebrities (millions of followers). Cache timelines in Redis. Use Kafka for async fan-out.

## 6. Explain fan-out on write vs fan-out on read for timelines.

Fan-out on write (push): when user posts, precompute and write tweet ID to each follower's timeline cache—fast reads, slow/expensive writes for popular users. Fan-out on read (pull): store tweets; at read time merge tweets from followed users—cheap writes, slower reads. Hybrid: push for normal users, pull for celebrities.

## 7. How would you design Instagram?

Features: upload photo/video, follow, feed, likes, comments, stories. Upload flow: client → object storage (Amazon S3) via pre-signed URL; metadata in database. Feed similar to Twitter fan-out. CDN serves images globally. Separate services for media processing (thumbnails, transcoding), social graph, and notifications.

## 8. What is the difference between SQL and NoSQL for system design?

SQL (Structured Query Language) databases (PostgreSQL, MySQL) offer strong schemas, joins, and ACID transactions—good for relational data (orders, payments). NoSQL (MongoDB, Cassandra, DynamoDB) offers flexible schemas and horizontal scaling—good for high write throughput, simple access patterns, or document/key-value models. Many systems use both (polyglot persistence).

## 9. When would you choose a document database vs a wide-column store?

Document DB (MongoDB): flexible JSON documents, rich queries, good for user profiles, content catalogs. Wide-column (Cassandra, HBase): optimized for time-series and high write volume with partition key access—good for feeds, metrics, message logs. Choose based on access pattern, not hype.

## 10. What is a Content Delivery Network (CDN)?

A CDN is a geographically distributed network of edge servers that cache static content (images, videos, JavaScript, CSS) close to users. Reduces latency and origin server load. Examples: CloudFront, Cloudflare, Akamai. Use CDN for media-heavy apps like Instagram and Netflix.

## 11. How do you design APIs for a large system?

Prefer REST for resource-oriented CRUD or GraphQL when clients need flexible field selection. Define clear endpoints, versioning (`/v1/`), authentication (OAuth 2.0 tokens), rate limiting, and pagination (cursor-based for large feeds). Use idempotency keys for payment-like operations.

## 12. What is horizontal vs vertical scaling?

Vertical scaling (scale up) adds CPU/RAM to one machine—simple but has limits. Horizontal scaling (scale out) adds more machines—requires load balancing and distributed data. Large product systems almost always scale horizontally.

## 13. What is database sharding?

Sharding splits data across multiple database instances by a shard key (e.g., `user_id % N`). Each shard holds a subset of data. Enables write scalability beyond single-node limits. Challenges: cross-shard queries, rebalancing, hot shards. Consistent hashing helps minimize data movement on resharding.

## 14. What is replication in databases?

Replication copies data from a primary (leader) node to one or more replica (follower) nodes. Used for read scaling and high availability. Synchronous replication waits for replica ack—stronger consistency, higher latency. Asynchronous replication is faster but may lose recent writes on failover.

## 15. What is the CAP theorem?

CAP theorem states that in a network partition, a distributed system must choose between **Consistency** (all nodes see same data) and **Availability** (every request gets a response). Partition tolerance is mandatory in distributed systems. In practice you tune consistency vs availability per use case (e.g., strong for payments, eventual for likes count).

## 16. What is eventual consistency?

Eventual consistency means if no new updates occur, all replicas will converge to the same value over time. Acceptable for social likes, view counts, and CDN caches. Unacceptable for bank balances without careful design. Mitigate with version vectors, conflict resolution, or user-facing 'syncing' indicators.

## 17. How would you design a notification system?

Components: Event Producer (app services) → Message Queue (Kafka) → Notification Service → channels (push, email, SMS). Store user preferences and device tokens. Template engine for message content. Rate limit and batch notifications. Retry with dead-letter queue for failures. Scale workers horizontally.

## 18. What is a message queue and why use one?

A message queue (Kafka, RabbitMQ, Amazon Simple Queue Service) decouples producers and consumers. Benefits: async processing, load leveling, fault tolerance, and independent scaling. Example: order placed event triggers inventory, shipping, and email services without blocking checkout.

## 19. How would you design a chat application like WhatsApp?

Real-time delivery via WebSockets or long polling. Message Service stores messages; sync on reconnect. Use sequence numbers per conversation for ordering. Presence service tracks online status. End-to-end encryption for privacy. Push notifications via Apple Push Notification service / Firebase Cloud Messaging when offline.

## 20. What is WebSocket and when is it used?

WebSocket is a persistent, bidirectional protocol over TCP. Unlike HTTP request/response, server can push data anytime. Used for chat, live sports scores, collaborative editing, and gaming. Fallback to Server-Sent Events or long polling if WebSockets blocked by proxies.

## 21. How would you design YouTube or a video streaming platform?

Upload: chunked upload to object storage; transcoding pipeline produces multiple resolutions (240p–4K). Metadata and comments in database. CDN delivers video segments (HLS/DASH adaptive bitrate). View counts via async aggregation. Recommendation engine as separate ML pipeline.

## 22. What is rate limiting at the system design level?

Rate limiting protects services from abuse and overload. Implement at API gateway (token bucket per user/IP). Return HTTP 429 Too Many Requests with Retry-After header. Distributed rate limits need shared store (Redis). Different tiers for free vs premium users.

## 23. How do you handle authentication in a distributed system?

Use OAuth 2.0 / OpenID Connect: user logs in via identity provider, client gets JWT (JSON Web Token). Services validate JWT signature and expiry statelessly. Refresh tokens for long sessions. Store sessions in Redis for revocation. Never store passwords in plain text—use bcrypt/argon2 hashing.

## 24. What is an API Gateway?

An API Gateway is a single entry point for clients routing to backend microservices. Handles authentication, rate limiting, SSL termination, request routing, and aggregation. Examples: Kong, AWS API Gateway, Nginx. Simplifies client logic and centralizes cross-cutting concerns.

## 25. How would you design a search system?

Ingest documents into inverted index (Elasticsearch, Apache Solr). Tokenize, stem, remove stop words. Rank by TF-IDF (Term Frequency-Inverse Document Frequency) or learning-to-rank. Autocomplete via prefix index (Trie or Elasticsearch completion suggester). For Twitter, separate hot index for recent tweets and cold storage for archive.

## 26. What is Elasticsearch used for?

Elasticsearch is a distributed search and analytics engine built on Apache Lucene. Stores JSON documents, supports full-text search, aggregations, and geo queries. Used for log analytics (ELK stack), product search, and autocomplete. Scale by adding nodes to cluster.

## 27. How do you design for high availability?

Eliminate single points of failure: multi-Availability Zone deployment, load balancers with health checks, database replication with automatic failover, circuit breakers, graceful degradation (show cached feed if timeline service down). Target SLA (Service Level Agreement) like 99.9% uptime (~8.7 hours downtime/year).

## 28. What is a circuit breaker pattern?

Circuit breaker stops calling a failing downstream service after threshold failures, returning fallback quickly. States: Closed (normal), Open (fail fast), Half-Open (probe recovery). Prevents cascade failures. Libraries: Resilience4j, Hystrix (legacy). Essential in microservices.

## 29. What is idempotency and why does it matter?

An operation is idempotent if performing it multiple times has the same effect as once. Critical for retries (network timeouts). Example: payment with idempotency key—duplicate requests do not double-charge. Implement via unique request ID stored in database before processing.

## 30. How would you design an e-commerce checkout system?

Flow: cart → inventory check → payment → order creation → notification. Use saga pattern for distributed transaction across inventory, payment, and order services. Reserve inventory temporarily; release on payment timeout. Strong consistency for payment; async for emails.

## 31. What is the difference between strong and weak consistency?

Strong consistency: after a write, all reads see the latest value immediately (linearizability). Weak/eventual: reads may return stale data temporarily. Choose strong for financial ledger; eventual for social metrics. Many databases offer tunable consistency levels.

## 32. How do you estimate storage for a system design question?

Example: 500M users, 2 tweets/user/day, 280 bytes/tweet → 1B tweets/day × 280 B ≈ 280 GB/day raw. Add indexes (~2×), replicas (3×), media separately. Round up. Show structured math—interviewers care about approach, not exact numbers.

## 33. How do you estimate queries per second (QPS)?

Daily active users × actions per day / 86400 seconds. Example: 100M daily active users, 50 reads/day → 5B reads/day ≈ 58,000 read QPS average; plan for 3–5× peak. Separate read vs write QPS.

## 34. What is microservices architecture?

Microservices split an application into small, independently deployable services, each owning its data and business logic. Communicate via HTTP/REST or message queues. Benefits: independent scaling, team autonomy, technology diversity. Costs: operational complexity, distributed debugging, network latency.

## 35. Monolith vs microservices: when to choose which?

Start with modular monolith for new products—simpler ops, faster iteration. Extract microservices when teams scale, components need independent scaling, or deployment cycles conflict. Interview answer: 'I'd start monolith with clear module boundaries, split when metrics justify it.'

## 36. What is a load balancer and where do you place it?

A load balancer distributes incoming traffic across multiple servers. Layer 4 (transport) routes by IP/port; Layer 7 (application) routes by URL path or headers. Place between clients and app servers, and between app and database read replicas. Algorithms: round robin, least connections, consistent hashing for sticky sessions.

## 37. How would you design a ride-sharing app like Uber?

Services: User, Driver, Trip, Matching, Pricing, Payment, Notification. Real-time location via GPS updates to geospatial index (Redis Geo, PostGIS). Matching: find nearby available drivers. Surge pricing via demand/supply ratio. Trip state machine: requested → accepted → in-progress → completed.

## 38. What is geospatial indexing?

Geospatial indexes efficiently query locations within radius or bounding box. Techniques: Geohash, QuadTree, R-tree. Uber uses H3 hexagonal grid. Store driver coordinates updated every few seconds; query 'drivers within 2 km of rider'.

## 39. How would you design a file storage system like Dropbox?

Client syncs files via chunked upload (deduplicate chunks by hash—content-addressable storage). Metadata (file tree, permissions) in SQL; blobs in object storage (S3). Conflict resolution via versioning or last-write-wins with user notification. Delta sync sends only changed chunks.

## 40. What is consistent hashing?

Consistent hashing maps keys and nodes to a hash ring. Adding/removing a node only remaps adjacent key range—unlike modulo hashing which remaps almost all keys. Used for distributed caches, sharding, and load balancing. Virtual nodes improve load distribution.

## 41. How do you design logging and monitoring?

Centralized logs: app → Fluentd/Logstash → Elasticsearch → Kibana (ELK). Metrics: Prometheus scrapes endpoints, Grafana dashboards. Tracing: OpenTelemetry/Jaeger for request flow. Alert on SLI (Service Level Indicator) breaches: error rate, latency p99, saturation.

## 42. What is the difference between latency and throughput?

Latency is time for one request to complete (milliseconds). Throughput is requests handled per second. Optimizing one can hurt the other. Batch processing increases throughput but adds latency. Define SLAs (Service Level Agreements) for both (e.g., p99 latency < 200ms, 10K QPS).

## 43. How would you design a rate-limited public API?

API keys per developer, tiered quotas (1000 req/day free, 1M paid). Enforce at gateway with Redis counters. Return rate limit headers (`X-RateLimit-Remaining`). Document endpoints, provide SDKs, sandbox environment. Billing integration for overages.

## 44. What is a bloom filter?

A Bloom filter is a space-efficient probabilistic structure testing set membership. May have false positives (says maybe present) but never false negatives. Used to avoid unnecessary database lookups (e.g., 'does this username exist?' or 'is this URL malicious?'). Cannot delete without counting variant.

## 45. How do you prevent the thundering herd problem?

When cache expires, many requests hit database simultaneously. Solutions: probabilistic early expiration, mutex lock on cache miss (only one thread rebuilds), stale-while-revalidate (serve stale, refresh async), pre-warm cache before peak events.

## 46. What is database indexing strategy in system design?

Index columns used in WHERE, JOIN, ORDER BY. Composite indexes for multi-column queries (leftmost prefix rule). Avoid over-indexing—slows writes. Use covering indexes to avoid table lookups. For feeds, index `(user_id, created_at DESC)`. Explain trade-off: read speed vs write overhead.

## 47. How would you design a news feed ranking system?

Candidate generation (follow graph + trending) → feature extraction (recency, engagement, affinity) → ML ranker (gradient boosted trees or neural net) → diversity re-ranking. Train offline on click data; serve online with low latency (<100ms). A/B test ranking changes.

## 48. What questions should you ask the interviewer in system design?

Clarify scale (users, QPS), read/write ratio, latency requirements, consistency needs, geographic distribution, mobile vs web, and which features are in scope. Asking shows seniority and prevents over-engineering.

## 49. How do you wrap up a system design interview?

Summarize architecture diagram verbally, highlight key trade-offs (push vs pull timeline, SQL vs NoSQL), mention what you'd monitor, and one future improvement (multi-region, ML personalization). Leave time for interviewer questions.

## 50. What is caching strategy in system design interviews?

Caching is storing frequently read data in fast storage (Redis, Memcached, or Content Delivery Network) to reduce database load and latency. Patterns: cache-aside (lazy load on miss), write-through (sync write to cache and DB), and TTL-based expiration. Always discuss cache invalidation, hot keys, and thundering herd mitigation in interviews.
---

## Questions 51–100 (top product companies)

## 51. How do you estimate queries per second from daily active users?

DAU × actions / 86400 × peak 2–3×. Say the number. All HLD.

## 52. When is a Content Delivery Network the first optimization?

Static and video bytes. Origin shield on miss storms. YouTube / Netflix HLD.

## 53. Cache stampede — how do you stop it?

Lock on miss, probabilistic early expire, or serve stale. Meta / Uber.

## 54. How do you pick a shard key?

High cardinality, even load, matches the query. Avoid hot celebrity keys. Meta / Uber.

## 55. What is a hot key in Redis?

One key gets most traffic. Local cache, split, or replicate. Meta.

## 56. Leader election — why mention it?

One writer for a partition (Kafka, primary DB). etcd/ZooKeeper. Google / Amazon.

## 57. How do you design unread badges?

Counter per user, increment on write, reset on read, accept eventual. Meta.

## 58. What is an outbox pattern?

Write DB row + event in one transaction; publisher drains outbox. Payments. Amazon / Stripe.

## 59. How do you expire paste-bin pastes?

TTL in Redis or a sweep job on `expires_at`. Easy HLD. All.

## 60. When do you need a message queue vs a database table?

Queue for async fan-out and retries. Table if you must query jobs. Uber / Amazon.

## 61. How do you design presence (online dots)?

Heartbeat to Redis with TTL, WebSocket disconnect cleanup. WhatsApp HLD. Meta / Uber.

## 62. What is consistent hashing for?

Caches/shards so adding a node remaps ~1/N keys. Amazon / Google.

## 63. How do you handle multi-region writes?

Single primary region for strong data; or CRDTs/conflict for docs. Google / Meta.

## 64. Explain CQRS in product language.

Different model for write vs read (feed cache vs post table). Meta / Uber.

## 65. How do you design a web crawler politely?

Frontier queue, per-host delay, robots.txt, URL dedup. Google / Phase 9.

## 66. What is an API gateway doing?

Auth, rate limit, routing, TLS. Not your business logic. Adobe / Amazon.

## 67. How do you store images for an Instagram-like app?

Object store + CDN; metadata in DB; thumbnails async. Meta.

## 68. Design a rate limiter for 100k requests/s.

Redis cluster, shard by user, local allow-list for health. Uber / Amazon.

## 69. How do you do search typeahead at Google scale (lite)?

Prefix shards, in-memory, cache first characters, offline rank. Google / PDF #10.

## 70. What fails if your load balancer is sticky and a node dies?

Those users reconnect; session must live in Redis not memory. Adobe / Uber.

## 71. How do you design idempotent webhooks inbound?

Store event id, unique constraint, return 200 on replay. Stripe / Razorpay.

## 72. Explain fan-out-on-write cost for a celebrity.

80M writes per tweet — impossible. Hybrid pull. Meta.

## 73. How do you keep chat order in a group?

Per-group sequence or vector; display sort by server timestamp + id. Meta / Uber.

## 74. What is a bloom filter for in shortener/crawler?

Probabilistic “seen URL” to skip disk. Google.

## 75. How do you design feature flags globally?

SDK + rules service, default false, cache, audit. Meta / LaunchDarkly-style.

## 76. Object storage vs block vs DB for files?

S3-style for blobs; DB for metadata only. Drive HLD. Google / Dropbox.

## 77. How do you design an admin analytics dashboard?

Event stream → warehouse (batch); not the OLTP DB. Amazon / Flipkart.

## 78. What is a dead-letter queue in notifications?

After N fails, park and page a human. Amazon / Uber.

## 79. How do you avoid thundering herd on cache expire?

Jitter TTLs, lock, stale-while-revalidate. Meta.

## 80. Design a URL redirect that must be fast.

Cache, 301 vs 302, prefetch DNS. All easy HLD.

## 81. When is Kafka the wrong answer?

When you need a queryable table or a single-box app. Most junior HLD. PDF #20.

## 82. How do you model money?

Integer minor units, never float; ledger rows. Stripe / PhonePe.

## 83. What is a saga vs two-phase commit?

Saga: local tx + compensate. 2PC: locks, rarely at web scale. Amazon / Uber.

## 84. How do you design seat holds that expire?

hold_until + sweeper + unique seat. Ticketmaster. Flipkart / PDF #10.

## 85. Explain read-your-writes after posting.

Read primary or cache you just wrote. Meta / Twitter.

## 86. How do you shard a chat system?

By conversation id so a room lives on one partition. Meta / Slack.

## 87. What SLI/SLO would you set for a shortener?

Availability 99.9%, p99 redirect < 100 ms. Google SRE-lite. Phase 7G.

## 88. How do you design logout-all-devices?

Session version in DB; increment; tokens carry version. Amazon / Adobe.

## 89. CDN purge vs versioned URLs?

Prefer `/img/abc123.jpg` new hash; purge is slow. Google / Netflix.

## 90. How do you handle clock skew in distributed systems?

Do not trust client clocks; server time; logical clocks if needed. Google.

## 91. Design a news-letter send to 10M users.

Queue chunks, rate-limit ESP, unsubscribe table, bounce handling. Amazon / Adobe.

## 92. What is an edge cache vs origin cache?

Edge near user (CDN); origin shield in your region. YouTube HLD.

## 93. How do you design unique IDs at scale?

Snowflake (timestamp+worker+seq) or UUID v7. Avoid DB autoincrement as the only global id. Uber / Twitter.

## 94. When do you denormalize like_count?

Read-heavy posts; accept eventual via async increment. Meta.

## 95. How do you design a document collaborative editor (lite)?

OT or CRDT, persist ops, presence. Google Docs. Phase 9. PDF #20.

## 96. What is a BFF for mobile vs web?

Different payloads; one gateway per client type. Meta / Atlassian.

## 97. How do you plan a launch that can rollback?

Feature flag, old binaries, dual-write if schema. Amazon.

## 98. Explain p99 vs average latency.

Average hides the tail users feel. Always quote p99. Google / Uber.

## 99. How do you design spam/fraud checks on signup?

Rate limit, device signals, async review; do not block all on one ML call. Meta / Stripe.

## 100. Close an HLD: what do you say in the last minute?

Recap metric, biggest risk, what you would load-test. All.
