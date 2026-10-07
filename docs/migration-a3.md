# 活画与小鸟迁入清单

本次只收源和核对文件；没有修改生成入口、启用带路、合并或发布。`config/build.json` 是当前 `2g-assemble/recipe.json` 的相对路径草稿，路径以仓库根为基准，尚未交给现有入口消费。

- `src/runtime/living/src/`、`tools/`：原 p2 引擎四个源文件和 22 个工具，原样保存；`native08/` 是 `b613070` 使用的冻结引擎，`step1-source/` 保留它实际读取的第一步源。
- `sources/living/`：按有效艺术映射选出的 49 组配置、50 张母图、128 张首屏基准图、横竖遮罩及引用的精灵；保留原艺术映射、合同、覆盖和排序输入。原映射文件本身没有改写。
- `src/runtime/bird/src/`：`b613070` 实际编译的鸟源码及带路能力源码；运行配置沿用第一步被动包，`guide` 不启用。`original/` 与 `step1-source/` 是工具确实读取的原始输入。
- `src/runtime/bird/tools/`：原六个工具、原生姿态图集生成工具，以及同版生成／移植工具。源码中的旧相对关系和绝对路径原样保留，后续接线必须根据路径表修改；本次没有执行这些入口。
- `src/runtime/bird/guide-sample-eefbe79/`：从 `eefbe79` 的 Git 对象原样取出的样板源和工具，只作第二步输入，不在构建草稿中引用。
- `sources/bird/poses/`：十三张原始姿态及 `bird.json`、`fly.json` 脚锚／身体中心；原生 4096×1522 图集及位置数据随第一步源保存。
- `sources/bird/prepared/`：`b613070` 被动包的 234 个对象及其来源；保留源头第一步配置、原始完整 64 页 Guide 配置和被动计划。当前 2g 首页派生输入单列 `home-packet-2g/`，不替换 `b613070` 的冻结源。
- `sources/living/home-support/`：上述首页输入实际读取的配置、样式、底图和精灵；同字节资产只保存一份。

逐文件旧路径、新路径、SHA-256 见 `migration-a3-path-map.json`；外置当前本地 2g 候选和上一版已核实线上恢复包见 `migration-a3-artifacts.json`。两个版本的完整包均未入 Git，当前候选不据此宣称已经发布。旧批次 recipe 仅登记在 `migration-a3-retired-recipes.json`，不复制。

后续接线归整合任务：将原工具的读源关系改到路径表的新位置；由 A1/A2 提供创意件和首页生成源；静态首页参考、标题缓存由正常构建产出。原 `pack_home.py`／`make_home_scene.py` 的 `--home-source` 属 D09 输入，不由 A3 新建旧首页重放链。D16 外置制品、已登记的 Node/esbuild、Pillow/NumPy/SciPy 及系统字体属于外部依赖。本轮核对文件身份和引用，未验证整站重建或视觉结果。
