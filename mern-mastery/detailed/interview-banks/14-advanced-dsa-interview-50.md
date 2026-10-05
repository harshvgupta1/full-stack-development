# Advanced Data Structures and Algorithms Interview — 50 Questions

This bank covers hard LeetCode patterns, advanced dynamic programming, and graph algorithms for senior software engineering interviews at product companies. Spell out abbreviations on first use.

## 1. What is dynamic programming (DP)?

Dynamic Programming (DP) is an optimization technique that solves complex problems by breaking them into overlapping subproblems and storing results to avoid recomputation. It applies when a problem has optimal substructure (optimal solution built from optimal sub-solutions) and overlapping subproblems. Reduces exponential brute force to polynomial time. Classic examples: Fibonacci, knapsack, longest common subsequence.

## 2. How do you identify a dynamic programming problem?

Look for: (1) optimization (minimum, maximum, count ways), (2) choices at each step affecting future steps, (3) recursive structure with repeated subproblems. Ask: "Can I define a recurrence relation?" and "Do subproblems repeat?" If yes to both, try Dynamic Programming. Keywords: "minimum cost," "maximum profit," "number of ways," "longest/shortest."

## 3. What is the difference between memoization and tabulation?

Memoization (top-down): start with recursive solution, cache results in a hash map or array as you compute—lazy, only computes needed subproblems. Tabulation (bottom-up): fill a table iteratively from base cases up—no recursion stack, often better space optimization. Both achieve the same time complexity. Prefer memoization for intuitive thinking; tabulation for space-optimized solutions.

## 4. Explain the 0/1 knapsack problem?

Given items with weights and values, and a knapsack capacity, maximize total value without exceeding capacity. Each item can be taken at most once (0 or 1). Recurrence: `dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])` if weight[i] ≤ w. Time: O(n × capacity). Space optimize to O(capacity) using 1D array iterated backwards. Foundation for resource allocation problems.

## 5. Explain the unbounded knapsack problem?

Same as 0/1 knapsack but each item can be used unlimited times. Recurrence: `dp[w] = max(dp[w], dp[w-weight[i]] + value[i])` for all items. Iterate forward (not backward) when space-optimized. Classic application: coin change (minimum coins to make amount), rod cutting. Differs from 0/1 only in the inner loop direction for space optimization.

## 6. What is the longest common subsequence (LCS)?

Given two strings, find the longest subsequence (characters in order, not necessarily contiguous) common to both. Recurrence: if chars match, `dp[i][j] = dp[i-1][j-1] + 1`; else `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`. Time: O(m × n). Used in diff tools, bioinformatics (DNA alignment), and as building block for edit distance and shortest common supersequence.

## 7. What is the longest increasing subsequence (LIS)?

Find the longest subsequence where elements are strictly increasing. O(n²) Dynamic Programming: `dp[i] = max(dp[j] + 1)` for all j < i where nums[j] < nums[i]. Optimized O(n log n) using patience sorting with binary search—maintain array of smallest tail values for each length. LeetCode 300. Important for box nesting and Russian doll envelopes.

## 8. Explain edit distance (Levenshtein distance)?

Minimum number of operations (insert, delete, replace) to transform string A into string B. Recurrence: if chars match, `dp[i][j] = dp[i-1][j-1]`; else `dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])`. Time: O(m × n). Used in spell checkers, DNA analysis, and fuzzy matching. LeetCode 72.

## 9. What is matrix chain multiplication?

Given matrices with dimensions, find the optimal parenthesization to minimize scalar multiplications. `dp[i][j] = min(dp[i][k] + dp[k+1][j] + cost)` for all k between i and j. Interval Dynamic Programming pattern—iterate by length of interval. Time: O(n³). Teaches interval DP thinking applicable to burst balloons, palindrome partitioning.

## 10. What is interval dynamic programming?

Interval DP solves problems on ranges [i, j] by combining solutions of smaller sub-intervals. Pattern: iterate by interval length, for each interval try all split points. Examples: matrix chain multiplication, burst balloons (LeetCode 312), palindrome partitioning, strange printer. Key insight: answer for [i, j] depends on answers for [i, k] and [k+1, j].

## 11. Explain the coin change problem?

Given coin denominations and a target amount, find minimum coins needed (or count ways). Minimum coins (unbounded knapsack): `dp[a] = min(dp[a], dp[a-coin] + 1)`. Count ways: `dp[a] += dp[a-coin]`. Handle impossible case (return -1). LeetCode 322 and 518. Watch for Integer Overflow and use long if needed for large counts.

## 12. What is bitmask dynamic programming?

Bitmask DP uses an integer bitmask to represent a subset of elements (bit i set = element i included). State: `dp[mask][i]` = best value using subset `mask` ending at i. Used for Traveling Salesperson Problem, assignment problems, and subset enumeration. Requires n ≤ 20 typically (2^20 ≈ 1 million states). Iterate masks in increasing order of set bits.

## 13. Explain the Traveling Salesperson Problem (TSP) with DP?

Visit every city exactly once, return to start, minimize total distance. Bitmask DP: `dp[mask][i]` = min cost to visit cities in `mask`, ending at city i. Transition: try all previous cities j in mask. Time: O(n² × 2^n). Exact solution for small n (n ≤ 15). NP-hard—no polynomial exact algorithm known. Held-Karp algorithm.

## 14. What is tree dynamic programming?

Tree DP computes optimal values on trees, typically with post-order traversal (process children before parent). State defined per node: `dp[node]` = best value for subtree rooted at node. Examples: house robber III (LeetCode 337), binary tree maximum path sum (LeetCode 124), tree diameter. Key: combine results from left and right children at each node.

## 15. Explain the house robber on a binary tree?

Each node has a value; cannot rob adjacent nodes (parent and child). For each node, return pair (rob_this, skip_this). `rob = node.val + left.skip + right.skip`; `skip = max(left.rob, left.skip) + max(right.rob, right.skip)`. Post-order traversal. LeetCode 337. Extends linear house robber to tree structure.

## 16. What is digit dynamic programming?

Digit DP solves counting problems over number ranges by processing digits position by position with constraints. State: (position, tight, leading_zeros, other_flags). "Tight" means current prefix equals the number prefix—limits next digit choices. Examples: count numbers with digit sum = K, numbers without consecutive 1s in binary. Common in competitive programming and hard LeetCode.

## 17. What is the difference between graphs and trees for algorithms?

A tree is a connected acyclic graph with n nodes and n-1 edges, having exactly one path between any two nodes. Graphs may have cycles, multiple paths, and disconnected components. Trees enable simpler algorithms (no cycle detection needed). Graphs require visited tracking and handle more complex structures. Many tree problems extend to graphs with cycle handling.

## 18. Explain Dijkstra's algorithm?

Dijkstra finds shortest paths from a source to all nodes in a weighted graph with non-negative edges. Uses a min-priority queue: extract closest unvisited node, relax its neighbors. Time: O((V + E) log V) with binary heap. Does not work with negative edges (use Bellman-Ford). LeetCode applications: network delay time, cheapest flights within K stops.

## 19. Explain Bellman-Ford algorithm?

Bellman-Ford finds shortest paths allowing negative edge weights. Relax all edges V-1 times; V-th iteration detects negative cycles. Time: O(V × E). Slower than Dijkstra but handles negative weights. Used in currency arbitrage detection and difference constraints. LeetCode: cheapest flights with at most K stops (modified Bellman-Ford).

## 20. What is Floyd-Warshall algorithm?

Floyd-Warshall computes all-pairs shortest paths in O(V³). DP recurrence: `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])` for each intermediate k. Works with negative edges (no negative cycles). Simple to implement—three nested loops. Used when you need distances between all pairs, not just single source.

## 21. Explain topological sort?

Topological sort orders nodes in a Directed Acyclic Graph (DAG) such that for every edge u→v, u comes before v. Algorithms: Kahn's (BFS with in-degree counting) or DFS-based (post-order reverse). Detects cycles (if sort includes fewer than V nodes). Applications: course schedule, build order, task scheduling with dependencies. LeetCode 207, 210.

## 22. What is Union-Find (Disjoint Set Union)?

Union-Find maintains a partition of elements into disjoint sets with near-constant time union and find operations. Uses parent array and rank/size optimization with path compression. Applications: detect cycles in undirected graphs, count connected components, Kruskal's minimum spanning tree. Template problem: number of provinces, redundant connection.

## 23. Explain Kruskal's minimum spanning tree algorithm?

Kruskal finds Minimum Spanning Tree (MST)—connects all nodes with minimum total edge weight. Sort edges by weight; add each edge if it does not create a cycle (Union-Find check). Time: O(E log E). Works well for sparse graphs. Compare with Prim's for dense graphs. LeetCode: connecting cities with minimum cost.

## 24. Explain Prim's minimum spanning tree algorithm?

Prim builds MST by growing from a start node: maintain min-heap of edges from visited set to unvisited. Extract minimum edge, add node, push new edges. Time: O(E log V) with binary heap. Better for dense graphs. Both Kruskal and Prim produce same MST weight; choice depends on graph density and implementation convenience.

## 25. What is a strongly connected component (SCC)?

In a directed graph, an SCC is a maximal set of nodes where every node is reachable from every other node. A directed graph decomposes into SCCs forming a DAG (Directed Acyclic Graph) of components. Applications: social network analysis, compiler optimization (variable dependency), 2-SAT problem. Find with Kosaraju's or Tarjan's algorithm.

## 26. Explain Kosaraju's algorithm for SCC?

Two-pass Depth-First Search (DFS): (1) DFS on original graph, push nodes to stack on finish. (2) DFS on transposed graph (reverse all edges), pop from stack—each DFS tree is one SCC. Time: O(V + E). Intuitive but requires graph transposition. Tarjan's algorithm achieves same result in one pass.

## 27. What is bipartite graph checking?

A graph is bipartite if nodes can be colored with two colors such that no adjacent nodes share a color. Check using BFS (Breadth-First Search) or DFS coloring: alternate colors; if conflict found, not bipartite. Equivalent: no odd-length cycles. Applications: matching problems, conflict-free scheduling. LeetCode 785. Also detect using Union-Find with parity.

## 28. Explain the A* search algorithm?

A* finds shortest path using heuristic function: f(n) = g(n) + h(n), where g is cost from start, h is estimated cost to goal. With admissible heuristic (never overestimates), A* is optimal. Used in game pathfinding, GPS navigation, puzzle solving. More efficient than Dijkstra when good heuristic available. LeetCode: shortest path in grid with obstacles (BFS is simpler alternative).

## 29. What is backtracking?

Backtracking builds solutions incrementally and abandons partial solutions that cannot lead to valid complete solutions ("prune" the search tree). Template: choose → explore → unchoose. Examples: N-Queens, Sudoku, permutations, combinations, subset generation. Time often exponential but pruning makes it practical. Key: recognize when to undo the last choice.

## 30. Explain the N-Queens problem?

Place N queens on an N×N chessboard so no two queens attack each other (same row, column, or diagonal). Backtracking: place queen row by row, check column and diagonal conflicts using sets, recurse to next row, backtrack if stuck. Count or return all solutions. LeetCode 51/52. Optimize diagonal tracking with `row+col` and `row-col` keys.

## 31. What is sliding window technique?

Sliding window maintains a window [left, right] over an array/string, expanding right and shrinking left based on constraints. Fixed window: size K subarray maximum. Variable window: longest substring without repeating characters. Time: O(n)—each element enters and exits once. One of the most common patterns in medium LeetCode problems.

## 32. What is two pointers technique?

Two pointers use two indices moving through a structure, often from opposite ends or at different speeds. Patterns: opposite ends (sorted array two sum), same direction (remove duplicates, linked list cycle), fast/slow (cycle detection, find middle). Reduces O(n²) brute force to O(n). Works on sorted arrays, linked lists, and strings.

## 33. Explain monotonic stack?

Monotonic stack maintains elements in sorted order (increasing or decreasing). Used to find next greater/smaller element for each position in O(n). Push elements; pop when top violates monotonic property. Applications: largest rectangle in histogram, daily temperatures, trapping rain water. LeetCode 496, 739, 84. One of the highest-yield patterns for hard problems.

## 34. Explain monotonic queue/deque?

Monotonic deque maintains min/max in a sliding window in O(n). Deque stores indices in decreasing (for max) or increasing (for min) value order. Remove expired front element when window slides. Applications: sliding window maximum (LeetCode 239), constrained subsequence sum. Combines sliding window with deque efficiency.

## 35. What is trie (prefix tree)?

A trie is a tree where each node represents a character; paths from root to nodes represent strings. Enables O(L) insert/search/prefix check where L is word length. Used for autocomplete, spell checking, word search, and prefix matching. Space-heavy but fast for string collections. LeetCode 208 (implement trie), 212 (word search II).

## 36. What is segment tree?

Segment tree is a binary tree for range queries (sum, min, max) with O(log n) query and update. Each node covers a range; children cover halves. Build: O(n); query/update: O(log n). Used when you need both range queries and point/range updates. Heavier than prefix sums but supports updates. Lazy propagation handles range updates efficiently.

## 37. What is binary indexed tree (Fenwick tree)?

Fenwick tree (Binary Indexed Tree—BIT) supports prefix sum query and point update in O(log n) with simpler code than segment tree. Uses array where index i stores sum of range (i - lowbit(i), i]. Less memory than segment tree. Cannot do arbitrary range queries as easily. Good for competitive programming and inversion count problems.

## 38. Explain the word break problem?

Given a string and dictionary, determine if string can be segmented into dictionary words. DP: `dp[i] = true` if `dp[j]` is true and s[j:i] is in dictionary, for any j < i. Time: O(n² × m) where m is word check time (use hash set for O(1) lookup). LeetCode 139. Extension: return all possible sentences (backtracking on DP table).

## 39. What is the regular expression matching problem?

Match string s against pattern p with `.` (any char) and `*` (zero or more of preceding element). DP: `dp[i][j]` = does s[0..i) match p[0..j)? Handle `*` by trying zero occurrences or one+ occurrences of preceding char. Time: O(m × n). LeetCode 10—classic hard DP. Wildcard matching (LeetCode 44) uses similar but different `*` semantics.

## 40. Explain maximum flow (Ford-Fulkerson)?

Maximum flow finds the greatest flow from source to sink in a capacity network. Ford-Fulkerson repeatedly finds augmenting paths (BFS → Edmonds-Karp) and pushes flow until no path exists. Max-flow min-cut theorem: maximum flow equals minimum cut capacity. Applications: bipartite matching, network reliability. LeetCode 2699 (hard—transform to flow).

## 41. What is the meeting rooms II problem?

Given meeting intervals, find minimum conference rooms needed. Approach 1: min-heap of end times—sort by start, if earliest ending meeting finished, reuse room. Approach 2: sweep line—sort all start/end events, track concurrent meetings. Time: O(n log n). LeetCode 253. Tests priority queue and interval processing skills.

## 42. Explain merge intervals?

Given intervals, merge all overlapping ones. Sort by start time; iterate, if current overlaps with last merged, extend end; else add new interval. Time: O(n log n). Foundation for interval scheduling problems. Variants: insert interval, employee free time, interval list intersection. Always sort first for interval problems.

## 43. What is the subarray sum equals K problem?

Count subarrays with sum equal to K. Use prefix sum hash map: for each prefix sum, add count of (prefixSum - K) seen before. Handles negative numbers (sliding window cannot). Time: O(n). LeetCode 560. Important: initialize map with {0: 1} for subarrays starting at index 0. Extension: subarray sum divisible by K.

## 44. Explain binary search on answer?

When answer lies in a range and you can check "is X feasible?" in polynomial time, binary search on the answer space. Examples: minimum capacity to ship packages in D days, koko eating bananas, split array largest sum. Pattern: lo = min possible, hi = max possible, mid = (lo+hi)/2, if feasible hi=mid else lo=mid+1. Turns optimization into decision problem.

## 45. What is the trick for cyclic/rotated array search?

Rotated sorted array has one pivot where order breaks. Modified binary search: identify which half is sorted, check if target lies in sorted half. Time: O(log n). Also: find minimum in rotated sorted array (LeetCode 153). Key insight: at least one half is always sorted in a rotated array.

## 46. How do you approach hard graph problems in interviews?

Steps: (1) Clarify directed/undirected, weighted/unweighted, cycles. (2) Choose representation (adjacency list for sparse). (3) Pick algorithm: BFS (unweighted shortest path), Dijkstra (non-negative weights), DFS (connectivity, cycles), Union-Find (dynamic connectivity), topological sort (dependencies). (4) Handle edge cases: disconnected, self-loops, empty graph. (5) State time/space complexity.

## 47. What is space optimization for 2D DP?

When `dp[i][j]` depends only on row i-1, use two 1D arrays or a single array updated in reverse (0/1 knapsack). For LCS-style, keep two rows alternating. Reduces O(m × n) space to O(min(m, n)). Mention this optimization after coding the 2D solution—shows advanced understanding without complicating initial code.

## 48. How do you practice advanced Data Structures and Algorithms (DSA)?

Focus on patterns, not problem count: 2-3 problems per pattern (DP, graphs, backtracking, binary search on answer). Use LeetCode curated lists and tag filters. After solving, study editorial for alternative approaches. Time yourself (45 min for medium, 60 for hard). Redo failed problems after 1 week. Mock interviews on Pramp or Interviewing.io.

## 49. What is the difference between Breadth-First Search and Depth-First Search on graphs?

BFS explores level by level using a queue—finds shortest path in unweighted graphs, O(V + E). DFS explores as deep as possible using recursion/stack—detects cycles, topological sort, connected components, O(V + E). Choose BFS for shortest path; DFS for exhaustive search, backtracking, and tree-like traversal. BFS uses O(V) queue space; DFS uses O(V) recursion stack.

## 50. Summarize advanced DSA interview checklist?

Master: DP patterns (knapsack, LCS, interval, bitmask, tree), graph algorithms (Dijkstra, topological sort, Union-Find, SCC), and techniques (sliding window, monotonic stack, binary search on answer, trie). For hard problems: clarify constraints, start with brute force, optimize with pattern recognition, code cleanly, test edge cases, state complexity. Communicate thought process throughout.
