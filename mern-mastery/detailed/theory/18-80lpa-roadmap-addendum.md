# 80 LPA → 1 CR Integrated Study Guide

<!-- SCHEDULE-BANNER-START -->
> **📅 Study window:** 17 Aug 2026 – 14 Feb 2027 (Days 1–182)
> **⏰ Your slots (IST):** Mon–Fri **7:30–8:30pm** & **9:00–10:00pm** · Sat–Sun **9:00am–12:00pm**, **3:00–5:30pm**, **6:00–8:30pm**
> **📧 Calendar reminders:** harsh.gupta@getreelax.com — import `calendar/mern-mastery-study.ics`
<!-- SCHEDULE-BANNER-END -->

> **Read AFTER** `00-LEARNING-PATH-COMPLETE.pdf` — this adds depth without skipping basics.  
> **For ~1 CR product loops** (question types, company-tagged DSA, product HLD, months 7–9) also read `20-1cr-product-company-complete.pdf`.

---

## Core principle: layered progression

```
Basics (Month 1–2) → Production (Month 3–4) → DSA+LLD (Month 5) → SD+Distributed (Month 6)
         ↑                      ↑                      ↑                      ↑
    Never skip            Networking here         DS fundamentals      Prerequisites first
    HTML/CSS/JS         before system design    before hard DSA        before Kafka/K8s
```

**30 LPA becomes easy** when you can pass 80 LPA bar in DSA + system design + distributed concepts.

---

## Month-by-month 80 LPA integration

### Month 1 — Foundation (Days 1–28)

| Days | Basic (required) | 80 LPA parallel | Interview Q&A tier |
|------|------------------|-----------------|-------------------|
| 1–7 | `01-javascript` §1–5 | — | Tier 1: JS Q1–5 |
| 8–14 | `01-javascript` §6–11 | `08b-dsa` §1–3 arrays, hash | Tier 1: JS Q6–10 |
| 15–21 | `01-javascript` §12–21 async | `08b-dsa` §4–5 stack, queue | Tier 1: JS Q11–15 |
| 22–28 | `02-typescript`, `00-git` | `08b-dsa` §6 linked list | Tier 1: TypeScript all |

**Gate:** Event loop + closures + 15 LC easy + FizzBuzz from memory.

---

### Month 2 — Frontend (Days 29–56)

| Days | Basic (required) | 80 LPA parallel | Interview Q&A tier |
|------|------------------|-----------------|-------------------|
| 29–30 | **`00b-html-css`** (DO NOT SKIP) | — | — |
| 29–49 | `03-react` full | `08b-dsa` §7 trees | Tier 2: React Q1–8 |
| 50–56 | `04-nextjs` | `08b-dsa` §8 graphs intro | Tier 2: React Q9–15 |

**Gate:** Blog deployed. Explain hydration. 60+ LC.

---

### Month 3 — Backend (Days 57–84)

| Days | Basic (required) | 80 LPA parallel | Interview Q&A tier |
|------|------------------|-----------------|-------------------|
| 57–63 | `05-nodejs-express` | `08b-dsa` §9 heap | Tier 2: Node Q1–8 |
| 64–70 | `07-auth` JWT/OAuth | — | Tier 2: Node Q9–15 |
| 71–77 | `06-databases` Mongo | — | Tier 2: DB Q1–8 |
| 78–81 | **`10b-networking-http`** | — | Tier 2: DB Q9–15 |
| 82–84 | `06-databases` PG + Redis | — | — |

**Gate:** Auth works. Both DBs. **Networking PDF done** before any system design.

---

### Month 4 — Projects (Days 85–112)

| Days | Basic (required) | 80 LPA parallel | Interview Q&A tier |
|------|------------------|-----------------|-------------------|
| 85–98 | TaskFlow + Docker | `08b-dsa` §10 trie, union-find | Tier 3: LLD Q1–5 |
| 99–112 | ShopLite + CI/CD | Review `07-auth` §K8s intro | Tier 3: LLD Q6–10 |

**Gate:** 2 deployed projects. 150+ LC. Docker Compose works.

---

### Month 5 — Phase 6: DSA + LLD easy→hard (Days 113–140)

**Master guide:** `19-phases-678-easy-to-hard-complete.pdf`

| Sub-phase | Days | Difficulty | Content |
|-----------|------|------------|---------|
| **6A** | 113–116 | 🟢 Easy | DSA refresh: two ptr, hash, stack |
| **6B** | 117–119 | 🟢 Easy | LLD: Snake & Ladder, Vending Machine |
| **6C** | 120–123 | 🟡 Medium | DSA: trees, graphs, BFS/DFS |
| **6D** | 124–127 | 🟡 Medium | LLD: LRU, Rate Limiter, Parking Lot |
| **6E** | 128–132 | 🟠 Med-Hard | DP, intervals, heap, backtracking |
| **6F** | 133–135 | 🔴 Hard | Company-tagged + hard LC + follow-ups |
| **6G** | 136–140 | 🔴 Hard | Backend MC + frontend autocomplete |

**Gate:** 200 LC, 6 LLD, 1 machine coding pass.

---

### Month 6 — Phase 7 + 8: SD + Interviews easy→hard (Days 141–182)

**Master guide:** `19-phases-678-easy-to-hard-complete.pdf`

| Sub-phase | Days | Difficulty | Content |
|-----------|------|------------|---------|
| **7A** | 141–143 | 🟢 Easy | SD building blocks (10c) |
| **7B** | 144–147 | 🟢 Easy | URL Shortener, Paste Bin HLD |
| **7C** | 148–152 | 🟡 Medium | Notification, Feed HLD |
| **7D** | 153–156 | 🟠 Med-Hard | Chat, Payment, E-commerce HLD |
| **7E** | 157–160 | 🔴 Hard | Distributed systems (11) |
| **7F** | 161–164 | 🔴 Hard | Product HLD: YouTube, Drive, Typeahead, seats |
| **7G** | 165–168 | 🔴 Hard | CS fundamentals + FE MC + company loops |
| **8A** | 169–171 | 🟢 Easy | Review, resume, GitHub |
| **8B** | 172–174 | 🟡 Medium | Partial mocks (1 round each) |
| **8C** | 175–177 | 🟠 Med-Hard | Combined DSA + HLD mocks |
| **8D** | 178–180 | 🔴 Hard | Full loop simulation |
| **8E** | 181–182 | 🔴 Hard | Apply + negotiate |

**Gate:** Full loop mock pass → mass apply.

---

## PDFs you must NOT read early

| PDF | Earliest day | If read too early |
|-----|--------------|-------------------|
| `11-distributed-systems` | 151 | Confusion without HTTP/scaling base |
| `12-microservices-kafka` | 156 | Kafka meaningless without CAP |
| `14-advanced-dsa-hard` | 127 | Hard without heap/trie fundamentals |
| `17-interview-qa` Tier 4 | 141 | Answers without context |
| `13-kubernetes-cloud` | 161 | K8s without Docker project experience |

---

## 80 LPA LeetCode path (integrated)

| Phase | LC target | Difficulty |
|-------|-----------|------------|
| Month 1 | 20 | Easy only |
| Month 2 | 60 | Easy + easy-medium |
| Month 3 | 100 | Medium intro |
| Month 4 | 150 | Medium |
| Month 5 | 200 | Medium + hard intro |
| Month 6 | 250+ | Medium + selected hard |

Hard extension list: `14-advanced-dsa-hard-complete.pdf` §8.

---

## Full PDF sequence (print and check off)

1. [ ] `00-LEARNING-PATH-COMPLETE`
2. [ ] `01-javascript-complete`
3. [ ] `08b-dsa-datastructures-fundamentals` (parallel Week 2+)
4. [ ] `02-typescript-complete`
5. [ ] `00-git-complete`
6. [ ] `00b-html-css-web-fundamentals`
7. [ ] `03-react-complete`
8. [ ] `04-nextjs-complete`
9. [ ] `05-nodejs-express-complete`
10. [ ] `07-auth-devops-complete`
11. [ ] `06-databases-complete`
12. [ ] `10b-networking-http-fundamentals`
13. [ ] Projects (exercise PDF month-04)
14. [ ] `08-dsa-patterns-complete`
15. [ ] `09-lld-complete`
16. [ ] `15-machine-coding-complete`
17. [ ] `14-advanced-dsa-hard-complete`
18. [ ] `10c-system-design-prerequisites`
19. [ ] `10-system-design-complete`
20. [ ] `11-distributed-systems-complete`
21. [ ] `12-microservices-kafka-complete`
22. [ ] `13-kubernetes-cloud-advanced-complete`
23. [ ] `16-behavioral-senior-complete`
24. [ ] `17-interview-qa-80lpa-master` (tiered)
25. [ ] `20-1cr-product-company-complete` (1 CR overlay + Phase 9)
26. [ ] `00-ROADMAP-COMPLETE` (daily companion)
