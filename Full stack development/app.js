/**
 * MERN Mastery LMS — 1 CR Product-Company Edition
 * Interactive Controller & Reactive State Manager
 */

(function () {
  'use strict';

  // Fallback if LMS_DATA is not yet loaded
  const data = window.LMS_DATA || {
    metadata: {},
    days: [],
    loopholes: [],
    interviewBanks: [],
    threeYoe: null,
    theories: [],
    exercises: []
  };

  // State
  const state = {
    currentView: 'dashboard', // 'dashboard', 'day', 'systemDesign', 'fde', 'threeYoe', 'theories', 'interviewBanks', 'exercises', 'theoryDetail'
    currentDay: 1,
    currentTab: 'overview',
    currentTheoryId: null,
    currentBankId: 'mern-mean-3yoe',
    bankSortMode: 'topic', // 'topic', 'number', 'alpha'
    bankTopicFilter: 'all',
    threeYoeSortMode: 'topic', // 'topic', 'number', 'alpha'
    threeYoeTopicFilter: 'all',
    threeYoeSearchQuery: '',
    currentFdeTab: 'blueprint',
    currentFdeLab: 1,
    fdeQuesFilter: '',
    fdeCategoryFilter: 'all',
    completedDays: JSON.parse(localStorage.getItem('mern_completed_days') || '[]'),
    bookmarkedQuestions: JSON.parse(localStorage.getItem('mern_bookmarked_qs') || '[]'),
    checkedChecklistItems: JSON.parse(localStorage.getItem('mern_checked_items') || '{}'),
    theme: localStorage.getItem('mern_theme') || 'light',
    sidebarFilter: '',
    openWeeks: { 'Week 1 of 26': true }
  };

  // Preset snippets for Playground
  const PLAYGROUND_PRESETS = {
    promiseAll: `// 3 YOE Machine Coding: Promise.all Polyfill
function promiseAllPolyfill(promises) {
  return new Promise((resolve, reject) => {
    if (!promises || typeof promises[Symbol.iterator] !== 'function') {
      return reject(new TypeError('Argument must be iterable'));
    }
    const items = Array.from(promises);
    if (items.length === 0) return resolve([]);
    const results = new Array(items.length);
    let completed = 0;

    items.forEach((p, idx) => {
      Promise.resolve(p).then(val => {
        results[idx] = val;
        completed++;
        if (completed === items.length) resolve(results);
      }, err => reject(err));
    });
  });
}

// Test Promise.all polyfill
const p1 = Promise.resolve(42);
const p2 = new Promise(res => setTimeout(() => res('Resolved in 80ms'), 80));
const p3 = Promise.resolve('Immediate Success');

promiseAllPolyfill([p1, p2, p3]).then(res => {
  console.log('✅ Promise.all Polyfill Result:', res);
});`,

    lruCache: `// 3 YOE Machine Coding: In-Memory LRU Cache with O(1) Operations
class LRUNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = new LRUNode(null, null);
    this.tail = new LRUNode(null, null);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _add(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._remove(node);
    this._add(node);
    return node.value;
  }

  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.value = value;
      this._remove(node);
      this._add(node);
    } else {
      if (this.map.size >= this.capacity) {
        const lru = this.tail.prev;
        this._remove(lru);
        this.map.delete(lru.key);
      }
      const newNode = new LRUNode(key, value);
      this.map.set(key, newNode);
      this._add(newNode);
    }
  }
}

const cache = new LRUCache(2);
cache.put(1, 'User_A');
cache.put(2, 'User_B');
console.log('Get 1:', cache.get(1)); // returns 'User_A'
cache.put(3, 'User_C'); // evicts key 2!
console.log('Get 2 (Evicted):', cache.get(2)); // returns -1
console.log('Get 3:', cache.get(3)); // returns 'User_C'`,

    debounce: `// 3 YOE Machine Coding: Debounce with Immediate & Cancel
function debounce(fn, wait, options = { immediate: false }) {
  let timerId = null;
  let lastArgs = null;
  let lastThis = null;

  function debounced(...args) {
    lastArgs = args;
    lastThis = this;
    const callNow = options.immediate && !timerId;

    if (timerId) clearTimeout(timerId);

    timerId = setTimeout(() => {
      timerId = null;
      if (!options.immediate) fn.apply(lastThis, lastArgs);
    }, wait);

    if (callNow) fn.apply(lastThis, lastArgs);
  }

  debounced.cancel = () => {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
  };

  return debounced;
}

const logSearch = debounce((query) => {
  console.log("API Search Query:", query);
}, 300);

logSearch("re");
logSearch("rea");
logSearch("react"); // Only 'react' executes after 300ms!`,

    deepClone: `// 3 YOE: Deep Clone with Circular Reference Support
function deepClone(value, hash = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (hash.has(value)) return hash.get(value);
  if (value instanceof Date) return new Date(value.getTime());
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);

  const cloneObj = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));
  hash.set(value, cloneObj);

  Reflect.ownKeys(value).forEach(key => {
    cloneObj[key] = deepClone(value[key], hash);
  });
  return cloneObj;
}

const original = { a: 1, date: new Date(), list: [1, 2, { nested: true }] };
original.self = original; // Circular reference
const cloned = deepClone(original);
console.log('✅ Deep clone handled circular ref:', cloned.a === 1 && cloned.self === cloned);`,

    promiseRetry: `// 3 YOE: Promise.retry with Exponential Backoff & Jitter
async function promiseRetry(fn, retries = 3, baseDelay = 200, maxDelay = 2000) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt > retries) throw error;
      const expDelay = Math.min(maxDelay, baseDelay * Math.pow(2, attempt - 1));
      const jitter = Math.floor(Math.random() * expDelay);
      console.log(\`⚠️ Attempt \${attempt} failed. Retrying in \${jitter}ms...\`);
      await new Promise(r => setTimeout(r, jitter));
    }
  }
}

let count = 0;
const simulateApi = async () => {
  count++;
  if (count < 3) throw new Error('503 Service Unavailable');
  return '200 OK: Data Fetched!';
};

promiseRetry(simulateApi).then(console.log);`,

    v8Shapes: `// Benchmark: V8 Hidden Classes & Shape Transition
function PointA(x, y) { this.x = x; this.y = y; }
function PointB(x, y) { this.x = x; this.y = y; }
function PointC(x, y) { this.y = y; this.x = x; } // INVERTED ORDER!

const N = 5000000;
let t0 = performance.now();
let arr1 = [];
for (let i = 0; i < N; i++) arr1.push(new PointA(i, i + 1));
let t1 = performance.now();
console.log("Monomorphic allocation time: " + (t1 - t0).toFixed(2) + "ms");

let t2 = performance.now();
let arr2 = [];
for (let i = 0; i < N; i++) {
  if (i % 2 === 0) arr2.push(new PointB(i, i + 1));
  else arr2.push(new PointC(i, i + 1));
}
let t3 = performance.now();
console.log("Megamorphic shape mismatch time: " + (t3 - t2).toFixed(2) + "ms (Notice the slowdown!)");`,

    eventLoop: `// Microtask Queue Priority vs Macrotasks
console.log("1. Synchronous script start");

setTimeout(() => {
  console.log("4. Macrotask (setTimeout 0ms)");
}, 0);

Promise.resolve().then(() => {
  console.log("2. Microtask 1 (Promise)");
}).then(() => {
  console.log("3. Microtask 2 (Promise chain executes BEFORE setTimeout!)");
});

console.log("5. Synchronous script end");`,

    closures: `// Closure State Encapsulation
function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private state
  return {
    deposit(amount) {
      balance += amount;
      return "Deposited: ₹" + amount + " | New Balance: ₹" + balance;
    },
    withdraw(amount) {
      if (amount > balance) return "Insufficient funds!";
      balance -= amount;
      return "Withdrew: ₹" + amount + " | New Balance: ₹" + balance;
    },
    getBalance() {
      return "Current Balance: ₹" + balance;
    }
  };
}

const account = createBankAccount(1000);
console.log(account.deposit(500));
console.log(account.withdraw(300));
console.log(account.getBalance());`,

    twoSum: `// LeetCode 1: Two Sum with O(N) Hash Map
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

const result = twoSum([2, 7, 11, 15], 9);
console.log("Two Sum indices for target 9 in [2, 7, 11, 15]:", result);`
  };

  // DOM Elements
  const elements = {
    appContainer: document.getElementById('appContainer'),
    appSidebar: document.getElementById('appSidebar'),
    menuToggleBtn: document.getElementById('menuToggleBtn'),
    brandHomeBtn: document.getElementById('brandHomeBtn'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    themeIcon: document.getElementById('themeIcon'),
    printPdfBtn: document.getElementById('printPdfBtn'),
    togglePlaygroundBtn: document.getElementById('togglePlaygroundBtn'),
    playgroundDrawer: document.getElementById('playgroundDrawer'),
    closePlaygroundBtn: document.getElementById('closePlaygroundBtn'),
    playgroundCodeInput: document.getElementById('playgroundCodeInput'),
    playgroundPresetSelect: document.getElementById('playgroundPresetSelect'),
    runCodeBtn: document.getElementById('runCodeBtn'),
    clearConsoleBtn: document.getElementById('clearConsoleBtn'),
    consoleOutputArea: document.getElementById('consoleOutputArea'),
    searchTriggerBtn: document.getElementById('searchTriggerBtn'),
    searchModalOverlay: document.getElementById('searchModalOverlay'),
    globalSearchInput: document.getElementById('globalSearchInput'),
    searchResultsList: document.getElementById('searchResultsList'),
    closeSearchModalBtn: document.getElementById('closeSearchModalBtn'),
    sidebarFilterInput: document.getElementById('sidebarFilterInput'),
    sidebarCurriculumTree: document.getElementById('sidebarCurriculumTree'),
    sidebarProgressBadge: document.getElementById('sidebarProgressBadge'),
    overallProgressFill: document.getElementById('overallProgressFill'),
    overallPercentText: document.getElementById('overallPercentText'),
    mainContentInner: document.getElementById('mainContentInner'),
    navDashboardBtn: document.getElementById('navDashboardBtn'),
    nav3YoeBtn: document.getElementById('nav3YoeBtn'),
    navSystemDesignBtn: document.getElementById('navSystemDesignBtn'),
    navFdeBtn: document.getElementById('navFdeBtn'),
    navTheoryBtn: document.getElementById('navTheoryBtn'),
    navBanksBtn: document.getElementById('navBanksBtn'),
    navExercisesBtn: document.getElementById('navExercisesBtn')
  };

  // Helper: Save completed days
  function saveCompletedDays() {
    localStorage.setItem('mern_completed_days', JSON.stringify(state.completedDays));
    updateProgressUI();
  }

  function toggleDayComplete(dayNum) {
    const idx = state.completedDays.indexOf(dayNum);
    if (idx >= 0) {
      state.completedDays.splice(idx, 1);
    } else {
      state.completedDays.push(dayNum);
    }
    saveCompletedDays();
    renderSidebar();
    if (state.currentView === 'day' && state.currentDay === dayNum) {
      renderDayView(dayNum);
    }
  }

  function updateProgressUI() {
    const total = data.days.length || 182;
    const completed = state.completedDays.length;
    const pct = Math.round((completed / total) * 100);

    if (elements.sidebarProgressBadge) {
      elements.sidebarProgressBadge.textContent = `${completed}/${total}`;
    }
    if (elements.overallProgressFill) {
      elements.overallProgressFill.style.width = `${pct}%`;
    }
    if (elements.overallPercentText) {
      elements.overallPercentText.textContent = `${pct}%`;
    }
  }

  // Configure Marked if present
  if (window.marked) {
    marked.setOptions({
      breaks: true,
      gfm: true
    });
  }

  function renderMarkdown(md) {
    if (!md) return '';
    if (window.marked) {
      return marked.parse(md);
    }
    // Fallback basic parser
    return md
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
      .replace(/\n/gim, '<br>');
  }

  const TOPIC_METADATA = {
    'Machine Coding': { icon: '💻', name: 'Machine Coding & Polyfills (Debounce, Throttle, LRU, DeepClone, Promise.all)' },
    'React': { icon: '⚛️', name: 'React.js (Fiber, Concurrent Mode, Hooks, RSC, Reconciliation)' },
    'Redux': { icon: '🔄', name: 'Redux & State Management (RTK, RTK Query, Immer, Middleware, Zustand)' },
    'Angular': { icon: '🅰️', name: 'Angular / MEAN Stack (OnPush, Signals, RxJS, DI, Interceptors)' },
    'Node.js': { icon: '🟢', name: 'Node.js & Express (libuv Event Loop, Streams Backpressure, Cluster)' },
    'MongoDB': { icon: '🍃', name: 'MongoDB & Mongoose (ESR Indexing, Aggregations, ACID Transactions)' },
    'SQL': { icon: '🐘', name: 'SQL & Relational Databases (ACID, MVCC, Locks, Double-Spend, B+ Trees)' },
    'APIs': { icon: '⚡', name: 'API Architecture, GraphQL, WebSockets, Security & Auth' },
    'System Design': { icon: '🏗️', name: 'System Design & LLD Scenarios (Flash Sale, Cache Stampede, S3 Uploads)' }
  };

  function triggerPrintDocument(htmlDoc, title = 'Interview-Questions-Answers') {
    const printWin = window.open('', '_blank', 'width=1020,height=900');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(htmlDoc);
      printWin.document.close();
      setTimeout(() => {
        try {
          printWin.focus();
          printWin.print();
        } catch (e) {
          console.error('Print trigger error:', e);
        }
      }, 500);
    } else {
      // Fallback: Invisible iframe if popups are blocked
      let iframe = document.getElementById('pdfPrintIframe');
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'pdfPrintIframe';
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);
      }
      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(htmlDoc);
      doc.close();
      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch (e) {
          console.error('Iframe print trigger error:', e);
        }
      }, 500);
    }
  }

  function downloadSingleQuestionAsPdf(q) {
    if (!q) return;
    const docTitle = `Q${q.num} - ${(q.question || 'Interview Question').slice(0, 45)} (PDF Edition)`;
    const tag = q.topicTag || q.topic || 'Full-Stack';
    const exportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${docTitle}</title>
  <style>
    @page { size: A4 portrait; margin: 14mm 12mm 14mm 12mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff; color: #0f172a; margin: 0; padding: 0; font-size: 10.5pt; line-height: 1.6; }
    .no-print { display: block; }
    @media print { .no-print { display: none !important; } body { padding: 0 !important; } }
    .print-toolbar { position: sticky; top: 0; background: #0f172a; color: #ffffff; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000; margin-bottom: 24px; }
    .print-btn { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; border: none; padding: 8px 18px; border-radius: 6px; font-weight: 700; font-size: 14px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
    .container { max-width: 860px; margin: 0 auto; padding: 0 16px 40px; }
    .hero-banner { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; border-radius: 10px; padding: 18px 24px; margin-bottom: 20px; border: 1px solid #334155; }
    .badge-pill { display: inline-block; padding: 3px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-right: 6px; }
    .badge-green { background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid rgba(16,185,129,0.4); }
    .badge-blue { background: rgba(56,189,248,0.2); color: #38bdf8; border: 1px solid rgba(56,189,248,0.4); }
    .q-card { break-inside: avoid; page-break-inside: avoid; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 20px 22px; margin-bottom: 16px; }
    .q-header { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; }
    .q-badge { background: #2563eb; color: #ffffff; font-weight: 800; font-size: 12px; padding: 3px 9px; border-radius: 4px; flex-shrink: 0; margin-top: 1px; }
    .q-topic-tag { font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 4px; background: #e2e8f0; color: #334155; margin-right: 6px; }
    .q-title { font-size: 15px; font-weight: 700; color: #0f172a; line-height: 1.4; flex: 1; }
    .q-answer { font-size: 10.5pt; color: #1e293b; line-height: 1.65; }
    .q-answer p { margin: 8px 0; }
    .q-answer strong { color: #0f172a; font-weight: 700; }
    .q-answer ul, .q-answer ol { margin: 6px 0 6px 20px; padding: 0; }
    .q-answer li { margin-bottom: 4px; }
    .q-answer pre { background: #0f172a !important; color: #f8fafc !important; padding: 12px 16px !important; border-radius: 6px !important; font-family: 'Fira Code', 'Courier New', monospace !important; font-size: 9pt !important; line-height: 1.45 !important; overflow-wrap: break-word !important; white-space: pre-wrap !important; margin: 10px 0 !important; break-inside: avoid; page-break-inside: avoid; }
    .q-answer code { font-family: 'Fira Code', 'Courier New', monospace; font-size: 9.5pt; background: #f1f5f9; color: #0f172a; padding: 2px 5px; border-radius: 4px; border: 1px solid #e2e8f0; }
    .q-answer pre code { background: transparent !important; border: none !important; color: inherit !important; padding: 0 !important; font-size: 9pt !important; }
    .q-answer blockquote { border-left: 3px solid #3b82f6; background: #eff6ff; margin: 10px 0; padding: 8px 14px; border-radius: 0 4px 4px 0; font-size: 10pt; color: #1e40af; }
    .q-answer table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 9.5pt; break-inside: avoid; page-break-inside: avoid; }
    .q-answer th, .q-answer td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
    .q-answer th { background: #f8fafc; font-weight: 700; color: #0f172a; }
  </style>
</head>
<body>
  <div class="print-toolbar no-print">
    <div><strong>📄 MERN Mastery Q&A PDF Exporter</strong> &nbsp;•&nbsp; Q${q.num}: ${(q.question || '').slice(0, 50)}...</div>
    <div style="display: flex; gap: 10px; align-items: center;">
      <button class="print-btn" onclick="window.print()"><span>🖨️ Save as PDF / Print</span></button>
      <button onclick="window.close()" style="background: transparent; color: #cbd5e1; border: 1px solid #475569; padding: 7px 12px; border-radius: 6px; cursor: pointer;">Close</button>
    </div>
  </div>
  <div class="container">
    <div class="hero-banner">
      <div>
        <span class="badge-pill badge-green">🔥 3 YOE SDE-2 Bar</span>
        <span class="badge-pill badge-blue">${tag}</span>
      </div>
      <div style="font-size: 11px; color: #cbd5e1; margin-top: 6px;">MERN Mastery LMS • 1 CR Product Company Bar • Export Date: ${exportDate}</div>
    </div>
    <div class="q-card">
      <div class="q-header">
        <span class="q-badge">Q${q.num}</span>
        <div style="flex: 1;">
          <div style="margin-bottom: 4px;">
            <span class="q-topic-tag">${tag}</span>
            <span style="font-size: 11px; color: #64748b;">${q.topic || ''}</span>
          </div>
          <div class="q-title">${q.question}</div>
        </div>
      </div>
      <div class="q-answer">
        ${renderMarkdown(q.answer || '')}
      </div>
    </div>
  </div>
</body>
</html>`;

    triggerPrintDocument(htmlDoc, docTitle);
  }

  function downloadBankAsPdf(bank, sortMode = 'topic', currentTopicFilter = 'all') {
    if (!bank || !bank.questions) return;

    let questions = [...bank.questions];
    if (currentTopicFilter && currentTopicFilter !== 'all') {
      questions = questions.filter(q => q.topicTag === currentTopicFilter || q.topic === currentTopicFilter);
    }

    const TOPIC_PRIORITY = [
      'Machine Coding', 'React', 'Redux', 'Angular', 'Node.js', 'MongoDB', 'SQL', 'APIs', 'System Design'
    ];

    if (sortMode === 'topic') {
      questions.sort((a, b) => {
        const tagA = a.topicTag || 'General';
        const tagB = b.topicTag || 'General';
        const idxA = TOPIC_PRIORITY.indexOf(tagA);
        const idxB = TOPIC_PRIORITY.indexOf(tagB);
        if (idxA !== -1 && idxB !== -1) {
          if (idxA !== idxB) return idxA - idxB;
          return a.num - b.num;
        }
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return tagA.localeCompare(tagB) || (a.num - b.num);
      });
    } else if (sortMode === 'alpha') {
      questions.sort((a, b) => a.question.localeCompare(b.question));
    } else {
      questions.sort((a, b) => a.num - b.num);
    }

    const exportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const filterLabel = currentTopicFilter !== 'all' ? ` — ${currentTopicFilter}` : '';
    const docTitle = `${bank.title || 'MERN & MEAN Stack Interview Master Bank'}${filterLabel} (PDF Edition)`;

    let questionsHtml = '';
    let activeGroup = '';

    questions.forEach((q) => {
      const group = q.topicTag || q.topic || 'General';
      if (group !== activeGroup && sortMode === 'topic') {
        activeGroup = group;
        const meta = TOPIC_METADATA[activeGroup] || { icon: '📌', name: activeGroup };
        const countInTopic = questions.filter(x => (x.topicTag || x.topic || 'General') === activeGroup).length;
        questionsHtml += `
          <div class="topic-divider">
            <div class="topic-divider-title">${meta.icon} ${meta.name}</div>
            <span class="topic-divider-count">${countInTopic} Questions</span>
          </div>
        `;
      }

      questionsHtml += `
        <div class="q-card" id="q-item-${q.num}">
          <div class="q-header">
            <span class="q-badge">Q${q.num}</span>
            <div style="flex: 1;">
              <div style="margin-bottom: 4px;">
                <span class="q-topic-tag">${q.topicTag || 'General'}</span>
                <span style="font-size: 11px; color: #64748b;">${q.topic || ''}</span>
              </div>
              <div class="q-title">${q.question}</div>
            </div>
          </div>
          <div class="q-answer">
            ${renderMarkdown(q.answer || '')}
          </div>
        </div>
      `;
    });

    const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${docTitle}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 14mm 12mm 14mm 12mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #ffffff;
      color: #0f172a;
      margin: 0;
      padding: 0;
      font-size: 10pt;
      line-height: 1.55;
    }
    .no-print {
      display: block;
    }
    @media print {
      .no-print {
        display: none !important;
      }
      body {
        padding: 0 !important;
      }
    }
    .print-toolbar {
      position: sticky;
      top: 0;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      margin-bottom: 24px;
    }
    .print-btn {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 16px 40px;
    }
    .hero-banner {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
      border-radius: 10px;
      padding: 22px 26px;
      margin-bottom: 22px;
      border: 1px solid #334155;
    }
    .badge-pill {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      margin-right: 6px;
      margin-bottom: 8px;
    }
    .badge-green { background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid rgba(16,185,129,0.4); }
    .badge-blue { background: rgba(56,189,248,0.2); color: #38bdf8; border: 1px solid rgba(56,189,248,0.4); }
    .badge-gold { background: rgba(251,191,36,0.2); color: #fbbf24; border: 1px solid rgba(251,191,36,0.4); }
    .doc-title {
      font-size: 22px;
      font-weight: 800;
      margin: 4px 0 6px;
      color: #ffffff;
      letter-spacing: -0.02em;
    }
    .doc-subtitle {
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.5;
      margin: 0 0 10px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 8px;
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px solid rgba(255,255,255,0.1);
      font-size: 11px;
      color: #cbd5e1;
    }
    .toc-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 24px;
      break-inside: auto;
    }
    .toc-title {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 6px;
    }
    .toc-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 16px;
      font-size: 10.5px;
    }
    .toc-item {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      color: #334155;
      line-height: 1.35;
    }
    .toc-num {
      font-weight: 700;
      color: #2563eb;
      min-width: 32px;
    }
    .topic-divider {
      background: #f1f5f9;
      border-left: 4px solid #2563eb;
      padding: 10px 14px;
      margin: 28px 0 16px;
      border-radius: 0 6px 6px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      break-after: avoid;
      page-break-after: avoid;
    }
    .topic-divider-title {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
    }
    .topic-divider-count {
      font-size: 11px;
      font-weight: 700;
      color: #2563eb;
      background: rgba(37,99,235,0.1);
      padding: 2px 8px;
      border-radius: 4px;
    }
    .q-card {
      break-inside: avoid;
      page-break-inside: avoid;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 16px 18px;
      margin-bottom: 16px;
    }
    .q-header {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 10px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 8px;
    }
    .q-badge {
      background: #2563eb;
      color: #ffffff;
      font-weight: 800;
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 4px;
      flex-shrink: 0;
      margin-top: 1px;
    }
    .q-topic-tag {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 4px;
      background: #e2e8f0;
      color: #334155;
      margin-right: 6px;
    }
    .q-title {
      font-size: 13.5px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.4;
      flex: 1;
    }
    .q-answer {
      font-size: 10pt;
      color: #1e293b;
      line-height: 1.6;
    }
    .q-answer p {
      margin: 6px 0;
    }
    .q-answer strong {
      color: #0f172a;
      font-weight: 700;
    }
    .q-answer ul, .q-answer ol {
      margin: 6px 0 6px 18px;
      padding: 0;
    }
    .q-answer li {
      margin-bottom: 4px;
    }
    .q-answer pre {
      background: #0f172a !important;
      color: #f8fafc !important;
      padding: 10px 14px !important;
      border-radius: 6px !important;
      font-family: 'Fira Code', 'Courier New', monospace !important;
      font-size: 9pt !important;
      line-height: 1.45 !important;
      overflow-wrap: break-word !important;
      white-space: pre-wrap !important;
      margin: 8px 0 !important;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .q-answer code {
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 9.5pt;
      background: #f1f5f9;
      color: #0f172a;
      padding: 2px 4px;
      border-radius: 3px;
      border: 1px solid #e2e8f0;
    }
    .q-answer pre code {
      background: transparent !important;
      border: none !important;
      color: inherit !important;
      padding: 0 !important;
      font-size: 9pt !important;
    }
    .q-answer blockquote {
      border-left: 3px solid #3b82f6;
      background: #eff6ff;
      margin: 8px 0;
      padding: 6px 12px;
      border-radius: 0 4px 4px 0;
      font-size: 9.5pt;
      color: #1e40af;
    }
    .q-answer table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0;
      font-size: 9.5pt;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .q-answer th, .q-answer td {
      border: 1px solid #cbd5e1;
      padding: 6px 8px;
      text-align: left;
    }
    .q-answer th {
      background: #f8fafc;
      font-weight: 700;
      color: #0f172a;
    }
    .q-answer tr:nth-child(even) {
      background: #f8fafc;
    }
  </style>
</head>
<body>
  <div class="print-toolbar no-print">
    <div>
      <strong>📄 MERN & MEAN Stack Interview Master Bank PDF Exporter</strong>
      <span style="font-size: 12px; color: #94a3b8; margin-left: 10px;">${questions.length} Questions (${sortMode === 'topic' ? 'Topic-Wise: Debounce First' : 'Sequential'})</span>
    </div>
    <div style="display: flex; gap: 10px; align-items: center;">
      <button class="print-btn" onclick="window.print()">
        <span>🖨️ Save as PDF / Print</span>
      </button>
      <button onclick="window.close()" style="background: transparent; color: #cbd5e1; border: 1px solid #475569; padding: 7px 12px; border-radius: 6px; cursor: pointer;">
        Close
      </button>
    </div>
  </div>

  <div class="container">
    <div class="hero-banner">
      <div style="margin-bottom: 8px;">
        <span class="badge-pill badge-green">🔥 3 YOE SDE-2 Bar</span>
        <span class="badge-pill badge-blue">${questions.length} Master Q&As</span>
        <span class="badge-pill badge-gold">₹35L – ₹75L+ Target</span>
      </div>
      <h1 class="doc-title">${bank.title || '3 Years Experienced MERN & MEAN Stack Master Bank'}</h1>
      <p class="doc-subtitle">
        Calibrated for Mid-Senior full-stack engineering interviews at Tier-1 product companies (Google, Meta, Amazon, Atlassian, Razorpay, Uber). Covers internal mechanics, ACID isolation, Event Loop phases, and Live Machine Coding polyfills.
      </p>
      <div class="meta-grid">
        <div><strong>Total Questions:</strong> ${questions.length}</div>
        <div><strong>Sort Order:</strong> ${sortMode === 'topic' ? 'Topic-Wise (Debounce First)' : 'Sequential'}</div>
        <div><strong>Target Level:</strong> 3+ YOE / SDE-2</div>
        <div><strong>Generated:</strong> ${exportDate}</div>
      </div>
    </div>

    <div class="toc-card">
      <div class="toc-title">📑 Table of Contents</div>
      <div class="toc-list">
        ${questions.map(q => `
          <div class="toc-item">
            <span class="toc-num">Q${q.num}</span>
            <span>${q.question}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="questions-container">
      ${questionsHtml}
    </div>
  </div>
</body>
</html>`;

    triggerPrintDocument(htmlDoc, docTitle);
  }

  // Format Code Blocks with Copy Button
  function enhanceCodeBlocks(container) {
    if (!container) return;
    const preElements = container.querySelectorAll('pre');
    preElements.forEach((pre) => {
      const codeEl = pre.querySelector('code');
      if (!codeEl) return;

      if (window.hljs) {
        hljs.highlightElement(codeEl);
      }

      // Wrap in custom wrapper
      if (!pre.parentElement.classList.contains('code-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper';

        const header = document.createElement('div');
        header.className = 'code-header';
        header.innerHTML = `
          <span>CODE SNIPPET</span>
          <div class="code-actions">
            <button class="btn-code-action run-in-playground-btn" title="Test in Interactive Playground">⚡ Test</button>
            <button class="btn-code-action copy-code-btn" title="Copy to clipboard">📋 Copy</button>
          </div>
        `;

        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(header);
        wrapper.appendChild(pre);

        // Copy event
        const copyBtn = header.querySelector('.copy-code-btn');
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(codeEl.textContent);
          copyBtn.textContent = '✓ Copied!';
          setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 2000);
        });

        // Run in playground event
        const runBtn = header.querySelector('.run-in-playground-btn');
        runBtn.addEventListener('click', () => {
          openPlaygroundWithCode(codeEl.textContent);
        });
      }
    });
  }

  function openPlaygroundWithCode(code) {
    elements.playgroundCodeInput.value = code;
    elements.playgroundDrawer.classList.add('open');
    elements.consoleOutputArea.innerHTML = `<div class="console-line">> Code loaded into playground. Click 'Run Code' or press ⌘+Enter to execute.</div>`;
  }

  // ==========================================================================
  // Sidebar Rendering
  // ==========================================================================
  function renderSidebar() {
    if (!elements.sidebarCurriculumTree) return;

    // Group days by Phase and Week
    const filter = state.sidebarFilter.toLowerCase();
    const phases = {};

    data.days.forEach((day) => {
      // Filter check
      if (filter) {
        const match = day.topic.toLowerCase().includes(filter) ||
          day.week.toLowerCase().includes(filter) ||
          `day ${day.day}`.includes(filter);
        if (!match) return;
      }

      const phaseName = day.phase || 'Phase 1';
      const weekName = day.week || 'Week 1';

      if (!phases[phaseName]) phases[phaseName] = {};
      if (!phases[phaseName][weekName]) phases[phaseName][weekName] = [];
      phases[phaseName][weekName].push(day);
    });

    let html = '';
    const phaseNames = Object.keys(phases);

    if (phaseNames.length === 0) {
      elements.sidebarCurriculumTree.innerHTML = `
        <div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.84rem;">
          No matching days found for "${filter}".
        </div>
      `;
      return;
    }

    phaseNames.forEach((phaseName) => {
      html += `
        <div class="accordion-phase">
          <div class="phase-header">${phaseName}</div>
      `;

      const weeks = phases[phaseName];
      Object.keys(weeks).forEach((weekName) => {
        const isExpanded = state.openWeeks[weekName] !== false; // Default open
        const daysInWeek = weeks[weekName];

        html += `
          <div class="week-group ${isExpanded ? 'expanded' : ''}" data-week="${weekName}">
            <div class="week-header" data-toggle-week="${weekName}">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="arrow-icon">▶</span>
                <span>${weekName}</span>
              </div>
              <span style="font-size: 0.72rem; color: var(--text-muted);">${daysInWeek.length} days</span>
            </div>
            <div class="week-days-list">
        `;

        daysInWeek.forEach((day) => {
          const isDone = state.completedDays.includes(day.day);
          const isActive = state.currentView === 'day' && state.currentDay === day.day;

          html += `
            <div class="day-item ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}" data-day-item="${day.day}">
              <div class="day-item-left">
                <span class="day-status-dot"></span>
                <span style="font-weight: 600; color: var(--text-muted); font-size: 0.76rem;">D${day.day}</span>
                <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${day.topic}</span>
              </div>
              <span class="day-hours-pill">${day.hours}h</span>
            </div>
          `;
        });

        html += `
            </div>
          </div>
        `;
      });

      html += `</div>`;
    });

    elements.sidebarCurriculumTree.innerHTML = html;

    // Attach week toggle events
    elements.sidebarCurriculumTree.querySelectorAll('[data-toggle-week]').forEach((el) => {
      el.addEventListener('click', (e) => {
        const weekName = el.getAttribute('data-toggle-week');
        const parent = el.closest('.week-group');
        parent.classList.toggle('expanded');
        state.openWeeks[weekName] = parent.classList.contains('expanded');
      });
    });

    // Attach day item click events
    elements.sidebarCurriculumTree.querySelectorAll('[data-day-item]').forEach((el) => {
      el.addEventListener('click', () => {
        const dayNum = parseInt(el.getAttribute('data-day-item'), 10);
        navigateToDay(dayNum);
      });
    });
  }

  // ==========================================================================
  // Views Rendering
  // ==========================================================================

  function setActivePill(target) {
    document.querySelectorAll('.nav-pill').forEach((pill) => {
      pill.classList.toggle('active', pill.getAttribute('data-target') === target);
    });
  }

  function navigateToDashboard() {
    state.currentView = 'dashboard';
    setActivePill('dashboard');
    renderDashboardView();
    renderSidebar();
  }

  function navigateTo3Yoe(topic) {
    state.currentView = 'threeYoe';
    if (topic !== undefined) {
      state.threeYoeTopicFilter = topic;
    }
    setActivePill('threeYoe');
    render3YoeBankView();
    renderSidebar();
  }

  function navigateToSystemDesign() {
    state.currentView = 'systemDesign';
    setActivePill('systemDesign');
    renderSystemDesignView();
    renderSidebar();
  }

  function navigateToFde(tab = 'blueprint') {
    state.currentView = 'fde';
    state.currentFdeTab = tab;
    setActivePill('fde');
    renderForwardDeployedView();
    renderSidebar();
  }

  function navigateToTheories() {
    state.currentView = 'theories';
    setActivePill('theories');
    renderTheoriesView();
    renderSidebar();
  }

  function navigateToTheoryDetail(theoryId) {
    state.currentView = 'theoryDetail';
    state.currentTheoryId = theoryId;
    setActivePill('theories');
    renderTheoryDetailView(theoryId);
    renderSidebar();
  }

  function navigateToInterviewBanks() {
    state.currentView = 'interviewBanks';
    setActivePill('interviewBanks');
    renderInterviewBanksView();
    renderSidebar();
  }

  function navigateToExercises() {
    state.currentView = 'exercises';
    setActivePill('exercises');
    renderExercisesView();
    renderSidebar();
  }

  function navigateToDay(dayNum, tab = 'overview') {
    state.currentView = 'day';
    state.currentDay = dayNum;
    state.currentTab = tab;
    setActivePill(null);

    // Expand week containing this day
    const targetDay = data.days.find(d => d.day === dayNum);
    if (targetDay && targetDay.week) {
      state.openWeeks[targetDay.week] = true;
    }

    renderDayView(dayNum);
    renderSidebar();
  }

  // 1. Dashboard View
  function renderDashboardView() {
    const totalDays = data.days.length || 182;
    const completedCount = state.completedDays.length;
    const percent = Math.round((completedCount / totalDays) * 100);
    const hoursCompleted = data.days
      .filter(d => state.completedDays.includes(d.day))
      .reduce((acc, d) => acc + (d.hours || 2), 0);

    let html = `
      <div class="breadcrumbs">
        <span>Curriculum</span>
        <span>/</span>
        <span class="crumb-active">Study Dashboard & Overview</span>
      </div>

      <div class="module-hero">
        <div class="hero-meta-row">
          <span class="badge-tag badge-cyan">Starts Tomorrow: Sun, 20 Sep 2026</span>
          <span class="badge-tag badge-gold">Ends: Sat, 20 Mar 2027</span>
          <span class="badge-tag badge-emerald">Commitment: Mon-Fri 2h • Sat-Sun 6h (22h/wk)</span>
        </div>
        <h1 class="module-title">MERN Mastery — 1 CR Executive Dashboard</h1>
        <p class="module-desc">
          Structured 182-day roadmap starting tomorrow (Sunday, 20 September 2026). Designed specifically for L4/L5 SWE loops at Google, Meta, Amazon, Microsoft, Uber, Razorpay, and Atlassian.
          Master full-stack architecture, JavaScript internals, V8 engine mechanics, production distributed systems, and real product HLD/LLD.
        </p>

        <div class="hero-actions">
          <button class="btn-action btn-primary" id="dashResumeBtn">
            <span>⚡ Start Day ${state.currentDay}</span>
          </button>
          <button class="btn-action btn-outline" id="dashSdBtn">
            <span>🌐 System Design & LLD (Phases 6–7)</span>
          </button>
          <button class="btn-action btn-outline" id="dashFdeBtn">
            <span>🚀 Forward Deployed (FDE)</span>
          </button>
          <button class="btn-action btn-outline" id="dashBanksBtn">
            <span>🎯 Practice 1,450+ Questions</span>
          </button>
        </div>
      </div>

      <!-- Key Metrics Cards -->
      <div class="info-grid">
        <div class="card" style="margin-bottom: 0;">
          <div class="info-label">Current Completion</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: var(--accent-cyan); margin: 6px 0;">
            ${percent}%
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${completedCount} of ${totalDays} daily modules logged</div>
        </div>

        <div class="card" style="margin-bottom: 0;">
          <div class="info-label">Logged Study Time</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: var(--accent-emerald); margin: 6px 0;">
            ${hoursCompleted} hrs
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Out of ~470 total intensive hours</div>
        </div>

        <div class="card" style="margin-bottom: 0;">
          <div class="info-label">Target Companies</div>
          <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin: 8px 0;">
            Google • Meta • Amazon • Uber • Palantir
          </div>
          <div style="font-size: 0.8rem; color: #fbbf24;">Target Band: ₹80L – ₹1.5 Cr+</div>
        </div>
      </div>

      <!-- 3 YOE MERN/MEAN Master Bank Spotlight Banner -->
      <div class="card" style="margin-top: 18px; border: 1px solid rgba(16,185,129,0.3); background: linear-gradient(135deg, rgba(16,185,129,0.06), transparent);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
          <div>
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px; flex-wrap: wrap;">
              <span class="badge-tag badge-emerald">🔥 Dedicated 3 YOE Bar</span>
              <span class="badge-tag badge-gold">₹35 LPA – ₹75+ Lakhs</span>
              <span class="badge-tag badge-cyan">React • Redux • Angular • Node • Mongo • SQL</span>
            </div>
            <h3 style="font-size: 1.15rem; font-weight: 700; margin: 0 0 4px 0; color: var(--text-primary);">
              3 Years Experienced MERN & MEAN Stack Master Bank
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0; max-width: 800px;">
              High-frequency SDE-2 interview questions covering React Fiber, Concurrent Mode, Redux Toolkit & RTK Query, Angular OnPush & Signals, libuv event loop backpressure, MongoDB ESR compound indexing, and live machine coding polyfills.
            </p>
          </div>
          <button class="btn-action btn-primary" id="dash3YoeExploreBtn" style="background: linear-gradient(135deg, #10b981, #06b6d4); border: none; color: #fff; box-shadow: 0 2px 10px rgba(16,185,129,0.35);">
            <span>Explore 3 YOE Bank →</span>
          </button>
        </div>
      </div>

      <!-- Forward Deployed Engineer Spotlight Banner -->
      <div class="card" style="margin-top: 18px; border: 1px solid rgba(236,72,153,0.3); background: linear-gradient(135deg, rgba(236,72,153,0.06), transparent);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
          <div>
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px; flex-wrap: wrap;">
              <span class="badge-tag badge-pink">Capstone Track</span>
              <span class="badge-tag badge-gold">₹80 LPA – ₹1.5+ Crore</span>
              <span class="badge-tag badge-cyan">Palantir • OpenAI • Databricks Tier</span>
            </div>
            <h3 style="font-size: 1.15rem; font-weight: 700; margin: 0 0 4px 0; color: var(--text-primary);">
              Forward Deployed Engineer (FDE) Master Track
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0; max-width: 800px;">
              Air-gapped on-prem Kubernetes deployments, enterprise SAML/SCIM identity federation, Kafka Debezium CDC pipelines, zero-trust bastion triage under HIPAA/PCI restrictions, and production RAG systems with document ACLs.
            </p>
          </div>
          <button class="btn-action btn-primary" id="dashFdeExploreBtn" style="background: linear-gradient(135deg, #ec4899, #8b5cf6); border: none; color: #fff; box-shadow: 0 2px 10px rgba(236,72,153,0.35);">
            <span>Explore FDE Track →</span>
          </button>
        </div>
      </div>

      <!-- 182-Day Visual Progress Grid -->
      <div class="card" style="margin-top: 24px;">
        <div class="card-header">
          <div class="card-title">
            <span>🗓️ Complete 182-Day Mastery Grid</span>
          </div>
          <div style="display: flex; gap: 12px; font-size: 0.78rem; color: var(--text-muted);">
            <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; background: var(--accent-emerald); border-radius: 2px;"></span> Completed</span>
            <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; background: var(--accent-cyan); border-radius: 2px;"></span> Current</span>
            <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; background: var(--border-subtle); border-radius: 2px;"></span> Upcoming</span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(36px, 1fr)); gap: 6px; margin-top: 14px;">
    `;

    data.days.forEach((d) => {
      const isDone = state.completedDays.includes(d.day);
      const isCurrent = state.currentDay === d.day;
      let bg = 'var(--bg-surface)';
      let color = 'var(--text-muted)';
      let border = '1px solid var(--border-subtle)';

      if (isDone) {
        bg = 'rgba(16, 185, 129, 0.25)';
        color = '#34d399';
        border = '1px solid rgba(16, 185, 129, 0.5)';
      } else if (isCurrent) {
        bg = 'rgba(56, 189, 248, 0.25)';
        color = '#38bdf8';
        border = '1px solid #38bdf8';
      }

      html += `
        <button data-jump-day="${d.day}" title="Day ${d.day}: ${d.topic}" style="height: 36px; background: ${bg}; color: ${color}; border: ${border}; border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: var(--transition);">
          ${d.day}
        </button>
      `;
    });

    html += `
        </div>
      </div>
    `;

    elements.mainContentInner.innerHTML = html;

    // Attach button events
    document.getElementById('dashResumeBtn')?.addEventListener('click', () => navigateToDay(state.currentDay));
    document.getElementById('dash3YoeExploreBtn')?.addEventListener('click', () => navigateTo3Yoe());
    document.getElementById('dashSdBtn')?.addEventListener('click', navigateToSystemDesign);
    document.getElementById('dashFdeBtn')?.addEventListener('click', () => navigateToFde());
    document.getElementById('dashFdeExploreBtn')?.addEventListener('click', () => navigateToFde());
    document.getElementById('dashBanksBtn')?.addEventListener('click', navigateToInterviewBanks);

    elements.mainContentInner.querySelectorAll('[data-jump-day]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const d = parseInt(btn.getAttribute('data-jump-day'), 10);
        navigateToDay(d);
      });
    });
  }

  // 2. Day View
  function renderDayView(dayNum) {
    const day = data.days.find(d => d.day === dayNum);
    if (!day) return;

    const isCompleted = state.completedDays.includes(dayNum);

    let html = `
      <div class="breadcrumbs">
        <span>${day.phase}</span>
        <span>/</span>
        <span>${day.week}</span>
        <span>/</span>
        <span class="crumb-active">Day ${day.day}: ${day.topic}</span>
      </div>

      <div class="module-hero">
        <div class="hero-meta-row">
          <span class="badge-tag badge-cyan">Day ${day.day} • ${day.dayOfWeek}</span>
          <span class="badge-tag badge-gold">📅 ${day.date}</span>
          <span class="badge-tag badge-emerald">⏱️ ${day.hours} Hours Focus</span>
          ${isCompleted ? '<span class="badge-tag" style="background: rgba(16,185,129,0.2); color:#34d399; border-color:#10b981;">✓ Done</span>' : ''}
        </div>
        <h1 class="module-title">${day.topic}</h1>
        <p class="module-desc">
          ${day.successCriteria || 'Master this module to strengthen core foundations for high-bar product engineering interviews.'}
        </p>

        <div class="hero-actions">
          <button class="btn-action ${isCompleted ? 'btn-outline completed' : 'btn-primary'}" id="toggleDayCompleteBtn">
            <span>${isCompleted ? '✓ Completed' : '○ Mark as Completed'}</span>
          </button>
          <button class="btn-action btn-outline" id="prevDayBtn" ${dayNum <= 1 ? 'disabled style="opacity:0.5"' : ''}>
            <span>← Previous Day</span>
          </button>
          <button class="btn-action btn-outline" id="nextDayBtn" ${dayNum >= data.days.length ? 'disabled style="opacity:0.5"' : ''}>
            <span>Next Day →</span>
          </button>
        </div>
      </div>

      <!-- Navigation Tabs for Day View -->
      <div class="module-tabs">
        <button class="tab-btn ${state.currentTab === 'overview' ? 'active' : ''}" data-tab="overview">
          <span>📋 Overview & Tasks</span>
        </button>
        <button class="tab-btn ${state.currentTab === 'theory' ? 'active' : ''}" data-tab="theory">
          <span>💡 Deep Theory</span>
        </button>
        <button class="tab-btn ${state.currentTab === 'exercises' ? 'active' : ''}" data-tab="exercises">
          <span>🏋️ Exercises & Practice</span>
        </button>
        <button class="tab-btn ${state.currentTab === 'leetcode' ? 'active' : ''}" data-tab="leetcode">
          <span>🧠 LeetCode / DSA</span>
        </button>
        <button class="tab-btn ${state.currentTab === 'interview' ? 'active' : ''}" data-tab="interview">
          <span>🎯 Interview Questions</span>
        </button>
        <button class="tab-btn ${state.currentTab === 'loopholes' ? 'active' : ''}" data-tab="loopholes">
          <span>🚀 1 CR Loopholes</span>
        </button>
      </div>

      <!-- TAB 1: Overview & Tasks -->
      <div class="tab-pane ${state.currentTab === 'overview' ? 'active' : ''}" id="tabPaneOverview">
        <div class="info-grid">
          <div class="info-box">
            <div class="info-label">Study Date & Schedule</div>
            <div class="info-value">${day.date} (${day.dayOfWeek})</div>
          </div>
          <div class="info-box">
            <div class="info-label">Time Split Today</div>
            <div class="info-value">${day.timeSplit || 'Theory (45m) • Exercises (1h 15m)'}</div>
          </div>
          <div class="info-box">
            <div class="info-label">Target LeetCode</div>
            <div class="info-value">${day.leetcode || 'LC Problem of the day'}</div>
          </div>
          <div class="info-box">
            <div class="info-label">Specific Exercises</div>
            <div class="info-value">${day.specificExercises || 'See practice tab for detailed exercises'}</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <span>🎯 Daily Success Criteria Checklist</span>
            </div>
          </div>
          <div class="checklist-container" id="dayChecklistContainer">
    `;

    // Render Checklist items
    const checklistItems = day.checklist && day.checklist.length > 0
      ? day.checklist
      : [
        "Theory section read thoroughly and concepts understood",
        "Practice exercises coded from scratch without looking at solutions",
        "Daily LeetCode problem solved or analyzed with optimal complexity",
        "2-minute aloud interview explanation practiced"
      ];

    checklistItems.forEach((item, idx) => {
      const itemKey = `day_${day.day}_item_${idx}`;
      const isChecked = !!state.checkedChecklistItems[itemKey];

      html += `
        <div class="checklist-item ${isChecked ? 'checked' : ''}" data-checklist-key="${itemKey}">
          <div class="checkbox-custom">${isChecked ? '✓' : ''}</div>
          <div class="checklist-text">${item}</div>
        </div>
      `;
    });

    html += `
          </div>
        </div>

        <div class="callout callout-tip">
          <div class="callout-title">💡 1 CR Mindset Principle</div>
          <p>
            Do not just memorize syntax. In product company loops (Google L4/L5, Meta E4/E5), interviewers look for:
            <strong>(1) Mechanical Sympathy</strong> (knowing how V8 and the browser/OS execute your code),
            <strong>(2) Tradeoff Analysis</strong> (why Array vs Map, why B-Tree vs Hash index), and
            <strong>(3) Communication Clarity</strong> (explaining your thought process before writing a single line).
          </p>
        </div>
      </div>

      <!-- TAB 2: Deep Theory -->
      <div class="tab-pane ${state.currentTab === 'theory' ? 'active' : ''}" id="tabPaneTheory">
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <span>📖 Core Theory: ${day.topic}</span>
            </div>
            ${day.theoryFile ? `<span style="font-size: 0.78rem; color: var(--accent-cyan);">${day.theoryFile}</span>` : ''}
          </div>
          <div class="prose" id="theoryProseContainer">
    `;

    if (day.deepContent) {
      html += renderMarkdown(day.deepContent);
    } else {
      // Find matching theory file
      const theoryObj = data.theories.find(t => day.theoryFile && day.theoryFile.includes(t.fileName));
      if (theoryObj) {
        html += `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 8px;">
            <div>
              <span class="badge-tag badge-cyan">${theoryObj.title}</span>
              <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 8px;">${Math.round(theoryObj.size / 1024)} KB Complete Unabridged Textbook</span>
            </div>
            <button class="btn-action btn-outline" id="openFullTheoryBtn" data-theory-id="${theoryObj.id}">
              <span>Open in Dedicated Reader ↗</span>
            </button>
          </div>
        `;
        html += renderMarkdown(theoryObj.content);
      } else {
        html += `
          <p>This module covers: <strong>${day.topic}</strong>.</p>
          <p>Consult the <strong>Theory Guides</strong> or <strong>System Design</strong> tabs in the sidebar for complete textbooks covering this stack component.</p>
        `;
      }
    }

    html += `
          </div>
        </div>
      </div>

      <!-- TAB 3: Exercises & Practice -->
      <div class="tab-pane ${state.currentTab === 'exercises' ? 'active' : ''}" id="tabPaneExercises">
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <span>🏋️ Hands-On Coding Exercises</span>
            </div>
          </div>
          <div class="prose">
            <h3>Scheduled Task:</h3>
            <p>${day.specificExercises || 'Implement core concepts in JavaScript / TypeScript and test edge cases.'}</p>
            
            <div style="margin: 20px 0;">
              <button class="btn-action btn-primary" id="openExerciseSandboxBtn">
                <span>⚡ Open Live JavaScript Sandbox to Code This</span>
              </button>
            </div>

            <div class="callout callout-vault">
              <div class="callout-title">🏆 High-Bar Practice Rule</div>
              <p>
                Write unit test assertions for every exercise. If you write a <code>debounce</code> function, test rapid calls with <code>setTimeout</code>.
                If you write a tree traversal, test with an empty tree, single node, and skewed linked-list tree.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 4: LeetCode / DSA -->
      <div class="tab-pane ${state.currentTab === 'leetcode' ? 'active' : ''}" id="tabPaneLeetcode">
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <span>🧠 Daily LeetCode & Problem Solving</span>
            </div>
          </div>
          <div class="prose">
            <h3>Assigned Problem:</h3>
            <p style="font-size: 1.1rem; font-weight: 700; color: var(--accent-cyan);">
              ${day.leetcode || 'Review Two Sum / Sliding Window patterns'}
            </p>
            ${day.leetcodeNote ? `<p style="color: var(--text-muted);">${day.leetcodeNote}</p>` : ''}

            <div class="callout callout-tip">
              <div class="callout-title">💡 DSA Timing & Constraints Rule</div>
              <p>
                Solve all problems in <strong>TypeScript</strong>. Time limit: <strong>35–45 minutes</strong>.
                Always speak your thought process: (1) Confirm constraints, (2) State brute-force O(N²) solution, (3) Identify bottleneck, (4) Optimize with Map / Two Pointers / Heap to O(N) or O(log N).
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 5: Interview Questions -->
      <div class="tab-pane ${state.currentTab === 'interview' ? 'active' : ''}" id="tabPaneInterview">
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <span>🎯 Product Company Interview Questions for This Topic</span>
            </div>
            <button class="btn-action btn-outline" id="revealAllAnswersBtn">
              <span>Reveal All Answers</span>
            </button>
          </div>
          <div class="interview-list" id="dayInterviewList">
    `;

    // Extract questions related to this day's category
    let bank = data.interviewBanks.find(b => day.theoryFile && day.theoryFile.includes(b.id));
    if (!bank && data.interviewBanks.length > 0) {
      bank = data.interviewBanks[0];
    }

    if (bank && bank.questions && bank.questions.length > 0) {
      // Show first 6 questions
      bank.questions.slice(0, 6).forEach((q) => {
        html += `
          <div class="interview-item" data-q-id="${q.id}">
            <div class="interview-question-header">
              <div class="interview-title-area">
                <span class="q-num-pill">Q${q.num}</span>
                <span class="q-text">${q.question}</span>
              </div>
              <span style="font-size: 0.75rem; color: var(--accent-cyan);">Show Answer ▼</span>
            </div>
            <div class="interview-answer-pane prose">
              ${renderMarkdown(q.answer)}
            </div>
          </div>
        `;
      });
    } else {
      html += `<p style="color: var(--text-muted);">Open the Interview Bank tab in the sidebar to browse all 1,400+ categorized questions.</p>`;
    }

    html += `
          </div>
        </div>
      </div>

      <!-- TAB 6: 1 CR Architecture Traps & Edge Cases -->
      <div class="tab-pane ${state.currentTab === 'loopholes' ? 'active' : ''}" id="tabPaneLoopholes">
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <span>🚀 1 CR Product Architecture Traps & Edge Cases</span>
            </div>
            <span class="badge-tag badge-gold">Day ${day.day} Differentiator</span>
          </div>
          <div class="prose">
            ${day.edgeCase ? `
              <h3 style="color: var(--accent-blue);">${day.edgeCase.title}</h3>
              <div class="callout callout-warning">
                <div class="callout-title">⚠️ The Trap 95% of Candidates Miss:</div>
                <p>${day.edgeCase.trap}</p>
              </div>
              <div class="callout callout-tip">
                <div class="callout-title">💡 Production 1 CR Solution:</div>
                <p>${day.edgeCase.solution}</p>
              </div>
            ` : `
              <h3>High-Bar Engineering Standard for ${day.topic}</h3>
              <p>In 1 Crore product company loops (Google, Meta, Amazon, Uber, Atlassian):</p>
              <ul>
                <li><strong>Mechanical Sympathy:</strong> Know the exact memory footprint and computational complexity of your approach.</li>
                <li><strong>Zero Latency Regressions:</strong> Avoid blocking synchronous calls on I/O pathways and event loop tick queues.</li>
                <li><strong>Clean Architecture:</strong> Decouple domain business logic from database models and transport frameworks.</li>
              </ul>
            `}
            <div style="margin-top: 16px;">
              <button class="btn-action btn-primary" id="openEdgeCaseSandboxBtn">
                <span>⚡ Test This Concept in Live Playground</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    elements.mainContentInner.innerHTML = html;
    enhanceCodeBlocks(elements.mainContentInner);

    // Event listeners
    document.getElementById('toggleDayCompleteBtn')?.addEventListener('click', () => toggleDayComplete(dayNum));
    document.getElementById('prevDayBtn')?.addEventListener('click', () => {
      if (dayNum > 1) navigateToDay(dayNum - 1);
    });
    document.getElementById('nextDayBtn')?.addEventListener('click', () => {
      if (dayNum < data.days.length) navigateToDay(dayNum + 1);
    });

    // Tab switching
    elements.mainContentInner.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        state.currentTab = tab;
        elements.mainContentInner.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        elements.mainContentInner.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const pane = elements.mainContentInner.querySelector(`#tabPane${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
        if (pane) pane.classList.add('active');
      });
    });

    // Checklist toggles
    elements.mainContentInner.querySelectorAll('.checklist-item').forEach((item) => {
      item.addEventListener('click', () => {
        const key = item.getAttribute('data-checklist-key');
        const isChecked = !state.checkedChecklistItems[key];
        state.checkedChecklistItems[key] = isChecked;
        localStorage.setItem('mern_checked_items', JSON.stringify(state.checkedChecklistItems));
        item.classList.toggle('checked', isChecked);
        item.querySelector('.checkbox-custom').textContent = isChecked ? '✓' : '';
      });
    });

    // Interview Accordion
    elements.mainContentInner.querySelectorAll('.interview-question-header').forEach((h) => {
      h.addEventListener('click', () => {
        h.parentElement.classList.toggle('revealed');
      });
    });

    // Reveal all answers
    document.getElementById('revealAllAnswersBtn')?.addEventListener('click', () => {
      elements.mainContentInner.querySelectorAll('.interview-item').forEach(i => i.classList.add('revealed'));
    });

    // Open Exercise Sandbox
    document.getElementById('openExerciseSandboxBtn')?.addEventListener('click', () => {
      openPlaygroundWithCode(`// Exercise for Day ${day.day}: ${day.topic}\nconsole.log("Ready to code: ${day.topic}");\n`);
    });

    // Open Edge Case Sandbox
    document.getElementById('openEdgeCaseSandboxBtn')?.addEventListener('click', () => {
      openPlaygroundWithCode(`// Testing Day ${day.day}: ${day.topic}\nconsole.log("Testing high-bar edge cases...");\n`);
    });

    // Open full theory
    document.getElementById('openFullTheoryBtn')?.addEventListener('click', (e) => {
      const tId = e.currentTarget.getAttribute('data-theory-id');
      navigateToTheoryDetail(tId);
    });
  }

  // 3b. System Design & Architecture Hub View
  function renderSystemDesignView() {
    let html = `
      <div class="breadcrumbs">
        <span>Architectural Vault</span>
        <span>/</span>
        <span class="crumb-active">System Design & LLD (Phases 6–7)</span>
      </div>

      <div class="module-hero">
        <div class="hero-meta-row">
          <span class="badge-tag badge-cyan">Phases 6–7 Master Vault</span>
          <span class="badge-tag badge-gold">₹1 Crore Bar • Google L5 / Meta E5 / Amazon SDE3</span>
          <span class="badge-tag badge-emerald">HLD • LLD • Distributed • Kafka • K8s</span>
        </div>
        <h1 class="module-title">System Design, Architecture & LLD Hub</h1>
        <p class="module-desc">
          High-Level Design (HLD) product blueprints, Low-Level Design (LLD) object-oriented patterns,
          distributed systems, Kafka event-driven architectures, and database sharding. Everything from <code>mern-mastery</code> is indexed here with complete guides and practice loops.
        </p>

        <div class="hero-actions">
          <button class="btn-action btn-primary" id="sdJumpDaysBtn">
            <span>🗓️ Jump to System Design Weeks (Days 141–168)</span>
          </button>
          <button class="btn-action btn-outline" id="sdInterviewBanksBtn">
            <span>🎯 Open System Design Interview Bank</span>
          </button>
        </div>
      </div>

      <!-- Section 1: Product HLD Case Studies -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <span>🌐 High-Level Design (HLD) Product Blueprints</span>
          </div>
          <span class="badge-tag badge-cyan">Full Production Specs</span>
        </div>
        <p style="color: var(--text-secondary); margin-bottom: 16px; font-size: 0.9rem;">
          The exact systems asked in 90% of product-company architecture rounds. Click any card to read the complete architecture guide.
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(310px, 1fr)); gap: 14px;">
          <div class="card" style="background: var(--bg-surface); margin-bottom: 0; cursor: pointer;" data-open-theory="10-system-design-complete">
            <span class="badge-tag badge-cyan" style="font-size: 0.7rem;">URL SHORTENER (BITLY)</span>
            <h3 style="font-size: 1.05rem; font-weight: 700; margin: 8px 0;">Design a Scalable URL Shortener</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Base62 encoding, MD5/SHA256 collisions, Key Generation Service (KGS), Redis cache-aside, 100M URLs/day scale.</p>
            <div style="margin-top: 10px; font-size: 0.8rem; color: var(--accent-blue); font-weight: 600;">Read Architecture Spec →</div>
          </div>

          <div class="card" style="background: var(--bg-surface); margin-bottom: 0; cursor: pointer;" data-open-theory="10-system-design-complete">
            <span class="badge-tag badge-gold" style="font-size: 0.7rem;">SOCIAL FEED (TWITTER / INSTA)</span>
            <h3 style="font-size: 1.05rem; font-weight: 700; margin: 8px 0;">Design Newsfeed & Social Media Feed</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Fan-out on write vs Fan-out on read, handling celebrity accounts (hybrid approach), timeline caching in Redis.</p>
            <div style="margin-top: 10px; font-size: 0.8rem; color: var(--accent-blue); font-weight: 600;">Read Architecture Spec →</div>
          </div>

          <div class="card" style="background: var(--bg-surface); margin-bottom: 0; cursor: pointer;" data-open-theory="10-system-design-complete">
            <span class="badge-tag badge-emerald" style="font-size: 0.7rem;">REAL-TIME CHAT (WHATSAPP)</span>
            <h3 style="font-size: 1.05rem; font-weight: 700; margin: 8px 0;">Design Real-Time Messaging & Chat</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted);">WebSockets, connection manager, session store, group message fan-out, end-to-end encryption & Snowflake message IDs.</p>
            <div style="margin-top: 10px; font-size: 0.8rem; color: var(--accent-blue); font-weight: 600;">Read Architecture Spec →</div>
          </div>

          <div class="card" style="background: var(--bg-surface); margin-bottom: 0; cursor: pointer;" data-open-theory="10-system-design-complete">
            <span class="badge-tag badge-cyan" style="font-size: 0.7rem;">LOCATION TRACKING (UBER)</span>
            <h3 style="font-size: 1.05rem; font-weight: 700; margin: 8px 0;">Design Ride-Sharing Service</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted);">QuadTree vs Geohash spatial indexes, driver location heartbeats, WebSocket push updates, trip dispatch matchmaking.</p>
            <div style="margin-top: 10px; font-size: 0.8rem; color: var(--accent-blue); font-weight: 600;">Read Architecture Spec →</div>
          </div>

          <div class="card" style="background: var(--bg-surface); margin-bottom: 0; cursor: pointer;" data-open-theory="11-distributed-systems-complete">
            <span class="badge-tag badge-gold" style="font-size: 0.7rem;">VIDEO PLATFORM (YOUTUBE)</span>
            <h3 style="font-size: 1.05rem; font-weight: 700; margin: 8px 0;">Design Video Ingestion & Streaming</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Chunking, transcoding pipelines (HLS/DASH), CDN edge caching, video metadata sharding, thumbnail generation.</p>
            <div style="margin-top: 10px; font-size: 0.8rem; color: var(--accent-blue); font-weight: 600;">Read Architecture Spec →</div>
          </div>

          <div class="card" style="background: var(--bg-surface); margin-bottom: 0; cursor: pointer;" data-open-theory="11-distributed-systems-complete">
            <span class="badge-tag badge-emerald" style="font-size: 0.7rem;">SEARCH AUTOCOMPLETE</span>
            <h3 style="font-size: 1.05rem; font-weight: 700; margin: 8px 0;">Design Typeahead Search Suggestion</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Distributed Trie data structure with frequency nodes, prefix hash maps, Kafka ingestion pipeline, sub-10ms queries.</p>
            <div style="margin-top: 10px; font-size: 0.8rem; color: var(--accent-blue); font-weight: 600;">Read Architecture Spec →</div>
          </div>
        </div>
      </div>

      <!-- Section 2: Complete Architecture Guides Library -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <span>📚 Complete Architecture Guides in MERN Mastery</span>
          </div>
        </div>
        <p style="color: var(--text-secondary); margin-bottom: 16px; font-size: 0.9rem;">
          These 8 comprehensive master textbooks cover every aspect of system design tested in senior product engineering loops:
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(310px, 1fr)); gap: 14px;">
    `;

    const sdGuideIds = [
      '10-system-design-complete',
      '11-distributed-systems-complete',
      '12-microservices-kafka-complete',
      '13-kubernetes-cloud-advanced-complete',
      '09-lld-complete',
      '15-machine-coding-complete',
      '10b-networking-http-fundamentals-complete',
      '10c-system-design-prerequisites-complete'
    ];

    data.theories
      .filter(t => sdGuideIds.includes(t.id))
      .forEach(t => {
        html += `
          <div class="card" style="background: var(--bg-surface); margin-bottom: 0; cursor: pointer;" data-open-theory="${t.id}">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span class="badge-tag badge-cyan">${Math.round(t.size / 1024)} KB Spec</span>
              <span style="font-size: 0.75rem; color: var(--text-muted);">${t.sections ? t.sections.length : 0} Sections</span>
            </div>
            <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">
              ${t.title}
            </h3>
            <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 10px;">
              ${t.sections ? t.sections.slice(0, 3).join(' • ') + '...' : ''}
            </p>
            <div style="font-size: 0.8rem; color: var(--accent-blue); font-weight: 600;">Open Master Guide →</div>
          </div>
        `;
      });

    html += `
        </div>
      </div>
    `;

    elements.mainContentInner.innerHTML = html;
    enhanceCodeBlocks(elements.mainContentInner);

    // Attach events
    document.getElementById('sdJumpDaysBtn')?.addEventListener('click', () => navigateToDay(141));
    document.getElementById('sdInterviewBanksBtn')?.addEventListener('click', () => {
      state.currentBankId = '10-system-design';
      navigateToInterviewBanks();
    });

    elements.mainContentInner.querySelectorAll('[data-open-theory]').forEach(card => {
      card.addEventListener('click', () => {
        const tid = card.getAttribute('data-open-theory');
        navigateToTheoryDetail(tid);
      });
    });
  }

  // 3c. Forward Deployed Engineer (FDE) Track View
  function renderForwardDeployedView() {
    const fde = data.fde || {};
    const missions = (fde.missions && fde.missions.length > 0) ? fde.missions : [];
    const questions = (fde.interviewBank && fde.interviewBank.questions) ? fde.interviewBank.questions : [];
    const theory = fde.theory || {};
    const activeTab = state.currentFdeTab || 'blueprint';
    const activeLab = missions.find(m => m.num === state.currentFdeLab) || missions[0] || {};

    let html = `
      <div class="breadcrumbs">
        <span>Curriculum</span>
        <span>/</span>
        <span class="crumb-active">Forward Deployed Engineer (FDE) Track</span>
      </div>

      <div class="module-hero" style="border-left: 4px solid #ec4899;">
        <div class="hero-meta-row">
          <span class="badge-tag badge-pink">Palantir • OpenAI • Scale AI • Databricks</span>
          <span class="badge-tag badge-gold">₹80 LPA – ₹1.5+ Crore Tier</span>
          <span class="badge-tag badge-cyan">Air-Gapped K8s • SAML/SCIM • CDC • Enterprise AI</span>
        </div>
        <h1 class="module-title">Forward Deployed Engineer (FDE) Mastery Track</h1>
        <p class="module-desc">
          Master the elite discipline of Forward Deployed Engineering: bridging distributed systems architecture, air-gapped on-premises deployments, log-based CDC streaming pipelines, live Linux production debugging under PII constraints, and enterprise LLM/RAG systems.
        </p>

        <div class="hero-actions">
          <button class="btn-action ${activeTab === 'blueprint' ? 'btn-primary' : 'btn-outline'}" id="fdeTabBlueprintBtn">
            <span>🗺️ Role & Architecture Blueprint</span>
          </button>
          <button class="btn-action ${activeTab === 'theory' ? 'btn-primary' : 'btn-outline'}" id="fdeTabTheoryBtn">
            <span>📖 Master Textbook</span>
          </button>
          <button class="btn-action ${activeTab === 'missions' ? 'btn-primary' : 'btn-outline'}" id="fdeTabMissionsBtn">
            <span>🛠️ 6 Mission Labs</span>
          </button>
          <button class="btn-action ${activeTab === 'questions' ? 'btn-primary' : 'btn-outline'}" id="fdeTabQuestionsBtn">
            <span>🎯 50 Interview Questions</span>
          </button>
          <button class="btn-action ${activeTab === 'playbook' ? 'btn-primary' : 'btn-outline'}" id="fdeTabPlaybookBtn">
            <span>🏆 Interview Playbook</span>
          </button>
        </div>
      </div>
    `;

    // TAB 1: BLUEPRINT
    if (activeTab === 'blueprint') {
      html += `
        <!-- Role Comparison Matrix -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <span>⚖️ Role Comparison: SWE vs FDE vs Solutions Architect</span>
            </div>
            <span class="badge-tag badge-pink">The Spectrum</span>
          </div>
          <p style="color: var(--text-secondary); margin-bottom: 16px; font-size: 0.9rem;">
            Why FDEs command top-tier compensation: they combine Staff-level distributed systems engineering with high-velocity client execution.
          </p>

          <div style="overflow-x: auto;">
            <table class="fde-matrix-table">
              <thead>
                <tr>
                  <th>Dimension</th>
                  <th>Core Platform SWE</th>
                  <th style="color: #db2777; background: rgba(236,72,153,0.06);">Forward Deployed Engineer (FDE)</th>
                  <th>Solutions Architect</th>
                  <th>IT Consultant</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Primary Focus</strong></td>
                  <td>Building platform engines & APIs</td>
                  <td style="background: rgba(236,72,153,0.03);"><strong>Deploying & customizing software in client VPCs</strong></td>
                  <td>High-level architecture slide decks</td>
                  <td>Staff augmentation & legacy support</td>
                </tr>
                <tr>
                  <td><strong>Code Quality & Depth</strong></td>
                  <td>Clean, long sprint cycles</td>
                  <td style="background: rgba(236,72,153,0.03);"><strong>Production code in foreign tech stacks</strong></td>
                  <td>Minimal coding (sample scripts only)</td>
                  <td>Varies, often generic glue code</td>
                </tr>
                <tr>
                  <td><strong>Deployment Target</strong></td>
                  <td>Predictable internal cloud</td>
                  <td style="background: rgba(236,72,153,0.03);"><strong>Air-gapped on-prem, multi-cloud, AWS PrivateLink</strong></td>
                  <td>Hypothetical cloud architecture</td>
                  <td>Client-specified environments</td>
                </tr>
                <tr>
                  <td><strong>Client Interaction</strong></td>
                  <td>Zero client facing</td>
                  <td style="background: rgba(236,72,153,0.03);"><strong>Embedded with CISO, VP Infra & tech leads</strong></td>
                  <td>Pre-sales discovery meetings</td>
                  <td>Weekly project manager calls</td>
                </tr>
                <tr>
                  <td><strong>Live Debugging</strong></td>
                  <td>Datadog dashboards & APMs</td>
                  <td style="background: rgba(236,72,153,0.03);"><strong>Restricted bastions, eBPF, tcpdump, zero-PII</strong></td>
                  <td>Escalates to engineering</td>
                  <td>Escalates to vendor support</td>
                </tr>
                <tr>
                  <td><strong>Compensation Tier</strong></td>
                  <td>₹45L – ₹90L ($160k–$280k)</td>
                  <td style="background: rgba(236,72,153,0.03); color: #db2777; font-weight: 700;"><strong>₹80L – ₹1.5+ Cr ($220k–$450k+)</strong></td>
                  <td>₹35L – ₹65L ($140k–$220k)</td>
                  <td>₹15L – ₹35L ($80k–$130k)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Enterprise Deployment Architecture Blueprint -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <span>🏗️ Enterprise Hybrid & Air-Gapped Deployment Topology</span>
            </div>
            <span class="badge-tag badge-cyan">Architecture Spec</span>
          </div>
          <p style="color: var(--text-secondary); margin-bottom: 16px; font-size: 0.9rem;">
            Standard architecture implemented by FDEs at Palantir, OpenAI, and Databricks for regulated financial and government clients:
          </p>

          <div style="background: var(--bg-surface); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 16px;">
            <pre style="margin: 0; font-family: 'Fira Code', monospace; font-size: 0.8rem; line-height: 1.45; overflow-x: auto;">
+---------------------------------------------------------------------------------------------------------------+
| CONNECTED CI/CD (Vendor Cloud)                    SECURE AIR-GAP BOUNDARY    AIR-GAPPED CUSTOMER VPC          |
|                                                                                                               |
| [Docker Multi-Arch Build]                                                    [Private Harbor Image Registry]  |
|          |                                                                   registry.internal.bank:5000      |
|          v                                          Sneakernet /                       ^                      |
| [docker save Tarball]                             Encrypted SFTP                       | pull                 |
| [Helm Chart + Vendored Deps] ===================> (SHA-256 Validated) =======> [Offline Kubernetes Nodes]     |
| [Signed OCI Artifact]                                                                  |                      |
|                                                                                        +--> [Core Pods]       |
|                                                                                        +--> [OPA Rego Engine] |
|                                                                                        +--> [Debezium CDC]    |
+---------------------------------------------------------------------------------------------------------------+
| ENTERPRISE IDENTITY & DATA TOPOLOGY                                                                           |
|                                                                                                               |
| Client Okta IdP =======> SAML 2.0 (Assertion ACS) & SCIM (Instant Deprovisioning)                             |
| Client DB (Oracle/PG) => Log-Based CDC (pg_wal) ====> Kafka Partitioned Stream ===> Analytical Vector Store   |
| Restrictive Bastion ===> Kernel eBPF + strace (Sub-1% CPU Overhead, Strict Zero-PII Compliance Masking)        |
+---------------------------------------------------------------------------------------------------------------+</pre>
          </div>
        </div>

        <!-- 8 Pillars Grid -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <span>🏛️ The 8 Core Pillars of FDE Mastery</span>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; margin-top: 14px;">
            <div class="card" style="background: var(--bg-surface); margin: 0; cursor: pointer;" id="fdePillar1Btn">
              <span class="badge-tag badge-pink" style="font-size: 0.7rem;">PILLAR 1</span>
              <h4 style="margin: 8px 0 4px 0;">FDE Operating Model</h4>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">High-entropy execution, technical pragmatism, rapid iteration vs tech debt.</p>
            </div>
            <div class="card" style="background: var(--bg-surface); margin: 0; cursor: pointer;" id="fdePillar2Btn">
              <span class="badge-tag badge-cyan" style="font-size: 0.7rem;">PILLAR 2</span>
              <h4 style="margin: 8px 0 4px 0;">Enterprise Auth (SAML & SCIM)</h4>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Okta SSO, XML Signature Wrapping (XSW), replay nonces, automated SCIM lifecycle.</p>
            </div>
            <div class="card" style="background: var(--bg-surface); margin: 0; cursor: pointer;" id="fdePillar3Btn">
              <span class="badge-tag badge-gold" style="font-size: 0.7rem;">PILLAR 3</span>
              <h4 style="margin: 8px 0 4px 0;">Air-Gapped & Sovereign Clouds</h4>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Offline Helm packaging, Harbor image mirroring, AWS PrivateLink, zero outbound egress.</p>
            </div>
            <div class="card" style="background: var(--bg-surface); margin: 0; cursor: pointer;" id="fdePillar4Btn">
              <span class="badge-tag badge-emerald" style="font-size: 0.7rem;">PILLAR 4</span>
              <h4 style="margin: 8px 0 4px 0;">High-Throughput CDC Pipelines</h4>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Debezium Kafka CDC, Postgres WAL, Schema Registry, Reverse ETL, idempotency.</p>
            </div>
            <div class="card" style="background: var(--bg-surface); margin: 0; cursor: pointer;" id="fdePillar5Btn">
              <span class="badge-tag badge-pink" style="font-size: 0.7rem;">PILLAR 5</span>
              <h4 style="margin: 8px 0 4px 0;">Hostile Bastion Live Triage</h4>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">eBPF socket tracing, tcpdump, strace, ndots:5 CoreDNS loops, zero-PII masking.</p>
            </div>
            <div class="card" style="background: var(--bg-surface); margin: 0; cursor: pointer;" id="fdePillar6Btn">
              <span class="badge-tag badge-cyan" style="font-size: 0.7rem;">PILLAR 6</span>
              <h4 style="margin: 8px 0 4px 0;">Security & Policy as Code (OPA)</h4>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Open Policy Agent (OPA), Rego ABAC policies, SOC2 / FedRAMP / HIPAA compliance.</p>
            </div>
            <div class="card" style="background: var(--bg-surface); margin: 0; cursor: pointer;" id="fdePillar7Btn">
              <span class="badge-tag badge-gold" style="font-size: 0.7rem;">PILLAR 7</span>
              <h4 style="margin: 8px 0 4px 0;">Enterprise AI / RAG Systems</h4>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">pgvector with document LDAP security filters, tenant isolation, LLM guardrails.</p>
            </div>
            <div class="card" style="background: var(--bg-surface); margin: 0; cursor: pointer;" id="fdePillar8Btn">
              <span class="badge-tag badge-emerald" style="font-size: 0.7rem;">PILLAR 8</span>
              <h4 style="margin: 8px 0 4px 0;">Client Leadership & SOW Scoping</h4>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">SOW architecture annexes, Sev-1 incident post-mortems, CISO negotiations.</p>
            </div>
          </div>
        </div>
      `;
    }

    // TAB 2: MASTER TEXTBOOK
    else if (activeTab === 'theory') {
      html += `
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <span>📖 Forward Deployed Engineer Master Textbook</span>
            </div>
            <span class="badge-tag badge-pink">${Math.round((theory.size || 18000) / 1024)} KB Complete Spec</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 20px;">
            Comprehensive deep dive into all 8 pillars with architectural diagrams, production code, and enterprise failure modes.
          </div>
          <div class="markdown-body">
            ${renderMarkdown(theory.content || '')}
          </div>
        </div>
      `;
    }

    // TAB 3: MISSIONS (PRACTICE LABS)
    else if (activeTab === 'missions') {
      html += `
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <span>🛠️ Enterprise Production Mission Labs</span>
            </div>
            <span class="badge-tag badge-emerald">6 Hands-On Scenarios</span>
          </div>
          <p style="color: var(--text-secondary); margin-bottom: 16px; font-size: 0.9rem;">
            Select a real-world enterprise mission scenario below to inspect architecture, configuration templates, and failure recoveries:
          </p>

          <!-- Mission Selector Bar -->
          <div class="fde-selector-bar">
            ${missions.map(m => `
              <button class="fde-selector-btn ${m.num === (state.currentFdeLab || 1) ? 'active' : ''}" data-select-fde-lab="${m.num}">
                Lab ${m.num}: ${m.title.substring(0, 30)}...
              </button>
            `).join('')}
          </div>

          <!-- Active Mission Display -->
          <div style="background: var(--bg-surface); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-accent);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
              <span class="badge-tag badge-pink">Mission Lab ${activeLab.num || 1}</span>
              <span style="font-size: 0.8rem; color: var(--text-muted);">Enterprise Simulation</span>
            </div>
            <h2 style="font-size: 1.35rem; font-weight: 800; margin-bottom: 12px; color: var(--text-primary);">
              ${activeLab.title || 'Mission Lab'}
            </h2>
            <div class="markdown-body">
              ${renderMarkdown(activeLab.content || '')}
            </div>
          </div>
        </div>
      `;
    }

    // TAB 4: 50 INTERVIEW QUESTIONS
    else if (activeTab === 'questions') {
      const qFilter = (state.fdeQuesFilter || '').toLowerCase().trim();

      const filteredQuestions = questions.filter(q => {
        return !qFilter || q.question.toLowerCase().includes(qFilter) || q.answer.toLowerCase().includes(qFilter);
      });

      html += `
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <span>🎯 50 Forward Deployed Engineer Master Interview Questions</span>
            </div>
            <span class="badge-tag badge-gold">${filteredQuestions.length} Questions</span>
          </div>
          <p style="color: var(--text-secondary); margin-bottom: 16px; font-size: 0.9rem;">
            Targeted for Palantir, OpenAI, Scale AI, Databricks, and Stripe FDE interview bars. Click any question to reveal the comprehensive technical answer.
          </p>

          <!-- Search Box -->
          <div style="margin-bottom: 20px;">
            <input type="text" class="filter-input" id="fdeQuestionSearchInput" placeholder="Filter questions by keyword (e.g. SAML, eBPF, CDC, Air-gap, Okta, PrivateLink)..." value="${state.fdeQuesFilter || ''}" style="width: 100%; font-size: 0.88rem; padding: 10px 14px;">
          </div>

          <!-- Questions List -->
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${filteredQuestions.map(q => `
              <div class="card" style="background: var(--bg-surface); margin: 0; padding: 18px; border: 1px solid var(--border-accent);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; cursor: pointer;" data-toggle-fde-q="${q.num}">
                  <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); line-height: 1.4;">
                    <span style="color: #db2777; margin-right: 6px;">Q${q.num}:</span> ${q.question}
                  </div>
                  <button class="btn-action btn-outline" style="padding: 4px 10px; font-size: 0.75rem; flex-shrink: 0;">
                    Reveal Answer
                  </button>
                </div>
                <div id="fdeAnswer_${q.num}" style="display: none; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border-subtle); animation: fadeIn 0.2s ease;">
                  <div class="markdown-body" style="font-size: 0.88rem; line-height: 1.6;">
                    ${renderMarkdown(q.answer)}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // TAB 5: PLAYBOOK
    else if (activeTab === 'playbook') {
      html += `
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <span>🏆 Palantir & Frontier AI FDE Interview Playbook</span>
            </div>
            <span class="badge-tag badge-pink">Hiring Bar Decoded</span>
          </div>
          <p style="color: var(--text-secondary); margin-bottom: 20px; font-size: 0.9rem;">
            The complete 4-round blueprint for clearing Forward Deployed Engineer loops at Palantir, OpenAI, and Scale AI.
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; margin-bottom: 24px;">
            <div class="card" style="background: var(--bg-surface); margin: 0; border-top: 3px solid #38bdf8;">
              <span class="badge-tag badge-cyan">ROUND 1 • 60 MIN</span>
              <h3 style="font-size: 1.1rem; font-weight: 700; margin: 10px 0 6px 0;">Algorithmic & Coding Precision</h3>
              <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5;">
                Fast implementation of graph traversals (BFS/DFS), interval scheduling, tree parsers, and custom hash data structures. Zero tolerance for syntax hesitation.
              </p>
            </div>

            <div class="card" style="background: var(--bg-surface); margin: 0; border-top: 3px solid #ec4899;">
              <span class="badge-tag badge-pink">ROUND 2 • 60–90 MIN</span>
              <h3 style="font-size: 1.1rem; font-weight: 700; margin: 10px 0 6px 0;">Systems & Live Debugging Round</h3>
              <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5;">
                Dropped into a broken VM or container with an unfamiliar 10,000-line codebase. You must use Linux utilities (<code>ss</code>, <code>tcpdump</code>, <code>strace</code>) to isolate and patch race conditions or socket leaks under time pressure.
              </p>
            </div>

            <div class="card" style="background: var(--bg-surface); margin: 0; border-top: 3px solid #fbbf24;">
              <span class="badge-tag badge-gold">ROUND 3 • 60 MIN</span>
              <h3 style="font-size: 1.1rem; font-weight: 700; margin: 10px 0 6px 0;">Architecture Deconstruct / Scenario</h3>
              <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5;">
                "Customer X operates an on-premise mainframe that cannot be upgraded. Design a real-time CDC sync to our cloud analytics with zero downtime and strict data sovereignty."
              </p>
            </div>

            <div class="card" style="background: var(--bg-surface); margin: 0; border-top: 3px solid #10b981;">
              <span class="badge-tag badge-emerald">ROUND 4 • 45 MIN</span>
              <h3 style="font-size: 1.1rem; font-weight: 700; margin: 10px 0 6px 0;">Client Simulation & Leadership</h3>
              <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5;">
                Interviewers roleplay as an unhappy client CISO or VP of Infra complaining about an outage or security concern. You must demonstrate calm executive poise, active listening, and technical authority.
              </p>
            </div>
          </div>

          <div class="info-box">
            <h4 style="margin: 0 0 8px 0; color: var(--text-primary);">💡 5 Non-Negotiable FDE Interview Mindsets</h4>
            <ul style="margin: 0; padding-left: 20px; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;">
              <li><strong>Prioritize Mitigation over Root Cause:</strong> When production is burning, stop the bleeding first (rollback, failover, traffic shedding) before investigating the root cause.</li>
              <li><strong>Speak in Measurable Latency & SLA Impact:</strong> Never say "the system was slow". Say: "p99 latency escalated from 85ms to 4,200ms due to ephemeral port exhaustion in the libuv threadpool."</li>
              <li><strong>Zero Client Blame:</strong> Even if client IT configured their firewall wrong, maintain professional empathy: "Our network telemetry detected blocked port 443 egress; let's verify routing together."</li>
              <li><strong>Respect Customer Compliance Boundaries:</strong> Never propose solutions that require moving sensitive PII outside customer perimeter or disabling TLS checks.</li>
              <li><strong>Always Write Idempotent Sinks:</strong> Distributed networks retransmit packets. Every CDC consumer and webhook processor must be strictly idempotent.</li>
            </ul>
          </div>
        </div>
      `;
    }

    elements.mainContentInner.innerHTML = html;
    enhanceCodeBlocks(elements.mainContentInner);

    // Attach Tab Button Events
    document.getElementById('fdeTabBlueprintBtn')?.addEventListener('click', () => {
      state.currentFdeTab = 'blueprint';
      renderForwardDeployedView();
    });
    document.getElementById('fdeTabTheoryBtn')?.addEventListener('click', () => {
      state.currentFdeTab = 'theory';
      renderForwardDeployedView();
    });
    document.getElementById('fdeTabMissionsBtn')?.addEventListener('click', () => {
      state.currentFdeTab = 'missions';
      renderForwardDeployedView();
    });
    document.getElementById('fdeTabQuestionsBtn')?.addEventListener('click', () => {
      state.currentFdeTab = 'questions';
      renderForwardDeployedView();
    });
    document.getElementById('fdeTabPlaybookBtn')?.addEventListener('click', () => {
      state.currentFdeTab = 'playbook';
      renderForwardDeployedView();
    });

    // Tab 1 Pillar Card Clicks jump to Theory
    for (let i = 1; i <= 8; i++) {
      document.getElementById(`fdePillar${i}Btn`)?.addEventListener('click', () => {
        state.currentFdeTab = 'theory';
        renderForwardDeployedView();
      });
    }

    // Tab 3 Lab Selector Events
    elements.mainContentInner.querySelectorAll('[data-select-fde-lab]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.currentFdeLab = parseInt(btn.getAttribute('data-select-fde-lab'), 10);
        renderForwardDeployedView();
      });
    });

    // Tab 4 Question Accordion & Search Events
    const qSearchInput = document.getElementById('fdeQuestionSearchInput');
    if (qSearchInput) {
      qSearchInput.addEventListener('input', (e) => {
        const cursorStart = e.target.selectionStart;
        const cursorEnd = e.target.selectionEnd;
        state.fdeQuesFilter = e.target.value;
        renderForwardDeployedView();
        const newInput = document.getElementById('fdeQuestionSearchInput');
        if (newInput) {
          newInput.focus();
          try {
            newInput.setSelectionRange(cursorStart, cursorEnd);
          } catch (_) {}
        }
      });
    }

    elements.mainContentInner.querySelectorAll('[data-toggle-fde-q]').forEach(card => {
      card.addEventListener('click', () => {
        const qNum = card.getAttribute('data-toggle-fde-q');
        const ansDiv = document.getElementById(`fdeAnswer_${qNum}`);
        if (ansDiv) {
          const isHidden = ansDiv.style.display === 'none';
          ansDiv.style.display = isHidden ? 'block' : 'none';
          const btn = card.querySelector('button');
          if (btn) btn.textContent = isHidden ? 'Hide Answer' : 'Reveal Answer';
        }
      });
    });
  }

  // 3.5. Dedicated 3 YOE MERN / MEAN Stack Master Bank View
  function render3YoeBankView() {
    const bank = data.threeYoe || (data.interviewBanks && data.interviewBanks.find(b => b.id === 'mern-mean-3yoe')) || {
      title: "3 Years Experienced MERN & MEAN Stack Master Bank",
      questions: []
    };

    const allQuestions = bank.questions || [];

    // Topic Counts with Machine Coding (Debounce, Polyfills) listed prominently
    const topicsMap = {
      all: { label: "All Topics", icon: "🔥", count: allQuestions.length },
      "Machine Coding": { label: "Machine Coding (Debounce, Polyfills...)", icon: "💻", count: allQuestions.filter(q => q.topicTag === 'Machine Coding').length },
      React: { label: "React.js", icon: "⚛️", count: allQuestions.filter(q => q.topicTag === 'React').length },
      Redux: { label: "Redux & State", icon: "🔄", count: allQuestions.filter(q => q.topicTag === 'Redux').length },
      Angular: { label: "Angular / MEAN", icon: "🅰️", count: allQuestions.filter(q => q.topicTag === 'Angular').length },
      "Node.js": { label: "Node.js & Express", icon: "🟢", count: allQuestions.filter(q => q.topicTag === 'Node.js').length },
      MongoDB: { label: "MongoDB", icon: "🍃", count: allQuestions.filter(q => q.topicTag === 'MongoDB').length },
      SQL: { label: "SQL & Postgres", icon: "🐘", count: allQuestions.filter(q => q.topicTag === 'SQL').length },
      APIs: { label: "APIs & GraphQL", icon: "⚡", count: allQuestions.filter(q => q.topicTag === 'APIs').length },
      "System Design": { label: "System Scenarios", icon: "🏗️", count: allQuestions.filter(q => q.topicTag === 'System Design').length }
    };

    // Filter questions
    const currentFilter = state.threeYoeTopicFilter || 'all';
    const searchQuery = (state.threeYoeSearchQuery || '').toLowerCase().trim();

    let filteredQuestions = allQuestions.filter(q => {
      const matchTopic = currentFilter === 'all' || q.topicTag === currentFilter;
      const matchSearch = !searchQuery ||
        q.question.toLowerCase().includes(searchQuery) ||
        q.answer.toLowerCase().includes(searchQuery) ||
        (q.topic && q.topic.toLowerCase().includes(searchQuery));
      return matchTopic && matchSearch;
    });

    // Sort questions
    const sortMode = state.threeYoeSortMode || 'topic';
    const TOPIC_PRIORITY = [
      'Machine Coding', 'React', 'Redux', 'Angular', 'Node.js', 'MongoDB', 'SQL', 'APIs', 'System Design'
    ];

    if (sortMode === 'topic') {
      filteredQuestions.sort((a, b) => {
        const tagA = a.topicTag || 'General';
        const tagB = b.topicTag || 'General';
        const idxA = TOPIC_PRIORITY.indexOf(tagA);
        const idxB = TOPIC_PRIORITY.indexOf(tagB);
        if (idxA !== -1 && idxB !== -1) {
          if (idxA !== idxB) return idxA - idxB;
          return a.num - b.num;
        }
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return tagA.localeCompare(tagB) || (a.num - b.num);
      });
    } else if (sortMode === 'alpha') {
      filteredQuestions.sort((a, b) => a.question.localeCompare(b.question));
    } else {
      filteredQuestions.sort((a, b) => a.num - b.num);
    }

    let html = `
      <div class="breadcrumbs">
        <span style="cursor: pointer;" id="crumbInterviewPrepBtn">Interview Prep</span>
        <span>/</span>
        <span class="crumb-active">3 Years Experienced MERN & MEAN Stack Master Bank</span>
      </div>

      <!-- Hero Header -->
      <div class="three-yoe-hero-gradient">
        <div class="hero-meta-row" style="margin-bottom: 12px;">
          <span class="badge-tag badge-emerald">🔥 3 YOE SDE-2 Bar</span>
          <span class="badge-tag badge-cyan">${allQuestions.length} Master Q&As (16/Topic)</span>
          <span class="badge-tag badge-gold">Google • Meta • Amazon • Atlassian • Razorpay</span>
        </div>
        <h1 class="module-title" style="margin-bottom: 8px;">
          3 Years Experienced MERN & MEAN Stack Master Bank
        </h1>
        <p class="module-desc" style="margin-bottom: 16px;">
          Comprehensive technical interview questions and deep-dive answers calibrated specifically for 3+ years experienced full-stack engineers. Covers internal mechanisms (Fiber, Event Loop, Change Detection, ESR indexing, ACID isolation), real-world production traps, performance profiling, and live machine coding polyfills.
        </p>

        <!-- Quick Stats Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-top: 16px;">
          <div class="card" style="margin: 0; background: var(--bg-card); padding: 12px 16px;">
            <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Curated Questions</div>
            <div style="font-size: 1.4rem; font-weight: 800; color: var(--accent-emerald); margin: 2px 0;">${allQuestions.length} Questions</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">9 Core Specialized Modules (16 each)</div>
          </div>
          <div class="card" style="margin: 0; background: var(--bg-card); padding: 12px 16px;">
            <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Target Level</div>
            <div style="font-size: 1.4rem; font-weight: 800; color: var(--accent-cyan); margin: 2px 0;">SDE-2 / Mid-Senior</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">3–5 Years Experience Bar</div>
          </div>
          <div class="card" style="margin: 0; background: var(--bg-card); padding: 12px 16px;">
            <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Compensation Target</div>
            <div style="font-size: 1.4rem; font-weight: 800; color: #fbbf24; margin: 2px 0;">₹35L – ₹75L+</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Tier-1 Product Companies</div>
          </div>
          <div class="card" style="margin: 0; background: var(--bg-card); padding: 12px 16px;">
            <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Live Machine Coding</div>
            <div style="font-size: 1.4rem; font-weight: 800; color: #a855f7; margin: 2px 0;">16 Drills & Polyfills</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Interactive Code Runner Ready</div>
          </div>
        </div>
      </div>

      <!-- Topic Filter Chips -->
      <div class="three-yoe-chips-wrapper">
    `;

    Object.entries(topicsMap).forEach(([key, info]) => {
      const isActive = currentFilter === key;
      html += `
        <button class="three-yoe-chip ${isActive ? 'active' : ''}" data-3yoe-topic="${key}">
          <span>${info.icon}</span>
          <span>${info.label}</span>
          <span style="font-size: 0.75rem; opacity: 0.8;">(${info.count})</span>
        </button>
      `;
    });

    html += `
      </div>

      <!-- Search & Controls Toolbar -->
      <div class="card" style="margin-bottom: 20px;">
        <div style="display: flex; gap: 12px; align-items: center; justify-content: space-between; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 260px; position: relative;">
            <input type="text" id="threeYoeSearchInput" value="${state.threeYoeSearchQuery}" placeholder="Search 3 YOE questions (e.g. Fiber, Stale closure, OnPush, Backpressure, ESR, Double spend, LRU)..." style="width: 100%; background: var(--bg-surface); border: 1px solid var(--border-accent); border-radius: var(--radius-md); padding: 10px 14px; color: var(--text-primary); font-size: 0.88rem; outline: none;">
          </div>
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: var(--text-muted);">
              <span>Sort:</span>
              <select id="threeYoeSortSelect" style="background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-accent); border-radius: 4px; padding: 6px 10px; font-size: 0.8rem; outline: none; cursor: pointer;">
                <option value="topic" ${sortMode === 'topic' ? 'selected' : ''}>📌 Topic-Wise (Debounce First)</option>
                <option value="number" ${sortMode === 'number' ? 'selected' : ''}>🔢 Numbered (Q1 - Q144)</option>
                <option value="alpha" ${sortMode === 'alpha' ? 'selected' : ''}>🔤 Alphabetical (A-Z)</option>
              </select>
            </div>
            <button class="btn-action btn-outline" id="revealAll3YoeBtn" style="font-size: 0.8rem; padding: 7px 12px;">
              <span>Expand All Answers</span>
            </button>
            <button class="btn-action btn-outline" id="collapseAll3YoeBtn" style="font-size: 0.8rem; padding: 7px 12px;">
              <span>Collapse All</span>
            </button>
            <button class="btn-action btn-download-action" id="download3YoeBankBtn" style="font-size: 0.8rem; padding: 7px 14px;" title="Export & Download this entire bank with answers as formatted PDF">
              <span>📥 Download PDF</span>
            </button>
            <button class="btn-action btn-primary" id="openPlaygroundFrom3YoeBtn" style="font-size: 0.8rem; padding: 7px 12px;">
              <span>⚡ Code Runner</span>
            </button>
          </div>
        </div>
        ${searchQuery ? `<div style="margin-top: 10px; font-size: 0.8rem; color: var(--text-muted);">Filtering by "${searchQuery}" — Found ${filteredQuestions.length} matches (<a href="javascript:void(0)" id="clear3YoeSearch" style="color: var(--accent-cyan); text-decoration: underline;">Clear filter</a>)</div>` : ''}
      </div>

      <!-- Question List -->
      <div class="interview-list">
    `;

    if (filteredQuestions.length === 0) {
      html += `
        <div class="card" style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 2rem; margin-bottom: 8px;">🔍</div>
          <h3 style="margin-bottom: 6px;">No questions found matching your criteria</h3>
          <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px;">Try adjusting your keyword search or selecting another topic filter chip above.</p>
          <button class="btn-action btn-outline" id="reset3YoeFilterBtn">Reset Topic & Search</button>
        </div>
      `;
    } else {
      let currentTopicSection = '';
      filteredQuestions.forEach((q) => {
        const tagClass = `topic-${(q.topicTag || 'react').toLowerCase().replace(/[^a-z]/g, '')}`;
        const tag = q.topicTag || 'General';

        // Render topic divider if sorting by topic and not filtering by a single topic
        if (sortMode === 'topic' && currentFilter === 'all' && tag !== currentTopicSection) {
          currentTopicSection = tag;
          const meta = TOPIC_METADATA[tag] || { icon: '📌', name: tag };
          const countInTopic = filteredQuestions.filter(x => (x.topicTag || 'General') === tag).length;
          html += `
            <div class="topic-section-divider">
              <div class="topic-section-title">
                <span>${meta.icon}</span>
                <span>${meta.name}</span>
              </div>
              <span class="topic-section-count">${countInTopic} Questions</span>
            </div>
          `;
        }

        html += `
          <div class="interview-item" data-3yoe-id="${q.id}">
            <div class="interview-question-header" style="cursor: pointer;">
              <div class="interview-title-area" style="display: flex; align-items: flex-start; gap: 12px; flex: 1;">
                <span class="q-num-pill" style="margin-top: 2px;">Q${q.num}</span>
                <div style="flex: 1;">
                  <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px; flex-wrap: wrap;">
                    <span class="three-yoe-topic-badge ${tagClass}">${q.topicTag || 'React'}</span>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${q.topic || ''}</span>
                    <span class="badge-tag badge-emerald" style="font-size: 0.68rem; padding: 1px 6px;">3 YOE Bar</span>
                  </div>
                  <div class="q-text" style="font-size: 1rem; font-weight: 600; color: var(--text-primary); line-height: 1.45;">
                    ${q.question}
                  </div>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; margin-left: 12px; flex-shrink: 0;">
                <button class="btn-action btn-outline single-q-download-btn" data-download-3yoe-q="${q.id}" style="font-size: 0.72rem; padding: 4px 8px;" title="Export this Q&A as PDF">
                  <span>📥 PDF</span>
                </button>
                <span class="toggle-hint" style="font-size: 0.75rem; color: var(--accent-cyan); white-space: nowrap;">Reveal Answer ▼</span>
              </div>
            </div>
            <div class="interview-answer-pane prose markdown-body" style="padding-top: 14px; border-top: 1px dashed var(--border-subtle); margin-top: 12px;">
              ${renderMarkdown(q.answer)}
            </div>
          </div>
        `;
      });
    }

    html += `
      </div>
    `;

    elements.mainContentInner.innerHTML = html;
    enhanceCodeBlocks(elements.mainContentInner);

    // Event listeners
    document.getElementById('crumbInterviewPrepBtn')?.addEventListener('click', navigateToInterviewBanks);
    document.getElementById('openPlaygroundFrom3YoeBtn')?.addEventListener('click', () => {
      elements.playgroundDrawer.classList.add('open');
    });

    // Sort select
    document.getElementById('threeYoeSortSelect')?.addEventListener('change', (e) => {
      state.threeYoeSortMode = e.target.value;
      render3YoeBankView();
    });

    // Download entire bank
    document.getElementById('download3YoeBankBtn')?.addEventListener('click', () => {
      downloadBankAsPdf(bank, state.threeYoeSortMode || 'topic', state.threeYoeTopicFilter);
    });

    // Download single Q&A
    elements.mainContentInner.querySelectorAll('[data-download-3yoe-q]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const qId = btn.getAttribute('data-download-3yoe-q');
        const targetQ = allQuestions.find(x => x.id === qId);
        if (targetQ) downloadSingleQuestionAsPdf(targetQ);
      });
    });

    // Topic filter buttons
    elements.mainContentInner.querySelectorAll('[data-3yoe-topic]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.threeYoeTopicFilter = btn.getAttribute('data-3yoe-topic');
        render3YoeBankView();
      });
    });

    // Question search input
    const searchInp = document.getElementById('threeYoeSearchInput');
    if (searchInp) {
      searchInp.addEventListener('input', (e) => {
        const cursorStart = e.target.selectionStart;
        const cursorEnd = e.target.selectionEnd;
        state.threeYoeSearchQuery = e.target.value;
        render3YoeBankView();
        const nextInp = document.getElementById('threeYoeSearchInput');
        if (nextInp) {
          nextInp.focus();
          try {
            nextInp.setSelectionRange(cursorStart, cursorEnd);
          } catch (_) {}
        }
      });
    }

    document.getElementById('clear3YoeSearch')?.addEventListener('click', () => {
      state.threeYoeSearchQuery = '';
      render3YoeBankView();
    });

    document.getElementById('reset3YoeFilterBtn')?.addEventListener('click', () => {
      state.threeYoeTopicFilter = 'all';
      state.threeYoeSearchQuery = '';
      render3YoeBankView();
    });

    // Toggle single question
    elements.mainContentInner.querySelectorAll('.interview-question-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const isRevealed = item.classList.toggle('revealed');
        const hint = header.querySelector('.toggle-hint');
        if (hint) hint.textContent = isRevealed ? 'Hide Answer ▲' : 'Reveal Answer ▼';
      });
    });

    // Expand / Collapse all
    document.getElementById('revealAll3YoeBtn')?.addEventListener('click', () => {
      elements.mainContentInner.querySelectorAll('.interview-item').forEach(item => {
        item.classList.add('revealed');
        const hint = item.querySelector('.toggle-hint');
        if (hint) hint.textContent = 'Hide Answer ▲';
      });
    });

    document.getElementById('collapseAll3YoeBtn')?.addEventListener('click', () => {
      elements.mainContentInner.querySelectorAll('.interview-item').forEach(item => {
        item.classList.remove('revealed');
        const hint = item.querySelector('.toggle-hint');
        if (hint) hint.textContent = 'Reveal Answer ▼';
      });
    });
  }

  // 4. Theory Guides Catalog View
  function renderTheoriesView() {
    let html = `
      <div class="breadcrumbs">
        <span>Curriculum</span>
        <span>/</span>
        <span class="crumb-active">Theory Encyclopedia</span>
      </div>

      <div class="module-hero">
        <div class="hero-meta-row">
          <span class="badge-tag badge-cyan">Complete Engineering Library</span>
          <span class="badge-tag badge-gold">${data.theories.length} In-Depth Guides</span>
        </div>
        <h1 class="module-title">Theory Encyclopedia & Architecture Guides</h1>
        <p class="module-desc">
          Complete textbooks covering JavaScript internals, TypeScript, React, Next.js, Node.js, PostgreSQL, MongoDB,
          Distributed Systems, Apache Kafka, Kubernetes, System Design, and Senior Behavioral frameworks.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;">
    `;

    data.theories.forEach((t) => {
      html += `
        <div class="card" style="margin-bottom: 0; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; transition: var(--transition);" data-theory-card="${t.id}">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <span class="badge-tag badge-cyan" style="font-size: 0.7rem;">${Math.round(t.size / 1024)} KB</span>
              <span style="font-size: 0.72rem; color: var(--text-muted);">${t.sections ? t.sections.length : 0} Sections</span>
            </div>
            <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">
              ${t.title}
            </h3>
            <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 12px;">
              ${t.sections ? t.sections.slice(0, 3).join(' • ') + '...' : ''}
            </p>
          </div>
          <button class="btn-action btn-outline" style="width: 100%; justify-content: center;">
            <span>Read Complete Guide →</span>
          </button>
        </div>
      `;
    });

    html += `</div>`;

    elements.mainContentInner.innerHTML = html;

    elements.mainContentInner.querySelectorAll('[data-theory-card]').forEach((card) => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-theory-card');
        navigateToTheoryDetail(id);
      });
    });
  }

  // 5. Theory Detail View
  function renderTheoryDetailView(theoryId) {
    const t = data.theories.find(x => x.id === theoryId);
    if (!t) return;

    let html = `
      <div class="breadcrumbs">
        <span>Theory Guides</span>
        <span>/</span>
        <span class="crumb-active">${t.title}</span>
      </div>

      <div class="module-hero">
        <div class="hero-meta-row">
          <span class="badge-tag badge-cyan">${t.fileName}</span>
          <span class="badge-tag badge-gold">${Math.round(t.size / 1024)} KB Master Document</span>
        </div>
        <h1 class="module-title">${t.title}</h1>
        <div class="hero-actions">
          <button class="btn-action btn-outline" id="backToTheoriesBtn">
            <span>← Back to All Guides</span>
          </button>
        </div>
      </div>

      <div class="card">
        <div class="prose">
          ${renderMarkdown(t.content)}
        </div>
      </div>
    `;

    elements.mainContentInner.innerHTML = html;
    enhanceCodeBlocks(elements.mainContentInner);

    document.getElementById('backToTheoriesBtn')?.addEventListener('click', navigateToTheories);
  }

  // 6. Interview Banks View
  function renderInterviewBanksView() {
    let currentBank = data.interviewBanks.find(b => b.id === state.currentBankId) || data.interviewBanks[0];

    const sortMode = state.bankSortMode || 'topic';
    const currentFilter = state.bankTopicFilter || 'all';

    let allBankQuestions = [...(currentBank.questions || [])];
    let questions = [...allBankQuestions];

    // Filter by topic if applicable
    if (currentFilter !== 'all') {
      questions = questions.filter(q => q.topicTag === currentFilter || q.topic === currentFilter);
    }

    // Determine unique topic tags present in this bank
    const uniqueTopics = ['all'];
    allBankQuestions.forEach(q => {
      const t = q.topicTag || q.topic;
      if (t && !uniqueTopics.includes(t)) uniqueTopics.push(t);
    });

    const TOPIC_PRIORITY = [
      'Machine Coding', 'React', 'Redux', 'Angular', 'Node.js', 'MongoDB', 'SQL', 'APIs', 'System Design'
    ];

    if (sortMode === 'topic') {
      questions.sort((a, b) => {
        const tagA = a.topicTag || 'General';
        const tagB = b.topicTag || 'General';
        const idxA = TOPIC_PRIORITY.indexOf(tagA);
        const idxB = TOPIC_PRIORITY.indexOf(tagB);
        if (idxA !== -1 && idxB !== -1) {
          if (idxA !== idxB) return idxA - idxB;
          return a.num - b.num;
        }
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return tagA.localeCompare(tagB) || (a.num - b.num);
      });
    } else if (sortMode === 'alpha') {
      questions.sort((a, b) => a.question.localeCompare(b.question));
    } else {
      questions.sort((a, b) => a.num - b.num);
    }

    let html = `
      <div class="breadcrumbs">
        <span>Interview Prep</span>
        <span>/</span>
        <span class="crumb-active">1,400+ Product Company Interview Bank</span>
      </div>

      <div class="module-hero">
        <div class="hero-meta-row">
          <span class="badge-tag badge-cyan">21 Specialized Banks</span>
          <span class="badge-tag badge-gold">1,400+ Detailed Q&A</span>
          <span class="badge-tag badge-emerald">Google • Meta • Amazon • Atlassian • Razorpay</span>
        </div>
        <h1 class="module-title">Product Company Interview Bank</h1>
        <p class="module-desc">
          High-frequency interview questions with detailed, quotable answers. Click any question to reveal the interview-ready explanation.
        </p>
      </div>

      <!-- Categories Bar -->
      <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 20px;">
    `;

    data.interviewBanks.forEach((b) => {
      const isSelected = b.id === currentBank.id;
      html += `
        <button class="btn-action ${isSelected ? 'btn-primary' : 'btn-outline'}" data-bank-id="${b.id}" style="font-size: 0.8rem; padding: 6px 12px; white-space: nowrap;">
          <span>${b.title.replace('Product Company Interview Bank — ', '').replace(' Interview — 100 Questions', '').replace(' — 50 Questions', '')} (${b.count})</span>
        </button>
      `;
    });

    html += `
      </div>
    `;

    // Show Topic Filter Chips if bank has multiple topics (e.g. 3 YOE Master Bank)
    if (uniqueTopics.length > 2) {
      html += `
        <div class="three-yoe-chips-wrapper" style="margin-bottom: 16px;">
      `;
      uniqueTopics.forEach(t => {
        const isActive = currentFilter === t;
        const count = t === 'all' ? allBankQuestions.length : allBankQuestions.filter(x => (x.topicTag || x.topic) === t).length;
        const meta = TOPIC_METADATA[t] || { icon: '📌', name: t };
        html += `
          <button class="three-yoe-chip ${isActive ? 'active' : ''}" data-bank-topic-filter="${t}">
            <span>${t === 'all' ? '🔥' : meta.icon}</span>
            <span>${t === 'all' ? 'All Topics' : t}</span>
            <span style="font-size: 0.75rem; opacity: 0.8;">(${count})</span>
          </button>
        `;
      });
      html += `</div>`;
    }

    html += `
      <div class="card">
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div class="card-title" style="display: flex; align-items: center; gap: 8px;">
            <span>${currentBank.title} (${questions.length}${currentFilter !== 'all' ? ` of ${currentBank.count}` : ''} Questions)</span>
          </div>
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: var(--text-muted);">
              <span>Sort:</span>
              <select id="bankSortSelect" style="background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-accent); border-radius: 4px; padding: 5px 8px; font-size: 0.78rem; outline: none; cursor: pointer;">
                <option value="topic" ${sortMode === 'topic' ? 'selected' : ''}>📌 Topic-Wise (Debounce First)</option>
                <option value="number" ${sortMode === 'number' ? 'selected' : ''}>🔢 Sequential (Q1 - Q${currentBank.count})</option>
                <option value="alpha" ${sortMode === 'alpha' ? 'selected' : ''}>🔤 Alphabetical (A-Z)</option>
              </select>
            </div>
            <button class="btn-action btn-outline" id="revealBankAnswersBtn" style="font-size: 0.8rem; padding: 6px 12px;">
              <span>Reveal All Answers</span>
            </button>
            <button class="btn-action btn-outline" id="collapseBankAnswersBtn" style="font-size: 0.8rem; padding: 6px 12px;">
              <span>Collapse All</span>
            </button>
            <button class="btn-action btn-download-action" id="downloadBankBtn" style="font-size: 0.8rem; padding: 6px 14px;" title="Export & Download this bank with answers as formatted PDF">
              <span>📥 Download PDF</span>
            </button>
          </div>
        </div>

        <div class="interview-list">
    `;

    let currentTopicSection = '';
    questions.forEach((q) => {
      const tag = q.topicTag || q.topic || 'General';
      const tagClass = `topic-${tag.toLowerCase().replace(/[^a-z]/g, '')}`;

      // Insert topic section header when sorting by topic and viewing multiple topics
      if (sortMode === 'topic' && currentFilter === 'all' && uniqueTopics.length > 2 && tag !== currentTopicSection) {
        currentTopicSection = tag;
        const meta = TOPIC_METADATA[tag] || { icon: '📌', name: tag };
        const countInTopic = questions.filter(x => (x.topicTag || x.topic || 'General') === tag).length;
        html += `
          <div class="topic-section-divider">
            <div class="topic-section-title">
              <span>${meta.icon}</span>
              <span>${meta.name}</span>
            </div>
            <span class="topic-section-count">${countInTopic} Questions</span>
          </div>
        `;
      }

      html += `
        <div class="interview-item" data-q-id="${q.id}">
          <div class="interview-question-header" style="cursor: pointer;">
            <div class="interview-title-area" style="display: flex; align-items: flex-start; gap: 12px; flex: 1;">
              <span class="q-num-pill" style="margin-top: 2px;">Q${q.num}</span>
              <div style="flex: 1;">
                ${q.topicTag ? `
                  <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 4px; flex-wrap: wrap;">
                    <span class="three-yoe-topic-badge ${tagClass}" style="font-size: 0.72rem; padding: 2px 7px;">${q.topicTag}</span>
                    <span style="font-size: 0.72rem; color: var(--text-muted);">${q.topic || ''}</span>
                  </div>
                ` : ''}
                <div class="q-text" style="font-size: 0.96rem; font-weight: 600; color: var(--text-primary); line-height: 1.4;">
                  ${q.question}
                </div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; margin-left: 12px; flex-shrink: 0;">
              <button class="btn-action btn-outline single-q-download-btn" data-download-bank-q="${q.id}" style="font-size: 0.72rem; padding: 4px 8px;" title="Export this Q&A as PDF">
                <span>📥 PDF</span>
              </button>
              <span class="toggle-hint" style="font-size: 0.75rem; color: var(--accent-cyan); white-space: nowrap;">Show Answer ▼</span>
            </div>
          </div>
          <div class="interview-answer-pane prose">
            ${renderMarkdown(q.answer)}
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    elements.mainContentInner.innerHTML = html;
    enhanceCodeBlocks(elements.mainContentInner);

    // Bank switch buttons
    elements.mainContentInner.querySelectorAll('[data-bank-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.currentBankId = btn.getAttribute('data-bank-id');
        state.bankTopicFilter = 'all';
        renderInterviewBanksView();
      });
    });

    // Topic filter buttons within interview banks
    elements.mainContentInner.querySelectorAll('[data-bank-topic-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.bankTopicFilter = btn.getAttribute('data-bank-topic-filter');
        renderInterviewBanksView();
      });
    });

    // Sort select
    document.getElementById('bankSortSelect')?.addEventListener('change', (e) => {
      state.bankSortMode = e.target.value;
      renderInterviewBanksView();
    });

    // Download entire bank
    document.getElementById('downloadBankBtn')?.addEventListener('click', () => {
      downloadBankAsPdf(currentBank, state.bankSortMode || 'topic', state.bankTopicFilter);
    });

    // Download single Q&A
    elements.mainContentInner.querySelectorAll('[data-download-bank-q]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const qId = btn.getAttribute('data-download-bank-q');
        const targetQ = allBankQuestions.find(x => x.id === qId);
        if (targetQ) downloadSingleQuestionAsPdf(targetQ);
      });
    });

    // Question toggles
    elements.mainContentInner.querySelectorAll('.interview-question-header').forEach((h) => {
      h.addEventListener('click', () => {
        const item = h.parentElement;
        const isRevealed = item.classList.toggle('revealed');
        const hint = h.querySelector('.toggle-hint');
        if (hint) hint.textContent = isRevealed ? 'Hide Answer ▲' : 'Show Answer ▼';
      });
    });

    document.getElementById('revealBankAnswersBtn')?.addEventListener('click', () => {
      elements.mainContentInner.querySelectorAll('.interview-item').forEach(i => {
        i.classList.add('revealed');
        const hint = i.querySelector('.toggle-hint');
        if (hint) hint.textContent = 'Hide Answer ▲';
      });
    });

    document.getElementById('collapseBankAnswersBtn')?.addEventListener('click', () => {
      elements.mainContentInner.querySelectorAll('.interview-item').forEach(i => {
        i.classList.remove('revealed');
        const hint = i.querySelector('.toggle-hint');
        if (hint) hint.textContent = 'Show Answer ▼';
      });
    });
  }

  // 7. Exercises Catalog View
  function renderExercisesView() {
    let html = `
      <div class="breadcrumbs">
        <span>Curriculum</span>
        <span>/</span>
        <span class="crumb-active">Coding Exercises & Practice</span>
      </div>

      <div class="module-hero">
        <div class="hero-meta-row">
          <span class="badge-tag badge-cyan">9 Workbooks</span>
          <span class="badge-tag badge-emerald">Hands-On Practice</span>
        </div>
        <h1 class="module-title">Coding Exercises & Workbooks</h1>
        <p class="module-desc">
          Structured problem sets covering foundational JavaScript drills, React machine coding widgets,
          Node backend APIs, and complete product e-commerce architectures.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;">
    `;

    data.exercises.forEach((ex) => {
      html += `
        <div class="card" style="margin-bottom: 0;">
          <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">
            ${ex.title}
          </h3>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">
            ${ex.items ? ex.items.slice(0, 4).join(' • ') : ''}
          </p>
          <button class="btn-action btn-outline open-exercise-doc-btn" data-ex-id="${ex.id}" style="width: 100%; justify-content: center;">
            <span>Open Workbook →</span>
          </button>
        </div>
      `;
    });

    html += `</div>`;

    elements.mainContentInner.innerHTML = html;

    elements.mainContentInner.querySelectorAll('.open-exercise-doc-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-ex-id');
        const doc = data.exercises.find(e => e.id === id);
        if (doc) {
          elements.mainContentInner.innerHTML = `
            <div class="breadcrumbs">
              <span>Exercises</span>
              <span>/</span>
              <span class="crumb-active">${doc.title}</span>
            </div>
            <button class="btn-action btn-outline" id="backToExercisesBtn" style="margin-bottom: 20px;">
              <span>← Back to Workbooks</span>
            </button>
            <div class="card">
              <div class="prose">
                ${renderMarkdown(doc.content)}
              </div>
            </div>
          `;
          enhanceCodeBlocks(elements.mainContentInner);
          document.getElementById('backToExercisesBtn')?.addEventListener('click', renderExercisesView);
        }
      });
    });
  }

  // ==========================================================================
  // Interactive Code Playground Runner (Async + Real-time Streaming Logs)
  // ==========================================================================
  async function executePlaygroundCode() {
    if (!elements.playgroundCodeInput || !elements.consoleOutputArea) return;
    const code = elements.playgroundCodeInput.value;
    elements.consoleOutputArea.innerHTML = '';

    function appendLine(type, text) {
      if (!elements.consoleOutputArea) return;
      const line = document.createElement('div');
      line.className = `console-line ${type}`;
      line.textContent = `> ${text}`;
      elements.consoleOutputArea.appendChild(line);
      elements.consoleOutputArea.scrollTop = elements.consoleOutputArea.scrollHeight;
    }

    function formatArg(arg) {
      if (typeof arg === 'object' && arg !== null) {
        try { return JSON.stringify(arg, null, 2); } catch (e) { return String(arg); }
      }
      return String(arg);
    }

    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    let hasOutput = false;

    console.log = (...args) => {
      hasOutput = true;
      appendLine('log', args.map(formatArg).join(' '));
      originalLog.apply(console, args);
    };
    console.error = (...args) => {
      hasOutput = true;
      appendLine('error', args.map(formatArg).join(' '));
      originalError.apply(console, args);
    };
    console.warn = (...args) => {
      hasOutput = true;
      appendLine('warn', args.map(formatArg).join(' '));
      originalWarn.apply(console, args);
    };
    console.info = (...args) => {
      hasOutput = true;
      appendLine('info', args.map(formatArg).join(' '));
      originalInfo.apply(console, args);
    };

    const startTime = performance.now();
    try {
      // Support top-level await and asynchronous scripts
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
      const fn = new AsyncFunction(code);
      await fn();
      const duration = (performance.now() - startTime).toFixed(2);

      if (!hasOutput) {
        appendLine('log', `Code executed cleanly (${duration}ms) with no immediate console output.`);
      } else {
        const summary = document.createElement('div');
        summary.className = 'console-line';
        summary.style.color = 'var(--text-muted)';
        summary.style.marginTop = '6px';
        summary.textContent = `[Execution finished in ${duration}ms]`;
        elements.consoleOutputArea.appendChild(summary);
      }
    } catch (err) {
      appendLine('error', `Error: ${err.message || err}`);
    } finally {
      // Keep console overrides active for 3.5 seconds to capture async timer/promise logs
      setTimeout(() => {
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;
        console.info = originalInfo;
      }, 3500);
    }
  }

  // ==========================================================================
  // Search Engine
  // ==========================================================================
  function performGlobalSearch(query) {
    if (!query || query.trim().length < 2) {
      elements.searchResultsList.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.88rem;">
          Type at least 2 characters to search...
        </div>
      `;
      return;
    }

    const q = query.toLowerCase().trim();
    const results = [];

    // Search days
    data.days.forEach(day => {
      if (day.topic.toLowerCase().includes(q) || (day.theorySection && day.theorySection.toLowerCase().includes(q))) {
        results.push({
          type: 'Day Module',
          title: `Day ${day.day}: ${day.topic}`,
          snippet: `${day.phase} • ${day.hours}h • ${day.date}`,
          action: () => {
            closeSearchModal();
            navigateToDay(day.day);
          }
        });
      }
    });

    // Search 1 CR Edge Cases
    data.days.forEach(day => {
      if (day.edgeCase && (day.edgeCase.title.toLowerCase().includes(q) || day.edgeCase.trap.toLowerCase().includes(q) || day.edgeCase.solution.toLowerCase().includes(q))) {
        results.push({
          type: `Day ${day.day} 1 CR Architecture Trap`,
          title: day.edgeCase.title,
          snippet: day.edgeCase.trap,
          action: () => {
            closeSearchModal();
            navigateToDay(day.day, 'loopholes');
          }
        });
      }
    });

    // Search Theory Guides
    data.theories.forEach(t => {
      if (t.title.toLowerCase().includes(q) || (t.sections && t.sections.some(s => s.toLowerCase().includes(q)))) {
        results.push({
          type: 'Theory Guide',
          title: t.title,
          snippet: t.sections ? t.sections.slice(0, 3).join(' • ') : '',
          action: () => {
            closeSearchModal();
            navigateToTheoryDetail(t.id);
          }
        });
      }
    });

    // Search Interview Questions
    data.interviewBanks.forEach(b => {
      b.questions.forEach(ques => {
        if (ques.question.toLowerCase().includes(q) || (ques.answer && ques.answer.toLowerCase().includes(q))) {
          results.push({
            type: ques.category === 'forward-deployed-engineer'
              ? 'FDE Interview Q&A'
              : (ques.category === 'mern-mean-3yoe' ? `🔥 3 YOE: ${ques.topicTag || 'Full-Stack'}` : `Interview: ${b.title}`),
            title: `Q${ques.num}: ${ques.question}`,
            snippet: ques.answer.substring(0, 120) + '...',
            action: () => {
              closeSearchModal();
              if (ques.category === 'forward-deployed-engineer') {
                state.fdeQuesFilter = ques.question.substring(0, 20);
                navigateToFde('questions');
              } else if (ques.category === 'mern-mean-3yoe') {
                state.threeYoeTopicFilter = ques.topicTag || 'all';
                state.threeYoeSearchQuery = ques.question.substring(0, 25);
                navigateTo3Yoe();
              } else {
                state.currentBankId = b.id;
                navigateToInterviewBanks();
              }
            }
          });
        }
      });
    });

    // Search FDE Mission Labs
    if (data.fde && data.fde.missions) {
      data.fde.missions.forEach(m => {
        if (m.title.toLowerCase().includes(q) || m.scenario.toLowerCase().includes(q) || m.content.toLowerCase().includes(q)) {
          results.push({
            type: 'FDE Production Mission Lab',
            title: `Mission Lab ${m.num}: ${m.title}`,
            snippet: m.scenario.substring(0, 120) + '...',
            action: () => {
              closeSearchModal();
              state.currentFdeLab = m.num;
              navigateToFde('missions');
            }
          });
        }
      });
    }

    // Render results
    if (results.length === 0) {
      elements.searchResultsList.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.88rem;">
          No matches found for "${query}".
        </div>
      `;
      return;
    }

    elements.searchResultsList.innerHTML = results.slice(0, 30).map((r, i) => `
      <div class="search-result-item" data-search-idx="${i}">
        <div class="result-category">${r.type}</div>
        <div class="result-title">${r.title}</div>
        <div class="result-snippet">${r.snippet}</div>
      </div>
    `).join('');

    elements.searchResultsList.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-search-idx'), 10);
        results[idx].action();
      });
    });
  }

  function openSearchModal() {
    elements.searchModalOverlay.classList.add('active');
    elements.globalSearchInput.value = '';
    elements.globalSearchInput.focus();
  }

  function closeSearchModal() {
    elements.searchModalOverlay.classList.remove('active');
  }

  // ==========================================================================
  // Initialization & Event Attachments
  // ==========================================================================
  function init() {
    // Theme setup
    document.documentElement.setAttribute('data-theme', state.theme);

    function updateThemeIcon() {
      if (!elements.themeIcon) return;
      if (state.theme === 'light') {
        elements.themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
        elements.themeToggleBtn.setAttribute('title', 'Switch to Dark Theme');
      } else {
        elements.themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
        elements.themeToggleBtn.setAttribute('title', 'Switch to Light Theme');
      }
    }

    updateThemeIcon();

    elements.themeToggleBtn?.addEventListener('click', () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', state.theme);
      localStorage.setItem('mern_theme', state.theme);
      updateThemeIcon();
    });

    // Sidebar menu toggle
    elements.menuToggleBtn?.addEventListener('click', () => {
      elements.appContainer.classList.toggle('sidebar-collapsed');
    });

    // Brand logo returns to dashboard
    elements.brandHomeBtn?.addEventListener('click', navigateToDashboard);

    // Navigation Hub pills
    elements.navDashboardBtn?.addEventListener('click', navigateToDashboard);
    elements.nav3YoeBtn?.addEventListener('click', () => navigateTo3Yoe());
    elements.navSystemDesignBtn?.addEventListener('click', navigateToSystemDesign);
    elements.navFdeBtn?.addEventListener('click', () => navigateToFde());
    elements.navTheoryBtn?.addEventListener('click', navigateToTheories);
    elements.navBanksBtn?.addEventListener('click', navigateToInterviewBanks);
    elements.navExercisesBtn?.addEventListener('click', navigateToExercises);

    // Sidebar filter
    elements.sidebarFilterInput?.addEventListener('input', (e) => {
      state.sidebarFilter = e.target.value;
      renderSidebar();
    });

    // Print PDF
    elements.printPdfBtn?.addEventListener('click', () => {
      window.print();
    });

    // Playground events
    elements.togglePlaygroundBtn?.addEventListener('click', () => {
      elements.playgroundDrawer.classList.toggle('open');
    });
    elements.closePlaygroundBtn?.addEventListener('click', () => {
      elements.playgroundDrawer.classList.remove('open');
    });
    elements.runCodeBtn?.addEventListener('click', executePlaygroundCode);
    elements.clearConsoleBtn?.addEventListener('click', () => {
      elements.consoleOutputArea.innerHTML = `<div class="console-line">> Console cleared.</div>`;
    });

    // Preset selector
    elements.playgroundPresetSelect?.addEventListener('change', (e) => {
      const val = e.target.value;
      if (PLAYGROUND_PRESETS[val]) {
        elements.playgroundCodeInput.value = PLAYGROUND_PRESETS[val];
      }
    });

    // Keyboard shortcut for running playground code: Cmd/Ctrl + Enter
    elements.playgroundCodeInput?.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        executePlaygroundCode();
      }
    });

    // Search events
    elements.searchTriggerBtn?.addEventListener('click', openSearchModal);
    elements.closeSearchModalBtn?.addEventListener('click', closeSearchModal);
    elements.searchModalOverlay?.addEventListener('click', (e) => {
      if (e.target === elements.searchModalOverlay) closeSearchModal();
    });

    elements.globalSearchInput?.addEventListener('input', (e) => {
      performGlobalSearch(e.target.value);
    });

    // Keyboard shortcut: Cmd/Ctrl + K for search
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearchModal();
      }
      if (e.key === 'Escape' && elements.searchModalOverlay?.classList?.contains('active')) {
        closeSearchModal();
      }
    });

    // Initial render
    updateProgressUI();
    renderSidebar();
    renderDashboardView();
  }

  // Launch on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

