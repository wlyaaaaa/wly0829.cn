import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { pcconfigGallery } from "../app/pcconfig-gallery.js";
import { pcconfigProject, pcconfigModules } from "../app/content-pcconfig.js";

test("PCConfig gallery preserves ten unique owner-selected original PNGs", async () => {
  assert.equal(pcconfigGallery.length, 10);
  assert.equal(new Set(pcconfigGallery.map(image => image.originalSha256)).size, 10);
  for (const image of pcconfigGallery) {
    const data = await readFile(new URL(`../public${image.src}`, import.meta.url));
    assert.equal(createHash("sha256").update(data).digest("hex"), image.originalSha256);
    assert.equal(data.length, image.originalBytes);
    assert.equal(data.readUInt32BE(16), image.width); assert.equal(data.readUInt32BE(20), image.height);
    assert.equal(image.evidenceLabel, "本人提供的真实界面");
  }
});

test("gallery explains phone screenshot protection and scopes private browser use to Account", async () => {
  assert.match(pcconfigProject.galleryPresentation.description, /手机密码中心使用指纹解锁.*防截屏\/录屏.*不展示手机截图/);
  const account = pcconfigGallery.find(image => image.src.includes("account-private-window"));
  assert.match(account.caption, /账号验证.*隔离的无痕浏览器.*回调绑定该验证窗口/);
  assert.match(JSON.stringify(pcconfigModules), /这条说明只针对 Account 账号验证/);
  const html = await readFile(new URL("../dist/projects/pcconfig/index.html", import.meta.url), "utf8");
  for (const image of pcconfigGallery) assert.ok(html.includes(image.src));
});

test("project preview separates contextual gallery navigation from direct image enlargement", async () => {
  for (const slug of ["pcconfig", "personal-media", "agents"]) {
    const html = await readFile(new URL(`../dist/projects/${slug}/index.html`, import.meta.url), "utf8");
    if (!html.includes('class="project-result-preview"')) continue;
    assert.match(html, /class="project-result-gallery-link" href="#project-gallery">查看画廊与说明/);
    assert.match(html, /class="project-result-preview-image" href="\/[^\"]+" data-project-gallery-preview=""/);
    assert.equal((html.match(/id="project-gallery"/g) || []).length, 1, `${slug} must resolve to its own gallery`);
    assert.equal((html.match(/id="project-gallery-title"/g) || []).length, 1, `${slug} must have an unambiguous heading`);
  }
});
