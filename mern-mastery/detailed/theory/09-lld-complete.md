# Low-Level Design (LLD) — Complete Guide

<!-- SCHEDULE-BANNER-START -->
> **📅 Study window:** 13 Dec 2026 – 3 Jan 2027 (Days 119–140)
> **⏰ Your slots (IST):** Mon–Fri **7:30–8:30pm** & **9:00–10:00pm** · Sat–Sun **9:00am–12:00pm**, **3:00–5:30pm**, **6:00–8:30pm**
> **📧 Calendar reminders:** harsh.gupta@getreelax.com — import `calendar/mern-mastery-study.ics`
<!-- SCHEDULE-BANNER-END -->

> SOLID principles, design patterns, and full TypeScript implementations for classic interview problems.

---

## Table of Contents

1. [LLD Interview Process](#1-lld-interview-process)
2. [SOLID Principles](#2-solid-principles)
3. [Design Patterns](#3-design-patterns)
4. [LRU Cache](#4-lru-cache)
5. [Parking Lot System](#5-parking-lot-system)
6. [Rate Limiter](#6-rate-limiter)
7. [Splitwise (Expense Sharing)](#7-splitwise-expense-sharing)
8. [BookMyShow (Ticket Booking)](#8-bookmyshow-ticket-booking)
9. [Interview Q&A](#9-interview-qa)
10. [Practice Resources](#10-practice-resources)

---

## 1. LLD Interview Process

### Timeline (45–60 Minutes)

```
0–5 min    Clarify requirements, ask questions
5–10 min   Identify entities, relationships, enums
10–15 min  Draw class diagram (text/whiteboard)
15–40 min  Code core classes and main flows
40–50 min  Handle edge cases, extensibility
50–60 min  Discuss trade-offs, testing, scale
```

### Questions to Ask

- How many users / concurrent requests?
- Single instance or distributed?
- Persistence needed or in-memory OK?
- What are the core use cases vs nice-to-have?
- Error handling expectations?
- Thread safety required?

### Evaluation Criteria

| Area | What Interviewers Look For |
|------|---------------------------|
| Requirements | Clarifying questions, scope control |
| Design | Clean abstractions, appropriate patterns |
| Code | Working logic, readable TypeScript/Java |
| Extensibility | Open for new types without rewriting |
| Communication | Explaining trade-offs clearly |

---

## 2. SOLID Principles

### S — Single Responsibility Principle

> A class should have only one reason to change.

```typescript
// ❌ Bad: User class handles auth AND persistence AND email
class User {
  login() { /* ... */ }
  saveToDB() { /* ... */ }
  sendWelcomeEmail() { /* ... */ }
}

// ✅ Good: Separate concerns
class AuthService { login(user: User): Token { /* ... */ } }
class UserRepository { save(user: User): void { /* ... */ } }
class EmailService { sendWelcome(user: User): void { /* ... */ } }
```

### O — Open/Closed Principle

> Open for extension, closed for modification.

```typescript
interface PaymentProcessor {
  process(amount: number): boolean;
}

class CreditCardProcessor implements PaymentProcessor {
  process(amount: number) { /* stripe */ return true; }
}

class UPIProcessor implements PaymentProcessor {
  process(amount: number) { /* razorpay */ return true; }
}

class PaymentService {
  constructor(private processor: PaymentProcessor) {}
  checkout(amount: number) { return this.processor.process(amount); }
}
// Add new payment method without changing PaymentService
```

### L — Liskov Substitution Principle

> Subtypes must be substitutable for base types.

```typescript
abstract class Bird {
  abstract move(): void;
}

class Sparrow extends Bird {
  move() { console.log("Flying"); }
}

class Penguin extends Bird {
  move() { console.log("Swimming"); } // ✅ Both can "move"
}
// ❌ Don't put fly() on Bird if Penguin can't fly
```

### I — Interface Segregation Principle

> Clients shouldn't depend on interfaces they don't use.

```typescript
interface Readable { read(): string; }
interface Writable { write(data: string): void; }

class FileReader implements Readable {
  read() { return "content"; }
}

class FileWriter implements Writable {
  write(data: string) { /* ... */ }
}
// Not one fat IFile interface with read+write+delete+compress
```

### D — Dependency Inversion Principle

> Depend on abstractions, not concretions.

```typescript
interface Cache {
  get(key: string): string | null;
  set(key: string, value: string): void;
}

class RedisCache implements Cache { /* ... */ }
class InMemoryCache implements Cache { /* ... */ }

class UserService {
  constructor(private cache: Cache) {} // injected abstraction
}
```

---

## 3. Design Patterns

### Creational

| Pattern | Use Case | Example |
|---------|----------|---------|
| **Singleton** | One instance (DB pool, config) | Logger, RateLimiter |
| **Factory** | Create objects without specifying class | VehicleFactory |
| **Builder** | Complex object step-by-step | SQL query builder |

```typescript
// Singleton
class DatabaseConnection {
  private static instance: DatabaseConnection;
  private constructor() {}
  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }
}
```

### Structural

| Pattern | Use Case | Example |
|---------|----------|---------|
| **Adapter** | Make incompatible interfaces work | Payment gateway wrapper |
| **Decorator** | Add behavior dynamically | CachedRepository wraps DB |
| **Facade** | Simplified interface to subsystem | BookingFacade |

### Behavioral

| Pattern | Use Case | Example |
|---------|----------|---------|
| **Strategy** | Swap algorithms at runtime | PricingStrategy |
| **Observer** | Notify subscribers on event | OrderStatusNotifier |
| **Command** | Encapsulate request as object | Undo/redo operations |

```typescript
// Strategy Pattern
interface PricingStrategy {
  calculate(basePrice: number): number;
}

class RegularPricing implements PricingStrategy {
  calculate(base: number) { return base; }
}

class PremiumPricing implements PricingStrategy {
  calculate(base: number) { return base * 0.8; }
}

class PriceCalculator {
  constructor(private strategy: PricingStrategy) {}
  getPrice(base: number) { return this.strategy.calculate(base); }
}
```

---

## 4. LRU Cache

### Requirements

- Fixed capacity
- `get(key)` — return value, mark as recently used; -1 if missing
- `put(key, value)` — insert/update; evict LRU if at capacity
- Both operations O(1)

### Class Diagram (Text)

```
┌─────────────────┐
│    LRUCache     │
├─────────────────┤
│ - capacity: int │
│ - map: Map      │──────► HashMap: key → Node
│ - head: Node    │        Doubly Linked List (MRU ↔ LRU)
│ - tail: Node    │
├─────────────────┤
│ + get(key)      │
│ + put(key,val)  │
│ - moveToHead()  │
│ - removeNode()  │
│ - evictLRU()    │
└─────────────────┘

┌──────────┐
│   Node   │
├──────────┤
│ key      │
│ value    │
│ prev     │
│ next     │
└──────────┘
```

### Full TypeScript Implementation

```typescript
class DLLNode {
  key: number;
  value: number;
  prev: DLLNode | null = null;
  next: DLLNode | null = null;

  constructor(key: number, value: number) {
    this.key = key;
    this.value = value;
  }
}

class LRUCache {
  private capacity: number;
  private map = new Map<number, DLLNode>();
  private head: DLLNode;
  private tail: DLLNode;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.head = new DLLNode(0, 0);
    this.tail = new DLLNode(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: number): number {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key)!;
    this.moveToHead(node);
    return node.value;
  }

  put(key: number, value: number): void {
    if (this.map.has(key)) {
      const node = this.map.get(key)!;
      node.value = value;
      this.moveToHead(node);
      return;
    }

    const node = new DLLNode(key, value);
    this.map.set(key, node);
    this.addToHead(node);

    if (this.map.size > this.capacity) {
      const lru = this.removeTail();
      this.map.delete(lru.key);
    }
  }

  private addToHead(node: DLLNode): void {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  private removeNode(node: DLLNode): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  private moveToHead(node: DLLNode): void {
    this.removeNode(node);
    this.addToHead(node);
  }

  private removeTail(): DLLNode {
    const node = this.tail.prev!;
    this.removeNode(node);
    return node;
  }
}
```

**Complexity:** get O(1), put O(1) | Space O(capacity)

---

## 5. Parking Lot System

### Requirements

- Multiple floors, multiple spot types (compact, large, handicapped)
- Park vehicle (car, motorcycle, truck)
- Unpark vehicle, calculate fee
- Display availability
- Spot assignment: nearest available compatible spot

### Class Diagram (Text)

```
         ┌──────────────┐
         │ ParkingLot  │ (Singleton)
         ├──────────────┤
         │ - floors[]   │
         ├──────────────┤
         │ + park()     │
         │ + unpark()   │
         │ + availability()
         └──────┬───────┘
                │ 1..*
         ┌──────▼───────┐
         │    Floor     │
         ├──────────────┤
         │ - level: int │
         │ - spots[]    │
         └──────┬───────┘
                │ 1..*
         ┌──────▼───────┐
         │ ParkingSpot  │
         ├──────────────┤
         │ - id         │
         │ - type       │
         │ - vehicle    │
         ├──────────────┤
         │ + canFit()   │
         │ + park()     │
         │ + unpark()   │
         └──────────────┘

┌────────────┐     ┌─────────────┐
│  Vehicle   │◄────│ Car/Motor/  │
│ (abstract) │     │ Truck       │
├────────────┤     └─────────────┘
│ - plate    │
│ - type     │
└────────────┘

┌──────────────┐
│ Ticket       │
├──────────────┤
│ - id         │
│ - entryTime  │
│ - spot       │
│ - vehicle    │
└──────────────┘
```

### TypeScript Implementation (Core)

```typescript
enum SpotType { COMPACT, LARGE, HANDICAPPED }
enum VehicleType { MOTORCYCLE, CAR, TRUCK }

abstract class Vehicle {
  constructor(public plate: string, public type: VehicleType) {}
}

class Car extends Vehicle {
  constructor(plate: string) { super(plate, VehicleType.CAR); }
}

class ParkingSpot {
  vehicle: Vehicle | null = null;
  constructor(public id: string, public type: SpotType) {}

  canFit(vehicle: Vehicle): boolean {
    if (this.vehicle) return false;
    if (vehicle.type === VehicleType.MOTORCYCLE) return true;
    if (vehicle.type === VehicleType.CAR)
      return this.type === SpotType.COMPACT || this.type === SpotType.LARGE;
    if (vehicle.type === VehicleType.TRUCK) return this.type === SpotType.LARGE;
    return false;
  }

  park(vehicle: Vehicle): boolean {
    if (!this.canFit(vehicle)) return false;
    this.vehicle = vehicle;
    return true;
  }

  unpark(): Vehicle | null {
    const v = this.vehicle;
    this.vehicle = null;
    return v;
  }
}

class Floor {
  constructor(public level: number, public spots: ParkingSpot[]) {}

  findSpot(vehicle: Vehicle): ParkingSpot | null {
    return this.spots.find(s => s.canFit(vehicle)) ?? null;
  }
}

class Ticket {
  constructor(
    public id: string,
    public vehicle: Vehicle,
    public spot: ParkingSpot,
    public entryTime: Date = new Date()
  ) {}
}

class ParkingLot {
  private static instance: ParkingLot;
  private tickets = new Map<string, Ticket>();

  private constructor(public floors: Floor[]) {}

  static getInstance(floors?: Floor[]): ParkingLot {
    if (!ParkingLot.instance) {
      if (!floors) throw new Error("Initialize with floors first");
      ParkingLot.instance = new ParkingLot(floors);
    }
    return ParkingLot.instance;
  }

  park(vehicle: Vehicle): Ticket | null {
    for (const floor of this.floors) {
      const spot = floor.findSpot(vehicle);
      if (spot?.park(vehicle)) {
        const ticket = new Ticket(crypto.randomUUID(), vehicle, spot);
        this.tickets.set(ticket.id, ticket);
        return ticket;
      }
    }
    return null;
  }

  unpark(ticketId: string): number {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) throw new Error("Invalid ticket");
    ticket.spot.unpark();
    this.tickets.delete(ticketId);
    const hours = (Date.now() - ticket.entryTime.getTime()) / 3600000;
    return Math.ceil(hours) * 50; // ₹50 per hour
  }
}
```

---

## 6. Rate Limiter

### Requirements

- Limit requests per user/IP per time window
- Algorithms: Fixed Window, Sliding Window, Token Bucket
- `allowRequest(clientId): boolean`
- Thread-safe for concurrent access

### Class Diagram (Text)

```
┌──────────────────┐
│  RateLimiter     │ (interface)
├──────────────────┤
│ + allow(id): bool│
└────────┬─────────┘
         │
    ┌────┴────────────────┐
    │                     │
┌───▼──────────┐  ┌───────▼──────────┐
│ TokenBucket  │  │ SlidingWindow    │
├──────────────┤  ├──────────────────┤
│ - capacity   │  │ - windowMs       │
│ - tokens     │  │ - maxRequests    │
│ - refillRate │  │ - requestLog     │
└──────────────┘  └──────────────────┘
```

### Token Bucket Implementation

```typescript
class TokenBucketLimiter {
  private buckets = new Map<string, { tokens: number; lastRefill: number }>();

  constructor(
    private capacity: number,
    private refillRate: number // tokens per second
  ) {}

  allowRequest(clientId: string): boolean {
    const now = Date.now();
    let bucket = this.buckets.get(clientId);

    if (!bucket) {
      bucket = { tokens: this.capacity, lastRefill: now };
      this.buckets.set(clientId, bucket);
    }

    const elapsed = (now - bucket.lastRefill) / 1000;
    bucket.tokens = Math.min(this.capacity, bucket.tokens + elapsed * this.refillRate);
    bucket.lastRefill = now;

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return true;
    }
    return false;
  }
}

// Middleware usage
function rateLimitMiddleware(limiter: TokenBucketLimiter) {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip ?? "unknown";
    if (!limiter.allowRequest(clientId)) {
      return res.status(429).json({ error: "Too many requests" });
    }
    next();
  };
}
```

### Sliding Window Log

```typescript
class SlidingWindowLimiter {
  private logs = new Map<string, number[]>();

  constructor(
    private windowMs: number,
    private maxRequests: number
  ) {}

  allowRequest(clientId: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    let timestamps = this.logs.get(clientId) ?? [];
    timestamps = timestamps.filter(t => t > windowStart);

    if (timestamps.length >= this.maxRequests) {
      this.logs.set(clientId, timestamps);
      return false;
    }

    timestamps.push(now);
    this.logs.set(clientId, timestamps);
    return true;
  }
}
```

---

## 7. Splitwise (Expense Sharing)

### Requirements

- Users, groups
- Add expense: equal split, exact amounts, percentage
- Show balances between users
- Simplify debts (minimize transactions)

### Class Diagram (Text)

```
┌──────────┐     ┌───────────┐     ┌──────────┐
│  User    │◄────│   Group   │────►│ Expense  │
├──────────┤     ├───────────┤     ├──────────┤
│ - id     │     │ - id      │     │ - id     │
│ - name   │     │ - members │     │ - amount │
└──────────┘     └───────────┘     │ - paidBy │
                                   │ - splits │
                                   └──────────┘

┌───────────────────┐
│ ExpenseService    │
├───────────────────┤
│ + addExpense()    │
│ + getBalances()   │
│ + simplifyDebts() │
└───────────────────┘
```

### TypeScript Implementation

```typescript
enum SplitType { EQUAL, EXACT, PERCENTAGE }

interface Split {
  userId: string;
  amount: number;
}

class Expense {
  constructor(
    public id: string,
    public groupId: string,
    public paidBy: string,
    public totalAmount: number,
    public splits: Split[],
    public description: string
  ) {}
}

class ExpenseService {
  private expenses: Expense[] = [];
  // balanceMap: debtor → creditor → amount owed
  private balances = new Map<string, Map<string, number>>();

  addExpense(
    groupId: string,
    paidBy: string,
    totalAmount: number,
    splitType: SplitType,
    participants: string[],
    customSplits?: Split[]
  ): Expense {
    let splits: Split[];

    switch (splitType) {
      case SplitType.EQUAL:
        const share = totalAmount / participants.length;
        splits = participants.map(id => ({ userId: id, amount: share }));
        break;
      case SplitType.EXACT:
        splits = customSplits!;
        break;
      case SplitType.PERCENTAGE:
        splits = customSplits!.map(s => ({
          userId: s.userId,
          amount: (s.amount / 100) * totalAmount,
        }));
        break;
    }

    const expense = new Expense(
      crypto.randomUUID(), groupId, paidBy, totalAmount, splits, ""
    );
    this.expenses.push(expense);
    this.updateBalances(paidBy, splits);
    return expense;
  }

  private updateBalances(paidBy: string, splits: Split[]): void {
    for (const split of splits) {
      if (split.userId === paidBy) continue;
      this.addDebt(split.userId, paidBy, split.amount);
    }
  }

  private addDebt(from: string, to: string, amount: number): void {
    if (!this.balances.has(from)) this.balances.set(from, new Map());
    const debts = this.balances.get(from)!;
    debts.set(to, (debts.get(to) ?? 0) + amount);
  }

  simplifyDebts(): { from: string; to: string; amount: number }[] {
    const net = new Map<string, number>();

    for (const [debtor, creditors] of this.balances) {
      for (const [creditor, amount] of creditors) {
        net.set(debtor, (net.get(debtor) ?? 0) - amount);
        net.set(creditor, (net.get(creditor) ?? 0) + amount);
      }
    }

    const debtors = [...net.entries()].filter(([, v]) => v < 0).sort((a, b) => a[1] - b[1]);
    const creditors = [...net.entries()].filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);

    const result: { from: string; to: string; amount: number }[] = [];
    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
      const amount = Math.min(-debtors[i][1], creditors[j][1]);
      result.push({ from: debtors[i][0], to: creditors[j][0], amount });
      debtors[i][1] += amount;
      creditors[j][1] -= amount;
      if (debtors[i][1] === 0) i++;
      if (creditors[j][1] === 0) j++;
    }
    return result;
  }
}
```

---

## 8. BookMyShow (Ticket Booking)

### Requirements

- Cities, cinemas, screens, shows
- Seat layout with types (silver, gold, platinum)
- Concurrent booking — no double booking
- Lock seats temporarily (5 min hold)
- Payment confirmation

### Class Diagram (Text)

```
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌──────────┐
│  City   │──►│ Cinema  │──►│ Screen  │──►│   Show   │
└─────────┘   └─────────┘   └─────────┘   └────┬─────┘
                                               │
                                          ┌────▼─────┐
                                          │  Seat    │
                                          ├──────────┤
                                          │ - row    │
                                          │ - number │
                                          │ - type   │
                                          │ - status │
                                          └──────────┘

┌───────────────┐     ┌──────────────┐
│ BookingService│────►│ SeatLock     │
├───────────────┤     ├──────────────┤
│ + searchShows │     │ - showId     │
│ + lockSeats   │     │ - seatIds    │
│ + confirm     │     │ - expiresAt  │
│ + cancel      │     └──────────────┘
└───────────────┘

enum SeatStatus { AVAILABLE, LOCKED, BOOKED }
```

### TypeScript Implementation (Core)

```typescript
enum SeatStatus { AVAILABLE, LOCKED, BOOKED }
enum SeatType { SILVER, GOLD, PLATINUM }

class Seat {
  status: SeatStatus = SeatStatus.AVAILABLE;
  constructor(
    public id: string,
    public row: number,
    public number: number,
    public type: SeatType
  ) {}
}

class Show {
  seats: Seat[];
  constructor(
    public id: string,
    public movieId: string,
    public startTime: Date,
    seatLayout: Seat[]
  ) {
    this.seats = seatLayout;
  }

  getAvailableSeats(): Seat[] {
    return this.seats.filter(s => s.status === SeatStatus.AVAILABLE);
  }
}

class SeatLock {
  constructor(
    public lockId: string,
    public showId: string,
    public seatIds: string[],
    public userId: string,
    public expiresAt: Date
  ) {}

  isExpired(): boolean {
    return Date.now() > this.expiresAt.getTime();
  }
}

class BookingService {
  private locks = new Map<string, SeatLock>();
  private shows = new Map<string, Show>();

  lockSeats(showId: string, seatIds: string[], userId: string): SeatLock | null {
    const show = this.shows.get(showId);
    if (!show) return null;

    // Atomic check — in production use DB transaction + row lock
    for (const seatId of seatIds) {
      const seat = show.seats.find(s => s.id === seatId);
      if (!seat || seat.status !== SeatStatus.AVAILABLE) return null;
    }

    for (const seatId of seatIds) {
      const seat = show.seats.find(s => s.id === seatId)!;
      seat.status = SeatStatus.LOCKED;
    }

    const lock = new SeatLock(
      crypto.randomUUID(),
      showId,
      seatIds,
      userId,
      new Date(Date.now() + 5 * 60 * 1000)
    );
    this.locks.set(lock.lockId, lock);
    return lock;
  }

  confirmBooking(lockId: string, paymentId: string): boolean {
    const lock = this.locks.get(lockId);
    if (!lock || lock.isExpired()) {
      this.releaseLock(lockId);
      return false;
    }

    const show = this.shows.get(lock.showId)!;
    for (const seatId of lock.seatIds) {
      const seat = show.seats.find(s => s.id === seatId)!;
      seat.status = SeatStatus.BOOKED;
    }
    this.locks.delete(lockId);
    return true;
  }

  releaseLock(lockId: string): void {
    const lock = this.locks.get(lockId);
    if (!lock) return;
    const show = this.shows.get(lock.showId);
    if (show) {
      for (const seatId of lock.seatIds) {
        const seat = show.seats.find(s => s.id === seatId);
        if (seat?.status === SeatStatus.LOCKED) seat.status = SeatStatus.AVAILABLE;
      }
    }
    this.locks.delete(lockId);
  }
}
```

**Concurrency note:** Production systems use Redis distributed locks or DB `SELECT FOR UPDATE`.

---

## 9. Interview Q&A

**Q: When to use Singleton?**
A: When exactly one instance is needed (config, connection pool). Be cautious in distributed systems — use external singleton (Redis, DB).

**Q: Strategy vs Factory pattern?**
A: Factory creates objects; Strategy selects algorithm/behavior at runtime. Often used together.

**Q: How to handle concurrency in seat booking?**
A: Optimistic locking (version field), pessimistic locking (DB row lock), distributed locks (Redis Redlock), or queue-based serialization.

**Q: LRU Cache — why doubly linked list + hash map?**
A: Map gives O(1) lookup; DLL gives O(1) insert/remove at any position for move-to-front and evict-from-back.

**Q: How to extend Parking Lot for electric charging spots?**
A: Add `ElectricSpot extends ParkingSpot` or new SpotType enum value; override `canFit()` if needed. Open/Closed principle.

**Q: Token Bucket vs Sliding Window rate limiter?**
A: Token bucket allows bursts (smooth refill); sliding window is precise per window but uses more memory (stores timestamps).

---

## 10. Practice Resources

| Resource | URL | Focus |
|----------|-----|-------|
| InterviewReady LLD | Various playlists | Parking Lot, Elevator |
| GitHub LLD Solutions | Search "machine coding" | TypeScript/Java repos |
| Educative Grokking LLD | [educative.io](https://www.educative.io) | Structured course |
| LeetCode Discuss | LLD tagged posts | Community solutions |

### Practice Problems

1. LRU Cache (implement from scratch in 20 min)
2. Parking Lot with 3 vehicle types
3. Rate Limiter — Token Bucket + middleware
4. Splitwise with debt simplification
5. BookMyShow with seat locking
6. Elevator System
7. Vending Machine (state pattern)
8. Logger (Singleton + strategy for appenders)
9. Tic-Tac-Toe / Chess (OOP design)
10. Library Management System

---

## Quick Reference

```
SOLID → Single responsibility, Open/closed, Liskov, Interface segregation, Dependency inversion
Patterns → Singleton, Factory, Strategy, Observer most common in LLD
Process → Clarify → Entities → Diagram → Code → Edge cases → Trade-offs
Always → Ask questions, start simple, extensible enums/interfaces
```
