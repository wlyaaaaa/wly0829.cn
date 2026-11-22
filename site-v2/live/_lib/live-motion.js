(() => {
  const path = url => new URL(url).pathname.replace(/\/index\.html$/, '/').replace(/\/?$/, '/');
  const on = pseudo => document.getAnimations().filter(a => a.effect?.pseudoElement === pseudo);
  const length = a => Number(a.effect.getTiming().duration) || 0;
  const longest = list => list.reduce((best, a) => (!best || length(a) > length(best) ? a : best), null);
  addEventListener('pagereveal', ({ viewTransition: transition }) => {
    const source = window.navigation?.activation?.from?.url;
    if (!transition || !source || new URL(source).origin !== location.origin) return;
    const from = path(source), to = path(location.href);
    const chat = from === '/live/chats/' && to === '/live/chat/';
    const back = to === '/live/' && ['/live/computer/', '/live/backups/'].includes(from);
    if (!chat && !back) return;

    const root = document.documentElement;
    const speed = Number(getComputedStyle(root).getPropertyValue('--mo-speed')) || 1;
    if (back) {
      // 收回途中旧页保持实底，只在最后 80ms 软换成卡片：不留半透明重影，也不一帧硬换。
      transition.ready.then(() => {
        const old = on('::view-transition-old(root)'), move = longest(old);
        const fade = old.find(a => a !== move && a.effect.getKeyframes().some(k => 'opacity' in k));
        const soft = Math.min(length(move), 80 * speed);
        fade?.effect.updateTiming({ delay: length(move) - soft, duration: soft });
      }, () => {});
      return;
    }

    const headOf = () => document.querySelector('.page--route .route-head .card__body');
    const clear = () => { root.classList.remove('live-chat-arrival'); headOf()?.style.removeProperty('visibility'); };
    root.classList.add('live-chat-arrival');
    transition.finished.then(clear, clear);
    // 标题等纸面基本落稳（展开时间过半，减速曲线下已走完九成五以上）就顺势淡入，不等动画的长尾。
    transition.ready.then(() => {
      const grow = longest(on('::view-transition-new(root)'));
      const half = () => !grow || ['idle', 'finished'].includes(grow.playState) || (grow.currentTime || 0) >= length(grow) / 2;
      const wait = () => {
        if (!root.classList.contains('live-chat-arrival')) return;   // 过渡已结束，标题照常显示
        const head = headOf();
        if (!head || !half()) return requestAnimationFrame(wait);
        head.style.visibility = 'visible';
        head.animate([{ opacity: 0, translate: '0 8px' }, { opacity: 1, translate: '0 0' }], { duration: 280 * speed, easing: 'ease-out' });
      };
      wait();
    }, clear);
  });
})();
