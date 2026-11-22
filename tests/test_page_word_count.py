"""构建时字数：两个生成器采用同一套中英文计数口径。"""
import importlib.util
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
GENERATORS = (
    "site-v2/first-layer/rules-page/demo/build.py",
    "site-v2/first-layer/principles-page/source/generator/generate.py",
)


class PageWordCountTests(unittest.TestCase):
    def counters(self):
        for path in GENERATORS:
            spec = importlib.util.spec_from_file_location("page_generator", ROOT / path)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            yield path, module.count_words

    def test_mixed_chinese_english_and_numbers(self):
        for path, count in self.counters():
            with self.subTest(generator=path):
                self.assertEqual(count("我的 AI 约法 E442，2026 年"), 8)
                self.assertEqual(count("Claude E442 2026 中文"), 5)

    def test_punctuation_whitespace_and_extended_han(self):
        for path, count in self.counters():
            with self.subTest(generator=path):
                self.assertEqual(count(" \n，。——/@#$% 😀"), 0)
                self.assertEqual(count("AI2026，A-B 中文𠀀"), 6)


if __name__ == "__main__":
    unittest.main()
