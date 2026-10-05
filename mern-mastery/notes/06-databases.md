# Databases — MongoDB, PostgreSQL, MySQL & Redis Notes

---

## 1. SQL vs NoSQL — When to use what

| Factor | PostgreSQL (SQL) | MySQL (SQL) | MongoDB (NoSQL) |
|--------|------------------|-------------|-----------------|
| Structure | Fixed schema, tables | Fixed schema, tables | Flexible schema, documents |
| Relations | JOINs, foreign keys | JOINs, foreign keys | Embed or reference |
| Transactions | Full ACID | Full ACID (InnoDB) | Multi-doc ACID (v4+) |
| Scale | Vertical + read replicas | Vertical + Vitess/sharding | Horizontal sharding |
| Best for | Analytics, complex queries | High-read web apps, e-commerce | Content, logs, catalogs |
| Used at | Stripe, Instagram | Flipkart, Uber, Airbnb | SaaS, real-time apps |

**Interview answer:** "PostgreSQL for complex queries and JSONB. MySQL for high-read OLTP — very common at Indian product companies. MongoDB for flexible schemas. Redis for cache. Many apps use one SQL DB plus MongoDB for specific workloads plus Redis."

---

## 2. MongoDB

### Document model

```javascript
// users collection
{
  _id: ObjectId("..."),
  name: "Amit",
  email: "amit@example.com",
  address: {           // embedded document
    city: "Bangalore",
    pincode: "560001"
  },
  orders: [ObjectId("...")]  // reference
}
```

### Mongoose (ODM)

```typescript
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, index: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });

const User = model("User", userSchema);

// CRUD
await User.create({ name: "Amit", email: "a@x.com" });
await User.find({ role: "admin" }).limit(10).sort({ createdAt: -1 });
await User.findByIdAndUpdate(id, { name: "New" }, { new: true });
await User.findByIdAndDelete(id);
```

### Aggregation pipeline

```javascript
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$userId", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } },
  { $limit: 10 },
]);
```

### Indexing

```javascript
userSchema.index({ email: 1 });           // single field
userSchema.index({ name: 1, createdAt: -1 }); // compound
// Without index → collection scan (slow at scale)
```

---

## 3. PostgreSQL

### Schema design (normalized)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending'
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
```

### Essential SQL

```sql
-- JOIN
SELECT u.name, o.amount
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed';

-- Aggregation
SELECT user_id, SUM(amount) as total
FROM orders
GROUP BY user_id
HAVING SUM(amount) > 1000;

-- Transaction
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

---

## 4. MySQL

### Schema (InnoDB, utf8mb4)

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  UNIQUE KEY uk_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending','paid','shipped') DEFAULT 'pending',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB;
```

### mysql2 (Node.js)

```typescript
import mysql from "mysql2/promise";

const pool = mysql.createPool({ host, user, password, database, connectionLimit: 10 });

const [rows] = await pool.execute(
  "SELECT * FROM users WHERE email = ?",
  [email]
);
```

### PostgreSQL vs MySQL (quick)

| | PostgreSQL | MySQL |
|---|------------|-------|
| Default isolation | Read Committed | Repeatable Read |
| JSON | JSONB (indexable) | JSON (basic) |
| Pick when | Complex queries, analytics | High-read OLTP, e-commerce |

### Prisma with MySQL

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
// Same models — use @db.VarChar, @db.Decimal as needed
```

---

## 5. Prisma ORM

```typescript
// schema.prisma (PostgreSQL or MySQL)
model User {
  id     Int     @id @default(autoincrement())
  email  String  @unique
  orders Order[]
}

// Usage
const users = await prisma.user.findMany({
  include: { orders: true },
  where: { email: { contains: "@gmail.com" } },
  take: 20,
  skip: 0,
});
```

---

## 6. Redis

In-memory key-value store.

```typescript
import Redis from "ioredis";
const redis = new Redis();

// Cache
await redis.setex(`user:${id}`, 3600, JSON.stringify(user)); // TTL 1hr
const cached = await redis.get(`user:${id}`);

// Rate limiting
const key = `rate:${ip}`;
const count = await redis.incr(key);
if (count === 1) await redis.expire(key, 60);
if (count > 100) throw new Error("Rate limited");
```

**Use cases:** Session store, caching, rate limiting, pub/sub, leaderboards.

---

## 7. Database Interview Topics

- ACID properties
- PostgreSQL vs MySQL vs MongoDB — when to pick each
- Normalization (1NF, 2NF, 3NF)
- Index types (B-tree, hash)
- N+1 query problem
- Connection pooling
- Read replicas vs sharding
- CAP theorem basics
- InnoDB vs MyISAM (always InnoDB for transactions)
