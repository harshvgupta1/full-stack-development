# Distributed Systems Interview — 50 Questions

This bank covers consistency models, replication, consensus algorithms, and the saga pattern for distributed systems interviews at product companies. Spell out abbreviations on first use.

## 1. What is a distributed system?

A distributed system is a collection of independent computers that work together and appear to users as a single coherent system. Each node has its own memory and may fail independently. Examples include Google Search, Amazon DynamoDB, and Netflix microservices. The main challenge is coordinating nodes over an unreliable network while maintaining correctness and performance.

## 2. What is replication in distributed databases?

Replication means keeping copies of the same data on multiple nodes. It improves read throughput, provides fault tolerance, and reduces latency by serving from nearby replicas. Trade-offs include consistency — replicas may be temporarily out of sync — and write complexity because updates must propagate to all copies.

## 3. What is leader-based replication?

In leader-based (primary-secondary) replication, one node is the leader that accepts all writes. Follower replicas receive a stream of changes from the leader and apply them locally. Reads can go to the leader for strong consistency or followers for eventual consistency. PostgreSQL and MySQL use this model; failover promotes a follower when the leader dies.

## 4. What is synchronous vs asynchronous replication?

Synchronous replication waits for follower acknowledgment before confirming a write — guarantees no data loss on failover but increases write latency. Asynchronous replication confirms immediately after the leader writes locally; followers catch up later — faster writes but recent data may be lost if the leader fails before replication completes. Many systems offer configurable sync levels.

## 5. What is multi-leader replication?

Multi-leader replication allows writes on multiple nodes, which then replicate to each other. Useful for multi-datacenter deployments where each region writes locally. Challenges include write conflicts when two leaders modify the same record. Resolution strategies include last-write-wins, custom merge logic, or partitioning so each leader owns a key range.

## 6. What is leaderless replication?

Leaderless replication (used by Amazon DynamoDB and Apache Cassandra) allows any node to accept reads and writes. Writes go to multiple replicas; reads query multiple replicas and use version numbers to resolve conflicts. Quorum reads and writes ensure consistency when enough nodes agree. No single leader means no leader failover bottleneck, but conflict resolution is the caller's responsibility.

## 7. What is the quorum formula R + W > N?

In a system with N replicas, R is the number of nodes read from and W is the number written to. The quorum condition R + W > N ensures read and write sets overlap, so reads see the latest write. Example: N=3, W=2, R=2 guarantees strong consistency. Lower W improves write speed; lower R improves read speed — but if R + W ≤ N, stale reads are possible.

## 8. What is linearizability (strong consistency)?

Linearizability means every operation appears to take effect at a single instant between its start and end, and all nodes agree on the order. If operation A completes before B starts, B must see A's effects. This is the strongest single-object consistency guarantee. Required for distributed locks, leader election, and financial balances.

## 9. What is sequential consistency?

Sequential consistency guarantees all nodes see the same order of operations, but that order may differ from real-time order. If two writes happen concurrently with no causal link, different nodes might observe them in different orders — but each individual node sees a consistent sequence. Weaker than linearizability but easier to implement in some systems.

## 10. What is causal consistency?

Causal consistency preserves cause-and-effect relationships: if operation B reads or depends on operation A, all nodes must see A before B. Concurrent operations with no causal link may be seen in different orders. Implemented using vector clocks or version vectors. Stronger than eventual consistency, weaker than sequential consistency — good for social media comments and collaborative editing.

## 11. What is read-your-writes consistency?

Read-your-writes means after a user writes data, they always see their own update on subsequent reads — even if other users might see stale data temporarily. Achieved by routing a user's reads to the node they wrote to, or by tracking write timestamps and rejecting stale reads. Essential for user experience in profile updates and shopping carts.

## 12. What is monotonic reads consistency?

Monotonic reads guarantee that if a user reads a value, they will never see an older value on subsequent reads (no time travel backward). Even if replicas are temporarily inconsistent, a user is pinned to a replica or reads are version-checked. Prevents confusing user experience like a posted comment disappearing and reappearing.

## 13. What is eventual consistency?

Eventual consistency means if no new updates occur, all replicas will converge to the same value over time. Writes propagate asynchronously; reads may return stale data temporarily. Acceptable for social like counts, view counts, and product recommendations. Amazon DynamoDB and Apache Cassandra default to this model. Mitigate with version numbers and user-facing sync indicators.

## 14. What is a vector clock?

A vector clock tracks causality across distributed nodes. Each node maintains a vector of counters (one per node). On a local event, increment your counter; on sending a message, attach your vector; on receiving, merge by taking the max of each element. Comparing vectors reveals whether events are concurrent or causally ordered — essential for conflict detection in multi-leader systems.

## 15. What is the Two-Phase Commit (2PC) protocol?

Two-Phase Commit (2PC) is a distributed transaction protocol ensuring all participants commit or all abort. Phase 1 (Prepare): coordinator asks all participants to vote; each prepares and responds yes/no. Phase 2 (Commit/Abort): if all voted yes, coordinator sends commit; otherwise abort. Problem: coordinator failure after prepare leaves participants blocked — requires manual intervention or timeout.

## 16. What is the Three-Phase Commit (3PC) protocol?

Three-Phase Commit (3PC) adds a pre-commit phase to 2PC to reduce blocking. Phase 1: CanCommit (probe). Phase 2: PreCommit (prepare). Phase 3: DoCommit. If the coordinator fails after pre-commit, participants can safely commit because all agreed to proceed. However, 3PC still fails under network partitions and is rarely used in production — saga pattern is preferred.

## 17. What is the saga pattern?

The saga pattern manages distributed transactions as a sequence of local transactions, each with a compensating action if a later step fails. Instead of locking across services (like 2PC), each step commits independently. If step 3 fails, run compensating transactions for steps 2 and 1 (refund payment, release inventory). Used heavily in microservices for order processing and booking systems.

## 18. What is saga orchestration vs choreography?

Saga orchestration uses a central coordinator that tells each service what to do and handles failures. Easier to understand and debug but creates a single point of logic. Saga choreography has each service listen for events and decide locally (payment completed → shipping service acts). More decoupled but harder to trace. Choose orchestration for complex flows; choreography for simple event chains.

## 19. What is a compensating transaction?

A compensating transaction undoes the effect of a previously committed local transaction in a saga. It is not a database rollback — that window is closed — it is a new business operation: refund a charge, cancel a reservation, send a cancellation email. Compensating actions must be idempotent because they may be retried. Design them during saga planning, not as an afterthought.

## 20. What is the Raft consensus algorithm?

Raft is a consensus algorithm for electing a leader and replicating a log across nodes. States: leader, follower, candidate. Leader accepts client requests, appends to its log, replicates to followers; commit when majority acknowledges. On leader failure, followers timeout and start an election. Easier to understand than Paxos; used by etcd, Consul, and CockroachDB. Guarantees committed entries are never lost.

## 21. What is the Paxos consensus algorithm?

Paxos is the foundational consensus algorithm proving that a distributed system can agree on a value despite failures. Roles: proposers, acceptors, learners. Uses proposal numbers and majority quorums. Correct but notoriously difficult to implement and explain. Variants like Multi-Paxos optimize for continuous log replication. Google Chubby and early Apache ZooKeeper implementations use Paxos-family algorithms.

## 22. What is distributed consensus and why is it needed?

Distributed consensus means multiple nodes agreeing on a single value or sequence of values despite failures and network delays. Needed for leader election, atomic commit, and replicated state machines (same log order on all nodes). Without consensus, split-brain and data corruption occur. Consensus requires a majority (quorum) to tolerate f failures in 2f+1 nodes.

## 23. What is split-brain in distributed systems?

Split-brain occurs when a network partition causes two groups of nodes to each believe they are the primary, accepting writes independently. Data diverges and cannot be automatically merged. Prevention: require majority quorum for leadership, use fencing tokens to reject stale leaders, and deploy an odd number of nodes across failure domains.

## 24. What is a fencing token?

A fencing token is a monotonically increasing number issued by the lock service (Apache ZooKeeper, etcd) when a client acquires a lock. The client must present this token with every write; storage rejects writes with stale (lower) tokens. Prevents a delayed old leader from corrupting data after losing leadership. Critical for safe distributed locks in Apache Kafka and Google Chubby.

## 25. What is exactly-once semantics?

Exactly-once semantics means each message or operation is processed precisely one time with no duplicates and no losses. Extremely difficult in distributed systems — network retries cause duplicates; failures cause losses. Practical approach: at-least-once delivery plus idempotent consumers (deduplicate by message ID). Apache Kafka transactions and idempotent producers approximate exactly-once within the Kafka ecosystem.

## 26. What is at-least-once vs at-most-once delivery?

At-least-once delivery guarantees every message is delivered one or more times — retries on failure — so consumers must handle duplicates. At-most-once delivery delivers zero or one time (no retries) — messages may be lost but never duplicated. Exactly-once is the ideal but hardest. Most production systems use at-least-once with idempotent processing for reliability.

## 27. What is idempotency in distributed systems?

Idempotency means performing an operation multiple times has the same effect as performing it once. Critical for safe retries after timeouts. Implement via unique request IDs stored in a database: first request processes and records the ID; duplicates return the cached result. Payment systems, reservation Application Programming Interfaces (APIs), and message consumers all require idempotent design.

## 28. What is a distributed transaction?

A distributed transaction spans multiple services or databases and must commit or abort atomically across all participants. Classic approach: Two-Phase Commit (2PC) — simple in theory but slow, blocking, and fragile. Modern approach: saga pattern with compensating transactions. Avoid distributed transactions when possible — design services to own their data and communicate via events.

## 29. What is the difference between ACID and BASE?

ACID (Atomicity, Consistency, Isolation, Durability) describes traditional relational database guarantees — strong consistency, used in PostgreSQL and MySQL. BASE (Basically Available, Soft state, Eventual consistency) describes many NoSQL systems — prioritize availability and partition tolerance, accept temporary inconsistency. Distributed systems often choose BASE at scale and enforce strong consistency only where business requires it (payments).

## 30. What is a gossip protocol?

A gossip protocol spreads information like epidemic rumor spreading: each node periodically sends its state to random peers, which forward to others. Eventually all nodes converge. Used for membership detection, spreading cluster metadata, and anti-entropy repair in Amazon DynamoDB and Apache Cassandra. Highly scalable and fault-tolerant but eventually consistent with propagation delay.

## 31. What is consistent hashing in distributed systems?

Consistent hashing maps both data keys and nodes onto a hash ring. Adding or removing a node only remaps keys adjacent to that node — unlike modulo hashing (key % N) which remaps almost everything. Virtual nodes (multiple points per physical node) improve load balance. Used in distributed caches (Memcached), databases (Cassandra), and load balancers.

## 32. What is sharding vs partitioning?

Partitioning divides data into subsets within one database (horizontal partitioning by key range or hash). Sharding distributes partitions across multiple independent database instances (shards). All sharding involves partitioning, but not all partitioning is sharding. Sharding enables horizontal write scaling beyond single-node limits. Challenges: cross-shard queries, rebalancing, and hot shards.

## 33. What is a hot shard problem?

A hot shard occurs when one shard receives disproportionate traffic because its key range includes a popular entity (celebrity user, viral product, global counter). That shard becomes a bottleneck while others sit idle. Mitigations: salt hot keys (append random suffix to spread writes), separate hot data to dedicated infrastructure, use local cache in front of hot shard, or redesign key distribution.

## 34. What is clock synchronization and why does it matter?

Computers have independent clocks that drift apart. Distributed systems use Network Time Protocol (NTP) or Precision Time Protocol (PTP) to align timestamps. Matters for conflict resolution (last-write-wins), event ordering, and debugging. Google Spanner uses TrueTime (GPS plus atomic clocks) for globally consistent timestamps. Never assume perfect clock sync — design for clock skew.

## 35. What is a Lamport timestamp?

A Lamport timestamp is a logical clock: each node has a counter incremented before each event; on receiving a message, set counter to max(local, received) + 1. If event A's timestamp is less than B's, A might have happened before B (but not guaranteed if concurrent). Establishes partial ordering without physical clocks. Foundation for vector clocks and distributed debugging.

## 36. What is Byzantine fault tolerance?

Byzantine fault tolerance (BFT) handles nodes that behave arbitrarily — lying, corrupting data, or acting maliciously — not just crashing. Requires 3f+1 nodes to tolerate f Byzantine failures. Used in blockchain consensus (Proof of Work, Practical Byzantine Fault Tolerance — PBFT) and critical infrastructure. Most business systems assume crash-stop failures only, which requires only 2f+1 nodes.

## 37. What is a distributed lock and how is it implemented?

A distributed lock ensures only one process accesses a shared resource at a time across multiple nodes. Implementations: Redis SET NX with expiry, Apache ZooKeeper ephemeral sequential nodes, etcd leases. Must handle lock holder crashes (use Time To Live expiry), clock skew (use fencing tokens), and network partitions (require quorum). Redlock algorithm for Redis is debated — prefer etcd or ZooKeeper for correctness-critical locks.

## 38. What is Apache ZooKeeper used for?

Apache ZooKeeper is a coordination service providing a hierarchical key-value store with strong consistency, ephemeral nodes, and watches. Used for leader election, distributed locks, configuration management, and service discovery. Clients maintain sessions; ephemeral nodes disappear on session expiry (detect failures). Apache Kafka historically used ZooKeeper; modern Kafka uses KRaft (Kafka Raft) mode instead.

## 39. What is etcd?

etcd is a distributed key-value store using the Raft consensus algorithm, developed by CoreOS (now Red Hat). Kubernetes uses etcd as its backing store for all cluster state (pods, services, configs). Provides strong consistency, watch notifications, and lease-based Time To Live (TTL). Simpler than ZooKeeper for cloud-native systems. Always run etcd with odd-numbered node count for quorum.

## 40. What is the difference between horizontal and vertical partitioning?

Vertical partitioning splits a table by columns — frequently accessed columns in one partition, rarely accessed in another (reduces input/output). Horizontal partitioning splits by rows using a partition key (user ID, date range) — enables sharding across machines. Horizontal partitioning is what people usually mean by sharding. Choose partition key based on query patterns to avoid cross-partition joins.

## 41. What is read repair?

Read repair is a consistency mechanism in leaderless systems: during a read, if replicas return different versions, the coordinator writes the latest version back to stale replicas before returning to the client. Keeps replicas converging without a dedicated repair process. Amazon DynamoDB and Apache Cassandra use read repair alongside hinted handoff and anti-entropy to maintain consistency.

## 42. What is anti-entropy in distributed systems?

Anti-entropy is a background process that compares and synchronizes data between replicas to fix divergence. Apache Cassandra runs Merkle tree comparisons between nodes — if hashes differ, exchange differing data ranges. Runs periodically (not on every read). Complements read repair and hinted handoff. Essential for long-term consistency in eventually consistent systems.

## 43. What is a Merkle tree in replication?

A Merkle tree is a hash tree where leaf nodes are hashes of data blocks and parent nodes are hashes of their children. Comparing root hashes quickly detects if two replicas differ; if different, compare child hashes to pinpoint differing ranges without transferring all data. Used in anti-entropy repair (Cassandra, Bitcoin) and peer-to-peer file systems (BitTorrent, InterPlanetary File System).

## 44. What is the difference between failover and switchover?

Switchover is a planned transfer of primary role to another node (maintenance, upgrades) — controlled and graceful. Failover is unplanned transfer due to primary failure — automatic detection and promotion. Failover risks: data loss (async replication), split-brain (without quorum), and brief unavailability during election. Design for automatic failover with health checks and odd-numbered quorum nodes.

## 45. What is a distributed tracing span?

A span represents a single unit of work in a distributed trace (one service call, one database query). Spans have a trace ID (shared across the request), span ID, parent span ID, start/end timestamps, and metadata (service name, status). Spans form a tree showing the full request path. Tools: Jaeger, Zipkin, Amazon Web Services X-Ray. Essential for debugging latency in microservices.

## 46. What is the circuit breaker pattern in distributed systems?

The circuit breaker prevents cascade failures by stopping calls to a failing downstream service. States: Closed (normal), Open (fail fast after threshold failures), Half-Open (allow probe requests to test recovery). Returns fallback response when open. Libraries: Resilience4j, Istio service mesh. Pair with timeouts, retries with backoff, and bulkheads for resilient distributed systems.

## 47. What is the bulkhead pattern?

The bulkhead pattern isolates resources so failure in one area does not exhaust shared resources. Named after ship compartments that contain flooding. Example: separate thread pools for payment service calls vs search service calls — if search is slow, payment still has dedicated threads. In Kubernetes, separate deployments and resource limits per service achieve bulkhead isolation.

## 48. What is backpressure in distributed systems?

Backpressure is a flow control mechanism where a downstream component signals upstream to slow down when overwhelmed. Without backpressure, buffers overflow and systems crash. Implementations: bounded queues that reject when full, rate limiting, and reactive streams (Project Reactor, Akka). Apache Kafka consumers control backpressure via fetch rate and processing speed; slow consumers increase consumer lag.

## 49. What is the difference between orchestration and choreography?

Orchestration has a central coordinator directing each service step-by-step (saga orchestrator, workflow engine like Temporal). Choreography has services react to events independently without a central brain (OrderCreated event → payment service, inventory service each act). Orchestration: easier to monitor and debug. Choreography: looser coupling, no single point of failure. Many systems combine both.

## 50. How do you test distributed systems?

Test at multiple levels: unit tests for individual components; integration tests with real message queues and databases; chaos engineering (deliberately kill nodes, inject latency with tools like Chaos Monkey, Litmus); property-based testing for consensus invariants; load testing for partition behavior under stress. Use deterministic simulation (Jepsen framework) to find consistency bugs. Monitor production with synthetic transactions and alerting on anomaly patterns.
