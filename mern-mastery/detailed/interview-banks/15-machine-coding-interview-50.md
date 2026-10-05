# Machine Coding Interview — 50 Questions

This bank covers machine coding rounds with classic problems like Splitwise, BookMyShow, and Tic Tac Toe, including design patterns and implementation strategy for product company interviews. Spell out abbreviations on first use.

## 1. What is a machine coding round?

A machine coding round is a hands-on interview where you build a working program from scratch in 90–120 minutes—typically in Java, Python, or JavaScript. Unlike Low Level Design (LLD), you write runnable code, not just class diagrams. Problems simulate real features: expense splitting, ticket booking, or game logic. Interviewers evaluate code quality, design, and completeness under time pressure.

## 2. What do interviewers evaluate in machine coding?

Interviewers assess: (1) working code that handles core flows, (2) clean Object-Oriented Programming (OOP) design with appropriate classes, (3) extensibility (easy to add features), (4) edge case handling, (5) naming and readability, (6) optional bonus: tests, threading, or design patterns. They care less about perfect UI and more about solid backend logic and structure.

## 3. What is the recommended approach for machine coding?

Follow this timeline: 0–10 min: clarify requirements and list features (must-have vs nice-to-have). 10–20 min: identify entities, draw class diagram, define interfaces. 20–70 min: implement core happy path first, then edge cases. 70–85 min: demo walkthrough, add one extension if time permits. 85–90 min: refactor naming, remove duplication. Always build incrementally—working code early beats perfect design late.

## 4. How do you design Splitwise in machine coding?

Splitwise tracks shared expenses among friends and simplifies debts. Core entities: `User`, `Expense`, `Split` (equal, exact, or percentage), `Group`, `BalanceSheet`. Operations: add expense with splits, view balances between users, simplify debts (minimize transactions). Use Strategy pattern for split types. Store balances in a map: `(userA, userB) → amount`. No database needed—in-memory maps suffice.

## 5. What classes do you need for Splitwise?

Minimum classes: `User` (id, name), `Expense` (id, amount, paidBy, splits, splitType), `Split` (user, amountOrShare), `ExpenseService` (addExpense, getBalances), `BalanceSheet` (map of debts), `SplitStrategy` interface with `EqualSplit`, `ExactSplit`, `PercentageSplit` implementations. Optional: `Group` (members, group expenses), `DebtSimplifier` (reduce transactions). Keep entities plain; put logic in services.

## 6. How does expense splitting work in Splitwise?

When user A pays 300 split equally among A, B, C: each owes 100. Balance sheet: B owes A 100, C owes A 100. For exact split: A pays 300, B's share 100, C's share 200—B owes A 100, C owes A 200. For percentage: C pays 300, A=50%, B=30%, C=20%—A owes C 150, B owes C 90 (C paid so C is creditor). Update balance map on each expense addition.

## 7. What is debt simplification in Splitwise?

Debt simplification reduces circular debts to minimum transactions. If A owes B 100 and B owes C 100 and C owes A 100, net balance is zero—no payments needed. Algorithm: compute net balance per user (total owed minus total owing), then match creditors with debtors greedily. Use priority queue or two-pointer on sorted net balances. Optional feature—implement after core expense tracking works.

## 8. How do you design BookMyShow in machine coding?

BookMyShow books movie tickets for a theater. Entities: `Movie`, `Theater`, `Screen`, `Show` (movie + screen + time), `Seat` (row, number, type, status), `Booking`. Flow: browse shows → select seats → lock seats → pay → confirm booking. `SeatLockService` holds seats for 5–10 minutes during payment. Use Enum for seat status: AVAILABLE, LOCKED, BOOKED.

## 9. What is seat locking in BookMyShow?

Seat locking temporarily reserves selected seats while the user completes payment—prevents double booking. On seat selection, mark seats LOCKED with expiry timestamp and user session ID. Background thread or scheduled task releases expired locks. On payment success, mark BOOKED; on timeout/failure, revert to AVAILABLE. Critical for concurrent booking scenarios in interviews.

## 10. How do you handle concurrent seat booking?

Use synchronized blocks or `ReentrantLock` per show (not global lock) when checking and locking seats. Pattern: lock show → verify all seats AVAILABLE → mark LOCKED → release lock. Database version: `UPDATE seats SET status='LOCKED' WHERE id IN (...) AND status='AVAILABLE'`—optimistic concurrency. Mention both in-memory (interview) and database (production) approaches.

## 11. What classes do you need for BookMyShow?

`Movie` (id, title, duration), `Theater` (id, name, screens), `Screen` (id, seats layout), `Seat` (row, number, type, status), `Show` (id, movie, screen, startTime, pricing), `Booking` (id, show, seats, user, status), `BookingService`, `SeatLockService`, `PaymentService` (mock). Factory for seat layout generation (rows × seats per row). Strategy for pricing (regular, premium, weekend).

## 12. How do you design Tic Tac Toe in machine coding?

Entities: `Board` (N×N grid), `Player` (name, symbol X/O), `Game` (board, two players, current turn, status). Operations: `makeMove(row, col)`, `getStatus()`, `printBoard()`. `Board` validates moves and checks win/draw. `Game` orchestrates turn alternation. Start with 3×3; extend to N×N. Win check: row, column, diagonal after each move—O(N) per move.

## 13. How do you extend Tic Tac Toe to N×N board?

Generalize win condition: K consecutive marks in a row (usually K=N). Board becomes N×N array. Win check after each move: check row, column, two diagonals passing through last move—O(N) instead of checking entire board. For 4×4 with K=3, check 3-in-a-row. Parameterize board size and win length in constructor.

## 14. How do you design multi-player Tic Tac Toe?

Extend from 2 players to N players with symbols X, O, A, B, etc. `Game` holds list of players and current player index. After each move, advance `(currentIndex + 1) % numPlayers`. Win check same but for any player's symbol. Handle up to 26 players (letters) or use numbered symbols. Same Board class works—only Game orchestration changes.

## 15. What design patterns apply to Tic Tac Toe?

Strategy pattern for computer player AI: `EasyAI` (random move), `MediumAI` (block opponent wins), `HardAI` (minimax algorithm). Factory for creating games (3×3, 4×4, multi-player). Observer for notifying UI of board changes (if building with display). State pattern if adding game phases (SETUP, PLAYING, FINISHED). Mention patterns but do not over-engineer for a 90-minute round.

## 16. How do you add a computer player to Tic Tac Toe?

Implement `AIPlayer` interface with `getMove(board)`. Easy: collect empty cells, pick random. Medium: if AI can win in one move, take it; if opponent can win, block; else random. Hard: minimax with alpha-beta pruning—explore all game states, assume optimal play. Minimax is impressive but time-consuming; implement Easy/Medium first, describe Hard if asked.

## 17. What is the Parking Lot machine coding problem?

Design a parking lot with multiple floors, spot types (compact, large, handicapped), and vehicle types (car, motorcycle, truck). Operations: park vehicle (assign spot, issue ticket), unpark (calculate fee, free spot). Classes: `ParkingLot`, `Floor`, `Spot`, `Vehicle`, `Ticket`, `ParkingFeeStrategy`. Similar to LLD but you must write working code with a main method demo.

## 18. What is the Snake and Ladder machine coding problem?

Board with 100 cells, snakes (slide down), and ladders (climb up). Multiple players roll dice, move forward, apply snake/ladder if landing on one. First to cell 100 wins. Classes: `Board` (cells, snakes, ladders maps), `Player`, `Game` (turn management, dice roll). Handle exact 100 rule: if roll overshoots 100, stay put. Simple but tests basic OOP and game loop.

## 19. What is the Elevator machine coding problem?

Multiple elevators serve multiple floors. Users request up/down from floor; users inside request destination. Elevator moves, picks up, drops off. Algorithm: SCAN or LOOK for efficient movement. Classes: `Elevator` (current floor, direction, passengers), `ElevatorController` (dispatch requests). State pattern for elevator direction. Discuss thread safety if multiple requests concurrent.

## 20. How do you structure code for machine coding?

Use package/folder structure: `models/` (entities), `services/` (business logic), `enums/` (status types), `Main.java` (demo). One class per file. Service classes receive dependencies via constructor (dependency injection). Avoid static mutable state. Separate concerns: Board does not print; Game or a Display class handles output. Clean structure impresses interviewers more than clever one-liners.

## 21. Should you use a database in machine coding?

No—use in-memory data structures (HashMap, ArrayList) unless interviewer explicitly asks for persistence. Mention: "In production I'd use PostgreSQL with these tables..." but implement with maps for speed. Focus time on business logic, not Object-Relational Mapping (ORM) setup. A `Repository` interface with `InMemoryRepository` implementation shows good design without database overhead.

## 22. How do you handle input in machine coding?

Two approaches: (1) hardcoded demo in main method showing key flows—fastest and most common, (2) simple console menu reading user input. Prefer hardcoded demo with 2–3 scenarios (happy path + edge case) unless interviewer asks for interactive input. Print clear output showing state changes: "User A paid 300. Balances: B owes A 150."

## 23. What edge cases matter in Splitwise?

Zero amount expense (reject), single person expense (no splits needed), split amounts not summing to total (validate), negative amounts (reject), user not in group, duplicate expense IDs, empty group, percentage splits not totaling 100%, and simplifying when no debts exist. Validate inputs in `addExpense` before updating balances.

## 24. What edge cases matter in BookMyShow?

Booking already booked seats (reject), booking locked seats by another user (reject), lock expiry during payment (handle gracefully), empty seat selection (reject), show already started (optional restriction), concurrent lock on same seat (synchronized), and cancel booking (revert seats to AVAILABLE). Test with two users trying to book the same seat simultaneously.

## 25. What edge cases matter in Tic Tac Toe?

Move on occupied cell (reject), move after game over (reject), move out of bounds (reject), draw detection (board full, no winner), winning on last move (check before declaring draw), and single player mode. Handle invalid input gracefully with error messages, not exceptions crashing the program.

## 26. How do you implement undo in machine coding?

Command pattern: each action (move, expense, booking) is a Command object with `execute()` and `undo()`. Maintain a stack of executed commands. Undo pops and calls `undo()`. Example: Tic Tac Toe move command stores previous board state. Splitwise undo reverses balance changes. Mention pattern; implement only if time permits or interviewer asks.

## 27. What is the difference between machine coding and Low Level Design (LLD)?

LLD focuses on class diagrams, design patterns, and explaining relationships—often without running code. Machine coding requires working, executable code demonstrating core functionality. LLD allows more discussion time; machine coding demands faster implementation. Both test OOP design, but machine coding additionally tests coding speed and pragmatism under pressure.

## 28. How much time for each phase in a 90-minute machine coding round?

Requirements clarification: 5–10 min. Design (classes, interfaces): 10–15 min. Core implementation: 40–50 min. Edge cases and bug fixes: 10–15 min. Demo and discussion: 10–15 min. If running behind at 45 min, cut nice-to-have features and ensure happy path works. A working basic solution beats an incomplete advanced one.

## 29. Should you write tests in machine coding?

Write tests only if time remains after core implementation—JUnit or simple assert statements. One or two tests for critical logic (split calculation, win detection) show good habits. Do not spend 20 minutes on test infrastructure. Mention: "I'd add comprehensive unit tests with mocked dependencies in a real project." Prioritize working demo over test coverage.

## 30. What language should you use for machine coding?

Use the language you are fastest in and the company expects—Java is most common in Indian product companies (Flipkart, Amazon, PhonePe). Python is acceptable if allowed and you're proficient. JavaScript/TypeScript for frontend-focused roles. Stick to one language; do not switch mid-interview. Use standard library collections—avoid obscure frameworks.

## 31. How do you design a LRU Cache in machine coding?

Least Recently Used (LRU) Cache: `get(key)` and `put(key, value)` in O(1) with fixed capacity. Use HashMap + Doubly Linked List. Map stores key→node; list maintains access order (head=most recent). On get: move node to head. On put: add to head; if over capacity, remove tail. Implement in 20–30 minutes—common Amazon/Flipkart problem.

## 32. How do you design a Rate Limiter in machine coding?

Implement Token Bucket or Fixed Window rate limiter. `allowRequest(userId)` returns true/false. Token Bucket: refill tokens at fixed rate, consume one per request. Store user state in HashMap. Include `Clock` interface for testability. Handle multiple users independently. Demonstrate with rapid calls showing rejection after limit exceeded.

## 33. How do you design in-memory Redis in machine coding?

Support commands: `SET key value`, `GET key`, `DEL key`, `EXPIRE key seconds`, optionally `LPUSH/RPOP` for lists. Use HashMap for storage; separate HashMap for expiry timestamps. Background thread or check-on-access for expired keys. Demonstrates data structure knowledge and API design. Simpler variant: key-value store without expiry.

## 34. What is the Vending Machine machine coding problem?

Vending machine dispenses products on coin insertion. States: IDLE, ACCEPTING_MONEY, DISPENSING. Accept coins/notes, select product, check inventory and payment, dispense, return change. Classes: `VendingMachine`, `Product`, `Inventory`, `Coin` enum. State pattern for machine states. Handle insufficient payment, out of stock, and exact change scenarios.

## 35. How do you design a Chess game in machine coding?

Too complex for 90 minutes—scope down to: board setup, piece movement validation for 2–3 piece types (pawn, rook, king), turn management, check detection. Factory for piece creation. Strategy or polymorphism for piece movement rules. Do not implement full chess—interviewer expects scoping discussion. 3×3 or 5×5 variant is more realistic.

## 36. How do you design a Library Management System?

Entities: `Book`, `BookCopy` (barcode), `Member`, `Loan`, `Reservation`. Operations: search catalog, checkout (if available), return (calculate fine), reserve. `CatalogService`, `LoanService`. Fine calculation via Strategy (daily rate). Due date tracking with simple date comparison. In-memory catalog with HashMap indexed by ISBN and title.

## 37. What is immutability in machine coding?

Make value objects (Money, Split, Coordinate) immutable—all fields final, no setters, defensive copies. Prevents accidental state corruption during game logic or balance calculations. Example: `Split` with final user and amount. Immutable objects are thread-safe by default. Shows mature design thinking in a timed round.

## 38. How do you show extensibility in machine coding?

Use interfaces for volatile behavior: `SplitStrategy`, `PricingStrategy`, `AIPlayer`. Add new split type by creating new class implementing interface—no changes to existing code (Open/Closed Principle). Mention future extensions verbally: "To add CREDIT_CARD payment, I'd implement PaymentMethod interface." One extension example in code is sufficient.

## 39. How do you handle errors in machine coding?

Define custom exceptions: `SeatAlreadyBookedException`, `InvalidSplitException`. Validate inputs at service entry points. Return clear error messages, not stack traces. Use Optional for not-found cases. Do not over-engineer—2–3 custom exceptions for domain errors plus IllegalArgumentException for bad inputs is enough.

## 40. What is a singleton and when to use in machine coding?

Singleton ensures one instance of a class (e.g., `ParkingLot`, `GameManager`). Use only when truly one instance needed. Implement with private constructor and static getInstance(), or prefer passing instance explicitly. Interviewers often discourage Singleton—mention it but prefer creating one instance in main and passing via constructors.

## 41. How do you demo your machine coding solution?

Walk through 2–3 scenarios in main method with printed output: "Scenario 1: Equal split among 3 users. Scenario 2: Exact split with validation error. Scenario 3: Book seats, show lock expiry." Explain code structure briefly while running. Show you tested edge cases. Confident demo matters as much as code quality.

## 42. How do you design a Meeting Scheduler?

Given multiple people's calendars (busy intervals), find a meeting slot of duration D that works for all. Input: list of busy intervals per person. Merge intervals per person, find free gaps across all people. Classes: `Person`, `Interval`, `MeetingScheduler`. Sort intervals, sweep through time. LeetCode 253 variant. Good for interval problem practice.

## 43. How do you design a Task Management System (like Jira)?

Entities: `Task` (id, title, status, assignee, priority), `User`, `Board` (columns: TODO, IN_PROGRESS, DONE). Operations: create task, assign, change status, filter by assignee/priority. State pattern for status transitions (validate TODO→IN_PROGRESS, not TODO→DONE directly). Observer for status change notifications. Scope to CRUD + status workflow.

## 44. What threading concerns appear in machine coding?

BookMyShow seat locking, rate limiter token refill, cache expiry cleanup. Use `synchronized` or `ReentrantLock` for critical sections. Prefer lock per resource (per show) over global lock. Mention thread safety even if you do not implement full threading—"I'd synchronize the lockSeats method to handle concurrent requests." Shows awareness.

## 45. How do you optimize for interview time pressure?

Cut scope aggressively: 3×3 before N×N, equal split before percentage, single theater before multi-theater. Hardcode data instead of building input parsers. Skip logging framework—use System.out.println. Implement must-haves first; mention nice-to-haves verbally. Working happy path at 60 minutes leaves 30 for polish and edge cases.

## 46. What common mistakes fail machine coding candidates?

No working code at end, God classes with all logic in main, no input validation, ignoring edge cases, starting to code without design, over-engineering with too many patterns, spending too long on one feature, not communicating thought process, and mutable shared state causing bugs. Practice 2–3 full problems timed before the interview.

## 47. Summarize machine coding interview checklist?

Clarify scope → design classes (5 min) → implement happy path → handle edge cases → demo with printed scenarios → discuss extensibility. Use clean OOP, Strategy/Factory where natural, in-memory storage, and hardcoded demos. Communicate throughout. Prioritize working code over perfect architecture. Practice Splitwise, BookMyShow, and Tic Tac Toe until you can complete each in 75 minutes.

## 48. How do you design a URL shortener in machine coding?

`UrlShortenerService` with `shorten(longUrl)` and `resolve(shortCode)`. Base-62 encode auto-increment ID or random 6-char code with collision check. Store in HashMap. Validate URLs, handle not-found. Optional: click counter, expiration. Simpler than system design version—no database, no distributed ID. Complete in 30–40 minutes.

## 49. How do you design a parking lot in machine coding?

Multiple floors, spot types, vehicle types. `park(vehicle)` finds nearest available spot matching vehicle size, creates Ticket. `unpark(ticketId)` calculates fee by duration, frees spot. Fee via Strategy pattern. Demo: park 2 cars, park motorcycle, unpark one, show available spots. Most common machine coding + LLD crossover problem.

## 50. How do you design a snake game in machine coding?

Grid-based game: snake moves continuously, player changes direction, food appears randomly, snake grows on eating food, game over on wall/self collision. Classes: `Board`, `Snake` (body as linked list or deque), `Game` (game loop, direction input). Use Queue for snake body (add head, remove tail unless eating). Timer or turn-based for simplicity.
