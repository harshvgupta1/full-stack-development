"""LLD and System Design Q&A data for generate_banks.py."""

lld = [
    ("What is Low Level Design (LLD)?",
     "Low Level Design is the process of designing the internal structure of a software system at the class and object level. "
     "It focuses on how individual components interact, which classes to create, which design patterns to apply, and how to "
     "follow Object-Oriented Programming (OOP) principles. In product company interviews, LLD tests whether you can turn "
     "a vague requirement like 'design a parking lot' into clean, extensible code."),
    ("What are the four pillars of Object-Oriented Programming (OOP)?",
     "The four pillars are: **Encapsulation** (hiding internal state behind methods), **Abstraction** (showing only essential "
     "details), **Inheritance** (reusing behavior from parent classes), and **Polymorphism** (same interface, different "
     "implementations). Together they help you model real-world entities and write maintainable code."),
    ("What is encapsulation and why does it matter in LLD interviews?",
     "Encapsulation means bundling data and the methods that operate on that data inside a class, and restricting direct access "
     "to fields (usually via private/protected modifiers and public getters/setters). It prevents callers from putting objects "
     "into invalid states. In a parking lot design, a `Spot` class should not let external code set `isOccupied = true` without "
     "going through a `park(Vehicle)` method that validates availability."),
    ("What is abstraction in OOP?",
     "Abstraction hides complex implementation details and exposes only what the caller needs. For example, a `PaymentProcessor` "
     "interface might expose `charge(amount)` while hiding whether the backend uses Stripe, Razorpay, or a mock gateway. "
     "Abstraction reduces coupling and makes systems easier to test and extend."),
    ("Explain inheritance with a real LLD example.",
     "Inheritance lets a child class reuse and extend a parent class. In a parking lot, you might have a base `Vehicle` class "
     "with `licensePlate` and `size`, and subclasses `Car`, `Motorcycle`, and `Truck` that override `getSpotType()`. "
     "This avoids duplicating common logic while allowing type-specific behavior."),
    ("What is polymorphism and how is it used in design?",
     "Polymorphism means 'many forms.' A parent type reference can point to any child object, and the correct method runs at "
     "runtime (dynamic dispatch). Example: `List<Vehicle> vehicles` where each vehicle's `getSpotType()` returns different "
     "values. Polymorphism enables open/closed design—you add new vehicle types without changing existing parking logic."),
    ("What is composition over inheritance?",
     "Composition means building behavior by combining objects ('has-a') rather than extending classes ('is-a'). "
     "A `ParkingLot` **has** a `PricingStrategy` and a `SpotAllocator`, instead of inheriting from them. "
     "Composition is preferred because deep inheritance hierarchies become rigid and fragile; composition allows swapping "
     "behavior at runtime."),
    ("What does SOLID stand for?",
     "SOLID is five design principles: **S**ingle Responsibility, **O**pen/Closed, **L**iskov Substitution, "
     "**I**nterface Segregation, and **D**ependency Inversion. They guide you toward modular, testable, and extensible designs. "
     "Interviewers expect you to mention relevant SOLID principles while designing classes."),
    ("Explain the Single Responsibility Principle (SRP).",
     "SRP states that a class should have only one reason to change. Example: `InvoiceGenerator` creates PDF invoices; "
     "`PaymentService` processes payments. Mixing both in one class means a change to PDF formatting also risks breaking "
     "payment logic. In LLD, split responsibilities into focused classes."),
    ("Explain the Open/Closed Principle (OCP).",
     "OCP says software entities should be open for extension but closed for modification. Add new behavior via new classes "
     "or strategies, not by editing existing code. Example: add `PremiumPricingStrategy` without changing `ParkingLot`—inject "
     "the strategy through an interface."),
    ("Explain the Liskov Substitution Principle (LSP).",
     "LSP says subtypes must be substitutable for their base types without breaking correctness. If `Square` extends `Rectangle` "
     "but changing width does not update height consistently, callers expecting rectangle behavior will break. "
     "In LLD, ensure subclasses honor the contract of the parent interface."),
    ("Explain the Interface Segregation Principle (ISP).",
     "ISP means clients should not depend on interfaces they do not use. Instead of one fat `Worker` interface with "
     "`code()`, `manage()`, and `clean()`, split into `Developer`, `Manager`, and `Janitor` interfaces. "
     "This keeps implementations lean and avoids empty stub methods."),
    ("Explain the Dependency Inversion Principle (DIP).",
     "DIP says high-level modules should not depend on low-level modules; both should depend on abstractions. "
     "A `BookingService` should depend on a `PaymentGateway` interface, not on `StripePayment` directly. "
     "This enables swapping implementations and simplifies unit testing with mocks."),
    ("What is a design pattern?",
     "A design pattern is a reusable solution to a commonly occurring problem in software design. Patterns are not copy-paste "
     "code—they are templates for structure and communication between objects. Common categories: Creational, Structural, and "
     "Behavioral. Interviewers want you to recognize when a pattern fits, not force one everywhere."),
    ("Explain the Singleton pattern. When should you avoid it?",
     "Singleton ensures only one instance of a class exists (e.g., a configuration manager). Implementation uses a private "
     "constructor and a static `getInstance()` method. Avoid Singleton in interviews unless truly needed—it hides dependencies, "
     "complicates testing, and can cause thread-safety issues. Prefer dependency injection instead."),
    ("Explain the Factory Method pattern.",
     "Factory Method defines an interface for creating objects but lets subclasses decide which class to instantiate. "
     "Example: `VehicleFactory.create(type)` returns `Car`, `Bike`, or `Truck`. Callers depend on the factory interface, "
     "not concrete constructors. Useful when object creation logic is complex or varies by input."),
    ("Explain the Abstract Factory pattern.",
     "Abstract Factory provides an interface for creating families of related objects without specifying concrete classes. "
     "Example: `UIFactory` creates matching `Button` and `Dialog` for Windows vs Mac. Different from Factory Method, which "
     "creates one product; Abstract Factory creates a coordinated set."),
    ("Explain the Builder pattern.",
     "Builder separates construction of a complex object from its representation. Example: `Pizza.Builder().crust('thin')"
     ".topping('pepperoni').build()`. Useful when an object has many optional parameters—cleaner than telescoping constructors. "
     "Common in machine coding for entities with many fields."),
    ("Explain the Strategy pattern.",
     "Strategy defines a family of algorithms, encapsulates each one, and makes them interchangeable. "
     "Example: `PricingStrategy` with `HourlyPricing`, `FlatRatePricing`, and `WeekendPricing`. "
     "The context (`ParkingLot`) delegates pricing to the injected strategy. This is one of the most useful patterns in LLD."),
    ("Explain the Observer pattern.",
     "Observer defines a one-to-many dependency: when one object changes state, all dependents are notified. "
     "Example: `OrderStatus` notifies `EmailNotifier`, `SMSNotifier`, and `InventoryService` when status changes. "
     "Foundation for event-driven UI and pub/sub systems."),
    ("Explain the Decorator pattern.",
     "Decorator attaches additional responsibilities to an object dynamically without subclassing. "
     "Example: `BufferedInputStream` wraps `FileInputStream` to add buffering. In application code, wrap a base service "
     "with `LoggingService` or `CachingService` decorators."),
    ("Explain the Adapter pattern.",
     "Adapter converts the interface of a class into another interface clients expect. "
     "Example: your app expects `PaymentGateway.charge()`, but a third-party library exposes `processPayment()`. "
     "An adapter wraps the library and exposes your interface. Common when integrating legacy or external APIs."),
    ("Explain the Facade pattern.",
     "Facade provides a simplified interface to a complex subsystem. Example: `BookingFacade.bookTicket()` internally calls "
     "seat selection, payment, notification, and inventory modules. Clients interact with one entry point instead of many services."),
    ("Explain the Command pattern.",
     "Command encapsulates a request as an object, enabling undo, queuing, and logging. "
     "Example: text editor commands `CopyCommand`, `PasteCommand`, `UndoCommand` each implement `execute()` and `undo()`. "
     "Useful in machine coding when actions must be reversible or scheduled."),
    ("What is an Enum and when is it better than constants?",
     "An Enum (enumeration) is a type-safe set of named constants. `enum SpotType { COMPACT, LARGE, HANDICAPPED }` is safer "
     "than string constants because the compiler catches typos and you can attach methods to enum values. "
     "Use enums for fixed, known sets like status, vehicle type, or payment mode."),
    ("How do you design a Parking Lot system in LLD?",
     "Identify entities: `ParkingLot`, `Level`, `ParkingSpot`, `Vehicle`, `Ticket`, `Payment`. "
     "Define relationships: a lot has many levels; each level has spots; spots hold one vehicle. "
     "Core operations: `park(vehicle)`, `unpark(ticketId)`, `getAvailableSpots(type)`. "
     "Apply Strategy for pricing, Factory for vehicle/spot types, and Singleton sparingly for lot configuration. "
     "Discuss concurrency if multiple entry gates exist."),
    ("How do you handle different vehicle sizes in a parking lot design?",
     "Model `VehicleSize` enum (SMALL, MEDIUM, LARGE). Spots are typed—compact spots fit motorcycles and small cars; "
     "large spots fit trucks. Allocation logic: try exact match first, then next larger spot if policy allows "
     "(e.g., a car may use a large spot but not vice versa). Keep allocation in a dedicated `SpotAllocator` class (SRP)."),
    ("How would you extend a parking lot to support electric vehicle (EV) charging spots?",
     "Add `EVSpot` extending or composing with `ParkingSpot`, adding `chargingPort` and `isCharging`. "
     "Extend allocator to filter EV-capable spots for electric vehicles. Add `ChargingBillingStrategy` for time + energy fees. "
     "OCP: new spot type and strategy without rewriting core parking flow."),
    ("What classes and interfaces would you define for a Rate Limiter?",
     "Core: `RateLimiter` interface with `allowRequest(userId)` returning boolean. "
     "Implementations: `TokenBucketLimiter`, `FixedWindowLimiter`, `SlidingWindowLimiter`. "
     "Supporting: `Clock` (for testability), `Storage` (in-memory map or Redis-backed). "
     "Optional: `RateLimitConfig` with limits per tier. DIP: middleware depends on `RateLimiter`, not a concrete algorithm."),
    ("Explain the Token Bucket algorithm for rate limiting.",
     "Token Bucket maintains a bucket with a maximum capacity and a refill rate (tokens per second). "
     "Each request consumes one token; if the bucket is empty, the request is rejected. "
     "Burst traffic is allowed up to bucket capacity, then rate smooths to refill rate. "
     "Implementation: track `tokens` and `lastRefillTime`; on each request, refill based on elapsed time, then deduct."),
    ("Explain Fixed Window vs Sliding Window rate limiting.",
     "Fixed Window divides time into buckets (e.g., 100 requests per minute starting at :00). Simple but allows bursts "
     "at window boundaries (200 requests in 2 seconds across two windows). "
     "Sliding Window tracks requests in a rolling time frame (e.g., last 60 seconds), smoother but needs more storage "
     "(timestamps or sub-window counters). Sliding Window Log stores each request timestamp; Sliding Window Counter hybridizes."),
    ("How do you design an LRU (Least Recently Used) Cache?",
     "LRU Cache supports `get(key)` and `put(key, value)` in O(1) average time with a capacity limit. "
     "When full, evict the least recently used entry. "
     "Classic structure: HashMap for O(1) lookup + Doubly Linked List for O(1) move-to-front and eviction. "
     "On `get` or `put`, move node to head; evict tail when size exceeds capacity."),
    ("Walk through LRU Cache operations step by step.",
     "`get(key)`: if missing, return -1; if present, move node to head (most recent), return value. "
     "`put(key, value)`: if key exists, update value and move to head; if new and at capacity, remove tail node "
     "and its map entry, then insert new node at head. "
     "Use dummy head/tail sentinel nodes to simplify edge cases. Time: O(1); Space: O(capacity)."),
    ("How would you make LRU Cache thread-safe?",
     "Wrap critical sections with `synchronized` blocks or `ReentrantReadWriteLock` (read lock for get, write lock for put). "
     "Alternatively use `ConcurrentHashMap` plus a lock on list mutations. "
     "For high concurrency, consider segmented caches or lock-free structures—but for interviews, explain trade-offs clearly."),
    ("What is the difference between an interface and an abstract class?",
     "An interface defines a contract (method signatures) with no state; a class can implement multiple interfaces. "
     "An abstract class can have both abstract and concrete methods plus shared fields; a class inherits one abstract class. "
     "Use interfaces for capability contracts (`Payable`, `Serializable`); abstract classes when sharing base implementation "
     "among closely related types."),
    ("What is dependency injection (DI)?",
     "Dependency Injection means providing an object's dependencies from the outside rather than creating them internally. "
     "Constructor injection is preferred: `ParkingLot(pricingStrategy, allocator)`. Benefits: testability (inject mocks), "
     "flexibility (swap implementations), and explicit dependencies. Frameworks like Spring automate DI via annotations."),
    ("What is the difference between aggregation and composition?",
     "Both are 'has-a' relationships. **Aggregation** is a weak relationship—the child can exist independently "
     "(Department has Employees; employees can transfer). **Composition** is strong—the child cannot exist without the parent "
     "(House has Rooms; destroying the house destroys rooms). Composition implies lifecycle ownership."),
    ("How do you identify entities vs value objects in LLD?",
     "Entities have identity that persists over time (User, Order, Ticket)—two orders with same data are still different orders. "
     "Value objects are defined by their attributes (Money, Address, DateRange)—two `$10 USD` values are interchangeable. "
     "Entities get unique IDs; value objects should be immutable."),
    ("What is immutability and why is it useful?",
     "An immutable object's state cannot change after creation. All fields are final, no setters, and nested objects are "
     "defensive copies. Benefits: thread safety without locks, safer sharing, easier reasoning. "
     "Use immutable value objects like `Money`, `Coordinates`, or `TicketSnapshot` in LLD designs."),
    ("How do you handle errors in LLD design?",
     "Define a clear exception hierarchy: `ParkingFullException`, `InvalidTicketException`, `PaymentFailedException`. "
     "Do not use generic exceptions for business cases. Return typed results where appropriate (`Optional<Spot>`, `Result<T, E>`). "
     "Separate validation (input checks) from domain rules (no spot available). Document which methods throw what."),
    ("What is the Template Method pattern?",
     "Template Method defines the skeleton of an algorithm in a base class, letting subclasses override specific steps. "
     "Example: `DataExporter.export()` calls `readData()`, `transform()`, `write()`—subclasses override steps but not the flow. "
     "Useful when multiple processes share the same sequence with varying details."),
    ("What is the State pattern?",
     "State lets an object alter its behavior when its internal state changes, as if the object changed class. "
     "Example: `Order` with states `Placed`, `Shipped`, `Delivered`, `Cancelled`—each state implements `cancel()` differently. "
     "Avoids large if/else chains on status enums."),
    ("How would you design a Library Management System in LLD?",
     "Entities: `Book`, `BookItem` (physical copy with barcode), `Member`, `Lending`, `Reservation`, `Fine`. "
     "Services: `CatalogService`, `LendingService`, `SearchService`. "
     "Operations: search, checkout, return, reserve, calculate fine. "
     "Apply Observer for due-date reminders; Strategy for fine calculation (daily rate vs flat fee)."),
    ("How would you design an Elevator system in LLD?",
     "Entities: `Elevator`, `Floor`, `Request` (external up/down, internal floor button), `ElevatorController`. "
     "Algorithm: SCAN or LOOK for efficient movement. State pattern for elevator direction (UP, DOWN, IDLE). "
     "Controller dispatches requests to nearest idle elevator. Discuss thread safety for concurrent button presses."),
    ("What is an anti-pattern you should avoid in LLD interviews?",
     "God Object: one class that knows and does everything. "
     "Solution: apply SRP and split into services. Also avoid: premature Singleton, deep inheritance trees, "
     "and anemic domain models (data classes with all logic in separate service classes with no behavior in entities)."),
    ("How do you communicate your LLD design in an interview?",
     "Follow: (1) Clarify requirements and scope, (2) Identify nouns → entities, verbs → methods, (3) Draw class diagram "
     "with relationships, (4) Define key interfaces and one happy-path walkthrough, (5) Discuss extensibility and edge cases. "
     "Write clean pseudocode or real code for 2–3 core methods. Ask the interviewer which part to deep-dive."),
    ("What is the difference between LLD and High Level Design (HLD)?",
     "LLD focuses on class-level structure, design patterns, and code organization for a single service or module. "
     "HLD focuses on system-wide architecture: services, databases, APIs, scaling, and data flow across components. "
     "LLD answers 'how does this class work?'; HLD answers 'how do these services talk to each other?'"),
    ("How do you make an LLD design extensible for future features?",
     "Use interfaces for volatile parts (pricing, notification, storage). Favor composition and strategy over conditionals. "
     "Keep domain models rich but services thin. Document extension points explicitly. "
     "Example: adding valet parking means new `ValetService` implementing `ParkingService`, not editing `ParkingLot` internals."),
    ("What testing approach supports good LLD?",
     "Unit test each class in isolation with mocked dependencies. Test domain rules (cannot park in occupied spot), "
     "boundary cases (lot full), and strategy swapping. Dependency injection makes mocking trivial. "
     "Integration tests cover full flows (park → pay → unpark)."),
    ("What are common follow-up questions after a parking lot LLD?",
     "Concurrency at entry gates, handling payment failure mid-session, multi-floor allocation optimization, "
     "display board for available spots, handicap/reserved spots, and scaling to multiple parking lots with a central system. "
     "Be ready to add a `DisplayBoard` Observer or a `LotRegistry` for multi-site management."),
]

sd = [
    ("What is System Design in the context of product company interviews?",
     "System Design is the process of defining architecture for a large-scale application: how users interact with it, "
     "which services and databases you use, how data flows, and how the system handles growth and failures. "
     "Interviewers evaluate your ability to trade off consistency, availability, latency, cost, and complexity."),
    ("What are the key steps in a system design interview?",
     "1) Clarify functional and non-functional requirements. 2) Estimate scale (users, queries per second, storage). "
     "3) Propose High Level Design (APIs, main components). 4) Deep-dive data model and critical paths. "
     "5) Address bottlenecks, scaling, failure modes. 6) Summarize trade-offs. Always think aloud and collaborate."),
    ("How would you design a URL shortener like bit.ly?",
     "Functional: shorten long URL, redirect short URL, optional analytics. "
     "API: `POST /urls {longUrl}` → `{shortUrl}`, `GET /{shortCode}` → 302 redirect. "
     "Generate short code via base-62 encoding of auto-increment ID or hash (handle collisions). "
     "Store mapping in database (SQL or NoSQL). Cache hot URLs in Redis. "
     "Scale reads with replicas and CDN; writes with sharded database. Discuss custom aliases and expiration."),
    ("How do you generate unique short codes for a URL shortener?",
     "Option A: Auto-increment ID encoded in base-62 (a-z, A-Z, 0-9)—guaranteed unique, predictable length growth. "
     "Option B: Random 6–8 character string—check uniqueness in database; retry on collision. "
     "Option C: Hash (MD5/SHA) truncated—risk of collision; use longer codes or salting. "
     "For interviews, base-62 of distributed ID (Snowflake) is a strong answer."),
    ("How would you design Twitter (now X) at a high level?",
     "Core features: post tweet, follow users, home timeline, search. "
     "Services: User Service, Tweet Service, Timeline Service, Search Service, Notification Service. "
     "Write path: tweet saved to Tweet DB, fan-out to followers' timelines (push model) or merged at read (pull model). "
     "Hybrid fan-out for celebrities (millions of followers). Cache timelines in Redis. Use Kafka for async fan-out."),
    ("Explain fan-out on write vs fan-out on read for timelines.",
     "Fan-out on write (push): when user posts, precompute and write tweet ID to each follower's timeline cache—fast reads, "
     "slow/expensive writes for popular users. Fan-out on read (pull): store tweets; at read time merge tweets from "
     "followed users—cheap writes, slower reads. Hybrid: push for normal users, pull for celebrities."),
    ("How would you design Instagram?",
     "Features: upload photo/video, follow, feed, likes, comments, stories. "
     "Upload flow: client → object storage (Amazon S3) via pre-signed URL; metadata in database. "
     "Feed similar to Twitter fan-out. CDN serves images globally. "
     "Separate services for media processing (thumbnails, transcoding), social graph, and notifications."),
    ("What is the difference between SQL and NoSQL for system design?",
     "SQL (Structured Query Language) databases (PostgreSQL, MySQL) offer strong schemas, joins, and ACID transactions—good "
     "for relational data (orders, payments). NoSQL (MongoDB, Cassandra, DynamoDB) offers flexible schemas and horizontal "
     "scaling—good for high write throughput, simple access patterns, or document/key-value models. "
     "Many systems use both (polyglot persistence)."),
    ("When would you choose a document database vs a wide-column store?",
     "Document DB (MongoDB): flexible JSON documents, rich queries, good for user profiles, content catalogs. "
     "Wide-column (Cassandra, HBase): optimized for time-series and high write volume with partition key access—good for "
     "feeds, metrics, message logs. Choose based on access pattern, not hype."),
    ("What is a Content Delivery Network (CDN)?",
     "A CDN is a geographically distributed network of edge servers that cache static content (images, videos, JavaScript, "
     "CSS) close to users. Reduces latency and origin server load. Examples: CloudFront, Cloudflare, Akamai. "
     "Use CDN for media-heavy apps like Instagram and Netflix."),
    ("How do you design APIs for a large system?",
     "Prefer REST for resource-oriented CRUD or GraphQL when clients need flexible field selection. "
     "Define clear endpoints, versioning (`/v1/`), authentication (OAuth 2.0 tokens), rate limiting, and pagination "
     "(cursor-based for large feeds). Use idempotency keys for payment-like operations."),
    ("What is horizontal vs vertical scaling?",
     "Vertical scaling (scale up) adds CPU/RAM to one machine—simple but has limits. "
     "Horizontal scaling (scale out) adds more machines—requires load balancing and distributed data. "
     "Large product systems almost always scale horizontally."),
    ("What is database sharding?",
     "Sharding splits data across multiple database instances by a shard key (e.g., `user_id % N`). "
     "Each shard holds a subset of data. Enables write scalability beyond single-node limits. "
     "Challenges: cross-shard queries, rebalancing, hot shards. Consistent hashing helps minimize data movement on resharding."),
    ("What is replication in databases?",
     "Replication copies data from a primary (leader) node to one or more replica (follower) nodes. "
     "Used for read scaling and high availability. Synchronous replication waits for replica ack—stronger consistency, higher latency. "
     "Asynchronous replication is faster but may lose recent writes on failover."),
    ("What is the CAP theorem?",
     "CAP theorem states that in a network partition, a distributed system must choose between **Consistency** "
     "(all nodes see same data) and **Availability** (every request gets a response). Partition tolerance is mandatory in "
     "distributed systems. In practice you tune consistency vs availability per use case (e.g., strong for payments, "
     "eventual for likes count)."),
    ("What is eventual consistency?",
     "Eventual consistency means if no new updates occur, all replicas will converge to the same value over time. "
     "Acceptable for social likes, view counts, and CDN caches. Unacceptable for bank balances without careful design. "
     "Mitigate with version vectors, conflict resolution, or user-facing 'syncing' indicators."),
    ("How would you design a notification system?",
     "Components: Event Producer (app services) → Message Queue (Kafka) → Notification Service → channels (push, email, SMS). "
     "Store user preferences and device tokens. Template engine for message content. "
     "Rate limit and batch notifications. Retry with dead-letter queue for failures. Scale workers horizontally."),
    ("What is a message queue and why use one?",
     "A message queue (Kafka, RabbitMQ, Amazon Simple Queue Service) decouples producers and consumers. "
     "Benefits: async processing, load leveling, fault tolerance, and independent scaling. "
     "Example: order placed event triggers inventory, shipping, and email services without blocking checkout."),
    ("How would you design a chat application like WhatsApp?",
     "Real-time delivery via WebSockets or long polling. Message Service stores messages; sync on reconnect. "
     "Use sequence numbers per conversation for ordering. Presence service tracks online status. "
     "End-to-end encryption for privacy. Push notifications via Apple Push Notification service / Firebase Cloud Messaging when offline."),
    ("What is WebSocket and when is it used?",
     "WebSocket is a persistent, bidirectional protocol over TCP. Unlike HTTP request/response, server can push data anytime. "
     "Used for chat, live sports scores, collaborative editing, and gaming. "
     "Fallback to Server-Sent Events or long polling if WebSockets blocked by proxies."),
    ("How would you design YouTube or a video streaming platform?",
     "Upload: chunked upload to object storage; transcoding pipeline produces multiple resolutions (240p–4K). "
     "Metadata and comments in database. CDN delivers video segments (HLS/DASH adaptive bitrate). "
     "View counts via async aggregation. Recommendation engine as separate ML pipeline."),
    ("What is rate limiting at the system design level?",
     "Rate limiting protects services from abuse and overload. Implement at API gateway (token bucket per user/IP). "
     "Return HTTP 429 Too Many Requests with Retry-After header. Distributed rate limits need shared store (Redis). "
     "Different tiers for free vs premium users."),
    ("How do you handle authentication in a distributed system?",
     "Use OAuth 2.0 / OpenID Connect: user logs in via identity provider, client gets JWT (JSON Web Token). "
     "Services validate JWT signature and expiry statelessly. Refresh tokens for long sessions. "
     "Store sessions in Redis for revocation. Never store passwords in plain text—use bcrypt/argon2 hashing."),
    ("What is an API Gateway?",
     "An API Gateway is a single entry point for clients routing to backend microservices. Handles authentication, "
     "rate limiting, SSL termination, request routing, and aggregation. Examples: Kong, AWS API Gateway, Nginx. "
     "Simplifies client logic and centralizes cross-cutting concerns."),
    ("How would you design a search system?",
     "Ingest documents into inverted index (Elasticsearch, Apache Solr). Tokenize, stem, remove stop words. "
     "Rank by TF-IDF (Term Frequency-Inverse Document Frequency) or learning-to-rank. "
     "Autocomplete via prefix index (Trie or Elasticsearch completion suggester). "
     "For Twitter, separate hot index for recent tweets and cold storage for archive."),
    ("What is Elasticsearch used for?",
     "Elasticsearch is a distributed search and analytics engine built on Apache Lucene. "
     "Stores JSON documents, supports full-text search, aggregations, and geo queries. "
     "Used for log analytics (ELK stack), product search, and autocomplete. Scale by adding nodes to cluster."),
    ("How do you design for high availability?",
     "Eliminate single points of failure: multi-Availability Zone deployment, load balancers with health checks, "
     "database replication with automatic failover, circuit breakers, graceful degradation (show cached feed if timeline service down). "
     "Target SLA (Service Level Agreement) like 99.9% uptime (~8.7 hours downtime/year)."),
    ("What is a circuit breaker pattern?",
     "Circuit breaker stops calling a failing downstream service after threshold failures, returning fallback quickly. "
     "States: Closed (normal), Open (fail fast), Half-Open (probe recovery). Prevents cascade failures. "
     "Libraries: Resilience4j, Hystrix (legacy). Essential in microservices."),
    ("What is idempotency and why does it matter?",
     "An operation is idempotent if performing it multiple times has the same effect as once. "
     "Critical for retries (network timeouts). Example: payment with idempotency key—duplicate requests do not double-charge. "
     "Implement via unique request ID stored in database before processing."),
    ("How would you design an e-commerce checkout system?",
     "Flow: cart → inventory check → payment → order creation → notification. "
     "Use saga pattern for distributed transaction across inventory, payment, and order services. "
     "Reserve inventory temporarily; release on payment timeout. Strong consistency for payment; async for emails."),
    ("What is the difference between strong and weak consistency?",
     "Strong consistency: after a write, all reads see the latest value immediately (linearizability). "
     "Weak/eventual: reads may return stale data temporarily. "
     "Choose strong for financial ledger; eventual for social metrics. Many databases offer tunable consistency levels."),
    ("How do you estimate storage for a system design question?",
     "Example: 500M users, 2 tweets/user/day, 280 bytes/tweet → 1B tweets/day × 280 B ≈ 280 GB/day raw. "
     "Add indexes (~2×), replicas (3×), media separately. Round up. Show structured math—interviewers care about approach, "
     "not exact numbers."),
    ("How do you estimate queries per second (QPS)?",
     "Daily active users × actions per day / 86400 seconds. Example: 100M daily active users, 50 reads/day → "
     "5B reads/day ≈ 58,000 read QPS average; plan for 3–5× peak. Separate read vs write QPS."),
    ("What is microservices architecture?",
     "Microservices split an application into small, independently deployable services, each owning its data and business logic. "
     "Communicate via HTTP/REST or message queues. Benefits: independent scaling, team autonomy, technology diversity. "
     "Costs: operational complexity, distributed debugging, network latency."),
    ("Monolith vs microservices: when to choose which?",
     "Start with modular monolith for new products—simpler ops, faster iteration. "
     "Extract microservices when teams scale, components need independent scaling, or deployment cycles conflict. "
     "Interview answer: 'I'd start monolith with clear module boundaries, split when metrics justify it.'"),
    ("What is a load balancer and where do you place it?",
     "A load balancer distributes incoming traffic across multiple servers. Layer 4 (transport) routes by IP/port; "
     "Layer 7 (application) routes by URL path or headers. Place between clients and app servers, and between app "
     "and database read replicas. Algorithms: round robin, least connections, consistent hashing for sticky sessions."),
    ("How would you design a ride-sharing app like Uber?",
     "Services: User, Driver, Trip, Matching, Pricing, Payment, Notification. "
     "Real-time location via GPS updates to geospatial index (Redis Geo, PostGIS). "
     "Matching: find nearby available drivers. Surge pricing via demand/supply ratio. "
     "Trip state machine: requested → accepted → in-progress → completed."),
    ("What is geospatial indexing?",
     "Geospatial indexes efficiently query locations within radius or bounding box. "
     "Techniques: Geohash, QuadTree, R-tree. Uber uses H3 hexagonal grid. "
     "Store driver coordinates updated every few seconds; query 'drivers within 2 km of rider'."),
    ("How would you design a file storage system like Dropbox?",
     "Client syncs files via chunked upload (deduplicate chunks by hash—content-addressable storage). "
     "Metadata (file tree, permissions) in SQL; blobs in object storage (S3). "
     "Conflict resolution via versioning or last-write-wins with user notification. "
     "Delta sync sends only changed chunks."),
    ("What is consistent hashing?",
     "Consistent hashing maps keys and nodes to a hash ring. Adding/removing a node only remaps adjacent key range—"
     "unlike modulo hashing which remaps almost all keys. Used for distributed caches, sharding, and load balancing. "
     "Virtual nodes improve load distribution."),
    ("How do you design logging and monitoring?",
     "Centralized logs: app → Fluentd/Logstash → Elasticsearch → Kibana (ELK). "
     "Metrics: Prometheus scrapes endpoints, Grafana dashboards. Tracing: OpenTelemetry/Jaeger for request flow. "
     "Alert on SLI (Service Level Indicator) breaches: error rate, latency p99, saturation."),
    ("What is the difference between latency and throughput?",
     "Latency is time for one request to complete (milliseconds). Throughput is requests handled per second. "
     "Optimizing one can hurt the other. Batch processing increases throughput but adds latency. "
     "Define SLAs (Service Level Agreements) for both (e.g., p99 latency < 200ms, 10K QPS)."),
    ("How would you design a rate-limited public API?",
     "API keys per developer, tiered quotas (1000 req/day free, 1M paid). Enforce at gateway with Redis counters. "
     "Return rate limit headers (`X-RateLimit-Remaining`). Document endpoints, provide SDKs, sandbox environment. "
     "Billing integration for overages."),
    ("What is a bloom filter?",
     "A Bloom filter is a space-efficient probabilistic structure testing set membership. May have false positives "
     "(says maybe present) but never false negatives. Used to avoid unnecessary database lookups "
     "(e.g., 'does this username exist?' or 'is this URL malicious?'). Cannot delete without counting variant."),
    ("How do you prevent the thundering herd problem?",
     "When cache expires, many requests hit database simultaneously. Solutions: probabilistic early expiration, "
     "mutex lock on cache miss (only one thread rebuilds), stale-while-revalidate (serve stale, refresh async), "
     "pre-warm cache before peak events."),
    ("What is database indexing strategy in system design?",
     "Index columns used in WHERE, JOIN, ORDER BY. Composite indexes for multi-column queries (leftmost prefix rule). "
     "Avoid over-indexing—slows writes. Use covering indexes to avoid table lookups. "
     "For feeds, index `(user_id, created_at DESC)`. Explain trade-off: read speed vs write overhead."),
    ("How would you design a news feed ranking system?",
     "Candidate generation (follow graph + trending) → feature extraction (recency, engagement, affinity) → "
     "ML ranker (gradient boosted trees or neural net) → diversity re-ranking. "
     "Train offline on click data; serve online with low latency (<100ms). A/B test ranking changes."),
    ("What questions should you ask the interviewer in system design?",
     "Clarify scale (users, QPS), read/write ratio, latency requirements, consistency needs, geographic distribution, "
     "mobile vs web, and which features are in scope. Asking shows seniority and prevents over-engineering."),
    ("How do you wrap up a system design interview?",
     "Summarize architecture diagram verbally, highlight key trade-offs (push vs pull timeline, SQL vs NoSQL), "
     "mention what you'd monitor, and one future improvement (multi-region, ML personalization). "
     "Leave time for interviewer questions."),
    ("What is caching strategy in system design interviews?",
     "Caching is storing frequently read data in fast storage (Redis, Memcached, or Content Delivery Network) to reduce "
     "database load and latency. Patterns: cache-aside (lazy load on miss), write-through (sync write to cache and DB), "
     "and TTL-based expiration. Always discuss cache invalidation, hot keys, and thundering herd mitigation in interviews."),
]

assert len(lld) == 50, f"lld has {len(lld)} items"
assert len(sd) == 50, f"sd has {len(sd)} items"
