#!/usr/bin/env python3
"""Tests for label_feedback.py classification logic."""

import csv
import io
import unittest

from label_feedback import first_match, label_row, SENTIMENT_RULES, TOPIC_RULES, SEVERITY_RULES


def make_row(message: str, **kwargs) -> dict:
    base = {"id": "0", "date": "2026-01-01", "name": "Test", "email": "t@t.com", "channel": "email"}
    base.update(kwargs)
    base["message"] = message
    return base


class TestSentiment(unittest.TestCase):
    def test_positive(self):
        self.assertEqual(first_match("Great app, love it!", SENTIMENT_RULES), "positive")

    def test_negative(self):
        self.assertEqual(first_match("This is unacceptable and I will cancel.", SENTIMENT_RULES), "negative")

    def test_neutral(self):
        self.assertEqual(first_match("Quick question, does the Pro plan include this?", SENTIMENT_RULES), "neutral")

    def test_defaults_other(self):
        self.assertEqual(first_match("I updated my profile.", SENTIMENT_RULES), "other")


class TestTopic(unittest.TestCase):
    def test_privacy(self):
        self.assertEqual(first_match("I could see another customer's invoices.", TOPIC_RULES), "privacy")

    def test_billing(self):
        self.assertEqual(first_match("I was charged twice this month.", TOPIC_RULES), "billing")

    def test_auth(self):
        self.assertEqual(first_match("I cannot log in to my account.", TOPIC_RULES), "auth")

    def test_data_loss(self):
        self.assertEqual(first_match("All my projects have disappeared.", TOPIC_RULES), "data_loss")

    def test_bug(self):
        self.assertEqual(first_match("The editor crashes every time.", TOPIC_RULES), "bug")

    def test_feature_req(self):
        self.assertEqual(first_match("Would love dark mode for late nights.", TOPIC_RULES), "feature_req")

    def test_performance(self):
        self.assertEqual(first_match("The page takes thirty seconds to load.", TOPIC_RULES), "performance")

    def test_support(self):
        self.assertEqual(first_match("My support ticket has had no reply in four days.", TOPIC_RULES), "support")


class TestSeverity(unittest.TestCase):
    def test_critical_privacy(self):
        self.assertEqual(first_match("I could see another customer's data. Serious privacy issue.", SEVERITY_RULES), "critical")

    def test_critical_double_charge(self):
        self.assertEqual(first_match("I was charged twice and it put my card over the limit.", SEVERITY_RULES), "critical")

    def test_critical_gdpr(self):
        self.assertEqual(first_match("Please delete all of my personal data from your systems.", SEVERITY_RULES), "critical")

    def test_high_data_loss(self):
        self.assertEqual(first_match("Three days of work have disappeared. I am panicking.", SEVERITY_RULES), "high")

    def test_high_login(self):
        self.assertEqual(first_match("I cannot log in and have a client presentation in two hours.", SEVERITY_RULES), "high")

    def test_high_cancellation_threat(self):
        self.assertEqual(first_match("If this happens again I am cancelling our team plan.", SEVERITY_RULES), "high")

    def test_medium_crash(self):
        self.assertEqual(first_match("The editor crashes when I paste a table.", SEVERITY_RULES), "medium")

    def test_medium_slow(self):
        self.assertEqual(first_match("Reports take thirty seconds to load.", SEVERITY_RULES), "medium")

    def test_low_typo(self):
        self.assertEqual(first_match("There is a typo on the billing page.", SEVERITY_RULES), "low")

    def test_low_feature(self):
        self.assertEqual(first_match("Would love a dark mode option.", SEVERITY_RULES), "low")

    def test_low_positive(self):
        self.assertEqual(first_match("Fantastic onboarding flow, keep up the great work!", SEVERITY_RULES), "low")


class TestLabelRow(unittest.TestCase):
    def test_full_row_critical(self):
        row = make_row("I was charged twice and it put my card over the limit. Unacceptable.")
        labeled = label_row(row)
        self.assertEqual(labeled["severity"], "critical")
        self.assertEqual(labeled["sentiment"], "negative")
        self.assertEqual(labeled["topic"], "billing")

    def test_full_row_positive(self):
        row = make_row("Just want to say the new onboarding flow is fantastic!")
        labeled = label_row(row)
        self.assertEqual(labeled["severity"], "low")
        self.assertEqual(labeled["sentiment"], "positive")

    def test_label_row_adds_all_keys(self):
        row = make_row("Something happened.")
        labeled = label_row(row)
        self.assertIn("sentiment", labeled)
        self.assertIn("topic", labeled)
        self.assertIn("severity", labeled)


class TestEscalateHelpers(unittest.TestCase):
    """Tests for escalate.py draft generation."""

    def setUp(self):
        from escalate import draft_subject, draft_body, build_drafts
        self.draft_subject = draft_subject
        self.draft_body = draft_body
        self.build_drafts = build_drafts

    def _sample_row(self, severity="critical", topic="billing"):
        return {
            "id": "1", "date": "2026-06-22", "name": "Ada Lovelace",
            "email": "ada@example.com", "channel": "email",
            "message": "Charged twice.", "sentiment": "negative",
            "topic": topic, "severity": severity,
        }

    def test_subject_contains_severity_and_name(self):
        row = self._sample_row()
        subj = self.draft_subject(row)
        self.assertIn("CRITICAL", subj)
        self.assertIn("Ada Lovelace", subj)

    def test_body_contains_message(self):
        row = self._sample_row()
        body = self.draft_body(row)
        self.assertIn("Charged twice.", body)
        self.assertIn("critical", body.lower())

    def test_build_drafts_count(self):
        rows = [self._sample_row("critical"), self._sample_row("high")]
        drafts = self.build_drafts(rows)
        self.assertEqual(len(drafts), 2)
        for d in drafts:
            self.assertIn("to", d)
            self.assertIn("subject", d)
            self.assertIn("body", d)


if __name__ == "__main__":
    unittest.main(verbosity=2)
