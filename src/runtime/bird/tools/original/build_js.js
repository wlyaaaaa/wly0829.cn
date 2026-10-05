// 把位置数据填进 bird.src.js，出三份：
//   dist/bird.js       成品（压缩，去掉只给录像用的 _force）
//   dist/bird.full.js  成品的未压缩版（排查用）
//   work/bird.test.js  录像用（未压缩，留着 _force）
// 用法：node tools/build_js.js
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const esbuild = require('C:/Users/10979/AppData/Roaming/npm/node_modules/tsx/node_modules/esbuild');
const R = path.resolve(__dirname, '..');
const J = JSON.parse(fs.readFileSync(path.join(R, 'dist/bird-atlas.json'), 'utf8'));
const poses = {};
for (const [k, p] of Object.entries(J.poses)) poses[k] = [p.x, p.y, p.w, p.h, Math.round(p.ax), Math.round(p.ay), p.kind === 'body' ? 1 : 0];
const atlas = JSON.stringify({ image: J.image, size: J.size, standH: J.standH, body: J.bodyFromFeet.map(Math.round), poses });
const src = fs.readFileSync(path.join(R, 'src/bird.src.js'), 'utf8').replace('__ATLAS__', atlas);
const prod = src.replace(/\/\*TEST\*\/[\s\S]*?\/\*END\*\//g, '');
fs.mkdirSync(path.join(R, 'work'), { recursive: true });
fs.writeFileSync(path.join(R, 'work/bird.test.js'), src);
fs.writeFileSync(path.join(R, 'dist/bird.full.js'), prod);
const min = esbuild.transformSync(prod, { minify: true, target: 'es2017', charset: 'utf8', legalComments: 'none' }).code;
fs.writeFileSync(path.join(R, 'dist/bird.js'), min);
const kb = n => (n / 1024).toFixed(1) + ' KB';
console.log(JSON.stringify({ full: kb(Buffer.byteLength(prod)), min: kb(Buffer.byteLength(min)), min_gzip: kb(zlib.gzipSync(min, { level: 9 }).length),
  min_brotli: kb(zlib.brotliCompressSync(min).length), has_force_in_dist: min.includes('_force') }));
