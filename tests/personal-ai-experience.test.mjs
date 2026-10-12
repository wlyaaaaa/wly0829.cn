import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { personalAiImages, personalCodexTotal, personalCodexTotalLabel } from "../app/personal-ai-experience.js";

test("personal experience preserves 11 unique original images, with only five independent Codex records in the total", async () => {
  assert.equal(personalAiImages.length, 11);
  assert.equal(new Set(personalAiImages.map(image => image.originalSha256)).size, 11);
  assert.equal((await readdir(new URL("../public/images/personal-ai-experience/", import.meta.url))).length, 11);
  assert.deepEqual(personalAiImages.slice(0, 5).map(image => image.platform), Array(5).fill("Codex"));
  assert.equal(personalAiImages.slice(5).some(image => image.codexHundredMillion !== null), false);
  assert.equal(personalCodexTotal, 1921.1);
  assert.equal(personalCodexTotalLabel, "1,921.1");
  for (const image of personalAiImages) {
    const bytes = await readFile(new URL(`../public${image.src}`, import.meta.url));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), image.originalSha256);
    assert.equal(bytes.length, image.originalBytes);
    if (image.src.endsWith(".png")) {
      assert.equal(bytes.readUInt32BE(16), image.width);
      assert.equal(bytes.readUInt32BE(20), image.height);
    }
  }
  const opencode = personalAiImages.filter(image => image.platform === "OpenCode");
  assert.equal(opencode.length, 1);
  assert.match(opencode[0].caption, /105\.0M.*1,170/);
  assert.match(personalAiImages.find(image => image.platform === "Qwen").caption, /43,094K（43,094,000）/);
});
