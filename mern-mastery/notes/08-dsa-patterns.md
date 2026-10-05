# DSA Patterns — Complete Notes

---

## How to practice DSA

1. **Pattern-first** — learn pattern, then 3–5 problems per pattern
2. **Timed** — 25 min easy, 35 min medium, 45 min hard
3. **Explain aloud** — approach, complexity, edge cases
4. **Track on LeetCode** — goal: 200+ mediums by Month 6

**Platform:** [leetcode.com](https://leetcode.com) (primary) | [neetcode.io](https://neetcode.io) (roadmap)

---

## Pattern 1: Two Pointers

**When:** Sorted array, pairs, palindrome, remove duplicates

```javascript
// Two sum in sorted array
function twoSum(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
}
```

**Problems:** Two Sum II, 3Sum, Container With Most Water, Valid Palindrome

---

## Pattern 2: Sliding Window

**When:** Subarray/substring with constraint (sum, unique chars)

```javascript
function maxSubarraySum(arr, k) {
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

**Problems:** Max Subarray, Longest Substring Without Repeating, Minimum Window Substring

---

## Pattern 3: Hash Map / Set

**When:** O(1) lookup, frequency count, duplicates

```javascript
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
}
```

**Problems:** Two Sum, Group Anagrams, Top K Frequent, Longest Consecutive

---

## Pattern 4: Binary Search

**When:** Sorted data, find boundary, search space reduction

```javascript
function binarySearch(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
```

**Problems:** Search Insert Position, Find Minimum in Rotated Array, Koko Eating Bananas

---

## Pattern 5: BFS & DFS (Trees & Graphs)

```javascript
// BFS — level order, shortest path
function bfs(root) {
  const queue = [root], result = [];
  while (queue.length) {
    const node = queue.shift();
    result.push(node.val);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return result;
}

// DFS — inorder, paths, backtracking
function dfs(node) {
  if (!node) return;
  dfs(node.left);
  console.log(node.val);
  dfs(node.right);
}
```

**Problems:** Level Order Traversal, Max Depth, Number of Islands, Clone Graph

---

## Pattern 6: Dynamic Programming

**When:** Optimal substructure + overlapping subproblems

```javascript
// 1D DP — Climbing Stairs
function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

// 0/1 Knapsack template
function knapsack(weights, values, capacity) {
  const dp = Array(capacity + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    for (let w = capacity; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }
  return dp[capacity];
}
```

**Problems:** Climbing Stairs, House Robber, Coin Change, LCS, Edit Distance

---

## Pattern 7: Heap / Priority Queue

**When:** Top K, merge K sorted, median stream

```javascript
// Use MinHeap for top K largest (keep size K, remove smallest)
// LeetCode — use library or implement simple heap
```

**Problems:** Kth Largest Element, Merge K Sorted Lists, Find Median from Data Stream

---

## Pattern 8: Stack & Queue

**Problems:** Valid Parentheses, Daily Temperatures, Largest Rectangle in Histogram

---

## Complexity Cheat Sheet

| Structure | Access | Search | Insert | Delete |
|-----------|--------|--------|--------|--------|
| Array | O(1) | O(n) | O(n) | O(n) |
| Hash Map | — | O(1)* | O(1)* | O(1)* |
| BST | O(log n) | O(log n) | O(log n) | O(log n) |
| Heap | — | O(n) | O(log n) | O(log n) |

*Average case

---

## Interview script (use every problem)

1. **Clarify** — input size, edge cases, duplicates?
2. **Brute force** — state O(n²) solution
3. **Optimize** — which pattern applies?
4. **Code** — clean, with meaningful names
5. **Test** — walk through example + edge case
6. **Complexity** — time and space
