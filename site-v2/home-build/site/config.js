// All bounds: [left, top, width, height], percent of the full source image.
// radius: horizontal/vertical percentage of the button; matches source pixels.
window.HOME_CONFIG = {
  fx: {
    waterfall: { speed: 3, drops: 5, splash: 5 },
    fans: { speed: 3.6, glow: 40, spinUp: { from: 0.3, to: 3.6, seconds: 4 } },
    lights: { screen: 3, gpu: 12, psu: 2, ram: 12, water: 3, panel: 1, bootSeconds: 4 },
    ambient: { mist: 4, dust: 4, speed: 6.75, petals: 1, clouds: 3, sun: 2.5, bootSeconds: 4 }
  },
  links: { status: '/live/', how: '/principles/', rules: '/rules/', skills: '/skills/', projects: '/projects/' },
  buttons: [
    { id: 'status', label: '实时状态', screen: 'screen1', bounds: [5.383, 35.600, 11.244, 4.995], radius: '8.51% / 34.04%' },
    { id: 'how', label: '它如何工作', screen: 'screen1', bounds: [17.644, 35.494, 9.988, 5.207], radius: '10.18% / 34.69%' },
    { id: 'rules', label: '规则', screen: 'screen2', bounds: [5.323, 52.710, 16.866, 7.120], radius: '6.38% / 26.87%' },
    { id: 'skills', label: '技能', screen: 'screen2', bounds: [5.323, 62.062, 16.866, 7.120], radius: '6.38% / 26.87%' },
    { id: 'projects', label: '项目', screen: 'screen2', bounds: [5.323, 71.413, 16.866, 7.120], radius: '6.38% / 26.87%' }
  ],
  // 机箱右边的副屏：亮屏那张小图（images/screen1-panel-v2.webp）原位盖在画上，字和数是叠上去的活字。
  // 单位是第一屏定稿图的像素（1672×941），量自生图出的亮屏图；fx/lights.js 的 DEFAULT_GEOM.panel 是同一组数。
  screen: {
    art: [1448, 272, 1632, 706],            // 小图盖在画上的哪一块
    frame: [1452, 276.5, 1628, 702],        // 白色外框的外沿
    glass: [1461.5, 286.5, 1618.5, 690.5],  // 发光的玻璃
    edges: [286.5, 383, 478, 574, 690.5],   // 四格的上下边
    icons: [310, 411, 505, 603.5],          // 四个图标的中心在第几行（小字跟图标同高居中）
    stillFrame: [1396.2, 392.3, 1512.6, 675.8]   // 不会动的第二屏那张画里，这块屏的外框在哪（单位是那张画的像素）
  },
  // 原画里量的几处位置，只是记录，不渲染（cells、panel 是没通电时那块白板的四格）。
  regions: {
    screen1: {
      panel: [86.782, 29.437, 10.467, 45.377],
      cells: [[87.560, 30.499, 8.911, 10.840], [87.560, 41.339, 8.911, 10.733], [87.560, 52.072, 8.911, 10.733], [87.560, 62.805, 8.911, 10.840]],
      coolingDisplay: [48.026, 27.311, 15.670, 16.791],
      houseWindows: [[14.474, 70.244, 5.981, 4.995], [26.196, 70.563, 4.486, 4.357]]
    },
    screen2: {
      panel: [83.553, 41.658, 7.057, 30.287],
      cells: [[84.031, 42.508, 6.041, 7.120], [84.031, 49.628, 6.041, 7.120], [84.031, 56.748, 6.041, 7.120], [84.031, 63.868, 6.041, 7.120]],
      coolingDisplay: [57.356, 40.383, 10.108, 10.946],
      houseWindows: [[36.364, 68.544, 3.947, 3.507], [43.900, 68.757, 3.170, 3.082]]
    }
  }
};
