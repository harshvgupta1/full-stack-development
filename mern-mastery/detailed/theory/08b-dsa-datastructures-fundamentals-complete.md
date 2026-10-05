# DSA Data Structures Fundamentals — Complete Guide

<!-- SCHEDULE-BANNER-START -->
> **📅 Study window:** 17 Aug 2026 – 6 Dec 2026 (Days 1–112)
> **⏰ Your slots (IST):** Mon–Fri **7:30–8:30pm** & **9:00–10:00pm** · Sat–Sun **9:00am–12:00pm**, **3:00–5:30pm**, **6:00–8:30pm**
> **📧 Calendar reminders:** harsh.gupta@getreelax.com — import `calendar/mern-mastery-study.ics`
<!-- SCHEDULE-BANNER-END -->

> **Phase 1–6 parallel** — Start Day 8, continue through Month 5.  
> **Prerequisites:** JavaScript arrays (PDF #01 §10).  
> **Unlocks:** DSA Patterns (08), Advanced DSA (14).

---

## Why this exists (don't skip)

`08-dsa-patterns-complete.pdf` teaches **patterns** but assumes you know what a heap, trie, and graph adjacency list **are**.  
`14-advanced-dsa-hard-complete.pdf` is impossible without this foundation.

**80 LPA bar:** Implement stack, queue, LL, BST, min-heap from scratch in 20 minutes.

---

## Study schedule (parallel with main roadmap)

| Week | Sections | Pair with |
|------|----------|-----------|
| 1–2 | §1 Arrays, §2 Strings | LC easy arrays |
| 2–3 | §3 Hash Map | LC Two Sum, Anagram |
| 3 | §4 Stack, §5 Queue | LC Valid Parentheses |
| 4 | §6 Linked List | LC Reverse List |
| 5–7 | §7 Tree, §8 BST | LC tree easy |
| 8–12 | §9 Graph, §10 Heap | LC BFS/DFS intro |
| 13+ | §11 Trie, §12 Union-Find | Month 5 patterns |

---

## 1. Arrays & Strings

### Array operations complexity

| Operation | Time |
|-----------|------|
| Access by index | O(1) |
| Search (unsorted) | O(n) |
| Insert at end | O(1) amortized |
| Insert at middle | O(n) |
| Delete | O(n) |

### Implementation patterns

```javascript
// Two pointers on sorted array
function twoSumSorted(nums, target) {
  let l = 0, r = nums.length - 1;
  while (l < r) {
    const sum = nums[l] + nums[r];
    if (sum === target) return [l, r];
    if (sum < target) l++;
    else r--;
  }
  return [-1, -1];
}

// Prefix sum
function prefixSum(nums) {
  const prefix = [0];
  for (const n of nums) prefix.push(prefix.at(-1) + n);
  // sum(i..j) = prefix[j+1] - prefix[i]
  return prefix;
}
```

---

## 2. Hash Map / Set

```javascript
// Frequency count pattern
function charFrequency(s) {
  const map = new Map();
  for (const c of s) map.set(c, (map.get(c) || 0) + 1);
  return map;
}

// O(1) lookup — trade space for time
const seen = new Set();
if (seen.has(x)) { /* duplicate */ }
seen.add(x);
```

**When to use:** Two Sum, anagrams, counting, deduplication.

---

## 3. Stack (LIFO)

```javascript
class Stack {
  constructor() { this.items = []; }
  push(x) { this.items.push(x); }
  pop() { return this.items.pop(); }
  peek() { return this.items.at(-1); }
  isEmpty() { return this.items.length === 0; }
}
```

**Use cases:** Valid parentheses, undo, DFS iterative, monotonic stack.

**LC:** Valid Parentheses (#20), Min Stack (#155), Daily Temperatures (#739).

---

## 4. Queue (FIFO)

```javascript
class Queue {
  constructor() { this.items = []; }
  enqueue(x) { this.items.push(x); }
  dequeue() { return this.items.shift(); } // O(n) — use circular buffer for O(1)
  front() { return this.items[0]; }
  isEmpty() { return this.items.length === 0; }
}
```

**Use cases:** BFS, task scheduling, rate limiting sliding window.

**Better dequeue O(1):** Use two stacks or linked list queue.

---

## 5. Linked List

```javascript
class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

// Reverse linked list — MUST know cold
function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}

// Fast/slow pointers — cycle detection
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast?.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
```

**Complexity:** Access O(n), insert at head O(1).

---

## 6. Tree & Binary Search Tree

```javascript
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// Traversals — all four MUST know
function inorder(root) {  // Left, Root, Right — BST gives sorted
  if (!root) return [];
  return [...inorder(root.left), root.val, ...inorder(root.right)];
}

function bfs(root) {
  if (!root) return [];
  const result = [], queue = [root];
  while (queue.length) {
    const node = queue.shift();
    result.push(node.val);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return result;
}
```

**BST property:** left < root < right. Search/insert O(log n) balanced, O(n) worst skewed.

---

## 7. Graph

```javascript
// Adjacency list (most common)
const graph = {
  A: ["B", "C"],
  B: ["A", "D"],
  C: ["A"],
  D: ["B"],
};

function bfsGraph(start, graph) {
  const visited = new Set([start]);
  const queue = [start];
  while (queue.length) {
    const node = queue.shift();
    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return visited;
}
```

**Representations:** Adjacency list (sparse graphs), adjacency matrix (dense, O(1) edge lookup).

---

## 8. Min-Heap / Priority Queue

```javascript
class MinHeap {
  constructor() { this.heap = []; }

  push(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 1) return this.heap.pop();
    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown(0);
    return min;
  }

  bubbleUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[i] >= this.heap[parent]) break;
      [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
      i = parent;
    }
  }

  bubbleDown(i) {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this.heap[l] < this.heap[smallest]) smallest = l;
      if (r < n && this.heap[r] < this.heap[smallest]) smallest = r;
      if (smallest === i) break;
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      i = smallest;
    }
  }
}
```

**Use cases:** Top K elements, merge K lists, Dijkstra, median stream.

---

## 9. Trie

```javascript
class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

class Trie {
  constructor() { this.root = new TrieNode(); }

  insert(word) {
    let node = this.root;
    for (const c of word) {
      if (!node.children[c]) node.children[c] = new TrieNode();
      node = node.children[c];
    }
    node.isEnd = true;
  }

  search(word) {
    let node = this.root;
    for (const c of word) {
      if (!node.children[c]) return false;
      node = node.children[c];
    }
    return node.isEnd;
  }
}
```

**Use cases:** Autocomplete, word search, prefix matching.

---

## 10. Union-Find (Disjoint Set)

```javascript
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(0);
  }

  find(x) {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }

  union(x, y) {
    const px = this.find(x), py = this.find(y);
    if (px === py) return false;
    if (this.rank[px] < this.rank[py]) this.parent[px] = py;
    else if (this.rank[px] > this.rank[py]) this.parent[py] = px;
    else { this.parent[py] = px; this.rank[px]++; }
    return true;
  }
}
```

**Use cases:** Number of islands, cycle detection, Kruskal MST.

---

## 11. Complexity summary

| Structure | Access | Search | Insert | Delete |
|-----------|--------|--------|--------|--------|
| Array | O(1) | O(n) | O(n) | O(n) |
| Hash Map | — | O(1)* | O(1)* | O(1)* |
| Stack/Queue | O(n) | O(n) | O(1) | O(1) |
| Linked List | O(n) | O(n) | O(1) head | O(1) head |
| BST balanced | O(log n) | O(log n) | O(log n) | O(log n) |
| Heap | — | O(n) | O(log n) | O(log n) |
| Trie | — | O(m) | O(m) | O(m) |

*m = word length, *average case for hash

---

## 12. Gate to DSA Patterns (PDF #12)

Before Month 5 patterns intensive:
- [ ] Implement stack, queue, LL reverse from memory
- [ ] BFS tree and graph
- [ ] Min-heap push/pop
- [ ] Explain BFS vs DFS use cases
- [ ] 60+ LC easy/medium done

---

## 13. Interview Q&A

**Q: Array vs Linked List — when to use which?**  
**A:** Arrays: O(1) random access, cache-friendly, fixed or dynamic size — use for index-based access, sorting, two pointers. Linked lists: O(1) insert/delete at known position, no reallocation — use for frequent insertions at head, LRU cache implementation, polynomial arithmetic. Arrays dominate in practice due to cache locality.

**Q: How does a hash map work internally?**  
**A:** Hash function maps key to bucket index. Collisions handled by chaining (linked list per bucket) or open addressing (probe next slot). JavaScript Map uses hash table with insertion order. Average O(1) get/set; worst O(n) if all keys collide. Load factor triggers resize/rehash.

**Q: BFS vs DFS — when to use which?**  
**A:** BFS: shortest path in unweighted graph, level-order traversal, nearest neighbor — uses queue, O(V+E). DFS: detect cycles, topological sort, path existence, maze solving — uses stack/recursion, O(V+E). BFS uses more memory for wide graphs; DFS can stack overflow on deep graphs.

---

## Where to practice

- LeetCode Explore: Data Structure cards
- Visualize: visualgo.net
- Implement each structure in `mern-mastery/dsa-structures/` folder
