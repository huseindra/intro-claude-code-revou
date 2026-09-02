#!/usr/bin/env python3
"""
escalate.py

- Reads high_critical_feedback.csv and drafts a Gmail reply for each row,
  addressed to the configured SUPPORT_LEAD_EMAIL.
- Reads other_feedback.csv and appends each row to escalation_log.txt.

Requires the Gmail MCP server (used via the Claude Agent SDK / MCP tool layer).
Run via: python3 escalate.py
"""

import csv
import datetime
import os
import textwrap

HIGH_CRITICAL_FILE = "high_critical_feedback.csv"
OTHER_FILE = "other_feedback.csv"
LOG_FILE = "escalation_log.txt"

SUPPORT_LEAD_EMAIL = os.environ.get("SUPPORT_LEAD_EMAIL", "hello.monago@gmail.com")


def draft_subject(row: dict) -> str:
    severity_tag = f"[{row['severity'].upper()}]"
    topic_tag = f"[{row['topic'].replace('_', ' ').title()}]"
    return f"{severity_tag} {topic_tag} Customer feedback – {row['name']} (ID {row['id']})"


def draft_body(row: dict) -> str:
    return textwrap.dedent(f"""\
        Hi Support Team,

        A {row['severity'].upper()}-severity customer feedback item requires immediate attention.

        ── Details ──────────────────────────────
        ID        : {row['id']}
        Date      : {row['date']}
        Customer  : {row['name']} <{row['email']}>
        Channel   : {row['channel']}
        Topic     : {row['topic']}
        Severity  : {row['severity']}
        Sentiment : {row['sentiment']}

        ── Message ──────────────────────────────
        {row['message']}
        ─────────────────────────────────────────

        Please triage and respond to the customer within the SLA for {row['severity']} issues.

        This message was generated automatically by the feedback escalation pipeline.
    """)


def log_other(rows: list[dict]) -> None:
    timestamp = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(f"\n{'='*60}\n")
        f.write(f"Logged at {timestamp} — {len(rows)} non-escalated items\n")
        f.write(f"{'='*60}\n")
        for row in rows:
            f.write(
                f"[{row['id']:>2}] {row['date']}  {row['severity']:<6}  "
                f"{row['topic']:<14}  {row['sentiment']:<8}  {row['name']}\n"
                f"     {row['message'][:120]}{'…' if len(row['message']) > 120 else ''}\n\n"
            )
    print(f"Logged {len(rows)} non-escalated rows → {LOG_FILE}")


def read_csv(path: str) -> list[dict]:
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def build_drafts(rows: list[dict]) -> list[dict]:
    """Return list of draft payloads (to, subject, body) ready to send."""
    return [
        {
            "to": [SUPPORT_LEAD_EMAIL],
            "subject": draft_subject(row),
            "body": draft_body(row),
        }
        for row in rows
    ]


def main() -> None:
    escalations = read_csv(HIGH_CRITICAL_FILE)
    others = read_csv(OTHER_FILE)

    drafts = build_drafts(escalations)

    print(f"Escalations (high/critical): {len(escalations)}")
    for i, d in enumerate(drafts, 1):
        print(f"  Draft {i}: {d['subject']}")

    # Log non-escalated rows
    log_other(others)

    return drafts  # returned so the caller (Claude tool layer) can send via Gmail MCP


if __name__ == "__main__":
    result = main()
    if result:
        print(
            "\nDrafts are ready. Pass them to the Gmail MCP tool (mcp__Gmail__create_draft) "
            "or run send_escalations() from an MCP-enabled context."
        )
