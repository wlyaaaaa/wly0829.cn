(() => {
  'use strict';
  const template = document.querySelector('template[data-catalog]');
  const list = document.querySelector('.hang--small');
  const resource = template.dataset.catalog, isProjects = resource === 'projects';
  const rosters = new Map(), cards = new Map();
  let audience;

  function render() {
    const responses = [...rosters.values()];
    const items = audience === 'owner' ? responses.flatMap(r => r.items || []).filter(r => r.owner_catalog) : [];
    for (const [id, card] of cards) {
      if (!items.some(r => r.id === id)) { card.remove(); cards.delete(id); }
    }
    for (const item of items) {
      let card = cards.get(item.id);
      if (!card) {
        card = template.content.firstElementChild.cloneNode(true);
        if (isProjects) card.href = `/live/project/?id=${encodeURIComponent(item.id)}`;
        list.append(card);
        cards.set(item.id, card);
      }
      card.querySelector('.todo__name').textContent = item.name;
    }
  }

  for (const state of isProjects ? ['active', 'frozen'] : ['skills']) {
    window.Live.watch(resource, isProjects ? { state } : null, {
      data(data, meta) {
        const kind = meta.viewer?.kind;
        if (kind !== audience) { audience = kind; rosters.clear(); }
        if (data && (kind === 'public' || kind === 'owner')) rosters.set(state, data);
        else rosters.delete(state);
        render();
      },
      link(status) {
        if (status.publicPaused) { rosters.clear(); render(); }
      },
    });
  }
})();
