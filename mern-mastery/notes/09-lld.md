# Low-Level Design (LLD) — Notes

---

## SOLID Principles

| Principle | Meaning | Example |
|-----------|---------|---------|
| **S** — Single Responsibility | One class, one reason to change | `UserService` handles users, not emails |
| **O** — Open/Closed | Open for extension, closed for modification | Strategy pattern for payment methods |
| **L** — Liskov Substitution | Subtypes must be substitutable | Square shouldn't break Rectangle API |
| **I** — Interface Segregation | Small specific interfaces | `Readable`, `Writable` not one fat `File` |
| **D** — Dependency Inversion | Depend on abstractions | `PaymentProcessor` interface, not `Stripe` directly |

---

## Design Patterns (must know)

### Creational
- **Singleton** — one instance (DB connection pool)
- **Factory** — create objects without specifying class
- **Builder** — step-by-step complex object construction

### Structural
- **Adapter** — wrap incompatible interface
- **Decorator** — add behavior dynamically
- **Facade** — simplified interface to complex subsystem

### Behavioral
- **Strategy** — interchangeable algorithms (Payment: UPI, Card, Wallet)
- **Observer** — notify subscribers on state change
- **State** — object behavior changes with internal state

---

## LLD Problem 1: LRU Cache

**Requirements:** get(key), put(key, value), O(1) both, fixed capacity

**Design:** HashMap + Doubly Linked List

```typescript
class LRUCache {
  private capacity: number;
  private map = new Map<number, { key: number; value: number }>();
  private head: Node; private tail: Node;

  get(key: number): number {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key)!;
    this.moveToFront(node);
    return node.value;
  }

  put(key: number, value: number): void {
    if (this.map.has(key)) {
      const node = this.map.get(key)!;
      node.value = value;
      this.moveToFront(node);
    } else {
      if (this.map.size >= this.capacity) this.removeLRU();
      const node = { key, value };
      this.map.set(key, node);
      this.addToFront(node);
    }
  }
}
```

---

## LLD Problem 2: Parking Lot

**Entities:** Vehicle (Car, Bike, Truck), ParkingSpot, ParkingFloor, ParkingLot, Ticket

**Patterns:** Factory (create vehicle), Strategy (pricing by vehicle type)

**Key methods:**
- `parkVehicle(vehicle)` → Ticket or null if full
- `unparkVehicle(ticket)` → calculate fee, free spot

---

## LLD Problem 3: Rate Limiter

**Algorithms:**
- **Token Bucket** — tokens refill at fixed rate
- **Sliding Window** — count requests in rolling window
- **Fixed Window** — count per minute/hour

```typescript
class TokenBucket {
  private tokens: number;
  private lastRefill: number;

  constructor(private capacity: number, private refillRate: number) {
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  allowRequest(): boolean {
    this.refill();
    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }
    return false;
  }

  private refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }
}
```

---

## LLD Problem 4: Splitwise

**Entities:** User, Group, Expense, Split (equal, exact, percentage)

**Key methods:**
- `addExpense(paidBy, amount, splits)`
- `getBalance(userId)` → who owes whom
- `settleUp(from, to, amount)`

---

## LLD Problem 5: BookMyShow

**Entities:** Movie, Theatre, Screen, Show, Seat, Booking

**Concurrency:** Seat locking during booking (optimistic/pessimistic)

---

## LLD Interview Process (45–90 min)

1. **Requirements** (5 min) — functional + non-functional
2. **Entities** (5 min) — nouns from requirements
3. **Class diagram** (10 min) — relationships
4. **Code core classes** (25 min) — interfaces + 2–3 key methods
5. **Extensibility** (5 min) — how to add new payment type, vehicle type

---

## Practice schedule (Month 5)

| Week | LLD problems |
|------|--------------|
| 17 | LRU Cache, Rate Limiter |
| 18 | Parking Lot, Vending Machine |
| 19 | Splitwise, Snake & Ladder |
| 20 | BookMyShow, Elevator |
