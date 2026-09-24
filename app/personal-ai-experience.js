// Owner-selected original screenshots, published with permission on 2026-09-24.
// The five Codex records are independent; other platforms are never added to them.
export const personalAiSnapshotDate = "2026年9月24日";

const originals = [
  ["codex-521-9.png", "Codex", "521.9 亿 tokens", "Codex 累计 521.9 亿 tokens · @wlyaaaaaa", 521.9, 1429, 1344, "f4fb47d115f3ef8be260715a23b821a77c922f760ac4e9b2e7a58285d59e5ea7", 199488],
  ["codex-204-4.png", "Codex", "204.4 亿 tokens", "Codex 累计 204.4 亿 tokens · @3544768219", 204.4, 2110, 1975, "ebe3973aebaf4b6a4a3f2ecf0a178f1bbb2855028ee1668ee5379d01ff33c322", 285634],
  ["codex-296-5.png", "Codex", "296.5 亿 tokens", "Codex 累计 296.5 亿 tokens · @2490850763", 296.5, 1552, 1415, "1fb1f26017656bf596b8b1cab78359ad4f257575d186378ec9adb86826e15dae", 166983],
  ["codex-378-2.png", "Codex", "378.2 亿 tokens", "Codex 累计 378.2 亿 tokens · @1097909459", 378.2, 1483, 1303, "73e89a23064580fb13bb6eb801191d1fdda1702deee3ef453657d692c48a556d", 130589],
  ["codex-520-1.png", "Codex", "520.1 亿 tokens", "Codex 累计 520.1 亿 tokens · @1614300037", 520.1, 1360, 1270, "8be6f92fd6f31701c7cc9b6eda59df3b6d10bd35a500baa08a744f8e2ac82733", 130949],
  ["glm-zcode.png", "GLM / ZCode", "2.2 亿 tokens", "GLM / ZCode：这次可展示的统计为 2.2 亿 tokens。", null, 1402, 2083, "6c767bb1b816e45d186ccec8ab62314ab2b09fbf266277cd6508a4e55a1e9076", 268927],
  ["deepseek.png", "DeepSeek", "9,383,373 tokens", "DeepSeek：9,383,373 tokens，截图选择的是当月统计。", null, 1401, 1784, "a9b8105cf65a8163fbdc3313888ec940a878b36c2206d424b4ceff2447f2178c", 185825],
  ["qwen.png", "Qwen", "43,094K tokens", "Qwen：43,094K（43,094,000）tokens，2026-08-25 至 2026-09-24。", null, 3492, 1526, "74f0b0e387a18982b72b071583c91792db714e154d2449f591d18074d50f9f9c", 274133],
  ["opencode.png", "OpenCode", "105.0M tokens", "OpenCode：105.0M tokens、1,170 次请求。", null, 1647, 1761, "1e8e5db108515fb7523f0f79e125a8762c8e2986b67c15bda350822e0d956db6", 221124],
  ["antigravity.png", "Google Antigravity", "订阅与使用界面", "Google Antigravity 的 Google AI Pro 订阅与额度界面，没有累计 token 数。", null, 1548, 1080, "2481d05769e5d70be930b03313d788deadf9dfd5ee678c665288b05e878ee21e", 134789],
  ["grok.jpg", "Grok", "订阅界面", "Grok 的 SuperGrok Lite 订阅界面，没有累计 token 数。", null, 1440, 3200, "f2c2e685948d9eee310276e657ef5084f011a982fbcd058476b66e33ee96e0d7", 277333]
];

export const personalAiImages = originals.map(([file, platform, value, caption, codexHundredMillion, width, height, originalSha256, originalBytes]) => ({
  src: `/images/personal-ai-experience/${file}`,
  platform, value, caption, codexHundredMillion, width, height, originalSha256, originalBytes,
  alt: caption,
  categoryLabel: platform === "Codex" ? "Codex · 我的独立累计记录" : `${platform} · 我的使用记录`
}));
export const personalCodexTotal = personalAiImages.reduce((total, image) => total + Math.round((image.codexHundredMillion || 0) * 10), 0) / 10;
export const personalCodexTotalLabel = personalCodexTotal.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
