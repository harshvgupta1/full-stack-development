# 1 CR Remaining Gaps + Is MERN Still Right?

<!-- SCHEDULE-BANNER-START -->
> **📅 Study window:** 17 Aug 2026 – 14 Feb 2027 (Days 1–182)
> **⏰ Your slots (IST):** Mon–Fri **7:30–8:30pm** & **9:00–10:00pm** · Sat–Sun **9:00am–12:00pm**, **3:00–5:30pm**, **6:00–8:30pm**
> **📧 Calendar reminders:** harsh.gupta@getreelax.com — import `calendar/mern-mastery-study.ics`
<!-- SCHEDULE-BANNER-END -->

> Second-pass audit of the whole `mern-mastery` folder. This file fills what was still thin after PDF #20.  
> **Verdict up front:** keep MERN. Do not restart in Java/Spring. Details in §1.

---

## 1. Is it still right to learn MERN?

**Yes — for this roadmap and a ~1 CR product-company target, MERN (really TypeScript + React + Node + SQL/Redis) is still the correct primary stack.**

| If you switch to Java/Spring now | If you stay on MERN |
|----------------------------------|---------------------|
| Lose 2–3 months rewriting backend + projects | Projects (TaskFlow, ShopLite) stay interview-ready |
| DSA language change mid-prep | DSA in **TypeScript** is accepted at Meta, Uber, Atlassian, Adobe, Salesforce, most Microsoft, many Google FE |
| You compete as a junior Java hire | You compete as a **fullstack product** hire — the role that actually pays 80 L–1.2 Cr+ for your profile |

**What “MERN” means at 1 CR (do not stay on tutorial MERN):**

| Keep | Upgrade | Do not chase |
|------|---------|--------------|
| React + TypeScript | Next.js, testing, a11y, Web Vitals | New JS framework every month |
| Node + Express | REST + one GraphQL lite (Meta) | Spring Boot rewrite |
| Mongo | **PostgreSQL as default** + Redis | Mongo-only thinking |
| JWT | OAuth, cookies, OWASP (already in PDF #8) | Kubernetes-as-identity |

**When MERN is *not* enough (rare for your target):**
- Google **L5 backend / infra** or Amazon **SDE3 platform** teams sometimes want Java/C++/Go. Treat that as Phase 9 *if* a recruiter says the team is Java-only. Do not pre-empt it.
- DSA: if an OA portal has no JS, use **Python** for that one test (syntax in a weekend). Do not rebuild the syllabus.

**Language rule:** code all LeetCode in **TypeScript**. Keep a 20-line Python cheat sheet for OA portals that lack JS.

---

## 2. What the folder already covers (do not redo)

| Area | Where | 1 CR enough? |
|------|-------|----------------|
| JS / TS / React / Next | PDFs #1–6 | Yes |
| Node, auth, OWASP, Docker, Jest/RTL | PDFs #7–8 | Yes |
| SQL + Mongo + Redis + indexes | PDF #9 | Theory yes; **timed SQL** was thin → §4 |
| Networking / HTTP | PDF #10b | Yes |
| DSA patterns + hard + company tags | PDFs #4, #12, #14, #20 | Yes if you *time* them |
| LLD + backend MC + FE autocomplete | PDFs #13, #15, #20 | Yes |
| Product HLD (Feed, Chat, Uber, YouTube, Drive, Typeahead) | PDFs #10, #20 | Yes |
| Behavioral / LPs | PDF #16, #20 §8 | Yes if stories have *your* metrics |
| Question-type map + company loops | PDF #20 | Yes |
| Optional months 7–9 | PDF #20 §11 | Yes |

Completing the PDFs is **necessary, not sufficient**. Offers come from **timed mocks + OA pass + referral + a team that is hiring**. This file adds the remaining *content* gaps.

---

## 3. Online Assessment (OA) — you never reach the loop without this

Amazon, Uber, many Microsoft, and some Meta contractor screens start with **HackerRank / CodeSignal / Hackerrank OA**, not a human.

### Rules

| Platform | Format | Pass bar |
|----------|--------|----------|
| Amazon OA | 2 DSA (medium) + work-style survey | Both DSA in time; LP-flavored survey consistent |
| CodeSignal (Uber / some startups) | 4 questions, 70 min, score /850 | Aim 750+ |
| HackerRank (Adobe, Salesforce, many) | 2–3 DSA, 60–90 min | All hidden tests green |
| Meta screen | 2 mediums, 45 min (human or CoderPad) | Both working |

**Practice (Phase 8A and any weekend from Month 4):**
1. Create accounts: LeetCode, CodeSignal, HackerRank.
2. Do **one** 70-min CodeSignal practice (arcade / certified).
3. Amazon-style: 2 mediums in 70 min, no IDE plugins, no copy-paste from notes.
4. Never leave a question blank — brute force + comment “optimize if time”.

**OA week (insert before you apply, Day 169–171):**
- Day 169: 2 timed mediums, HackerRank editor only  
- Day 170: CodeSignal-style 4-question set (or 3 mediums + 1 easy)  
- Day 171: Redo yesterday’s fails blind  

**Python emergency sheet** (only if the portal has no JS):

```python
from collections import defaultdict, deque, Counter
import heapq
# list, set, dict; heapq.heappush/heappop
# for i, x in enumerate(arr):
```

---

## 4. Timed SQL (Amazon / Microsoft / Adobe)

Theory is in PDF #6. Interviews ask you to **write the query in 10 minutes**.

Do these **8** (LeetCode SQL). Time: 12 min each. Phase 4 weekends + Phase 7G.

| # | Problem | Pattern |
|---|---------|---------|
| 1 | [1757 Recyclable](https://leetcode.com/problems/recyclable-and-low-fat-products/) | WHERE |
| 2 | [584 Find Customer Referee](https://leetcode.com/problems/find-customer-referee/) | NULL |
| 3 | [175 Combine Two Tables](https://leetcode.com/problems/combine-two-tables/) | LEFT JOIN |
| 4 | [181 Over 70](https://leetcode.com/problems/employees-earning-more-than-their-managers/) | Self join |
| 5 | [178 Rank Scores](https://leetcode.com/problems/rank-scores/) | Window `DENSE_RANK` |
| 6 | [184 Dept Highest Salary](https://leetcode.com/problems/department-highest-salary/) | GROUP BY + join |
| 7 | [180 Consecutive Numbers](https://leetcode.com/problems/consecutive-numbers/) | Window / self join |
| 8 | [185 Dept Top Three](https://leetcode.com/problems/department-top-three-salaries/) | `DENSE_RANK` partition |

**Say this:** “I’ll write the join first, then the window, then filter in an outer query.”  
**Index talk:** “I’d put `(dept_id, salary)` if this runs on 10M rows.”

---

## 5. Browser internals (Meta FE / Google FE / Atlassian)

PDF #0b covers HTML/CSS. 1 CR frontend rounds ask **how the browser turns URL → pixels**.

### Critical path (draw this in 3 minutes)

```
DNS → TCP → TLS → HTTP
  → HTML parse → DOM
  → CSS parse → CSSOM
  → DOM + CSSOM → Render tree
  → Layout (reflow) → Paint → Composite
JS can block parse (no defer/async). Large images delay LCP.
```

**Interview lines:**
- **Reflow vs repaint:** geometry change vs color/visibility. Batch DOM writes.
- **LCP:** largest image/text in viewport. Fix: size attributes, CDN, don’t wait on JS for hero.
- **INP / FID:** main-thread JS. Split long tasks, debounce input.
- **CLS:** reserved image/ad size. No late font swap without `size-adjust`.
- **Event loop in browser:** same microtask/macrotask as PDF #1; plus rAF before paint.

**One drill (Day 166 extra 30 min):** open ShopLite, name the LCP element, and one change that would cut it.

---

## 6. Accessibility (Atlassian / Google FE)

Frontend MC without a11y is a soft no at Atlassian.

**Minimum on every widget:**
- Inputs have `<label>` (or `aria-label`)
- Keyboard: Tab, Enter, Escape, arrows for lists
- `role="listbox"` + `aria-activedescendant` on autocomplete (PDF #15 §13)
- Focus visible; don’t `outline: none` without a replacement
- Color is not the only error signal
- `prefers-reduced-motion`

**2 questions they ask:**
1. How do you test a11y? → keyboard-only pass + axe/lighthouse + one screen-reader pass on the happy path.  
2. Why not `div` with onClick? → no keyboard, no role, no name. Use `button`.

---

## 7. GraphQL lite (Meta — do not build a new stack)

Meta FE often asks “REST vs GraphQL” and “how would you fetch a feed.”

**Say:**
- GraphQL: one `/graphql` POST, client asks for fields. Good when many clients need different shapes (feed + stories + ads).
- REST: simpler cache at HTTP layer (`GET /posts/1`), easier CDN.
- N+1: GraphQL resolvers can explode — **DataLoader** batches `userId → user`.
- Auth: still on the server; do not trust the query to hide fields (authorization in resolver).

**Do not** rewrite TaskFlow in GraphQL. Draw a 6-box diagram once (client → GraphQL gateway → post service / user service / DataLoader → DBs).

---

## 8. India ~1 CR offer math (so you do not under-ask)

**1 CR usually means annualized TC**, not 1 Cr cash in year 1.

| Component | Typical 1 Cr Google L4 / Meta E4 / Amazon SDE2 (India, 2025–26 ballpark) |
|-----------|------------------------------------------------------------------------|
| Base | 35–50 L |
| Bonus / joining | 5–20 L (joining often year-1 only) |
| Stock (RSU, 4-year vest) | 25–50 L / year *if* you annualize grant ÷ 4 |
| Year-1 cash | Often **55–75 L**, not 1 Cr in the bank |

**Negotiate:** level first, then signing + year-1 cash, then stock.  
**Never** accept a level downgrade to “hit 1 Cr” on paper with funny ESOP math.  
**Sources:** Levels.fyi (India + level), two humans at the company, recruiter range in writing.

Full scripts: PDF #17 Tier 5 — use **1 Cr TC** as the ask, then unpack components.

---

## 9. Referral + apply ops (content was thin)

| Week | Action |
|------|--------|
| From Month 4 | LinkedIn: 1 recruiter + 1 engineer / week at target companies. Ask for **referral**, not “can we chat 30 min?” |
| Resume | 1 page, metrics, TaskFlow + ShopLite architecture links |
| Apply | Referral **same week** as OA practice, not after you “feel ready” |
| Tracker | Company, role, referral name, OA date, loop date (month-06 already has a table) |
| Volume | 8 applications in Phase 8E is a **minimum**. 1 CR needs ~15–25 serious shots over 8 weeks |

Cold apply without referral at Google/Meta is a lottery. Referral is part of the syllabus.

---

## 10. When to study this file

| Section | When |
|---------|------|
| §1 MERN decision | Read once, Day 1 and Day 113 |
| §3 OA | Month 4 weekends + Days 169–171 |
| §4 SQL | Month 4 Sunday + Day 165 |
| §5 Browser | Day 166 (with FE MC) |
| §6 A11y | Every frontend MC |
| §7 GraphQL | Day 167 if Meta is a target |
| §8 Comp | Day 182 + offer week |
| §9 Referrals | Month 4 onward |

---

## 11. Honest 1 CR scorecard (folder + *your* work)

The folder can get you to the **hire bar**. It cannot sit the interview for you.

| You did the folder | You still fail if |
|--------------------|-------------------|
| 220 LC, 10 product HLDs, 2 FE widgets, 10 STAR | You never timed an OA |
| All PDFs highlighted | You cannot defend TaskFlow for 20 min without notes |
| Company loops memorized | Zero referrals, 3 cold applies |
| 1 CR ask rehearsed | You freeze when they change the HLD constraint |

**Minimum extra hours this file adds:** ~20–25 (OA + 8 SQL + browser drill + a11y on widgets). That is the last content gap.

**Still not in any PDF (by design):** a real job, a real team opening, and luck on interviewer. Plan Phase 9 if three full-loop mocks are not “hire.”
