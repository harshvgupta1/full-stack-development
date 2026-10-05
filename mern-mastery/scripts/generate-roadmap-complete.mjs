import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../detailed/00-ROADMAP-COMPLETE.md');

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function weekday(n) {
  return DAYS[(n - 1) % 7];
}
function weekdayShort(n) {
  return DAYS_SHORT[(n - 1) % 7];
}
function hours(n) {
  const d = (n - 1) % 7;
  return d >= 5 ? 8 : 2;
}
function isWeekend(n) {
  const d = (n - 1) % 7;
  return d >= 5;
}
function weekNum(n) {
  return Math.ceil(n / 7);
}
function lc(slug, num, name) {
  return `[LC ${num}: ${name}](https://leetcode.com/problems/${slug}/)`;
}

// Day definitions: topic, theoryFile, theorySection, practiceFile, exercises, leetcode, project, success, extraBlocks
const dayData = {};

function setDay(n, data) {
  dayData[n] = data;
}

// MONTH 1 — Days 1-28
setDay(1, {
  topic: 'Variables, Data Types, Coercion, and Type Checking',
  theory: ['detailed/theory/01-javascript-complete.md', 'Sections 2–3: Variables, Data Types, Coercion & Equality'],
  practice: ['practice/week-01-exercises.md', 'Exercise 1 (Variable quiz), Exercise 2 (FizzBuzz)'],
  lc: 'None — preview [LC 1: Two Sum](https://leetcode.com/problems/two-sum/) problem statement only (solve on Day 5)',
  project: 'None (weekday)',
  success: 'You can explain var vs let vs const, predict coercion outputs ([] + {}, typeof null), and complete FizzBuzz without Googling syntax.',
  split: '0:00–0:30 review setup | 0:30–1:20 read theory §2–3 | 1:20–2:00 Exercises 1–2',
});

setDay(2, {
  topic: 'Functions, Scope, Hoisting, and Function Expressions',
  theory: ['detailed/theory/01-javascript-complete.md', 'Sections 5–6: Functions, Scope'],
  practice: ['practice/week-01-exercises.md', 'Exercise 3 setup — closure counter skeleton'],
  lc: 'None (save LC for Fri/Sat)',
  project: 'None',
  success: 'You can draw scope chain for nested functions and explain temporal dead zone for let/const.',
  split: '0:00–0:25 review Day 1 | 0:25–1:15 theory §5–6 | 1:15–2:00 start Ex 3 counter',
});

setDay(3, {
  topic: 'Closures — lexical environment, practical patterns',
  theory: ['detailed/theory/01-javascript-complete.md', 'Section 7: Closures'],
  practice: ['practice/week-01-exercises.md', 'Exercise 3 (Closure counter — full implementation), Exercise 4 preview'],
  lc: 'None',
  project: 'None',
  success: 'createCounter works with increment/decrement/reset/getValue; you can explain closure in one sentence to an interviewer.',
  split: '0:00–0:20 review scope | 0:20–1:10 theory §7 | 1:10–2:00 finish Ex 3',
});

setDay(4, {
  topic: 'The `this` Keyword — 4 binding rules, arrow functions',
  theory: ['detailed/theory/01-javascript-complete.md', 'Section 8: The this Keyword'],
  practice: ['practice/week-01-exercises.md', 'Exercise 4 (this prediction — write outputs before running)'],
  lc: 'None',
  project: 'None',
  success: 'You predict all Exercise 4 outputs correctly and explain implicit vs explicit binding.',
  split: '0:00–0:25 review closures | 0:25–1:15 theory §8 | 1:15–2:00 Ex 4',
});

setDay(5, {
  topic: 'Week 1 Review + First LeetCode Problem',
  theory: ['detailed/theory/01-javascript-complete.md', 'Sections 2–8 review — skim weak sections'],
  practice: ['practice/week-01-exercises.md', 'Redo any failed exercises from Ex 1–4'],
  lc: lc('two-sum', 1, 'Two Sum'),
  project: 'None',
  success: 'LC 1 solved in JavaScript with O(n) hash map approach; you can explain brute force vs optimal.',
  split: '0:00–0:30 review notes | 0:30–1:00 weak topic drill | 1:00–2:00 LC 1 timed (45 min max)',
});

setDay(6, {
  topic: 'Prototypes Intro + Array Fundamentals (Weekend Block 1)',
  theory: ['detailed/theory/01-javascript-complete.md', 'Sections 9–10: Prototypes & Classes, Arrays'],
  practice: ['practice/week-01-exercises.md', 'Exercise 5 (Array manipulation: dedupe, 2nd largest, rotate)'],
  lc: `${lc('valid-anagram', 242, 'Valid Anagram')}, ${lc('best-time-to-buy-and-sell-stock', 121, 'Best Time to Buy and Sell Stock')}`,
  project: 'Block 3 (2h): Create GitHub repo `mern-mastery`, push week-01 exercises, add README with Day 1–5 summary',
  success: 'Ex 5 complete; LC 242 & 121 solved; GitHub repo live with week-01 folder committed.',
  split: '0:00–2:00 theory + Ex 5 | 2:00–4:00 LC 242, LC 121 | 4:00–6:00 GitHub setup | 6:00–8:00 commit + README',
});

setDay(7, {
  topic: 'Array Methods Deep Dive + Week 1 Consolidation',
  theory: ['detailed/theory/01-javascript-complete.md', 'Section 10: Arrays — map, filter, reduce, find, some, every'],
  practice: ['practice/week-01-exercises.md', '10 map/filter/reduce drills (custom arrays of objects)'],
  lc: `${lc('contains-duplicate', 217, 'Contains Duplicate')}, ${lc('maximum-subarray', 53, 'Maximum Subarray')}`,
  project: 'Block 3 (3h): Rewrite ALL Week 1 exercises from memory without looking — self-test; log failures in REVIEW.md',
  success: 'Can implement map/filter/reduce from memory; 5 LC total this week; Week 1 self-test score ≥80%.',
  split: '0:00–3:00 array drills | 3:00–5:00 LC 217, LC 53 | 5:00–8:00 blind rewrite self-test',
});

// Week 2
setDay(8, { topic: 'Prototype Chain and the `new` Keyword', theory: ['detailed/theory/01-javascript-complete.md', 'Section 9: Prototypes — chain, Object.create, new keyword'], practice: ['practice/week-02-exercises.md', 'Exercise 3 (Class inheritance — Animal → Dog → GuideDog)'], lc: 'None', project: 'None', success: 'You can diagram prototype chain and explain what `new` does step-by-step.', split: '0:00–0:25 review | 0:25–1:15 theory | 1:15–2:00 Ex 3 start' });
setDay(9, { topic: 'ES6 Classes, Inheritance, and instanceof', theory: ['detailed/theory/01-javascript-complete.md', 'Section 9: ES6 Classes (syntactic sugar over prototypes)'], practice: ['practice/week-02-exercises.md', 'Exercise 3 complete — speak(), fetch(), guide() methods'], lc: 'None', project: 'None', success: 'Class hierarchy passes instanceof checks; you explain classes vs prototypes.', split: '0:00–0:20 review | 0:20–1:10 theory | 1:10–2:00 Ex 3 finish' });
setDay(10, { topic: 'Objects, Destructuring, Spread, and Rest', theory: ['detailed/theory/01-javascript-complete.md', 'Section 11: Objects — Complete Reference'], practice: ['practice/week-02-exercises.md', 'Exercise 4 (groupBy function)'], lc: 'None', project: 'None', success: 'groupBy works for any key; you use destructuring/spread fluently in 5 examples.', split: '0:00–0:25 review | 0:25–1:15 theory §11 | 1:15–2:00 Ex 4' });
setDay(11, { topic: 'Implement map, filter, reduce from Scratch', theory: ['detailed/theory/01-javascript-complete.md', 'Section 10: Arrays — internal iteration patterns'], practice: ['practice/week-02-exercises.md', 'Exercise 1 (myMap, myFilter, myReduce — no native methods)'], lc: 'None', project: 'None', success: 'All three polyfills pass test cases including edge cases (empty array, no initial in reduce).', split: '0:00–0:20 review | 0:20–0:50 theory refresh | 0:50–2:00 Ex 1' });
setDay(12, { topic: 'LeetCode + Two Pointer Preview', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 1: Two Pointers — intro section'], practice: ['practice/week-02-exercises.md', 'Review Ex 1 implementations'], lc: lc('merge-sorted-array', 88, 'Merge Sorted Array'), project: 'None', success: 'LC 88 solved using two pointers from end; you explain why backward merge works.', split: '0:00–0:30 two-pointer theory | 0:30–2:00 LC 88 timed' });
setDay(13, { topic: 'Flatten Array, Curry, Optional Chaining Drills', theory: ['detailed/theory/01-javascript-complete.md', 'Section 19: Utility Patterns — Curry, Deep Clone'], practice: ['practice/week-02-exercises.md', 'Exercise 2 (flatten depth N), Exercise 5 (curry), 10 optional chaining object drills'], lc: `${lc('move-zeroes', 27, 'Move Zeroes')}, ${lc('squares-of-a-sorted-array', 977, 'Squares of a Sorted Array')}`, project: 'Push week-02 folder to GitHub', success: 'flatten works depth 5+; curry supports partial application; LC 27 & 977 done.', split: '0:00–4:00 Ex 2, 5, optional chaining | 4:00–6:00 LC | 6:00–8:00 GitHub push' });
setDay(14, { topic: 'Week 2 Review + JS Cheat Sheet', theory: ['detailed/theory/01-javascript-complete.md', 'Sections 9–11, 19 review'], practice: ['practice/week-02-exercises.md', 'Redo all failed exercises; write personal JS cheat sheet (1–2 pages)'], lc: `${lc('product-of-array-except-self', 238, 'Product of Array Except Self')}, ${lc('palindrome-number', 9, 'Palindrome Number')}, ${lc('remove-duplicates-from-sorted-array', 26, 'Remove Duplicates from Sorted Array')}`, project: 'Create `notes/personal-js-cheatsheet.md` in repo', success: 'Cheat sheet covers prototypes, closures, this, arrays; 3 LC solved; week-02 complete.', split: '0:00–3:00 review + redo | 3:00–6:00 LC batch | 6:00–8:00 cheat sheet' });

// Week 3
setDay(15, { topic: 'Event Loop — Call Stack, Microtasks, Macrotasks', theory: ['detailed/theory/01-javascript-complete.md', 'Section 14: The Event Loop'], practice: ['practice/week-03-exercises.md', 'Exercise 1 (predict output A–F before running)'], lc: 'None', project: 'None', success: 'Exercise 1 output predicted correctly; you draw event loop diagram from memory.', split: '0:00–0:25 review | 0:25–1:15 theory §14 | 1:15–2:00 Ex 1' });
setDay(16, { topic: 'Promises — then, catch, finally, chaining', theory: ['detailed/theory/01-javascript-complete.md', 'Section 15: Promises'], practice: ['practice/week-03-exercises.md', 'Write 3 promise chains: fetch mock, sequential delays, error propagation'], lc: 'None', project: 'None', success: 'Three promise chains work; you explain Promise states (pending/fulfilled/rejected).', split: '0:00–0:20 review event loop | 0:20–1:10 theory §15 | 1:10–2:00 promise chains' });
setDay(17, { topic: 'async/await, try/catch, Fetch API', theory: ['detailed/theory/01-javascript-complete.md', 'Sections 16–17: async/await, Fetch API & JSON'], practice: ['practice/week-03-exercises.md', 'Fetch API exercise — get JSONPlaceholder posts, handle errors'], lc: 'None', project: 'None', success: 'Async function fetches and displays data with proper try/catch error handling.', split: '0:00–0:25 review promises | 0:25–1:15 theory §16–17 | 1:15–2:00 fetch exercise' });
setDay(18, { topic: 'Promise.all, Promise.race, Promise.allSettled', theory: ['detailed/theory/01-javascript-complete.md', 'Section 15: Promise combinators subsection'], practice: ['practice/week-03-exercises.md', 'Exercise 4 (Promise.all polyfill)'], lc: 'None', project: 'None', success: 'promiseAll polyfill handles resolve/reject correctly with empty array edge case.', split: '0:00–0:20 review async | 0:20–1:00 combinators theory | 1:00–2:00 Ex 4' });
setDay(19, { topic: 'Stack Pattern — Valid Parentheses', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 4: Stack — Valid Parentheses pattern'], practice: ['practice/week-03-exercises.md', 'Exercise 5 preview (retry with backoff)'], lc: lc('valid-parentheses', 20, 'Valid Parentheses'), project: 'None', success: 'LC 20 solved with stack in O(n); you explain matching bracket logic aloud.', split: '0:00–0:30 stack theory | 0:30–2:00 LC 20' });
setDay(20, { topic: 'Debounce, Throttle, bind/call/apply', theory: ['detailed/theory/01-javascript-complete.md', 'Section 19: Debounce & Throttle; Section 8: this binding'], practice: ['practice/week-03-exercises.md', 'Exercise 2 (debounce), Exercise 3 (throttle), Exercise 6 (myBind)'], lc: `${lc('reverse-linked-list', 206, 'Reverse Linked List')}, ${lc('min-stack', 155, 'Min Stack')}`, project: 'Block 3 (3h): Start CLI Todo App — project structure, todos.json schema, add command', success: 'Debounce/throttle tested with simulated input; CLI Todo add works.', split: '0:00–3:00 Ex 2,3,6 | 3:00–5:00 LC | 5:00–8:00 CLI Todo start' });
setDay(21, { topic: 'Finish CLI Todo App + Event Loop Mastery', theory: ['detailed/theory/01-javascript-complete.md', 'Section 14 review + Section 18: ES Modules vs CommonJS'], practice: ['practice/week-03-exercises.md', 'CLI Todo: list, complete, delete commands; async file I/O'], lc: `${lc('longest-common-prefix', 14, 'Longest Common Prefix')}, ${lc('merge-two-sorted-lists', 21, 'Merge Two Sorted Lists')}`, project: 'Complete CLI Todo App — full CRUD + file persistence in todos.json', success: 'CLI Todo fully functional; 10 event loop prediction problems scored ≥8/10.', split: '0:00–4:00 CLI Todo | 4:00–6:00 LC | 6:00–8:00 event loop drills' });

// Week 4
setDay(22, { topic: 'TypeScript Setup, Basic Types, Type Inference', theory: ['detailed/theory/02-typescript-complete.md', 'Sections 1–2: Setup, Basic Types'], practice: ['practice/week-04-exercises.md', 'Exercise 1 (Convert processUsers to typed TS)'], lc: 'None', project: 'None', success: 'TS project compiles with strict:false; processUsers fully typed with interfaces.', split: '0:00–0:25 review async JS | 0:25–1:15 TS theory | 1:15–2:00 Ex 1' });
setDay(23, { topic: 'Interfaces vs Type Aliases, Union & Intersection Types', theory: ['detailed/theory/02-typescript-complete.md', 'Section 3: Interfaces vs Types'], practice: ['practice/week-04-exercises.md', 'Define 5 interfaces: User, Product, Order, ApiResponse, PaginatedResult'], lc: 'None', project: 'None', success: 'You explain when to use interface vs type; 5 interfaces compile with no any.', split: '0:00–0:20 review | 0:20–1:10 theory | 1:10–2:00 interfaces' });
setDay(24, { topic: 'Generics — functions, interfaces, constraints', theory: ['detailed/theory/02-typescript-complete.md', 'Section 5: Generics'], practice: ['practice/week-04-exercises.md', 'Exercise 2 (Generic apiCall<T> wrapper)'], lc: 'None', project: 'None', success: 'apiCall<T> works with multiple endpoints; you explain generic constraint syntax.', split: '0:00–0:25 review | 0:25–1:15 theory §5 | 1:15–2:00 Ex 2' });
setDay(25, { topic: 'Utility Types, Type Guards, Discriminated Unions', theory: ['detailed/theory/02-typescript-complete.md', 'Sections 6–7: Utility Types, Type Guards'], practice: ['practice/week-04-exercises.md', 'Exercise 3 (ProductCreate/Update/Public), Ex 4 (isAdmin guard), Ex 5 (Result union)'], lc: 'None', project: 'None', success: 'All 3 utility type exercises compile; type guard narrows correctly in if block.', split: '0:00–0:20 review generics | 0:20–1:00 theory | 1:00–2:00 Ex 3–5' });
setDay(26, { topic: 'Binary Search Pattern', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 2: Binary Search'], practice: ['practice/week-04-exercises.md', 'Review TS exercises'], lc: lc('binary-search', 704, 'Binary Search'), project: 'None', success: 'LC 704 solved iteratively and recursively; you state O(log n) invariant.', split: '0:00–0:30 binary search theory | 0:30–2:00 LC 704' });
setDay(27, { topic: 'Git Branching, Merge, Conflicts + TS Catalog API Start', theory: ['detailed/theory/00-git-complete.md', 'Sections 3–5: Branching, Merging, Conflict Resolution'], practice: ['practice/week-04-exercises.md', 'Git Exercises 1–5: init, branches, 5 commits, intentional conflict, .gitignore'], lc: `${lc('search-insert-position', 35, 'Search Insert Position')}, ${lc('first-bad-version', 278, 'First Bad Version')}`, project: 'Block 2 (3h): Start TS Catalog API — Express + TS setup, GET /products stub', success: 'Merge conflict resolved manually; Catalog API server runs; 2 LC done.', split: '0:00–3:00 Git drills | 3:00–5:00 Catalog API | 5:00–8:00 LC' });
setDay(28, { topic: 'Month 1 Capstone — TS Catalog API + Review', theory: ['detailed/theory/02-typescript-complete.md', 'Section 9: tsconfig strict mode'], practice: ['practice/week-04-exercises.md', 'Finish Catalog API: CRUD + Zod validation; 50 JS flashcards self-test'], lc: 'Review LC 1–20 — list any unsolved in REVIEW.md', project: 'Finish TS Catalog API — CRUD /products with Zod, error middleware, strict tsconfig', success: 'Catalog API complete with validation; Month 1 flashcards ≥40/50; GitHub month-1 tag created.', split: '0:00–4:00 Catalog API | 4:00–6:00 tsconfig strict | 6:00–8:00 Month 1 review' });

console.log('Generator loaded', Object.keys(dayData).length, 'days defined so far');

// MONTH 2 — Days 29-56 (React + Next.js)
for (const [n, d] of Object.entries({
  29: { topic: 'What is React, JSX, Virtual DOM, Component Model', theory: ['detailed/theory/03-react-complete.md', 'Sections 1–3: Intro, JSX, Components'], practice: ['practice/week-05-08-exercises.md', 'Week 5 Exercise 1: Create Vite + React + TS app'], lc: 'None', project: 'None', success: 'Vite app runs; you explain JSX vs HTML and why React uses virtual DOM.', split: '0:00–0:25 Month 1 review | 0:25–1:15 theory | 1:15–2:00 Vite setup' },
  30: { topic: 'Props, State, useState Hook', theory: ['detailed/theory/03-react-complete.md', 'Section 4: Props and State'], practice: ['practice/week-05-08-exercises.md', 'Week 5 Exercise 2: Counter, Toggle, Greeting components'], lc: 'None', project: 'None', success: 'Three components work; you explain unidirectional data flow.', split: '0:00–0:20 review | 0:20–1:10 theory | 1:10–2:00 Ex 2' },
  31: { topic: 'Lists, Keys, Conditional Rendering', theory: ['detailed/theory/03-react-complete.md', 'Section 7: Lists, Keys, Conditional Rendering'], practice: ['practice/week-05-08-exercises.md', 'Week 5 Exercise 3: Todo list (add, delete, toggle)'], lc: 'None', project: 'None', success: 'Todo list renders with stable keys; no index-as-key for dynamic lists.', split: '0:00–0:25 review | 0:25–1:15 theory | 1:15–2:00 Ex 3' },
  32: { topic: 'useEffect — mount, update, cleanup', theory: ['detailed/theory/03-react-complete.md', 'Section 5: useEffect'], practice: ['practice/week-05-08-exercises.md', 'Week 5 Exercise 4: Document title sync + fetch on mount'], lc: 'None', project: 'None', success: 'useEffect updates title; fetch runs once on mount with cleanup explained.', split: '0:00–0:20 review | 0:20–1:10 theory | 1:10–2:00 Ex 4' },
  33: { topic: 'Linked List — Merge Two Sorted Lists', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 5: Linked List — merge pattern'], practice: ['practice/week-05-08-exercises.md', 'Week 5 Exercise 5: Conditional rendering patterns'], lc: lc('merge-two-sorted-lists', 21, 'Merge Two Sorted Lists'), project: 'None', success: 'LC 21 solved with dummy head technique; conditional rendering demo complete.', split: '0:00–0:30 LL theory | 0:30–1:30 LC 21 | 1:30–2:00 Ex 5' },
  34: { topic: 'Controlled Forms + Vite Project Structure', theory: ['detailed/theory/03-react-complete.md', 'Section 8: Forms — Controlled Components'], practice: ['practice/week-05-08-exercises.md', 'Build registration form with validation messages'], lc: `${lc('remove-duplicates-from-sorted-array', 26, 'Remove Duplicates')}, ${lc('remove-element', 27, 'Remove Element')}`, project: 'Block 3 (2h): Finalize Vite + React + TS project structure, ESLint, folder layout', success: 'Registration form validates on submit; project structure documented in README.', split: '0:00–4:00 forms | 4:00–6:00 LC | 6:00–8:00 project structure' },
  35: { topic: 'Multi-Step Form Wizard (Weekend Project)', theory: ['detailed/theory/03-react-complete.md', 'Section 8: Multi-step form state patterns'], practice: ['practice/week-05-08-exercises.md', 'Weekend project: 3-step wizard with persisted state between steps'], lc: `${lc('length-of-last-word', 58, 'Length of Last Word')}, ${lc('plus-one', 66, 'Plus One')}, ${lc('add-binary', 67, 'Add Binary')}`, project: 'Multi-step form wizard — 3 steps (Personal, Account, Review), state persisted, back/next navigation', success: 'Wizard complete with validation per step; 3 LC solved; deployed to GitHub.', split: '0:00–5:00 wizard project | 5:00–8:00 LC batch' },
  36: { topic: 'useRef, useMemo, useCallback', theory: ['detailed/theory/03-react-complete.md', 'Section 6: useRef, useMemo, useCallback'], practice: ['practice/week-05-08-exercises.md', 'Week 6: Optimize a list component — memoize expensive filter'], lc: 'None', project: 'None', success: 'You explain when to use each hook; list re-render count reduced with useMemo.', split: '0:00–0:25 review | 0:25–1:15 theory | 1:15–2:00 optimization demo' },
  37: { topic: 'Custom Hooks — useFetch, useDebounce, useLocalStorage', theory: ['detailed/theory/03-react-complete.md', 'Section 6: Custom Hooks'], practice: ['practice/week-05-08-exercises.md', 'Week 6 Ex 1–3: useFetch, useLocalStorage, useDebounce'], lc: 'None', project: 'None', success: 'Three custom hooks extracted and reused in 2+ components each.', split: '0:00–0:20 review | 0:20–1:00 theory | 1:00–2:00 custom hooks' },
  38: { topic: 'useContext and Context API', theory: ['detailed/theory/03-react-complete.md', 'Section 6: Context API'], practice: ['practice/week-05-08-exercises.md', 'Week 6 Ex 4: ThemeProvider (dark/light toggle)'], lc: 'None', project: 'None', success: 'Theme toggles app-wide without prop drilling; you explain Provider pattern.', split: '0:00–0:25 review | 0:25–1:15 theory | 1:15–2:00 ThemeProvider' },
  39: { topic: 'React Hook Form + Zod Validation', theory: ['detailed/theory/03-react-complete.md', 'Section 8: React Hook Form + Zod'], practice: ['practice/week-05-08-exercises.md', 'Week 6 Ex 5: Login form with email/password Zod schema'], lc: 'None', project: 'None', success: 'Login form shows field-level errors; Zod schema shared with backend types.', split: '0:00–0:20 review | 0:20–1:10 theory | 1:10–2:00 login form' },
  40: { topic: 'Dynamic Programming Intro — Climbing Stairs', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 8: Dynamic Programming — 1D intro'], practice: ['practice/week-05-08-exercises.md', 'Review Week 6 exercises'], lc: lc('climbing-stairs', 70, 'Climbing Stairs'), project: 'None', success: 'LC 70 solved with bottom-up DP; you explain overlapping subproblems.', split: '0:00–0:30 DP intro | 0:30–2:00 LC 70' },
  41: { topic: 'User Directory Project (Weekend)', theory: ['detailed/theory/03-react-complete.md', 'Section 6–7: Data fetching patterns'], practice: ['practice/week-05-08-exercises.md', 'User directory: fetch JSONPlaceholder, card grid, search filter'], lc: `${lc('sqrtx', 69, 'Sqrt(x)')}, ${lc('remove-duplicates-from-list', 83, 'Remove Duplicates from List')}, ${lc('binary-tree-inorder-traversal', 94, 'Binary Tree Inorder Traversal')}`, project: 'User directory — JSONPlaceholder API, search, loading/error states', success: 'User cards render with search; loading skeleton shown during fetch.', split: '0:00–5:00 user directory | 5:00–8:00 LC' },
  42: { topic: 'Polish User Directory + Tree Problems', theory: ['detailed/theory/03-react-complete.md', 'Section 9: Loading states, error boundaries preview'], practice: ['practice/week-05-08-exercises.md', 'Add modal detail view, empty state, error retry to user directory'], lc: `${lc('same-tree', 100, 'Same Tree')}, ${lc('symmetric-tree', 101, 'Symmetric Tree')}, ${lc('maximum-depth-of-binary-tree', 104, 'Maximum Depth of Binary Tree')}`, project: 'Polish user directory — modal, responsive layout, commit to week-06 folder', success: 'Modal opens on click; 3 tree LC solved; project README updated.', split: '0:00–4:00 polish UI | 4:00–8:00 LC trees' },
  43: { topic: 'Performance — React.memo, lazy, Suspense', theory: ['detailed/theory/03-react-complete.md', 'Section 9: Performance Optimization'], practice: ['practice/week-05-08-exercises.md', 'Week 7 Ex 1: React.memo + useMemo demo with React DevTools'], lc: 'None', project: 'None', success: 'You measure re-renders before/after memo; lazy route loads on demand.', split: '0:00–0:25 review | 0:25–1:15 theory | 1:15–2:00 Ex 1' },
  44: { topic: 'React Router v6 — Routes, Params, Navigation', theory: ['detailed/theory/03-react-complete.md', 'Section 11: React Router v6'], practice: ['practice/week-05-08-exercises.md', 'Week 7 Ex 3: Home, About, User/:id, 404 routes'], lc: 'None', project: 'None', success: 'Four routes work; URL params extracted; 404 catch-all renders.', split: '0:00–0:20 review | 0:20–1:10 theory | 1:10–2:00 routing' },
  45: { topic: 'Protected Routes and Nested Routes', theory: ['detailed/theory/03-react-complete.md', 'Section 11: Protected & Nested Routes'], practice: ['practice/week-05-08-exercises.md', 'Week 7 Ex 4: Protected route with auth redirect'], lc: 'None', project: 'None', success: 'Unauthenticated users redirect to /login; nested dashboard layout works.', split: '0:00–0:25 review | 0:25–1:15 theory | 1:15–2:00 protected routes' },
  46: { topic: 'Error Boundaries + Zustand State Management', theory: ['detailed/theory/03-react-complete.md', 'Sections 9–10: Error Boundaries, Zustand'], practice: ['practice/week-05-08-exercises.md', 'Week 7 Ex 5: Error boundary; global cart state with Zustand'], lc: 'None', project: 'None', success: 'Error boundary catches render error; cart persists across route changes.', split: '0:00–0:20 review | 0:20–1:10 theory | 1:10–2:00 error boundary + Zustand' },
  47: { topic: 'Tree DFS — Maximum Depth', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 6: Trees — DFS'], practice: ['practice/week-05-08-exercises.md', 'Week 7 Ex 2: Lazy load routes with Suspense'], lc: lc('maximum-depth-of-binary-tree', 104, 'Maximum Depth of Binary Tree'), project: 'None', success: 'LC 104 solved recursively and iteratively; lazy routes working.', split: '0:00–0:30 tree DFS | 0:30–1:30 LC 104 | 1:30–2:00 lazy routes' },
  48: { topic: 'E-Commerce Listing Project Start', theory: ['detailed/theory/03-react-complete.md', 'Section 10: Zustand + Context for cart'], practice: ['practice/week-05-08-exercises.md', 'E-commerce: product grid, add to cart, cart drawer'], lc: `${lc('convert-sorted-array-to-binary-search-tree', 108, 'Convert Sorted Array to BST')}, ${lc('balanced-binary-tree', 110, 'Balanced Binary Tree')}`, project: 'E-commerce listing — mock product API, filter by category, cart in Zustand', success: 'Products display with filters; cart adds/removes items with count badge.', split: '0:00–6:00 e-commerce start | 6:00–8:00 LC' },
  49: { topic: 'Finish E-Commerce UI', theory: ['detailed/theory/03-react-complete.md', 'Section 9: Performance review for product lists'], practice: ['practice/week-05-08-exercises.md', 'Add sort, cart persist (localStorage), checkout summary page'], lc: `${lc('minimum-depth-of-binary-tree', 111, 'Minimum Depth of Binary Tree')}, ${lc('path-sum', 112, 'Path Sum')}`, project: 'Finish e-commerce — filter, sort, cart persist, responsive mobile layout', success: 'Cart survives refresh; sort/filter work together; 60+ LC total milestone approaching.', split: '0:00–6:00 e-commerce finish | 6:00–8:00 LC' },
  50: { topic: 'Next.js App Router and File Structure', theory: ['detailed/theory/04-nextjs-complete.md', 'Sections 1–2: App Router, File Conventions'], practice: ['practice/week-05-08-exercises.md', 'Week 8 Ex 1: Create Next.js 14 app with App Router'], lc: 'None', project: 'None', success: 'Next.js app runs; you explain app/ vs pages/ and file-based routing.', split: '0:00–0:25 review React | 0:25–1:15 Next theory | 1:15–2:00 create app' },
  51: { topic: 'Server vs Client Components', theory: ['detailed/theory/04-nextjs-complete.md', 'Section 3: Server and Client Components'], practice: ['practice/week-05-08-exercises.md', 'Week 8 Ex 2–3: Server Component fetch + Client counter on same page'], lc: 'None', project: 'None', success: 'Mixed page renders; you explain "use client" boundary and when to use each.', split: '0:00–0:20 review | 0:20–1:10 theory | 1:10–2:00 mixed page' },
  52: { topic: 'Data Fetching — SSR, SSG, ISR', theory: ['detailed/theory/04-nextjs-complete.md', 'Section 4: Data Fetching Patterns'], practice: ['practice/week-05-08-exercises.md', 'Week 8: Blog data fetch with fetch cache options'], lc: 'None', project: 'None', success: 'You explain SSR vs SSG vs ISR with revalidate example in code.', split: '0:00–0:25 review | 0:25–1:15 theory | 1:15–2:00 blog fetch' },
  53: { topic: 'API Routes and Middleware', theory: ['detailed/theory/04-nextjs-complete.md', 'Sections 5–6: API Routes, Middleware'], practice: ['practice/week-05-08-exercises.md', 'Week 8 Ex 4–5: Dynamic /blog/[slug], POST /api/contact'], lc: 'None', project: 'None', success: 'Dynamic route renders slug; contact API validates body and returns 201.', split: '0:00–0:20 review | 0:20–1:10 theory | 1:10–2:00 API routes' },
  54: { topic: 'Binary Tree — Invert Binary Tree', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 6: Trees — inversion'], practice: ['practice/week-05-08-exercises.md', 'Review Next.js exercises'], lc: lc('invert-binary-tree', 226, 'Invert Binary Tree'), project: 'None', success: 'LC 226 solved; you can invert tree recursively in under 10 minutes.', split: '0:00–0:30 tree review | 0:30–2:00 LC 226' },
  55: { topic: 'Blog Project with MDX and SEO', theory: ['detailed/theory/04-nextjs-complete.md', 'Sections 7–9: MDX, Metadata, SEO'], practice: ['practice/week-05-08-exercises.md', 'Week 8 weekend project: 5 MDX posts, metadata, OG tags'], lc: `${lc('pascals-triangle', 118, "Pascal's Triangle")}, ${lc('single-number', 136, 'Single Number')}`, project: 'Blog with Next.js — 5 MDX posts, SEO metadata, Tailwind styling', success: '5 posts render; each page has unique title/description; Tailwind styled.', split: '0:00–6:00 blog build | 6:00–8:00 LC + styling' },
  56: { topic: 'Deploy Blog + Month 2 Review', theory: ['detailed/theory/04-nextjs-complete.md', 'Section 10: Deployment to Vercel'], practice: ['practice/week-05-08-exercises.md', 'Month 2 review — list weak React/Next topics'], lc: 'Review all Month 2 LC — target 60+ total solved', project: 'Deploy blog to Vercel — live URL, custom domain optional, README with demo link', success: 'Live blog URL on resume draft; Month 2 topics reviewed; 60+ LC milestone hit.', split: '0:00–4:00 deploy | 4:00–6:00 metadata audit | 6:00–8:00 Month 2 review' },
})) { setDay(+n, d); }


// MONTH 3 — Days 57-84
for (const [n, d] of Object.entries({
  57: { topic: 'Node.js Intro, Event Loop, Module System', theory: ['detailed/theory/05-nodejs-express-complete.md', 'Sections 1–2: Node.js Architecture, Event Loop'], practice: ['practice/week-09-12-exercises.md', 'Week 9 Ex 1: Hello HTTP server with Node http module'], lc: 'None', project: 'None', success: 'Server responds on port 3000; you explain Node event loop vs browser.', split: '0:00–0:25 Month 2 review | 0:25–1:15 theory | 1:15–2:00 hello server' },
  58: { topic: 'Express Basics, Middleware Chain', theory: ['detailed/theory/05-nodejs-express-complete.md', 'Sections 4–5: Express Setup, Middleware'], practice: ['practice/week-09-12-exercises.md', 'Week 9 Ex 1: Express + JSON parser + request logger middleware'], lc: 'None', project: 'None', success: 'Middleware chain logs requests; JSON body parsed on POST routes.', split: '0:00–0:20 review | 0:20–1:10 theory | 1:10–2:00 Express setup' },
  59: { topic: 'REST API Design Principles', theory: ['detailed/theory/05-nodejs-express-complete.md', 'Section 9: REST API Design'], practice: ['practice/week-09-12-exercises.md', 'Week 9 Ex 2: CRUD /api/users in-memory array'], lc: 'None', project: 'None', success: 'Full CRUD with proper HTTP verbs and status codes (201, 404, 204).', split: '0:00–0:25 review | 0:25–1:00 REST theory | 1:00–2:00 CRUD API' },
  60: { topic: 'Zod Validation and Error Handling', theory: ['detailed/theory/05-nodejs-express-complete.md', 'Sections 7–8: Validation, Error Handling'], practice: ['practice/week-09-12-exercises.md', 'Week 9 Ex 3–4: Zod validation middleware + global error handler'], lc: 'None', project: 'None', success: 'Invalid payloads return 400 with Zod error details; unhandled errors return 500 JSON.', split: '0:00–0:20 review | 0:20–1:10 theory | 1:10–2:00 validation' },
  61: { topic: 'Linked List Cycle Detection', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 5: Linked List — Floyd cycle'], practice: ['practice/week-09-12-exercises.md', 'Review Week 9 API code'], lc: lc('linked-list-cycle', 141, 'Linked List Cycle'), project: 'None', success: 'LC 141 solved with fast/slow pointers in O(1) space.', split: '0:00–0:30 LL cycle theory | 0:30–2:00 LC 141' },
  62: { topic: 'Layered Architecture Refactor', theory: ['detailed/theory/05-nodejs-express-complete.md', 'Section 6: Layered Architecture (routes/controllers/services)'], practice: ['practice/week-09-12-exercises.md', 'Week 9 Ex 5: Refactor users API into routes/controllers/services'], lc: `${lc('intersection-of-two-linked-lists', 160, 'Intersection of Two Linked Lists')}, ${lc('two-sum-ii-input-array-is-sorted', 167, 'Two Sum II')}, ${lc('min-stack', 155, 'Min Stack')}`, project: 'Block 3 (3h): Start Auth API skeleton — register/login route stubs', success: 'Clean separation of concerns; 3 LC done; auth routes stubbed.', split: '0:00–5:00 refactor | 5:00–8:00 LC + auth stubs' },
  63: { topic: 'Auth API Skeleton + Node Event Loop Notes', theory: ['detailed/theory/05-nodejs-express-complete.md', 'Section 2: Node Event Loop deep dive'], practice: ['practice/week-09-12-exercises.md', 'Auth skeleton: POST /register, POST /login route structure'], lc: 'Review Week 9 LC list', project: 'Auth API skeleton — route structure, placeholder handlers, write event loop summary doc', success: 'Auth routes respond with placeholder; event loop summary written in own words.', split: '0:00–5:00 auth skeleton | 5:00–8:00 event loop notes' },
  64: { topic: 'AuthN vs AuthZ, JWT Structure', theory: ['detailed/theory/07-auth-devops-complete.md', 'Sections 1–2: Authentication vs Authorization, JWT'], practice: ['practice/week-09-12-exercises.md', 'Week 10: Draw JWT flow diagram (login → access → refresh)'], lc: 'None', project: 'None', success: 'JWT diagram shows header.payload.signature; you explain access vs refresh tokens.', split: '0:00–0:25 review | 0:25–1:15 theory | 1:15–2:00 JWT diagram' },
  65: { topic: 'bcrypt Password Hashing', theory: ['detailed/theory/07-auth-devops-complete.md', 'Section 4: Password Hashing with bcrypt'], practice: ['practice/week-09-12-exercises.md', 'Week 10 Ex 1: Hash password, verify, compare timing-safe'], lc: 'None', project: 'None', success: 'bcrypt hash/verify works; you explain salt rounds and why not MD5.', split: '0:00–0:20 review | 0:20–1:10 theory | 1:10–2:00 bcrypt exercise' },
  66: { topic: 'Access + Refresh Token Flow', theory: ['detailed/theory/07-auth-devops-complete.md', 'Section 2: Token Flow — access + refresh rotation'], practice: ['practice/week-09-12-exercises.md', 'Week 10 Ex 2–3: Generate access JWT + refresh in httpOnly cookie'], lc: 'None', project: 'None', success: 'Login returns access token; refresh stored in httpOnly cookie; rotation logic stubbed.', split: '0:00–0:25 review | 0:25–1:15 theory | 1:15–2:00 token implementation' },
  67: { topic: 'Auth Middleware and RBAC', theory: ['detailed/theory/07-auth-devops-complete.md', 'Section 1: Middleware, Role-Based Access Control'], practice: ['practice/week-09-12-exercises.md', 'Week 10 Ex 4–5: Auth middleware + admin vs user routes'], lc: 'None', project: 'None', success: 'Protected routes return 401 without token; admin route returns 403 for user role.', split: '0:00–0:20 review | 0:20–1:10 theory | 1:10–2:00 RBAC' },
  68: { topic: 'Two Pointers — Two Sum II', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 1: Two Pointers on sorted array'], practice: ['practice/week-09-12-exercises.md', 'Review auth code'], lc: lc('two-sum-ii-input-array-is-sorted', 167, 'Two Sum II'), project: 'None', success: 'LC 167 solved with left/right pointers in O(n).', split: '0:00–0:30 two pointers | 0:30–2:00 LC 167' },
  69: { topic: 'Complete Auth Microservice', theory: ['detailed/theory/07-auth-devops-complete.md', 'Sections 1–4: Full auth flow integration'], practice: ['practice/week-09-12-exercises.md', 'Week 10 weekend: Full refresh token rotation, logout, token blacklist stub'], lc: `${lc('majority-element', 169, 'Majority Element')}, ${lc('excel-sheet-column-number', 171, 'Excel Sheet Column Number')}`, project: 'Complete auth microservice — register, login, refresh, logout, protected routes', success: 'End-to-end auth works with Postman collection; refresh rotation implemented.', split: '0:00–6:00 auth microservice | 6:00–8:00 LC' },
  70: { topic: 'OAuth Concepts + Bit Manipulation LC', theory: ['detailed/theory/07-auth-devops-complete.md', 'Section 3: OAuth 2.0 Overview'], practice: ['practice/week-09-12-exercises.md', 'Read NextAuth.js / Passport.js docs — write OAuth flow summary'], lc: `${lc('reverse-bits', 190, 'Reverse Bits')}, ${lc('number-of-1-bits', 191, 'Number of 1 Bits')}, ${lc('happy-number', 202, 'Happy Number')}, ${lc('remove-linked-list-elements', 203, 'Remove Linked List Elements')}`, project: 'OAuth concept study — document Authorization Code flow with diagram', success: 'OAuth summary written; 4 LC solved; auth microservice README complete.', split: '0:00–4:00 OAuth study | 4:00–8:00 LC batch' },
  71: { topic: 'MongoDB Basics and Atlas Setup', theory: ['detailed/theory/06-databases-complete.md', 'Section 2: MongoDB — Document Model, Atlas Setup'], practice: ['practice/week-09-12-exercises.md', 'Week 11: Create MongoDB Atlas cluster, connect from Node app'], lc: 'None', project: 'None', success: 'Atlas cluster live; Node app connects with connection string in .env.', split: '0:00–0:25 review auth | 0:25–1:15 Mongo theory | 1:15–2:00 Atlas setup' },
  72: { topic: 'Mongoose Schemas and Validation', theory: ['detailed/theory/06-databases-complete.md', 'Section 2: Mongoose — Schemas, Validation, Hooks'], practice: ['practice/week-09-12-exercises.md', 'Week 11 Ex 1: User schema with email unique, password required, timestamps'], lc: 'None', project: 'None', success: 'User schema validates on save; duplicate email returns friendly error.', split: '0:00–0:20 review | 0:20–1:10 theory | 1:10–2:00 User schema' },
  73: { topic: 'MongoDB CRUD, Queries, Pagination', theory: ['detailed/theory/06-databases-complete.md', 'Section 2: CRUD Operations, Query Operators'], practice: ['practice/week-09-12-exercises.md', 'Week 11 Ex 2–3: CRUD with Atlas + paginated GET ?page=1&limit=10'], lc: 'None', project: 'None', success: 'Pagination returns { data, total, page, totalPages }; queries use projection.', split: '0:00–0:25 review | 0:25–1:15 theory | 1:15–2:00 CRUD + pagination' },
  74: { topic: 'Aggregation Pipeline', theory: ['detailed/theory/06-databases-complete.md', 'Section 2: Aggregation Framework'], practice: ['practice/week-09-12-exercises.md', 'Week 11 Ex 4: Revenue by month aggregation on orders collection'], lc: 'None', project: 'None', success: 'Aggregation pipeline uses $match, $group, $sort; results match expected output.', split: '0:00–0:20 review | 0:20–1:10 theory | 1:10–2:00 aggregation' },
  75: { topic: 'Reverse Linked List', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 5: Linked List — reversal'], practice: ['practice/week-09-12-exercises.md', 'Week 11 Ex 5 preview: Index on email — explain query plan'], lc: lc('reverse-linked-list', 206, 'Reverse Linked List'), project: 'None', success: 'LC 206 solved iteratively and recursively; index explain() documented.', split: '0:00–0:30 LL reversal | 0:30–2:00 LC 206' },
  76: { topic: 'Blog API with MongoDB', theory: ['detailed/theory/06-databases-complete.md', 'Section 2: Embedding vs Referencing'], practice: ['practice/week-09-12-exercises.md', 'Blog API: Post, Comment, Tag schemas — CRUD endpoints'], lc: `${lc('contains-duplicate', 217, 'Contains Duplicate')}, ${lc('contains-duplicate-ii', 219, 'Contains Duplicate II')}`, project: 'Blog API with MongoDB — posts, comments, tags, author reference', success: 'Posts CRUD works; comments embedded or referenced; 2 LC done.', split: '0:00–6:00 blog API | 6:00–8:00 LC + indexing' },
  77: { topic: 'Finish Blog API + Tree LC', theory: ['detailed/theory/06-databases-complete.md', 'Section 2: Indexing best practices'], practice: ['practice/week-09-12-exercises.md', 'Finish blog: tag filtering, comment threads, seed script'], lc: `${lc('invert-binary-tree', 226, 'Invert Binary Tree')}, ${lc('kth-smallest-element-in-a-bst', 230, 'Kth Smallest Element in a BST')}`, project: 'Finish blog API — tag filter, pagination, Postman collection exported', success: 'Blog API feature-complete; Postman collection shared; tree LC done.', split: '0:00–5:00 blog finish | 5:00–8:00 LC' },
  78: { topic: 'SQL vs NoSQL, PostgreSQL Setup', theory: ['detailed/theory/06-databases-complete.md', 'Sections 1, 3: SQL vs NoSQL, PostgreSQL Setup'], practice: ['practice/week-09-12-exercises.md', 'Week 12 Ex 1: Create Neon/Supabase PostgreSQL database'], lc: 'None', project: 'None', success: 'PostgreSQL instance live; you articulate 3 cases for SQL vs MongoDB.', split: '0:00–0:25 review Mongo | 0:25–1:15 SQL theory | 1:15–2:00 PG setup' },
  79: { topic: 'Schema Design, JOINs, Normalization', theory: ['detailed/theory/06-databases-complete.md', 'Section 3: Schema Design, JOINs'], practice: ['practice/week-09-12-exercises.md', 'Week 12 Ex 1: users + orders schema with FK, indexes'], lc: 'None', project: 'None', success: 'Schema diagram drawn; FK constraints defined; 3NF explained for your schema.', split: '0:00–0:20 review | 0:20–1:10 theory | 1:10–2:00 schema design' },
  80: { topic: 'Prisma ORM and Migrations', theory: ['detailed/theory/06-databases-complete.md', 'Section 3: Prisma — Schema, Migrations, Client'], practice: ['practice/week-09-12-exercises.md', 'Week 12 Ex 2: Prisma setup, initial migration, seed script'], lc: 'None', project: 'None', success: 'prisma migrate dev runs; seed populates test users and orders.', split: '0:00–0:25 review | 0:25–1:15 Prisma theory | 1:15–2:00 Prisma setup' },
  81: { topic: 'Redis Caching and Rate Limiting', theory: ['detailed/theory/06-databases-complete.md', 'Section 4: Redis — Caching, Sessions, Rate Limiting'], practice: ['practice/week-09-12-exercises.md', 'Week 12 Ex 4–5: Cache GET /users/:id, rate limit 100 req/min'], lc: 'None', project: 'None', success: 'Cache hit/miss logged; rate limiter returns 429 after threshold.', split: '0:00–0:20 review | 0:20–1:10 Redis theory | 1:10–2:00 cache + rate limit' },
  82: { topic: 'BST — Kth Smallest Element', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 6: Trees — BST inorder'], practice: ['practice/week-09-12-exercises.md', 'Week 12 Ex 3: JOIN query users with order totals'], lc: lc('kth-smallest-element-in-a-bst', 230, 'Kth Smallest Element in a BST'), project: 'None', success: 'LC 230 solved with inorder traversal; JOIN query returns correct aggregates.', split: '0:00–0:30 BST theory | 0:30–1:30 LC 230 | 1:30–2:00 JOIN query' },
  83: { topic: 'Rebuild Blog with PostgreSQL', theory: ['detailed/theory/06-databases-complete.md', 'Section 3: Prisma relations — one-to-many, many-to-many'], practice: ['practice/week-09-12-exercises.md', 'Week 12 weekend: Same blog API with Prisma + PostgreSQL'], lc: `${lc('product-of-array-except-self', 238, 'Product of Array Except Self')}, ${lc('valid-anagram', 242, 'Valid Anagram')}`, project: 'Rebuild blog API with PostgreSQL — compare response times and schema with Mongo version', success: 'PG blog API feature parity with Mongo version; comparison doc started.', split: '0:00–6:00 PG blog rebuild | 6:00–8:00 LC' },
  84: { topic: 'Rate Limiter + Redis Sessions + 100 LC Milestone', theory: ['detailed/theory/06-databases-complete.md', 'Section 4: Redis session store'], practice: ['practice/week-09-12-exercises.md', 'Write Mongo vs SQL tradeoffs README; Redis session for auth'], lc: `${lc('meeting-rooms', 252, 'Meeting Rooms')}, ${lc('missing-number', 268, 'Missing Number')}`, project: 'Rate limiter + Redis session integration; Mongo vs SQL comparison README', success: '100+ LC milestone reached; README compares Mongo vs SQL with real examples from your APIs.', split: '0:00–4:00 Redis session | 4:00–8:00 LC + README + Month 3 review' },
})) { setDay(+n, d); }


// MONTH 4 — Days 85-112 (TaskFlow + ShopLite)
const taskflowDays = {
  85: { topic: 'TaskFlow Project Setup — Monorepo, TS, ESLint', theory: ['detailed/theory/05-nodejs-express-complete.md', 'Section 6: Project Structure for production apps'], practice: ['practice/week-13-16-exercises.md', 'TaskFlow: Initialize monorepo (Turborepo or npm workspaces), shared TS config'], lc: 'None', project: 'TaskFlow setup — monorepo structure, ESLint, Prettier, Husky pre-commit', success: 'Monorepo builds; packages/api and packages/web scaffolded; CI-ready structure.', split: '0:00–0:25 review Month 3 | 0:25–1:15 architecture theory | 1:15–2:00 monorepo setup' },
  86: { topic: 'TaskFlow Database Models — User, Team, Project, Task', theory: ['detailed/theory/06-databases-complete.md', 'Section 2: Mongoose schema design for nested entities'], practice: ['practice/week-13-16-exercises.md', 'Define Mongoose schemas with refs: User, Team, Project, Task'], lc: 'None', project: 'TaskFlow models — all schemas with validation, indexes on teamId/projectId', success: 'Four models defined with proper refs and validation; ERD diagram in README.', split: '0:00–0:20 review | 0:20–1:10 schema theory | 1:10–2:00 model definitions' },
  87: { topic: 'TaskFlow Auth Integration — JWT + Refresh', theory: ['detailed/theory/07-auth-devops-complete.md', 'Sections 1–2: Integrate auth into existing project'], practice: ['practice/week-13-16-exercises.md', 'Port auth microservice patterns into TaskFlow API'], lc: 'None', project: 'TaskFlow auth — register, login, refresh, protect all task routes', success: 'Auth flow works end-to-end in TaskFlow; tokens stored securely.', split: '0:00–0:25 review | 0:25–1:15 auth theory | 1:15–2:00 auth integration' },
  88: { topic: 'TaskFlow Teams + Invite API', theory: ['detailed/theory/05-nodejs-express-complete.md', 'Section 9: REST design for nested resources'], practice: ['practice/week-13-16-exercises.md', 'POST /teams, POST /teams/:id/invite, GET /teams/:id/members'], lc: 'None', project: 'Teams API — create team, invite by email, accept invite flow', success: 'Team CRUD works; invite generates token; member list returns roles.', split: '0:00–0:20 review | 0:20–1:10 REST nested resources | 1:10–2:00 teams API' },
  89: { topic: 'Meeting Rooms II — Interval Scheduling', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern: Intervals — meeting rooms'], practice: ['practice/week-13-16-exercises.md', 'Review TaskFlow API progress'], lc: lc('meeting-rooms-ii', 253, 'Meeting Rooms II'), project: 'None', success: 'LC 253 solved with min-heap or sweep line; you explain interval overlap.', split: '0:00–0:30 interval theory | 0:30–2:00 LC 253' },
  90: { topic: 'TaskFlow Tasks CRUD + Comments + Permissions', theory: ['detailed/theory/05-nodejs-express-complete.md', 'Section 6: Service layer for complex business logic'], practice: ['practice/week-13-16-exercises.md', 'Tasks: create, assign, status, priority, due date, comments, RBAC'], lc: `${lc('move-zeroes', 283, 'Move Zeroes')}, ${lc('find-the-duplicate-number', 287, 'Find the Duplicate Number')}`, project: 'TaskFlow tasks module — full CRUD, comments, owner/member/viewer permissions', success: 'Tasks CRUD with role checks; comments thread on tasks; 2 LC done.', split: '0:00–6:00 tasks module | 6:00–8:00 LC' },
  91: { topic: 'TaskFlow Real-Time Updates — Socket.io', theory: ['detailed/theory/05-nodejs-express-complete.md', 'Section 10: WebSockets with Socket.io'], practice: ['practice/week-13-16-exercises.md', 'Socket.io: task update broadcasts to team room'], lc: `${lc('longest-increasing-subsequence', 300, 'Longest Increasing Subsequence')}, ${lc('coin-change', 322, 'Coin Change')}`, project: 'Socket.io integration — join team room, broadcast task create/update/delete events', success: 'Two browser tabs see real-time task updates; socket auth verified.', split: '0:00–6:00 Socket.io | 6:00–8:00 LC' },
  92: { topic: 'TaskFlow File Upload — Multer / S3', theory: ['detailed/theory/07-auth-devops-complete.md', 'Section 5: File Storage — local vs S3'], practice: ['practice/week-13-16-exercises.md', 'POST /tasks/:id/attachments with Multer or S3 presigned URL'], lc: 'None', project: 'File upload — attach files to tasks, validate mime type and size limit', success: 'Files upload and link to tasks; size/type validation returns 400 for invalid.', split: '0:00–0:25 review | 0:25–1:15 file storage theory | 1:15–2:00 upload implementation' },
  93: { topic: 'TaskFlow Email Notifications', theory: ['detailed/theory/07-auth-devops-complete.md', 'Section 6: Email — Nodemailer, SendGrid, queues'], practice: ['practice/week-13-16-exercises.md', 'Send email on task assignment and invite acceptance'], lc: 'None', project: 'Email notifications — task assigned, invite sent (use Ethereal or SendGrid test)', success: 'Emails trigger on events; templates for assignment and invite.', split: '0:00–0:20 review | 0:20–1:10 email theory | 1:10–2:00 email integration' },
  94: { topic: 'TaskFlow Frontend — Dashboard Layout (Next.js)', theory: ['detailed/theory/04-nextjs-complete.md', 'Section 3: Layouts, nested layouts in App Router'], practice: ['practice/week-13-16-exercises.md', 'Next.js dashboard: sidebar, header, team switcher, responsive'], lc: 'None', project: 'TaskFlow frontend — dashboard shell with sidebar navigation and team context', success: 'Dashboard layout renders; sidebar collapses on mobile; team switcher works.', split: '0:00–0:25 review | 0:25–1:15 Next layouts | 1:15–2:00 dashboard UI' },
  95: { topic: 'TaskFlow Frontend — Kanban Task Board', theory: ['detailed/theory/03-react-complete.md', 'Section 9: Drag-and-drop patterns (dnd-kit or native)'], practice: ['practice/week-13-16-exercises.md', 'Kanban columns: Todo, In Progress, Done — drag or click to move status'], lc: 'None', project: 'Kanban board UI — columns by status, task cards, quick edit modal', success: 'Tasks move between columns; status syncs with API; optimistic updates.', split: '0:00–0:20 review | 0:20–1:10 dnd patterns | 1:10–2:00 kanban board' },
  96: { topic: 'Coin Change — Dynamic Programming', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 8: DP — unbounded knapsack / coin change'], practice: ['practice/week-13-16-exercises.md', 'Review TaskFlow frontend'], lc: lc('coin-change', 322, 'Coin Change'), project: 'None', success: 'LC 322 solved bottom-up; you explain dp[i] = min coins for amount i.', split: '0:00–0:30 DP theory | 0:30–2:00 LC 322' },
  97: { topic: 'TaskFlow Docker Compose — app + mongo + redis', theory: ['detailed/theory/07-auth-devops-complete.md', 'Section 5: Docker & Docker Compose'], practice: ['practice/week-13-16-exercises.md', 'Dockerfile for API and web; docker-compose.yml with mongo, redis'], lc: `${lc('top-k-frequent-elements', 347, 'Top K Frequent Elements')}, ${lc('intersection-of-two-arrays', 349, 'Intersection of Two Arrays')}`, project: 'Docker Compose — full stack runs with docker compose up; .env.example documented', success: 'docker compose up starts all services; README has Docker instructions.', split: '0:00–6:00 Docker | 6:00–8:00 LC' },
  98: { topic: 'TaskFlow Polish, Bugs, README', theory: ['detailed/theory/07-auth-devops-complete.md', 'Section 5: Production checklist'], practice: ['practice/week-13-16-exercises.md', 'Bug bash: test all flows, fix edge cases, write architecture diagram'], lc: 'Review TaskFlow-week LC list', project: 'Polish TaskFlow — fix bugs, architecture diagram in README, demo GIF', success: 'TaskFlow deployed milestone; README has diagram, features list, setup steps.', split: '0:00–8:00 polish, bugs, README, architecture diagram' },
  99: { topic: 'ShopLite Setup — Product Schema (PostgreSQL)', theory: ['detailed/theory/06-databases-complete.md', 'Section 3: E-commerce schema — products, categories, inventory'], practice: ['practice/week-13-16-exercises.md', 'ShopLite: Prisma schema for Product, Category, Cart, Order'], lc: 'None', project: 'ShopLite setup — PostgreSQL schema, Prisma migrate, seed products', success: 'ShopLite repo scaffolded; product schema with categories and stock count.', split: '0:00–0:25 TaskFlow review | 0:25–1:15 e-commerce schema | 1:15–2:00 ShopLite setup' },
  100: { topic: 'ShopLite Product Catalog API + Admin Routes', theory: ['detailed/theory/05-nodejs-express-complete.md', 'Section 9: REST for catalog with filtering'], practice: ['practice/week-13-16-exercises.md', 'GET /products?category=&search=, admin POST/PUT/DELETE /admin/products'], lc: 'None', project: 'Product catalog API — public listing with filters, admin CRUD protected by RBAC', success: 'Catalog filters by category and search; admin routes require admin role.', split: '0:00–0:20 review | 0:20–1:10 catalog patterns | 1:10–2:00 catalog API' },
  101: { topic: 'ShopLite Cart + Redis Session', theory: ['detailed/theory/06-databases-complete.md', 'Section 4: Redis for cart sessions'], practice: ['practice/week-13-16-exercises.md', 'Cart: add, update qty, remove, get cart — stored in Redis session'], lc: 'None', project: 'Shopping cart — Redis-backed session cart with expiry', success: 'Cart persists across requests; guest cart works without login.', split: '0:00–0:25 review | 0:25–1:15 Redis sessions | 1:15–2:00 cart API' },
  102: { topic: 'ShopLite Checkout + Order Creation', theory: ['detailed/theory/06-databases-complete.md', 'Section 3: Transactions — ACID order creation'], practice: ['practice/week-13-16-exercises.md', 'POST /checkout — validate stock, create order, decrement inventory in transaction'], lc: 'None', project: 'Checkout flow — order creation with Prisma $transaction, stock validation', success: 'Order created atomically; insufficient stock returns 409; order history query works.', split: '0:00–0:20 review | 0:20–1:10 transactions | 1:10–2:00 checkout' },
  103: { topic: 'Longest Increasing Subsequence', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 8: DP — LIS with binary search optimization'], practice: ['practice/week-13-16-exercises.md', 'Review ShopLite checkout code'], lc: lc('longest-increasing-subsequence', 300, 'Longest Increasing Subsequence'), project: 'None', success: 'LC 300 solved O(n log n) with patience sorting or DP approach.', split: '0:00–0:30 LIS theory | 0:30–2:00 LC 300' },
  104: { topic: 'ShopLite Payment Integration — Razorpay/Stripe Test', theory: ['detailed/theory/07-auth-devops-complete.md', 'Section 6: Payment integration patterns'], practice: ['practice/week-13-16-exercises.md', 'Stripe/Razorpay test mode: create payment intent, webhook handler stub'], lc: `${lc('sum-of-two-integers', 371, 'Sum of Two Integers')}, ${lc('find-k-pairs-with-smallest-sums', 373, 'Find K Pairs with Smallest Sums')}`, project: 'Payment integration — test checkout with Stripe/Razorpay sandbox', success: 'Test payment completes in sandbox; webhook logs payment.succeeded event.', split: '0:00–6:00 payment integration | 6:00–8:00 LC' },
  105: { topic: 'ShopLite Order Management + Admin Dashboard', theory: ['detailed/theory/04-nextjs-complete.md', 'Section 4: Server Components for admin data tables'], practice: ['practice/week-13-16-exercises.md', 'Admin: order list, status update, product management UI'], lc: `${lc('kth-smallest-element-in-a-sorted-matrix', 378, 'Kth Smallest Element in a Sorted Matrix')}, ${lc('is-subsequence', 392, 'Is Subsequence')}`, project: 'Admin dashboard — orders table, status filters, product edit forms', success: 'Admin can view/update orders; dashboard shows revenue summary.', split: '0:00–6:00 admin dashboard | 6:00–8:00 LC' },
  106: { topic: 'Jest Unit Tests', theory: ['detailed/theory/07-auth-devops-complete.md', 'Section 7: Testing — Jest unit tests'], practice: ['practice/week-13-16-exercises.md', 'Unit tests for utility functions: validation, price calc, cart helpers'], lc: 'None', project: 'Jest unit tests — ≥10 tests for utils and services, coverage report', success: 'npm test passes; coverage ≥70% on utils/services.', split: '0:00–0:25 review | 0:25–1:15 Jest theory | 1:15–2:00 write tests' },
  107: { topic: 'Supertest API Integration Tests', theory: ['detailed/theory/07-auth-devops-complete.md', 'Section 7: Supertest for API endpoints'], practice: ['practice/week-13-16-exercises.md', 'Integration tests: auth flow, product CRUD, checkout with test DB'], lc: 'None', project: 'API integration tests — auth, products, cart, checkout endpoints', success: 'Supertest suite runs against test database; CI-ready test script.', split: '0:00–0:20 review | 0:20–1:10 Supertest theory | 1:10–2:00 API tests' },
  108: { topic: 'React Testing Library', theory: ['detailed/theory/03-react-complete.md', 'Section 12: Testing React Components'], practice: ['practice/week-13-16-exercises.md', 'RTL tests: product card, cart button, login form submission'], lc: 'None', project: 'RTL component tests — 5+ components with user-event interactions', success: 'RTL tests simulate user clicks and form submit; tests pass in CI.', split: '0:00–0:25 review | 0:25–1:15 RTL theory | 1:15–2:00 component tests' },
  109: { topic: 'GitHub Actions CI Pipeline', theory: ['detailed/theory/07-auth-devops-complete.md', 'Section 8: CI/CD with GitHub Actions'], practice: ['practice/week-13-16-exercises.md', 'CI workflow: lint, test, build on pull request'], lc: 'None', project: 'GitHub Actions — ci.yml runs lint + test + build on push/PR', success: 'Green CI badge on README; failed tests block merge.', split: '0:00–0:20 review | 0:20–1:10 CI theory | 1:10–2:00 GitHub Actions' },
  110: { topic: 'Top K Frequent Elements — Heap', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 3: Hash Map + Heap'], practice: ['practice/week-13-16-exercises.md', 'Review CI pipeline'], lc: lc('top-k-frequent-elements', 347, 'Top K Frequent Elements'), project: 'None', success: 'LC 347 solved with heap or bucket sort; 150 LC milestone approaching.', split: '0:00–0:30 heap theory | 0:30–2:00 LC 347' },
  111: { topic: 'Deploy Both Projects — Vercel + Render', theory: ['detailed/theory/07-auth-devops-complete.md', 'Section 8: Deployment — Vercel, Render, env vars'], practice: ['practice/week-13-16-exercises.md', 'Deploy TaskFlow frontend (Vercel) + API (Render), ShopLite same pattern'], lc: `${lc('evaluate-division', 399, 'Evaluate Division')}, ${lc('partition-equal-subset-sum', 416, 'Partition Equal Subset Sum')}`, project: 'Deploy TaskFlow + ShopLite — live URLs, env vars, health check endpoints', success: 'Both projects have live demo URLs; health checks return 200.', split: '0:00–8:00 deployment marathon' },
  112: { topic: 'Architecture Diagrams + Resume Bullets + 150 LC', theory: ['detailed/theory/07-auth-devops-complete.md', 'Section 8: Documentation for portfolio'], practice: ['practice/week-13-16-exercises.md', 'Write resume bullets with metrics for both projects'], lc: `${lc('longest-repeating-character-replacement', 424, 'Longest Repeating Character Replacement')}, ${lc('non-overlapping-intervals', 435, 'Non-overlapping Intervals')}`, project: 'Architecture diagrams (draw.io/mermaid), resume bullets, GitHub pinned repos', success: '150+ LC milestone; resume has 3 quantified project bullets; diagrams in both READMEs.', split: '0:00–4:00 diagrams + resume | 4:00–8:00 LC + Month 4 review' },
};
for (const [n, d] of Object.entries(taskflowDays)) setDay(+n, d);


// MONTH 5 — Days 113-140 (DSA + LLD)
for (const [n, d] of Object.entries({
  113: { topic: 'Two Pointers — 3Sum, Container With Most Water', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 1: Two Pointers — opposite ends, fast/slow'], practice: ['practice/week-17-20-exercises.md', 'Week 17 Mon: Timed 2-problem session — explain approach before coding'], lc: `${lc('3sum', 15, '3Sum')}, ${lc('container-with-most-water', 11, 'Container With Most Water')}`, project: 'None', success: 'Both mediums solved in ≤35 min each with clean two-pointer approach.', split: '0:00–0:30 pattern review | 0:30–2:00 timed LC 15 + LC 11' },
  114: { topic: 'Sliding Window — Longest Substring, Character Replacement', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 2: Sliding Window — fixed and variable'], practice: ['practice/week-17-20-exercises.md', 'Week 17 Tue: Draw window state on paper before coding'], lc: `${lc('longest-substring-without-repeating-characters', 3, 'Longest Substring Without Repeating Characters')}, ${lc('longest-repeating-character-replacement', 424, 'Longest Repeating Character Replacement')}`, project: 'None', success: 'Variable window template internalized; both problems solved without hints.', split: '0:00–0:30 sliding window theory | 0:30–2:00 timed LC 3 + LC 424' },
  115: { topic: 'Hash Map — Group Anagrams, Longest Consecutive Sequence', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 3: Hash Map & Set'], practice: ['practice/week-17-20-exercises.md', 'Week 17 Wed: Write brute force first, then optimize'], lc: `${lc('group-anagrams', 49, 'Group Anagrams')}, ${lc('longest-consecutive-sequence', 128, 'Longest Consecutive Sequence')}`, project: 'None', success: 'LC 128 solved O(n) with hash set; anagram grouping uses sorted key or count array.', split: '0:00–0:30 hash map theory | 0:30–2:00 LC 49 + LC 128' },
  116: { topic: 'Subarray Problems — Prefix Sum + Sliding Window', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 2–3: Subarray sum patterns'], practice: ['practice/week-17-20-exercises.md', 'Week 17 Thu: Mixed subarray problems'], lc: `${lc('subarray-sum-equals-k', 560, 'Subarray Sum Equals K')}, ${lc('minimum-window-substring', 76, 'Minimum Window Substring')}`, project: 'None', success: 'LC 560 with prefix sum map; LC 76 with variable window — both explained aloud.', split: '0:00–0:30 subarray theory | 0:30–2:00 LC 560 + LC 76' },
  117: { topic: 'Revision Day — 2 Weakest Patterns', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Review Patterns 1–3 — skim failed problems'], practice: ['practice/week-17-20-exercises.md', 'Week 17 Fri: Redo 2 hardest problems from Mon–Thu without looking at old code'], lc: 'Self-selected — pick 2 problems you failed or took >45 min', project: 'None', success: 'Both redo problems solved faster than first attempt; gaps logged in REVIEW.md.', split: '0:00–0:30 identify weak patterns | 0:30–2:00 redo 2 problems timed' },
  118: { topic: 'Sliding Window Hard Batch', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 2: Advanced sliding window'], practice: ['practice/week-17-20-exercises.md', 'Week 17 Sat: 3 hard sliding window problems timed'], lc: `${lc('sliding-window-maximum', 239, 'Sliding Window Maximum')}, ${lc('find-all-anagrams-in-a-string', 438, 'Find All Anagrams in a String')}, ${lc('permutation-in-string', 567, 'Permutation in String')}`, project: 'None', success: '3/3 sliding window hards solved; deque technique for LC 239 understood.', split: '0:00–2:00 LC 239 | 2:00–4:00 LC 438 | 4:00–6:00 LC 567 | 6:00–8:00 review + notes' },
  119: { topic: 'LLD: LRU Cache — Full Implementation', theory: ['detailed/theory/09-lld-complete.md', 'LLD Problem 1: LRU Cache — requirements, class diagram'], practice: ['practice/week-17-20-exercises.md', 'Week 17 Sun: LRU Cache in TypeScript — HashMap + Doubly Linked List'], lc: 'Optional warm-up: LC 146 LRU Cache', project: 'LLD: LRU Cache — get/put O(1), capacity eviction, unit tests, explain aloud 10 min', success: 'LRU Cache passes LC 146 equivalent tests; class diagram and extensibility explained.', split: '0:00–1:00 requirements + diagram | 1:00–5:00 implement + test | 5:00–8:00 explain aloud + code review' },
  120: { topic: 'Binary Search — Rotated Array, Find Minimum', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 2: Binary Search — rotated, boundary'], practice: ['practice/week-17-20-exercises.md', 'Week 18 Mon: Binary search template practice'], lc: `${lc('search-in-rotated-sorted-array', 33, 'Search in Rotated Sorted Array')}, ${lc('find-minimum-in-rotated-sorted-array', 153, 'Find Minimum in Rotated Sorted Array')}`, project: 'None', success: 'Both rotated array problems solved with unified binary search template.', split: '0:00–0:30 BS theory | 0:30–2:00 LC 33 + LC 153' },
  121: { topic: 'Binary Search on Answer — 2D Matrix, Koko Eating Bananas', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 2: Binary Search on Answer Space'], practice: ['practice/week-17-20-exercises.md', 'Week 18 Tue: Identify monotonic predicate before coding'], lc: `${lc('search-a-2d-matrix', 74, 'Search a 2D Matrix')}, ${lc('koko-eating-bananas', 875, 'Koko Eating Bananas')}`, project: 'None', success: 'LC 875 solved with BS on answer; you explain predicate function clearly.', split: '0:00–0:30 BS-on-answer theory | 0:30–2:00 LC 74 + LC 875' },
  122: { topic: 'Stack — Daily Temperatures, Largest Rectangle', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 4: Monotonic Stack'], practice: ['practice/week-17-20-exercises.md', 'Week 18 Wed: Monotonic stack template'], lc: `${lc('daily-temperatures', 739, 'Daily Temperatures')}, ${lc('largest-rectangle-in-histogram', 84, 'Largest Rectangle in Histogram')}`, project: 'None', success: 'Monotonic stack template applied to both; LC 84 attempted (study solution if stuck 40+ min).', split: '0:00–0:30 stack theory | 0:30–2:00 LC 739 + LC 84' },
  123: { topic: 'Linked List Hard — Reverse k-Group, Copy with Random Pointer', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 5: Linked List — advanced'], practice: ['practice/week-17-20-exercises.md', 'Week 18 Thu: Draw pointer mutations on paper first'], lc: `${lc('reverse-nodes-in-k-group', 25, 'Reverse Nodes in k-Group')}, ${lc('copy-list-with-random-pointer', 138, 'Copy List with Random Pointer')}`, project: 'None', success: 'At least 1/2 hard LL solved; pointer diagram drawn before coding.', split: '0:00–0:30 LL theory | 0:30–2:00 LC 25 + LC 138' },
  124: { topic: 'Revision Day — Week 18 Weak Spots', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Patterns 2, 4, 5 review'], practice: ['practice/week-17-20-exercises.md', 'Week 18 Fri: Redo 2 weakest from Mon–Thu'], lc: 'Self-selected revision problems', project: 'None', success: 'Weak patterns identified; redo time improved ≥25% vs first attempt.', split: '0:00–0:30 review notes | 0:30–2:00 redo 2 problems' },
  125: { topic: 'Intervals — Merge, Insert, Min Arrows', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern: Intervals — merge and sweep'], practice: ['practice/week-17-20-exercises.md', 'Week 18 Sat: 3 interval problems timed'], lc: `${lc('merge-intervals', 56, 'Merge Intervals')}, ${lc('insert-interval', 57, 'Insert Interval')}, ${lc('minimum-number-of-arrows-to-burst-balloons', 452, 'Minimum Number of Arrows to Burst Balloons')}`, project: 'None', success: '3 interval problems solved; merge template reusable for scheduling problems.', split: '0:00–2:00 LC 56 | 2:00–4:00 LC 57 | 4:00–6:00 LC 452 | 6:00–8:00 notes' },
  126: { topic: 'LLD: Rate Limiter + Parking Lot', theory: ['detailed/theory/09-lld-complete.md', 'LLD Problem 2: Rate Limiter; LLD Problem 3: Parking Lot'], practice: ['practice/week-17-20-exercises.md', 'Week 18 Sun: Token bucket rate limiter + multi-floor parking lot'], lc: 'None', project: 'LLD: Rate Limiter (token bucket) + Parking Lot (OOP design with Vehicle types)', success: 'Both LLD problems coded in TypeScript; 10-min requirements + diagram each; extensibility discussed.', split: '0:00–4:00 Rate Limiter | 4:00–8:00 Parking Lot' },
  127: { topic: 'Tree BFS — Level Order, Construct from Preorder/Inorder', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 6: Trees — BFS level order'], practice: ['practice/week-17-20-exercises.md', 'Week 19 Mon: BFS with queue template'], lc: `${lc('binary-tree-level-order-traversal', 102, 'Binary Tree Level Order Traversal')}, ${lc('construct-binary-tree-from-preorder-and-inorder-traversal', 105, 'Construct Binary Tree from Preorder and Inorder Traversal')}`, project: 'None', success: 'BFS template applied; LC 105 solved with recursive divide on inorder index.', split: '0:00–0:30 tree BFS theory | 0:30–2:00 LC 102 + LC 105' },
  128: { topic: 'Tree Properties — Right Side View, LCA', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 6: Trees — DFS variants'], practice: ['practice/week-17-20-exercises.md', 'Week 19 Tue: DFS with state passing'], lc: `${lc('binary-tree-right-side-view', 199, 'Binary Tree Right Side View')}, ${lc('lowest-common-ancestor-of-a-binary-tree', 236, 'Lowest Common Ancestor of a Binary Tree')}`, project: 'None', success: 'LC 236 solved with recursive LCA; right side view uses BFS or DFS with depth tracking.', split: '0:00–0:30 tree DFS theory | 0:30–2:00 LC 199 + LC 236' },
  129: { topic: 'Graph BFS/DFS — Number of Islands, Clone Graph', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 7: Graphs — BFS/DFS on grid and adjacency list'], practice: ['practice/week-17-20-exercises.md', 'Week 19 Wed: Graph traversal templates'], lc: `${lc('number-of-islands', 200, 'Number of Islands')}, ${lc('clone-graph', 133, 'Clone Graph')}`, project: 'None', success: 'Both graph problems solved; you explain visited set vs in-place marking tradeoff.', split: '0:00–0:30 graph theory | 0:30–2:00 LC 200 + LC 133' },
  130: { topic: 'Topological Sort — Course Schedule I & II', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 7: Graphs — Topological Sort (Kahn\'s / DFS)'], practice: ['practice/week-17-20-exercises.md', 'Week 19 Thu: Draw DAG before coding topo sort'], lc: `${lc('course-schedule', 207, 'Course Schedule')}, ${lc('course-schedule-ii', 210, 'Course Schedule II')}`, project: 'None', success: 'Cycle detection works for LC 207; LC 210 returns valid ordering.', split: '0:00–0:30 topo sort theory | 0:30–2:00 LC 207 + LC 210' },
  131: { topic: 'Revision Day — Trees + Graphs', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Patterns 6–7 review'], practice: ['practice/week-17-20-exercises.md', 'Week 19 Fri: Redo 2 weakest tree/graph problems'], lc: 'Self-selected revision', project: 'None', success: 'Tree and graph templates written on flashcard; 2 redo problems solved.', split: '0:00–0:30 flashcards | 0:30–2:00 redo 2 problems' },
  132: { topic: 'Graph Hard Batch — Word Ladder, Surrounded Regions, Pacific Atlantic', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 7: Multi-source BFS, boundary DFS'], practice: ['practice/week-17-20-exercises.md', 'Week 19 Sat: 3 graph mediums timed'], lc: `${lc('word-ladder', 127, 'Word Ladder')}, ${lc('surrounded-regions', 130, 'Surrounded Regions')}, ${lc('pacific-atlantic-water-flow', 417, 'Pacific Atlantic Water Flow')}`, project: 'None', success: '2/3 graph mediums solved; multi-source BFS understood for LC 417.', split: '0:00–2:00 LC 127 | 2:00–4:00 LC 130 | 4:00–6:00 LC 417 | 6:00–8:00 review' },
  133: { topic: 'LLD: Splitwise + Vending Machine', theory: ['detailed/theory/09-lld-complete.md', 'LLD Problem 4: Splitwise; LLD Problem 5: Vending Machine'], practice: ['practice/week-17-20-exercises.md', 'Week 19 Sun: Expense splitting + vending machine state machine'], lc: 'None', project: 'LLD: Splitwise (add expense, split equally/exact, balance sheet) + Vending Machine (states, inventory, change)', success: 'Both systems coded with clear class responsibilities; state pattern used in vending machine.', split: '0:00–4:00 Splitwise | 4:00–8:00 Vending Machine' },
  134: { topic: '1D Dynamic Programming — House Robber I & II', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 8: DP — 1D linear'], practice: ['practice/week-17-20-exercises.md', 'Week 20 Mon: DP recurrence before code'], lc: `${lc('house-robber', 198, 'House Robber')}, ${lc('house-robber-ii', 213, 'House Robber II')}`, project: 'None', success: 'Both house robber variants solved; recurrence relation written on paper first.', split: '0:00–0:30 1D DP theory | 0:30–2:00 LC 198 + LC 213' },
  135: { topic: 'Coin Change Pattern — Unbounded Knapsack', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 8: DP — coin change variants'], practice: ['practice/week-17-20-exercises.md', 'Week 20 Tue: Compare top-down vs bottom-up'], lc: `${lc('coin-change', 322, 'Coin Change')}, ${lc('coin-change-ii', 518, 'Coin Change II')}`, project: 'None', success: 'LC 322 and LC 518 solved bottom-up; you explain difference (min vs count ways).', split: '0:00–0:30 coin change theory | 0:30–2:00 LC 322 + LC 518' },
  136: { topic: 'String DP — LCS and Edit Distance', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 8: DP — 2D string DP'], practice: ['practice/week-17-20-exercises.md', 'Week 20 Wed: Fill DP table on paper for small input'], lc: `${lc('longest-common-subsequence', 1143, 'Longest Common Subsequence')}, ${lc('edit-distance', 72, 'Edit Distance')}`, project: 'None', success: '2D DP table drawn manually for "abc"/"adc"; both problems solved.', split: '0:00–0:30 string DP theory | 0:30–2:00 LC 1143 + LC 72' },
  137: { topic: 'DP Hard — Burst Balloons or Decode Ways', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 8: DP — interval and counting'], practice: ['practice/week-17-20-exercises.md', 'Week 20 Thu: Pick harder DP — spend full 2h on one problem'], lc: `${lc('burst-balloons', 312, 'Burst Balloons')} OR ${lc('decode-ways', 91, 'Decode Ways')}`, project: 'None', success: 'One hard DP solved or thoroughly studied with solution after 45 min attempt.', split: '0:00–0:30 hard DP theory | 0:30–2:00 one hard DP deep dive' },
  138: { topic: 'Mixed DP Revision — 5 Problems', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 8: Full DP review'], practice: ['practice/week-17-20-exercises.md', 'Week 20 Fri: 5 mixed DP problems — 20 min each'], lc: 'Pick 5 from: LC 70, 139, 198, 322, 518, 1143 (unsolved or weak)', project: 'None', success: '≥3/5 mixed DP solved in 20 min each; DP pattern cheat sheet updated.', split: '0:00–0:30 DP cheat sheet | 0:30–2:00 5 mixed DP timed' },
  139: { topic: 'DP Hard Batch — Word Break, Max Product, Partition', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Pattern 8: Advanced DP'], practice: ['practice/week-17-20-exercises.md', 'Week 20 Sat: 3 DP mediums/hards'], lc: `${lc('word-break', 139, 'Word Break')}, ${lc('maximum-product-subarray', 152, 'Maximum Product Subarray')}, ${lc('partition-equal-subset-sum', 416, 'Partition Equal Subset Sum')}`, project: 'None', success: '2/3 DP batch solved; word break uses DP + set lookup.', split: '0:00–2:00 LC 139 | 2:00–4:00 LC 152 | 4:00–6:00 LC 416 | 6:00–8:00 review' },
  140: { topic: 'LLD: BookMyShow + 200 LC Milestone', theory: ['detailed/theory/09-lld-complete.md', 'LLD Problem 6: BookMyShow Seat Booking'], practice: ['practice/week-17-20-exercises.md', 'Week 20 Sun: Seat locking, show, theatre, booking flow'], lc: 'Review LC count — target 200+ total solved', project: 'LLD: BookMyShow — Theatre, Show, Seat (locked/booked/available), concurrent booking handling', success: '200+ LC milestone; BookMyShow core booking flow coded; 6 LLD problems complete.', split: '0:00–4:00 BookMyShow LLD | 4:00–6:00 LC count audit | 6:00–8:00 Month 5 review' },
})) { setDay(+n, d); }


// MONTH 6 — Days 141-168 (System Design + Interviews)
for (const [n, d] of Object.entries({
  141: { topic: 'System Design Framework + Capacity Estimation', theory: ['detailed/theory/10-system-design-complete.md', 'Interview Framework (RADIO/RESHADED) + Estimation'], practice: ['practice/week-21-24-exercises.md', 'Week 21 Mon: Practice estimation on URL Shortener (QPS, storage)'], lc: '1 medium timed (self-selected from weak list)', project: 'None', success: 'You can run RADIO framework in 5 min; back-of-envelope QPS/storage for any system.', split: '0:00–0:45 SD framework | 0:45–1:30 estimation drills | 1:30–2:00 1 LC medium' },
  142: { topic: 'HLD: URL Shortener', theory: ['detailed/theory/10-system-design-complete.md', 'Design 1: URL Shortener — Base62, caching, redirect'], practice: ['practice/week-21-24-exercises.md', 'Week 21 Tue: Draw full diagram — client, API, DB, cache, CDN'], lc: '1 medium timed', project: 'SD deliverable: URL Shortener diagram + component list + API design doc', success: 'Complete URL Shortener design in 45 min; Base62 encoding explained; cache strategy defined.', split: '0:00–0:45 design draw | 0:45–1:30 explain aloud | 1:30–2:00 LC' },
  143: { topic: 'HLD: Paste Bin + Rate Limiter', theory: ['detailed/theory/10-system-design-complete.md', 'Design: Paste Bin (TTL storage) + Distributed Rate Limiter'], practice: ['practice/week-21-24-exercises.md', 'Week 21 Wed: Paste Bin TTL strategy + token bucket rate limiter design'], lc: '1 medium timed', project: 'SD deliverable: Paste Bin + Rate Limiter combined notes with Redis role', success: 'Paste Bin TTL eviction explained; rate limiter uses Redis token bucket with sliding window option.', split: '0:00–0:45 Paste Bin | 0:45–1:30 Rate Limiter | 1:30–2:00 LC' },
  144: { topic: 'Caching, Load Balancing, Key-Value Store Intro', theory: ['detailed/theory/10-system-design-complete.md', 'Core Concepts: Caching, Load Balancing, Consistent Hashing'], practice: ['practice/week-21-24-exercises.md', 'Week 21 Thu: Key-Value store high-level design sketch'], lc: '1 medium timed', project: 'SD deliverable: Key-Value store sketch with consistent hashing ring diagram', success: 'Cache aside vs write-through explained; consistent hashing diagram drawn from memory.', split: '0:00–0:45 caching/LB theory | 0:45–1:30 KV store sketch | 1:30–2:00 LC' },
  145: { topic: 'SD Revision + 2 Timed Mediums', theory: ['detailed/theory/10-system-design-complete.md', 'Review Designs 1 + core concepts'], practice: ['practice/week-21-24-exercises.md', 'Week 21 Fri: Redraw URL Shortener blind in 30 min'], lc: '2 mediums timed (35 min each)', project: 'None', success: 'URL Shortener redrawn without notes in ≤30 min; 2 LC mediums under time.', split: '0:00–0:30 blind URL Shortener | 0:30–2:00 2 LC mediums' },
  146: { topic: 'URL Shortener Blind Redesign + 3 LC', theory: ['detailed/theory/10-system-design-complete.md', 'Design 1 review — deep dive on failure modes'], practice: ['practice/week-21-24-exercises.md', 'Week 21 Sat: Full 45-min blind SD + 3 LC mediums'], lc: '3 self-selected mediums (timed 35 min each, pick weak patterns)', project: 'SD: URL Shortener blind redesign — record yourself explaining for 10 min', success: 'Blind SD in 45 min with no major gaps; 3 LC mediums solved.', split: '0:00–0:45 blind SD | 0:45–3:00 3 LC | 3:00–6:00 review gaps | 6:00–8:00 record explanation' },
  147: { topic: 'Feed Systems Intro + 3 LC', theory: ['detailed/theory/10-system-design-complete.md', 'Design 2: Instagram/Twitter Feed — fan-out on write vs read'], practice: ['practice/week-21-24-exercises.md', 'Week 21 Sun: Feed system intro diagram + 3 LC mediums'], lc: '3 mediums timed', project: 'SD deliverable: Feed system fan-out vs fan-in comparison doc with tradeoffs', success: 'Fan-out on write vs read tradeoffs explained with celebrity user edge case; 3 LC done.', split: '0:00–2:00 feed systems study | 2:00–5:00 3 LC | 5:00–8:00 write comparison doc' },
  148: { topic: 'HLD: Twitter / X Feed', theory: ['detailed/theory/10-system-design-complete.md', 'Design 2: Instagram/Twitter Feed (timeline generation)'], practice: ['practice/week-21-24-exercises.md', 'Week 22 Mon: Twitter feed — home timeline, tweet creation, follow graph'], lc: '1 medium timed', project: 'SD deliverable: Twitter feed full diagram with timeline service, fan-out worker, cache', success: 'Home timeline generation explained for normal and celebrity users; tweet write path clear.', split: '0:00–0:45 Twitter feed design | 0:45–1:30 explain aloud | 1:30–2:00 LC' },
  149: { topic: 'HLD: Instagram', theory: ['detailed/theory/10-system-design-complete.md', 'Design 2: Instagram — photos, feed, stories overview'], practice: ['practice/week-21-24-exercises.md', 'Week 22 Tue: Instagram — media storage, CDN, feed ranking basics'], lc: '1 medium timed', project: 'SD deliverable: Instagram design with media upload flow and CDN strategy', success: 'Photo upload → S3 → CDN → feed pipeline drawn; metadata vs blob storage separated.', split: '0:00–0:45 Instagram design | 0:45–1:30 media pipeline | 1:30–2:00 LC' },
  150: { topic: 'HLD: Notification System', theory: ['detailed/theory/10-system-design-complete.md', 'Design 4: Notification System — push, email, SMS, queues'], practice: ['practice/week-21-24-exercises.md', 'Week 22 Wed: Notification system — priority queues, delivery guarantees'], lc: '1 medium timed', project: 'SD deliverable: Notification system with Kafka queue, worker pools, retry logic', success: 'At-least-once delivery explained; priority queue for urgent vs batch notifications.', split: '0:00–0:45 notification SD | 0:45–1:30 queue architecture | 1:30–2:00 LC' },
  151: { topic: 'Message Queues, Kafka Basics', theory: ['detailed/theory/10-system-design-complete.md', 'Core Concepts: Message Queues, Kafka, Pub/Sub'], practice: ['practice/week-21-24-exercises.md', 'Week 22 Thu: Read Kafka docs — producers, consumers, partitions, offsets'], lc: '1 medium timed', project: 'SD notes: Kafka vs RabbitMQ comparison for notification and feed use cases', success: 'Kafka partitions and consumer groups explained; comparison doc written.', split: '0:00–0:45 Kafka theory | 0:45–1:30 comparison notes | 1:30–2:00 LC' },
  152: { topic: 'SD Revision + 2 Timed Mediums', theory: ['detailed/theory/10-system-design-complete.md', 'Review Designs 2, 4'], practice: ['practice/week-21-24-exercises.md', 'Week 22 Fri: Redraw notification system blind'], lc: '2 mediums timed', project: 'None', success: 'Notification system redrawn in 30 min; 2 LC mediums under time limit.', split: '0:00–0:30 blind notification SD | 0:30–2:00 2 LC' },
  153: { topic: 'Notification SD Deep Dive + 3 LC', theory: ['detailed/theory/10-system-design-complete.md', 'Design 4: Notification — scale, dedup, preferences'], practice: ['practice/week-21-24-exercises.md', 'Week 22 Sat: Notification SD 45 min + 3 LC'], lc: '3 mediums timed', project: 'SD: Notification system with user preference filtering and deduplication strategy', success: 'Dedup and user opt-out handled in design; 3 LC mediums solved.', split: '0:00–0:45 notification deep dive | 0:45–3:00 3 LC | 3:00–8:00 review + record explanation' },
  154: { topic: 'Feed Design Fan-Out + 3 LC', theory: ['detailed/theory/10-system-design-complete.md', 'Design 2: Feed — hybrid fan-out, cache warming'], practice: ['practice/week-21-24-exercises.md', 'Week 22 Sun: Hybrid fan-out design + 3 LC mediums'], lc: '3 mediums timed', project: 'SD: Hybrid fan-out feed design — when to use write vs read fan-out', success: 'Hybrid approach justified with user follower count thresholds; 3 LC done.', split: '0:00–2:00 feed fan-out design | 2:00–5:00 3 LC | 5:00–8:00 mock explain to wall' },
  155: { topic: 'HLD: WhatsApp / Chat System', theory: ['detailed/theory/10-system-design-complete.md', 'Design 3: Chat System (WhatsApp-like)'], practice: ['practice/week-21-24-exercises.md', 'Week 23 Mon: Chat — 1:1 messaging, message sync, delivery receipts'], lc: '1 medium timed', project: 'SD deliverable: Chat system with WebSocket gateway, message store, sync protocol', success: '1:1 chat message flow drawn; online/offline message queue explained.', split: '0:00–0:45 chat SD | 0:45–1:30 WebSocket architecture | 1:30–2:00 LC' },
  156: { topic: 'WebSockets, Online Presence, Last Seen', theory: ['detailed/theory/10-system-design-complete.md', 'Design 3: Online Presence + Last Seen'], practice: ['practice/week-21-24-exercises.md', 'Week 23 Tue: Presence service — heartbeat, connection registry'], lc: '1 medium timed', project: 'SD deliverable: Presence system with Redis pub/sub and heartbeat timeout', success: 'Presence heartbeat interval and stale detection explained; last seen storage strategy defined.', split: '0:00–0:45 presence theory | 0:45–1:30 presence design | 1:30–2:00 LC' },
  157: { topic: 'HLD: YouTube (Lite) + Google Docs Intro', theory: ['detailed/theory/10-system-design-complete.md', 'Design: Video Streaming (YouTube lite) + Collaborative editing basics'], practice: ['practice/week-21-24-exercises.md', 'Week 23 Wed: Video upload, transcoding pipeline, adaptive bitrate'], lc: '1 medium timed', project: 'SD deliverable: YouTube lite — upload, transcode, CDN delivery, view count', success: 'Video transcoding pipeline drawn; adaptive bitrate streaming explained at high level.', split: '0:00–0:45 video SD | 0:45–1:30 transcoding pipeline | 1:30–2:00 LC' },
  158: { topic: 'CDN, Video Storage, Blob vs Metadata', theory: ['detailed/theory/10-system-design-complete.md', 'Core Concepts: CDN, Object Storage, Video chunking'], practice: ['practice/week-21-24-exercises.md', 'Week 23 Thu: CDN cache hierarchy, edge locations, cache invalidation'], lc: '1 medium timed', project: 'SD notes: CDN strategy for static assets vs video segments', success: 'CDN edge caching vs origin explained; video chunked into HLS/DASH segments.', split: '0:00–0:45 CDN theory | 0:45–1:30 video storage notes | 1:30–2:00 LC' },
  159: { topic: 'SD Revision + 2 Timed Mediums', theory: ['detailed/theory/10-system-design-complete.md', 'Review Designs 3 + video'], practice: ['practice/week-21-24-exercises.md', 'Week 23 Fri: Redraw chat system blind'], lc: '2 mediums timed', project: 'None', success: 'Chat system redrawn in 30 min; 2 LC mediums under time.', split: '0:00–0:30 blind chat SD | 0:30–2:00 2 LC' },
  160: { topic: 'Chat System SD Deep Dive + 3 LC', theory: ['detailed/theory/10-system-design-complete.md', 'Design 3: Chat — group chat, message ordering, idempotency'], practice: ['practice/week-21-24-exercises.md', 'Week 23 Sat: Group chat extension + 3 LC mediums'], lc: '3 mediums timed', project: 'SD: Group chat design with message ordering and idempotent delivery', success: 'Group chat fan-out to members designed; message dedup with client-side IDs.', split: '0:00–0:45 group chat extension | 0:45–3:00 3 LC | 3:00–8:00 review gaps' },
  161: { topic: 'Video Streaming SD + 3 LC', theory: ['detailed/theory/10-system-design-complete.md', 'Design: Video streaming — view count, recommendations intro'], practice: ['practice/week-21-24-exercises.md', 'Week 23 Sun: Full video SD 45 min + 3 LC mediums'], lc: '3 mediums timed', project: 'SD: Complete YouTube lite design with view counter (approximate counting)', success: 'Video SD complete with approximate view count (HyperLogLog or batch); 3 LC done.', split: '0:00–0:45 video SD complete | 0:45–3:00 3 LC | 3:00–8:00 mock explain' },
  162: { topic: 'HLD: Uber / Ride Matching (Basic)', theory: ['detailed/theory/10-system-design-complete.md', 'Design: Uber — geospatial indexing, matching, ETA'], practice: ['practice/week-21-24-exercises.md', 'Week 24 Mon: Uber — driver location, ride request, matching algorithm'], lc: '1 medium timed', project: 'SD deliverable: Uber basic — geohash/quadtree for nearby drivers, matching flow', success: 'Geospatial index choice justified; ride state machine (requested → matched → completed) drawn.', split: '0:00–0:45 Uber SD | 0:45–1:30 geospatial matching | 1:30–2:00 LC' },
  163: { topic: 'HLD: E-commerce Order System', theory: ['detailed/theory/10-system-design-complete.md', 'Design 5: E-commerce Order System'], practice: ['practice/week-21-24-exercises.md', 'Week 24 Tue: Order flow — cart, inventory, payment, fulfillment'], lc: '1 medium timed', project: 'SD deliverable: E-commerce order system with inventory reservation and saga pattern', success: 'Order saga with compensating transactions explained; inventory lock during checkout.', split: '0:00–0:45 e-commerce SD | 0:45–1:30 saga pattern | 1:30–2:00 LC' },
  164: { topic: 'HLD: Payment Gateway Flow', theory: ['detailed/theory/10-system-design-complete.md', 'Design: Payment flow — idempotency, webhooks, reconciliation'], practice: ['practice/week-21-24-exercises.md', 'Week 24 Wed: Payment gateway — PCI scope, tokenization, webhook retry'], lc: '1 medium timed', project: 'SD deliverable: Payment flow diagram with idempotency keys and webhook handling', success: 'Payment idempotency and webhook at-least-once handling explained; PCI compliance scope noted.', split: '0:00–0:45 payment SD | 0:45–1:30 idempotency + webhooks | 1:30–2:00 LC' },
  165: { topic: 'STAR Behavioral Stories — Write 8', theory: ['detailed/theory/10-system-design-complete.md', 'Interview prep: Behavioral (STAR method)'], practice: ['practice/week-21-24-exercises.md', 'Week 24 Thu: Write 8 STAR stories (see behavioral table in practice file)'], lc: '1 medium timed', project: 'Deliverable: 8 STAR stories document — 1 page each with Situation/Task/Action/Result', success: '8 STAR stories written with quantified results; each deliverable in 2 min spoken format.', split: '0:00–1:30 write STAR stories | 1:30–2:00 1 LC medium' },
  166: { topic: 'Full Mock Interview — DSA + HLD + Behavioral', theory: ['detailed/theory/10-system-design-complete.md', 'Full interview simulation guide'], practice: ['practice/week-21-24-exercises.md', 'Week 24 Fri: 45 min DSA + 45 min HLD + 30 min behavioral (use Pramp or self-timer)'], lc: '1 unseen medium as mock DSA round', project: 'Mock interview log — record gaps, timing, communication feedback', success: 'Full 2-hour mock completed; gap list written with action items for Week 25.', split: '0:00–0:45 mock DSA | 0:45–1:30 mock HLD | 1:30–2:00 mock behavioral' },
  167: { topic: 'Apply to 5 Companies + Resume Polish', theory: ['detailed/theory/10-system-design-complete.md', 'Job search strategy for foreign product companies'], practice: ['practice/week-21-24-exercises.md', 'Week 24 Sat: Apply Adobe, Salesforce, Microsoft, Amazon, Uber — tailored cover letters'], lc: '2 mediums timed', project: 'Applications: 5 company applications submitted with customized resume bullets', success: '5 applications submitted; resume PDF updated with live project URLs and LC count.', split: '0:00–4:00 applications | 4:00–6:00 resume polish | 6:00–8:00 2 LC' },
  168: { topic: 'GitHub Audit + LinkedIn + 220 LC Milestone', theory: ['detailed/theory/10-system-design-complete.md', 'Portfolio audit checklist'], practice: ['practice/week-21-24-exercises.md', 'Week 24 Sun: GitHub pinned repos, README audit, LinkedIn headline + About'], lc: 'Review — target 220+ total LC solved', project: 'Portfolio: GitHub pinned repos, LinkedIn updated, portfolio site optional', success: '220+ LC milestone; LinkedIn live; GitHub shows 2 deployed projects with diagrams; 10 HLD systems designed.', split: '0:00–4:00 GitHub + LinkedIn | 4:00–6:00 LC audit | 6:00–8:00 Month 6 review' },
})) { setDay(+n, d); }

// WEEKS 25-26 — Days 169-182 (Active Interviewing)
for (const [n, d] of Object.entries({
  169: { topic: 'Active Interviewing — DSA + SD + Applications (Day 169)', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Review weakest pattern from REVIEW.md'], practice: ['practice/week-21-24-exercises.md', 'Daily interview loop: 2 LC timed + 1 SD redraw'], lc: `${lc('trapping-rain-water', 42, 'Trapping Rain Water')}, ${lc('valid-sudoku', 36, 'Valid Sudoku')}`, project: 'Apply to 2 companies: Google, Atlassian — submit applications + track in spreadsheet', success: '2 LC solved; 1 SD (URL Shortener) redrawn in 30 min; 2 applications submitted.', split: '0:00–0:30 SD redraw | 0:30–1:30 2 LC | 1:30–2:00 applications' },
  170: { topic: 'Active Interviewing — DSA + SD + Applications (Day 170)', theory: ['detailed/theory/10-system-design-complete.md', 'Design 4: Notification System review'], practice: ['practice/week-21-24-exercises.md', 'Daily interview loop'], lc: `${lc('rotate-image', 48, 'Rotate Image')}, ${lc('spiral-matrix', 54, 'Spiral Matrix')}`, project: 'Apply to 2 companies: Meta, Apple — customize resume for frontend/backend emphasis', success: '2 LC solved; Notification SD in 35 min; 2 applications submitted.', split: '0:00–0:35 notification SD | 0:35–1:35 2 LC | 1:35–2:00 applications' },
  171: { topic: 'Active Interviewing — DSA + SD + Applications (Day 171)', theory: ['detailed/theory/10-system-design-complete.md', 'Design 3: Chat System review'], practice: ['practice/week-21-24-exercises.md', 'Daily interview loop'], lc: `${lc('set-matrix-zeroes', 73, 'Set Matrix Zeroes')}, ${lc('game-of-life', 289, 'Game of Life')}`, project: 'Apply to 2 companies: Netflix, Spotify — highlight streaming/project experience', success: '2 LC solved; Chat SD in 35 min; 2 applications submitted.', split: '0:00–0:35 chat SD | 0:35–1:35 2 LC | 1:35–2:00 applications' },
  172: { topic: 'Active Interviewing — DSA + SD + Applications (Day 172)', theory: ['detailed/theory/10-system-design-complete.md', 'Design 5: E-commerce Order System review'], practice: ['practice/week-21-24-exercises.md', 'Daily interview loop'], lc: `${lc('word-search', 79, 'Word Search')}, ${lc('number-of-islands', 200, 'Number of Islands')}`, project: 'Apply to 2 companies: Stripe, Razorpay — emphasize ShopLite payment integration', success: '2 LC solved; E-commerce SD in 35 min; 2 applications submitted.', split: '0:00–0:35 e-commerce SD | 0:35–1:35 2 LC | 1:35–2:00 applications' },
  173: { topic: 'Active Interviewing — DSA + SD + Applications (Day 173)', theory: ['detailed/theory/10-system-design-complete.md', 'Design 2: Twitter Feed review'], practice: ['practice/week-21-24-exercises.md', 'Daily interview loop — Week 25 checkpoint'], lc: `${lc('accounts-merge', 721, 'Accounts Merge')}, ${lc('redundant-connection', 684, 'Redundant Connection')}`, project: 'Apply to 2 companies: Goldman Sachs, DE Shaw — track all 10 applications in spreadsheet', success: '10 total applications submitted this week; 2 LC; Feed SD in 35 min; application tracker complete.', split: '0:00–0:35 feed SD | 0:35–1:35 2 LC | 1:35–2:00 final 2 applications' },
  174: { topic: 'Mock Interviews — Pramp / Peer (Day 174)', theory: ['detailed/theory/10-system-design-complete.md', 'Mock interview debrief template'], practice: ['practice/week-21-24-exercises.md', 'Schedule 2 mock interviews on Pramp or with peer — 1 DSA + 1 SD each'], lc: 'Use mock platform problems — do not pick familiar LC', project: 'Mock log: record interviewer feedback, timing, communication score 1–5', success: '2 mock interviews completed; debrief notes written with 3 improvement actions each.', split: 'Weekend: 0:00–4:00 mock 1 (DSA+SD) | 4:00–8:00 mock 2 + debrief' },
  175: { topic: 'Mock Interviews — Pramp / Peer (Day 175)', theory: ['detailed/theory/10-system-design-complete.md', 'Behavioral mock — STAR story delivery'], practice: ['practice/week-21-24-exercises.md', '2 more mocks: focus on behavioral + system design communication'], lc: 'Warm-up: 1 easy + 1 medium before mocks', project: 'Behavioral mock: deliver 4 STAR stories in 30 min session; record yourself', success: '2 mocks done; behavioral stories delivered smoothly under 2 min each; gap list updated.', split: 'Weekend: 0:00–1:00 LC warm-up | 1:00–5:00 2 mocks | 5:00–8:00 STAR recording + review' },
  176: { topic: 'Weak Pattern Revision — Two Pointers + Sliding Window', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Patterns 1–2 deep review from REVIEW.md failures'], practice: ['practice/week-17-20-exercises.md', 'Redo 4 failed problems from Patterns 1–2'], lc: `${lc('3sum-closest', 16, '3Sum Closest')}, ${lc('minimum-size-subarray-sum', 209, 'Minimum Size Subarray Sum')}, ${lc('fruit-into-baskets', 904, 'Fruit Into Baskets')}, ${lc('max-consecutive-ones-iii', 1004, 'Max Consecutive Ones III')}`, project: 'Update REVIEW.md — mark revised patterns as confident or still weak', success: '≥3/4 revision problems solved faster than first attempt; pattern templates rewritten.', split: 'Weekend: 0:00–4:00 4 revision LC | 4:00–6:00 template rewrite | 6:00–8:00 REVIEW.md update' },
  177: { topic: 'Weak Pattern Revision — Trees + Graphs + DP', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'Patterns 6–8 deep review from REVIEW.md failures'], practice: ['practice/week-17-20-exercises.md', 'Redo 4 failed problems from Patterns 6–8'], lc: `${lc('serialize-and-deserialize-binary-tree', 297, 'Serialize and Deserialize Binary Tree')}, ${lc('word-ladder-ii', 126, 'Word Ladder II')}, ${lc('unique-paths', 62, 'Unique Paths')}, ${lc('target-sum', 494, 'Target Sum')}`, project: 'Update DP cheat sheet with 5 new patterns from revision session', success: '≥2/4 hard revisions solved or thoroughly studied; graph/DP templates updated.', split: 'Weekend: 0:00–4:00 4 revision LC | 4:00–6:00 DP cheat sheet | 6:00–8:00 mock explain weakest' },
  178: { topic: 'Weak Pattern Revision — System Design Gaps', theory: ['detailed/theory/10-system-design-complete.md', 'Review all 10 HLD designs — identify 3 weakest'], practice: ['practice/week-21-24-exercises.md', 'Redraw 3 weakest SDs blind — 30 min each'], lc: `${lc('design-add-and-search-ds', 380, 'Design Add and Search DS')}, ${lc('implement-trie-prefix-tree', 208, 'Implement Trie (Prefix Tree)')}`, project: 'SD gap doc: for each weak design, write 5 likely follow-up questions + answers', success: '3 weakest SDs redrawn without major gaps; follow-up Q&A doc complete.', split: 'Weekend: 0:00–1:30 SD 1 | 1:30–3:00 SD 2 | 3:00–4:30 SD 3 | 4:30–6:00 2 LC | 6:00–8:00 follow-up Q&A' },
  179: { topic: 'Offer Negotiation Research — Compensation Basics', theory: ['detailed/theory/10-system-design-complete.md', 'Appendix: Salary negotiation for India → foreign product companies'], practice: ['practice/week-21-24-exercises.md', 'Research: levels.fyi, Glassdoor, Blind — compile target company ranges'], lc: '1 medium timed (maintain sharpness)', project: 'Negotiation prep doc: target range (30 LPA+), competing offers strategy, benefits checklist', success: 'Salary range document for top 5 target companies; negotiation scripts written for HR call.', split: '0:00–1:00 research levels.fyi | 1:00–1:30 negotiation scripts | 1:30–2:00 1 LC' },
  180: { topic: 'Offer Negotiation — Mock HR Call + Email Templates', theory: ['detailed/theory/10-system-design-complete.md', 'Negotiation: counter-offer email templates, equity basics'], practice: ['practice/week-21-24-exercises.md', 'Write counter-offer email template; practice mock HR negotiation aloud'], lc: '1 medium timed', project: 'Deliverables: counter-offer email template, benefits comparison spreadsheet, mock HR recording', success: 'Counter-offer email drafted; mock HR negotiation practiced 2x aloud; equity/ESOP basics understood.', split: '0:00–0:45 email templates | 0:45–1:15 mock HR practice | 1:15–2:00 1 LC' },
  181: { topic: 'Continue Interviews — OA + Phone Screen Prep', theory: ['detailed/theory/08-dsa-patterns-complete.md', 'OA patterns: timed tests, machine coding prep'], practice: ['practice/week-21-24-exercises.md', 'Respond to any recruiter emails; complete pending OAs within 48h'], lc: `${lc('random-pick-with-weight', 528, 'Random Pick with Weight')}, ${lc('find-median-from-data-stream', 295, 'Find Median from Data Stream')}`, project: 'Interview tracker: log every OA, phone screen, onsite with dates and outcomes', success: 'All pending OAs completed; interview tracker up to date; 2 LC maintained.', split: '0:00–0:30 check applications | 0:30–1:30 2 LC | 1:30–2:00 OA/recruiter responses' },
  182: { topic: 'Program Graduation — Final Audit + Continue Until Offer', theory: ['detailed/theory/10-system-design-complete.md', 'Final portfolio audit — all milestones checklist'], practice: ['practice/week-21-24-exercises.md', 'Complete final audit against all milestones; plan post-182 daily routine'], lc: '1 medium + 1 hard (celebrate 182 days — push toward 230+ total)', project: 'Final deliverable: 182-day completion certificate (self-signed), post-program 2hr/day maintenance plan', success: 'All milestones checked; 230+ LC; 2 deployed projects live; actively interviewing with offer pipeline; post-182 plan written.', split: 'Weekend: 0:00–2:00 final LC | 2:00–4:00 milestone audit | 4:00–6:00 post-182 plan | 6:00–8:00 celebrate + rest' },
})) { setDay(+n, d); }


function renderDay(n) {
  const d = dayData[n];
  if (!d) {
    return `### Day ${n} — ${weekday(n)} | ${hours(n)} hours\n\n> **MISSING DATA** — fill in manually.\n\n---\n`;
  }
  const wk = weekNum(n);
  const h = hours(n);
  const lines = [];
  lines.push(`### Day ${n} — ${weekdayShort(n)} (${weekday(n)}) | ${h} hour${h > 1 ? 's' : ''}`);
  lines.push('');
  lines.push(`| Field | Detail |`);
  lines.push(`|-------|--------|`);
  lines.push(`| **Calendar Week** | Week ${wk} of 26 |`);
  lines.push(`| **Month Phase** | ${n <= 28 ? 'Month 1 — JS/TS/Git' : n <= 56 ? 'Month 2 — React/Next.js' : n <= 84 ? 'Month 3 — Backend/DB' : n <= 112 ? 'Month 4 — Projects/DevOps' : n <= 140 ? 'Month 5 — DSA/LLD' : n <= 168 ? 'Month 6 — System Design' : 'Weeks 25–26 — Active Interviewing'} |`);
  lines.push(`| **Exact Topic** | ${d.topic} |`);
  lines.push(`| **Theory File** | [\`${d.theory[0]}\`](../${d.theory[0]}) |`);
  lines.push(`| **Theory Section** | ${d.theory[1]} |`);
  lines.push(`| **Practice File** | [\`${d.practice[0]}\`](../${d.practice[0]}) |`);
  lines.push(`| **Specific Exercises** | ${d.practice[1]} |`);
  lines.push(`| **LeetCode** | ${d.lc} |`);
  if (d.lcNote) lines.push(`| **LeetCode Note** | ${d.lcNote} |`);
  lines.push(`| **Weekend / Project Tasks** | ${d.project} |`);
  lines.push(`| **Time Split Today** | ${d.split} |`);
  lines.push('');
  lines.push(`#### What Success Looks Like Today`);
  lines.push('');
  lines.push(`${d.success}`);
  lines.push('');
  lines.push(`- [ ] Theory section read and highlighted`);
  lines.push(`- [ ] Practice exercises complete (or timed LC done)`);
  lines.push(`- [ ] Code committed to GitHub with meaningful message`);
  lines.push(`- [ ] 2-minute aloud explanation of today's main concept recorded or spoken`);
  lines.push('');
  lines.push('---');
  lines.push('');
  return lines.join('\n');
}

const HEADER = `# MERN Mastery — Complete 182-Day Roadmap

> **PDF Source Document** | Version 1.0 | Generated for print/PDF export via \`scripts/generate-pdfs.mjs\`

---

## Cover Page

| | |
|---|---|
| **Program Title** | MERN Mastery — 6-Month Day-by-Day Bootcamp |
| **Subtitle** | From JavaScript Fundamentals to System Design Interviews |
| **Duration** | 182 Days (26 Weeks) |
| **Daily Commitment** | 2 hours Mon–Fri · 8 hours Sat–Sun |
| **Weekly Hours** | ~26 hours/week |
| **Total Program Hours** | ~470 hours |
| **Primary Goal** | **7.5 LPA → 30+ LPA** at foreign product companies |
| **Target Employers** | Adobe, Salesforce, Microsoft, Google, Amazon, Atlassian, Uber, Meta, Apple, Netflix, Stripe, Goldman Sachs |
| **Stack Covered** | JavaScript → TypeScript → React → Next.js → Node.js → Express → MongoDB → PostgreSQL → Redis → Docker → Testing → DSA → LLD → HLD |
| **LeetCode Target** | 220+ by Day 168 · 230+ by Day 182 |
| **Portfolio Target** | 2 deployed MERN projects (TaskFlow + ShopLite) + Blog + 6 LLD implementations |
| **Start Date** | _________________ (Day 1 = Monday recommended) |
| **Expected End Date** | _________________ (Day 182) |

---

## How to Use This Roadmap

### Daily Workflow (Non-Negotiable)

1. **Open this file** → find today's day number (or calculate from your start date).
2. **Read the theory section** linked in the Theory File row (30–60 min weekdays, 1–2 hr weekends).
3. **Complete specific exercises** listed in the Practice File row — type every line, never copy-paste blind.
4. **Solve the LeetCode problem** if scheduled — timed 35–45 min, JavaScript/TypeScript only.
5. **Work on weekend project tasks** if applicable (Sat–Sun blocks).
6. **Check all four boxes** at the bottom of each day before marking complete.
7. **Git commit daily** — even small exercises. Employers audit GitHub activity.
8. **Explain aloud** — 2-minute verbal summary pretends you're in an interview.

### Weekly Rhythm

| Day Type | Focus | Hours |
|----------|-------|-------|
| **Mon–Thu** | New theory + exercises + occasional LC | 2h/day |
| **Friday** | Review + LeetCode heavy | 2h/day |
| **Saturday** | LC batch + project build | 8h |
| **Sunday** | Project finish + review + LLD/SD (Month 5–6) | 8h |

### File Map

| Folder | Purpose |
|--------|---------|
| [\`detailed/theory/\`](./theory/) | **Complete theory guides** (use these, not condensed notes) |
| [\`practice/\`](../practice/) | Weekly exercise files with checklists |
| [\`notes/\`](../notes/) | Condensed reference notes (secondary) |
| [\`ROADMAP.md\`](../ROADMAP.md) | Quick-reference summary roadmap |
| **This file** | Most detailed day-by-day plan for PDF export |

### Rules

1. **Never skip LeetCode** — even 1 problem on busy days.
2. **Weekends = build** — theory on weekdays, projects on weekends.
3. **No tutorial hell** — read theory, then code immediately.
4. **One GitHub repo** (\`mern-mastery\`) with weekly folders.
5. **Track failures** in \`REVIEW.md\` — revisit on revision days.
6. **Mark completion** with \`[x]\` in milestone tracker below.

---

## Time Budget Tables

### Weekly Time Budget (26 weeks)

| Week | Days | Theme | Weekday hrs | Weekend hrs | Total |
|------|------|-------|-------------|-------------|-------|
| 1 | 1–7 | JavaScript Basics | 10 | 16 | 26 |
| 2 | 8–14 | Prototypes, Classes, Objects | 10 | 16 | 26 |
| 3 | 15–21 | Async JavaScript | 10 | 16 | 26 |
| 4 | 22–28 | TypeScript + Git | 10 | 16 | 26 |
| 5 | 29–35 | React Fundamentals | 10 | 16 | 26 |
| 6 | 36–42 | React Hooks | 10 | 16 | 26 |
| 7 | 43–49 | React Advanced + Router | 10 | 16 | 26 |
| 8 | 50–56 | Next.js + Deploy | 10 | 16 | 26 |
| 9 | 57–63 | Node.js + Express | 10 | 16 | 26 |
| 10 | 64–70 | Authentication (JWT) | 10 | 16 | 26 |
| 11 | 71–77 | MongoDB | 10 | 16 | 26 |
| 12 | 78–84 | PostgreSQL + Redis | 10 | 16 | 26 |
| 13 | 85–91 | TaskFlow Project (Backend) | 10 | 16 | 26 |
| 14 | 92–98 | TaskFlow Project (Frontend + Docker) | 10 | 16 | 26 |
| 15 | 99–105 | ShopLite E-commerce | 10 | 16 | 26 |
| 16 | 106–112 | Testing + CI + Deploy | 10 | 16 | 26 |
| 17 | 113–119 | DSA: Two Ptr, Window, Hash + LRU LLD | 10 | 16 | 26 |
| 18 | 120–126 | DSA: BS, Stack, LL + Rate Limiter LLD | 10 | 16 | 26 |
| 19 | 127–133 | DSA: Trees, Graphs + Splitwise LLD | 10 | 16 | 26 |
| 20 | 134–140 | DSA: DP + BookMyShow LLD | 10 | 16 | 26 |
| 21 | 141–147 | HLD Foundations + URL Shortener | 10 | 16 | 26 |
| 22 | 148–154 | Social + Notification Systems | 10 | 16 | 26 |
| 23 | 155–161 | Chat + Video Streaming | 10 | 16 | 26 |
| 24 | 162–168 | E-commerce SD + Mock Interviews | 10 | 16 | 26 |
| 25 | 169–175 | Active Interviewing + Mocks | 10 | 16 | 26 |
| 26 | 176–182 | Revision + Negotiation + Offer | 10 | 16 | 26 |
| **TOTAL** | **182** | **Full Program** | **260** | **208** | **468** |

### Monthly Time Budget

| Month | Days | Focus Area | Approx Hours | LC Target EOM | Projects |
|-------|------|------------|--------------|---------------|----------|
| 1 | 1–28 | JavaScript, TypeScript, Git | 104 | 20 | CLI Todo, TS Catalog API |
| 2 | 29–56 | React, Next.js | 104 | 60 | Form Wizard, User Dir, E-commerce UI, Blog |
| 3 | 57–84 | Backend, Auth, Databases | 104 | 100 | Auth Microservice, Blog API (Mongo + PG) |
| 4 | 85–112 | MERN Projects, DevOps | 104 | 150 | TaskFlow, ShopLite (deployed) |
| 5 | 113–140 | DSA Intensive, LLD | 104 | 200 | 6 LLD problems |
| 6 | 141–168 | System Design, Interviews | 104 | 220 | 10 HLD designs, STAR stories |
| Ext | 169–182 | Active Interviewing | 52 | 230+ | Offer pipeline |

### Daily Time Split Templates

#### Weekday Template (2 hours)

\`\`\`
0:00 – 0:25   Review yesterday's notes + flashcards
0:25 – 1:15   Read today's theory section (detailed/theory/)
1:15 – 1:45   Complete specific practice exercises
1:45 – 2:00   Git commit + 2-min aloud explanation
\`\`\`

**Friday variant (LC-heavy):**
\`\`\`
0:00 – 0:30   Review week's theory
0:30 – 1:45   Timed LeetCode (1–2 problems)
1:45 – 2:00   Commit + log result in REVIEW.md
\`\`\`

#### Weekend Template (8 hours)

\`\`\`
0:00 – 2:00   LeetCode batch (2–3 problems, 35 min each + review)
2:00 – 6:00   Project / LLD / System Design build
6:00 – 7:00   Write summary notes in own words
7:00 – 8:00   Plan next week + Git commit + update tracker
\`\`\`

**Month 5–6 weekend variant (DSA + LLD/SD):**
\`\`\`
0:00 – 3:00   Timed LC batch (3 mediums)
3:00 – 6:00   LLD implementation OR HLD blind design
6:00 – 7:00   Record yourself explaining design/solution
7:00 – 8:00   Update REVIEW.md + milestone tracker
\`\`\`

---

## Milestone Tracker

| # | Milestone | Target Day | Target Date | Done? |
|---|-----------|------------|-------------|-------|
| 1 | GitHub repo live with Week 1 code | 7 | | [ ] |
| 2 | JavaScript fundamentals solid (Month 1 review ≥80%) | 28 | | [ ] |
| 3 | TypeScript Catalog API complete | 28 | | [ ] |
| 4 | React + Next.js blog deployed (live URL) | 56 | | [ ] |
| 5 | 60+ LeetCode solved | 56 | | [ ] |
| 6 | Auth microservice complete (JWT + refresh) | 70 | | [ ] |
| 7 | MongoDB + PostgreSQL both implemented | 84 | | [ ] |
| 8 | 100+ LeetCode solved | 84 | | [ ] |
| 9 | TaskFlow deployed (Docker + live URL) | 98 | | [ ] |
| 10 | ShopLite deployed with payment test | 112 | | [ ] |
| 11 | 150+ LeetCode solved | 112 | | [ ] |
| 12 | CI/CD pipeline green on both projects | 112 | | [ ] |
| 13 | 6 LLD problems coded from scratch | 140 | | [ ] |
| 14 | 200+ LeetCode solved | 140 | | [ ] |
| 15 | 10 HLD systems designed on paper | 168 | | [ ] |
| 16 | 8 STAR behavioral stories memorized | 168 | | [ ] |
| 17 | 220+ LeetCode + applications submitted | 168 | | [ ] |
| 18 | 10+ company applications tracked | 173 | | [ ] |
| 19 | 4+ mock interviews completed | 175 | | [ ] |
| 20 | Offer received or final-round pipeline | 182 | | [ ] |

---

## Company Application Schedule (Foreign Product Companies)

### Phase 1 — Portfolio Ready (Days 160–168)

| Day | Action | Companies |
|-----|--------|-----------|
| 167 | Submit first batch (5) | Adobe, Salesforce, Microsoft, Amazon, Uber |
| 168 | GitHub + LinkedIn audit before more apps | — |

### Phase 2 — Active Blitz (Days 169–173)

| Day | Apply (2/day) | Notes |
|-----|---------------|-------|
| 169 | Google, Atlassian | Emphasize DSA count + open source |
| 170 | Meta, Apple | Tailor resume: React/Next for Meta, TS for Apple |
| 171 | Netflix, Spotify | Highlight streaming SD + ShopLite |
| 172 | Stripe, Razorpay | Highlight payment integration in ShopLite |
| 173 | Goldman Sachs, DE Shaw | FinTech angle + DSA strength |

### Phase 3 — Sustained Pipeline (Days 174–182)

| Action | Frequency |
|--------|-----------|
| Respond to recruiter InMails | Within 24 hours |
| Complete Online Assessments | Within 48 hours of invite |
| Mock interviews (Pramp/peers) | 2–4 during Days 174–175 |
| Follow up on applications | Weekly email if no response in 2 weeks |
| Referrals | Ask 1 connection per target company |

### Application Tracker Template

| Company | Tier | Applied | OA | Phone | Onsite | Offer | Notes |
|---------|------|---------|-----|-------|--------|-------|-------|
| Adobe | A | | | | | | |
| Salesforce | A | | | | | | |
| Microsoft | A | | | | | | |
| Google | S | | | | | | |
| Amazon | A | | | | | | |
| Atlassian | A | | | | | | |
| Uber | A | | | | | | |
| Meta | S | | | | | | |
| Apple | S | | | | | | |
| Netflix | S | | | | | | |
| Spotify | A | | | | | | |
| Stripe | S | | | | | | |
| Goldman Sachs | A | | | | | | |
| DE Shaw | S | | | | | | |

*Tiers: S = highly selective, A = achievable with this roadmap*

---

## Resource Links — Master List

### Official Documentation

| Resource | URL | Used In |
|----------|-----|---------|
| MDN JavaScript | https://developer.mozilla.org/en-US/docs/Web/JavaScript | Month 1 |
| TypeScript Handbook | https://www.typescriptlang.org/docs/handbook/ | Month 1 |
| React Docs | https://react.dev/learn | Month 2 |
| Next.js Docs | https://nextjs.org/docs | Month 2 |
| Node.js Docs | https://nodejs.org/docs/latest/api/ | Month 3 |
| Express Guide | https://expressjs.com/en/guide/routing.html | Month 3 |
| MongoDB Manual | https://www.mongodb.com/docs/manual/ | Month 3 |
| PostgreSQL Tutorial | https://www.postgresqltutorial.com/ | Month 3 |
| Prisma Docs | https://www.prisma.io/docs | Month 3 |
| Redis Docs | https://redis.io/docs/ | Month 3 |
| Docker Docs | https://docs.docker.com/get-started/ | Month 4 |
| Jest Docs | https://jestjs.io/docs/getting-started | Month 4 |

### Practice Platforms

| Resource | URL | Purpose |
|----------|-----|---------|
| LeetCode | https://leetcode.com/problemset/ | DSA daily |
| NeetCode Roadmap | https://neetcode.io/roadmap | Pattern reference |
| Pramp | https://www.pramp.com/ | Free mock interviews |
| Interviewing.io | https://interviewing.io/ | Anonymous mocks |
| Frontend Mentor | https://www.frontendmentor.io/ | UI practice (optional) |

### Deployment & Cloud

| Resource | URL | Purpose |
|----------|-----|---------|
| Vercel | https://vercel.com/ | Frontend deploy |
| Render | https://render.com/ | Backend deploy |
| MongoDB Atlas | https://www.mongodb.com/atlas | Free MongoDB cluster |
| Neon | https://neon.tech/ | Free PostgreSQL |
| Upstash | https://upstash.com/ | Free Redis |
| AWS Free Tier | https://aws.amazon.com/free/ | S3, optional |

### Salary & Interview Research

| Resource | URL | Purpose |
|----------|-----|---------|
| levels.fyi | https://www.levels.fyi/ | Compensation data |
| Glassdoor | https://www.glassdoor.co.in/ | Company reviews |
| Blind | https://www.teamblind.com/ | Interview experiences |

### Theory Files (This Repo)

| Module | Complete Guide |
|--------|----------------|
| Git | [00-git-complete.md](./theory/00-git-complete.md) |
| JavaScript | [01-javascript-complete.md](./theory/01-javascript-complete.md) |
| TypeScript | [02-typescript-complete.md](./theory/02-typescript-complete.md) |
| React | [03-react-complete.md](./theory/03-react-complete.md) |
| Next.js | [04-nextjs-complete.md](./theory/04-nextjs-complete.md) |
| Node.js & Express | [05-nodejs-express-complete.md](./theory/05-nodejs-express-complete.md) |
| Databases | [06-databases-complete.md](./theory/06-databases-complete.md) |
| Auth & DevOps | [07-auth-devops-complete.md](./theory/07-auth-devops-complete.md) |
| DSA Patterns | [08-dsa-patterns-complete.md](./theory/08-dsa-patterns-complete.md) |
| Low-Level Design | [09-lld-complete.md](./theory/09-lld-complete.md) |
| System Design | [10-system-design-complete.md](./theory/10-system-design-complete.md) |

---

`;

const monthSummaries = `
## Month Summaries

### Month 1 — JavaScript, TypeScript, Git (Days 1–28)

**Goal:** Solid JavaScript fundamentals + TypeScript fluency + Git workflow.

| Week | Days | Key Deliverables |
|------|------|------------------|
| 1 | 1–7 | Variables → closures → this; 5 LC; GitHub repo |
| 2 | 8–14 | Prototypes, classes, map/filter/reduce polyfills; JS cheat sheet |
| 3 | 15–21 | Event loop, promises, async/await; CLI Todo App |
| 4 | 22–28 | TypeScript types/generics; Git branching; TS Catalog API |

**End-of-month exam:** Rewrite Week 1–3 exercises blind; build typed API in 4 hours.

---

### Month 2 — React + Next.js (Days 29–56)

**Goal:** Production React patterns + Next.js App Router + deployed blog.

| Week | Days | Key Deliverables |
|------|------|------------------|
| 5 | 29–35 | React fundamentals; form wizard project |
| 6 | 36–42 | Hooks, custom hooks, context; user directory |
| 7 | 43–49 | Router, Zustand, performance; e-commerce UI |
| 8 | 50–56 | Next.js SSR/ISR; blog with MDX; Vercel deploy |

**End-of-month exam:** Build CRUD page with React Hook Form + API in 3 hours.

---

### Month 3 — Backend + Databases (Days 57–84)

**Goal:** Production Express APIs + JWT auth + MongoDB + PostgreSQL + Redis.

| Week | Days | Key Deliverables |
|------|------|------------------|
| 9 | 57–63 | Express layered architecture; auth skeleton |
| 10 | 64–70 | JWT + refresh rotation; auth microservice |
| 11 | 71–77 | MongoDB blog API with aggregation |
| 12 | 78–84 | PostgreSQL rebuild; Redis cache; 100 LC |

**End-of-month exam:** Explain auth flow + draw Mongo vs SQL tradeoffs in 30 min.

---

### Month 4 — Projects + DevOps (Days 85–112)

**Goal:** Two deployed flagship projects with CI/CD.

| Week | Days | Key Deliverables |
|------|------|------------------|
| 13 | 85–91 | TaskFlow backend: auth, teams, tasks, Socket.io |
| 14 | 92–98 | TaskFlow frontend + Docker Compose |
| 15 | 99–105 | ShopLite e-commerce + Stripe/Razorpay |
| 16 | 106–112 | Jest + Supertest + RTL + GitHub Actions; deploy both |

**End-of-month exam:** Demo both live URLs; walk through architecture in 15 min.

---

### Month 5 — DSA + LLD (Days 113–140)

**Goal:** 200+ LC; 6 LLD problems; medium in 35 min average.

| Week | Days | Key Deliverables |
|------|------|------------------|
| 17 | 113–119 | Two pointers, sliding window, hash map; LRU Cache LLD |
| 18 | 120–126 | Binary search, stack, linked list; Rate Limiter + Parking Lot LLD |
| 19 | 127–133 | Trees, graphs, topo sort; Splitwise + Vending Machine LLD |
| 20 | 134–140 | Dynamic programming intensive; BookMyShow LLD; 200 LC |

**End-of-month exam:** 2 timed mediums + 1 LLD in 90 min total.

---

### Month 6 — System Design + Interviews (Days 141–168)

**Goal:** 10 HLD designs; 8 STAR stories; 220 LC; applications live.

| Week | Days | Key Deliverables |
|------|------|------------------|
| 21 | 141–147 | SD framework; URL Shortener; Paste Bin; feed intro |
| 22 | 148–154 | Twitter, Instagram, Notification; Kafka basics |
| 23 | 155–161 | WhatsApp chat; YouTube streaming; CDN |
| 24 | 162–168 | Uber, E-commerce, Payment; mocks; apply to 5 companies |

**End-of-month exam:** 45-min blind HLD + full mock interview.

---

### Weeks 25–26 — Active Interviewing (Days 169–182)

**Goal:** Convert pipeline to offers; negotiate 30+ LPA.

| Days | Focus |
|------|-------|
| 169–173 | 2 LC/day + 1 SD/day + 2 applications/day |
| 174–175 | Mock interviews (Pramp/peers) |
| 176–178 | Weak pattern + SD revision |
| 179–180 | Offer negotiation research + mock HR |
| 181–182 | Continue interviews; final audit; post-program plan |

---

# Complete Day-by-Day Plan (Days 1–182)

`;

let body = '';
for (let m = 1; m <= 6; m++) {
  const ranges = [[1,28,'MONTH 1 — JavaScript, TypeScript, Git (Days 1–28)'],[29,56,'MONTH 2 — React + Next.js (Days 29–56)'],[57,84,'MONTH 3 — Backend + Databases (Days 57–84)'],[85,112,'MONTH 4 — Projects + DevOps (Days 85–112)'],[113,140,'MONTH 5 — DSA + LLD (Days 113–140)'],[141,168,'MONTH 6 — System Design + Interviews (Days 141–168)']];
  const [start, end, title] = ranges[m-1];
  body += `\n# ${title}\n\n`;
  for (let n = start; n <= end; n++) {
    body += renderDay(n);
  }
}
body += `\n# WEEKS 25–26 — Active Interviewing (Days 169–182)\n\n`;
for (let n = 169; n <= 182; n++) {
  body += renderDay(n);
}

const footer = `
---

## Appendix A — LeetCode Master Index by Day

| Day | Problem(s) |
|-----|------------|
`;

let lcIndex = footer;
for (let n = 1; n <= 182; n++) {
  const d = dayData[n];
  if (d && d.lc && d.lc !== 'None') {
    lcIndex += `| ${n} | ${d.lc.replace(/\|/g, '\\|')} |\n`;
  }
}

const appendixB = `
---

## Appendix B — Project Deliverables Timeline

| Day | Project Milestone |
|-----|-------------------|
| 6 | GitHub repo \`mern-mastery\` created |
| 20–21 | CLI Todo App complete |
| 27–28 | TS Catalog API complete |
| 35 | Multi-step form wizard |
| 41–42 | User directory app |
| 48–49 | E-commerce listing UI |
| 55–56 | Next.js blog deployed to Vercel |
| 69–70 | Auth microservice complete |
| 76–77 | Blog API (MongoDB) |
| 83–84 | Blog API (PostgreSQL) + Redis |
| 90–98 | TaskFlow complete + Docker |
| 99–111 | ShopLite complete + deployed |
| 119 | LRU Cache LLD |
| 126 | Rate Limiter + Parking Lot LLD |
| 133 | Splitwise + Vending Machine LLD |
| 140 | BookMyShow LLD |
| 141–168 | 10 HLD system designs |
| 167–173 | 10+ job applications |
| 182 | Program graduation audit |

---

## Appendix C — Daily Checklist Template (Printable)

\`\`\`
Date: __________  Day #: _____  Hours planned: _____

[ ] Theory section read (file: _______________)
[ ] Exercises complete (file: _______________)
[ ] LeetCode solved: #_____  Time: _____ min
[ ] Project task advanced: _______________
[ ] Git commit hash: _______________
[ ] 2-min aloud explanation done
[ ] Tomorrow preview read (Day ___)

Notes / blockers:
_________________________________
_________________________________
\`\`\`

---

*End of 182-Day Complete Roadmap · MERN Mastery Bootcamp · Target: 7.5 → 30+ LPA*
`;

const full = HEADER + monthSummaries + body + lcIndex + appendixB + footer.replace('---\n\n## Appendix A','');

// Verify all 182 days
const missing = [];
for (let n = 1; n <= 182; n++) if (!dayData[n]) missing.push(n);

writeFileSync(OUT, full, 'utf8');
const lineCount = full.split('\n').length;
console.log(`Written ${OUT}`);
console.log(`Lines: ${lineCount}`);
console.log(`Days defined: ${Object.keys(dayData).length}/182`);
if (missing.length) console.log('MISSING days:', missing.join(', '));
else console.log('All 182 days complete.');
