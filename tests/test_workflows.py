import fnmatch
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

import yaml


ROOT = Path(__file__).resolve().parents[1]
BASH = r"C:\Program Files\Git\bin\bash.exe" if os.name == "nt" else "bash"


def workflow(name):
    return yaml.load(
        (ROOT / ".github/workflows" / name).read_text(encoding="utf-8"),
        Loader=yaml.BaseLoader,
    )


class WorkflowTests(unittest.TestCase):
    def test_generated_updates_trigger_deployment(self):
        deploy = workflow("deploy.yml")
        trigger = deploy["on"]["workflow_run"]
        self.assertEqual(trigger["types"], ["completed"])
        for name in ("render-cv.yml", "update-citations.yml"):
            generated = workflow(name)
            self.assertIn(generated["name"], trigger["workflows"])
        self.assertEqual(set(trigger["branches"]), {"main", "master"})

    def test_plugin_and_regression_changes_trigger_build(self):
        for event in ("push", "pull_request"):
            patterns = workflow("deploy.yml")["on"][event]["paths"]
            for path in ("_plugins/external-posts.rb", "bin/update_scholar_citations.py", "tests/test_citations.py"):
                matched = False
                for pattern in patterns:
                    if fnmatch.fnmatchcase(path, pattern.lstrip("!")):
                        matched = not pattern.startswith("!")
                self.assertTrue(matched, f"{event} ignores {path}")

    def test_citation_step_propagates_failures_and_timeouts(self):
        steps = workflow("update-citations.yml")["jobs"]["update-citations"]["steps"]
        script = next(step["run"] for step in steps if step.get("id") == "run_citation_update")
        with tempfile.TemporaryDirectory() as directory:
            env = dict(os.environ, GITHUB_STEP_SUMMARY=(Path(directory) / "summary").as_posix())
            for status in (0, 1, 124):
                with self.subTest(status=status):
                    result = subprocess.run(
                        [BASH, "-c", f"timeout() {{ return {status}; }}\n{script}"],
                        env=env, capture_output=True, text=True, encoding="utf-8",
                    )
                    self.assertEqual(result.returncode, status, result.stderr)

    def test_startup_preserves_local_lockfile_edits(self):
        startup = (ROOT / "bin/entry_point.sh").read_text().split("start_jekyll()", 1)[0]
        with tempfile.TemporaryDirectory() as directory:
            env = dict(os.environ, GIT_CONFIG_GLOBAL=(Path(directory) / "gitconfig").as_posix())
            subprocess.run(["git", "init", "-q", directory], check=True, env=env)
            lockfile = Path(directory) / "Gemfile.lock"
            lockfile.write_text("original\n")
            subprocess.run(["git", "add", "Gemfile.lock"], cwd=directory, env=env, check=True)
            lockfile.write_text("local dependency update\n")
            subprocess.run(
                [BASH, "-c", startup + "\nmanage_gemfile_lock\n"],
                cwd=directory, env=env, check=True, capture_output=True,
            )
            self.assertEqual(lockfile.read_text(), "local dependency update\n")

    def test_cv_workflow_succeeds_when_output_is_unchanged(self):
        steps = workflow("render-cv.yml")["jobs"]["rendercv"]["steps"]
        script = next(step["run"] for step in steps if step.get("name") == "Push the changes")
        script = script.replace("${{ github.actor }}", "test")
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory) / "repo"
            env = dict(os.environ, GIT_CONFIG_GLOBAL=(Path(directory) / "gitconfig").as_posix())
            subprocess.run(["git", "init", "-q", str(repo)], check=True, env=env)
            result = subprocess.run(
                [BASH, "-e", "-c", script], cwd=repo, env=env, capture_output=True,
            )
            self.assertEqual(result.returncode, 0, result.stderr)
