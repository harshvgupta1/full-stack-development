# Machine Coding Round — Complete Guide for 80 LPA Interviews

<!-- SCHEDULE-BANNER-START -->
> **📅 Study window:** 12 Dec 2026 – 3 Jan 2027 (Days 118–140)
> **⏰ Your slots (IST):** Mon–Fri **7:30–8:30pm** & **9:00–10:00pm** · Sat–Sun **9:00am–12:00pm**, **3:00–5:30pm**, **6:00–8:30pm**
> **📧 Calendar reminders:** harsh.gupta@getreelax.com — import `calendar/mern-mastery-study.ics`
<!-- SCHEDULE-BANNER-END -->

> 90-minute machine coding rounds at Google L5, Meta E5, Amazon L6, and top Indian product companies (80+ LPA). Full implementations, SOLID principles, and evaluation criteria.

---

## Table of Contents

1. [What Is Machine Coding at 80 LPA Companies?](#1-what-is-machine-coding-at-80-lpa-companies)
2. [The 90-Minute Approach Framework](#2-the-90-minute-approach-framework)
3. [Problem 1: Parking Lot (Multi-Floor, Multiple Vehicle Types)](#3-problem-1-parking-lot)
4. [Problem 2: In-Memory Rate Limiter (Sliding Window)](#4-problem-2-in-memory-rate-limiter)
5. [Problem 3: LRU Cache](#5-problem-3-lru-cache)
6. [Problem 4: Snake & Ladder](#6-problem-4-snake--ladder)
7. [Problem 5: Splitwise Expense Splitting](#7-problem-5-splitwise-expense-splitting)
8. [Problem 6: BookMyShow Seat Booking with Locking](#8-problem-6-bookmyshow-seat-booking)
9. [Problem 7: Elevator System](#9-problem-7-elevator-system)
10. [Problem 8: Vending Machine (State Pattern)](#10-problem-8-vending-machine)
11. [Evaluation Criteria Interviewers Use](#11-evaluation-criteria)
12. [10 Machine Coding Interview Q&A](#12-10-machine-coding-interview-qa)
13. [Frontend machine coding (1 CR)](#13-frontend-machine-coding-1-cr)

---

## 1. What Is Machine Coding at 80 LPA Companies?

### Definition

Machine coding (also called **Low-Level Design + Live Coding**) is a 60–90 minute round where you build a **working, runnable system** from scratch — not pseudocode, not just class diagrams. You write real code (TypeScript/Java/Python) that handles core flows, edge cases, and extensibility.

### Where It Appears

| Company Tier | Round Name | Duration | Expectation |
|-------------|------------|----------|-------------|
| Google L5 | LLD / Coding Design | 45–60 min | Clean OOP, extensible design |
| Meta E5 | Product Architecture | 60 min | Working code + trade-offs |
| Amazon L6 | OOD + Coding | 90 min | SOLID, patterns, test cases |
| Flipkart SDE-3 | Machine Coding | 90 min | Full working system |
| Razorpay / Swiggy / PhonePe | LLD Round | 60–90 min | Production-quality code |
| Uber / Goldman | OOD Round | 60 min | Design + implement core path |

### What Makes 80 LPA Different from 20 LPA

At 80 LPA (roughly Google L5 / Meta E5 / Staff at Indian unicorns), interviewers expect:

1. **Requirements clarification** — You ask 5–10 sharp questions before coding
2. **API-first design** — Public interfaces defined before internals
3. **Working code** — At least the happy path runs without bugs
4. **SOLID + patterns** — Not over-engineered, but clearly applied
5. **Edge cases** — Null checks, concurrency awareness, overflow
6. **Extensibility** — "What if we add a new vehicle type?" answered in design
7. **Communication** — Think aloud; interviewer is a collaborator
8. **Testing mindset** — Mention or write 2–3 test cases

### Common Problems (Frequency at 80 LPA)

| Problem | Frequency | Key Pattern |
|---------|-----------|---------------|
| Parking Lot | Very High | Strategy + Factory |
| Rate Limiter | Very High | Sliding Window / Token Bucket |
| LRU Cache | High | HashMap + Doubly Linked List |
| Splitwise | High | Graph / Balance Sheet |
| BookMyShow | High | Locking / Seat Map |
| Snake & Ladder | Medium | State Machine |
| Elevator | Medium | Scheduler / Strategy |
| Vending Machine | Medium | State Pattern |
| Tic-Tac-Toe | Medium | Strategy |
| Chess (basic) | Low | Command Pattern |

---

## 2. The 90-Minute Approach Framework

### Phase 1: Requirements (0–10 min)

```
ASK:
├── Functional: What operations? Who are the actors?
├── Non-functional: Scale? Concurrency? Persistence?
├── Scope: What's IN vs OUT for this round?
├── Edge cases: Empty input? Duplicate? Overflow?
└── API shape: REST endpoints or class methods?
```

**Template questions:**

- "Should this be in-memory or persisted?"
- "Do we need thread safety / concurrent access?"
- "What's the expected scale — single machine or distributed?"
- "Can I assume a single user or multi-user?"
- "Should I prioritize correctness or also discuss scaling?"

### Phase 2: API Design (10–20 min)

Draw or write public interfaces first:

```typescript
// Example: Parking Lot API surface
interface ParkingLotService {
  parkVehicle(vehicle: Vehicle): Ticket | null;
  unparkVehicle(ticket: Ticket): number; // returns fee
  getAvailableSpots(floor?: number): SpotCount;
}
```

**Rules:**
- Define enums (`VehicleType`, `SpotType`) before classes
- Use interfaces for abstractions (`PricingStrategy`, `SpotAllocator`)
- Name methods as verbs: `bookSeat`, `releaseSeat`, `calculateFee`

### Phase 3: Code (20–70 min)

```
Priority order:
1. Core entities (Vehicle, Spot, Ticket)
2. Main flow (park → assign spot → return ticket)
3. Secondary flows (unpark, fee calculation)
4. Edge cases (lot full, invalid ticket)
5. Extensibility hooks (new vehicle type)
```

**Coding discipline:**
- Start with types/enums
- One class per file mentally (even if one buffer)
- No premature optimization
- Use `Map`/`Set` over arrays for O(1) lookup

### Phase 4: Test (70–85 min)

```typescript
// Always mention or write:
describe('ParkingLot', () => {
  it('parks car when spot available', () => { /* ... */ });
  it('returns null when lot full', () => { /* ... */ });
  it('calculates correct fee on unpark', () => { /* ... */ });
});
```

### Phase 5: Trade-offs (85–90 min)

- "For production I'd add Redis for distributed locking"
- "I'd persist tickets to DB with optimistic locking"
- "Rate limiter would use Redis ZSET for multi-instance"

---

## 3. Problem 1: Parking Lot

### Requirements

- Multi-floor parking lot
- Vehicle types: Motorcycle, Car, Truck (each needs different spot size)
- Operations: park, unpark, get availability
- Fee based on duration and vehicle type
- Return null / error when full

### SOLID Mapping

| Principle | Application |
|-----------|-------------|
| **S** | `SpotAllocator` only assigns spots; `FeeCalculator` only computes fees |
| **O** | New vehicle types via `VehicleType` enum + strategy without changing allocator |
| **L** | All spots implement `ParkingSpot` interface |
| **I** | Separate `ReadableLot` (availability) from `WritableLot` (park/unpark) |
| **D** | `ParkingLotService` depends on `FeeStrategy` interface, not concrete class |

### Full Implementation

```typescript
enum VehicleType {
  MOTORCYCLE = 'MOTORCYCLE',
  CAR = 'CAR',
  TRUCK = 'TRUCK',
}

enum SpotType {
  SMALL = 'SMALL',    // motorcycle
  MEDIUM = 'MEDIUM',  // car
  LARGE = 'LARGE',    // truck
}

interface Vehicle {
  id: string;
  type: VehicleType;
  licensePlate: string;
}

interface Ticket {
  id: string;
  vehicleId: string;
  spotId: string;
  floor: number;
  entryTime: Date;
}

interface ParkingSpot {
  id: string;
  floor: number;
  type: SpotType;
  isOccupied: boolean;
  park(vehicle: Vehicle): Ticket;
  unpark(): Vehicle | null;
}

class ConcreteSpot implements ParkingSpot {
  id: string;
  floor: number;
  type: SpotType;
  isOccupied = false;
  private vehicle: Vehicle | null = null;

  constructor(id: string, floor: number, type: SpotType) {
    this.id = id;
    this.floor = floor;
    this.type = type;
  }

  park(vehicle: Vehicle): Ticket {
    if (this.isOccupied) throw new Error('Spot already occupied');
    this.vehicle = vehicle;
    this.isOccupied = true;
    return {
      id: `TKT-${Date.now()}`,
      vehicleId: vehicle.id,
      spotId: this.id,
      floor: this.floor,
      entryTime: new Date(),
    };
  }

  unpark(): Vehicle | null {
    const v = this.vehicle;
    this.vehicle = null;
    this.isOccupied = false;
    return v;
  }
}

// Strategy: vehicle → required spot type
const VEHICLE_SPOT_MAP: Record<VehicleType, SpotType> = {
  [VehicleType.MOTORCYCLE]: SpotType.SMALL,
  [VehicleType.CAR]: SpotType.MEDIUM,
  [VehicleType.TRUCK]: SpotType.LARGE,
};

interface FeeStrategy {
  calculate(ticket: Ticket, exitTime: Date, vehicleType: VehicleType): number;
}

class HourlyFeeStrategy implements FeeStrategy {
  private rates: Record<VehicleType, number> = {
    [VehicleType.MOTORCYCLE]: 20,
    [VehicleType.CAR]: 40,
    [VehicleType.TRUCK]: 60,
  };

  calculate(ticket: Ticket, exitTime: Date, vehicleType: VehicleType): number {
    const hours = Math.ceil(
      (exitTime.getTime() - ticket.entryTime.getTime()) / (1000 * 60 * 60)
    );
    return hours * this.rates[vehicleType];
  }
}

class SpotAllocator {
  constructor(private spots: ParkingSpot[]) {}

  findSpot(vehicleType: VehicleType): ParkingSpot | null {
    const required = VEHICLE_SPOT_MAP[vehicleType];
    // Truck can use large OR medium (fallback)
    const candidates = vehicleType === VehicleType.TRUCK
      ? [SpotType.LARGE, SpotType.MEDIUM]
      : [required];

    for (const spotType of candidates) {
      const spot = this.spots.find(s => !s.isOccupied && s.type === spotType);
      if (spot) return spot;
    }
    return null;
  }
}

class ParkingLot {
  private tickets = new Map<string, Ticket>();
  private ticketToSpot = new Map<string, ParkingSpot>();

  constructor(
    private allocator: SpotAllocator,
    private feeStrategy: FeeStrategy
  ) {}

  park(vehicle: Vehicle): Ticket | null {
    const spot = this.allocator.findSpot(vehicle.type);
    if (!spot) return null;
    const ticket = spot.park(vehicle);
    this.tickets.set(ticket.id, ticket);
    this.ticketToSpot.set(ticket.id, spot);
    return ticket;
  }

  unpark(ticketId: string): { vehicle: Vehicle; fee: number } | null {
    const ticket = this.tickets.get(ticketId);
    const spot = this.ticketToSpot.get(ticketId);
    if (!ticket || !spot) return null;

    const vehicle = spot.unpark();
    if (!vehicle) return null;

    const fee = this.feeStrategy.calculate(ticket, new Date(), vehicle.type);
    this.tickets.delete(ticketId);
    this.ticketToSpot.delete(ticketId);
    return { vehicle, fee };
  }

  getAvailability(): Record<SpotType, number> {
    const counts = { [SpotType.SMALL]: 0, [SpotType.MEDIUM]: 0, [SpotType.LARGE]: 0 };
    for (const spot of this.allocator['spots']) {
      if (!spot.isOccupied) counts[spot.type]++;
    }
    return counts;
  }
}

// Usage
function buildParkingLot(): ParkingLot {
  const spots: ParkingSpot[] = [];
  for (let floor = 1; floor <= 3; floor++) {
    for (let i = 0; i < 10; i++) spots.push(new ConcreteSpot(`F${floor}-S${i}`, floor, SpotType.SMALL));
    for (let i = 0; i < 20; i++) spots.push(new ConcreteSpot(`F${floor}-M${i}`, floor, SpotType.MEDIUM));
    for (let i = 0; i < 5; i++) spots.push(new ConcreteSpot(`F${floor}-L${i}`, floor, SpotType.LARGE));
  }
  return new ParkingLot(new SpotAllocator(spots), new HourlyFeeStrategy());
}
```

### Edge Cases to Mention

- Lot full → return `null`, don't throw
- Invalid ticket on unpark → return `null`
- Truck fallback to medium spot
- Concurrent park on same spot → mention mutex/DB lock in production

---

## 4. Problem 2: In-Memory Rate Limiter

### Requirements

- Limit requests per user/IP to N requests per window (e.g., 100 req/min)
- Sliding window algorithm (not fixed window)
- `isAllowed(key: string): boolean`
- In-memory; mention Redis for production

### SOLID Mapping

| Principle | Application |
|-----------|-------------|
| **S** | `SlidingWindowLimiter` only rate-limits; no HTTP concerns |
| **O** | Swap `SlidingWindowLimiter` for `TokenBucketLimiter` via interface |
| **D** | Controller depends on `RateLimiter` interface |

### Full Implementation — Sliding Window Log

```typescript
interface RateLimiter {
  isAllowed(key: string): boolean;
  getRemaining(key: string): number;
}

class SlidingWindowRateLimiter implements RateLimiter {
  private logs = new Map<string, number[]>(); // key → timestamps

  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}

  isAllowed(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    let timestamps = this.logs.get(key) ?? [];
    // Remove expired entries
    timestamps = timestamps.filter(t => t > windowStart);

    if (timestamps.length >= this.maxRequests) {
      this.logs.set(key, timestamps);
      return false;
    }

    timestamps.push(now);
    this.logs.set(key, timestamps);
    return true;
  }

  getRemaining(key: string): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const timestamps = (this.logs.get(key) ?? []).filter(t => t > windowStart);
    return Math.max(0, this.maxRequests - timestamps.length);
  }
}

// Sliding Window Counter (memory-efficient variant)
class SlidingWindowCounterLimiter implements RateLimiter {
  private windows = new Map<string, { current: Window; previous: Window }>();

  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}

  isAllowed(key: string): boolean {
    const now = Date.now();
    const currentWindowId = Math.floor(now / this.windowMs);
    let entry = this.windows.get(key);

    if (!entry || entry.current.id !== currentWindowId) {
      const previous = entry?.current.id === currentWindowId - 1 ? entry.current : { id: currentWindowId - 1, count: 0 };
      entry = { current: { id: currentWindowId, count: 0 }, previous };
      this.windows.set(key, entry);
    }

    const elapsed = now % this.windowMs;
    const weight = 1 - elapsed / this.windowMs;
    const estimated = entry.current.count + entry.previous.count * weight;

    if (estimated >= this.maxRequests) return false;
    entry.current.count++;
    return true;
  }

  getRemaining(key: string): number {
    return this.maxRequests; // simplified
  }
}

interface Window { id: number; count: number; }

// Middleware usage
function rateLimitMiddleware(limiter: RateLimiter) {
  return (req: { ip: string }, res: { status: (n: number) => { json: (b: object) => void } }, next: () => void) => {
    if (!limiter.isAllowed(req.ip)) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    next();
  };
}
```

### Production Notes

- Redis: `ZADD key score member` + `ZREMRANGEBYSCORE` for sliding window log
- Distributed: all instances share Redis counter
- Add `Retry-After` header on 429

---

## 5. Problem 3: LRU Cache

### Requirements

- `get(key)` and `put(key, value)` in O(1)
- Evict least recently used when capacity exceeded
- Generic over key/value types

### SOLID Mapping

| Principle | Application |
|-----------|-------------|
| **S** | Cache handles storage/eviction only |
| **O** | Pluggable eviction: LRU, LFU via `EvictionPolicy` |
| **L** | Any `EvictionPolicy` implementation interchangeable |

### Full Implementation

```typescript
class LRUNode<K, V> {
  constructor(
    public key: K,
    public value: V,
    public prev: LRUNode<K, V> | null = null,
    public next: LRUNode<K, V> | null = null
  ) {}
}

class LRUCache<K, V> {
  private map = new Map<K, LRUNode<K, V>>();
  private head: LRUNode<K, V>; // dummy head (MRU side)
  private tail: LRUNode<K, V>; // dummy tail (LRU side)

  constructor(private capacity: number) {
    this.head = new LRUNode<K, V>(null as unknown as K, null as unknown as V);
    this.tail = new LRUNode<K, V>(null as unknown as K, null as unknown as V);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: K): V | undefined {
    const node = this.map.get(key);
    if (!node) return undefined;
    this.moveToFront(node);
    return node.value;
  }

  put(key: K, value: V): void {
    const existing = this.map.get(key);
    if (existing) {
      existing.value = value;
      this.moveToFront(existing);
      return;
    }

    const node = new LRUNode(key, value);
    this.map.set(key, node);
    this.addToFront(node);

    if (this.map.size > this.capacity) {
      const lru = this.removeTail();
      this.map.delete(lru.key);
    }
  }

  private moveToFront(node: LRUNode<K, V>): void {
    this.removeNode(node);
    this.addToFront(node);
  }

  private addToFront(node: LRUNode<K, V>): void {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  private removeNode(node: LRUNode<K, V>): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  private removeTail(): LRUNode<K, V> {
    const lru = this.tail.prev!;
    this.removeNode(lru);
    return lru;
  }
}
```

---

## 6. Problem 4: Snake & Ladder

### Requirements

- N players, board size (e.g., 100)
- Snakes and ladders at fixed positions
- Dice roll 1–6, exact finish required to win
- Support multiple dice / custom rules (extensibility)

### SOLID Mapping

| Principle | Application |
|-----------|-------------|
| **S** | `Board` manages positions; `Game` manages turns; `Dice` rolls |
| **O** | Add power-ups via `MoveModifier` without changing `Game` |
| **S** | `Snake` and `Ladder` both implement `BoardEntity` |

### Full Implementation

```typescript
interface BoardEntity {
  apply(position: number): number;
}

class Snake implements BoardEntity {
  constructor(private head: number, private tail: number) {}
  apply(position: number): number {
    return position === this.head ? this.tail : position;
  }
}

class Ladder implements BoardEntity {
  constructor(private bottom: number, private top: number) {}
  apply(position: number): number {
    return position === this.bottom ? this.top : position;
  }
}

class Dice {
  roll(): number {
    return Math.floor(Math.random() * 6) + 1;
  }
}

class Player {
  constructor(public id: string, public name: string, public position = 0) {}
}

enum GameStatus { IN_PROGRESS, WON }

class SnakeLadderGame {
  private players: Player[];
  private currentIndex = 0;
  private status = GameStatus.IN_PROGRESS;
  private entities = new Map<number, BoardEntity>();

  constructor(
    players: Player[],
    private boardSize: number,
    snakes: Array<{ head: number; tail: number }>,
    ladders: Array<{ bottom: number; top: number }>,
    private dice: Dice = new Dice()
  ) {
    this.players = players;
    snakes.forEach(s => this.entities.set(s.head, new Snake(s.head, s.tail)));
    ladders.forEach(l => this.entities.set(l.bottom, new Ladder(l.bottom, l.top)));
  }

  playTurn(): { player: string; roll: number; from: number; to: number; won: boolean } {
    if (this.status === GameStatus.WON) throw new Error('Game over');

    const player = this.players[this.currentIndex];
    const roll = this.dice.roll();
    const from = player.position;

    if (from + roll > this.boardSize) {
      // Exact finish rule: stay put
      this.nextPlayer();
      return { player: player.name, roll, from, to: from, won: false };
    }

    let to = from + roll;
    const entity = this.entities.get(to);
    if (entity) to = entity.apply(to);
    player.position = to;

    const won = to === this.boardSize;
    if (won) this.status = GameStatus.WON;
    else this.nextPlayer();

    return { player: player.name, roll, from, to, won };
  }

  private nextPlayer(): void {
    this.currentIndex = (this.currentIndex + 1) % this.players.length;
  }

  getWinner(): Player | null {
    return this.status === GameStatus.WON
      ? this.players.find(p => p.position === this.boardSize) ?? null
      : null;
  }
}
```

---

## 7. Problem 5: Splitwise Expense Splitting

### Requirements

- Users, groups, expenses
- Split types: equal, exact amounts, percentage
- Track who owes whom
- Simplify debts (optional but impressive)

### SOLID Mapping

| Principle | Application |
|-----------|-------------|
| **S** | `EqualSplitStrategy`, `ExactSplitStrategy` each handle one split type |
| **O** | New split type = new strategy class |
| **D** | `ExpenseService` depends on `SplitStrategy` interface |

### Full Implementation

```typescript
enum SplitType { EQUAL, EXACT, PERCENTAGE }

interface SplitStrategy {
  split(total: number, participants: string[], metadata?: Record<string, number>): Map<string, number>;
}

class EqualSplitStrategy implements SplitStrategy {
  split(total: number, participants: string[]): Map<string, number> {
    const share = total / participants.length;
    return new Map(participants.map(p => [p, share]));
  }
}

class ExactSplitStrategy implements SplitStrategy {
  split(total: number, participants: string[], metadata: Record<string, number> = {}): Map<string, number> {
    const sum = Object.values(metadata).reduce((a, b) => a + b, 0);
    if (Math.abs(sum - total) > 0.01) throw new Error('Exact splits must sum to total');
    return new Map(Object.entries(metadata));
  }
}

class PercentageSplitStrategy implements SplitStrategy {
  split(total: number, participants: string[], metadata: Record<string, number> = {}): Map<string, number> {
    const result = new Map<string, number>();
    for (const p of participants) {
      const pct = metadata[p] ?? 0;
      result.set(p, (pct / 100) * total);
    }
    return result;
  }
}

class Expense {
  constructor(
    public id: string,
    public paidBy: string,
    public amount: number,
    public splits: Map<string, number> // userId → share owed
  ) {}
}

class BalanceSheet {
  private balances = new Map<string, Map<string, number>>(); // from → { to → amount }

  addExpense(expense: Expense): void {
    for (const [userId, share] of expense.splits) {
      if (userId === expense.paidBy) continue;
      this.addDebt(userId, expense.paidBy, share);
    }
  }

  private addDebt(from: string, to: string, amount: number): void {
    if (!this.balances.has(from)) this.balances.set(from, new Map());
    const debts = this.balances.get(from)!;
    debts.set(to, (debts.get(to) ?? 0) + amount);
  }

  getBalances(userId: string): Map<string, number> {
    return this.balances.get(userId) ?? new Map();
  }

  // Greedy debt simplification
  simplify(): Array<{ from: string; to: string; amount: number }> {
    const net = new Map<string, number>();
    for (const [from, debts] of this.balances) {
      for (const [to, amount] of debts) {
        net.set(from, (net.get(from) ?? 0) - amount);
        net.set(to, (net.get(to) ?? 0) + amount);
      }
    }

    const creditors = [...net.entries()].filter(([, v]) => v > 0.01).sort((a, b) => b[1] - a[1]);
    const debtors = [...net.entries()].filter(([, v]) => v < -0.01).sort((a, b) => a[1] - b[1]);
    const result: Array<{ from: string; to: string; amount: number }> = [];

    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const amount = Math.min(-debtors[i][1], creditors[j][1]);
      result.push({ from: debtors[i][0], to: creditors[j][0], amount });
      debtors[i][1] += amount;
      creditors[j][1] -= amount;
      if (Math.abs(debtors[i][1]) < 0.01) i++;
      if (creditors[j][1] < 0.01) j++;
    }
    return result;
  }
}

class ExpenseService {
  private strategies: Record<SplitType, SplitStrategy> = {
    [SplitType.EQUAL]: new EqualSplitStrategy(),
    [SplitType.EXACT]: new ExactSplitStrategy(),
    [SplitType.PERCENTAGE]: new PercentageSplitStrategy(),
  };

  constructor(private balanceSheet: BalanceSheet) {}

  addExpense(
    paidBy: string,
    amount: number,
    participants: string[],
    splitType: SplitType,
    metadata?: Record<string, number>
  ): Expense {
    const splits = this.strategies[splitType].split(amount, participants, metadata);
    const expense = new Expense(`EXP-${Date.now()}`, paidBy, amount, splits);
    this.balanceSheet.addExpense(expense);
    return expense;
  }
}
```

---

## 8. Problem 6: BookMyShow Seat Booking

### Requirements

- Theatre with rows and seats
- Show seat map with available/booked/locked states
- Lock seats for 5 minutes during checkout
- Confirm booking or release lock on timeout
- Prevent double booking

### SOLID Mapping

| Principle | Application |
|-----------|-------------|
| **S** | `SeatLockManager` handles locks; `BookingService` handles bookings |
| **O** | Add premium pricing via `PricingStrategy` |
| **S** | Single responsibility per state transition |

### Full Implementation

```typescript
enum SeatStatus { AVAILABLE, LOCKED, BOOKED }

interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  lockedBy: string | null;
  lockExpiry: Date | null;
}

class SeatLockManager {
  private lockDurationMs: number;

  constructor(lockDurationMinutes = 5) {
    this.lockDurationMs = lockDurationMinutes * 60 * 1000;
  }

  lockSeats(seats: Seat[], userId: string): boolean {
    // Check all available first (atomic intent)
    if (seats.some(s => s.status !== SeatStatus.AVAILABLE)) return false;

    const expiry = new Date(Date.now() + this.lockDurationMs);
    for (const seat of seats) {
      seat.status = SeatStatus.LOCKED;
      seat.lockedBy = userId;
      seat.lockExpiry = expiry;
    }
    return true;
  }

  releaseExpiredLocks(seats: Seat[]): void {
    const now = new Date();
    for (const seat of seats) {
      if (
        seat.status === SeatStatus.LOCKED &&
        seat.lockExpiry &&
        seat.lockExpiry < now
      ) {
        seat.status = SeatStatus.AVAILABLE;
        seat.lockedBy = null;
        seat.lockExpiry = null;
      }
    }
  }

  confirmBooking(seats: Seat[], userId: string): boolean {
    for (const seat of seats) {
      if (seat.status !== SeatStatus.LOCKED || seat.lockedBy !== userId) return false;
      seat.status = SeatStatus.BOOKED;
      seat.lockedBy = null;
      seat.lockExpiry = null;
    }
    return true;
  }

  releaseLocks(seats: Seat[], userId: string): void {
    for (const seat of seats) {
      if (seat.status === SeatStatus.LOCKED && seat.lockedBy === userId) {
        seat.status = SeatStatus.AVAILABLE;
        seat.lockedBy = null;
        seat.lockExpiry = null;
      }
    }
  }
}

class Theatre {
  seats: Seat[];

  constructor(rows: number, seatsPerRow: number) {
    this.seats = [];
    for (let r = 0; r < rows; r++) {
      const rowLabel = String.fromCharCode(65 + r);
      for (let n = 1; n <= seatsPerRow; n++) {
        this.seats.push({
          id: `${rowLabel}${n}`,
          row: rowLabel,
          number: n,
          status: SeatStatus.AVAILABLE,
          lockedBy: null,
          lockExpiry: null,
        });
      }
    }
  }

  getSeatMap(): Seat[] {
    return this.seats.map(s => ({ ...s }));
  }
}

class BookingService {
  constructor(
    private theatre: Theatre,
    private lockManager: SeatLockManager
  ) {}

  lockSeats(seatIds: string[], userId: string): boolean {
    this.lockManager.releaseExpiredLocks(this.theatre.seats);
    const seats = seatIds.map(id => this.theatre.seats.find(s => s.id === id)!);
    if (seats.some(s => !s)) return false;
    return this.lockManager.lockSeats(seats, userId);
  }

  confirmBooking(seatIds: string[], userId: string): boolean {
    const seats = seatIds.map(id => this.theatre.seats.find(s => s.id === id)!);
    return this.lockManager.confirmBooking(seats, userId);
  }

  cancelLock(seatIds: string[], userId: string): void {
    const seats = seatIds.map(id => this.theatre.seats.find(s => s.id === id)!);
    this.lockManager.releaseLocks(seats, userId);
  }
}
```

### Production Notes

- Use Redis `SET key NX EX 300` for distributed seat locks
- DB: `UPDATE seats SET status='LOCKED' WHERE id IN (...) AND status='AVAILABLE'` (optimistic)
- WebSocket to push seat map updates to other users

---

## 9. Problem 7: Elevator System

### Requirements

- Building with N floors and M elevators
- Request: internal (from inside) and external (from floor button)
- Direction: UP, DOWN, IDLE
- Optimize: nearest elevator, SCAN algorithm

### SOLID Mapping

| Principle | Application |
|-----------|-------------|
| **S** | `Scheduler` assigns requests; `Elevator` moves; `Controller` orchestrates |
| **O** | Swap `NearestElevatorStrategy` for `LoadBalancedStrategy` |
| **D** | Controller depends on `ElevatorScheduler` interface |

### Full Implementation

```typescript
enum Direction { UP, DOWN, IDLE }
enum RequestType { INTERNAL, EXTERNAL }

interface ElevatorRequest {
  floor: number;
  direction: Direction;
  type: RequestType;
}

class Elevator {
  id: string;
  currentFloor = 0;
  direction = Direction.IDLE;
  private requests = new Set<number>();

  constructor(id: string) {
    this.id = id;
  }

  addRequest(floor: number): void {
    this.requests.add(floor);
    this.updateDirection();
  }

  private updateDirection(): void {
    if (this.requests.size === 0) {
      this.direction = Direction.IDLE;
      return;
    }
    const targets = [...this.requests].sort((a, b) => a - b);
    if (this.currentFloor < targets[targets.length - 1]) {
      this.direction = Direction.UP;
    } else if (this.currentFloor > targets[0]) {
      this.direction = Direction.DOWN;
    }
  }

  step(): boolean {
    if (this.requests.size === 0) return false;

    if (this.direction === Direction.UP) this.currentFloor++;
    else if (this.direction === Direction.DOWN) this.currentFloor--;

    if (this.requests.has(this.currentFloor)) {
      this.requests.delete(this.currentFloor);
    }

    this.updateDirection();
    return true;
  }

  canServe(request: ElevatorRequest): boolean {
    if (this.direction === Direction.IDLE) return true;
    if (request.direction === Direction.UP && this.direction === Direction.UP) {
      return request.floor >= this.currentFloor;
    }
    if (request.direction === Direction.DOWN && this.direction === Direction.DOWN) {
      return request.floor <= this.currentFloor;
    }
    return false;
  }

  distanceTo(floor: number): number {
    return Math.abs(this.currentFloor - floor);
  }
}

interface ElevatorScheduler {
  assign(request: ElevatorRequest, elevators: Elevator[]): Elevator;
}

class NearestElevatorScheduler implements ElevatorScheduler {
  assign(request: ElevatorRequest, elevators: Elevator[]): Elevator {
    const serving = elevators.filter(e => e.canServe(request));
    const pool = serving.length > 0 ? serving : elevators;
    return pool.reduce((best, e) =>
      e.distanceTo(request.floor) < best.distanceTo(request.floor) ? e : best
    );
  }
}

class ElevatorController {
  constructor(
    private elevators: Elevator[],
    private scheduler: ElevatorScheduler
  ) {}

  requestElevator(floor: number, direction: Direction): Elevator {
    const request: ElevatorRequest = { floor, direction, type: RequestType.EXTERNAL };
    const elevator = this.scheduler.assign(request, this.elevators);
    elevator.addRequest(floor);
    return elevator;
  }

  selectFloor(elevatorId: string, floor: number): void {
    const elevator = this.elevators.find(e => e.id === elevatorId)!;
    elevator.addRequest(floor);
  }

  runStep(): void {
    for (const elevator of this.elevators) {
      elevator.step();
    }
  }
}
```

---

## 10. Problem 8: Vending Machine

### Requirements

- States: Idle, HasMoney, Dispensing, OutOfStock
- Accept coins/notes, select product, dispense change
- State pattern for transitions
- Inventory management

### SOLID Mapping

| Principle | Application |
|-----------|-------------|
| **S** | Each state class handles only its transitions |
| **O** | New state = new class, no switch/if chains in machine |
| **D** | `VendingMachine` delegates to `VendingState` interface |

### Full Implementation

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface VendingState {
  insertMoney(machine: VendingMachine, amount: number): void;
  selectProduct(machine: VendingMachine, productId: string): void;
  dispense(machine: VendingMachine): void;
  cancel(machine: VendingMachine): void;
}

class VendingMachine {
  state: VendingState;
  balance = 0;
  selectedProduct: Product | null = null;
  products = new Map<string, Product>();

  constructor() {
    this.state = new IdleState();
  }

  setState(state: VendingState): void {
    this.state = state;
  }

  insertMoney(amount: number): void { this.state.insertMoney(this, amount); }
  selectProduct(id: string): void { this.state.selectProduct(this, id); }
  dispense(): void { this.state.dispense(this); }
  cancel(): void { this.state.cancel(this); }
}

class IdleState implements VendingState {
  insertMoney(machine: VendingMachine, amount: number): void {
    machine.balance += amount;
    machine.setState(new HasMoneyState());
  }
  selectProduct(): void { console.log('Insert money first'); }
  dispense(): void { console.log('Insert money first'); }
  cancel(): void { console.log('Nothing to cancel'); }
}

class HasMoneyState implements VendingState {
  insertMoney(machine: VendingMachine, amount: number): void {
    machine.balance += amount;
  }

  selectProduct(machine: VendingMachine, productId: string): void {
    const product = machine.products.get(productId);
    if (!product || product.quantity === 0) {
      console.log('Product unavailable');
      return;
    }
    if (machine.balance < product.price) {
      console.log('Insufficient balance');
      return;
    }
    machine.selectedProduct = product;
    machine.setState(new DispensingState());
    machine.dispense();
  }

  dispense(): void { console.log('Select a product first'); }

  cancel(machine: VendingMachine): void {
    console.log(`Refunding ${machine.balance}`);
    machine.balance = 0;
    machine.setState(new IdleState());
  }
}

class DispensingState implements VendingState {
  insertMoney(): void { console.log('Dispensing in progress'); }
  selectProduct(): void { console.log('Dispensing in progress'); }

  dispense(machine: VendingMachine): void {
    const product = machine.selectedProduct!;
    product.quantity--;
    const change = machine.balance - product.price;
    console.log(`Dispensed: ${product.name}, Change: ${change}`);
    machine.balance = 0;
    machine.selectedProduct = null;
    machine.setState(new IdleState());
  }

  cancel(): void { console.log('Cannot cancel during dispense'); }
}
```

---

## 11. Evaluation Criteria

### Scoring Rubric (What Interviewers Actually Use)

| Dimension | Weight | Strong Signal | Weak Signal |
|-----------|--------|---------------|-------------|
| **Requirements** | 15% | Asks 5+ clarifying questions, defines scope | Starts coding immediately |
| **Design** | 25% | Clean class diagram, appropriate patterns | God class, no interfaces |
| **Code Quality** | 25% | Readable, typed, no bugs on happy path | Syntax errors, wrong logic |
| **Extensibility** | 15% | Strategy/Factory for variation | Hard-coded if/else chains |
| **Edge Cases** | 10% | Handles null, full, duplicate | Only happy path |
| **Communication** | 10% | Explains trade-offs, thinks aloud | Silent coding |

### Red Flags (Instant Downgrade)

- Cannot run or walk through code
- Everything in one 200-line function
- Ignores interviewer hints
- No questions about requirements
- Over-engineering with 15 classes for simple problem

### Green Flags (L5 / 80 LPA Hire)

- "I'll define the interface first, then implement"
- "For production I'd use Redis here because..."
- Writes code incrementally and tests mentally
- Acknowledges trade-off: "HashMap gives O(1) but uses more memory"
- Handles "what if we add X?" without rewriting

### Senior vs Mid-Level Expectations

| Aspect | Mid-Level (30 LPA) | Senior (80 LPA) |
|--------|-------------------|-----------------|
| Patterns | Knows names | Applies correctly, not excessively |
| Concurrency | Ignores | Mentions locks, race conditions |
| Testing | Skips | Writes or describes test cases |
| Scale | Single machine | Discusses distributed variant |
| Time mgmt | Runs out of time | Delivers core path + extensibility |

---

## 12. 10 Machine Coding Interview Q&A

### Q1: How do you manage time in a 90-minute machine coding round?

**Answer:** I split time rigidly: 10 minutes for requirements and scope, 10 minutes for API/class design, 60 minutes for coding the core path first (happy path always), and 10 minutes for edge cases and trade-off discussion. I never spend more than 15 minutes on design — interviewers want to see code. If I'm running behind at the 45-minute mark, I skip nice-to-haves and verbalize what I'd add later. The core path (e.g., park and unpark for parking lot) must work; secondary features (fee strategies, multi-floor UI) come second.

### Q2: Should I use TypeScript, Java, or Python?

**Answer:** Use whatever the company specifies or what you listed on your resume. For Indian 80 LPA rounds, Java and TypeScript are most common. TypeScript shows frontend/full-stack roles; Java shows backend/OOD strength. Python is acceptable but less common for OOD rounds. Consistency matters more than language — interviewers evaluate design, not syntax. If unspecified, ask: "Is TypeScript OK?" and proceed.

### Q3: How much design do I need before coding?

**Answer:** Define enums, 3–5 core classes, and key interfaces on paper or in comments — roughly 10 minutes. A full UML diagram is overkill; a box diagram with arrows between `ParkingLot`, `SpotAllocator`, and `FeeStrategy` is sufficient. The interviewer wants to see you identify entities (nouns from requirements) and relationships (has-a, uses-a). Start coding as soon as the API surface is clear.

### Q4: What if I can't finish the full implementation?

**Answer:** Prioritize a working core path over incomplete features. A working `park()` and `unpark()` with one vehicle type beats a half-implemented multi-floor system. Explicitly tell the interviewer: "I'll implement the happy path first, then extend for trucks." In the last 10 minutes, walk through unimplemented parts verbally with pseudocode. Interviewers at L5 level evaluate prioritization as much as completion.

### Q5: How do I handle concurrency questions in machine coding?

**Answer:** For in-memory rounds, implement single-threaded logic correctly, then discuss concurrency separately: "In production, I'd use `synchronized` or a `ReentrantLock` around `park()` to prevent double-assignment." For BookMyShow, mention optimistic locking: `UPDATE seats SET status='LOCKED' WHERE id=? AND status='AVAILABLE'`. For rate limiters, mention Redis atomic operations. You don't need to implement locks unless explicitly asked.

### Q6: When should I use design patterns vs keep it simple?

**Answer:** Apply patterns when they solve a stated extensibility requirement, not preemptively. Use Strategy when the prompt says "different pricing models" or "multiple split types." Use State for vending machine or order lifecycle. Use Factory when object creation is complex. Avoid pattern name-dropping without code — interviewers prefer a simple correct solution over FactoryAbstractSingleton chaos. Rule of thumb: if you'd need a switch on type in 3+ places, extract a strategy.

### Q7: How important is running code in the interview?

**Answer:** Very important at companies like Flipkart and Razorpay where you code in their IDE. At Google/Meta, whiteboard or shared doc is common — "running" means walking through with sample input. Always mentally trace: "If I call park(car), spot M1 gets occupied and ticket T1 is returned." If the platform allows, run 2–3 test cases. Syntax errors are forgiven; logic errors are not.

### Q8: How do I extend my solution when the interviewer adds a requirement?

**Answer:** This is intentional — they test Open/Closed Principle. If asked "add electric vehicle charging spots," add `SpotType.CHARGING` and `ChargingFeeStrategy` without modifying `SpotAllocator` core logic. Say: "I'll extend the enum and add a new strategy class." Never rewrite existing working code; extend via new classes. This is exactly what L5 interviewers want to see.

### Q9: What edge cases should I always handle?

**Answer:** Universal edge cases: null/undefined input, empty collections, duplicate operations (double park same vehicle), resource exhaustion (lot full, cache at capacity), invalid state transitions (unpark with invalid ticket), and boundary values (0 floors, 1-item cache). Mention them even if you don't code all: "I should also handle the case where unpark is called twice with the same ticket."

### Q10: How is machine coding different from LeetCode DSA?

**Answer:** DSA tests algorithmic thinking on isolated problems (shortest path, DP). Machine coding tests system building: multiple classes, state management, business rules, and extensibility. DSA answers are optimal when Big-O is correct; machine coding answers are optimal when design is clean and code is maintainable. At 80 LPA, you need both rounds — DSA for screening, machine coding for team matching. Machine coding rewards engineering judgment over mathematical insight.

---

## Quick Reference Checklist

```
Before interview:
□ Practice 8 classic problems timed at 90 min
□ Memorize SOLID one-liner examples
□ Prepare 5 clarifying questions per problem type

During interview:
□ Repeat requirements back to interviewer
□ Write enums and interfaces first
□ Code happy path before edge cases
□ Think aloud continuously
□ Mention production scaling in last 5 min

After coding:
□ Walk through 2 test cases
□ Answer "what would you improve?"
□ Discuss one trade-off you made
```

---

## 13. Frontend machine coding (1 CR)

Atlassian, Uber, Razorpay, and some Google FE loops ask a **working React widget**, not Splitwise. Full list: `20-1cr-product-company-complete.pdf` §6.

### 90-minute FE framework

| Min | Do |
|-----|----|
| 0–10 | Data shape, keyboard, empty/error, mobile? |
| 10–20 | Component tree + TypeScript types + state owner |
| 20–70 | Happy path + one interaction |
| 70–85 | Debounce, loading, empty, basic a11y |
| 85–90 | Virtualize / tests / what you'd do next |

### Must-build (timed, React + TS)

| Widget | Must work |
|--------|-----------|
| Autocomplete | Debounce 200ms, abort in-flight, arrow keys, highlight |
| Infinite scroll | IntersectionObserver, no duplicate pages |
| Tic-tac-toe | Win detect, reset, no stale state |
| Kanban column | Reorder cards in state |
| Nested comments | Reply + collapse |

Put them in `mern-mastery/frontend-mc/`. Do **autocomplete** on Day 139 and a second widget in Phase 7G.

### Autocomplete — what they want to hear

```typescript
function useDebounced<T>(value: T, ms: number) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}
// Fetch: new AbortController() per keystroke; abort previous.
// a11y: role="listbox", aria-activedescendant, input aria-autocomplete="list"
```

**Fail signals:** no debounce (spam API), no loading/empty, `index` as React key, cannot use keyboard.

---

*Target: Google L4–L5, Meta E4–E5, Amazon SDE2–3, Atlassian, Uber — ~1 CR product loops (backend MC + frontend MC).*
