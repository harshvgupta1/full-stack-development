# Microservices, Kafka, and Event-Driven Architecture Interview — 50 Questions

This bank covers microservices architecture, Apache Kafka, message queues, and event-driven design for product company interviews. Spell out abbreviations on first use.

## 1. What is a microservices architecture?

Microservices architecture splits an application into small, independently deployable services, each owning its data and business logic. Services communicate over the network via HTTP/REST (Representational State Transfer) Application Programming Interfaces (APIs) or message queues. Benefits include independent scaling, team autonomy, and technology diversity. Costs include operational complexity, network latency, and distributed debugging challenges.

## 2. What is a monolith vs microservices?

A monolith is a single deployable unit containing all features—simpler to develop, test, and deploy initially. Microservices split features into separate services with independent databases and deployment cycles. Start with a modular monolith; extract microservices when teams scale, components need independent scaling, or deployment conflicts arise. Interview tip: justify your choice with team size and scaling needs.

## 3. What is service discovery?

Service discovery lets services find each other's network locations dynamically without hardcoded URLs. A registry (Consul, Eureka, Kubernetes DNS) tracks healthy instances. Client-side discovery: client queries registry and load-balances. Server-side discovery: load balancer queries registry. Essential in microservices where instances scale up and down constantly.

## 4. What is an API Gateway in microservices?

An API Gateway is a single entry point for external clients routing requests to internal microservices. Handles cross-cutting concerns: authentication, rate limiting, SSL (Secure Sockets Layer) termination, request routing, response aggregation, and protocol translation. Examples: Kong, AWS (Amazon Web Services) API Gateway, Nginx. Prevents clients from needing to know internal service topology.

## 5. What is a message queue?

A message queue is middleware that decouples producers (senders) from consumers (receivers) by buffering messages. Producers publish messages; consumers pull or receive pushed messages asynchronously. Benefits: load leveling, fault tolerance (messages persist if consumer is down), and independent scaling. Examples: Apache Kafka, RabbitMQ, Amazon Simple Queue Service (SQS).

## 6. What is Apache Kafka?

Apache Kafka is a distributed event streaming platform designed for high-throughput, fault-tolerant, real-time data pipelines. Messages are stored in append-only logs (topics) partitioned across brokers. Producers write; consumers read at their own pace. Used for event sourcing, log aggregation, stream processing, and microservice communication. Handles millions of messages per second.

## 7. What is a Kafka topic?

A Kafka topic is a named category or feed where messages (records) are published. Topics are divided into partitions for parallelism. Example topics: `order-events`, `user-signups`, `payment-completed`. Producers write to topics; consumers subscribe to topics. Topics are configured with retention period, replication factor, and partition count.

## 8. What is a Kafka partition?

A Kafka partition is an ordered, immutable sequence of messages within a topic. Partitions enable parallelism—multiple consumers in a group each read different partitions. Messages within a partition are strictly ordered; ordering across partitions is not guaranteed. Choose partition key (e.g., user ID) to keep related messages in the same partition for ordering.

## 9. What is a Kafka broker?

A Kafka broker is a server that stores topic partitions and serves producer/consumer requests. A Kafka cluster consists of multiple brokers for fault tolerance. Each partition has one leader broker (handles reads/writes) and zero or more follower brokers (replicate data). Brokers coordinate via Apache ZooKeeper (legacy) or KRaft (Kafka Raft) for metadata management.

## 10. What is a Kafka producer?

A Kafka producer is a client application that publishes messages to Kafka topics. Producers choose which partition to write to (by key hash or round-robin). They can configure acknowledgment level (acks=0 fire-and-forget, acks=1 leader only, acks=all all in-sync replicas). Idempotent producers prevent duplicate messages on retry using sequence numbers.

## 11. What is a Kafka consumer?

A Kafka consumer is a client application that reads messages from Kafka topics. Consumers track their read position via offsets. They can read from the beginning, latest, or a specific offset. Consumers subscribe to one or more topics and process messages at their own pace—decoupling processing speed from production speed.

## 12. What is a consumer group in Kafka?

A consumer group is a set of consumers that jointly consume a topic, with each partition assigned to exactly one consumer in the group. Enables horizontal scaling: add consumers to handle more partitions. If consumers exceed partitions, extras sit idle. Rebalance occurs when consumers join or leave. Different consumer groups independently read the same topic.

## 13. What is Kafka offset?

An offset is a sequential identifier (position) of a message within a partition. Consumers commit offsets to track progress—on restart, they resume from the last committed offset. Offsets are stored in an internal Kafka topic (`__consumer_offsets`) or externally (database). Uncommitted offsets mean reprocessing on failure (at-least-once semantics).

## 14. What is auto-commit vs manual commit for offsets?

Auto-commit periodically commits offsets in the background—simple but may commit before processing completes (message loss on crash) or after failure (duplicate processing). Manual commit lets you commit only after successful processing—enables at-least-once or effectively exactly-once with idempotent handlers. Prefer manual commit for critical business logic like payments.

## 15. What is Kafka replication factor?

Replication factor is the number of copies of each partition across brokers. Factor 3 means each partition has 1 leader + 2 followers. Higher replication improves fault tolerance but uses more storage. If a broker dies, a follower is promoted to leader. Set replication factor ≥ 3 in production for availability.

## 16. What is in-sync replicas (ISR) in Kafka?

In-sync replicas (ISR) are follower replicas that are fully caught up with the leader. Only ISR members can become leader on failover. If a follower falls too far behind, it is removed from ISR until it catches up. Producers with `acks=all` wait for all ISR members to acknowledge—balances durability vs latency.

## 17. What is Kafka retention policy?

Retention policy controls how long messages are kept. Time-based: delete after N days (default 7 days). Size-based: delete when partition exceeds size limit. Log compaction: keep only the latest message per key (for changelog topics). Configure per topic based on use case—event sourcing needs longer retention; transient notifications need shorter.

## 18. What is log compaction in Kafka?

Log compaction retains only the latest value for each key in a topic, deleting older versions. Useful for changelog topics where only the current state matters (user profile updates, database Change Data Capture). Combined with time retention: compacted segments kept forever (per key), non-compacted data deleted after retention period.

## 19. What is event-driven architecture (EDA)?

Event-driven architecture (EDA) is a design pattern where services communicate by producing and consuming events (notifications of state changes) rather than direct synchronous calls. A service publishes an event when something happens; interested services react asynchronously. Benefits: loose coupling, scalability, and resilience. Foundation for microservices at companies like Netflix, Uber, and LinkedIn.

## 20. What is an event vs a command vs a query?

An event (past tense: `OrderPlaced`) announces something that already happened—multiple subscribers react. A command (imperative: `PlaceOrder`) requests an action—one handler executes it. A query (question: `GetOrderStatus`) requests data—read-only, no side effects. Command Query Responsibility Segregation (CQRS) separates commands and queries. Events enable choreography; commands enable orchestration.

## 21. What is event sourcing?

Event sourcing stores state changes as a sequence of events rather than overwriting current state. Current state is rebuilt by replaying events. Example: bank account balance computed from all deposit/withdrawal events. Benefits: complete audit trail, temporal queries (state at any point), and easy event replay. Often paired with Apache Kafka as the event store.

## 22. What is Change Data Capture (CDC)?

Change Data Capture (CDC) tracks and streams database changes (inserts, updates, deletes) to other systems in real time. Tools: Debezium (reads database transaction logs), AWS Database Migration Service. Use cases: sync read replicas, feed search indexes, trigger microservice events. CDC turns a database into an event source without modifying application code.

## 23. What is RabbitMQ vs Kafka?

RabbitMQ is a traditional message broker—messages deleted after consumption, push-based delivery, flexible routing (exchanges, queues). Good for task queues and request-reply patterns. Kafka is a distributed log—messages retained for configurable period, pull-based consumption, high throughput. Good for event streaming, log aggregation, and replay. Choose RabbitMQ for job queues; Kafka for event streams.

## 24. What is Amazon SQS vs Kafka?

Amazon Simple Queue Service (SQS) is a fully managed queue service—messages deleted after processing, no replay, simpler operations. Kafka is self-managed (or Amazon Managed Streaming for Apache Kafka—MSK) with log retention, replay, and stream processing. SQS suits simple async tasks; Kafka suits event-driven architectures needing replay, ordering, and high throughput.

## 25. What is a dead letter queue (DLQ)?

A dead letter queue (DLQ) stores messages that failed processing after maximum retry attempts. Prevents poison messages (malformed or causing crashes) from blocking the main queue. Operators inspect DLQ to diagnose issues, fix bugs, and replay messages. Configure in Kafka (dead letter topic), RabbitMQ, and Amazon SQS. Essential for production reliability.

## 26. What is the outbox pattern?

The outbox pattern ensures reliable event publishing alongside database writes. Instead of publishing to Kafka directly (which can fail after DB commit), write the event to an outbox table in the same database transaction. A separate relay process reads the outbox and publishes to Kafka, marking entries as sent. Guarantees at-least-once event delivery without dual-write problems.

## 27. What is the inbox pattern?

The inbox pattern ensures idempotent message processing in microservices. Store incoming message IDs in an inbox table; before processing, check if the ID already exists—if yes, skip (duplicate). Process the message and record the ID atomically in one transaction. Prevents duplicate side effects from at-least-once message delivery. Pair with the outbox pattern for end-to-end reliability.

## 28. What is Kafka Connect?

Kafka Connect is a framework for streaming data between Apache Kafka and external systems (databases, object storage, search engines). Source connectors ingest data into Kafka; sink connectors export Kafka data to external systems. Pre-built connectors for PostgreSQL, MySQL, Elasticsearch, Amazon S3. Runs as a distributed, scalable service. Simplifies integration without custom producer/consumer code.

## 29. What is Kafka Streams?

Kafka Streams is a Java library for building real-time stream processing applications on top of Kafka. Processes messages as they arrive—filtering, aggregating, joining streams, windowing. Stateful processing with local RocksDB storage and changelog topics for fault tolerance. Alternative to Apache Flink or Apache Spark Streaming for Kafka-native stream processing.

## 30. What is ksqlDB?

ksqlDB is a streaming SQL engine for Apache Kafka. Write SQL queries to filter, transform, and aggregate Kafka topic streams in real time. Creates new topics from query results. Lowers barrier for stream processing—analysts and backend engineers use familiar SQL syntax. Built on Kafka Streams under the hood. Good for real-time dashboards and alerting.

## 31. What is schema registry?

Schema registry (Confluent Schema Registry) stores and validates schemas (Avro, Protobuf, JSON Schema) for Kafka message formats. Producers register schemas; consumers fetch schemas to deserialize. Enforces compatibility rules (backward, forward, full) so schema evolution does not break consumers. Prevents unstructured JSON chaos in large Kafka deployments.

## 32. What is Avro vs JSON for Kafka messages?

JSON (JavaScript Object Notation) is human-readable but verbose and lacks schema enforcement—schema drift breaks consumers silently. Avro is a compact binary format with embedded schema IDs and strong schema evolution support via schema registry. Avro reduces message size 30-50% and prevents incompatible changes. Use Avro or Protobuf in production; JSON for prototyping.

## 33. What is backpressure in message queues?

Backpressure occurs when consumers cannot keep up with producers, causing queue depth to grow unboundedly. Without backpressure, memory exhaustion and message loss occur. Solutions: bounded queues with rejection, consumer rate limiting, Kafka consumer pause/resume, and monitoring consumer lag. Design consumers to scale horizontally with partition count.

## 34. What is consumer lag in Kafka?

Consumer lag is the difference between the latest message offset in a partition and the consumer's committed offset—how far behind the consumer is. High lag indicates slow processing or insufficient consumers. Monitor lag per partition; alert when lag exceeds threshold. Scale consumers (up to partition count) or optimize processing to reduce lag.

## 35. What is a rebalance in Kafka?

Rebalance is the process of redistributing partition assignments among consumer group members when consumers join, leave, or crash. During rebalance, consumption pauses (stop-the-world). Frequent rebalances hurt throughput. Mitigate with static membership, cooperative rebalancing (incremental assignors), and stable consumer count matching partition count.

## 36. What is the strangler fig pattern?

The strangler fig pattern gradually replaces a monolith by building new microservices around it, routing increasing traffic to new services until the monolith can be retired. Named after strangler fig vines that gradually envelop a tree. Reduces big-bang migration risk. Use an API Gateway to route traffic: old endpoints to monolith, new endpoints to microservices.

## 37. What is the backend for frontend (BFF) pattern?

Backend for Frontend (BFF) creates separate API layers tailored to each client type (web, mobile, admin). Each BFF aggregates calls to internal microservices and shapes responses for its client. Prevents a single generic API from being too coarse for mobile or too verbose for web. Netflix and Spotify use BFF patterns extensively.

## 38. What is synchronous vs asynchronous communication in microservices?

Synchronous (HTTP/gRPC—Google Remote Procedure Call): caller waits for response—simple but creates coupling and cascade failures. Asynchronous (message queue): caller publishes event and continues—decoupled but harder to debug. Use sync for queries needing immediate answers; async for events, notifications, and long-running processes. Most systems combine both.

## 39. What is gRPC and when to use it over REST?

gRPC (Google Remote Procedure Call) uses Protocol Buffers for compact binary serialization and HTTP/2 for multiplexed connections. Supports streaming (client, server, bidirectional). Faster and more efficient than REST/JSON for service-to-service communication. Use gRPC for internal microservice calls; REST for public APIs where browser compatibility and human readability matter.

## 40. What is a circuit breaker in microservices?

A circuit breaker stops calling a failing downstream microservice after a threshold of failures, returning a fallback response immediately. Prevents cascade failures where one slow service brings down the entire system. States: Closed (normal), Open (fail fast), Half-Open (test recovery). Implement with Resilience4j, Istio service mesh, or API Gateway policies.

## 41. What is service mesh?

A service mesh is infrastructure layer handling service-to-service communication: load balancing, mutual TLS (Transport Layer Security) encryption, retries, circuit breaking, and observability. Sidecar proxies (Envoy) deployed alongside each service intercept traffic. Control plane (Istio, Linkerd) configures policies. Offloads cross-cutting concerns from application code. Useful when you have 20+ microservices.

## 42. What is domain-driven design (DDD) in microservices?

Domain-Driven Design (DDD) models software around business domains using bounded contexts—each microservice maps to one bounded context with its own ubiquitous language, data model, and team. Example: Order context, Payment context, Shipping context. Prevents shared databases and unclear service boundaries. Eric Evans' book is the foundational reference.

## 43. What is the saga pattern with Kafka?

Implement sagas using Kafka events: each step publishes a success event that triggers the next step; failure events trigger compensating actions. Orchestration: a saga manager consumes events and publishes commands. Choreography: services react to each other's events directly. Kafka's durability and replay make it ideal for saga event logs. Use dead letter topics for failed saga steps.

## 44. What is CQRS (Command Query Responsibility Segregation)?

Command Query Responsibility Segregation (CQRS) separates write operations (commands that change state) from read operations (queries that return data). Write model optimized for consistency; read model optimized for query patterns (denormalized views). Models sync via events. Useful when read and write patterns differ significantly—e.g., write to PostgreSQL, read from Elasticsearch.

## 45. What is eventual consistency in microservices?

Eventual consistency means that after a write in one microservice, other services' read models will converge to the updated state over time—not instantly. Acceptable for search indexes, analytics, and notification systems. Unacceptable for payment balances without careful design. Mitigate with user-facing indicators ("Processing..."), version numbers, and read-your-writes routing.

## 46. What is idempotent consumer design?

Idempotent consumers produce the same result whether a message is processed once or multiple times. Implement by storing processed message IDs (inbox pattern), using natural idempotency (setting status to SHIPPED twice is harmless), or conditional updates (UPDATE WHERE status = 'PENDING'). Required because Kafka guarantees at-least-once delivery with retries.

## 47. What is Kafka security?

Kafka security has three layers: Authentication (who are you?)—SSL certificates, SASL (Simple Authentication and Security Layer) mechanisms. Authorization (what can you do?)—Access Control Lists (ACLs) per topic. Encryption—TLS for data in transit, optional at-rest encryption. Enable all three in production. Amazon MSK integrates with AWS IAM (Identity and Access Management).

## 48. What is MSK (Managed Streaming for Kafka)?

Amazon Managed Streaming for Apache Kafka (MSK) is AWS's fully managed Kafka service. AWS handles broker provisioning, patching, and replacement. Supports standard Kafka APIs—migrate existing applications without code changes. Integrates with AWS VPC (Virtual Private Cloud), IAM, CloudWatch monitoring, and MSK Connect. Reduces operational burden vs self-managed Kafka clusters.

## 49. How do you monitor Kafka in production?

Monitor: consumer lag (per group, per partition), broker disk usage, under-replicated partitions, request rate and latency, active controller count, and offline partitions. Tools: Kafka Manager, Confluent Control Center, Prometheus + Grafana, AWS CloudWatch for MSK. Alert on lag spikes, broker failures, and ISR shrinkage. Run synthetic produce/consume health checks.

## 50. Summarize Kafka and microservices interview checklist?

Cover: why microservices (team scale, independent deploy), communication patterns (sync vs async), Kafka fundamentals (topic, partition, consumer group, offset), reliability patterns (outbox, inbox, idempotent consumer, DLQ), saga for distributed transactions, observability (consumer lag, tracing), and when NOT to use microservices (small team, early product). Draw architecture diagrams and discuss trade-offs confidently.
