#!/usr/bin/env python3
"""
label_feedback.py

Reads feedback.csv, labels each row with sentiment, topic, and severity,
then writes two output files:
  - high_critical_feedback.csv  (severity: high or critical)
  - other_feedback.csv          (severity: low or medium)
"""

import csv
import re

INPUT_FILE = "feedback.csv"
HIGH_CRITICAL_FILE = "high_critical_feedback.csv"
OTHER_FILE = "other_feedback.csv"

# ── Classification rules ──────────────────────────────────────────────────────

TOPIC_RULES = [
    ("privacy",      r"privacy|another customer|other customer|personal data|gdpr|regulation"),
    ("auth",         r"log.?in|login|session|password|access"),
    ("data_loss",    r"disappear|lost|gone|recover|missing"),
    ("outage",       r"outage|down|unavailable|cannot.*work|blocking"),
    ("billing",      r"charg|billing|invoice|payment|refund|subscri|annual plan|revenue report|pricing"),
    ("bug",          r"crash|bug|error|broken|fail|reset|cuts off|logging me out|typo|notification"),
    ("performance",  r"slow|load|thirty second|snappier|speed"),
    ("feature_req",  r"would love|wish|suggestion|request|dark mode|keyboard shortcut|widget|integration|google sheets"),
    ("ux",           r"confus|unclear|walkthrough|onboarding|docs|example|a bit lost"),
    ("support",      r"ticket|reply|response time|support agent"),
    ("positive",     r"great|love|fantastic|thank|kind|snappier"),
]

SENTIMENT_RULES = [
    ("positive", r"great|love|fantastic|thank|wonderful|kind|snappier|keep up"),
    ("negative", r"unacceptable|panic|disappoint|cannot|serious|problem|urgent|worst|terrible|cancel|frustrated|not match"),
    ("neutral",  r"question|does.*include|quick question|a bit|would be nice|not urgent|small thing"),
]

# severity order: critical > high > medium > low
SEVERITY_RULES = [
    ("critical", r"privacy|another customer|other customer|personal data|serious privacy|data breach|charg.*twice|charged twice|duplicate.*charge|put my card|delete.*personal|request.*delete"),
    ("high",     r"panic|disappear.*work|three days.*work|cannot log in|client presentation|cancell|outage.*third|payment.*fail|numbers.*not match|trust.*figure"),
    ("medium",   r"crash|bug|fail|disappoint|ticket.*no.*repl|logging me out|cannot.*upgrade|slow|thirty second|report.*load|confus|notification|cuts off"),
    ("low",      r"would love|wish|suggestion|dark mode|keyboard shortcut|widget|integration|typo|small thing|quick question|unclear|a bit lost|walkthrough|docs.*thin|thank|great|love|fantastic|keep up"),
]


def first_match(text, rules):
    low = text.lower()
    for label, pattern in rules:
        if re.search(pattern, low):
            return label
    return "other"


def label_row(row):
    msg = row["message"]
    row["sentiment"] = first_match(msg, SENTIMENT_RULES)
    row["topic"]     = first_match(msg, TOPIC_RULES)
    row["severity"]  = first_match(msg, SEVERITY_RULES)
    return row


def main():
    with open(INPUT_FILE, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = [label_row(row) for row in reader]
        fieldnames = reader.fieldnames + ["sentiment", "topic", "severity"]

    high_critical = [r for r in rows if r["severity"] in ("high", "critical")]
    other         = [r for r in rows if r["severity"] not in ("high", "critical")]

    def write_csv(path, data):
        with open(path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(data)
        print(f"  {path}: {len(data)} rows")

    print(f"Total rows labeled: {len(rows)}")
    write_csv(HIGH_CRITICAL_FILE, high_critical)
    write_csv(OTHER_FILE, other)

    # Quick summary table
    print("\n── Labeled feedback ──")
    print(f"{'ID':<4} {'Severity':<10} {'Topic':<14} {'Sentiment':<10} Name")
    print("-" * 65)
    for r in rows:
        print(f"{r['id']:<4} {r['severity']:<10} {r['topic']:<14} {r['sentiment']:<10} {r['name']}")


if __name__ == "__main__":
    main()
