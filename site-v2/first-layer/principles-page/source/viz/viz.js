/* 原理页的示意图各是一个文件，组装时和别的图一样改成 OSS 地址；衬底按 viewBox 先占好位，图到了页面不跳。
   第一屏总图在页头预取，其余滑到附近再取；取回来内联进衬底，图里的字才用得上页面字体和 viz.css，下面的动效也才够得着。
   慢就一直等，不设超时；真失败才隔 1、2.5、5 秒重取，和页眉 topbar.js 对图片的做法一样。
   第一屏总图、第 4 节、第 10 节压缩图和结尾环的动效，图到了、进入视野播一遍。 */
(function () {
  "use strict";

  var hooks = {};

  // 第一屏总图
  hooks["viz-overview"] = function (ov) {
    if (!("IntersectionObserver" in window) || !ov.getAnimations) return;
    ov.classList.add("ov-armed", "ov-live");
    // 绿灯呼吸对齐页眉小绿灯的相位：页眉有 lamp-breathe 就照它，没有就从页面打开算起
    var syncBreath = function () {
      var phase = document.timeline.currentTime;
      var head = document.querySelector(".brand__lamp");
      (head && head.getAnimations ? head.getAnimations() : []).forEach(function (a) {
        if (a.animationName === "lamp-breathe" && a.currentTime >= 0) phase = a.currentTime;
      });
      ov.getAnimations({ subtree: true }).forEach(function (a) {
        if (a.animationName === "ov-breathe") a.currentTime = phase % 3400;
      });
    };
    // 开场等页面自己的入场动画停稳：至少 0.6 秒，页面上还在跑的有限动画和过渡也要跑完，最多等 1.5 秒
    var settle = function (go) {
      var busy = document.getAnimations().filter(function (a) {
        var t = a.effect && a.effect.target;
        return a.playState === "running" && !(t && ov.contains(t)) && a.effect.getComputedTiming().endTime !== Infinity;
      }).map(function (a) { return a.finished.catch(function () {}); });
      var wait = Promise.all(busy.concat([new Promise(function (r) { setTimeout(r, 600); })]));
      Promise.race([wait, new Promise(function (r) { setTimeout(r, 1500); })]).then(go);
    };
    var play = function () {
      ov.classList.add("ov-play");
      // 保险：开场开始后 5 秒还没收尾（比如浏览器没跑动画），直接去掉待播，露出成品；播完了去掉也看不出差别
      setTimeout(function () { ov.classList.remove("ov-armed", "ov-play"); }, 5000);
    };
    var played = false;
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!played && en.isIntersecting && en.intersectionRatio >= 0.3) {
          played = true;
          settle(play);
        }
        ov.classList.toggle("ov-paused", !en.isIntersecting);
        if (en.isIntersecting) syncBreath();
      });
    }, { threshold: [0, 0.3] }).observe(ov);
  };

  // 第 4 节两张图：露出两成时播一遍
  var diagrams = "IntersectionObserver" in window && new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.2) return;
      observer.unobserve(entry.target);
      entry.target.classList.replace("s4-ready", "s4-play");
    });
  }, { threshold: 0.2 });
  hooks["viz-s04"] = hooks["viz-s04-walls"] = function (figure, plate) {
    if (!diagrams) return;
    plate.classList.add("s4-ready");
    diagrams.observe(plate);
  };

  // 第 10 节压缩图：图露出六成时，线从左往右画出来一遍
  hooks["viz-s10-compact"] = function (figure, compact) {
    if (!("IntersectionObserver" in window)) return;
    compact.classList.add("s10c-ready");
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting || en.intersectionRatio < 0.6) return;
        co.disconnect();
        compact.classList.replace("s10c-ready", "s10c-play");
      });
    }, { threshold: 0.6 });
    co.observe(compact);
  };

  // 结尾那串环：整串露出来后褪色
  hooks["viz-chain-end"] = function (end) {
    if (!("IntersectionObserver" in window)) return;
    end.classList.add("is-armed");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.disconnect();
        setTimeout(function () { end.classList.remove("is-armed"); }, 700);
      });
    }, { threshold: 1, rootMargin: "0px 0px -18% 0px" });
    io.observe(end);
  };

  var delays = [1000, 2500, 5000];
  // 取回图、内联进衬底，再接上这张图的动效；接动效和放进图在同一拍里，第一帧就是待播的样子
  var load = function (plate) {
    var figure = plate.parentNode, source = plate.getAttribute("data-src"), tries = 0;
    var attempt = function (url) {
      plate.setAttribute("data-viz-state", tries ? "retry" : "pending");
      fetch(url).then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.text();
      }).then(function (text) {
        plate.insertAdjacentHTML("afterbegin", text);
        plate.removeAttribute("data-viz-state");
        if (hooks[figure.id]) hooks[figure.id](figure, plate);
      }, function () {
        // 只有取图本身失败才重取；接动效出错不重取，免得同一张图放进去两遍
        if (tries >= delays.length) { plate.setAttribute("data-viz-state", "failed"); return; }
        setTimeout(function () {
          var retry = new URL(source, document.baseURI);
          retry.searchParams.set("image-retry", ++tries + "-" + Date.now());
          attempt(retry.href);
        }, delays[tries]);
      });
    };
    attempt(source);
  };

  var plates = document.querySelectorAll(".viz__plate[data-src]");
  if (!("IntersectionObserver" in window)) {
    plates.forEach(load);
    return;
  }
  // 第一张（第一屏总图，页头已预取）马上放进去；其余滑到离视口一屏左右再取
  var near = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      near.unobserve(entry.target);
      load(entry.target);
    });
  }, { rootMargin: "900px 0px" });
  plates.forEach(function (plate, i) {
    if (i === 0) load(plate);
    else near.observe(plate);
  });
})();
