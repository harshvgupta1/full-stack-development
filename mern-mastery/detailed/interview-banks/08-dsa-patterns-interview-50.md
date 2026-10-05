# DSA Patterns Interview Q&A Bank — 100 Questions

> 50 interview questions with full detailed answers for two pointers, sliding window, hash map, binary search, Breadth-First Search (BFS), Depth-First Search (DFS), and dynamic programming intro.

> **Target companies:** Google, Amazon, Flipkart, Uber, Microsoft, Meta.

> **How to use:** Pick 2 questions daily. Read the question, answer aloud in 2–3 minutes, then check the full answer.

---

### Q1: What is the two pointers pattern and when do you use it?

**Answer:** Two pointers use index `left` and `right` (or slow/fast) scanning array or string from different positions. Use on sorted arrays for pair sums, palindrome check, removing duplicates in-place, merging sorted arrays, and container with most water. Often O(n) time O(1) space vs O(n²) brute force. First check if sorting or sorted input enables two pointers.

---

### Q2: How does two pointers work on a sorted array for pair sum?

**Answer:** Set left=0, right=n-1. If sum too small, left++; if too big, right--; if equal, record and move. O(n) after O(n log n) sort, or O(n) if already sorted. Works for 'two sum' in sorted array; unsorted version uses hash map. State why moving pointers is safe — monotonic reason.

---

### Q3: What is the sliding window pattern?

**Answer:** Sliding window maintains a contiguous subarray/substring window with `left` and `right` expanding or shrinking while tracking window state (sum, frequency map, distinct count). Fixed window: size k slides. Variable window: expand until invalid, then shrink from left. O(n) each element enters and leaves once. Classic for max sum subarray of size k, longest substring without repeating characters.

---

### Q4: What is the difference between fixed and variable sliding window?

**Answer:** Fixed: window size k constant — compute first window, slide by add right remove left. Variable: grow right until constraint violated (sum > target, duplicate char), then shrink left until valid again, track best answer at each valid state. Minimum window substring is variable window hard problem — Amazon favorite.

---

### Q5: How does hash map pattern solve Two Sum?

**Answer:** One pass: for each `nums[i]`, check if `target - nums[i]` exists in map; if yes return indices; else store `nums[i] → i`. O(n) time O(n) space. Template for complement lookup, anagram grouping, frequency counting. Explain trade: O(n) space buys O(1) lookup vs sorting O(n log n) space O(1).

---

### Q6: When do you use hash map for frequency counting?

**Answer:** Count character or element frequencies: anagram detection, top K frequent, find duplicate, ransom note. Pattern: `map.set(c, (map.get(c)||0)+1)`. Compare maps or use single map with decrement for anagram. O(n) time. Follow-up: array size n, values 1..n — use array as hash O(1) space (pigeonhole).

---

### Q7: Explain binary search beyond sorted arrays.

**Answer:** Binary search works on monotonic predicate: find first/last true in `[false,...,false,true,...,true]`. Examples: minimum capacity to ship packages, square root, search rotated sorted array (modified compare). Template: `while (lo < hi) { mid = lo + (hi-lo)/2; if (ok(mid)) hi = mid; else lo = mid+1; }`. O(log n) — always mention overflow-safe mid.

---

### Q8: What is 'binary search on answer'?

**Answer:** When answer is in range [lo, hi] and if value x works then all x' > x work (monotonic), binary search the answer space without explicit array. Check feasibility with helper `can(x)`. Used in Koko eating bananas, split array largest sum. Interview script: define monotonic property before coding.

---

### Q9: What is the BFS (Breadth-First Search) template?

**Answer:** Use queue. Enqueue start, mark visited. While queue: dequeue node, process, enqueue unvisited neighbors. Level-order: track queue size each iteration. Shortest path in unweighted graph — first time reaching target is minimum steps. O(V+E) time. Never forget visited set or infinite loop on cycles.

---

### Q10: What is the DFS (Depth-First Search) template?

**Answer:** Recursive: base case, mark visited, recurse neighbors. Iterative: stack push start. Use for exploring all paths, cycle detection, topological sort, connected components, island counting. O(V+E). Backtracking is DFS with undo (remove from path after explore). Depth limit for large graphs to avoid stack overflow.

---

### Q11: When do you choose BFS vs DFS?

**Answer:** BFS: shortest path unweighted, level-by-level, nearest layer (word ladder). DFS: enumerate paths, detect cycle with recursion stack colors, topological order, maze with one path. Memory: BFS O(width) queue; DFS O(depth) stack. Grid problems: both work for islands — BFS if shortest steps matter.

---

### Q12: What is dynamic programming (DP) and when is it applicable?

**Answer:** DP solves problems with optimal substructure and overlapping subproblems by storing subproblem results. Applicable when brute force recursion revisits same states — Fibonacci, knapsack, longest increasing subsequence. Steps: define state, recurrence, base case, iteration order, space optimization. Say 'DP' only after identifying overlapping subproblems.

---

### Q13: What is the difference between memoization and tabulation?

**Answer:** Memoization: top-down recursion + cache (hash map or array) — compute on demand. Tabulation: bottom-up fill table in known order — often no recursion stack. Same complexity usually. Tabulation easier to optimize space (rolling array). Interviews: start with memoization if recurrence natural, refactor to tabulation.

---

### Q14: How do you define DP state in an interview?

**Answer:** State = parameters fully describing subproblem — e.g. `dp[i]` = best answer using first i items, `dp[i][w]` = max value with weight limit w. Wrong state = wrong solution. Write recurrence in words before code: `dp[i] = max(dp[i-1], nums[i] + dp[i-2])`. Validate with small example manually.

---

### Q15: Explain the Kadane's algorithm pattern.

**Answer:** Maximum subarray sum: `currMax = max(nums[i], currMax + nums[i])`, track global max. O(n) O(1). DP view: dp[i] = max ending at i. Variants: return indices, circular array, max product (track min and max). Google easy-medium staple — know derivation not just memorization.

---

### Q16: How does coin change DP work?

**Answer:** Minimum coins for amount: `dp[0]=0`, `dp[a] = min(dp[a-coin]+1)` for each coin. Unbounded knapsack order — iterate amounts outer loop. Count ways: `dp[a] += dp[a-coin]`. O(amount × coins). Clarify unlimited vs 0/1 coin supply — changes inner loop direction.

---

### Q17: What is the longest increasing subsequence (LIS) pattern?

**Answer:** O(n²) DP: `dp[i]` = LIS ending at i. O(n log n) with patience sorting — binary search on tails array. Patience sorting is advanced but impresses at Microsoft. Return length vs actual sequence differs — sequence needs parent pointers.

---

### Q18: How do you solve grid BFS problems like rotten oranges?

**Answer:** Multi-source BFS: enqueue all sources (rotten oranges) with distance 0 simultaneously. Process level by level incrementing time. Shortest time for all cells. Template extends to 01 BFS (deque), fire spread, nearest gate. Mark visited when enqueue not dequeue to avoid duplicates.

---

### Q19: What is topological sort and when is it needed?

**Answer:** Linear ordering of DAG (Directed Acyclic Graph) where every edge u→v has u before v. Kahn's algorithm: BFS with in-degree zero queue. Or DFS post-order reverse. Use for course schedule, build order, dependency resolution. Cycle detection: if processed count < V, cycle exists — Flipkart dependency question.

---

### Q20: What is backtracking and how differs from DP?

**Answer:** Backtracking explores all choices with undo — subsets, permutations, N-queens, sudoku. Exponential time often. Prune invalid branches early. DP when subproblems repeat and optimal structure; backtracking when count/enumerate all solutions. Combination sum with reuse may use backtracking; with optimization and overlap → DP.

---

### Q21: Explain the subsets generation pattern.

**Answer:** For each element: include or exclude — recursion `backtrack(i, path)`. Or iterative bitmask 0 to 2^n-1. O(2^n) output size unavoidable. Subsets II adds sort + skip duplicates at same level. Communicate time dominated by output size.

---

### Q22: How do permutations differ from subsets in approach?

**Answer:** Permutations: use used array or swap, choose unused elements — n! leaves. Subsets: ordered by index, no reuse of earlier index in same path. Next permutation (lexicographic) uses two-pointer swap algorithm — occasional follow-up.

---

### Q23: What is the merge intervals pattern?

**Answer:** Sort by start time. Iterate: if current overlaps last merged (start ≤ last.end), extend last.end; else push new interval. O(n log n). Used for meeting rooms, insert interval, employee free time. Overlap condition critical — clarify inclusive vs exclusive endpoints.

---

### Q24: What is the fast and slow pointers pattern beyond linked lists?

**Answer:** Also tortoise-hare on arrays (find duplicate in O(1) space — Floyd cycle in index array), middle of linked list, palindrome linked list (find mid, reverse second half). O(n) one pass. Name pattern when interviewer sees two pointers moving at different speeds.

---

### Q25: What is prefix sum and when to use it?

**Answer:** Prefix[i] = sum of nums[0..i-1]. Range sum query O(1): prefix[j+1]-prefix[i]. 2D prefix for matrix region sum. Combine with hash map for subarray sum equals K — store prefix frequencies. O(n) preprocessing, O(1) or O(n) queries depending variant.

---

### Q26: When is greedy algorithm correct and how to justify?

**Answer:** Greedy picks locally optimal if problem has greedy choice property and optimal substructure — activity selection, non-overlapping intervals, Huffman coding. Prove or cite exchange argument. Wrong greedy on coin change {1,3,4} target 6 — greedy 4+1+1=3 coins, optimal 3+3=2. Always test counterexample mentally.

---

### Q27: How do you binary search a rotated sorted array?

**Answer:** Modified compare: if `nums[lo] <= nums[mid]` left half sorted, else right sorted. Check if target in sorted half, adjust lo/hi. O(log n). Duplicate values need `while (nums[hi]===nums[lo]) hi--` worst O(n). Amazon rotation search is standard.

---

### Q28: What is tree DP intro — example house robber III?

**Answer:** DP on tree: post-order compute `rob(node)` and `notRob(node)` from children returns. Cannot rob adjacent nodes. O(n). Pattern: recurse children, combine at parent. Also diameter of tree, max path sum — state often includes/excludes current node.

---

### Q29: How do you detect cycle in directed graph?

**Answer:** Three-color DFS: white unvisited, gray in current stack, black finished. Edge to gray node = cycle. Or Kahn topological sort — no complete order means cycle. Undirected: DFS track parent or Union-Find. State which graph type before answering.

---

### Q30: Explain Dijkstra's algorithm at intro level.

**Answer:** Shortest path from source in weighted graph with non-negative edges. Min-heap stores (distance, node). Relax neighbors if shorter path found. O((V+E) log V). Cannot handle negative edges — use Bellman-Ford. Uber ETA maps to Dijkstra on road network — mention non-negative distances.

---

### Q31: When do you use Union-Find in patterns?

**Answer:** Dynamic connectivity, count connected components after adding edges, Kruskal MST edge sorting + union, detect cycle in undirected graph on edge insert. Simpler than DFS when only group membership matters. O(α(n)) nearly constant per operation.

---

### Q32: What is the meeting rooms II pattern?

**Answer:** Min heap of end times: sort meetings by start, if start >= heap.min pop finished room, push end. Heap size = rooms needed. Greedy + heap. Variation of interval partitioning — classic calendar scheduling at Meta.

---

### Q33: How does valid parentheses use stack pattern?

**Answer:** Push opening brackets. On closing, pop must match. O(n). Extensions: generate valid strings, longest valid substring (stack stores indices), minimum remove to valid. Monotonic stack variant for nested depth.

---

### Q34: Explain longest substring without repeating characters.

**Answer:** Variable window + Set or Map of last index. Expand right, shrink left while duplicate. O(n). Map last index allows jump left directly — optimization. Template for many 'substring with constraint' problems.

---

### Q35: How do you approach 3Sum pattern?

**Answer:** Sort array. Fix i, two pointers on remainder for -nums[i]. Skip duplicates on i and pointers. O(n²). Extension 3Sum closest, 4Sum add another loop or hash. Communicate duplicate skipping to avoid double counting.

---

### Q36: What is container with most water teaching?

**Answer:** Two pointers at ends. Move shorter line inward — only shorter limits height, moving taller cannot increase area. O(n) greedy proof. Teaches monotonic pointer movement justification — interviewers want proof sketch.

---

### Q37: What is binary tree level order traversal pattern?

**Answer:** BFS queue, track size per level. Variants: zigzag, right side view (last per level), vertical order (column + BFS). O(n). Foundation for many tree problems before recursion-heavy ones.

---

### Q38: How do you solve number of islands?

**Answer:** Grid DFS or BFS: for each '1' not visited, increment count, flood fill mark visited. O(rows×cols). Union-Find alternative. Discuss in-place marking vs visited matrix — trade memory.

---

### Q39: Explain climbing stairs as DP intro.

**Answer:** dp[i] = ways to reach step i = dp[i-1] + dp[i-2]. Fibonacci. O(n) time O(1) space with two variables. Introduces transition from recursion to DP. Generalizes with steps 1 or 2 or custom step sizes.

---

### Q40: What is house robber linear DP?

**Answer:** Cannot rob adjacent houses: `dp[i] = max(dp[i-1], nums[i]+dp[i-2])`. O(n) O(1). Circular variant needs split into two linear runs excluding first or last house. Classic state machine DP intro.

---

### Q41: How does word break use DP?

**Answer:** `dp[i]` = can segment s[0..i)? Check j < i where `dp[j]` and s[j..i) in dictionary. O(n² × dict lookup). BFS also works. Trie speeds dictionary lookup. Google medium — define boolean DP clearly.

---

### Q42: How should you communicate approach in a coding interview?

**Answer:** Repeat problem, clarify inputs/outputs/edge cases, give brute force complexity, propose optimized pattern with why, get buy-in, code cleanly, test with example including edge case, state time/space. At Amazon use Leadership Principles tie-in sparingly. Silence while thinking is OK — narrate key insights.

---

### Q43: How do you analyze time complexity for nested loops with two pointers?

**Answer:** Single loop with two pointers moving total n steps — O(n) not O(n²). Sliding window each element enters and leaves once — O(n). Nested binary searches O(n log n). State invariant maintaining why pointers only move forward.

---

### Q44: What is space optimization in DP — rolling array?

**Answer:** If dp[i] depends only on dp[i-1] and dp[i-2], keep two variables not full array — O(1) space. 2D knapsack optimize to 1D array iterating weight backwards for 0/1 knapsack. Mention after correct 2D solution — shows senior polish.

---

### Q45: When might bit manipulation appear with patterns?

**Answer:** XOR cancels duplicates — single number. Count bits, subset generation with bitmask. Usually secondary to main patterns but quick wins on easy Google questions. Know `x & (x-1)` removes lowest set bit.

---

### Q46: Why sort as preprocessing step?

**Answer:** Enables two pointers, merge intervals, greedy scheduling, binary search on paired values. O(n log n) sort cost often dominates — still beats O(n²). Ask if sorting allowed or if original order must preserve.

---

### Q47: Recursion vs iteration — interview preference?

**Answer:** Either works if correct. Iteration avoids stack overflow. Recursion clearer for trees and backtracking. Mention converting recursion to stack if depth large. Tail recursion not optimized in JavaScript.

---

### Q48: How do you pick a pattern when stuck?

**Answer:** Ask: sorted? → two pointers/binary search. Subarray/substring contiguous constraint? → sliding window. Need counts or complements? → hash map. Tree/graph? → BFS/DFS. Optimal substructure? → DP. Try brute force then optimize — pattern emerges from bottleneck.

---

### Q49: What are common DSA interview mistakes?

**Answer:** Wrong complexity claim, missing empty input, off-by-one in binary search, not handling duplicates, infinite loop in while without progress, modifying array while iterating, forgetting visited in graph. Always walk through tiny example before coding.

---

### Q50: Give a 60-second pattern cheat sheet for product company screens.

**Answer:** Two pointers: sorted pairs/in-place. Sliding window: contiguous subarray max/min. Hash map: frequency, complement, index. Binary search: sorted or monotonic answer. BFS: shortest steps. DFS: explore paths, cycles, components. DP: max/min/count ways with overlapping subproblems. State pattern name, complexity, and one example problem — interviewers score recognition speed at Google and Flipkart.

---
---

## Questions 51–100 (top product companies)

### Question 51: When is a monotonic stack the right tool?
**Answer:** Next greater/smaller in O(n). Daily temperatures, histogram, trapping rain. Amazon / Google.

### Question 52: Union-Find vs DFS for components?
**Answer:** Union-Find when you merge dynamically (accounts merge). DFS when the graph is static. Meta / Google.

### Question 53: How do you detect a cycle in directed vs undirected graphs?
**Answer:** Directed: colors / recursion stack. Undirected: Union-Find or parent-aware DFS. Amazon.

### Question 54: Explain topological sort Kahn vs DFS.
**Answer:** Kahn: queue of zero in-degree. DFS: finish times reverse. Course schedule. Microsoft / Amazon.

### Question 55: What is a prefix sum used for?
**Answer:** Range sum in O(1) after O(n). Subarray sum equals K with a map. Meta.

### Question 56: Binary search on rotated array — key insight?
**Answer:** One half is always sorted; decide which half holds the target. Microsoft / Amazon.

### Question 57: How do you serialize a binary tree?
**Answer:** Preorder with null markers, or level order. LC 297. Amazon / Google.

### Question 58: Trie vs hash map for prefix search?
**Answer:** Trie for prefixes and typeahead. Hash for exact. Google / Atlassian.

### Question 59: Explain sliding window maximum.
**Answer:** Deque of decreasing indices; pop back if smaller, pop front if out of window. Hard Amazon.

### Question 60: When is Dijkstra vs BFS?
**Answer:** BFS unweighted. Dijkstra non-negative weights. Uber maps.

### Question 61: How do you find duplicates in O(n) time O(1) space if values are 1..n?
**Answer:** Index marking or Floyd cycle (LC 287). Microsoft / Amazon.

### Question 62: Kadane’s algorithm in one minute.
**Answer:** Best subarray ending here = max(x, best+x). Max subarray. Adobe / Amazon.

### Question 63: How do you merge K sorted lists?
**Answer:** Min-heap of heads. O(N log K). Google / Uber.

### Question 64: Explain backtracking template.
**Answer:** Choose, recurse, unchoose. Bound early. Subsets / N-Queens. Google.

### Question 65: What is a difference array?
**Answer:** Range increment in O(1), then prefix. Corporate flight bookings. Google.

### Question 66: How do you compute next permutation?
**Answer:** Find pivot, swap with next greater, reverse suffix. Microsoft.

### Question 67: Explain 0/1 knapsack vs unbounded.
**Answer:** 0/1: each item once (loop weight backward). Unbounded: coin change (forward). Amazon / Microsoft.

### Question 68: Lowest Common Ancestor in a Binary Search Tree vs binary tree.
**Answer:** BST: walk from root. Tree: recurse both sides. Meta / Amazon.

### Question 69: How do you find the median of two sorted arrays?
**Answer:** Binary search partition (hard). Google classic. Know the idea even if you code the merge in time.

### Question 70: What is a sparse table used for?
**Answer:** Idempotent range queries (min) in O(1) after O(n log n). Rare Google.

### Question 71: Explain Dutch national flag.
**Answer:** Three pointers for 0/1/2 sort. Sort colors. Microsoft / Amazon.

### Question 72: How do you clone a graph?
**Answer:** Hash old→new, BFS/DFS. LC 133. Amazon / Meta.

### Question 73: What is a rolling hash (Rabin-Karp) for?
**Answer:** Substring search, plagiarism-ish. Occasional Google.

### Question 74: Heap vs sorted array for top-K.
**Answer:** Heap O(n log K) better when K << n. Meta / Uber.

### Question 75: How do you handle integer overflow in JS interviews?
**Answer:** JS Number is IEEE; use BigInt if they care. Mention 2^53-1. Microsoft.

### Question 76: Explain Morris traversal at a high level.
**Answer:** Thread null rights to successor; O(1) space inorder. Rare Google flex — optional.

### Question 77: When do you use two heaps?
**Answer:** Median stream, sliding window median. Google / Uber.

### Question 78: How do you find an articulation point?
**Answer:** Tarjan / discovery times. Rare; say you would review if asked. Google L5.

### Question 79: Explain bit tricks they actually ask.
**Answer:** n & (n-1) clear lowest one, xor for single number. Microsoft / Adobe.

### Question 80: What is a Fenwick tree for?
**Answer:** Prefix sums with updates. Optional Phase 9. Google.

### Question 81: How do you reconstruct a tree from inorder+preorder?
**Answer:** Preorder root, split inorder, recurse. Amazon / Microsoft.

### Question 82: Explain greedy vs DP with an example.
**Answer:** Jump game II greedy; coin change DP when greedy fails. Amazon.

### Question 83: How do you do matrix BFS (rotting oranges)?
**Answer:** Multi-source queue of all rotten, minutes = levels. Amazon.

### Question 84: What is a monotonic deque vs stack?
**Answer:** Deque: both ends for window max. Stack: next greater. Amazon / Google.

### Question 85: How do you count inversions?
**Answer:** Merge sort count. Occasional. Adobe / Google.

### Question 86: Explain 2-sum variants in one breath.
**Answer:** Hash for unsorted, two pointers if sorted, 3-sum sort+two pointers. All screens.

### Question 87: How do you find the longest palindromic substring approach?
**Answer:** Expand around center O(n^2) is enough; Manacher is extra. Amazon / Microsoft.

### Question 88: What is topological order used for in build systems?
**Answer:** Jobs with dependencies — same as course schedule. Uber / Microsoft.

### Question 89: How do you random-pick an index with given weights?
**Answer:** Prefix sums + binary search (LC 528). Google / Meta.

### Question 90: Explain flood fill vs islands.
**Answer:** Same DFS/BFS; flood fill is one component recolor. Amazon.

### Question 91: When is recursion a no-hire?
**Answer:** No base case, O(n) stack on a linked list when you could iterate. Amazon.

### Question 92: How do you reverse a linked list in groups of K?
**Answer:** Count, reverse pointers, recurse/iterate rest. Amazon hard-medium.

### Question 93: What is a window + freq map pattern?
**Answer:** Anagrams, min window substring. Meta / Amazon.

### Question 94: How do you explain time complexity of quicksort worst case?
**Answer:** Already sorted + bad pivot = n^2; randomize or median-of-three. Microsoft.

### Question 95: Design Twitter (LC 355) structures.
**Answer:** User→tweets, follow map, merge K latest. Meta / Amazon design-LC.

### Question 96: How do you find a duplicate and missing number?
**Answer:** Xor or sum vs expected, or index mark. Microsoft.

### Question 97: Explain BFS shortest path on a grid with obstacles.
**Answer:** Queue, visited, sometimes 0-1 BFS if two edge weights. Uber / Google.

### Question 98: What is a greedy interval schedule?
**Answer:** Sort by end, pick non-overlapping. Meeting rooms contrast. Amazon / Uber.

### Question 99: How do you test your solution in 2 minutes?
**Answer:** Empty, one, duplicates, already sorted, max n. All.

### Question 100: What follow-up do you always offer?
**Answer:** Stream, disk-too-big, concurrent callers. Google L5. PDF #20.
