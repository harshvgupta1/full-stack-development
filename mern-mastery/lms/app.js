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
    theories: [],
    exercises: []
  };

  // State
  const state = {
    currentView: 'dashboard', // 'dashboard', 'day', 'vault', 'theories', 'interviewBanks', 'exercises', 'theoryDetail', 'systemDesign'
    currentDay: 1,
    currentTab: 'overview',
    currentTheoryId: null,
    currentBankId: '01-javascript',
    completedDays: JSON.parse(localStorage.getItem('mern_completed_days') || '[]'),
    bookmarkedQuestions: JSON.parse(localStorage.getItem('mern_bookmarked_qs') || '[]'),
    checkedChecklistItems: JSON.parse(localStorage.getItem('mern_checked_items') || '{}'),
    theme: localStorage.getItem('mern_theme') || 'light',
    sidebarFilter: '',
    openWeeks: { 'Week 1 of 26': true }
  };

  // Preset snippets for Playground
  const PLAYGROUND_PRESETS = {
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
console.log("Two Sum indices for target 9 in [2, 7, 11, 15]:", result);`,

    debounce: `// Production Debounce Implementation
function debounce(fn, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

const logSearch = debounce((query) => {
  console.log("API Query Executed for:", query);
}, 300);

console.log("Calling debounce rapidly 3 times...");
logSearch("re");
logSearch("rea");
logSearch("react"); // Only this one will execute after 300ms!`,

    curry: `// Infinite Currying in JavaScript
function add(a) {
  return function (b) {
    if (b !== undefined) {
      return add(a + b);
    }
    return a;
  };
}

console.log("add(1)(2)(3)():", add(1)(2)(3)());
console.log("add(10)(20)(30)(40)():", add(10)(20)(30)(40)());`
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
    navSystemDesignBtn: document.getElementById('navSystemDesignBtn'),
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

  function navigateToSystemDesign() {
    state.currentView = 'systemDesign';
    setActivePill('systemDesign');
    renderSystemDesignView();
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
          <button class="btn-action btn-outline" id="dashBanksBtn">
            <span>🎯 Practice 1,400+ Interview Questions</span>
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
            Google • Meta • Amazon • Uber • Atlassian
          </div>
          <div style="font-size: 0.8rem; color: #fbbf24;">Target Band: ₹80L – ₹1.5 Cr+</div>
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
    document.getElementById('dashSdBtn')?.addEventListener('click', navigateToSystemDesign);
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

      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <span>${currentBank.title} (${currentBank.count} Questions)</span>
          </div>
          <button class="btn-action btn-outline" id="revealBankAnswersBtn">
            <span>Reveal All Answers</span>
          </button>
        </div>

        <div class="interview-list">
    `;

    currentBank.questions.forEach((q) => {
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

    html += `
        </div>
      </div>
    `;

    elements.mainContentInner.innerHTML = html;
    enhanceCodeBlocks(elements.mainContentInner);

    // Bank buttons
    elements.mainContentInner.querySelectorAll('[data-bank-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.currentBankId = btn.getAttribute('data-bank-id');
        renderInterviewBanksView();
      });
    });

    // Question toggles
    elements.mainContentInner.querySelectorAll('.interview-question-header').forEach((h) => {
      h.addEventListener('click', () => {
        h.parentElement.classList.toggle('revealed');
      });
    });

    document.getElementById('revealBankAnswersBtn')?.addEventListener('click', () => {
      elements.mainContentInner.querySelectorAll('.interview-item').forEach(i => i.classList.add('revealed'));
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
  // Interactive Code Playground Runner
  // ==========================================================================
  function executePlaygroundCode() {
    const code = elements.playgroundCodeInput.value;
    elements.consoleOutputArea.innerHTML = '';

    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    const logs = [];

    function formatArg(arg) {
      if (typeof arg === 'object' && arg !== null) {
        try { return JSON.stringify(arg, null, 2); } catch (e) { return String(arg); }
      }
      return String(arg);
    }

    console.log = (...args) => {
      logs.push({ type: 'log', text: args.map(formatArg).join(' ') });
      originalLog.apply(console, args);
    };
    console.error = (...args) => {
      logs.push({ type: 'error', text: args.map(formatArg).join(' ') });
      originalError.apply(console, args);
    };
    console.warn = (...args) => {
      logs.push({ type: 'warn', text: args.map(formatArg).join(' ') });
      originalWarn.apply(console, args);
    };

    const startTime = performance.now();
    try {
      // Execute in sandbox
      const fn = new Function(code);
      fn();
      const duration = (performance.now() - startTime).toFixed(2);

      if (logs.length === 0) {
        elements.consoleOutputArea.innerHTML = `<div class="console-line">> Code executed cleanly (${duration}ms) with no console output.</div>`;
      } else {
        elements.consoleOutputArea.innerHTML = logs.map(l => {
          return `<div class="console-line ${l.type}">> ${l.text}</div>`;
        }).join('') + `<div class="console-line" style="color: var(--text-muted); margin-top: 6px;">[Execution finished in ${duration}ms]</div>`;
      }
    } catch (err) {
      elements.consoleOutputArea.innerHTML = `<div class="console-line error">> Error: ${err.message}</div>`;
    } finally {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
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
        if (ques.question.toLowerCase().includes(q)) {
          results.push({
            type: `Interview: ${b.title}`,
            title: `Q${ques.num}: ${ques.question}`,
            snippet: ques.answer.substring(0, 120) + '...',
            action: () => {
              closeSearchModal();
              state.currentBankId = b.id;
              navigateToInterviewBanks();
            }
          });
        }
      });
    });

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
    elements.navSystemDesignBtn?.addEventListener('click', navigateToSystemDesign);
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
      if (e.key === 'Escape' && elements.searchModalOverlay.classList.contains('active')) {
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
