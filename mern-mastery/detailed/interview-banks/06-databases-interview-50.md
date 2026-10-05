# Databases Interview Q&A Bank — 50 Questions

> 50 interview questions with full detailed answers for MongoDB, PostgreSQL, MySQL, Redis, Structured Query Language (SQL), transactions, and indexing.

> **Target companies:** Google, Amazon, Flipkart, Uber, Microsoft, Meta.

> **How to use:** Pick 2 questions daily. Read the question, answer aloud in 2–3 minutes, then check the full answer.

---

### Q1: What is the difference between SQL and NoSQL databases?

**Answer:** Structured Query Language (SQL) databases (PostgreSQL, MySQL) store data in fixed tables with rows and columns and enforce schema at write time. They excel at relationships using JOINs (combining tables) and full ACID (Atomicity, Consistency, Isolation, Durability) transactions. NoSQL (Not Only SQL) databases like MongoDB store flexible documents (often JSON-like Binary JSON called BSON) and scale horizontally more easily. SQL fits orders, payments, and reporting; NoSQL fits catalogs, logs, and rapidly changing schemas. Product companies often use both: one SQL database as the source of truth plus MongoDB or Redis for specific workloads.

---

### Q2: Explain ACID properties with a money transfer example.

**Answer:** Atomicity means all steps succeed or none do — debiting one account and crediting another must be one unit; a crash mid-transfer rolls back. Consistency means rules (like balance ≥ 0) always hold. Isolation means concurrent transfers do not see each other's half-finished work. Durability means once committed, data survives power loss (written to disk or replicated). Banks and e-commerce ledgers rely on ACID; interviewers at Flipkart or Amazon expect you to tie each letter to a real failure scenario.

---

### Q3: What is the CAP theorem and how does it apply to MongoDB vs Redis?

**Answer:** CAP (Consistency, Availability, Partition tolerance) states that during a network partition you can prioritize Consistency or Availability, not both. Partition tolerance is required in distributed systems because networks fail. MongoDB replica sets default to CP — they may refuse writes if a majority of nodes is unreachable to avoid stale data. Redis Cluster is often AP for reads — clients may get slightly stale values but the system stays up. Single-node PostgreSQL on one server is effectively CA until you add replication.

---

### Q4: When would you choose PostgreSQL over MySQL?

**Answer:** Choose PostgreSQL when you need advanced analytics (Common Table Expressions, window functions), rich types (JSONB, arrays, geographic information system extensions), strict standards compliance, or complex constraints. PostgreSQL handles concurrent writes and analytical queries well. Choose MySQL when the team standard is MySQL (common at Uber and Flipkart), you need simple high-read Online Transaction Processing (OLTP), or managed MySQL with Vitess sharding. Both are production-grade; know either for interviews.

---

### Q5: When would you choose MongoDB over a SQL database?

**Answer:** MongoDB fits when schema evolves frequently (startup product iterations), documents are read together (user profile with nested preferences), write volume is high and relationships are simple, or you need flexible nested arrays without heavy JOINs. Avoid MongoDB as the only store when you need complex multi-table reports, strict relational integrity across many entities, or heavy ad-hoc analytics with window functions — PostgreSQL wins there.

---

### Q6: What is BSON and how does it differ from JSON?

**Answer:** BSON (Binary JSON) is MongoDB's binary encoding of JSON-like documents. It supports additional types JSON lacks: Date, ObjectId (unique document identifier), Decimal128, and Binary data. BSON is faster to parse than text JSON and includes length prefixes for efficient traversal. In interviews, mention that drivers convert between JavaScript objects and BSON automatically — you still think in JSON shape at the application layer.

---

### Q7: Explain embedding vs referencing in MongoDB schema design.

**Answer:** Embedding stores related data inside one document (order with line items array). Use when data is always fetched together, size is bounded, and relationship is one-to-few. Referencing stores an identifier pointing to another collection (user document with order IDs or order with userId). Use when related data grows unbounded, is shared across documents, or needs independent queries. Over-embedding causes 16 MB document limit issues; over-referencing causes application-level JOINs similar to SQL.

---

### Q8: How do MongoDB indexes work and what is the default _id index?

**Answer:** MongoDB uses B-tree indexes (Balanced tree for range and equality lookups). Every collection automatically has a unique index on `_id`. Queries without a supporting index perform a collection scan (reading every document) — slow at scale. Create indexes on fields used in filter, sort, and lookup stages. Compound indexes follow the leftmost prefix rule: index on `{a:1,b:1}` helps queries on `a` alone or `a+b`, not `b` alone.

---

### Q9: What is the MongoDB aggregation pipeline?

**Answer:** The aggregation pipeline processes documents through stages like `$match` (filter), `$group` (aggregate), `$lookup` (join another collection), `$sort`, and `$project` (reshape fields). It is MongoDB's answer to SQL GROUP BY and JOIN for analytics. Example: count orders per user with `$match` on date range, `$group` by userId, `$sort` by count. Use `$explain` on aggregation to verify index usage — interviewers ask this for dashboard and reporting workloads.

---

### Q10: Explain MongoDB replica sets and failover.

**Answer:** A replica set is one primary node (accepts writes) and secondary nodes (replicate the oplog — operation log). If the primary dies, an election promotes a secondary. Clients should use a connection string with replica set name for automatic failover. Write concern `majority` ensures data is replicated before acknowledging — important for durability. Read concern `majority` avoids stale reads after failover. At Google-scale interviews, mention trade-off between durability and write latency.

---

### Q11: What is MongoDB sharding?

**Answer:** Sharding splits data across multiple shards (each often a replica set) using a shard key. The mongos router directs queries to the correct shard. A bad shard key (low cardinality or monotonic like timestamp-only) creates hot shards — one server gets all writes. Good keys distribute evenly (hashed userId). Sharding is for horizontal scale when a single replica set exceeds disk, memory, or write throughput limits.

---

### Q12: What are the main SQL JOIN types?

**Answer:** INNER JOIN returns rows where both tables match the join condition. LEFT (OUTER) JOIN keeps all rows from the left table and null-fills missing right matches — common for optional relations. RIGHT JOIN is the mirror. FULL OUTER JOIN keeps unmatched rows from both sides (PostgreSQL supports it; MySQL does not natively). CROSS JOIN is the Cartesian product — every row paired with every row. Interviews often ask you to write a query finding users with no orders — that is LEFT JOIN ... WHERE order.id IS NULL.

---

### Q13: Explain database normalization (1NF, 2NF, 3NF) in plain language.

**Answer:** First Normal Form (1NF): atomic columns, no repeating groups — no storing multiple phone numbers in one comma-separated field. Second Normal Form (2NF): no partial dependency on a composite key — every non-key column depends on the whole primary key. Third Normal Form (3NF): no transitive dependency — columns depend only on the primary key, not on other non-key columns. Normalization reduces redundancy and update anomalies. Denormalization is intentional duplication for read speed — know both.

---

### Q14: When is denormalization acceptable?

**Answer:** Denormalize when read performance dominates, joins are expensive at scale, and data is read far more than updated. Examples: storing `authorName` on each blog post to avoid joining users on every feed load, or embedding product snapshot on order line items so historical price stays correct. Trade-offs: larger storage, risk of stale copied fields, harder updates. Cache (Redis) is another form of controlled denormalization.

---

### Q15: What is a B-tree index and why do databases use it?

**Answer:** A B-tree is a balanced tree where each node holds many keys and children, keeping tree height low. It supports O(log n) lookups, range scans (`WHERE age BETWEEN 20 AND 30`), and ordered retrieval for ORDER BY. Most relational databases and MongoDB default to B-tree variants. Interview tip: equality and range queries on indexed columns avoid full table scans; string prefix searches can use indexes, but `LIKE '%suffix'` often cannot.

---

### Q16: What is a compound index and the leftmost prefix rule?

**Answer:** A compound index spans multiple columns, e.g. `(country, city, zip)`. The leftmost prefix rule means the index helps queries filtering on `country`, or `country+city`, or all three — but not `city` alone without `country`. Order matters: put high-selectivity or equality columns first, then range columns. Wrong column order wastes the index — a common senior interview question at Amazon.

---

### Q17: What is a covering index?

**Answer:** A covering index includes all columns the query needs, so the database reads only the index without touching the main table (index-only scan). Example: index on `(user_id, created_at)` for `SELECT created_at FROM orders WHERE user_id = ?` — if `created_at` is in the index, no heap lookup. Smaller result sets and less input/output make queries much faster. In PostgreSQL, use `INCLUDE` columns for this pattern.

---

### Q18: What is a partial index?

**Answer:** A partial index indexes only rows matching a condition, e.g. `WHERE deleted_at IS NULL`. Smaller index size, faster writes, faster lookups for the common case (active users only). PostgreSQL and MongoDB support partial indexes. Use when queries always filter the same subset — soft-deleted records, pending orders, or published posts only.

---

### Q19: How do you use EXPLAIN to optimize a slow query?

**Answer:** Run EXPLAIN or EXPLAIN ANALYZE (PostgreSQL/MySQL) to see the execution plan: sequential scan vs index scan, estimated rows, join order, and actual timings. Look for high cost nodes, nested loop joins on large tables without indexes, and sort operations on huge datasets. Fix by adding indexes, rewriting JOINs, limiting selected columns, or paginating. At Microsoft interviews, walk through one real slow query you fixed.

---

### Q20: What is the N+1 query problem?

**Answer:** N+1 happens when code loads N parent records (1 query) then runs one query per parent for related data (N queries) — e.g. load 100 posts, then 100 queries for each author's name. Total: 101 queries. Fix with JOIN, batch `WHERE author_id IN (...)`, ORM eager loading (Prisma `include`, Mongoose `populate`), or DataLoader pattern in GraphQL. This bug appears constantly in Node.js backends and is a favorite Flipkart question.

---

### Q21: What is connection pooling and why does it matter?

**Answer:** Opening a database connection is expensive (TCP handshake, authentication, memory on server). A pool maintains reusable connections; the app borrows and returns them. Without pooling, traffic spikes exhaust connections or add latency. Configure max pool size based on database limits — PostgreSQL default max_connections is often 100. Prisma and `pg` Pool handle this; watch for pool exhaustion under load tests.

---

### Q22: Explain transaction isolation levels.

**Answer:** Isolation levels control what concurrent transactions see. Read Uncommitted: dirty reads possible (rarely used). Read Committed: only committed data visible — PostgreSQL default. Repeatable Read: same row reads consistent within transaction — MySQL InnoDB default. Serializable: full isolation, may use locks and reduce concurrency. Higher isolation prevents anomalies (dirty read, non-repeatable read, phantom read) but increases lock contention. Pick the lowest level that keeps data correct.

---

### Q23: What is a database deadlock and how do you prevent it?

**Answer:** Deadlock occurs when transaction A locks row 1 waiting for row 2 while transaction B locks row 2 waiting for row 1 — neither can proceed. Databases detect and abort one transaction. Prevention: acquire locks in consistent order (always lock user then order), keep transactions short, use row-level locks wisely, avoid unnecessary `SELECT FOR UPDATE`. Retry aborted transactions with exponential backoff in application code.

---

### Q24: Compare optimistic vs pessimistic locking.

**Answer:** Pessimistic locking locks rows upfront (`SELECT FOR UPDATE`) — safe for high contention inventory (last ticket in concert). Optimistic locking uses a version column — read row with version 5, update only if still version 5; if someone else updated, retry. Optimistic fits low collision e-commerce carts; pessimistic fits financial debits. MongoDB uses atomic operators like `findOneAndUpdate` with conditions for optimistic patterns.

---

### Q25: What are read replicas and what is replication lag?

**Answer:** Read replicas copy data from the primary for read scaling. Writes go to primary; reads can go to replicas. Replication lag is delay before a write appears on replicas — milliseconds to seconds under load. Risk: user updates profile, immediately reads replica, sees old data. Mitigations: read-your-writes routing (same user to primary briefly), session stickiness, or accept eventual consistency for feeds. Uber and Netflix use replicas heavily.

---

### Q26: Explain database sharding vs partitioning.

**Answer:** Partitioning splits data within one database server (PostgreSQL table partitions by date range on one instance). Sharding splits across multiple servers (user IDs 1–1M on shard A, 1M+ on shard B). Partitioning simplifies archival (drop old partition); sharding scales beyond one machine's limits. Both require careful key choice to avoid hot spots. Vitess shards MySQL; MongoDB has native sharding.

---

### Q27: What Redis data structures should you know for interviews?

**Answer:** Strings (cache values, counters with INCR), Lists (queues with LPUSH/BRPOP), Sets (unique tags, mutual followers), Sorted Sets (leaderboards with score-based rank), Hashes (object fields like user session), Streams (event logs), HyperLogLog (approximate unique counts), Bitmap (daily active users). Redis is in-memory — sub-millisecond latency. Know which structure maps to which product feature.

---

### Q28: Explain the cache-aside pattern.

**Answer:** Application checks Redis first. On miss, read database, store in Redis with Time To Live (TTL), return to client. On write, update database then delete or update cache (cache invalidation). Most common caching pattern at product companies. Set TTL to balance freshness vs load — product catalog might be 5 minutes; user session might be 24 hours. Monitor hit rate; below 80% on hot keys suggests wrong keys or TTL.

---

### Q29: What is write-through vs write-behind caching?

**Answer:** Write-through: every write updates cache and database synchronously — strong consistency, higher write latency. Write-behind (write-back): write to cache first, async flush to database — faster writes, risk of data loss on crash. Read-through: cache layer loads from DB on miss automatically (client always talks to cache). Interview answer: use cache-aside for most REST APIs; write-through when stale cache is unacceptable.

---

### Q30: How does Redis pub/sub work and when would you use it?

**Answer:** Publishers send messages to channels; subscribers receive in real time. Fire-and-forget — no persistence if subscriber offline. Use for live notifications, chat fan-out, cache invalidation signals across app servers. For durable messaging use Redis Streams, Kafka, or RabbitMQ. At Meta-scale design questions, pub/sub is for ephemeral broadcast, not order processing.

---

### Q31: What are Redis sorted sets used for?

**Answer:** Sorted sets store unique members each with a numeric score, kept sorted. Commands: ZADD (add with score), ZRANK/ZREVRANK (position), ZRANGE (top N). Perfect for leaderboards, rate limiter sliding windows, priority task queues. Flipkart-style gamification and Uber driver dispatch scoring often map to sorted sets or similar rank structures.

---

### Q32: Explain Redis TTL and eviction policies.

**Answer:** TTL (Time To Live) expires keys automatically — `SET key value EX 3600`. When memory is full, eviction policies apply: `allkeys-lru` evicts least recently used keys globally; `volatile-lru` evicts only keys with TTL. Choose policy based on whether all keys are cache (allkeys) or mix of cache and required data. Monitor memory usage — Redis is fast until Out Of Memory (OOM) kills writes.

---

### Q33: Compare Redis RDB snapshots vs AOF persistence.

**Answer:** RDB: periodic point-in-time snapshots — compact, fast restart, may lose last few minutes of writes. AOF (Append Only File): logs every write — more durable, larger files, slower restart (can rewrite). Many teams use both or accept Redis as pure cache with rebuild-from-DB on restart. For session store durability, enable AOF with `everysec` fsync balance.

---

### Q34: What is Prisma and how does it compare to raw SQL?

**Answer:** Prisma is a TypeScript Object-Relational Mapper (ORM) generating a type-safe client from a schema file. It supports PostgreSQL, MySQL, SQLite, MongoDB. Benefits: autocomplete, compile-time errors, migrations. Raw SQL via `$queryRaw` for complex reports. Compared to raw SQL: less boilerplate, easier refactors; trade-off is abstraction leakage on very complex queries. Standard in modern MERN stacks.

---

### Q35: What is Mongoose and what problems does it solve?

**Answer:** Mongoose is the Object Document Mapper (ODM) for MongoDB in Node.js. It adds schema validation, defaults, middleware hooks (pre-save hashing passwords), virtuals, and population (join-like loading of references). Without Mongoose, you validate in application code only. Know `Schema`, `Model`, indexes in schema, and that strict mode strips unknown fields by default.

---

### Q36: What are database migrations and best practices?

**Answer:** Migrations are versioned schema changes (add column, create index) applied consistently across environments. Tools: Prisma Migrate, Flyway, Liquibase, Alembic. Best practices: never edit production manually; backward-compatible steps (add nullable column before backfill); deploy code that works with old and new schema; create indexes `CONCURRENTLY` on PostgreSQL to avoid locking. Failed migration rollback plan is a senior interview topic.

---

### Q37: How would you schema-design an e-commerce order system?

**Answer:** Users table (id, email). Products (id, sku, price — price snapshot on order line, not live product price). Orders (id, user_id, status, total). Order_items (order_id, product_id, quantity, unit_price at purchase). Payments separate with transaction id. Use foreign keys in SQL for integrity. Index `(user_id, created_at)` for order history. Redis cache product catalog; SQL for orders and payments with transactions.

---

### Q38: What is polyglot persistence?

**Answer:** Using multiple database types in one system for the right job: PostgreSQL for transactions, MongoDB for product catalog, Redis for sessions and cache, Elasticsearch for search. MERN apps often say MongoDB only, but Flipkart/Uber-scale systems mix stores. Interview: justify each choice with access pattern, consistency needs, and query shape — not buzzwords.

---

### Q39: What is eventual consistency and when is it acceptable?

**Answer:** Eventual consistency means replicas converge over time; reads may temporarily return old values. Acceptable for social feeds, view counts, recommendation scores, non-critical profile fields. Not acceptable for account balance, inventory deduction, or idempotent payment id without strong checks. Always state the business impact of stale data in interviews.

---

### Q40: What is a primary key vs a unique index?

**Answer:** Primary key uniquely identifies a row; only one per table; often clustered (physical row order follows it in MySQL InnoDB). Unique index enforces uniqueness on column(s) but allows multiple unique indexes and one NULL in SQL (unless NOT NULL). Use surrogate keys (auto-increment id, UUID) vs natural keys (email) — UUIDs ease distributed inserts; integers are smaller and faster to join.

---

### Q41: What are foreign keys and should you always use them?

**Answer:** Foreign keys enforce referential integrity — cannot insert order with invalid user_id. Cascades can DELETE user and related rows automatically. Benefits: database-enforced consistency. Drawbacks: complicates sharding, migrations, and high-write distributed systems — some teams enforce in application layer instead. For most MERN/SQL apps on one database, use foreign keys; at shard scale, discuss trade-offs openly.

---

### Q42: What are SQL window functions? Give an example.

**Answer:** Window functions compute across related rows without collapsing groups like GROUP BY. Example: `ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC)` ranks employees within each department. Others: `LAG`, `LEAD`, running totals. PostgreSQL excels here. Use for top-N per group, moving averages, and analytics dashboards — common Amazon data interview SQL question.

---

### Q43: What are prepared statements and why use them?

**Answer:** Prepared statements parse SQL once, execute many times with different parameters — faster and immune to SQL injection when used correctly (`$1` placeholders, never string concat). ORMs use them by default. Example attack without preparation: input `' OR '1'='1` breaks naive queries. Always parameterize user input — security and performance win.

---

### Q44: How does MySQL InnoDB differ from MyISAM?

**Answer:** InnoDB supports transactions, row-level locking, foreign keys, and crash recovery — default and required for production. MyISAM has table-level locks, no transactions — legacy, avoid. InnoDB stores rows in primary key order (clustered index). Interviewers at Indian product companies expect you to say InnoDB for any transactional workload.

---

### Q45: What is PostgreSQL JSONB and when to use it?

**Answer:** JSONB stores JSON in binary parsed form — indexable with GIN indexes, queryable with operators (`->`, `->>`, `@>`). Use for semi-structured attributes (user preferences, metadata) that change often without migrations. Not a replacement for normalized relations — avoid storing entire order graph in one JSON blob if you need relational queries. Hybrid model is common at startups scaling to Microsoft-level interviews.

---

### Q46: Explain the difference between DELETE, TRUNCATE, and DROP.

**Answer:** DELETE removes rows matching condition, row-by-row, can rollback in transaction, triggers fire. TRUNCATE removes all rows quickly by deallocating pages — faster, usually cannot rollback, resets auto-increment. DROP removes entire table structure and data. Production: prefer soft delete (`deleted_at`) for audit trails; TRUNCATE staging tables; never DROP without backups.

---

### Q47: How do you handle pagination at scale — OFFSET vs cursor?

**Answer:** OFFSET/LIMIT (`LIMIT 20 OFFSET 100000`) scans and skips 100k rows — slow on large tables. Cursor (keyset) pagination uses `WHERE id > last_seen_id ORDER BY id LIMIT 20` — constant time with index. Use cursor for infinite scroll feeds (Instagram, Flipkart product lists). OFFSET is fine for small admin pages.

---

### Q48: How would you choose a database for a new startup MVP vs at scale?

**Answer:** MVP: one managed PostgreSQL or MongoDB on Railway/Supabase/Atlas — minimize ops. Add Redis when read latency hurts. At scale: read replicas, connection pooling (PgBouncer), cache hot paths, consider sharding when vertical scale (bigger server) fails. Match database to team skills and query patterns. Interviewers want phased evolution, not premature Kafka plus 5 databases on day one.

---

### Q49: What Redis command would you use for a rate limiter?

**Answer:** Fixed window: INCR key, EXPIRE on first increment, reject if count > limit. Sliding window: sorted set ZADD with timestamp score, ZREMRANGEBYSCORE to drop old entries, ZCARD to count. Token bucket can be simulated with Lua script for atomicity. Return HTTP 429 Too Many Requests when exceeded — standard API design at Uber and public APIs.

---

### Q50: Summarize how you would answer 'design the data layer for a ride-sharing app' in an interview.

**Answer:** Users and drivers in SQL with geo indexes or PostGIS. Trips table with status state machine, transactional payment records. Redis for driver location cache and nearby driver queries (GEORADIUS). MongoDB optional for trip event logs. Read replicas for trip history. Strong consistency on payment; eventual on driver location. Mention partition by city at scale. Connect each store to a concrete access pattern — that is what L5 interviews reward.

---
