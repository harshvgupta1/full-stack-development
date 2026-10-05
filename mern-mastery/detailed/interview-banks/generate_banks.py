#!/usr/bin/env python3
"""Generate interview Q&A bank files with exactly 50 questions each."""

import os

OUT_DIR = os.path.dirname(os.path.abspath(__file__))


def write_file(filename, title, intro, qa_list):
    assert len(qa_list) == 50, f"{filename}: expected 50 Q&A, got {len(qa_list)}"
    lines = [f"# {title}\n", f"{intro}\n"]
    for i, (q, a) in enumerate(qa_list, 1):
        lines.append(f"## {i}. {q}\n")
        lines.append(f"{a}\n")
    path = os.path.join(OUT_DIR, filename)
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"Created {filename} ({len(qa_list)} questions)")


from _banks_data import lld, sd  # noqa: E402

if __name__ == "__main__":
    write_file("09-lld-interview-50.md", "Low Level Design Interview — 50 Questions",
                 "This bank covers object-oriented design, design patterns, SOLID principles, and classic "
                 "Low Level Design (LLD) problems asked at product companies. Spell out abbreviations on first use.",
                 lld)
    write_file("10-system-design-interview-50.md", "System Design Interview — 50 Questions",
                 "This bank covers High Level Design (HLD), scalability, databases, caching, and classic "
                 "system design problems for product company interviews. Spell out abbreviations on first use.",
                 sd)
