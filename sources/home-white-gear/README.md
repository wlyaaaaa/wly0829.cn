# 首页白色外设与手机屏幕

这里保存局部合成后的无损输入。横版为 2880×1621，竖版为 1280×2227；四件外设采用最初白色小样的原画，手机改为内置生图制作的熄屏玻璃，只贴回原来的显示区域；横竖显示器共用原横版水彩壁纸。头像、文字、桌面、植物、窗外和小鸟的原图像素不在编辑范围内。

`mask-h/v.png` 是静态图的允许区域，`plate-mask-h/v.png` 是动效底图的允许区域，`phone-mask-h/v.png` 单独保留手机玻璃边界。边缘在区域内羽化，区域外 alpha 为零。`masks.json` 留下原图坐标；`pixel-proof.json` 区分无损输入的逐像素比较与原编码的逐字节复现。正常有损编码后的像素差不冒充无损输入的零差。

`master-h/v.png` 用于原尺寸静态图；四张 `plate-*.png` 保留原有含鸟/无鸟边界。1920 和横版 fallback 从 `native-h.png` 的 1672×941 原输入生成，竖版 fallback 从 `native-v-fallback.png` 的 941×1637 原输入生成，避免先放大整张原画又缩小。所有输入只在指定局部改动；字体与其余原图保留原来的取样链。

沿用首页与驾驶舱的现有接入入口：

```powershell
cd site-astro
python tools/retain_home_cockpit.py <候选站构建目录>
npm run build
```

接入脚本先原样复制候选站依赖，再运行 `build.py` 生成五张静态图、四张动效底图及新指纹引用；未改的资源保持原字节。AVIF、WebP 和两段 fallback 配方均沿用 `sources/signature/assets-manifest.json` 的现役参数。屏幕四角、风扇中心、机箱范围和鸟的位置保持原配置。`home_firstpaint.py` 移除手机保亮，让暗玻璃随房间夜色变化；显示器夜间亮度为白天的 0.55，灯光恒绿，警告仍以屏幕文字呈现。
