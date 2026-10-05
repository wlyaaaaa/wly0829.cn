"""从成片里按格号取 8 格，裁出白天那幅画上半部分（鸟活动的地方）拼成抽格图。"""
import io, pathlib, subprocess
from PIL import Image, ImageDraw, ImageFont
R = pathlib.Path(__file__).resolve().parents[1]
MP4 = R / "bird-demo-60帧.mp4"
AT = [(0.55, "飞进来（拍翅膀）"), (1.22, "快到了：落地姿势"), (2.95, "看一眼"), (4.9, "理毛"),
      (6.27, "跳一小步（空中）"), (7.72, "被点：叫，轻轻一跳"), (9.25, "飞走（起飞）"), (11.2, "再飞进来")]
X0, Y0, PW, PH = 24, 60, 1512, 602          # 白天那幅画在录像里的位置（1.5 倍像素）
box = (int(X0 + 0.12 * PW), int(Y0), int(X0 + 0.88 * PW), int(Y0 + 0.5 * PH))
font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 24)
tiles = []
for t, lab in AT:
    n = round(t * 60)
    png = subprocess.run(["ffmpeg", "-v", "error", "-i", str(MP4), "-vf", r"select=eq(n\," + str(n) + ")", "-vframes", "1", "-f", "image2pipe", "-c:v", "png", "-"], capture_output=True, check=True).stdout
    tiles.append((t, n, lab, Image.open(io.BytesIO(png)).convert("RGB").crop(box)))
tw, th = tiles[0][3].size
board = Image.new("RGB", (tw * 2 + 10, (th + 10) * 4), "white"); d = ImageDraw.Draw(board)
for i, (t, n, lab, im) in enumerate(tiles):
    x, y = (i % 2) * (tw + 10), (i // 2) * (th + 10)
    board.paste(im, (x, y)); s = f"第 {t:g} 秒（第 {n} 格）· {lab}"; w = d.textlength(s, font=font)
    d.rectangle([x + 6, y + th - 44, x + 20 + w, y + th - 6], fill="white"); d.text((x + 13, y + th - 42), s, fill=(10, 114, 50), font=font)
board = board.resize((board.width * 2 // 3, board.height * 2 // 3), Image.LANCZOS)
board.save(R / "bird-demo-抽格.jpg", quality=90); print(R / "bird-demo-抽格.jpg", board.size)
