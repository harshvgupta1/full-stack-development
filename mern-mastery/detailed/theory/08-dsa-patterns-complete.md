# DSA Patterns — Complete Guide

<!-- SCHEDULE-BANNER-START -->
> **📅 Study window:** 7 Dec 2026 – 20 Dec 2026 (Days 113–126)
> **⏰ Your slots (IST):** Mon–Fri **7:30–8:30pm** & **9:00–10:00pm** · Sat–Sun **9:00am–12:00pm**, **3:00–5:30pm**, **6:00–8:30pm**
> **📧 Calendar reminders:** harsh.gupta@getreelax.com — import `calendar/mern-mastery-study.ics`
<!-- SCHEDULE-BANNER-END -->

> Pattern-first preparation with templates, problems, complexity analysis, and interview scripts.

---

## ⚠️ PREREQUISITES — Complete FIRST

| PDF | Sections needed |
|-----|-----------------|
| `08b-dsa-datastructures-fundamentals-complete.pdf` | All §1–10 (stack, queue, LL, tree, heap, graph) |
| 100+ LeetCode easy/medium | Pattern recognition at speed |

**When:** Month 5, Days 113+ (after Month 1–4 LC foundation).  
**Next after this:** `14-advanced-dsa-hard-complete.pdf` (Days 127+).

---

## Table of Contents

1. [How to Practice](#1-how-to-practice)
2. [Complexity Guide](#2-complexity-guide)
3. [Pattern 1: Two Pointers](#3-pattern-1-two-pointers)
4. [Pattern 2: Sliding Window](#4-pattern-2-sliding-window)
5. [Pattern 3: Hash Map / Set](#5-pattern-3-hash-map--set)
6. [Pattern 4: Binary Search](#6-pattern-4-binary-search)
7. [Pattern 5: BFS & DFS](#7-pattern-5-bfs--dfs)
8. [Pattern 6: Trees](#8-pattern-6-trees)
9. [Pattern 7: Graphs](#9-pattern-7-graphs)
10. [Pattern 8: Dynamic Programming](#10-pattern-8-dynamic-programming)
11. [Pattern 9: Heap / Priority Queue](#11-pattern-9-heap--priority-queue)
12. [Pattern 10: Stack / Monotonic Stack](#12-pattern-10-stack--monotonic-stack)
13. [NeetCode 150 Mapping](#13-neetcode-150-mapping)
14. [LeetCode Practice Plan](#14-leetcode-practice-plan)
15. [Interview Script](#15-interview-script)
16. [Product-company DSA (1 CR)](#16-product-company-dsa-1-cr)
17. [Pattern 11: Intervals](#17-pattern-11-intervals)
18. [Pattern 12: Backtracking](#18-pattern-12-backtracking)

---

## 1. How to Practice

### Rules

1. **Pattern-first** — master template, then 3–5 problems per pattern
2. **Timed practice** — Easy: 25 min | Medium: 35 min | Hard: 45 min
3. **Explain aloud** — approach, complexity, edge cases, trade-offs
4. **No hints first 15 min** — struggle builds pattern recognition
5. **Track progress** — goal: 150–200 problems by interview

### Platforms

| Platform | URL | Best For |
|----------|-----|----------|
| LeetCode | [leetcode.com](https://leetcode.com) | Primary practice |
| NeetCode | [neetcode.io](https://neetcode.io) | Curated roadmap |
| AlgoExpert | [algoexpert.io](https://www.algoexpert.io) | Video explanations |

---

## 2. Complexity Guide

### Big-O Cheat Sheet

| n | O(n) | O(n log n) | O(n²) |
|---|------|------------|-------|
| 100 | instant | instant | instant |
| 1,000 | instant | instant | ~1ms |
| 10,000 | instant | instant | ~100ms |
| 100,000 | ~1ms | ~2ms | TLE |
| 1,000,000 | ~10ms | ~20ms | TLE |

### Common Complexities by Pattern

| Pattern | Time | Space |
|---------|------|-------|
| Two Pointers | O(n) | O(1) |
| Sliding Window | O(n) | O(k) |
| Hash Map | O(n) | O(n) |
| Binary Search | O(log n) | O(1) |
| BFS/DFS | O(V+E) | O(V) |
| DP | O(n²) or O(n) | O(n) or O(n²) |
| Heap (k elements) | O(n log k) | O(k) |

### Space-Time Tradeoffs

- Hash map: O(n) space for O(1) lookup
- Sorting first: O(n log n) enables two pointers
- Memoization: O(n) space avoids exponential time

---

## 3. Pattern 1: Two Pointers

**When to use:** Sorted arrays, palindromes, pairs, in-place removal, merging sorted arrays.

### Template

```typescript
function twoPointers(nums: number[]): number {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return /* found */;
    if (sum < target) left++;
    else right--;
  }
  return -1;
}
```

### Fast & Slow (Linked List)

```typescript
function hasCycle(head: ListNode | null): boolean {
  let slow = head, fast = head;
  while (fast?.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
```

### Problems (3+)

| # | Problem | Difficulty | Key Insight |
|---|---------|------------|-------------|
| 1 | [Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) | Easy | Sorted → two ends |
| 2 | [3Sum](https://leetcode.com/problems/3sum/) | Medium | Fix one, two-pointer rest |
| 3 | [Container With Most Water](https://leetcode.com/problems/container-with-most-water/) | Medium | Move shorter side |
| 4 | [Valid Palindrome](https://leetcode.com/problems/valid-palindrome/) | Easy | Skip non-alnum |
| 5 | [Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/) | Easy | Write pointer |

---

## 4. Pattern 2: Sliding Window

**When to use:** Contiguous subarray/substring, fixed or variable window size, frequency constraints.

### Fixed Window Template

```typescript
function fixedWindow(arr: number[], k: number): number {
  let windowSum = 0, maxSum = 0;
  for (let i = 0; i < arr.length; i++) {
    windowSum += arr[i];
    if (i >= k - 1) {
      maxSum = Math.max(maxSum, windowSum);
      windowSum -= arr[i - k + 1];
    }
  }
  return maxSum;
}
```

### Variable Window Template

```typescript
function variableWindow(s: string): number {
  const freq = new Map<string, number>();
  let left = 0, maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    freq.set(s[right], (freq.get(s[right]) ?? 0) + 1);

    while (/* window invalid */) {
      freq.set(s[left], freq.get(s[left])! - 1);
      left++;
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
```

### Problems (3+)

| # | Problem | Difficulty | Key Insight |
|---|---------|------------|-------------|
| 1 | [Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/) | Easy | Fixed k window |
| 2 | [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | Medium | Shrink on duplicate |
| 3 | [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) | Hard | Track required chars |
| 4 | [Permutation in String](https://leetcode.com/problems/permutation-in-string/) | Medium | Fixed window + freq match |
| 5 | [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii/) | Medium | At most k zeros |

---

## 5. Pattern 3: Hash Map / Set

**When to use:** O(1) lookup, frequency counting, grouping, duplicate detection.

### Template

```typescript
function hashMapPattern(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement)!, i];
    map.set(nums[i], i);
  }
  return [];
}
```

### Frequency Counter

```typescript
function topKFrequent(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([n]) => n);
}
```

### Problems (3+)

| # | Problem | Difficulty | Key Insight |
|---|---------|------------|-------------|
| 1 | [Two Sum](https://leetcode.com/problems/two-sum/) | Easy | Complement lookup |
| 2 | [Group Anagrams](https://leetcode.com/problems/group-anagrams/) | Medium | Sort string as key |
| 3 | [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) | Medium | Map + heap/bucket |
| 4 | [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/) | Medium | Set, check sequence start |
| 5 | [Valid Anagram](https://leetcode.com/problems/valid-anagram/) | Easy | Char frequency |

---

## 6. Pattern 4: Binary Search

**When to use:** Sorted data, find boundary, minimize/maximize with monotonic condition, search space reduction.

### Template

```typescript
function binarySearch(nums: number[], target: number): number {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
```

### Binary Search on Answer

```typescript
function minCapacity(weights: number[], days: number): number {
  let lo = Math.max(...weights);
  let hi = weights.reduce((a, b) => a + b, 0);

  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (canShip(weights, days, mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
```

### Problems (3+)

| # | Problem | Difficulty | Key Insight |
|---|---------|------------|-------------|
| 1 | [Binary Search](https://leetcode.com/problems/binary-search/) | Easy | Classic template |
| 2 | [Search Insert Position](https://leetcode.com/problems/search-insert-position/) | Easy | Return lo |
| 3 | [Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) | Medium | Compare mid vs right |
| 4 | [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) | Medium | BS on answer |
| 5 | [Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) | Hard | Partition both arrays |

---

## 7. Pattern 5: BFS & DFS

**When to use:** Graphs, trees, grids, level-order, connected components, shortest path (unweighted).

### BFS Template

```typescript
function bfs(grid: string[][]): number {
  const queue: [number, number][] = [[0, 0]];
  const visited = new Set<string>();
  visited.add("0,0");
  let steps = 0;

  while (queue.length) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const [r, c] = queue.shift()!;
      if (r === targetR && c === targetC) return steps;
      for (const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
        const nr = r + dr, nc = c + dc;
        const key = `${nr},${nc}`;
        if (valid(nr, nc) && !visited.has(key)) {
          visited.add(key);
          queue.push([nr, nc]);
        }
      }
    }
    steps++;
  }
  return -1;
}
```

### DFS Template

```typescript
function dfs(node: TreeNode | null): number {
  if (!node) return 0;
  const left = dfs(node.left);
  const right = dfs(node.right);
  return Math.max(left, right) + 1;
}
```

### Problems (3+)

| # | Problem | Difficulty | Key Insight |
|---|---------|------------|-------------|
| 1 | [Number of Islands](https://leetcode.com/problems/number-of-islands/) | Medium | DFS/BFS flood fill |
| 2 | [Clone Graph](https://leetcode.com/problems/clone-graph/) | Medium | Map old→new nodes |
| 3 | [Rotting Oranges](https://leetcode.com/problems/rotting-oranges/) | Medium | Multi-source BFS |
| 4 | [Pacific Atlantic Water Flow](https://leetcode.com/problems/pacific-atlantic-water-flow/) | Medium | Reverse DFS from edges |
| 5 | [Word Ladder](https://leetcode.com/problems/word-ladder/) | Hard | BFS shortest path |

---

## 8. Pattern 6: Trees

**When to use:** Hierarchical data, BST properties, recursion, level-order traversal.

### Traversals

```typescript
// Inorder: left → node → right (BST gives sorted order)
function inorder(root: TreeNode | null, result: number[] = []): number[] {
  if (!root) return result;
  inorder(root.left, result);
  result.push(root.val);
  inorder(root.right, result);
  return result;
}

// Level order (BFS)
function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const result: number[][] = [];
  const queue = [root];
  while (queue.length) {
    const level: number[] = [];
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}
```

### Problems (3+)

| # | Problem | Difficulty | Key Insight |
|---|---------|------------|-------------|
| 1 | [Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/) | Easy | DFS depth |
| 2 | [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/) | Medium | Min/max bounds |
| 3 | [Lowest Common Ancestor of BST](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/) | Medium | BST property |
| 4 | [Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/) | Hard | Global max + recursion |
| 5 | [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/) | Hard | BFS/DFS encoding |

---

## 9. Pattern 7: Graphs

**When to use:** Dependencies, cycles, shortest path, topological sort, union-find.

### Topological Sort (Kahn's BFS)

```typescript
function topologicalSort(n: number, edges: number[][]): number[] {
  const indegree = Array(n).fill(0);
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    indegree[v]++;
  }
  const queue = indegree.map((d, i) => d === 0 ? i : -1).filter(i => i >= 0);
  const order: number[] = [];
  while (queue.length) {
    const node = queue.shift()!;
    order.push(node);
    for (const nei of adj[node]) {
      if (--indegree[nei] === 0) queue.push(nei);
    }
  }
  return order.length === n ? order : []; // empty if cycle
}
```

### Union-Find

```typescript
class UnionFind {
  parent: number[];
  rank: number[];
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(0);
  }
  find(x: number): number {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }
  union(a: number, b: number): boolean {
    const ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;
    if (this.rank[ra] < this.rank[rb]) this.parent[ra] = rb;
    else if (this.rank[ra] > this.rank[rb]) this.parent[rb] = ra;
    else { this.parent[rb] = ra; this.rank[ra]++; }
    return true;
  }
}
```

### Problems (3+)

| # | Problem | Difficulty | Key Insight |
|---|---------|------------|-------------|
| 1 | [Course Schedule](https://leetcode.com/problems/course-schedule/) | Medium | Cycle detection / topo sort |
| 2 | [Course Schedule II](https://leetcode.com/problems/course-schedule-ii/) | Medium | Return topo order |
| 3 | [Network Delay Time](https://leetcode.com/problems/network-delay-time/) | Medium | Dijkstra |
| 4 | [Redundant Connection](https://leetcode.com/problems/redundant-connection/) | Medium | Union-Find |
| 5 | [Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/) | Medium | Bellman-Ford / BFS |

---

## 10. Pattern 8: Dynamic Programming

**When to use:** Optimal substructure, overlapping subproblems, counting ways, min/max cost.

### 1D DP Template

```typescript
function climbStairs(n: number): number {
  if (n <= 2) return n;
  let prev2 = 1, prev1 = 2;
  for (let i = 3; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}
```

### 2D DP Template

```typescript
function uniquePaths(m: number, n: number): number {
  const dp = Array.from({ length: m }, () => Array(n).fill(1));
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }
  return dp[m - 1][n - 1];
}
```

### DP Recognition Checklist

- Can problem be broken into smaller subproblems?
- Do subproblems repeat?
- Can you define `dp[i]` meaning clearly?
- What's the recurrence relation?

### Problems (3+)

| # | Problem | Difficulty | Key Insight |
|---|---------|------------|-------------|
| 1 | [Climbing Stairs](https://leetcode.com/problems/climbing-stairs/) | Easy | Fibonacci pattern |
| 2 | [House Robber](https://leetcode.com/problems/house-robber/) | Medium | Take or skip |
| 3 | [Coin Change](https://leetcode.com/problems/coin-change/) | Medium | Unbounded knapsack |
| 4 | [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/) | Medium | DP + BS optimization |
| 5 | [Edit Distance](https://leetcode.com/problems/edit-distance/) | Medium | 2D string DP |

---

## 11. Pattern 9: Heap / Priority Queue

**When to use:** K largest/smallest, merge K sorted, median stream, scheduling.

### Template (Min-Heap for K Largest)

```typescript
class MinHeap {
  private heap: number[] = [];
  push(val: number) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }
  pop(): number {
    const top = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }
    return top;
  }
  peek() { return this.heap[0]; }
  size() { return this.heap.length; }
  // bubbleUp, bubbleDown implementations...
}

function kthLargest(nums: number[], k: number): number {
  const heap = new MinHeap();
  for (const n of nums) {
    heap.push(n);
    if (heap.size() > k) heap.pop();
  }
  return heap.peek();
}
```

### Problems (3+)

| # | Problem | Difficulty | Key Insight |
|---|---------|------------|-------------|
| 1 | [Kth Largest Element in Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) | Medium | Min-heap size k |
| 2 | [Merge K Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) | Hard | Heap of list heads |
| 3 | [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) | Hard | Two heaps |
| 4 | [Task Scheduler](https://leetcode.com/problems/task-scheduler/) | Medium | Max-heap + cooldown |
| 5 | [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words/) | Medium | Heap with custom comparator |

---

## 12. Pattern 10: Stack / Monotonic Stack

**When to use:** Valid parentheses, next greater element, histogram area, parsing.

### Monotonic Stack Template

```typescript
function dailyTemperatures(temps: number[]): number[] {
  const result = Array(temps.length).fill(0);
  const stack: number[] = []; // indices

  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[i] > temps[stack[stack.length - 1]]) {
      const idx = stack.pop()!;
      result[idx] = i - idx;
    }
    stack.push(i);
  }
  return result;
}
```

### Problems (3+)

| # | Problem | Difficulty | Key Insight |
|---|---------|------------|-------------|
| 1 | [Valid Parentheses](https://leetcode.com/problems/valid-parentheses/) | Easy | Matching stack |
| 2 | [Daily Temperatures](https://leetcode.com/problems/daily-temperatures/) | Medium | Monotonic decreasing |
| 3 | [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) | Hard | Monotonic + area calc |
| 4 | [Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/) | Medium | Stack evaluation |
| 5 | [Car Fleet](https://leetcode.com/problems/car-fleet/) | Medium | Sort + stack |

---

## 13. NeetCode 150 Mapping

| Pattern | NeetCode Problems |
|---------|-------------------|
| Two Pointers | Valid Palindrome, Two Sum II, 3Sum, Container With Most Water, Trapping Rain Water |
| Sliding Window | Best Time Buy/Sell Stock, Longest Substring, Permutation in String, Min Window Substring |
| Hash Map | Two Sum, Group Anagrams, Top K Frequent, Product Except Self, Valid Sudoku |
| Binary Search | Binary Search, Search 2D Matrix, Koko Bananas, Find Min Rotated, Median Two Arrays |
| BFS/DFS | Number of Islands, Clone Graph, Rotting Oranges, Pacific Atlantic, Surrounded Regions |
| Trees | Invert Tree, Max Depth, Same Tree, Subtree, LCA BST, Validate BST, Kth Smallest |
| Graphs | Course Schedule I/II, Number of Connected Components, Redundant Connection |
| DP | Climbing Stairs, House Robber, Coin Change, LIS, LCS, Word Break, Decode Ways |
| Heap | Kth Largest, Merge K Lists, Find Median Stream, Task Scheduler |
| Stack | Valid Parentheses, Daily Temperatures, Largest Rectangle, Evaluate RPN |

**Full list:** [neetcode.io/practice](https://neetcode.io/practice)

---

## 14. LeetCode Practice Plan

### 12-Week Plan (200 Problems)

| Week | Focus | Target |
|------|-------|--------|
| 1–2 | Arrays, Hash Map, Two Pointers | 30 easy/medium |
| 3–4 | Sliding Window, Binary Search | 25 medium |
| 5–6 | Linked List, Stack, Heap | 25 medium |
| 7–8 | Trees, BFS/DFS | 30 medium |
| 9–10 | Graphs, Backtracking | 25 medium |
| 11–12 | DP, Hard review | 30 medium + 10 hard |

### Daily Routine (2 hours)

```
0:00–0:05  Review yesterday's problem
0:05–0:40  New problem (timed, no hints)
0:40–0:55  Watch/read solution if stuck
0:55–1:25  Second new problem
1:25–1:45  Re-implement without looking
1:45–2:00  Log patterns, update tracker
```

### Spaced Repetition

- Day 1: Solve problem
- Day 3: Re-solve from scratch
- Day 7: Re-solve + explain aloud
- Day 30: Final review before interview

---

## 15. Interview Script

### Opening (First 2 Minutes)

```
"Let me make sure I understand the problem..."
[Restate problem, confirm inputs/outputs]
"Can the input be empty? Are there duplicates? What's the expected size?"
"Let me think of a few examples including edge cases."
```

### Approach (Next 5 Minutes)

```
"Brute force would be O(n²) by checking every pair..."
"We can optimize using a hash map to O(n) time, O(n) space."
"I'll use the two-pointer technique since the array is sorted."
"Let me outline the algorithm step by step before coding."
```

### Coding (15–20 Minutes)

- Use meaningful variable names
- Handle edge cases first
- Talk through logic as you write
- Don't panic on syntax — pseudocode if needed

### Testing (5 Minutes)

```
"Let me trace through the example: [1,2,3], target=5"
"Edge case: empty array → return []"
"Edge case: no solution → return [-1,-1]"
"Time: O(n), Space: O(n) for the hash map"
```

### When Stuck

```
"I'm considering two approaches: BFS vs DFS..."
"For BFS, the trade-off is O(n) space for the queue..."
"Can I get a hint on whether DP is the right direction?"
```

### Common Follow-ups

- Optimize space to O(1)
- What if input doesn't fit in memory?
- How would you parallelize?
- Write unit tests for this function

---

## Quick Reference

```
Two Pointers  → sorted, pairs, palindrome
Sliding Window → contiguous subarray/substring
Hash Map      → O(1) lookup, frequency
Binary Search → sorted, minimize/maximize answer
BFS/DFS       → graphs, grids, shortest path
Trees         → recursion, BST, level order
Graphs        → topo sort, union-find, Dijkstra
DP            → optimal substructure, overlapping
Heap          → k largest, merge k, median
Stack         → matching, next greater, monotonic
```

**Goal:** Pattern recognition in < 3 minutes → correct approach → clean code → complexity analysis.

---

## 16. Product-company DSA (1 CR)

Generic patterns get you past startups. **Google / Meta / Amazon / Microsoft / Uber** grade *follow-ups* and *company flavor*. Full lists + loop shapes: `20-1cr-product-company-complete.pdf` §3–4.

### What changes at 1 CR vs 30 LPA

| 30 LPA | 1 CR product |
|--------|----------------|
| One accepted solution | Brute → optimal → follow-up (stream / memory / threads) |
| Silence while coding | Narrate every 15–20 seconds |
| Only NeetCode 150 | NeetCode 150 **plus** company-tagged + 1 unseen medium/week |
| Segment tree early | Skip segment tree until Phase 9 unless the problem forces it |

### Must-add families (do in Phase 6E–6F)

| Family | Problems (do all) |
|--------|-------------------|
| Intervals | LC 56 Merge, 57 Insert, 253 Meeting Rooms II, 435 Non-overlap |
| Backtracking | LC 78 Subsets, 46 Permutations, 39 Combination Sum, 79 Word Search |
| Union-Find | LC 547 Provinces, 684 Redundant Connection, 721 Accounts Merge |
| Topo | LC 207 / 210 Course Schedule, 269 Alien Dictionary (premium or equivalent) |
| Design LC | LC 146 LRU, 355 Design Twitter, 380 Insert Delete GetRandom |

### Follow-up script (say after every accepted solution)

1. Trace a failing edge case.
2. Time / space; bottleneck at n = 10^7.
3. “If this is a stream…” (heap / two pointers).
4. “If two threads call this…” (lock vs snapshot).
5. Wrap as a small product API (`class Autocomplete`).

### Company-tagged (first pass in Days 133–135)

- **Meta speed:** 56, 215, 236, 314, 347, 560, 680, 1249  
- **Amazon:** 23, 42, 127, 146, 200, 238, 973, 994  
- **Google think:** 42, 76, 124, 212, 295, 394  
- **Uber graphs/heap:** 23, 253, 295, 973, 1091  

Re-solve each **twice**, timed, then speak one follow-up.

---

## 17. Pattern 11: Intervals

**When:** overlapping ranges — meetings, calendar, video clips, merge slots.  
**Template:** sort by start (sometimes end), then one pass merge or min-heap of end times.

```typescript
function merge(intervals: number[][]): number[][] {
  intervals.sort((a, b) => a[0] - b[0]);
  const out = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = out[out.length - 1];
    if (intervals[i][0] <= last[1]) last[1] = Math.max(last[1], intervals[i][1]);
    else out.push(intervals[i]);
  }
  return out;
}
```

| # | Problem | Why they ask |
|---|---------|--------------|
| 1 | [Merge Intervals](https://leetcode.com/problems/merge-intervals/) | Meta / Amazon classic |
| 2 | [Insert Interval](https://leetcode.com/problems/insert-interval/) | Same family, more branches |
| 3 | [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/) | Heap of end times (Uber / Amazon) |
| 4 | [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/) | Greedy by end |

**Follow-up they love:** “Now do it for a calendar with recurring events” → treat expansion as a generator, still merge.

---

## 18. Pattern 12: Backtracking

**When:** enumerate subsets / permutations / constraint boards.  
**Template:** choose → recurse → unchoose. Bound early.

```typescript
function subsets(nums: number[]): number[][] {
  const res: number[][] = [];
  const path: number[] = [];
  function dfs(i: number) {
    if (i === nums.length) { res.push([...path]); return; }
    path.push(nums[i]); dfs(i + 1); path.pop();
    dfs(i + 1);
  }
  dfs(0);
  return res;
}
```

| # | Problem | Note |
|---|---------|------|
| 1 | [Subsets](https://leetcode.com/problems/subsets/) | Template |
| 2 | [Permutations](https://leetcode.com/problems/permutations/) | Used[] or swap |
| 3 | [Combination Sum](https://leetcode.com/problems/combination-sum/) | Reuse allowed |
| 4 | [Word Search](https://leetcode.com/problems/word-search/) | Grid + visited |
| 5 | [N-Queens](https://leetcode.com/problems/n-queens/) | Phase 9 / Google |

**Interview talk:** state space size first (“2^n subsets”) so they know you will not TLE blindly.

---

## Quick Reference (updated)

```
Two Pointers  → sorted, pairs, palindrome
Sliding Window → contiguous subarray/substring
Hash Map      → O(1) lookup, frequency
Binary Search → sorted, minimize/maximize answer
BFS/DFS       → graphs, grids, shortest path
Trees         → recursion, BST, level order
Graphs        → topo sort, union-find, Dijkstra
DP            → optimal substructure, overlapping
Heap          → k largest, merge k, median
Stack         → matching, next greater, monotonic
Intervals     → sort + merge / heap of ends
Backtracking  → choose · recurse · unchoose
```

**1 CR extra:** after every problem, speak one follow-up. Lists: `20-1cr-product-company-complete.pdf`.
