#!/usr/bin/env python3
"""
Compile all MERN Mastery curriculum, 182 daily modules, 1,400+ interview questions,
theory textbooks, and coding exercises into a unified JavaScript data store.

Start Date: Sunday, 20 September 2026 (Tomorrow)
Schedule: Mon-Fri = 2 hrs/day, Sat-Sun = 6 hrs/day (22 hrs/week)
Total Duration: 182 Days (26 Weeks) -> Ends Saturday, 20 March 2027
"""

import os
import re
import json
import datetime
from pathlib import Path

BASE_DIR = Path("/Users/reelax/Desktop/test")
MERN_DIR = BASE_DIR / "mern-mastery"
FULL_STACK_DIR = BASE_DIR / "Full stack development"
DETAILED_DIR = MERN_DIR / "detailed"
THEORY_DIR = DETAILED_DIR / "theory"
BANKS_DIR = DETAILED_DIR / "interview-banks"
EXERCISES_DIR = DETAILED_DIR / "exercises"

OUTPUT_FILE = FULL_STACK_DIR / "data" / "lms-data.js"
OUTPUT_JSON = FULL_STACK_DIR / "data" / "lms-data.json"

START_DATE = datetime.date(2026, 9, 20) # Tomorrow: Sunday, 20 Sep 2026

# Crucial 1 CR architectural edge cases integrated directly by topic
TOPIC_1CR_ENHANCEMENTS = {
    1: {
        "title": "V8 Engine Heap Allocation & Hidden Classes Introduction",
        "trap": "Why adding properties to objects in different orders causes a 10x performance slowdown in V8.",
        "solution": "Always initialize object properties in identical order in constructors or factory functions; avoid 'delete obj.prop' which turns objects into slow hash maps."
    },
    2: {
        "title": "V8 Call Stack Execution Contexts & Scope Chains",
        "trap": "Confusing Lexical Scope with Dynamic Scope in 'this' bindings and nested function execution.",
        "solution": "Trace Lexical Environment Records in memory: Outer Environment Reference points to where function was DEFINED, not where called."
    },
    3: {
        "title": "Closure Memory Leaks & V8 Garbage Collection",
        "trap": "Accidentally retaining huge outer variables in long-lived callbacks or event listeners.",
        "solution": "V8 Garbage Collector uses Scavenge (Cheney's algorithm) for New Space and Mark-Sweep-Compact for Old Space. Nullify unneeded references or use WeakMap/WeakRef."
    },
    4: {
        "title": "The 'this' Keyword & Function.prototype Method Borrowing",
        "trap": "Lost context in detached methods or async callbacks causing undefined properties.",
        "solution": "Understand the 4 binding rules: Default, Implicit, Explicit (call/apply/bind), and 'new'. Arrow functions lexically inherit 'this' and cannot be bound."
    },
    15: {
        "title": "Event Loop Microtask Queue Starvation & process.nextTick Traps",
        "trap": "Recursive Promise resolution or process.nextTick starving I/O and killing server health checks.",
        "solution": "Microtasks run between EVERY macrotask callback until the microtask queue is empty. Use setImmediate() to yield to the Check phase and allow I/O polling."
    },
    22: {
        "title": "TypeScript Type Erasure & Runtime Soundness Traps",
        "trap": "Assuming TypeScript types provide runtime security or input validation.",
        "solution": "TypeScript is erased at compile time. Always pair TS types with runtime validators (Zod / Yup / io-ts) on all network boundaries and JSON inputs."
    },
    29: {
        "title": "React 19 Server Components Wire Protocol & Fiber Lanes",
        "trap": "Believing Server Components return HTML rather than a streaming JSON serialization protocol.",
        "solution": "RSC streams 'react-server-dom' format across the network. Client bundles carry 0 KB JS for server components. Watch for hydration mismatches on client-only values."
    },
    36: {
        "title": "React Layout Thrashing & Reflow vs Composite Layers",
        "trap": "Interleaving DOM reads (offsetWidth) with DOM writes causing layout thrashing (forced reflow).",
        "solution": "Batch DOM reads and writes. Use CSS transform and opacity to animate on the compositor thread via GPU without triggering CPU reflows."
    },
    57: {
        "title": "Node.js High-Throughput Tuning & libuv Thread Pool",
        "trap": "Synchronous crypto/fs operations blocking libuv thread pool (default 4 threads).",
        "solution": "Scale UV_THREADPOOL_SIZE=64 for crypto/DNS heavy apps, use streams to avoid buffer memory spikes, and monitor event loop lag metrics."
    },
    64: {
        "title": "OWASP Top 10: Prototype Pollution via Deep Object Merge",
        "trap": "Attacker injecting '__proto__' payload into recursive merge functions leading to RCE.",
        "solution": "Reject '__proto__', 'constructor', 'prototype' keys. Use Object.create(null) for dictionary lookups, or Object.freeze(Object.prototype)."
    },
    71: {
        "title": "MongoDB Replica Set Election Downtime & Unacknowledged Writes",
        "trap": "Network partition causing silent write drops under default Write Concern w:1.",
        "solution": "Use Write Concern w:majority and Read Concern majority with causal consistency to guarantee durability during primary failover."
    },
    78: {
        "title": "The High-Concurrency Double-Spend Race Condition",
        "trap": "Concurrent balance updates reading stale balance, causing negative balances.",
        "solution": "Use atomic conditional writes (UPDATE ... WHERE balance >= amount), PostgreSQL 'SELECT FOR UPDATE', or Redis Redlock with monotonic fencing tokens."
    },
    79: {
        "title": "PostgreSQL Composite Index Leftmost Prefix Rule & Cursor Pagination",
        "trap": "Adding an index but querying without the leading column; using OFFSET 100000 causing CPU spikes.",
        "solution": "Queries must match the leading columns of a composite index. Replace OFFSET pagination with Keyset (Cursor-based) pagination in O(log N)."
    },
    141: {
        "title": "Cache Stampede (Dogpiling) & Probabilistic Early Expiration (XFetch)",
        "trap": "Hottest Redis key expires causing 10,000 concurrent DB queries that crash the primary database.",
        "solution": "Apply the XFetch probabilistic algorithm to compute and refresh the cache in the background before expiry, or use single-flight request coalescing."
    },
    148: {
        "title": "Distributed Snowflake ID Generation & Real-Time Chat Scaling",
        "trap": "Database auto-increment IDs bottlenecking at 50,000 RPS across distributed shards.",
        "solution": "Generate 64-bit Twitter Snowflake IDs (41-bit timestamp + 10-bit machine ID + 12-bit sequence) locally with zero network coordination."
    },
    155: {
        "title": "Kafka Consumer Group Rebalance Storms & Transactional Outbox",
        "trap": "Slow consumer processing exceeding max.poll.interval.ms causing infinite rebalance crash loops.",
        "solution": "Decouple message polling from asynchronous processing. Use the Transactional Outbox pattern with unique idempotency keys to guarantee exactly-once processing."
    },
    169: {
        "title": "Timed Online Assessment (OA) Mastery & 1 CR Negotiation",
        "trap": "Freezing during 70-min CodeSignal / Amazon OA or failing to negotiate equity at offer stage.",
        "solution": "Master the 4-question CodeSignal pace (Q1/Q2 quick pass, Q4 sub-optimal, Q3 hard focus). Structure behavioral stories with STAR format highlighting monetary & latency ROI."
    }
}

def parse_roadmap_days():
    roadmap_path = DETAILED_DIR / "00-ROADMAP-COMPLETE.md"
    if not roadmap_path.exists():
        print(f"Error: {roadmap_path} does not exist")
        return []

    with open(roadmap_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Split by day headers: ### Day X — ...
    day_blocks = re.split(r'\n(?=### Day \d+)', content)
    days = []

    for block in day_blocks:
        match = re.match(r'### Day (\d+)\s*—\s*([A-Za-z]+)\s*\|\s*📅\s*([^|\n]+)\|\s*(\d+)\s*hours', block)
        if not match:
            continue

        day_num = int(match.group(1))

        # Recalculate real dates starting Tomorrow (Sunday, 20 September 2026)
        date_obj = START_DATE + datetime.timedelta(days=day_num - 1)
        day_of_week = date_obj.strftime("%a") # 'Sun', 'Mon', 'Tue', ...
        date_str = date_obj.strftime("%d %b %Y") # '20 Sep 2026', ...
        # Schedule: Mon-Fri = 2 hours, Sat-Sun = 6 hours
        hours = 6 if day_of_week in ["Sat", "Sun"] else 2
        week_num = f"Week {((day_num - 1) // 7) + 1} of 26"

        # Extract table fields
        fields = {}
        table_match = re.search(r'\| Field \| Detail \|\n\|[-| ]+\|\n(.*?)(?=\n####|\n###|\n---|\Z)', block, re.DOTALL)
        if table_match:
            for row in table_match.group(1).strip().split('\n'):
                cols = [c.strip() for c in row.split('|') if c.strip()]
                if len(cols) >= 2:
                    key = cols[0].replace('**', '').strip()
                    val = cols[1].strip()
                    fields[key] = val

        # Extract "What Success Looks Like Today"
        success_match = re.search(r'#### What Success Looks Like Today\s*\n\s*(.*?)(?=\n- \[|\n###|\n---|\Z)', block, re.DOTALL)
        success_text = success_match.group(1).strip() if success_match else ""

        # Extract checklist items
        checklist = re.findall(r'- \[ \]\s*(.+)', block)

        topic = fields.get("Exact Topic", f"Day {day_num} Topic")
        month_phase = fields.get("Month Phase", "Phase 1")
        theory_file = fields.get("Theory File", "")
        theory_section = fields.get("Theory Section", "")
        practice_file = fields.get("Practice File", "")
        specific_exercises = fields.get("Specific Exercises", "")
        leetcode = fields.get("LeetCode", "")
        leetcode_note = fields.get("LeetCode Note", "")
        time_split = fields.get("Time Split Today", "")

        # If Day 1, check for local Week-1 deep file
        deep_content = ""
        if day_num == 1:
            d1_path = FULL_STACK_DIR / "Week-1" / "Day-01-How-The-Web-Works-and-JS-Basics.md"
            if d1_path.exists():
                with open(d1_path, "r", encoding="utf-8") as d1f:
                    deep_content = d1f.read()

        # Check if this day has a curated 1 CR architectural edge case
        edge_case = TOPIC_1CR_ENHANCEMENTS.get(day_num, None)

        days.append({
            "day": day_num,
            "dayOfWeek": day_of_week,
            "date": date_str,
            "hours": hours,
            "week": week_num,
            "phase": month_phase,
            "topic": topic,
            "theoryFile": theory_file,
            "theorySection": theory_section,
            "practiceFile": practice_file,
            "specificExercises": specific_exercises,
            "leetcode": leetcode,
            "leetcodeNote": leetcode_note,
            "timeSplit": time_split,
            "successCriteria": success_text,
            "checklist": checklist,
            "deepContent": deep_content,
            "edgeCase": edge_case,
            "rawBlock": block[:2000]
        })

    days.sort(key=lambda x: x["day"])
    return days

def parse_interview_banks():
    banks = []
    if not BANKS_DIR.exists():
        return banks

    for file in sorted(BANKS_DIR.glob("*.md")):
        with open(file, "r", encoding="utf-8") as f:
            text = f.read()

        title_match = re.search(r'^#\s*(.+)', text, re.MULTILINE)
        title = title_match.group(1).strip() if title_match else file.stem
        category = file.stem.replace('-interview-50', '').replace('-complete', '').replace('-50', '')

        questions = []

        # Check for Pattern 1 & 2: ### Question X: OR ### QX:
        p1 = re.findall(r'###\s+(?:Question|Q)\s*(\d+)[:.]?\s*([^\n]+)\n(.*?)(?=\n###|\n---|\Z)', text, re.DOTALL)
        if p1:
            for q_num, q_title, q_body in p1:
                ans_match = re.search(r'\*\*Answer:\*\*\s*(.*)', q_body, re.DOTALL)
                ans = ans_match.group(1).strip() if ans_match else q_body.strip()
                questions.append({
                    "id": f"{category}-q{q_num}",
                    "num": int(q_num),
                    "question": q_title.strip(),
                    "answer": ans,
                    "category": category,
                    "source": file.name
                })
        else:
            # Pattern 3: ## \d+\. ...
            p3 = re.findall(r'##\s+(\d+)\.\s*([^\n]+)\n(.*?)(?=\n##\s+\d+\.|\n---|\Z)', text, re.DOTALL)
            for q_num, q_title, q_body in p3:
                ans_match = re.search(r'\*\*Answer:\*\*\s*(.*)', q_body, re.DOTALL)
                ans = ans_match.group(1).strip() if ans_match else q_body.strip()
                questions.append({
                    "id": f"{category}-q{q_num}",
                    "num": int(q_num),
                    "question": q_title.strip(),
                    "answer": ans,
                    "category": category,
                    "source": file.name
                })

        banks.append({
            "id": category,
            "title": title,
            "fileName": file.name,
            "count": len(questions),
            "questions": questions
        })

    return banks

def parse_theory_catalog():
    theories = []
    if not THEORY_DIR.exists():
        return theories

    for file in sorted(THEORY_DIR.glob("*.md")):
        with open(file, "r", encoding="utf-8") as f:
            text = f.read()

        title_match = re.search(r'^#\s*(.+)', text, re.MULTILINE)
        title = title_match.group(1).strip() if title_match else file.stem
        sections = re.findall(r'^##\s+([^\n]+)', text, re.MULTILINE)

        theories.append({
            "id": file.stem,
            "title": title,
            "fileName": file.name,
            "size": len(text),
            "sections": sections[:15],
            "content": text
        })

    return theories

def parse_exercises_catalog():
    exercises = []
    if not EXERCISES_DIR.exists():
        return exercises

    for file in sorted(EXERCISES_DIR.glob("*.md")):
        with open(file, "r", encoding="utf-8") as f:
            text = f.read()

        title_match = re.search(r'^#\s*(.+)', text, re.MULTILINE)
        title = title_match.group(1).strip() if title_match else file.stem
        items = re.findall(r'(?:^##\s+|^###\s+Exercise\s+\d+[:.]?\s*)([^\n]+)', text, re.MULTILINE)

        exercises.append({
            "id": file.stem,
            "title": title,
            "fileName": file.name,
            "items": items[:20],
            "content": text
        })

    return exercises

def parse_fde_package():
    fde_dir = FULL_STACK_DIR / "data"
    theory_file = fde_dir / "fde-theory.md"
    bank_file = fde_dir / "fde-interview-bank.md"
    practice_file = fde_dir / "fde-practice-scenarios.md"

    fde_package = {
        "id": "forward-deployed-engineer",
        "title": "Forward Deployed Engineer (FDE) Mastery Track",
        "tier": "Palantir / OpenAI / Databricks / Scale AI",
        "compensation": "₹80 LPA – ₹1.5+ Cr ($200k – $450k+ USD)",
        "theory": None,
        "interviewBank": None,
        "missions": [],
        "exerciseDoc": None
    }

    # 1. Parse Theory
    if theory_file.exists():
        with open(theory_file, "r", encoding="utf-8") as f:
            text = f.read()
        title_match = re.search(r'^#\s*(.+)', text, re.MULTILINE)
        title = title_match.group(1).strip() if title_match else "Forward Deployed Engineer (FDE) Master Textbook"
        sections = re.findall(r'^##\s+([^\n]+)', text, re.MULTILINE)
        fde_theory = {
            "id": "24-forward-deployed-engineer-mastery",
            "title": title,
            "fileName": "fde-theory.md",
            "size": len(text),
            "sections": sections,
            "content": text
        }
        fde_package["theory"] = fde_theory

    # 2. Parse Interview Bank
    if bank_file.exists():
        with open(bank_file, "r", encoding="utf-8") as f:
            text = f.read()
        questions = []
        p1 = re.findall(r'###\s+(?:Question|Q)\s*(\d+)[:.]?\s*([^\n]+)\n(.*?)(?=\n###|\n---|\Z)', text, re.DOTALL)
        for q_num, q_title, q_body in p1:
            ans_match = re.search(r'\*\*Answer:\*\*\s*(.*)', q_body, re.DOTALL)
            ans = ans_match.group(1).strip() if ans_match else q_body.strip()
            questions.append({
                "id": f"fde-q{q_num}",
                "num": int(q_num),
                "question": q_title.strip(),
                "answer": ans,
                "category": "forward-deployed-engineer",
                "source": "fde-interview-bank.md"
            })
        fde_bank = {
            "id": "17-forward-deployed-engineer",
            "title": "Forward Deployed Engineer (FDE) 50 Master Questions",
            "fileName": "fde-interview-bank.md",
            "count": len(questions),
            "questions": questions
        }
        fde_package["interviewBank"] = fde_bank

    # 3. Parse Practice Missions
    if practice_file.exists():
        with open(practice_file, "r", encoding="utf-8") as f:
            text = f.read()
        mission_blocks = re.split(r'\n(?=## Mission Lab \d+:)', text)
        missions = []
        for b in mission_blocks:
            m_match = re.match(r'## Mission Lab (\d+):\s*([^\n]+)', b)
            if not m_match:
                continue
            lab_num = int(m_match.group(1))
            lab_title = m_match.group(2).strip()
            scenario_match = re.search(r'\*\*Scenario:\*\*\s*([^\n]+)', b)
            scenario = scenario_match.group(1).strip() if scenario_match else ""
            missions.append({
                "id": f"fde-lab-{lab_num}",
                "num": lab_num,
                "title": lab_title,
                "scenario": scenario,
                "content": b.strip()
            })
        fde_package["missions"] = missions
        fde_package["exerciseDoc"] = {
            "id": "fde-practice-scenarios",
            "title": "Forward Deployed Engineer (FDE) Enterprise Mission Labs",
            "fileName": "fde-practice-scenarios.md",
            "items": [m["title"] for m in missions],
            "content": text
        }

    return fde_package

def parse_3yoe_bank():
    bank_file = FULL_STACK_DIR / "data" / "mern-mean-3yoe-interview-bank.md"
    if not bank_file.exists():
        return None

    with open(bank_file, "r", encoding="utf-8") as f:
        text = f.read()

    mod_blocks = re.split(r'\n(?=# Module \d+:)', text)
    questions = []
    current_topic = "React.js (Deep Internals, Fiber, Hooks & Performance)"

    for mod_block in mod_blocks:
        mod_match = re.match(r'# Module \d+:\s*([^\n]+)', mod_block)
        if mod_match:
            current_topic = mod_match.group(1).strip()

        q_blocks = re.split(r'\n(?=###\s+(?:Question|Q)\s*\d+[:.])', mod_block)
        for qb in q_blocks:
            q_header_match = re.match(r'###\s+(?:Question|Q)\s*(\d+)[:.]?\s*([^\n]+)\n(.*)', qb, re.DOTALL)
            if not q_header_match:
                continue
            q_num = q_header_match.group(1)
            q_title = q_header_match.group(2).strip()
            q_body = q_header_match.group(3).strip()

            ans_match = re.search(r'\*\*Answer:\*\*\s*(.*)', q_body, re.DOTALL)
            ans = ans_match.group(1).strip() if ans_match else q_body.strip()
            ans = re.sub(r'\n---\s*$', '', ans).strip()

            topic_tag = "React"
            if "Redux" in current_topic or "State" in current_topic:
                topic_tag = "Redux"
            elif "Angular" in current_topic or "MEAN" in current_topic:
                topic_tag = "Angular"
            elif "Node" in current_topic or "Express" in current_topic:
                topic_tag = "Node.js"
            elif "Mongo" in current_topic:
                topic_tag = "MongoDB"
            elif "SQL" in current_topic or "PostgreSQL" in current_topic:
                topic_tag = "SQL"
            elif "API" in current_topic or "GraphQL" in current_topic:
                topic_tag = "APIs"
            elif "System Design" in current_topic or "Scenario" in current_topic:
                topic_tag = "System Design"
            elif "Machine Coding" in current_topic or "Polyfill" in current_topic:
                topic_tag = "Machine Coding"
            elif "React" in current_topic:
                topic_tag = "React"

            questions.append({
                "id": f"3yoe-q{q_num}",
                "num": int(q_num),
                "question": q_title.strip(),
                "answer": ans,
                "category": "mern-mean-3yoe",
                "topic": current_topic,
                "topicTag": topic_tag,
                "experience": "3 YOE (SDE-2 Bar)",
                "source": "mern-mean-3yoe-interview-bank.md"
            })

    return {
        "id": "mern-mean-3yoe",
        "title": "3 Years Experienced MERN & MEAN Stack Master Bank",
        "badge": "3 YOE Bar",
        "fileName": "mern-mean-3yoe-interview-bank.md",
        "count": len(questions),
        "questions": questions
    }

def main():
    print(f"Compiling 182-day roadmap starting {START_DATE.strftime('%a, %d %b %Y')} (Tomorrow)...")
    days = parse_roadmap_days()
    print(f"Parsed {len(days)} daily modules with updated dates & time budget (Mon-Fri 2h, Sat-Sun 6h).")

    print("Parsing interview banks...")
    banks = parse_interview_banks()
    total_questions = sum(b["count"] for b in banks)

    print("Parsing dedicated 3 YOE MERN/MEAN Stack Master Bank...")
    three_yoe = parse_3yoe_bank()
    if three_yoe:
        # Prepend 3 YOE bank as premier flagship bank
        banks.insert(0, three_yoe)
        total_questions += three_yoe["count"]
        print(f"Integrated 3 YOE Master Bank ({three_yoe['count']} questions across React, Redux, Angular, Node, Mongo, SQL, APIs, Scenarios, Machine Coding).")

    print("Parsing theory catalog...")
    theories = parse_theory_catalog()
    print(f"Parsed {len(theories)} theory guides.")

    print("Parsing exercises catalog...")
    exercises = parse_exercises_catalog()
    print(f"Parsed {len(exercises)} exercise sets.")

    print("Parsing Forward Deployed Engineer (FDE) package...")
    fde = parse_fde_package()
    if fde["theory"]:
        theories.append(fde["theory"])
        print(f"Integrated FDE Master Textbook ({fde['theory']['size']} bytes, {len(fde['theory']['sections'])} sections).")
    if fde["interviewBank"]:
        banks.append(fde["interviewBank"])
        total_questions += fde["interviewBank"]["count"]
        print(f"Integrated FDE Interview Bank ({fde['interviewBank']['count']} questions).")
    if fde["exerciseDoc"]:
        exercises.append(fde["exerciseDoc"])
        print(f"Integrated FDE Practice Scenarios ({len(fde['missions'])} enterprise mission labs).")

    end_date_str = (START_DATE + datetime.timedelta(days=len(days)-1)).strftime("%a, %d %b %Y")

    data_package = {
        "metadata": {
            "title": "MERN Mastery LMS — 1 CR Product-Company Edition",
            "student": "Harsh Vardhan Gupta",
            "email": "harsh.gupta@getreelax.com",
            "startDate": START_DATE.strftime("%d %b %Y"), # "20 Sep 2026"
            "endDate": end_date_str, # "20 Mar 2027"
            "totalDays": len(days),
            "totalQuestions": total_questions,
            "totalTheories": len(theories),
            "totalExercises": len(exercises),
            "scheduleRule": "Mon-Fri: 2 hrs/day | Sat-Sun: 6 hrs/day (22 hrs/week)",
            "fdeTrackAvailable": True,
            "threeYoeTrackAvailable": True
        },
        "days": days,
        "interviewBanks": banks,
        "threeYoe": three_yoe,
        "theories": theories,
        "exercises": exercises,
        "fde": fde
    }

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(data_package, f, indent=2)
    print(f"Saved JSON data to {OUTPUT_JSON} ({os.path.getsize(OUTPUT_JSON)} bytes)")

    js_content = "/** MERN Mastery LMS Data Engine **/\n"
    js_content += "window.LMS_DATA = " + json.dumps(data_package) + ";\n"

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(js_content)
    print(f"Saved JS data bundle to {OUTPUT_FILE} ({os.path.getsize(OUTPUT_FILE)} bytes)")

if __name__ == "__main__":
    main()


