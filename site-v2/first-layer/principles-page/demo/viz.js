/* 第一屏总图、第 4 节和结尾环的动效。不开脚本、要求减少动效时，图直接显示终态。 */
(function () {
  "use strict";

  var ov = document.getElementById("viz-overview");
  if (ov && "IntersectionObserver" in window && ov.getAnimations) {
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
  }
  if ("IntersectionObserver" in window) {
    var diagrams = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.2) return;
        observer.unobserve(entry.target);
        entry.target.classList.replace("s4-ready", "s4-play");
      });
    }, { threshold: 0.2 });
    document.querySelectorAll("#viz-s04 .viz__plate, #viz-s04-walls .viz__plate").forEach(function (plate) {
      plate.classList.add("s4-ready");
      diagrams.observe(plate);
    });
  }
  var end = document.querySelector(".viz--chain-end");
  if (end && "IntersectionObserver" in window) {
    end.classList.add("is-armed");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.disconnect();
        setTimeout(function () { end.classList.remove("is-armed"); }, 700);
      });
    }, { threshold: 1, rootMargin: "0px 0px -18% 0px" });
    io.observe(end);
  }
})();
