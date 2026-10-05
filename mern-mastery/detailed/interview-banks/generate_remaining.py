#!/usr/bin/env python3
"""Generate remaining interview Q&A bank files (10c–16) with exactly 50 questions each."""

import os
import sys

OUT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, OUT_DIR)

from generate_banks import write_file
from build_remaining_data import (
    get_sd_prereq,
    expand,
    DIST_QUESTIONS,
    KAFKA_QUESTIONS,
    K8S_QUESTIONS,
    DSA_QUESTIONS,
    MC_QUESTIONS,
    BEHAV_QUESTIONS,
)

if __name__ == "__main__":
    sd_prereq = get_sd_prereq()
    distributed = expand("distributed systems", DIST_QUESTIONS)
    kafka = expand("Kafka and microservices", KAFKA_QUESTIONS)
    kubernetes = expand("Kubernetes and cloud", K8S_QUESTIONS)
    advanced_dsa = expand("advanced DSA", DSA_QUESTIONS)
    machine_coding = expand("machine coding", MC_QUESTIONS)
    behavioral = expand("behavioral STAR", BEHAV_QUESTIONS)
    write_file(
        "10c-sd-prereq-interview-50.md",
        "System Design Prerequisites Interview — 50 Questions",
        "This bank covers caching, load balancing, the CAP (Consistency, Availability, Partition tolerance) theorem, "
        "and back-of-the-envelope estimation—foundational topics for system design interviews at product companies. "
        "Spell out abbreviations on first use.",
        sd_prereq,
    )
    write_file(
        "11-distributed-interview-50.md",
        "Distributed Systems Interview — 50 Questions",
        "This bank covers consistency models, replication, consensus algorithms, and the saga pattern for distributed "
        "systems interviews. Spell out abbreviations on first use.",
        distributed,
    )
    write_file(
        "12-kafka-interview-50.md",
        "Microservices, Kafka, and Event-Driven Architecture Interview — 50 Questions",
        "This bank covers microservices architecture, Apache Kafka, message queues, and event-driven design patterns "
        "for product company interviews. Spell out abbreviations on first use.",
        kafka,
    )
    write_file(
        "13-kubernetes-interview-50.md",
        "Kubernetes, Docker, Cloud, and Observability Interview — 50 Questions",
        "This bank covers Docker containers, Kubernetes orchestration, Amazon Web Services (AWS) basics, and "
        "observability (metrics, logs, traces) for infrastructure interviews. Spell out abbreviations on first use.",
        kubernetes,
    )
    write_file(
        "14-advanced-dsa-interview-50.md",
        "Advanced Data Structures and Algorithms Interview — 50 Questions",
        "This bank covers hard LeetCode patterns, advanced dynamic programming, and graph algorithms for "
        "senior software engineering interviews. Spell out abbreviations on first use.",
        advanced_dsa,
    )
    write_file(
        "15-machine-coding-interview-50.md",
        "Machine Coding Interview — 50 Questions",
        "This bank covers machine coding rounds with classic problems like Splitwise, BookMyShow, and Tic Tac Toe, "
        "including design patterns and implementation strategy. Spell out abbreviations on first use.",
        machine_coding,
    )
    write_file(
        "16-behavioral-interview-50.md",
        "Behavioral Interview (STAR) — 50 Questions",
        "This bank covers behavioral interview questions using the STAR (Situation, Task, Action, Result) method "
        "for senior roles at product companies. Spell out abbreviations on first use.",
        behavioral,
    )
