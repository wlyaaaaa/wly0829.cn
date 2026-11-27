import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";
const read = name => readFile(new URL(`../${name}`, import.meta.url), "utf8");
const settings = JSON.parse(await read("site-v2/site-assembly/站点设置.json"));
const catalog = await read("site-v2/trial/first-projects/表/归属表.md");
function rows(title) {
  return catalog.split(`## ${title}`)[1].split(/^## /m)[0].split("\n")
    .filter(line => line.startsWith("|")).slice(2)
    .map(line => line.split("|").slice(1, -1).map(value => value.trim()));
}

// 名册里标 hidden 的项目不给访客看，静态站不发布（网站项目 ID 不同名的照实况封面对照表认）。
async function hiddenProjects() {
  const roster = JSON.parse(await readFile(process.env.WLY_WEBSITE_PROJECTS || "E:/PCConfig/registries/website-projects.json", "utf8")).entries
    .filter(entry => entry.website?.visibility === "hidden");
  const keys = new Set(roster.map(entry => entry.repo.split("/").pop().toLowerCase()));
  const names = new Set(roster.map(entry => entry.website.display_name));
  const links = JSON.parse(await read("site-v2/live/project/cover-links.json"));
  return new Set(rows("项目表").filter(row => keys.has(row[0].toLowerCase()) || keys.has((links[row[0]] || "").toLowerCase()) || names.has(row[1])).map(row => row[0]));
}

test("new project and skill cards preserve current identities, order and counts", async () => {
  const hidden = await hiddenProjects();
  const projects = rows("项目表").filter(row => ["做完", "要做"].includes(row[2]) && !hidden.has(row[0]));
  const projectIds = new Set(projects.map(row => row[0]));
  const skills = rows("技能表").filter(row => ["做完", "要做"].includes(row[4]) && projectIds.has(row[2]));
  for (const [route, prefix, selected, order] of [
    ["projects", "p", projects, settings["项目先后"]],
    ["skills", "s", skills, settings["技能先后"]]
  ]) {
    const html = await read(`dist/${route}/index.html`);
    const cards = [...html.matchAll(new RegExp(`<a\\b[^>]*id="${prefix}-([^"]+)"[^>]*href="([^"]+)"`, "g"))];
    const expected = selected.map(row => row[0]);
    const ordered = order.filter(id => expected.includes(id));
    assert.equal(cards.length, selected.length, `${route} card count`);
    assert.equal(new Set(cards.map(card => card[1])).size, cards.length, `${route} duplicate cards`);
    assert.deepEqual(cards.map(card => card[1]).sort(), expected.sort(), `${route} identities`);
    assert.deepEqual(cards.slice(0, ordered.length).map(card => card[1]), ordered, `${route} configured order`);
    for (const [, id, href] of cards) {
      assert.ok(href.startsWith("/") && href.endsWith(".html"), `${id} has a real page`);
      assert.match(await read(`dist${href}`), /<main[\s>]/, id);
    }
  }
});

test("home buttons point to the configured public entry pages", async () => {
  const context = { window: {} };
  vm.runInNewContext(await read("dist/config.js"), context);
  const config = context.window.HOME_CONFIG;
  assert.deepEqual({ ...config.links }, settings["首页按钮"]);
  assert.equal(new Set(config.buttons.map(button => button.id)).size, config.buttons.length);
  for (const button of config.buttons) {
    const href = config.links[button.id];
    assert.ok(href?.startsWith("/") && href.endsWith("/"), button.id);
    assert.match(await read(`dist${href}index.html`), /<main[\s>]/, button.id);
  }
});
