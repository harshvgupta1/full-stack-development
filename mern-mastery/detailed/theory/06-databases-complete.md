# Databases — MongoDB, PostgreSQL, MySQL & Redis Complete Guide

<!-- SCHEDULE-BANNER-START -->
> **📅 Study window:** 26 Oct 2026 – 8 Nov 2026 (Days 71–84)
> **⏰ Your slots (IST):** Mon–Fri **7:30–8:30pm** & **9:00–10:00pm** · Sat–Sun **9:00am–12:00pm**, **3:00–5:30pm**, **6:00–8:30pm**
> **📧 Calendar reminders:** harsh.gupta@getreelax.com — import `calendar/mern-mastery-study.ics`
<!-- SCHEDULE-BANNER-END -->

> **Goal:** Master database design for MERN production stacks — MongoDB, PostgreSQL, **MySQL**, Redis, Mongoose, Prisma, SQL, transactions, indexing, and choosing the right database.

---

## Table of Contents

1. [SQL vs NoSQL — When to Use What](#1-sql-vs-nosql--when-to-use-what)
2. [CAP Theorem & ACID vs BASE](#2-cap-theorem--acid-vs-base)
3. [MongoDB Deep Dive](#3-mongodb-deep-dive)
4. [Mongoose ODM](#4-mongoose-odm)
5. [PostgreSQL Deep Dive](#5-postgresql-deep-dive)
6. [MySQL Deep Dive](#6-mysql-deep-dive)
7. [Prisma ORM](#7-prisma-orm)
8. [SQL Joins & Queries](#8-sql-joins--queries)
9. [Transactions](#9-transactions)
10. [Indexing Strategies](#10-indexing-strategies)
11. [Aggregation & Analytics](#11-aggregation--analytics)
12. [Redis Caching Patterns](#12-redis-caching-patterns)
13. [Database Architecture Patterns](#13-database-architecture-patterns)
14. [Interview Q&A](#14-interview-qa)
15. [Practice Links & Resources](#15-practice-links--resources)

---

## 1. SQL vs NoSQL — When to Use What

### High-Level Comparison

| Factor | PostgreSQL (SQL) | MySQL (SQL) | MongoDB (NoSQL) | Redis (In-Memory) |
|--------|------------------|-------------|-----------------|-------------------|
| Data model | Tables, rows, columns | Tables, rows, columns | Documents (BSON) | Key-value, lists, sets |
| Schema | Fixed, enforced | Fixed, enforced | Flexible, optional | Schema-less |
| Relations | JOINs, foreign keys | JOINs, foreign keys | Embed or reference | No relations |
| Transactions | Full ACID | Full ACID (InnoDB) | Multi-doc ACID (v4+) | Limited (MULTI/EXEC) |
| Query language | SQL | SQL | MongoDB Query API | Commands |
| Scale | Vertical + read replicas | Vertical + read replicas + Vitess | Horizontal sharding | Cluster, replication |
| Best for | Finance, GIS, complex queries | High-read web apps, e-commerce | Content, catalogs, logs | Cache, sessions, queues |
| Used at | Goldman, Stripe, Instagram | Flipkart, Uber, Airbnb, Netflix | SaaS, real-time apps | Everywhere (cache) |

### Decision Matrix

| Requirement | Choose |
|-------------|--------|
| Complex joins, window functions, JSONB | PostgreSQL |
| Massive read-heavy web traffic, simple schema | **MySQL** |
| Team already on LAMP/MEAN with MySQL | **MySQL** |
| AWS RDS default familiarity | PostgreSQL or MySQL (both on RDS) |
| Flexible/evolving schema | MongoDB |
| Strong consistency + advanced analytics | PostgreSQL |
| High write throughput, time-series | MongoDB |
| Sub-millisecond reads | Redis |
| Session storage, rate limiting | Redis |

### Polyglot Persistence (Production Pattern)

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌─────────────┐
│ PostgreSQL  │     │    MySQL     │     │   MongoDB   │     │    Redis    │
│  Analytics  │     │  Core app    │     │  Catalog    │     │  Sessions   │
│  Reporting  │     │  Orders*     │     │  Activity   │     │  Cache      │
│  Payments   │     │  Users*      │     │  Logs       │     │  Rate limit │
└─────────────┘     └──────────────┘     └─────────────┘     └─────────────┘
     * Many teams pick ONE SQL DB: PostgreSQL OR MySQL — not always both
```

**Interview answer:** "Use **PostgreSQL** for complex queries, JSONB, and strict ACID reporting. Use **MySQL** for high-read OLTP web apps — very common at Flipkart, Uber, and Indian product companies. **MongoDB** for flexible schemas. **Redis** for caching and sessions. Many MERN stacks use MySQL or PostgreSQL as primary SQL store plus MongoDB for specific workloads plus Redis for cache."

---

## 2. CAP Theorem & ACID vs BASE

### CAP Theorem

In a distributed system, you can guarantee at most **two of three**:

| Property | Meaning |
|----------|---------|
| **C**onsistency | Every read returns the latest write |
| **A**vailability | Every request gets a response |
| **P**artition tolerance | System works despite network failures |

```
         Consistency
            /\
           /  \
          / CP \        CA (single-node only)
         /      \       — not realistic in distributed systems
        /   CAP  \
       /          \
      /────────────\
 Availability    Partition Tolerance
              AP
```

| System | CAP Choice | Example |
|--------|-----------|---------|
| PostgreSQL (single node) | CA | Traditional RDBMS |
| MongoDB (replica set) | CP | Consistency over availability during partition |
| Cassandra | AP | Availability + partition tolerance |
| Redis (cluster) | AP | Eventual consistency in cluster mode |

### ACID vs BASE

| Property | ACID (SQL) | BASE (NoSQL) |
|----------|-----------|--------------|
| **A**tomicity | All or nothing | Eventual |
| **C**onsistency | Immediate | Soft state |
| **I**solation | Serializable | — |
| **D**urability | Guaranteed | Basically available |
| Trade-off | Strong guarantees | Scale + availability |

---

## 3. MongoDB Deep Dive

### Document Model

MongoDB stores data as **BSON documents** (binary JSON) in **collections**.

```javascript
// users collection
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "Amit Kumar",
  email: "amit@example.com",
  role: "admin",
  profile: {                    // embedded document
    bio: "Full-stack developer",
    avatar: "https://cdn.example.com/a.jpg",
    social: {
      twitter: "@amit",
      github: "amitdev"
    }
  },
  tags: ["javascript", "nodejs"], // array
  address: {
    city: "Bangalore",
    country: "IN",
    coordinates: [77.5946, 12.9716]  // [longitude, latitude]
  },
  createdAt: ISODate("2024-01-15T10:00:00Z"),
  updatedAt: ISODate("2024-06-01T08:30:00Z")
}
```

### Embedding vs Referencing

| Pattern | When to Use | Example |
|---------|-------------|---------|
| **Embed** | One-to-few, data accessed together | User → address, order → line items |
| **Reference** | One-to-many, many-to-many, large arrays | User → orders, post → comments |
| **Hybrid** | Frequently accessed subset | User embeds last 5 orders, references rest |

```javascript
// ❌ Unbounded array — document grows forever
{
  userId: ObjectId("..."),
  comments: [ /* millions of comments */ ]
}

// ✅ Reference pattern
// comments collection
{ _id: ObjectId("..."), postId: ObjectId("..."), text: "Great post!", userId: ObjectId("...") }
```

### CRUD Operations

```javascript
// Create
db.users.insertOne({ name: "Amit", email: "a@x.com", role: "user" });
db.users.insertMany([{ name: "Bob" }, { name: "Carol" }]);

// Read
db.users.findOne({ email: "a@x.com" });
db.users.find({ role: "admin" }).sort({ createdAt: -1 }).limit(10).skip(20);
db.users.find({ "address.city": "Bangalore" });           // dot notation
db.users.find({ tags: { $in: ["nodejs", "react"] } });    // array query
db.users.find({ age: { $gte: 18, $lte: 65 } });           // range

// Update
db.users.updateOne(
  { email: "a@x.com" },
  { $set: { name: "Amit K" }, $inc: { loginCount: 1 }, $push: { tags: "mongodb" } }
);

// Delete
db.users.deleteOne({ email: "a@x.com" });
db.users.deleteMany({ role: "guest", lastLogin: { $lt: new Date("2023-01-01") } });
```

### Query Operators Reference

| Operator | Purpose | Example |
|----------|---------|---------|
| `$eq`, `$ne` | Equal / not equal | `{ status: { $ne: "deleted" } }` |
| `$gt`, `$gte`, `$lt`, `$lte` | Comparison | `{ price: { $gte: 100 } }` |
| `$in`, `$nin` | In / not in array | `{ role: { $in: ["admin", "mod"] } }` |
| `$and`, `$or`, `$nor` | Logical | `{ $or: [{ status: "active" }, { premium: true }] }` |
| `$exists` | Field exists | `{ deletedAt: { $exists: false } }` |
| `$regex` | Pattern match | `{ name: { $regex: "^Am", $options: "i" } }` |
| `$elemMatch` | Array element match | `{ scores: { $elemMatch: { $gte: 80 } } }` |

---

## 4. Mongoose ODM

Mongoose provides **schema validation**, **middleware**, **population**, and **TypeScript support** for MongoDB.

### Schema Definition

```typescript
import { Schema, model, Document, Types } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
  profile: {
    bio?: string;
    avatar?: string;
  };
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: [true, "Name is required"], trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    profile: {
      bio: { type: String, maxlength: 500 },
      avatar: String,
    },
    tags: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ name: "text", "profile.bio": "text" }); // text search
userSchema.index({ role: 1, createdAt: -1 });              // compound

export const User = model<IUser>("User", userSchema);
```

### Middleware (Hooks)

```typescript
import bcrypt from "bcrypt";

// Pre-save — hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

// Post-save — log creation
userSchema.post("save", function (doc) {
  console.log(`User created: ${doc.email}`);
});
```

### Population (Joins)

```typescript
const postSchema = new Schema({
  title: String,
  author: { type: Types.ObjectId, ref: "User", required: true },
  comments: [{ type: Types.ObjectId, ref: "Comment" }],
});

// Populate author when fetching posts
const posts = await Post.find()
  .populate("author", "name email avatar")
  .populate({ path: "comments", options: { limit: 5, sort: { createdAt: -1 } } })
  .lean(); // returns plain JS objects — faster, no Mongoose overhead
```

### Mongoose CRUD with TypeScript

```typescript
// Create
const user = await User.create({ name: "Amit", email: "a@x.com", passwordHash: "plain" });

// Read
const users = await User.find({ role: "admin" })
  .select("name email")
  .sort({ createdAt: -1 })
  .limit(10)
  .lean();

// Update
const updated = await User.findByIdAndUpdate(
  id,
  { $set: { name: "New Name" } },
  { new: true, runValidators: true }
);

// Delete
await User.findByIdAndDelete(id);

// Upsert
await User.findOneAndUpdate(
  { email: "a@x.com" },
  { $set: { lastLogin: new Date() } },
  { upsert: true, new: true }
);
```

---

## 5. PostgreSQL Deep Dive

### Normalized Schema Design

```sql
-- Users table
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role        VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status      VARCHAR(20) NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  total       DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order items (line items)
CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id),
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  unit_price  DECIMAL(10, 2) NOT NULL,
  UNIQUE (order_id, product_id)
);

-- Products
CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(200) NOT NULL,
  slug        VARCHAR(200) NOT NULL UNIQUE,
  price       DECIMAL(10, 2) NOT NULL,
  stock       INTEGER NOT NULL DEFAULT 0,
  category_id UUID REFERENCES categories(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status_created ON orders(status, created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
```

### Normalization Levels

| Form | Rule | Example |
|------|------|---------|
| 1NF | Atomic values, no repeating groups | Separate order_items from orders |
| 2NF | No partial dependencies | Product name in products, not order_items |
| 3NF | No transitive dependencies | Category name in categories, not products |
| Denormalize | When read performance critical | Cache `order_count` on users table |

### Data Types Reference

| Type | Use Case | Example |
|------|----------|---------|
| `UUID` | Primary keys | `gen_random_uuid()` |
| `VARCHAR(n)` | Variable strings | Names, emails |
| `TEXT` | Long strings | Descriptions, content |
| `INTEGER` / `BIGINT` | Whole numbers | Counts, IDs |
| `DECIMAL(p,s)` | Money, precise numbers | `DECIMAL(10,2)` |
| `BOOLEAN` | True/false | `is_active` |
| `TIMESTAMPTZ` | Dates with timezone | Always use TIMESTAMPTZ |
| `JSONB` | Semi-structured data | Metadata, settings |
| `ARRAY` | Lists | Tags, permissions |
| `ENUM` | Fixed set (or use CHECK) | Status values |

---

## 6. MySQL Deep Dive

MySQL is the world's most deployed open-source relational database. **InnoDB** is the default storage engine (ACID, row-level locking, foreign keys). Very common at **Flipkart, Uber, Airbnb, Netflix**, and many Indian product companies — often the SQL database you'll see in interviews alongside PostgreSQL.

### PostgreSQL vs MySQL — Interview Comparison

| Factor | PostgreSQL | MySQL (InnoDB) |
|--------|------------|----------------|
| Default isolation | Read Committed | **Repeatable Read** |
| JSON support | Native **JSONB** (indexable) | JSON type (less mature indexing) |
| Window functions | Full support | Full support (8.0+) |
| CTEs / recursive queries | Excellent | Supported (8.0+) |
| Full-text search | Built-in (tsvector) | FULLTEXT indexes |
| GIS | PostGIS extension | Basic spatial types |
| Replication | Streaming, logical | Binlog-based, Group Replication |
| Typical use | Analytics, complex queries, fintech | High-read OLTP, e-commerce, web apps |
| Cloud managed | RDS, Cloud SQL, Neon, Supabase | **RDS, PlanetScale, Aurora MySQL** |

**When to pick MySQL:** Simple relational schema, massive read traffic, team already on MySQL/LAMP, PlanetScale/Vitess sharding path, or company standard is MySQL.

**When to pick PostgreSQL:** Complex queries, JSONB, GIS, advanced types, or you need stricter default isolation for financial workloads.

### MySQL Schema Design (InnoDB)

```sql
-- Users table (MySQL 8.0+)
CREATE TABLE users (
  id            CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  role          ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at    DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at    DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders table
CREATE TABLE orders (
  id         CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id    CHAR(36) NOT NULL,
  status     ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
  total      DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_orders_user_id (user_id),
  INDEX idx_orders_status_created (status, created_at DESC)
) ENGINE=InnoDB;

-- Products
CREATE TABLE products (
  id          CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name        VARCHAR(200) NOT NULL,
  slug        VARCHAR(200) NOT NULL,
  price       DECIMAL(10, 2) NOT NULL,
  stock       INT NOT NULL DEFAULT 0,
  category_id CHAR(36),
  created_at  DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  UNIQUE KEY uk_products_slug (slug),
  INDEX idx_products_category (category_id)
) ENGINE=InnoDB;
```

**MySQL-specific notes:**
- Always use **`utf8mb4`** charset (full Unicode including emoji).
- **`ENGINE=InnoDB`** — never MyISAM for transactional apps (no FK, table locks).
- **`DATETIME(6)`** or **`TIMESTAMP`** — prefer `DATETIME` for application timestamps (no 2038 limit).
- **`AUTO_INCREMENT BIGINT`** is common for high-volume IDs instead of UUID (better index locality).

### mysql2 — Node.js Driver

```typescript
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Parameterized query (prevents SQL injection)
const [rows] = await pool.execute<mysql.RowDataPacket[]>(
  "SELECT u.name, SUM(o.total) AS total_spent FROM users u " +
  "LEFT JOIN orders o ON o.user_id = u.id " +
  "WHERE u.id = ? GROUP BY u.id",
  [userId]
);

// Transaction
const conn = await pool.getConnection();
try {
  await conn.beginTransaction();
  await conn.execute("UPDATE products SET stock = stock - ? WHERE id = ?", [qty, productId]);
  await conn.execute("INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)",
    [orderId, productId, qty]);
  await conn.commit();
} catch (err) {
  await conn.rollback();
  throw err;
} finally {
  conn.release();
}
```

### Prisma with MySQL

Same Prisma models work — change datasource only:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// User model — use @db.VarChar, @db.Decimal for MySQL types
model User {
  id           String   @id @default(uuid()) @db.Char(36)
  email        String   @unique @db.VarChar(255)
  passwordHash String   @map("password_hash")
  role         Role     @default(USER)
  orders       Order[]
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@map("users")
}
```

```bash
# DATABASE_URL format for MySQL
# mysql://USER:PASSWORD@HOST:3306/DATABASE

npx prisma migrate dev --name init
npx prisma generate
```

### MySQL Indexing & EXPLAIN

```sql
-- Show query plan
EXPLAIN ANALYZE
SELECT u.name, o.total
FROM users u
INNER JOIN orders o ON o.user_id = u.id
WHERE o.status = 'paid';

-- Composite index (leftmost prefix rule applies)
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- Covering index — includes SELECT columns to avoid table lookup
CREATE INDEX idx_orders_cover ON orders(user_id, status, total, created_at);
```

| EXPLAIN column | Good sign | Bad sign |
|----------------|-----------|----------|
| `type` | `ref`, `range`, `const` | `ALL` (full table scan) |
| `key` | Index name shown | `NULL` |
| `rows` | Low estimate | High (millions) |
| `Extra` | `Using index` | `Using filesort`, `Using temporary` |

### MySQL Isolation & Locking (InnoDB)

| Level | Default? | Phantom reads? | Use case |
|-------|----------|------------------|----------|
| READ UNCOMMITTED | No | Yes | Rarely used |
| READ COMMITTED | No | Yes | Oracle-style apps |
| **REPEATABLE READ** | **Yes (InnoDB)** | Prevented via MVCC + gap locks | Most web apps |
| SERIALIZABLE | No | No | Strictest, slowest |

```sql
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
START TRANSACTION;
-- ... queries ...
COMMIT;
```

**Gap locks:** InnoDB locks gaps between index records to prevent phantom inserts — can cause deadlocks under high concurrency. Keep transactions short.

### Local MySQL Setup

```bash
# Docker
docker run -d --name mysql-dev \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=app_db \
  -p 3306:3306 \
  mysql:8.0

# Or Homebrew (macOS)
brew install mysql
brew services start mysql
mysql -u root -p
```

**Managed options:** AWS RDS MySQL, PlanetScale (Vitess — serverless scaling), Railway, Aiven.

---

## 7. Prisma ORM

Prisma provides **type-safe** database access with auto-generated TypeScript types. Works with **PostgreSQL, MySQL, SQLite, and MongoDB** — same client API, swap `provider` in schema.

### Schema Definition (PostgreSQL example)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  passwordHash String   @map("password_hash")
  role         Role     @default(USER)
  orders       Order[]
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@map("users")
}

model Order {
  id        String      @id @default(uuid())
  userId    String      @map("user_id")
  user      User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  status    OrderStatus @default(PENDING)
  total     Decimal     @db.Decimal(10, 2)
  items     OrderItem[]
  createdAt DateTime    @default(now()) @map("created_at")

  @@index([userId])
  @@index([status, createdAt(sort: Desc)])
  @@map("orders")
}

model OrderItem {
  id        String  @id @default(uuid())
  orderId   String  @map("order_id")
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String  @map("product_id")
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  unitPrice Decimal @map("unit_price") @db.Decimal(10, 2)

  @@unique([orderId, productId])
  @@map("order_items")
}

model Product {
  id         String      @id @default(uuid())
  name       String
  slug       String      @unique
  price      Decimal     @db.Decimal(10, 2)
  stock      Int         @default(0)
  orderItems OrderItem[]

  @@map("products")
}

enum Role {
  USER
  ADMIN
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  DELIVERED
  CANCELLED
}
```

### Prisma Client Usage

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create with nested relations
const order = await prisma.order.create({
  data: {
    userId: user.id,
    total: 99.99,
    items: {
      create: [
        { productId: product1.id, quantity: 2, unitPrice: 29.99 },
        { productId: product2.id, quantity: 1, unitPrice: 39.99 },
      ],
    },
  },
  include: { items: { include: { product: true } } },
});

// Find with relations
const users = await prisma.user.findMany({
  where: { role: "ADMIN" },
  select: { id: true, name: true, email: true, _count: { select: { orders: true } } },
  orderBy: { createdAt: "desc" },
  take: 10,
});

// Update
await prisma.product.update({
  where: { id: productId },
  data: { stock: { decrement: quantity } },
});

// Raw SQL when needed
const result = await prisma.$queryRaw`
  SELECT u.name, COUNT(o.id) as order_count, SUM(o.total) as total_spent
  FROM users u
  LEFT JOIN orders o ON o.user_id = u.id
  GROUP BY u.id
  ORDER BY total_spent DESC
  LIMIT 10
`;
```

### Prisma Migrations

```bash
# Create migration after schema change
npx prisma migrate dev --name add_order_status

# Apply migrations in production
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset

# Generate client after schema change
npx prisma generate

# Open database GUI
npx prisma studio
```

---

## 8. SQL Joins & Queries

### Join Types

```sql
-- INNER JOIN — only matching rows
SELECT u.name, o.id AS order_id, o.total
FROM users u
INNER JOIN orders o ON o.user_id = u.id
WHERE o.status = 'paid';

-- LEFT JOIN — all users, even without orders
SELECT u.name, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.name;

-- RIGHT JOIN — all orders, even orphaned (rare)
SELECT u.name, o.total
FROM users u
RIGHT JOIN orders o ON o.user_id = u.id;

-- FULL OUTER JOIN — all from both tables
SELECT u.name, o.total
FROM users u
FULL OUTER JOIN orders o ON o.user_id = u.id;
```

### Join Visual Reference

```
Table A     Table B       INNER    LEFT     RIGHT    FULL
┌───┐      ┌───┐
│ 1 │──────│ 3 │         ┌──┐     ┌──┐     ┌──┐     ┌──┐
│ 2 │  ┌───│ 4 │         │██│     │██│     │  │     │██│
│   │  │   │ 5 │         │██│     │██│     │██│     │██│
└───┘  │   └───┘         └──┘     │░░│     │██│     │░░│
       └─────────────────         only     all A    all B    all both
                                  match
```

### Subqueries vs CTEs

```sql
-- Subquery (correlated)
SELECT u.name,
  (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS order_count
FROM users u;

-- CTE (Common Table Expression) — more readable
WITH user_stats AS (
  SELECT
    user_id,
    COUNT(*) AS order_count,
    SUM(total) AS total_spent,
    MAX(created_at) AS last_order
  FROM orders
  WHERE status = 'delivered'
  GROUP BY user_id
)
SELECT u.name, us.order_count, us.total_spent, us.last_order
FROM users u
JOIN user_stats us ON us.user_id = u.id
WHERE us.total_spent > 1000
ORDER BY us.total_spent DESC;
```

### Window Functions

```sql
-- Rank users by spending per month
SELECT
  u.name,
  o.total,
  o.created_at,
  ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY o.created_at) AS order_number,
  SUM(o.total) OVER (PARTITION BY u.id) AS lifetime_spent,
  AVG(o.total) OVER (PARTITION BY DATE_TRUNC('month', o.created_at)) AS monthly_avg
FROM orders o
JOIN users u ON u.id = o.user_id
WHERE o.status = 'delivered';
```

---

## 9. Transactions

### Why Transactions?

Ensure **atomicity** — either all operations succeed or all roll back.

| Scenario | Without Transaction | With Transaction |
|----------|-------------------|-----------------|
| Transfer $100 A→B | A debited, B credit fails → money lost | Both or neither |
| Create order + decrement stock | Order created, stock not updated → oversell | Atomic |
| Delete user + all data | Partial delete → orphaned records | Clean delete |

### PostgreSQL Transactions

```sql
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 'account-a';
UPDATE accounts SET balance = balance + 100 WHERE id = 'account-b';

-- Check constraint
DO $$
BEGIN
  IF (SELECT balance FROM accounts WHERE id = 'account-a') < 0 THEN
    RAISE EXCEPTION 'Insufficient funds';
  END IF;
END $$;

COMMIT;
-- Or ROLLBACK; on error
```

### Prisma Transactions

```typescript
// Sequential operations in one transaction
const result = await prisma.$transaction(async (tx) => {
  const product = await tx.product.findUnique({ where: { id: productId } });
  if (!product || product.stock < quantity) {
    throw new Error("Insufficient stock");
  }

  const order = await tx.order.create({
    data: {
      userId,
      total: product.price.mul(quantity),
      items: { create: [{ productId, quantity, unitPrice: product.price }] },
    },
  });

  await tx.product.update({
    where: { id: productId },
    data: { stock: { decrement: quantity } },
  });

  return order;
});
```

### MongoDB Transactions

```typescript
const session = await mongoose.startSession();
session.startTransaction();

try {
  await Order.create([{ userId, items, total }], { session });
  await Product.updateOne(
    { _id: productId },
    { $inc: { stock: -quantity } },
    { session }
  );
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

### Isolation Levels (PostgreSQL)

| Level | Dirty Read | Non-Repeatable Read | Phantom Read |
|-------|-----------|--------------------|----|
| Read Uncommitted | Possible | Possible | Possible |
| Read Committed (default) | No | Possible | Possible |
| Repeatable Read | No | No | Possible |
| Serializable | No | No | No |

---

## 10. Indexing Strategies

### Index Types

| Index Type | MongoDB | PostgreSQL | Use Case |
|-----------|---------|------------|----------|
| Single field | `{ email: 1 }` | `CREATE INDEX ON users(email)` | Equality lookups |
| Compound | `{ role: 1, createdAt: -1 }` | `CREATE INDEX ON orders(status, created_at DESC)` | Multi-field queries |
| Unique | `{ email: 1 }, { unique: true }` | `CREATE UNIQUE INDEX` | Prevent duplicates |
| Text | `{ name: "text" }` | `GIN/GiST on to_tsvector` | Full-text search |
| Partial | `{ status: 1 }, { partialFilterExpression: { status: "active" } }` | `CREATE INDEX ... WHERE status = 'active'` | Subset of rows |
| Geospatial | `2dsphere` | PostGIS | Location queries |

### Index Rules

| Rule | Explanation |
|------|-------------|
| Index columns in WHERE, JOIN, ORDER BY | Queries benefit from indexes |
| Leftmost prefix (compound) | Index `(a, b, c)` helps queries on `a`, `a+b`, `a+b+c` — not `b` alone |
| Don't over-index | Each index slows writes |
| Use EXPLAIN | `EXPLAIN ANALYZE` in PostgreSQL; `.explain()` in MongoDB |
| Covering index | Index includes all queried columns — no table lookup |

### EXPLAIN Example (PostgreSQL)

```sql
EXPLAIN ANALYZE
SELECT * FROM orders WHERE user_id = 'abc-123' AND status = 'paid' ORDER BY created_at DESC LIMIT 10;

-- Good: Index Scan using idx_orders_user_status
-- Bad:  Seq Scan on orders (full table scan — add index!)
```

### MongoDB Index Performance

```javascript
// Check if query uses index
db.orders.find({ userId: ObjectId("..."), status: "paid" }).explain("executionStats");

// executionStats.totalDocsExamined should ≈ nReturned
// If totalDocsExamined >> nReturned → collection scan or inefficient index
```

---

## 11. Aggregation & Analytics

### MongoDB Aggregation Pipeline

```javascript
db.orders.aggregate([
  // Stage 1: Filter
  { $match: { status: "delivered", createdAt: { $gte: ISODate("2024-01-01") } } },

  // Stage 2: Join users
  { $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
  }},
  { $unwind: "$user" },

  // Stage 3: Group by user
  { $group: {
      _id: "$userId",
      userName: { $first: "$user.name" },
      orderCount: { $sum: 1 },
      totalSpent: { $sum: "$total" },
      avgOrderValue: { $avg: "$total" },
  }},

  // Stage 4: Filter groups
  { $match: { totalSpent: { $gte: 1000 } } },

  // Stage 5: Sort and limit
  { $sort: { totalSpent: -1 } },
  { $limit: 10 },

  // Stage 6: Project final shape
  { $project: {
      _id: 0,
      userId: "$_id",
      userName: 1,
      orderCount: 1,
      totalSpent: { $round: ["$totalSpent", 2] },
      avgOrderValue: { $round: ["$avgOrderValue", 2] },
  }},
]);
```

### Aggregation Stage Reference

| Stage | Purpose |
|-------|---------|
| `$match` | Filter documents (like WHERE) |
| `$group` | Group and aggregate (like GROUP BY) |
| `$project` | Select/transform fields (like SELECT) |
| `$sort` | Sort results |
| `$limit` / `$skip` | Pagination |
| `$lookup` | Join collections (like JOIN) |
| `$unwind` | Deconstruct array field |
| `$addFields` | Add computed fields |
| `$facet` | Multiple pipelines in parallel |
| `$bucket` | Group into ranges (histogram) |

### PostgreSQL Analytics Query

```sql
SELECT
  DATE_TRUNC('month', o.created_at) AS month,
  COUNT(DISTINCT o.user_id) AS unique_customers,
  COUNT(o.id) AS order_count,
  SUM(o.total) AS revenue,
  AVG(o.total) AS avg_order_value,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY o.total) AS median_order
FROM orders o
WHERE o.status = 'delivered'
  AND o.created_at >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', o.created_at)
ORDER BY month;
```

---

## 12. Redis Caching Patterns

### Redis Data Structures

| Structure | Commands | Use Case |
|-----------|----------|----------|
| String | `SET`, `GET`, `INCR` | Cache, counters, rate limits |
| Hash | `HSET`, `HGET`, `HGETALL` | Object cache (user session) |
| List | `LPUSH`, `RPOP`, `LRANGE` | Queues, feeds, recent items |
| Set | `SADD`, `SMEMBERS`, `SINTER` | Tags, unique visitors |
| Sorted Set | `ZADD`, `ZRANGE`, `ZRANK` | Leaderboards, priority queues |
| Pub/Sub | `PUBLISH`, `SUBSCRIBE` | Real-time notifications |
| Stream | `XADD`, `XREAD` | Event logs, message queues |

### Cache-Aside Pattern (Most Common)

```typescript
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);
const CACHE_TTL = 300; // 5 minutes

async function getUser(id: string) {
  const cacheKey = `user:${id}`;

  // 1. Check cache
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // 2. Cache miss — fetch from DB
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return null;

  // 3. Store in cache
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(user));

  return user;
}

async function updateUser(id: string, data: UpdateUserInput) {
  const user = await prisma.user.update({ where: { id }, data });

  // Invalidate cache on write
  await redis.del(`user:${id}`);

  return user;
}
```

### Caching Patterns Comparison

| Pattern | Read | Write | Consistency |
|---------|------|-------|-------------|
| **Cache-Aside** | App manages cache | Invalidate on write | Eventual |
| **Read-Through** | Cache fetches on miss | Cache handles | Eventual |
| **Write-Through** | Cache first | Sync to DB + cache | Strong |
| **Write-Behind** | Cache first | Async DB write | Eventual |

### Session Storage

```typescript
import session from "express-session";
import RedisStore from "connect-redis";

app.use(session({
  store: new RedisStore({ client: redis }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: "lax",
  },
}));
```

### Rate Limiting with Redis

```typescript
async function rateLimit(key: string, limit: number, windowSec: number): Promise<boolean> {
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, windowSec);
  }
  return current <= limit;
}

// Usage in middleware
const allowed = await rateLimit(`rl:${req.ip}`, 100, 900);
if (!allowed) return res.status(429).json({ error: "Rate limit exceeded" });
```

### Leaderboard with Sorted Sets

```typescript
// Add score
await redis.zadd("leaderboard:2024", score, userId);

// Top 10
const top10 = await redis.zrevrange("leaderboard:2024", 0, 9, "WITHSCORES");

// User rank
const rank = await redis.zrevrank("leaderboard:2024", userId);
```

---

## 13. Database Architecture Patterns

### Read Replicas

```
         ┌─────────────┐
         │   Primary    │ ← Writes
         │  (Master)    │
         └──────┬───────┘
                │ replication
       ┌────────┼────────┐
       ▼        ▼        ▼
  ┌────────┐ ┌────────┐ ┌────────┐
  │Replica1│ │Replica2│ │Replica3│ ← Reads
  └────────┘ └────────┘ └────────┘
```

### Connection Pooling

```typescript
// Prisma handles pooling automatically
// For raw pg:
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                    // max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### Database Selection Flowchart

```
Need sub-ms latency?
├── YES → Redis
└── NO → Need complex joins/reporting?
    ├── YES → PostgreSQL
    └── NO → Schema changes frequently?
        ├── YES → MongoDB
        └── NO → Need ACID transactions?
            ├── YES → PostgreSQL
            └── NO → MongoDB (with Redis cache)
```

---

## 14. Interview Q&A

### Q1: PostgreSQL vs MongoDB — when do you use each?

**Answer:** PostgreSQL for relational data needing JOINs, ACID transactions, and complex reporting — orders, payments, user accounts. MongoDB for flexible schemas, nested documents, high write throughput — product catalogs, activity logs, content management. Many apps use PostgreSQL as primary store and MongoDB for specific workloads, with Redis for caching.

### Q2: Explain the CAP theorem.

**Answer:** In distributed systems, you can guarantee at most two of Consistency, Availability, and Partition tolerance. Since network partitions are inevitable, the real choice is CP (consistent but may reject requests during partition — MongoDB) or AP (available but may return stale data — Cassandra, Redis cluster). Single-node PostgreSQL is effectively CA.

### Q3: Embedding vs referencing in MongoDB?

**Answer:** Embed when data is accessed together, bounded in size, and has a one-to-few relationship (user address, order line items). Reference when data grows unbounded, is shared across documents, or needs independent querying (user → orders, post → comments). Rule of thumb: embed what you query together; reference what grows independently.

### Q4: How do you optimize slow database queries?

**Answer:** (1) Run EXPLAIN/EXPLAIN ANALYZE to identify full table scans. (2) Add indexes on WHERE, JOIN, ORDER BY columns. (3) Use covering indexes to avoid table lookups. (4) Denormalize for read-heavy patterns. (5) Add Redis cache for frequently read data. (6) Use connection pooling. (7) Paginate results — never return unbounded datasets.

### Q5: Explain database transactions and isolation levels.

**Answer:** Transactions group operations into atomic units — all succeed or all roll back. Isolation levels control concurrent access: Read Committed (default, sees committed data), Repeatable Read (consistent reads within transaction), Serializable (full isolation, slowest). Use transactions for financial operations, inventory management, and any multi-step write that must be consistent.

### Q6: What caching strategies do you use?

**Answer:** Cache-aside is most common — app checks Redis first, falls back to DB, stores result with TTL. Invalidate cache on writes. Use write-through for strong consistency needs. Cache hot data: user profiles, product listings, API responses. Set appropriate TTLs — short for dynamic data, long for static. Monitor cache hit rate; aim for >90% on cached endpoints.

### Q7: How does Prisma differ from raw SQL or Mongoose?

**Answer:** Prisma generates type-safe TypeScript client from schema, supports PostgreSQL/MySQL/SQLite/MongoDB, handles migrations, and provides relation queries. Unlike raw SQL, you get compile-time type checking. Unlike Mongoose, Prisma supports SQL databases natively with JOINs. Trade-off: complex queries may need `$queryRaw`; less flexible than raw SQL for advanced analytics.

### Q8: How do you design indexes?

**Answer:** Index columns used in WHERE, JOIN, and ORDER BY clauses. Compound indexes follow leftmost prefix rule. Use partial indexes for filtered subsets. Unique indexes enforce constraints. Avoid indexing low-cardinality columns alone. Monitor with EXPLAIN — target index scans over sequential scans. Each index adds write overhead, so don't over-index.

### Q9: PostgreSQL vs MySQL — when do you pick each?

**Answer:** Both are ACID SQL databases with InnoDB/PostgreSQL supporting transactions and foreign keys. Choose **PostgreSQL** for complex analytics, JSONB, GIS (PostGIS), advanced types, and when you need Read Committed as default with strong extension ecosystem. Choose **MySQL** for high-read OLTP web workloads, e-commerce, teams on LAMP/MEAN stacks, PlanetScale/Vitess sharding, or when the company standard is MySQL (common at Flipkart, Uber, Indian product companies). In MERN interviews, demonstrate you can work with **either** — Prisma abstracts most differences; know isolation defaults (PG: Read Committed, MySQL InnoDB: Repeatable Read) and charset (`utf8mb4`).

---

## 15. Practice Links & Resources

### MongoDB
- [MongoDB University](https://learn.mongodb.com) — Free courses (M001, M121, M201)
- [MongoDB Docs](https://www.mongodb.com/docs) — Official reference
- [Mongoose Docs](https://mongoosejs.com/docs/guide.html) — ODM guide

### PostgreSQL
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com) — Step-by-step SQL tutorials
- [PostgreSQL Docs](https://www.postgresql.org/docs/current/) — Official reference
- [Use The Index, Luke](https://use-the-index-luke.com) — Indexing guide

### MySQL
- [MySQL 8.0 Reference](https://dev.mysql.com/doc/refman/8.0/en/) — Official docs
- [MySQL Tutorial](https://www.mysqltutorial.org/) — Beginner to advanced SQL
- [PlanetScale Docs](https://planetscale.com/docs) — Serverless MySQL (Vitess)
- [mysql2 npm](https://github.com/sidorares/node-mysql2) — Node.js driver

### Redis
- [Upstash Docs](https://upstash.com/docs) — Serverless Redis
- [Redis University](https://university.redis.io) — Free Redis courses
- [Redis Commands Reference](https://redis.io/commands/) — All commands

### Prisma
- [Prisma Docs](https://www.prisma.io/docs) — ORM reference
- [Prisma Data Guide](https://www.prisma.io/dataguide) — Database concepts

### Practice Projects

| Project | Databases Used | Skills |
|---------|---------------|--------|
| E-commerce backend | PostgreSQL or MySQL + Redis | Schema design, transactions, caching |
| Blog platform | MongoDB + Redis | Document modeling, aggregation |
| High-traffic web app | **MySQL** + Redis | Read scaling, connection pooling |
| Analytics dashboard | PostgreSQL | Window functions, CTEs, indexing |
| Real-time leaderboard | Redis | Sorted sets, pub/sub |
| Multi-tenant SaaS | PostgreSQL + MongoDB | Polyglot persistence |

### Tools

| Tool | Purpose |
|------|---------|
| `pgAdmin` / `DBeaver` | PostgreSQL / MySQL GUI |
| `MySQL Workbench` | MySQL GUI |
| `MongoDB Compass` | MongoDB GUI |
| `Redis Insight` | Redis GUI |
| `Prisma Studio` | Prisma database browser |
| `Atlas` | Managed MongoDB |
| `Supabase` / `Neon` | Managed PostgreSQL |
| `PlanetScale` / `RDS MySQL` | Managed MySQL |
| `Upstash` | Serverless Redis |

---

*Previous: [05-nodejs-express-complete.md](./05-nodejs-express-complete.md) | Back to [ROADMAP](../../ROADMAP.md)*
