import contextlib
import io
import os
from pathlib import Path
import runpy
import sys
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import Mock, patch

import yaml


SCRIPT = Path(__file__).resolve().parents[1] / "bin/update_scholar_citations.py"


class CitationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        previous = Path.cwd()
        os.chdir(self.temp.name)
        self.addCleanup(os.chdir, previous)
        Path("_data").mkdir()
        Path("_data/socials.yml").write_text("scholar_userid: demo\n")
        self.output = Path("_data/citations.yml")
        self.scholar = Mock()
        self.scholar.fill.return_value = {
            "publications": [
                {
                    "author_pub_id": "demo:paper",
                    "bib": {"title": "Example paper", "pub_year": "2026"},
                    "num_citations": 3,
                }
            ]
        }
        with patch.dict(sys.modules, {"scholarly": SimpleNamespace(scholarly=self.scholar)}):
            self.update = runpy.run_path(str(SCRIPT))["get_scholar_citations"]

    def test_creates_or_recovers_cache(self):
        for cached in (None, "papers: [broken", "- not a mapping", "metadata: null"):
            with self.subTest(cached=cached), contextlib.redirect_stdout(io.StringIO()):
                self.output.unlink(missing_ok=True)
                if cached is not None:
                    self.output.write_text(cached)
                self.update()
                saved = yaml.safe_load(self.output.read_text())
                self.assertEqual(saved["papers"]["demo:paper"]["citations"], 3)

    def test_unchanged_citations_do_not_rewrite_cache(self):
        cached = {
            "metadata": {"last_updated": "2000-01-01"},
            "papers": {
                "demo:paper": {"title": "Example paper", "year": "2026", "citations": 3}
            },
        }
        self.output.write_text(yaml.safe_dump(cached))
        before = self.output.read_bytes()
        with contextlib.redirect_stdout(io.StringIO()):
            self.update()
        self.assertEqual(self.output.read_bytes(), before)

    def test_failed_fetch_preserves_cache(self):
        self.output.write_text("papers: {}\n")
        before = self.output.read_bytes()
        self.scholar.search_author_id.side_effect = TimeoutError("offline")
        with contextlib.redirect_stdout(io.StringIO()), self.assertRaises(SystemExit) as failure:
            self.update()
        self.assertEqual(failure.exception.code, 1)
        self.assertEqual(self.output.read_bytes(), before)
