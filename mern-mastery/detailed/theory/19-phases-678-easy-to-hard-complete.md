# Phases 6, 7, 8 — Easy → Hard (1 CR Product-Company Guide)

<!-- SCHEDULE-BANNER-START -->
> **📅 Study window:** 7 Dec 2026 – 14 Feb 2027 (Days 113–182)
> **⏰ Your slots (IST):** Mon–Fri **7:30–8:30pm** & **9:00–10:00pm** · Sat–Sun **9:00am–12:00pm**, **3:00–5:30pm**, **6:00–8:30pm**
> **📧 Calendar reminders:** harsh.gupta@getreelax.com — import `calendar/mern-mastery-study.ics`
<!-- SCHEDULE-BANNER-END -->

> **Purpose:** Phase 6–8 is where a **~1 CR product-company** offer is won or lost. Every sub-phase builds on the previous. **Never skip a sub-phase.**  
> **Companion:** `20-1cr-product-company-complete.pdf` — company loops, question types, product HLD, frontend MC, CS pack, optional months 7–9.

---

## Overview

```
PHASE 6 (Days 113–140) — DSA + LLD (product-company)
  6A 🟢 Easy DSA patterns
  6B 🟢 Easy LLD / OOP
  6C 🟡 Medium DSA trees & graphs
  6D 🟡 Medium LLD (LRU, Rate Limiter)
  6E 🟠 Medium-Hard DSA (DP, intervals, heap)
  6F 🔴 Hard + company-tagged DSA
  6G 🔴 Backend MC + frontend MC

PHASE 7 (Days 141–168) — Product system design
  7A 🟢 Easy SD building blocks
  7B 🟢 Easy HLD (single-service designs)
  7C 🟡 Medium product HLD (feeds, notifications)
  7D 🟠 Medium-Hard product HLD (chat, payments, Uber)
  7E 🔴 Hard distributed (product-framed)
  7F 🔴 Product HLD deep dives (YouTube, Drive, Typeahead)
  7G 🔴 CS fundamentals + FE MC + company loops

PHASE 8 (Days 169–182) — Interview execution
  8A 🟢 Easy review + resume
  8B 🟡 Medium partial mocks
  8C 🟠 Medium-Hard combined mocks
  8D 🔴 Hard full loop (company-shaped)
  8E 🔴 Hard apply + negotiate

PHASE 9 (optional Days 183–273) — L5 / 1 CR+ polish
  See 20-1cr-product-company-complete.pdf §11
```

**Legend:** 🟢 Easy | 🟡 Medium | 🟠 Medium-Hard | 🔴 Hard (1 CR product bar)

---

# PHASE 6 — DSA + LLD (Days 113–140)

**Goal:** Medium LC in 30 min → company-tagged + follow-ups → 90 min backend MC + one frontend widget  
**1 CR bar:** Google L4 / Meta E4 / Amazon SDE2 = 2 mediums (one with follow-up) + product communication. L5 adds a hard or a design-LC.

---

## 6A 🟢 EASY — DSA pattern refresh (Days 113–116)

**Difficulty:** Easy → Easy-Medium LeetCode  
**Theory:** `08-dsa-patterns-complete.pdf` §1–4, §10 (stack)  
**Review:** `08b-dsa-datastructures-fundamentals.pdf` §1–5

| Day | Topic | LeetCode | Time limit |
|-----|-------|----------|------------|
| 113 | Two pointers review | LC 167 Two Sum II, LC 125 Valid Palindrome | 25 min each |
| 114 | Hash map review | LC 1 Two Sum, LC 242 Valid Anagram | 20 min each |
| 115 | Stack review | LC 20 Valid Parentheses, LC 155 Min Stack | 25 min each |
| 116 | Sliding window intro | LC 121 Best Time Buy/Sell, LC 283 Move Zeroes | 25 min each |

**What success looks like:** Solve easy-medium in 25 min without hints. Explain pattern name aloud.

**Do NOT proceed to 6B until:** 4/4 days completed, all solutions without looking at notes.

---

## 6B 🟢 EASY — LLD / OOP fundamentals (Days 117–119)

**Difficulty:** Simple class design, no concurrency yet  
**Theory:** `09-lld-complete.pdf` §SOLID, §Design Patterns intro  
**Interview Q&A:** Tier 3 LLD Q1–5 (`17-interview-qa` §7)

| Day | Build | Focus | Time |
|-----|-------|-------|------|
| 117 | **Snake & Ladder** (basic) | Classes: Board, Player, Dice; no threading | 2 hrs |
| 118 | **Vending Machine** | State pattern: Idle, HasMoney, Dispensing | 2 hrs |
| 119 | SOLID quiz + draw **Parking Lot** class diagram only (no code yet) | Entities: Vehicle, Spot, Floor, Ticket | 2 hrs |

**What success looks like:** Draw class diagram in 10 min. Explain Single Responsibility for each class.

**Gate:** Name 5 SOLID principles with one example each.

---

## 6C 🟡 MEDIUM — DSA trees & graphs (Days 120–123)

**Difficulty:** Medium LeetCode  
**Theory:** `08-dsa-patterns-complete.pdf` §5–9, `08b` §6–8

| Day | Topic | LeetCode | Time limit |
|-----|-------|----------|------------|
| 120 | Tree traversals | LC 94 Inorder, LC 102 Level Order | 30 min each |
| 121 | Tree properties | LC 104 Max Depth, LC 226 Invert Tree | 25 min each |
| 122 | Graph BFS | LC 200 Number of Islands | 35 min |
| 123 | Graph DFS + topo | LC 207 Course Schedule | 35 min |

**What success looks like:** BFS/DFS template from memory. Medium in 35 min.

---

## 6D 🟡 MEDIUM — LLD standard problems (Days 124–127)

**Difficulty:** 45-min LLD rounds (Flipkart, Amazon SDE2)  
**Theory:** `09-lld-complete.pdf` + `15-machine-coding-complete.pdf`

| Day | Build | Pattern | Time |
|-----|-------|---------|------|
| 124 | **LRU Cache** | HashMap + Doubly Linked List | 45 min timed |
| 125 | **Rate Limiter** | Sliding window / token bucket | 45 min timed |
| 126 | **Parking Lot** (full code) | Factory + Strategy (vehicle types) | 60 min |
| 127 | Review + redo weakest LLD blind | — | 2 hrs |

**What success looks like:** LRU Cache coded in 35 min with working get/put O(1).

**Gate:** 2 LLD problems coded blind before Phase 6E.

---

## 6E 🟠 MEDIUM-HARD — Advanced DSA patterns (Days 128–132)

**Difficulty:** Medium-Hard LeetCode  
**Theory:** `08-dsa-patterns-complete.pdf` §8 (DP), `14-advanced-dsa-hard.pdf` §5 intro only

| Day | Topic | LeetCode | Time limit |
|-----|-------|----------|------------|
| 128 | 1D DP | LC 70 Climbing Stairs, LC 198 House Robber | 30 min each |
| 129 | DP patterns | LC 322 Coin Change, LC 139 Word Break | 40 min each |
| 130 | Binary search on answer | LC 33 Search Rotated, LC 875 Koko Bananas | 35 min each |
| 131 | Heap + **intervals** | LC 347 Top K, LC 56 Merge Intervals, LC 253 Meeting Rooms II | 35 min each |
| 132 | Monotonic stack + **backtracking** | LC 739 Daily Temps, LC 78 Subsets | 40 min |

**Also read:** `08-dsa-patterns` §16–18 (product-company DSA, intervals, backtracking). After each problem, speak one follow-up (`20-1cr` §4.3).

**What success looks like:** Recognize DP / interval / backtracking in 5 min. 150+ total LC.

---

## 6F 🔴 HARD — Advanced DSA (Days 133–135)

**Difficulty:** Hard + **company-tagged** mediums (1 CR coding bar)  
**Theory:** `14-advanced-dsa-hard-complete.pdf` (tries, UF, topo, DP — skip segment trees unless extra time) · `20-1cr` §4.2

| Day | Topic | LeetCode | Time limit |
|-----|-------|----------|------------|
| 133 | Hard arrays + Meta speed | LC 42 Trapping Rain, LC 76 Min Window, LC 560 Subarray Sum K | 40 min each |
| 134 | Hard graphs/DP + Amazon | LC 124 Max Path Sum, LC 200 Islands (blind redo), LC 994 Rotting Oranges | 40 min |
| 135 | Design-LC + Uber/Google | LC 146 LRU (blind), LC 23 Merge K **or** LC 295 Median Stream | 45 min |

**What success looks like:** Attempt hard even if not optimal in 45 min — then speak a stream/memory follow-up. Pick your **first target company** tagged set from `20-1cr` §4.2 and start it.

**Gate:** 200+ total LC before Phase 7.

---

## 6G 🔴 HARD — Machine coding 90 min (Days 136–140)

**Difficulty:** Full 90-min rounds (Amazon, Flipkart, Uber, Atlassian)  
**Theory:** `15-machine-coding-complete.pdf` + §13 frontend MC

| Day | Build | Requirements | Time |
|-----|-------|--------------|------|
| 136 | **Splitwise** | Equal/exact split, settle up, print balances | 90 min strict |
| 137 | **BookMyShow** | Seat map, booking, lock seat 5 min | 90 min strict |
| 138 | **Elevator** | Multiple elevators, direction, floor requests | 90 min strict |
| 139 | **Frontend MC: Autocomplete** | Debounce, keyboard, abort fetch, empty/loading (`15` §13) | 90 min strict |
| 140 | **Phase 6 gate exam** | 1 medium LC (35 min) + 1 LLD (45 min) + review | 3 hrs |

**Phase 6 final gate (must pass ALL):**
- [ ] 200+ LeetCode (120+ medium)
- [ ] Medium LC in 30 min average + one spoken follow-up
- [ ] Intervals + backtracking + Union-Find: 2 problems each blind
- [ ] 6 LLD problems coded (LRU, Rate Limiter, Parking Lot, Splitwise, BookMyShow, +1)
- [ ] 1 backend MC in 90 min **and** 1 frontend autocomplete
- [ ] Tier 3 LLD Q&A (15 questions) — explain 10 without notes

---

# PHASE 7 — System Design (Days 141–168)

**Goal:** Product HLD in 45 min (user + metric + API + bottleneck) → distributed tradeoffs → CS + frontend MC  
**1 CR bar:** HLD sounds like a **product** (Instagram/Uber/Drive), not an infra catalog. Kafka/K8s only if the bottleneck needs them.

---

## 7A 🟢 EASY — SD building blocks (Days 141–143)

**Difficulty:** Concepts + estimation only (no full design yet)  
**Theory:** `10c-system-design-prerequisites-complete.pdf` (complete)

| Day | Study | Practice |
|-----|-------|----------|
| 141 | Vertical vs horizontal scaling, load balancer algorithms | Draw 3-tier architecture from memory |
| 142 | Caching layers (browser → CDN → Redis → DB) | Explain cache-aside vs write-through |
| 143 | Read replicas, message queues intro, estimation drills | 5 QPS/storage calculations |

**What success looks like:** Back-of-envelope: 10M DAU → QPS in 2 min.

**Gate:** Draw caching layer diagram + explain 3 LB algorithms before any HLD.

---

## 7B 🟢 EASY — Simple HLD (Days 144–147)

**Difficulty:** Single-service designs (30 LPA–SDE2 level)  
**Theory:** `10-system-design-complete.pdf` §URL Shortener, §Paste Bin  
**Interview Q&A:** Tier 4 HLD Q1–5

| Day | Design | Key concepts | Time |
|-----|--------|--------------|------|
| 144 | **URL Shortener** | Base62, hash, redirect, Redis cache | 45 min draw + explain |
| 145 | **Paste Bin** | TTL, object storage, cleanup job | 45 min |
| 146 | **Rate Limiter (distributed)** | Token bucket, Redis, per-IP/user | 45 min |
| 147 | Redo URL Shortener **blind** (no notes) | — | 45 min |

**What success looks like:** API + DB schema + one diagram in 45 min.

---

## 7C 🟡 MEDIUM — Standard HLD (Days 148–152)

**Difficulty:** Standard SDE2–Senior **product** rounds  
**Theory:** `10-system-design-complete.pdf` §Feed, §Notification · open with Product RADIO (`20-1cr` §5.1)  
**Interview Q&A:** Tier 4 HLD Q6–12

| Day | Design | Key concepts | Time |
|-----|--------|--------------|------|
| 148 | **Notification System** | Queue, workers, push/email/SMS channels | 45 min |
| 149 | **Twitter Feed (basic)** | Fan-out on write vs read, timeline cache | 45 min |
| 150 | **Instagram Feed** | Hybrid fan-out, celebrity problem | 45 min |
| 151 | **Reddit / Upvote** | Counter, sharding by post_id | 45 min |
| 152 | Redo Notification System blind | — | 45 min |

**What success looks like:** Explain fan-out vs fan-in tradeoff with example numbers.

---

## 7D 🟠 MEDIUM-HARD — Complex HLD (Days 153–156)

**Difficulty:** Senior SDE / 1 CR product HLD bar  
**Theory:** `10-system-design-complete.pdf` §Chat, §E-commerce, §Payment, §Uber

| Day | Design | Key concepts | Time |
|-----|--------|--------------|------|
| 153 | **WhatsApp Chat** | WebSocket, message queue, delivery receipts | 60 min |
| 154 | **E-commerce Order System** | Inventory lock, order state machine, ACID | 60 min |
| 155 | **Payment Gateway** | Idempotency keys, webhook, saga, reconciliation | 60 min |
| 156 | **Uber (basic)** | Matching, geohash, surge — high level only | 60 min |

**What success looks like:** Identify consistency vs availability tradeoff per design.

**Gate:** 6 HLD done before distributed systems theory.

---

## 7E 🔴 HARD — Distributed systems (Days 157–160)

**Difficulty:** Google L5 / Meta E4 distributed round  
**Theory:** `11-distributed-systems-complete.pdf`  
**Interview Q&A:** Tier 4 Distributed Q1–8

| Day | Study + design extension | Focus |
|-----|--------------------------|-------|
| 157 | CAP + PACELC + consistency models | Quiz: CP vs AP for bank vs social feed |
| 158 | Replication + sharding + consistent hashing | Extend URL shortener to multi-region |
| 159 | Consensus (Raft), leader election | Why ZooKeeper/etcd for coordination |
| 160 | Saga, 2PC, outbox, idempotency | Extend payment design with saga |

**What success looks like:** Explain CAP during partition with real product example.

---

## 7F 🔴 HARD — Product HLD deep dives (Days 161–164)

**Difficulty:** Google / Meta / Uber product design (not Kafka class)  
**Theory:** `10-system-design-complete.pdf` §14–18 · `20-1cr-product-company-complete.pdf` §5  
**Reference only:** `12-microservices-kafka-complete.pdf` — use a queue **inside** a product design if async is required

| Day | Design (45–60 min blind) | Product metric | Deep dive |
|-----|--------------------------|----------------|-----------|
| 161 | **YouTube / Netflix** | start-play p99 < 2s | CDN, transcode pipeline, ABR |
| 162 | **Google Drive / Dropbox** | zero silent data loss | chunk + checksum, conflict, notify |
| 163 | **Typeahead** | p99 < 50ms | prefix index, hot-prefix cache, typos |
| 164 | **Ticketmaster seats** | zero oversell | hold lock, payment race, idempotency |

**What success looks like:** API JSON + one metric + user-visible fallback. Kafka is a sentence, not the title.

---

## 7G 🔴 HARD — CS fundamentals + FE MC + company loops (Days 165–168)

**Difficulty:** Microsoft / Amazon CS sneak questions + Atlassian FE + loop shape  
**Theory:** `20-1cr` §3, §6, §7 · `16-behavioral-senior.pdf`  
**Reference only:** `13-kubernetes-cloud-advanced-complete.pdf` (deploy story if asked)

| Day | Study + practice | Focus |
|-----|------------------|-------|
| 165 | **CS pack** OS + DBMS + Networks (`20-1cr` §7) | 10 rapid-fire aloud |
| 166 | **Frontend MC #2** (infinite scroll **or** tic-tac-toe) | 90 min timed |
| 167 | **Company loop map** — pick 2 targets; write round order + 4 STAR tags | Google vs Amazon vs Meta vs Uber (`20-1cr` §3, §8) |
| 168 | **Phase 7 gate exam** | 1 **product** HLD blind (60 min) + 5 CS Qs (15 min) + 2 STAR stories |

**Phase 7 final gate (must pass ALL):**
- [ ] 10 HLD designs on paper including Feed, Chat, Uber, Payment, YouTube, Drive, Typeahead
- [ ] Each HLD opens with user + metric + API (not Kafka)
- [ ] Idempotency + lock applied to Ticketmaster / payment
- [ ] CS pack: 10 rapid-fire without notes
- [ ] 2 frontend widgets timed
- [ ] 8 STAR stories **tagged** to Amazon LP / Google / Meta
- [ ] Tier 4 Q&A: answer 20/50 without notes

---

# PHASE 8 — Interview execution (Days 169–182)

**Goal:** Convert knowledge into offers at **~1 CR product companies**  
**1 CR bar:** Full loop in the **shape of the company you applied to** (Google ≠ Amazon ≠ Atlassian)

---

## 8A 🟢 EASY — Consolidate + prepare (Days 169–171)

| Day | Activity | Time |
|-----|----------|------|
| 169 | Audit weak areas + **OA (S3):** 2 mediums in HackerRank editor (`21` §3, `22` §4.2) | 2 hrs |
| 170 | Resume + LinkedIn + **recorded recruiter screen (S2)** (`22` §4.1) | 4 hrs |
| 171 | Review Tier 1–3 Q&A + CodeSignal-style set **or** take-home README (`22` S3/S8) | 2 hrs |

**Deliverables:** 1-page resume, 2 pinned GitHub projects with architecture diagrams.

---

## 8B 🟡 MEDIUM — Partial mocks (Days 172–174)

| Day | Mock format | Time |
|-----|-------------|------|
| 172 | **1 medium DSA** (35 min timed) + 15 min review | 1 hr |
| 173 | **Karat-style (S5)** autocomplete API + code **or** LLD LRU/Rate Limiter (45 min) | 1 hr |
| 174 | **1 easy HLD** (URL Shortener, 45 min blind) | 1 hr |

**Use:** Pramp, Interviewing.io, or record yourself.

---

## 8C 🟠 MEDIUM-HARD — Combined mocks (Days 175–177)

| Day | Mock format | Time |
|-----|-------------|------|
| 175 | **1 medium DSA** + **1 medium HLD** (Notification) back-to-back | 2 hrs |
| 176 | **1 medium-hard DSA** + **1 LLD** (Parking Lot) back-to-back | 2.5 hrs |
| 177 | **Behavioral + bar raiser (S15):** 4 STAR + 15 min “what was *your* decision?” (`22` §4.7) | 1 hr |

---

## 8D 🔴 HARD — Full loop simulations (Days 178–180)

| Day | Full loop (simulate real 80 LPA onsite) | Total time |
|-----|----------------------------------------|------------|
| 178 | **Google/Meta shape:** DSA medium (35) → DSA medium-hard + follow-up (45) → **product** HLD (60) | 3 hrs |
| 179 | **Amazon/Atlassian shape:** Backend or frontend MC (90) → LP/values behavioral (45) → LLD or product HLD (45) | 3.5 hrs |
| 180 | **Weakest round redo** + hiring-manager 20 min (`20-1cr` §8) | 2 hrs |

**Pass criteria:** Clear communication, optimal or near-optimal DSA, structured HLD, no silence > 30 sec.

---

## 8E 🔴 HARD — Apply + negotiate (Days 181–182)

| Day | Activity |
|-----|----------|
| 181 | Apply to 8 from `22` top-100 list — write each company’s **family (F1–F12)** first — + 10-min team-match pitch (`22` §4.9) |
| 182 | Tier 5 salary Q&A + 1 CR negotiation range + continue applications. If gates missed → start Phase 9 (`20-1cr` §11) |

**Ongoing (Days 169–182):** 2 LC/day maintenance, 1 application/day minimum.

---

## Phase 6–8 at a glance (print this)

| Phase | Sub | Days | Difficulty | 1 CR skill |
|-------|-----|------|------------|------------|
| 6A | Easy DSA refresh | 113–116 | 🟢 | Pattern recognition |
| 6B | Easy LLD/OOP | 117–119 | 🟢 | Class design |
| 6C | Medium DSA trees/graphs | 120–123 | 🟡 | BFS/DFS fluency |
| 6D | Medium LLD | 124–127 | 🟡 | 45-min LLD pass |
| 6E | Medium-hard DSA | 128–132 | 🟠 | DP + intervals + backtracking |
| 6F | Hard + tagged DSA | 133–135 | 🔴 | Company flavor + follow-ups |
| 6G | Backend + frontend MC | 136–140 | 🔴 | 90-min build + autocomplete |
| 7A | SD building blocks | 141–143 | 🟢 | Estimation + caching |
| 7B | Easy HLD | 144–147 | 🟢 | Single-service design |
| 7C | Medium product HLD | 148–152 | 🟡 | Feed, notifications |
| 7D | Medium-hard product HLD | 153–156 | 🟠 | Chat, payments, Uber |
| 7E | Distributed systems | 157–160 | 🔴 | CAP, saga, sharding |
| 7F | Product HLD deep dives | 161–164 | 🔴 | YouTube, Drive, Typeahead, seats |
| 7G | CS + FE MC + loops | 165–168 | 🔴 | Microsoft/Amazon CS + Atlassian FE |
| 8A | Review + resume | 169–171 | 🟢 | Application ready |
| 8B | Partial mocks | 172–174 | 🟡 | Single-round pass |
| 8C | Combined mocks | 175–177 | 🟠 | Two-round stamina |
| 8D | Company-shaped loops | 178–180 | 🔴 | Google vs Amazon onsite |
| 8E | Apply + negotiate | 181–182 | 🔴 | 1 CR offer conversion |

---

## PDFs mapped to sub-phases

| Sub-phase | Primary PDFs |
|-----------|--------------|
| 6A–6C | 08b, 08-dsa-patterns |
| 6B, 6D, 6G | 09-lld, 15-machine-coding |
| 6E–6F | 08-dsa-patterns, 14-advanced-dsa-hard |
| 7A | 10c-system-design-prerequisites |
| 7B–7D | 10-system-design |
| 7E | 11-distributed-systems |
| 7F | 10-system-design §14–18, 20-1cr §5 (Kafka PDF = reference) |
| 7G | 20-1cr §3 §6 §7, 16-behavioral (K8s PDF = reference) |
| 8A–8E | 17-interview-qa, 20-1cr scorecard, exercise PDF month-06 |

**Exercise PDFs:** `month-05-dsa-lld-exercises-complete.pdf` follows Phase 6 sub-phases.  
**Exercise PDFs:** `month-06-interview-exercises-complete.pdf` follows Phase 7 sub-phases.
