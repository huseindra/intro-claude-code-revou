# Feedback Sentiment Labeling & Escalation Pipeline

A lightweight Python pipeline that reads raw customer feedback, classifies each row by sentiment, topic, and severity, escalates high-priority items via email, and logs the rest to a file.

---

## Overview

| Step | Script | Output |
|------|--------|--------|
| 1. Label | `label_feedback.py` | `high_critical_feedback.csv`, `other_feedback.csv` |
| 2. Escalate | `escalate.py` | Gmail drafts + `escalation_log.txt` |
| 3. Test | `test_label_feedback.py` | 29 unit tests |

---

## Files

```
.
├── feedback.csv                 # Raw input: 26 customer feedback rows
├── label_feedback.py            # Labels each row with sentiment, topic, severity
├── high_critical_feedback.csv   # Output: 8 rows with severity high or critical
├── other_feedback.csv           # Output: 18 rows with severity low or medium
├── escalate.py                  # Drafts escalation emails and logs non-escalated rows
├── escalation_log.txt           # Append-only log of non-escalated items
├── test_label_feedback.py       # Unit tests for classification and draft logic
└── .gitignore
```

---

## Labels

### Sentiment
| Value | Meaning |
|-------|---------|
| `positive` | Praise, thanks, satisfaction |
| `negative` | Frustration, urgency, complaints |
| `neutral` | Questions, minor notes |
| `other` | Does not match any pattern |

### Topic
`billing` · `auth` · `data_loss` · `privacy` · `outage` · `bug` · `performance` · `feature_req` · `ux` · `support` · `positive`

### Severity
| Value | Examples |
|-------|---------|
| `critical` | Privacy breach, double charge, GDPR data deletion request |
| `high` | Login failure, data loss, cancellation threat, payment failure, report mismatch |
| `medium` | Crashes, slow load, unanswered tickets, auth bugs |
| `low` | Feature requests, typos, positive feedback, general questions |

---

## Usage

### 1. Label feedback

```bash
python3 label_feedback.py
```

Reads `feedback.csv` and writes:
- `high_critical_feedback.csv` — severity `high` or `critical`
- `other_feedback.csv` — severity `low` or `medium`

Prints a summary table to stdout.

### 2. Run escalations

```bash
# Optional: set the support lead email (defaults to hello.monago@gmail.com)
export SUPPORT_LEAD_EMAIL=support-lead@yourcompany.com

python3 escalate.py
```

- Builds one Gmail draft per high/critical row addressed to `SUPPORT_LEAD_EMAIL`
- Appends all non-escalated rows to `escalation_log.txt`

> **Note:** `escalate.py` generates the draft payloads. Actual sending requires the Gmail MCP tool (used via Claude Agent SDK). Drafts appear in the connected Gmail account's Drafts folder and must be sent from there.

### 3. Run tests

```bash
python3 -m unittest test_label_feedback -v
```

29 tests covering sentiment, topic, severity classification, full `label_row` output, and draft generation.

---

## Input Format

`feedback.csv` must have these columns:

```
id, date, name, email, channel, message
```

Supported channels: `email`, `in-app`, `chat`, `app-store`, `twitter`

---

## Results (sample run — 26 rows)

| Severity | Count | Customers |
|----------|-------|-----------|
| critical | 3 | Andre Wijaya, Daniel Hutapea, Maya Sari |
| high | 5 | Siti Rahmawati, Bayu Pratama, Clara Tanuwijaya, Arif Setiawan, Bagus Santoso |
| medium | 8 | Mega Lestari, Rizky Ananda, Putri Maharani, Fajar Nugroho, Indah Permata, Nadia Kusuma, Dewi Anggraini, Lia Susanti |
| low | 10 | Hendra Saputra, Tomy Halim, Vina Oktaviani, Galih Pranoto, Sherly Wibowo, Reza Firmansyah, Yoga Mahendra, Eko Prasetyo, Ratna Dewi, Wulan Safitri |

---

## Requirements

- Python 3.10+
- No external dependencies (standard library only)
- Gmail MCP server (for escalate.py email drafting, optional)
